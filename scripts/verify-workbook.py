"""Verify native XLSX formulas and their saved values using only the Python standard library.

Generate expectations with: pnpm exec tsx scripts/workbook-input.ts .verification/workbook-spec.json
This checks saved results; it does not substitute for recalculation in a spreadsheet engine.
"""
import json
import math
import posixpath
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from zipfile import ZipFile

path = Path(sys.argv[1] if len(sys.argv) > 1 else 'public/commercial-planning.xlsx')
spec_path = Path(sys.argv[2] if len(sys.argv) > 2 else '.verification/workbook-spec.json')
specs = json.loads(spec_path.read_text(encoding='utf-8'))
ns = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
rid = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id'
checked = 0
with ZipFile(path) as z:
    strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        strings = [''.join(si.itertext()) for si in ET.fromstring(z.read('xl/sharedStrings.xml'))]
    relationships = {r.attrib['Id']: r.attrib['Target'] for r in ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))}
    names = {}
    for sheet in ET.fromstring(z.read('xl/workbook.xml')).find('m:sheets', ns):
        target = relationships[sheet.attrib[rid]]
        names[sheet.attrib['name']] = target.lstrip('/') if target.startswith('/') else posixpath.normpath('xl/' + target)
    assert set(names) == {s['name'] for s in specs}, 'Worksheet names differ'
    for spec in specs:
        root = ET.fromstring(z.read(names[spec['name']]))
        cells = {c.attrib['r']: c for c in root.findall('.//m:sheetData/m:row/m:c', ns)}
        for c in cells.values():
            assert c.attrib.get('t') != 'e', (spec['name'], c.attrib['r'], 'cached error')
        for f in spec['formulas']:
            c = cells[f['cell']]
            formula = c.find('m:f', ns)
            assert formula is not None and formula.text == f['formula'], (spec['name'], f['cell'], 'formula lost or changed')
            value = c.findtext('m:v', default='', namespaces=ns)
            if c.attrib.get('t') == 's':
                value = strings[int(value)]
            expected = f['cached']
            if isinstance(expected, (int, float)):
                assert math.isclose(float(value), expected, rel_tol=1e-9, abs_tol=1e-6), (spec['name'], f['cell'], value, expected)
            else:
                assert value == expected, (spec['name'], f['cell'], value, expected)
            checked += 1
        if spec['name'] != 'README':
            pane = root.find('m:sheetViews/m:sheetView/m:pane', ns)
            assert pane is not None and float(pane.attrib.get('ySplit', 0)) == 1, (spec['name'], 'frozen headings missing')
            assert root.find('m:autoFilter', ns) is not None or root.find('m:tableParts', ns) is not None, (spec['name'], 'filters missing')
        if spec['name'] == 'Assumptions':
            validations = root.find('m:dataValidations', ns)
            assert validations is not None and len(validations) >= 9, 'Input bounds missing'
            assert cells['B2'].attrib.get('s') != cells['B10'].attrib.get('s'), 'Editable and fixed assumptions need distinct formatting'
print(f'PASS: {len(specs)} sheets; {checked} native formulas retained; all cached results match TypeScript expectations.')
print('PASS: no cached error cells; filters, frozen headings and assumption validation retained.')
print('LIMIT: saved-result verification is not desktop Excel recalculation.')

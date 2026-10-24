import fs from 'node:fs';
import {workbookSpec} from '../lib/workbook-spec';
fs.writeFileSync(process.argv[2]??'workbook-spec.json',JSON.stringify(workbookSpec()));

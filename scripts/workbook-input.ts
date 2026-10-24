import fs from 'node:fs';
import path from 'node:path';
import {workbookSpec} from '../lib/workbook-spec';
const output=process.argv[2]??'workbook-spec.json';
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify(workbookSpec()));

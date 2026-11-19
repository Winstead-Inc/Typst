const fs = require('fs');
const sync = JSON.parse(fs.readFileSync('scratch/synctex.json', 'utf8'));
const l106 = sync.filter(e => e.line === 106 || e.end_line === 106);
const l107 = sync.filter(e => e.line === 107 || e.end_line === 107);
console.log('--- LINE 106 ---');
console.log(JSON.stringify(l106, null, 2));
console.log('--- LINE 107 ---');
console.log(JSON.stringify(l107, null, 2));

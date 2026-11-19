const fs = require('fs');
const { execSync } = require('child_process');
execSync('bin\\typst.exe compile projects/GenesisOfTheVanguard/0typ.typ scratch/test_p{p}.svg');
const svg = fs.readFileSync('scratch/test_p2.svg', 'utf8');
const lines = svg.split('\n');
console.log('SVG total lines:', lines.length);

// Find text or use elements around y = 183 or containing matrix
const matches = lines.filter(l => l.includes('183') || l.includes('196') || l.includes('matrix'));
console.log('Matches:', matches.slice(0, 10));

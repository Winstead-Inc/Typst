const fs = require('fs');
const content = fs.readFileSync('projects/GenesisOfTheVanguard/main.typ', 'utf8');
const lines = content.split('\n');

const blocks = [];
let currentType = null;
let startLine = 1;

for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i].trim();
    if (line.startsWith('=')) {
        blocks.push({ line: lineNum, type: 'heading', title: line.replace(/^=+/, '').trim() });
    } else if (line === '$' || (line.startsWith('$') && !line.slice(1).includes('$'))) {
        blocks.push({ line: lineNum, type: 'equation' });
    } else if (line.startsWith('#table(') || line.startsWith('#table (')) {
        blocks.push({ line: lineNum, type: 'table' });
    } else if (line.startsWith('#rect(') || line.startsWith('#circle(') || line.startsWith('#image(')) {
        blocks.push({ line: lineNum, type: 'shape', text: line.slice(0, 30) });
    }
}

console.log('Document semantic blocks:');
for (const b of blocks) {
    console.log(`Line ${b.line.toString().padStart(3)}: [${b.type}] ${b.title || b.text || ''}`);
}

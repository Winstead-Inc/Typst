const fs = require('fs');
const svg = fs.readFileSync('scratch/test-1.svg', 'utf8');

const fills = new Set();
const strokes = new Set();
for (const m of svg.matchAll(/\bfill="([^"]+)"/g)) {
    fills.add(m[1]);
}
for (const m of svg.matchAll(/\bstroke="([^"]+)"/g)) {
    strokes.add(m[1]);
}

console.log('Unique fills in SVG:', Array.from(fills));
console.log('Unique strokes in SVG:', Array.from(strokes));

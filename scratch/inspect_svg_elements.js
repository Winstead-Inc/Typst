const fs = require('fs');
const svg = fs.readFileSync('scratch/test-1.svg', 'utf8');

console.log('SVG length:', svg.length);
console.log('Sample tags:');
const tags = svg.match(/<[a-zA-Z0-9_\-]+[^>]*>/g) || [];
console.log('Total tags count:', tags.length);

const tagNames = {};
for (const t of tags) {
    const name = t.match(/<([a-zA-Z0-9_\-]+)/)[1];
    tagNames[name] = (tagNames[name] || 0) + 1;
}
console.log('Tag counts:', tagNames);

console.log('\nSample g tags:');
const gTags = tags.filter(t => t.startsWith('<g'));
for (const g of gTags.slice(0, 10)) {
    console.log(' ', g.slice(0, 120));
}

console.log('\nSample text or path tags:');
const textTags = tags.filter(t => t.startsWith('<text') || t.startsWith('<path') || t.startsWith('<use'));
for (const t of textTags.slice(0, 5)) {
    console.log(' ', t.slice(0, 120));
}

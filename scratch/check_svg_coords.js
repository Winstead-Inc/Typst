const fs = require('fs');
const svg = fs.readFileSync('scratch/showcase-2.svg', 'utf8');

const regex = /transform="([^"]+)"/g;
let m;
const transforms = [];
while ((m = regex.exec(svg)) !== null && transforms.length < 20) {
    transforms.push(m[1]);
}
console.log('Sample transforms:', transforms);

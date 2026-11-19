const fs = require('fs');
const svg = fs.readFileSync('scratch/showcase-2.svg', 'utf8');

// Find all elements with matrix transform around y=183.72
const regex = /<g\b[^>]*transform="matrix\(1 0 0 -1 ([-0-9.]+) ([-0-9.]+)\)"[^>]*>([\s\S]*?)<\/g>/g;
let m;
while ((m = regex.exec(svg)) !== null) {
    const x = parseFloat(m[1]);
    const y = parseFloat(m[2]);
    if (Math.abs(y - 183.72) < 20 && x >= 180 && x <= 320) {
        // Find use xlink:href or href
        const hrefMatch = m[3].match(/href="([^"]+)"/);
        console.log(`x=${x.toFixed(2)}, y=${y.toFixed(2)}, glyph=${hrefMatch ? hrefMatch[1] : 'none'}`);
    }
}

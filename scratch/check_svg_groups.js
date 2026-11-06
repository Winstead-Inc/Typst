const fs = require('fs');
const svg = fs.readFileSync('scratch/test_mat_svg/page-1.svg', 'utf-8');
const gRegex = /<g transform="matrix\(1 0 0 -1 ([^ ]+) ([^)]+)\)">([\s\S]*?)<\/g>/g;
let m;
while
(
    (m = gRegex.exec(svg)) !== null
)
{
    const uses = [...m[3].matchAll(/<use[^>]*x="([^"]*)"/g)].map
    (
        u => parseFloat(u[1])
    );
    console.log('tx:', m[1], 'ty:', m[2], 'uses count:', uses.length, 'use x values:', uses);
}

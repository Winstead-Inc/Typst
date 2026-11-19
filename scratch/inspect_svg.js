const fs = require('fs');

function inspectSvg(path) {
    const s = fs.readFileSync(path, 'utf8');
    const re = /<(path|rect|use|g|text)[^>]*fill="([^"]+)"[^>]*>/g;
    let m;
    const fills = new Set();
    const elements = [];
    while ((m = re.exec(s)) !== null) {
        fills.add(m[2]);
        if (elements.length < 25) {
            elements.push({ tag: m[1], fill: m[2], snippet: m[0].slice(0, 100) });
        }
    }
    console.log('Unique fills in ' + path + ':', Array.from(fills));
    console.log('First elements:', elements);
}

inspectSvg('E:/Typst/scratch/showcase-3.svg');
inspectSvg('E:/Typst/scratch/showcase-4.svg');

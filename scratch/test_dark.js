const fs = require('fs');
const vm = require('vm');

const appJs = fs.readFileSync('E:/Typst/TypstStudio/public/App.js', 'utf8');

const sandbox = { 
    console, Map, Math, parseInt, parseFloat, isNaN,
    FastHash: (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return String(hash);
    }
};

const startIdx = appJs.indexOf('const InvertShapeColorCache');
const endIdx = appJs.indexOf('function RenderPages', startIdx);
const code = appJs.slice(startIdx, endIdx);

vm.createContext(sandbox);
vm.runInContext(code, sandbox);

const svg3 = fs.readFileSync('E:/Typst/scratch/showcase-3.svg', 'utf8');
const dark3 = sandbox.ConvertSvgToDarkMode(svg3);

const re = /<([^>]+(e4e9f0|fafafa|f1f3f6|f9fafb|42474e|222222|212223|202327|2a2d32|303235)[^>]*)>/gi;
let m;
console.log('Matches in dark3:');
while ((m = re.exec(dark3)) !== null) {
    console.log(m[0]);
}

const svg4 = fs.readFileSync('E:/Typst/scratch/showcase-4.svg', 'utf8');
const dark4 = sandbox.ConvertSvgToDarkMode(svg4);
console.log('Matches in dark4:');
while ((m = re.exec(dark4)) !== null) {
    console.log(m[0]);
}

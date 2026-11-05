const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const samplePath = path.resolve('projects/GenesisOfTheVanguard/main.typ');
const sampleCode = fs.readFileSync(samplePath, 'utf8');
const typstBin = path.resolve('TypstStudio/bin/typst.exe');
console.log('Binary exists:', fs.existsSync(typstBin));

// Test 1: Direct CLI file compile
const t0 = Date.now();
const res1 = spawnSync(typstBin, ['compile', '--format', 'svg', samplePath, 'scratch/bench-{n}.svg'], { stdio: 'pipe' });
const t1 = Date.now();
console.log('Test 1: Direct CLI compile time:', t1 - t0, 'ms', 'Status:', res1.status);

// Test 2: Direct CLI stdin compile
const t2 = Date.now();
const res2 = spawnSync(typstBin, ['compile', '--format', 'svg', '-', 'scratch/bench-stdin-{n}.svg'], {
    input: sampleCode,
    stdio: 'pipe'
});
const t3 = Date.now();
console.log('Test 2: Direct CLI stdin compile time:', t3 - t2, 'ms', 'Status:', res2.status);

// Clean up
const scratchFiles = fs.readdirSync('scratch');
for (const f of scratchFiles) {
    if (f.startsWith('bench-')) {
        fs.unlinkSync(path.join('scratch', f));
    }
}


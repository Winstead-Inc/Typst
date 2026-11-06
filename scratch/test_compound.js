const fs = require('fs');
let code = fs.readFileSync('scratch/test_knr_vectors.js', 'utf-8');
code +=
`console.log("\\n=== Test 7: Compound Container Grouping [{( ... )}] (legal LAFS) ===");
const test7 = [
    "table.cell",
    "[{(",
    '  "SecurityModule",',
    '  "DatabaseDriver"',
    ")}]"
].join("\\n");
console.log("Errors:", DetectKnrSlop(test7));
`;
fs.writeFileSync('scratch/test_knr_vectors.js', code, 'utf-8');

const { execFileSync }
= require('child_process');
// Add test 5 to test_knr_vectors.js
const fs = require('fs');
let code = fs.readFileSync('scratch/test_knr_vectors.js', 'utf-8');
code +=
`console.log("\\n=== Test 5: K&R Slop in Math (opening with proceeding content) ===");
const test5 = [
    "$",
    "  mat",
    "  ( 1, 2;",
    "    3, 4",
    "  )",
    "$"
].join("\\n");
console.log("Errors:", DetectKnrSlop(test5));

console.log("\\n=== Test 6: K&R Slop in Code (#set text(font: ...) multiline) ===");
const test6 = [
    "#set text(",
    "    font: \\"Liberation Sans\\",",
    "    size: 11pt",
    ")"
].join("\\n");
console.log("Errors:", DetectKnrSlop(test6));
`;
fs.writeFileSync('scratch/test_knr_vectors.js', code, 'utf-8');

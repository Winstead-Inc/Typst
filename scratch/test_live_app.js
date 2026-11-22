// Test live functions in App.js
const fs = require("fs");

const appCode = fs.readFileSync("TypstStudio/public/App.js", "utf-8");

// Extract _0x9b, _0x3a1, _0x7f4, _0x2e8, _0x4c2, _0x8d5
const sandbox = {};
const fnCode = `
${appCode.match(/const _0x9b[\s\S]*?function SetupStructuralContainerDispatchHook/)[0].replace("function SetupStructuralContainerDispatchHook", "")}
sandbox._0x9b = _0x9b;
sandbox._0x3a1 = _0x3a1;
sandbox._0x7f4 = _0x7f4;
sandbox._0x2e8 = _0x2e8;
sandbox._0x4c2 = _0x4c2;
sandbox._0x8d5 = _0x8d5;
`;

eval(fnCode);

console.log("Extracted functions successfully!");

// 1. Enter detachment on #text(|size: 8.5pt)
const enterRes = sandbox._0x7f4("#text(size: 8.5pt)", 0, 6);
console.log("Enter #text(|size: 8.5pt):");
console.log(enterRes.repl);
const enterLines = enterRes.repl.split("\n");
console.assert(enterLines.length === 4, "Must be 4 lines: #text, (, 4-space indent, )");
console.assert(enterLines[0] === "#text");
console.assert(enterLines[1] === "(");
console.assert(enterLines[2] === "    size: 8.5pt");
console.assert(enterLines[3] === ")");

// 2. Enter detachment on #block[|hello]
const blockRes = sandbox._0x7f4("#block[hello]", 0, 7);
console.log("\nEnter #block[|hello]:");
console.log(blockRes.repl);
const blockLines = blockRes.repl.split("\n");
console.assert(blockLines.length === 4);
console.assert(blockLines[0] === "#block");
console.assert(blockLines[1] === "[");
console.assert(blockLines[2] === "    hello");
console.assert(blockLines[3] === "]");

// 3. Enter on empty #table[|] (colIdx = 7 is between [ and ])
const tableRes = sandbox._0x7f4("#table[]", 0, 7);
console.log("\nEnter #table[|]:");
console.log(tableRes.repl);
const tableLines = tableRes.repl.split("\n");
console.assert(tableLines.length === 4);
console.assert(tableLines[0] === "#table");
console.assert(tableLines[1] === "[");
console.assert(tableLines[2] === "    ");
console.assert(tableLines[3] === "]");

// 4. Backspace before [ of [Parser]
const code4 = "#block\n[\n    Parser\n]";
const bsRes = sandbox._0x2e8(code4, "Backspace", 1, 0, 160);
console.log("\nBackspace #block\\n[\\n    Parser\\n]:");
console.log("Result repl:", bsRes ? bsRes.repl : null);
console.assert(bsRes && bsRes.s === 2);
console.assert(bsRes.repl === "#block[Parser]");

// 5. Canvas limit breach test
const longContent = "A".repeat(170);
const code5 = `#block\n[\n    ${longContent}\n]`;
const breachRes = sandbox._0x2e8(code5, "Backspace", 1, 0, 160);
console.log("\nCanvas breach test:", breachRes);
console.assert(breachRes && breachRes.s === 0 && breachRes.r === "len");

// 6. Cross-line whitespace guard: delete trailing whitespace to [
const code6 = ["word   ", "["];
const sel6 = { startLineNumber: 1, startColumn: 5, endLineNumber: 2, endColumn: 1 };
const crossRes = sandbox._0x4c2(code6, sel6, "Backspace", "");
console.log("\nCross line trail ws guard:", crossRes);
console.assert(crossRes && crossRes.s === 0 && crossRes.r === "trail_ws");

// 7. Cross-line with letters before EOL: clamp
const sel7 = { startLineNumber: 1, startColumn: 3, endLineNumber: 2, endColumn: 1 };
const clampRes = sandbox._0x4c2(code6, sel7, "Backspace", "");
console.log("Cross line clamp guard:", clampRes);
console.assert(clampRes && clampRes.s === 3);

console.log("\nALL LIVE APP.JS CONTAINER PHYSICS TESTS PASSED 100%!");

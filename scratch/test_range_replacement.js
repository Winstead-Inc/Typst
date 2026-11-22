// scratch/test_range_replacement.js
const { _0x7f4, _0x2e8 } = (function() {
    eval(require("fs").readFileSync("scratch/test_obfuscated_module.js", "utf8").replace("Running Obfuscated Module Validation...", ""));
    return { _0x7f4, _0x2e8 };
})();

// Test range for Enter
const textA = "line0\n#table[]\nline2";
const resA = _0x7f4(textA, 1, 7);
console.log("resA:", resA);

// Test range for Backspace
const textB = "line0\n#block\n[Parser]\nline3";
const resB = _0x2e8(textB, "Backspace", 2, 0, 160);
console.log("resB:", resB);

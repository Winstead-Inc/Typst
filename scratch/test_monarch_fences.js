const fs = require("fs");
const path = require("path");

const monarchDef = {
    keywords: [
        "let", "set", "show", "context", "if", "else", "while",
        "for", "in", "return", "import", "include", "as", "break", "continue"
    ],
    constants: ["none", "auto", "true", "false"],
    builtins: [
        "align", "text", "par", "page", "v", "h", "grid", "table",
        "image", "heading", "list", "enum", "rect", "circle",
        "calc", "counter", "line", "pagebreak", "columns",
        "box", "block", "stack", "place", "move", "rotate", "scale", "hide", "repeat",
        "path", "polygon", "curve", "link", "outline", "bibliography", "cite",
        "figure", "caption", "footnote", "quote", "raw", "state", "query", "locate",
        "measure", "layout", "datetime", "regex", "bytes", "duration", "version",
        "type", "repr", "str", "int", "float", "array", "dictionary", "arguments",
        "rgb", "cmyk", "luma", "color", "gradient", "pattern", "stroke", "vec", "mat",
        "std", "panic", "assert"
    ],
    tokenizer: {
        root: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/`{3,}[a-zA-Z0-9_\-+]*\s*/, "markup.raw.block", "@rawblock"],
            [/`[^`\n]*`/, "markup.raw.inline"],
            [/^(\s*=+)(.*)$/, ["keyword.heading", "markup.heading.text"]],
            [/<[a-zA-Z0-9_\-:]+>/, "entity.name.label"],
            [/@[a-zA-Z0-9_\-:]+/, "entity.name.reference"],
            [/\*([^*]+)\*/, "markup.bold"],
            [/_([^_]+)_/, "markup.italic"],
            [/\\([#$*_\-\\@[\]{}])/, "constant.character.escape"],
            [/\\$/, "constant.character.escape"],
            [/^\s*[-+]\s+/, "punctuation.list"],
            [/^\s*\d+\.\s+/, "punctuation.list"],
            [/\[\s*[\(\)\{\}\[\]\.,:;\\` ]+\s*\]/, "markup.content.literal"],
            [/\$/, "string.math", "@mathmode"],
            [/#([a-zA-Z_][a-zA-Z0-9_-]*)/, { cases: { "@keywords": "keyword", "@constants": "constant.language", "@builtins": "type.identifier", "@default": "type.identifier" } }],
            [/#/, "keyword", "@codemode"],
            [/"([^"\\]|\\.)*"/, "string"],
            [/[{}()\[\]]/, "@brackets"],
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, ""],
            [/./, ""]
        ],
        codemode: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/`{3,}[a-zA-Z0-9_\-+]*\s*/, "markup.raw.block", "@rawblock"],
            [/`[^`\n]*`/, "markup.raw.inline"],
            [/\{/, "@brackets", "@push"],
            [/\}/, "@brackets", "@pop"],
            [/\[/, "@brackets", "@markupmode"],
            [/"([^"\\]|\\.)*"/, "string"],
            [/\d+(\.\d+)?(pt|in|cm|mm|em|fr|%|deg|rad)?/, "number"],
            [/([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=:)/, "variable.parameter"],
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, { cases: { "@keywords": "keyword", "@constants": "constant.language", "@builtins": "type.identifier", "@default": "identifier" } }],
            [/=>|==|!=|<=|>=|\.\.|\+=|-=|\*=|\/=|&&|\|\||[+\-*/=<>!&|~]/, "operator"],
            [/[()]/, "@brackets"],
            [/[,;:]/, "delimiter"],
            [/\s+/, ""]
        ],
        markupmode: [
            [/\[/, "@brackets", "@push"],
            [/\]/, "@brackets", "@pop"],
            { include: "root" }
        ],
        mathmode: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/\$/, "string.math", "@pop"],
            [/#([a-zA-Z_][a-zA-Z0-9_-]*)/, { cases: { "@keywords": "keyword", "@builtins": "type.identifier", "@default": "type.identifier" } }],
            [/"([^"\\]|\\.)*"/, "string"],
            [/([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=\()/, "type.identifier"],
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, "string.math"],
            [/\d+(\.\d+)?/, "number"],
            [/[+\-*/=<>!&|~^_]/, "operator"],
            [/[()\[\]{}]/, "@brackets"],
            [/[,;]/, "delimiter"],
            [/\\./, "constant.character.escape"],
            [/\s+/, "string.math"]
        ],
        comment: [
            [/[^\/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"]
        ],
        rawblock: [
            [/`{3,}/, "markup.raw.block", "@pop"],
            [/[^`]+/, "markup.raw.block"],
            [/`/, "markup.raw.block"]
        ]
    }
};

function tokenize(inputLines) {
    let stateStack = ["root"];
    const results = [];

    for (let lineIndex = 0; lineIndex < inputLines.length; lineIndex++) {
        const line = inputLines[lineIndex];
        let pos = 0;
        const lineTokens = [];
        
        while (pos < line.length) {
            const currentState = stateStack[stateStack.length - 1];
            let rules = monarchDef.tokenizer[currentState];
            if (currentState === "markupmode") {
                rules = [
                    [/\[/, "@brackets", "@push"],
                    [/\]/, "@brackets", "@pop"],
                    ...monarchDef.tokenizer.root
                ];
            }
            
            const slice = line.slice(pos);
            let matched = false;

            for (const rule of rules) {
                if (rule.include) continue;
                const regex = rule[0];
                const action = rule[1];
                const next = rule[2];

                const m = slice.match(new RegExp(`^(?:${regex.source})`));
                if (m) {
                    matched = true;
                    const matchedStr = m[0];
                    lineTokens.push({
                        str: matchedStr,
                        token: typeof action === "string" ? action : JSON.stringify(action),
                        state: currentState
                    });
                    pos += matchedStr.length;

                    if (next) {
                        if (next === "@pop") {
                            stateStack.pop();
                        } else if (next === "@push") {
                            stateStack.push(currentState);
                        } else if (next.startsWith("@")) {
                            stateStack.push(next.slice(1));
                        }
                    }
                    break;
                }
            }

            if (!matched) {
                lineTokens.push({ str: line[pos], token: "UNMATCHED", state: currentState });
                pos++;
            }
        }
        results.push({ lineIndex: lineIndex + 1, line, tokens: lineTokens, stateAfter: stateStack[stateStack.length - 1], stack: [...stateStack] });
    }
    return results;
}

// Test case 1: Triple-backtick fences with single backticks nearby
const testSnippet = [
    "Here is `initial inline raw` code.",
    "```example",
    ">>> #set page(numbering: \"1\")",
    "This is inside a raw block with `some nested ticks`.",
    "```",
    "Prose text after fence should NOT be raw block! Here is `inline raw 2` in prose.",
    "Another prose line: check `\"1\"` and `\"i\"` numerals.",
    "````typst",
    "fn test() { return `4-tick`; }",
    "````",
    "Final prose text with `inline`."
];

console.log("=== Running Test Case 1: Fences with Single Backticks Nearby ===");
const res1 = tokenize(testSnippet);
let allPass = true;
for (const r of res1) {
    console.log(`L${r.lineIndex} [state=${r.stateAfter}] tokens=${r.tokens.map(t => `${t.str}(${t.token})`).join(" ")}`);
}

// Assertions:
// Line 1: state is root, contains markup.raw.inline
if (res1[0].stateAfter !== "root") { console.error("FAIL: Line 1 state is not root"); allPass = false; }
// Line 2: opens rawblock
if (res1[1].stateAfter !== "rawblock") { console.error("FAIL: Line 2 did not enter rawblock"); allPass = false; }
// Line 4: inside rawblock
if (res1[3].stateAfter !== "rawblock") { console.error("FAIL: Line 4 is not in rawblock"); allPass = false; }
// Line 5: closing fence pops to root
if (res1[4].stateAfter !== "root") { console.error("FAIL: Line 5 did not pop to root"); allPass = false; }
// Line 6: prose line must be in root, NOT rawblock
if (res1[5].stateAfter !== "root") { console.error("FAIL: Line 6 is in " + res1[5].stateAfter); allPass = false; }
const l6ProseToken = res1[5].tokens.find(t => t.str.startsWith("Prose text"));
if (l6ProseToken && l6ProseToken.token.includes("raw")) { console.error("FAIL: Prose text was marked as raw!"); allPass = false; }
// Line 8: 4-tick fence opens rawblock
if (res1[7].stateAfter !== "rawblock") { console.error("FAIL: Line 8 did not enter rawblock"); allPass = false; }
// Line 10: 4-tick fence closes rawblock to root
if (res1[9].stateAfter !== "root") { console.error("FAIL: Line 10 did not pop to root"); allPass = false; }
// Line 11: Final prose line in root
if (res1[10].stateAfter !== "root") { console.error("FAIL: Line 11 is not root"); allPass = false; }

if (allPass) {
    console.log(">>> TEST CASE 1 PASSED 100% <<<");
} else {
    process.exit(1);
}

// Test Case 2: Full page-setup.typ validation
const pageSetup = fs.readFileSync(path.join(__dirname, "../docs/content/guides/page-setup.typ"), "utf8");
const pageSetupLines = pageSetup.split(/\r?\n/);
const res2 = tokenize(pageSetupLines);

console.log("\n=== Running Test Case 2: Full docs/content/guides/page-setup.typ ===");
// Verify lines 163-195 specifically
console.log(`L163: [stateAfter=${res2[162].stateAfter}] line=${pageSetupLines[162]}`);
console.log(`L168: [stateAfter=${res2[167].stateAfter}] line=${pageSetupLines[167]}`);
console.log(`L170: [stateAfter=${res2[169].stateAfter}] line=${pageSetupLines[169].slice(0, 50)}...`);
console.log(`L172: [stateAfter=${res2[171].stateAfter}] line=${pageSetupLines[171]}`);
console.log(`L177: [stateAfter=${res2[176].stateAfter}] line=${pageSetupLines[176]}`);
console.log(`L181: [stateAfter=${res2[180].stateAfter}] line=${pageSetupLines[180]}`);
console.log(`L186: [stateAfter=${res2[185].stateAfter}] line=${pageSetupLines[185]}`);
console.log(`L188: [stateAfter=${res2[187].stateAfter}] line=${pageSetupLines[187].slice(0, 50)}...`);
console.log(`L190: [stateAfter=${res2[189].stateAfter}] line=${pageSetupLines[189].slice(0, 50)}...`);
console.log(`L193: [stateAfter=${res2[192].stateAfter}] line=${pageSetupLines[192].slice(0, 50)}...`);
console.log(`L195: [stateAfter=${res2[194].stateAfter}] line=${pageSetupLines[194]}`);

// Assertions on page-setup.typ
if (res2[167].stateAfter !== "root") {
    console.error("FAIL: Line 168 did not pop to root!");
    process.exit(1);
}
if (res2[169].stateAfter !== "root") {
    console.error("FAIL: Line 170 prose is not in root!");
    process.exit(1);
}
if (res2[176].stateAfter !== "root") {
    console.error("FAIL: Line 177 did not pop to root!");
    process.exit(1);
}
if (res2[185].stateAfter !== "root") {
    console.error("FAIL: Line 186 did not pop to root!");
    process.exit(1);
}
if (res2[187].stateAfter !== "root") {
    console.error("FAIL: Line 188 prose is not in root!");
    process.exit(1);
}
if (res2[189].stateAfter !== "root") {
    console.error("FAIL: Line 190 prose is not in root!");
    process.exit(1);
}
if (res2[192].stateAfter !== "root") {
    console.error("FAIL: Line 193 prose is not in root!");
    process.exit(1);
}

console.log(">>> TEST CASE 2 (page-setup.typ) PASSED 100% <<<");

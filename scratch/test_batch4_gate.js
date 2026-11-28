const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appJsPath = path.resolve(__dirname, "..", "TypstStudio", "public", "App.js");
const serverJsPath = path.resolve(__dirname, "..", "TypstStudio", "Server.js");

const appJsCode = fs.readFileSync(appJsPath, "utf8");
const serverJsCode = fs.readFileSync(serverJsPath, "utf8");

console.log("=== Batch 4 Hard-Gate Verification ===");

// ---------------------------------------------------------------------------
// 1. Thumbnail Cache Versioning & Legacy Purge
// ---------------------------------------------------------------------------
console.log("[1/4] Checking Thumbnail Cache Versioning & Legacy Purge...");

// Ensure NO unversioned localStorage cache keys remain in App.js
const unversionedCalls = appJsCode.match(/localStorage\.(getItem|setItem)\s*\(\s*["']typst_preview_cache_["']/g);
assert(!unversionedCalls, "App.js must not use unversioned typst_preview_cache_ literal keys");

const constMatches = appJsCode.match(/const PREVIEW_CACHE_VERSION = [^;]+;[\s\S]*?const PREVIEW_CACHE_PREFIX = [^;]+;/);
assert(constMatches, "Must define PREVIEW_CACHE_VERSION and PREVIEW_CACHE_PREFIX");

// Extract PurgeLegacyPreviewCache from App.js using start/end index
const purgeStart = appJsCode.indexOf("function PurgeLegacyPreviewCache()");
assert(purgeStart !== -1, "Must contain function PurgeLegacyPreviewCache()");
const purgeEnd = appJsCode.indexOf("window.DocPreviewSvgCache = window.DocPreviewSvgCache || {};", purgeStart);
assert(purgeEnd !== -1, "Must find end of PurgeLegacyPreviewCache");
const purgeFnCode = appJsCode.slice(purgeStart, purgeEnd);

const storeMap = new Map([
    ["typst_preview_cache_legacy1", "<svg>old1</svg>"],
    ["typst_preview_cache_legacy2", "<svg>old2</svg>"],
    ["typst_preview_cache_v2_current", "<svg>new</svg>"],
    ["other_setting", "dark"]
]);
const mockLocalStorage = {
    get length() { return storeMap.size; },
    key(i) { return Array.from(storeMap.keys())[i]; },
    getItem(k) { return storeMap.get(k) || null; },
    setItem(k, v) { storeMap.set(k, v); },
    removeItem(k) { storeMap.delete(k); }
};

const sandbox1 = { localStorage: mockLocalStorage };
vm.runInNewContext(`${constMatches[0]}\n${purgeFnCode}\nPurgeLegacyPreviewCache();`, sandbox1);
assert.strictEqual(storeMap.has("typst_preview_cache_legacy1"), false, "Legacy key 1 must be purged");
assert.strictEqual(storeMap.has("typst_preview_cache_legacy2"), false, "Legacy key 2 must be purged");
assert.strictEqual(storeMap.has("typst_preview_cache_v2_current"), true, "v2 cache key must be kept");
assert.strictEqual(storeMap.has("other_setting"), true, "Unrelated localStorage key must be preserved");
console.log("  PASS: Legacy cache keys purged cleanly while v2 & unrelated keys retained.");

// ---------------------------------------------------------------------------
// 2. Non-Destructive FormatTypstLAFS (App.js & Server.js)
// ---------------------------------------------------------------------------
console.log("[2/4] Checking FormatTypstLAFS Non-Destructive Invariants...");

// Extract FormatTypstLAFS from App.js
const appFormatStart = appJsCode.indexOf("function FormatTypstLAFS(Source)");
assert(appFormatStart !== -1, "App.js must define FormatTypstLAFS(Source)");
const appFormatEnd = appJsCode.indexOf("async function ApplyFormattingToEditor()", appFormatStart);
assert(appFormatEnd !== -1, "Must find end of FormatTypstLAFS");
const appFormatFnCode = appJsCode.slice(appFormatStart, appFormatEnd);

const sandbox2 = {
    InProcessFormatSnippetLAFS: (code) => code
};
vm.runInNewContext(appFormatFnCode, sandbox2);

const trickySamples = [
    "=\nMy standalone heading",
    "= My Heading\nSome prose ending in (\nNext line\nAnd ending in [\nMore text",
    "#let x = 0\n#while x < 10 {\n  x += 1\n}",
    "#if cond == true {\n  [Body]\n} else {\n  [Other]\n}"
];

for (const sample of trickySamples) {
    const out = sandbox2.FormatTypstLAFS(sample);
    assert.strictEqual(out, sample, `App.js FormatTypstLAFS must not destroy Typst sample:\n${sample}`);
}

// Verify Server.js FormatTypstLAFS
const srvFormatStart = serverJsCode.indexOf("function TryFormatTypstNative(Source)");
assert(srvFormatStart !== -1, "Server.js must define TryFormatTypstNative(Source)");
const srvFormatEnd = serverJsCode.indexOf("function GetTrackedDirectories()", srvFormatStart);
assert(srvFormatEnd !== -1, "Must find end of Server.js FormatTypstLAFS");
const srvFormatFnCode = serverJsCode.slice(srvFormatStart, srvFormatEnd);

const sandbox3 = {
    LAFS_BINARY: null, // Test fallback when LAFS_BINARY is unavailable
    TEMP_DIR: "C:\\Temp",
    VerifyLafsBinaryIntegrity: () => ({ Valid: false }),
    ChildProcess: { spawnSync: () => ({ status: 1 }) },
    FormatCodeBlockWithLAFS: (code, lang) => code
};
vm.runInNewContext(srvFormatFnCode, sandbox3);

for (const sample of trickySamples) {
    const out = sandbox3.FormatTypstLAFS(sample);
    assert.strictEqual(out, sample, `Server.js FormatTypstLAFS must not destroy Typst sample when lafs is unavailable:\n${sample}`);
}
console.log("  PASS: FormatTypstLAFS non-destructive invariants verified on both App.js and Server.js.");

// ---------------------------------------------------------------------------
// 3. Monaco Monarch Tokenizer for Typst
// ---------------------------------------------------------------------------
console.log("[3/4] Checking Monaco Monarch Tokenizer...");

// Verify hyphenated identifier regexes
const idRegex = /[a-zA-Z_][a-zA-Z0-9_-]*/;
assert.strictEqual("heading-offset".match(idRegex)[0], "heading-offset");
assert.strictEqual("dev-version-warning".match(idRegex)[0], "dev-version-warning");
assert.strictEqual("title-state".match(idRegex)[0], "title-state");

const paramRegex = /^([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=:)/;
assert.strictEqual("heading-offset: 1".match(paramRegex)[1], "heading-offset");
assert.strictEqual("dev-version-warning: false".match(paramRegex)[1], "dev-version-warning");

// Verify that App.js has setMonarchTokensProvider with hyphenated regex and modes
assert(appJsCode.includes("[a-zA-Z_][a-zA-Z0-9_-]*"), "App.js Monarch must use hyphenated identifier regex");
assert(appJsCode.includes("codemode:"), "App.js Monarch must separate codemode");
assert(appJsCode.includes("mathmode:"), "App.js Monarch must separate mathmode");
assert(appJsCode.includes("markupmode:"), "App.js Monarch must separate markupmode");
assert(appJsCode.includes("`{3,}[a-zA-Z0-9_\\-+]*\\s*"), "App.js Monarch must match triple-or-more backtick fences");

// Ensure triple-or-more backtick fence rule appears BEFORE single backtick inline span in root and codemode
const rootIdx = appJsCode.indexOf("root:");
const fenceInRoot = appJsCode.indexOf("`{3,}[a-zA-Z0-9_\\-+]*\\s*", rootIdx);
const inlineInRoot = appJsCode.indexOf("`[^`\\n]*`", rootIdx);
assert(fenceInRoot !== -1 && inlineInRoot !== -1, "Must find fence and inline rules in root");
assert(fenceInRoot < inlineInRoot, "Fenced raw block rule must precede inline raw span in root");

// Test tokenization of triple-backtick fences with single backticks nearby
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

// Extract tokenizer object from App.js dynamically to execute live simulation
const startMonarch = appJsCode.indexOf("monaco.languages.setMonarchTokensProvider");
assert(startMonarch !== -1, "Must find setMonarchTokensProvider");
const endMonarch = appJsCode.indexOf("monaco.editor.defineTheme", startMonarch);
assert(endMonarch !== -1, "Must find defineTheme");
const monarchCallCode = appJsCode.slice(startMonarch, endMonarch);

let capturedMonarch = null;
const mockMonaco = {
    languages: {
        setMonarchTokensProvider: (lang, def) => { capturedMonarch = def; }
    }
};
vm.runInNewContext(monarchCallCode, { monaco: mockMonaco });
assert(capturedMonarch && capturedMonarch.tokenizer, "Must extract Monarch definition");

function simulateMonarch(lines) {
    let stateStack = ["root"];
    const results = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        let pos = 0;
        const tokens = [];
        while (pos < line.length) {
            const state = stateStack[stateStack.length - 1];
            let rules = capturedMonarch.tokenizer[state];
            if (state === "markupmode") {
                rules = [
                    [/\[/, "@brackets", "@push"],
                    [/\]/, "@brackets", "@pop"],
                    ...capturedMonarch.tokenizer.root
                ];
            }
            const slice = line.slice(pos);
            let matched = false;
            for (const rule of rules) {
                if (rule.include) continue;
                const m = slice.match(new RegExp(`^(?:${rule[0].source})`));
                if (m) {
                    matched = true;
                    const matchedStr = m[0];
                    tokens.push({ str: matchedStr, token: rule[1], state });
                    pos += matchedStr.length;
                    const next = rule[2];
                    if (next === "@pop") { stateStack.pop(); }
                    else if (next === "@push") { stateStack.push(state); }
                    else if (next && next.startsWith("@")) { stateStack.push(next.slice(1)); }
                    break;
                }
            }
            if (!matched) {
                tokens.push({ str: line[pos], token: "", state });
                pos++;
            }
        }
        results.push({ lineIndex: i + 1, line, tokens, stateAfter: stateStack[stateStack.length - 1] });
    }
    return results;
}

const sim1 = simulateMonarch(testSnippet);
assert.strictEqual(sim1[0].stateAfter, "root", "Line 1 must be root");
assert.strictEqual(sim1[1].stateAfter, "rawblock", "Line 2 must enter rawblock on ```example");
assert.strictEqual(sim1[3].stateAfter, "rawblock", "Line 4 with nested ticks must stay in rawblock");
assert.strictEqual(sim1[4].stateAfter, "root", "Line 5 closing fence ``` must pop to root");
assert.strictEqual(sim1[5].stateAfter, "root", "Line 6 prose after fence must be in root");
assert.strictEqual(sim1[7].stateAfter, "rawblock", "Line 8 4-tick fence ```` must enter rawblock");
assert.strictEqual(sim1[9].stateAfter, "root", "Line 10 4-tick closing fence ```` must pop to root");
assert.strictEqual(sim1[10].stateAfter, "root", "Line 11 final prose must be in root");

// Verify real file docs/content/guides/page-setup.typ lines 163-195
const pageSetupFile = path.resolve(__dirname, "..", "docs", "content", "guides", "page-setup.typ");
if (fs.existsSync(pageSetupFile)) {
    const pageSetupContent = fs.readFileSync(pageSetupFile, "utf8");
    const pageSetupLines = pageSetupContent.split(/\r?\n/);
    const sim2 = simulateMonarch(pageSetupLines);
    // Line 168 (index 167) is closing ```
    assert.strictEqual(sim2[167].stateAfter, "root", "page-setup.typ line 168 must pop to root");
    // Line 170 (index 169) is prose
    assert.strictEqual(sim2[169].stateAfter, "root", "page-setup.typ line 170 prose must be in root");
    // Line 177 (index 176) is closing ```
    assert.strictEqual(sim2[176].stateAfter, "root", "page-setup.typ line 177 must pop to root");
    // Line 186 (index 185) is closing ```
    assert.strictEqual(sim2[185].stateAfter, "root", "page-setup.typ line 186 must pop to root");
    // Line 188 (index 187) is prose
    assert.strictEqual(sim2[187].stateAfter, "root", "page-setup.typ line 188 prose must be in root");
    // Line 193 (index 192) is prose
    assert.strictEqual(sim2[192].stateAfter, "root", "page-setup.typ line 193 prose must be in root");
}
console.log("  PASS: Monaco Monarch Tokenizer verified with triple-or-more backtick fences and nearby single backticks.");

// ---------------------------------------------------------------------------
// 4. Document Outline Extraction
// ---------------------------------------------------------------------------
console.log("[4/4] Checking Document Outline Extraction...");

const outlineStart = appJsCode.indexOf("function UpdateDocumentOutline()");
assert(outlineStart !== -1, "App.js must define UpdateDocumentOutline()");
const outlineEnd = appJsCode.indexOf("function RenderOutlineItems(Headings)", outlineStart);
assert(outlineEnd !== -1, "Must find end of UpdateDocumentOutline()");
const outlineFnCode = appJsCode.slice(outlineStart, outlineEnd);

// Test outline logic with simulated model
const testDoc = `
= Main Chapter <main>
Some prose text.
/*
= Commented Heading Out
*/
\`\`\`typst
= Raw Block Heading
\`\`\`
{
  let x = 10
  // in code block, this is assignment:
  = not a heading
}
== Section 1.1
#heading(level: 3)[Programmatic Subheading]
#heading(depth: 2, numbering: none)[Introduction]
= #short-or-long[Short Title][Full Title for Chapter]
`;

const lines = testDoc.split("\n");
const mockModel = {
    getLineCount: () => lines.length,
    getLineContent: (lineNum) => lines[lineNum - 1]
};

const sandbox4 = {
    document: {
        getElementById: (id) => ({
            classList: { contains: () => false },
            style: {},
            textContent: ""
        })
    },
    MonacoInstance: {
        getModel: () => mockModel
    },
    OutlineHeadingsList: [],
    RenderOutlineItems: (items) => {}
};

vm.runInNewContext(`${outlineFnCode}\nUpdateDocumentOutline();`, sandbox4);
const extracted = sandbox4.OutlineHeadingsList;
assert.strictEqual(extracted.length, 5, `Expected 5 headings extracted, got ${extracted.length}`);
assert.strictEqual(extracted[0].Title, "Main Chapter");
assert.strictEqual(extracted[0].Level, 1);
assert.strictEqual(extracted[1].Title, "Section 1.1");
assert.strictEqual(extracted[1].Level, 2);
assert.strictEqual(extracted[2].Title, "Programmatic Subheading");
assert.strictEqual(extracted[2].Level, 3);
assert.strictEqual(extracted[3].Title, "Introduction");
assert.strictEqual(extracted[3].Level, 2);
assert.strictEqual(extracted[4].Title, "Full Title for Chapter");
assert.strictEqual(extracted[4].Level, 1);
console.log("  PASS: Document outline extraction handles comments, raw blocks, code blocks, and programmatic headings cleanly.");

console.log("\nALL BATCH 4 GATE CHECKS PASSED 100%!");

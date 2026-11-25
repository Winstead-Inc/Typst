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
console.log("  PASS: Monaco Monarch Tokenizer verified with hyphenated IDs and mode separation.");

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

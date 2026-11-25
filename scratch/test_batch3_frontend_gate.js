const fs = require("fs");
const path = require("path");
const assert = require("assert");

// Mock browser globals for testing App.js functions
global.window = {
    DocPreviewSvgCache: {},
    monaco: {
        MarkerSeverity: {
            Error: 8,
            Warning: 4,
            Info: 2,
            Hint: 1
        }
    }
};
global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
};
global.document = {
    getElementById(id) { return null; }
};
global.MonacoInstance = null;
global.EscapeHtml = (s) => String(s || "");
global.CurrentPaperColorMode = "optimized";
global.ActiveDocumentCanonicalPath = "E:/Typst/main.typ";
global.CurrentFilePath = "E:/Typst/main.typ";
global.LastCompiledPages = [];
global.LastCompiledDocumentPath = "";

// Read and evaluate App.js logic
const appJsSource = fs.readFileSync("TypstStudio/public/App.js", "utf-8");

// Test 1: FastHash and SvgDarkMode
console.log("=== 1. Testing CanonicalizeDocKey ===");
// Extract CanonicalizeDocKey
const fnMatch = appJsSource.match(/function CanonicalizeDocKey\([\s\S]*?\n\}/);
assert(fnMatch, "CanonicalizeDocKey must exist");
eval(fnMatch[0]);

assert.strictEqual(CanonicalizeDocKey("E:\\Typst\\Sub\\File.typ"), "e:/typst/sub/file.typ");
assert.strictEqual(CanonicalizeDocKey("e:/typst/sub/file.typ"), "e:/typst/sub/file.typ");
assert.strictEqual(CanonicalizeDocKey(""), "");
assert.strictEqual(CanonicalizeDocKey(null), "");
console.log("PASS: CanonicalizeDocKey normalizes Windows paths and casing.");

// Test 2: IsSvgPageBlank
console.log("=== 2. Testing IsSvgPageBlank ===");
const blankFnMatch = appJsSource.match(/function IsSvgPageBlank\([\s\S]*?\n\}/);
assert(blankFnMatch, "IsSvgPageBlank must exist");
eval(blankFnMatch[0]);

const emptySvg = '<svg viewBox="0 0 100 100"><g></g></svg>';
const canvasOnlySvg = '<svg viewBox="0 0 100 100"><path fill="#ffffff" d="M 0 0v100h100v-100Z" /></svg>';
const textSvg = '<svg viewBox="0 0 100 100"><path fill="#ffffff" d="M 0 0v100h100v-100Z" /><use xlink:href="#g1" x="10" y="20" fill="#000000"/></svg>';
const shapeSvg = '<svg viewBox="0 0 100 100"><path fill="#ffffff" d="M 0 0v100h100v-100Z" /><rect x="10" y="10" width="30" height="30" fill="#ff0000"/></svg>';

assert.strictEqual(IsSvgPageBlank(emptySvg), true, "Empty SVG must be detected as blank");
assert.strictEqual(IsSvgPageBlank(canvasOnlySvg), true, "Background-only SVG must be detected as blank");
assert.strictEqual(IsSvgPageBlank(textSvg), false, "SVG with text/glyph must not be blank");
assert.strictEqual(IsSvgPageBlank(shapeSvg), false, "SVG with user shape must not be blank");
console.log("PASS: IsSvgPageBlank correctly identifies modules/blank pages vs visual content.");

// Test 3: ParseCompilerDiagnostics and ErrorErrorMessageClean
console.log("=== 3. Testing Compiler Diagnostics Parsing ===");
const cleanFnMatch = appJsSource.match(/function ErrorErrorMessageClean\([\s\S]*?\n\}/);
assert(cleanFnMatch, "ErrorErrorMessageClean must exist");
eval(cleanFnMatch[0]);

const parseDiagMatch = appJsSource.match(/function ParseCompilerDiagnostics\([\s\S]*?\n\}/);
assert(parseDiagMatch, "ParseCompilerDiagnostics must exist");
eval(parseDiagMatch[0]);

const rawError = `error: unknown variable: my_var
   ┌─ \\\\?\\E:\\Typst\\main.typ:15:7
   │
15 │   #my_var
   │    ^^^^^^
warning: unused import
   ┌─ E:\\Typst\\main.typ:3:1
   │
 3 │ #import "lib.typ"
`;

const cleaned = ErrorErrorMessageClean(rawError);
assert(!cleaned.includes("\\\\?\\"), "ErrorErrorMessageClean must strip extended prefix \\\\?\\");
console.log("PASS: ErrorErrorMessageClean strips extended path prefixes.");

ActiveDocumentCanonicalPath = "E:/Typst/main.typ";
const markers = ParseCompilerDiagnostics(cleaned);
assert.strictEqual(markers.length, 2, "Must extract 2 diagnostics (1 error, 1 warning)");
assert.strictEqual(markers[0].severity, 8, "Primary error must have severity Error (8)");
assert.strictEqual(markers[0].startLineNumber, 15, "Error line must be 15");
assert.strictEqual(markers[0].startColumn, 7, "Error col must be 7");
assert.strictEqual(markers[0].message, "unknown variable: my_var");

assert.strictEqual(markers[1].severity, 4, "Warning must have severity Warning (4)");
assert.strictEqual(markers[1].startLineNumber, 3, "Warning line must be 3");
assert.strictEqual(markers[1].message, "unused import");
console.log("PASS: ParseCompilerDiagnostics generates correct Monaco markers.");

// Test 4: ConvertSvgToDarkMode integrity
console.log("=== 4. Testing Dark Mode SVG Conversion ===");
// Extract FastHash, caches, InvertShapeColor, InvertGlyphColor, ConvertSvgToDarkMode
const fastHashMatch = appJsSource.match(/function FastHash\([\s\S]*?\n\}/);
eval(fastHashMatch[0]);
global.FastHash = FastHash;
global.InvertShapeColorCache = new Map();
global.InvertGlyphColorCache = new Map();
global.SvgDarkModeCache = new Map();
const invertShapeMatch = appJsSource.match(/function InvertShapeColor\([\s\S]*?\n\}/);
eval(invertShapeMatch[0]);
global.InvertShapeColor = InvertShapeColor;
const invertGlyphMatch = appJsSource.match(/function InvertGlyphColor\([\s\S]*?\n\}/);
eval(invertGlyphMatch[0]);
global.InvertGlyphColor = InvertGlyphColor;
const convertDarkMatch = appJsSource.match(/function ConvertSvgToDarkMode\([\s\S]*?\n\}/);
eval(convertDarkMatch[0]);
global.ConvertSvgToDarkMode = ConvertSvgToDarkMode;

// Svg with fill before d
const svg1 = '<svg viewBox="0 0 100 100"><path fill="#ffffff" d="M 0 0v100h100v-100Z"/><path fill="#ff0000" d="M 10 10h20v20h-20Z"/></svg>';
const dark1 = ConvertSvgToDarkMode(svg1, false, "optimized");
assert(dark1.includes('fill="#0D0D0F"'), "Canvas background must be converted to dark canvas color");
assert(dark1.includes('d="M 10 10h20v20h-20Z"'), "User path must remain intact");
assert(!dark1.includes('fill="#0D0D0F" d="M 10 10'), "User path must NOT be stolen as canvas background");

// Svg with d before fill
const svg2 = '<svg viewBox="0 0 100 100"><path d="M 0 0v100h100v-100Z" fill="#ffffff"/><path d="M 10 10h20v20h-20Z" fill="#00ff00"/></svg>';
const dark2 = ConvertSvgToDarkMode(svg2, false, "pure_black");
assert(dark2.includes('fill="#000000"'), "Pure black mode must convert canvas to #000000");
assert(!dark2.includes('fill="#000000" d="M 10 10') && !dark2.includes('d="M 10 10h20v20h-20Z" fill="#000000"'), "User path must NOT be stolen");

console.log("PASS: ConvertSvgToDarkMode correctly inverts canvas without stealing user paths.");

// Test 5: Thumbnail Isolation & Cache Verification
console.log("=== 5. Testing Thumbnail Isolation ===");
const getCachedMatch = appJsSource.match(/function GetCachedPreviewOrMockup\([\s\S]*?\n\}/);
eval(getCachedMatch[0]);

window.DocPreviewSvgCache = {};
LastCompiledPages = ['<svg id="doc_a_preview"></svg>'];
LastCompiledDocumentPath = "e:/typst/doc_a.typ";
CurrentFilePath = "E:/Typst/doc_b.typ";

// Calling GetCachedPreviewOrMockup for Doc B when Doc A was just compiled
const previewB = GetCachedPreviewOrMockup("E:/Typst/doc_b.typ", "Document B");
assert(!previewB.includes("doc_a_preview"), "Doc B must NEVER receive Doc A's compiled preview SVG!");
assert(previewB.includes("PaperMockup"), "Doc B should receive fallback PaperMockup before it is compiled");

// Calling GetCachedPreviewOrMockup for Doc A
const previewA = GetCachedPreviewOrMockup("E:/Typst/doc_a.typ", "Document A");
assert(previewA.includes("doc_a_preview"), "Doc A should receive its own compiled preview");

console.log("PASS: Stale compiled preview pages are strictly isolated by document path.");

console.log("\nALL BATCH 3 FRONTEND GATE TESTS PASSED 100%!");

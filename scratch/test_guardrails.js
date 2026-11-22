// scratch/test_guardrails.js
// Verification suite for Additional Mandatory Guardrails (Cross-Line Selections, typing over boundary, modifiers, post-edit invariant)

function EvaluateCrossLineSelection(lines, sel, keyOrInputType, insertedText = "") {
    // sel: { startLine, startCol, endLine, endCol } (1-based)
    const A = sel.startLine;
    const L = sel.endLine;
    if (A >= L) return null; // not cross-line

    const lineL = lines[L - 1] || "";
    const trimmedL = lineL.trimStart();
    const leadingL = lineL.length - trimmedL.length;

    // Check if line L starts with an opening container
    const matchOpen = trimmedL.match(/^([\[\{\(\$]|```|`|\$\$|\||""")/);
    if (!matchOpen) return null;

    const openGlyph = matchOpen[1];
    const openCol1Based = leadingL + 1;

    // Condition: selection ends on line L at or before <open> inside leading horizontal whitespace
    if (sel.endCol > openCol1Based) {
        // Selection extends past <open>, so <open> is inside the selection.
        return null;
    }

    const lineA = lines[A - 1] || "";
    const preSelA = lineA.slice(0, sel.startCol - 1);
    const selA = lineA.slice(sel.startCol - 1);

    const isDelete = ["Backspace", "Delete", "Cut", "deleteContentBackward", "deleteContentForward", "deleteWordBackward", "deleteWordForward", "deleteSoftLineBackward", "deleteByCut", "deleteByDrag"].includes(keyOrInputType);

    if (isDelete) {
        // Check if selection on line A covers ONLY trailing horizontal whitespace
        if (/^\s*$/.test(selA)) {
            // Sub-case 1.1: DO NOTHING (prevent default, zero mutation)
            return { action: "HARD_NO_OP", reason: "trailing_whitespace_cross_line" };
        } else {
            // Sub-case 1.2: Clamp deletion strictly to [selMin, lineEnd(A)]
            const newLineA = preSelA;
            const newLines = [...lines];
            newLines[A - 1] = newLineA;
            return {
                action: "CLAMP_DELETE",
                newLines,
                cursorLine: A,
                cursorCol: sel.startCol,
            };
        }
    } else {
        // Typing or Pasting over that selection
        // NEVER delete \n separating A from L, NEVER move <open>.
        // Clamp replaced range strictly to line A [selMin, lineEnd(A)]
        const newLineA = preSelA + insertedText;
        const newLines = [...lines];
        newLines[A - 1] = newLineA;
        return {
            action: "CLAMP_INSERT",
            newLines,
            cursorLine: A,
            cursorCol: preSelA.length + insertedText.length + 1,
        };
    }
}

function NormalizeKnRJunctions(text) {
    const lines = text.split("\n");
    let changed = false;
    const newLines = [];

    const openGlyphs = ["```", "\"\"\"", "$$", "[{(", "([", "[(", "`", "$", "|", "[", "{", "("];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip line comments or lines inside comments
        if (line.trim().startsWith("//")) {
            newLines.push(line);
            continue;
        }

        let matched = null;
        for (const og of openGlyphs) {
            if (line.endsWith(og)) {
                const head = line.slice(0, line.length - og.length);
                if (head.trim().length > 0) {
                    matched = { og, head };
                    break;
                }
            }
        }

        if (matched) {
            const im = line.match(/^(\s*)/);
            const baseIndent = im ? im[1] : "";
            newLines.push(matched.head.trimEnd());
            newLines.push(baseIndent + matched.og);
            changed = true;
        } else {
            newLines.push(line);
        }
    }

    return { changed, resultText: newLines.join("\n") };
}

// Tests
console.log("=== Testing Additional Mandatory Guardrails ===");
let passed = 0, failed = 0;
function assert(desc, cond) {
    if (cond) { console.log(`[PASS] ${desc}`); passed++; }
    else { console.error(`[FAIL] ${desc}`); failed++; }
}

// Test 1: Cross-line selection covering only trailing spaces -> HARD NO-OP
const lines1 = ["#block   ", "    [Parser]"];
// selection from line 1, col 7 to line 2, col 5 (before [)
const test1 = EvaluateCrossLineSelection(lines1, { startLine: 1, startCol: 7, endLine: 2, endCol: 5 }, "Backspace");
assert("Cross-line selection covering only trailing spaces -> HARD NO-OP",
    test1 && test1.action === "HARD_NO_OP");

// Test 2: Cross-line selection with non-whitespace on line A -> Clamps to line A end
const lines2 = ["#block words   ", "    [Parser]"];
// selection from col 7 ('words...') to line 2, col 5
const test2 = EvaluateCrossLineSelection(lines2, { startLine: 1, startCol: 7, endLine: 2, endCol: 5 }, "Delete");
assert("Cross-line selection with non-whitespace on line A -> Clamps to line A end",
    test2 && test2.action === "CLAMP_DELETE" && test2.newLines[0] === "#block" && test2.newLines[1] === "    [Parser]");

// Test 3: Typing over cross-line selection -> Clamps to line A, keeps \n and <open> untouched
const lines3 = ["#block target", "    [Parser]"];
const test3 = EvaluateCrossLineSelection(lines3, { startLine: 1, startCol: 7, endLine: 2, endCol: 5 }, "insertText", " replacement");
assert("Typing over cross-line selection -> Clamps to line A, keeps \\n and [Parser] untouched",
    test3 && test3.action === "CLAMP_INSERT" && test3.newLines[0] === "#block replacement" && test3.newLines[1] === "    [Parser]");

// Test 4: Post-edit K&R junction normalization
const knrSample = "#table[\n    [Cell 1], [Cell 2]\n]";
const test4 = NormalizeKnRJunctions(knrSample);
assert("Post-edit K&R junction #table[ normalizes to detached 2D symmetry",
    test4.changed && test4.resultText === "#table\n[\n    [Cell 1], [Cell 2]\n]");

// Test 5: Post-edit K&R junction with indent
const knrSample2 = "    header: context {\n        [Title]\n    }";
const test5 = NormalizeKnRJunctions(knrSample2);
assert("Post-edit indented K&R junction normalizes with matching baseIndent",
    test5.changed && test5.resultText === "    header: context\n    {\n        [Title]\n    }");

console.log(`\nGuardrails Tests: ${passed} Passed, ${failed} Failed.`);

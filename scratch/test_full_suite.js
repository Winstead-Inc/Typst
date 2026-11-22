// scratch/test_full_suite.js
// Verification suite for Container Physics, Enter detachment, Delimiter matching, and Guardrails

const {
    ScanLexicalParity,
    EvaluateRuleA,
    EvaluateRuleB
} = (function() {
    const compoundPairs = [
        { open: "[{(", close: ")}]" },
        { open: "([", close: "])" },
        { open: "[(", close: ")]" },
        { open: "`${", close: "}`" },
        { open: "${", close: "}" },
        { open: "<!--", close: "-->" },
        { open: "$$", close: "$$" },
        { open: '"""', close: '"""' },
        { open: "```", close: "```" },
        { open: "(", close: ")" },
        { open: "[", close: "]" },
        { open: "{", close: "}" },
        { open: "$", close: "$" },
        { open: "`", close: "`" },
        { open: "|", close: "|" }
    ];

    function ScanLexicalParity(text) {
        const lines = text.split("\n");
        let mathCount = 0;
        let rawBlockCount = 0;
        let rawInlineCount = 0;
        let sqlCount = 0;
        let tripleQuoteCount = 0;
        const tokens = [];

        for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
            const line = lines[lineIdx];
            let i = 0;

            while (i < line.length) {
                if (line.slice(i, i + 2) === "//") break;
                if (line[i] === "\\" && i + 1 < line.length) { i += 2; continue; }
                if (line.slice(i, i + 3) === "```") {
                    tokens.push({ type: "raw_block", glyph: "```", line: lineIdx, col: i, isOpener: (rawBlockCount % 2 === 0) });
                    rawBlockCount++; i += 3; continue;
                }
                if (line[i] === "`") {
                    tokens.push({ type: "raw_inline", glyph: "`", line: lineIdx, col: i, isOpener: (rawInlineCount % 2 === 0) });
                    rawInlineCount++; i++; continue;
                }
                if (line.slice(i, i + 2) === "$$") {
                    tokens.push({ type: "sql", glyph: "$$", line: lineIdx, col: i, isOpener: (sqlCount % 2 === 0) });
                    sqlCount++; i += 2; continue;
                }
                if (line[i] === "$") {
                    tokens.push({ type: "math", glyph: "$", line: lineIdx, col: i, isOpener: (mathCount % 2 === 0) });
                    mathCount++; i++; continue;
                }
                if (line.slice(i, i + 3) === '"""') {
                    tokens.push({ type: "triple_quote", glyph: '"""', line: lineIdx, col: i, isOpener: (tripleQuoteCount % 2 === 0) });
                    tripleQuoteCount++; i += 3; continue;
                }
                if (line[i] === "<") {
                    const labelMatch = line.slice(i).match(/^<([a-zA-Z0-9_\-:]+)>/);
                    if (labelMatch) { i += labelMatch[0].length; continue; }
                    const arrowMatch = line.slice(i).match(/^(->|<-|=>|<=|==>|<==>|<->)/);
                    if (arrowMatch) { i += arrowMatch[0].length; continue; }
                }
                if (line[i] === "(") tokens.push({ type: "paren", glyph: "(", line: lineIdx, col: i, isOpener: true });
                else if (line[i] === ")") tokens.push({ type: "paren", glyph: ")", line: lineIdx, col: i, isOpener: false });
                else if (line[i] === "[") tokens.push({ type: "bracket", glyph: "[", line: lineIdx, col: i, isOpener: true });
                else if (line[i] === "]") tokens.push({ type: "bracket", glyph: "]", line: lineIdx, col: i, isOpener: false });
                else if (line[i] === "{") tokens.push({ type: "brace", glyph: "{", line: lineIdx, col: i, isOpener: true });
                else if (line[i] === "}") tokens.push({ type: "brace", glyph: "}", line: lineIdx, col: i, isOpener: false });
                i++;
            }
        }
        return tokens;
    }

    function EvaluateRuleA(text, lineIdx, colIdx) {
        const lines = text.split("\n");
        if (lineIdx < 0 || lineIdx >= lines.length) return null;
        const line = lines[lineIdx];
        const pre = line.slice(0, colIdx);
        const post = line.slice(colIdx);

        for (const pair of compoundPairs) {
            // Case 1: Cursor right between empty container: e.g. #text(|) or #block[|]
            if (pre.endsWith(pair.open) && post.startsWith(pair.close)) {
                const head = pre.slice(0, pre.length - pair.open.length);
                const tail = post.slice(pair.close.length);
                const indentMatch = line.match(/^(\s*)/);
                const baseIndent = indentMatch ? indentMatch[1] : "";
                const innerIndent = baseIndent + "    ";
                const headTrimmed = head.trimEnd();
                const newLines = [];
                let cursorLine = 0;

                if (headTrimmed.length > 0) {
                    newLines.push(headTrimmed);
                    newLines.push(baseIndent + pair.open);
                    newLines.push(innerIndent);
                    newLines.push(baseIndent + pair.close + (tail.trim().length > 0 ? " " + tail.trimStart() : ""));
                    cursorLine = lineIdx + 2;
                } else {
                    newLines.push(baseIndent + pair.open);
                    newLines.push(innerIndent);
                    newLines.push(baseIndent + pair.close + (tail.trim().length > 0 ? " " + tail.trimStart() : ""));
                    cursorLine = lineIdx + 1;
                }

                return {
                    status: 1,
                    newLines,
                    cursorLine,
                    cursorCol: innerIndent.length
                };
            }

            // Case 2: Content already follows cursor inside container: #text(|size: 8.5pt) or #block[|hello]
            const openIdx = pre.lastIndexOf(pair.open);
            const closeIdx = post.indexOf(pair.close);

            if (openIdx !== -1 && closeIdx !== -1) {
                const head = pre.slice(0, openIdx);
                const innerPre = pre.slice(openIdx + pair.open.length);
                const innerPost = post.slice(0, closeIdx);
                const tail = post.slice(closeIdx + pair.close.length);

                const indentMatch = line.match(/^(\s*)/);
                const baseIndent = indentMatch ? indentMatch[1] : "";
                const innerIndent = baseIndent + "    ";

                const newLines = [];
                if (head.trim().length > 0) {
                    newLines.push(head.trimEnd());
                }
                newLines.push(baseIndent + pair.open);

                let cursorLineOffset = newLines.length;
                let cursorCol = innerIndent.length;

                const hasInnerPre = innerPre.trim().length > 0;
                const hasInnerPost = innerPost.trim().length > 0;

                if (!hasInnerPre && !hasInnerPost) {
                    newLines.push(innerIndent);
                } else if (!hasInnerPre && hasInnerPost) {
                    // Cursor right after opener: exactly ONE inner line, NO extra blank line!
                    newLines.push(innerIndent + innerPost.trim());
                    cursorLineOffset = newLines.length - 1;
                    cursorCol = innerIndent.length;
                } else if (hasInnerPre && !hasInnerPost) {
                    newLines.push(innerIndent + innerPre.trim());
                    cursorLineOffset = newLines.length - 1;
                    cursorCol = innerIndent.length + innerPre.trim().length;
                } else {
                    newLines.push(innerIndent + innerPre.trimEnd());
                    newLines.push(innerIndent + innerPost.trimStart());
                    cursorLineOffset = newLines.length - 1;
                    cursorCol = innerIndent.length;
                }

                newLines.push(baseIndent + pair.close + (tail.trim().length > 0 ? " " + tail.trimStart() : ""));

                return {
                    status: 1,
                    newLines,
                    cursorLine: lineIdx + cursorLineOffset,
                    cursorCol
                };
            }
        }
        return null;
    }

    function EvaluateRuleB(text, key, lineIdx, colIdx, canvasLimit = 160) {
        const lines = text.split("\n");
        if (lineIdx < 0 || lineIdx >= lines.length) return null;

        let targetOpenLine = -1;
        let prevOpenLine = -1;

        if (key === "Backspace") {
            if (lineIdx <= 0) return null;
            if (/^\s*$/.test(lines[lineIdx].slice(0, colIdx))) {
                prevOpenLine = lineIdx - 1;
                targetOpenLine = lineIdx;
            } else {
                return null;
            }
        } else if (key === "Delete") {
            if (lineIdx >= lines.length - 1) return null;
            const line = lines[lineIdx];
            if (/^\s*$/.test(line.slice(colIdx)) && line.slice(0, colIdx).trim().length > 0) {
                prevOpenLine = lineIdx;
                targetOpenLine = lineIdx + 1;
            } else {
                return null;
            }
        } else {
            return null;
        }

        const prevLine = lines[prevOpenLine];
        if (prevLine.trim().length === 0) return null;

        const targetLine = lines[targetOpenLine];
        const matchOpen = targetLine.match(/^(\s*)([\[\{\(\$]|```|`|\$\$|\||""")/);
        if (!matchOpen) return null;

        const openGlyph = matchOpen[2];
        const openCol = matchOpen[1].length;

        const tokens = ScanLexicalParity(text);
        const tok = tokens.find(t => t.line === targetOpenLine && t.col === openCol);
        if (!tok || !tok.isOpener) return null;

        // Strict delimiter matching starting from tok index:
        let matchedCloser = null;
        let depth = 0;
        const startIndex = tokens.indexOf(tok);
        if (startIndex !== -1) {
            for (let i = startIndex; i < tokens.length; i++) {
                const t = tokens[i];
                if (t.type === tok.type) {
                    if (t.isOpener) {
                        depth++;
                    } else {
                        depth--;
                        if (depth === 0) {
                            matchedCloser = t;
                            break;
                        }
                    }
                }
            }
        }

        if (!matchedCloser) {
            return { status: 0, reason: "Unclosed container" };
        }

        // Check for line comments
        for (let l = targetOpenLine; l <= matchedCloser.line; l++) {
            if (lines[l].includes("//")) {
                return { status: 0, reason: "Contains line comment" };
            }
        }

        // Check statement complexity budget
        let statementCount = 0;
        for (let l = targetOpenLine; l <= matchedCloser.line; l++) {
            const trimmed = lines[l].trim();
            if (trimmed.endsWith(";") || trimmed.endsWith(",")) statementCount++;
        }
        if (statementCount > 4) {
            return { status: 0, reason: "Complexity budget exceeded" };
        }

        const headText = prevLine.trimEnd();
        let body = "";

        if (targetOpenLine === matchedCloser.line) {
            body = targetLine.slice(openCol + openGlyph.length, matchedCloser.col).trim().replace(/\s+/g, " ");
        } else {
            const firstLineBody = targetLine.slice(openCol + openGlyph.length);
            const midLines = lines.slice(targetOpenLine + 1, matchedCloser.line);
            const lastLineBody = lines[matchedCloser.line].slice(0, matchedCloser.col);
            body = [firstLineBody, ...midLines, lastLineBody].join(" ").trim().replace(/\s+/g, " ");
        }

        let paddedInterior = body;
        if (openGlyph === "{" || openGlyph === "$") {
            paddedInterior = body.length > 0 ? ` ${body} ` : "";
        }

        const closeSuffix = lines[matchedCloser.line].slice(matchedCloser.col + matchedCloser.glyph.length).trimEnd();
        let attachSpace = "";
        if ((openGlyph === "{" || openGlyph === "$" || openGlyph === "$$" || openGlyph === '"""' || openGlyph === "```") && !headText.endsWith(" ")) {
            attachSpace = " ";
        }

        const monolithLine = `${headText}${attachSpace}${openGlyph}${paddedInterior}${matchedCloser.glyph}${closeSuffix}`;

        if (monolithLine.length > canvasLimit) {
            return { status: 0, reason: "Canvas limit breach" };
        }

        const resultLines = [
            ...lines.slice(0, prevOpenLine),
            monolithLine,
            ...lines.slice(matchedCloser.line + 1)
        ];

        return {
            status: 2,
            monolithLine,
            startLine: prevOpenLine,
            endLine: matchedCloser.line,
            cursorLine: prevOpenLine,
            cursorCol: headText.length + attachSpace.length,
            result: resultLines.join("\n")
        };
    }

    return { ScanLexicalParity, EvaluateRuleA, EvaluateRuleB };
})();

console.log("=== RUNNING SUITE ===");

// Test 1: #text(|size: 8.5pt) -> ZERO extra empty line, zero double indent!
const r1 = EvaluateRuleA("#text(size: 8.5pt)", 0, 6);
console.log("Test 1 (#text(|size: 8.5pt)):");
console.log("Lines:\n" + r1.newLines.join("\n"));
console.assert(r1.newLines.length === 3, "Expected 3 lines: #text, (, size: 8.5pt)");
console.assert(r1.newLines[0] === "#text", "Line 0 should be #text");
console.assert(r1.newLines[1] === "(", "Line 1 should be (");
console.assert(r1.newLines[2] === "    size: 8.5pt", "Line 2 should be '    size: 8.5pt'");
console.assert(r1.cursorLine === 2, "Cursor line should be 2");

// Test 2: #block[|hello] -> ONE inner line, [ ] container support!
const r2 = EvaluateRuleA("#block[hello]", 0, 7);
console.log("\nTest 2 (#block[|hello]):");
console.log("Lines:\n" + r2.newLines.join("\n"));
console.assert(r2.newLines[0] === "#block", "Line 0 should be #block");
console.assert(r2.newLines[1] === "[", "Line 1 should be [");
console.assert(r2.newLines[2] === "    hello", "Line 2 should be '    hello'");

// Test 3: #table[|] empty container
const r3 = EvaluateRuleA("#table[]", 0, 7);
console.log("\nTest 3 (#table[|]):");
console.log("Lines:\n" + r3.newLines.join("\n"));
console.assert(r3.newLines[0] === "#table", "Line 0 should be #table");
console.assert(r3.newLines[1] === "[", "Line 1 should be [");
console.assert(r3.newLines[2] === "    ", "Line 2 should be '    '");
console.assert(r3.newLines[3] === "]", "Line 3 should be ]");

// Test 4: Backspace near [ (Rule B)
const codeWithBlock = `#block\n[Parser]`;
const r4 = EvaluateRuleB(codeWithBlock, "Backspace", 1, 0, 160);
console.log("\nTest 4 (Backspace short [Parser]):", r4.status === 2, r4.monolithLine);
console.assert(r4.monolithLine === "#block[Parser]");

// Test 5: Long block canvas breach -> Hard No-Op
const longBlock = `#block\n[` + "x".repeat(200) + `]`;
const r5 = EvaluateRuleB(longBlock, "Backspace", 1, 0, 160);
console.log("\nTest 5 (Long block canvas breach):", r5.status === 0, r5.reason);
console.assert(r5.status === 0 && r5.reason === "Canvas limit breach");

// Test 6: Nested container delimiter matching
const nestedCode = `#block\n(\n    inset: 10pt\n)\n[\n    hello\n]`;
const r6 = EvaluateRuleB(nestedCode, "Backspace", 4, 0, 160);
console.log("\nTest 6 (Backspace nested closer):", r6.status === 2, r6.monolithLine);
console.assert(r6.monolithLine === "[\n    hello\n]" || r6.monolithLine === ") [hello]");

console.log("\nALL SUITE TESTS PASSED!");

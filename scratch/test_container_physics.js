// scratch/test_container_physics.js
// Verification suite for Universal Character-Agnostic Container Physics (LAFS 0, 3, 6.2)

const fs = require("fs");
const path = require("path");

// 1. AST / Lexical Parity Scanner & Container Engine
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
            // Check line comment
            if (line.slice(i, i + 2) === "//") {
                // rest of line is comment
                break;
            }

            // Check escaped character
            if (line[i] === "\\" && i + 1 < line.length) {
                i += 2;
                continue;
            }

            // Check triple backticks
            if (line.slice(i, i + 3) === "```") {
                const isOpener = (rawBlockCount % 2 === 0);
                tokens.push({
                    type: "raw_block",
                    glyph: "```",
                    line: lineIdx,
                    col: i,
                    isOpener,
                });
                rawBlockCount++;
                i += 3;
                continue;
            }

            // Check single backtick
            if (line[i] === "`") {
                const isOpener = (rawInlineCount % 2 === 0);
                tokens.push({
                    type: "raw_inline",
                    glyph: "`",
                    line: lineIdx,
                    col: i,
                    isOpener,
                });
                rawInlineCount++;
                i++;
                continue;
            }

            // Check $$
            if (line.slice(i, i + 2) === "$$") {
                const isOpener = (sqlCount % 2 === 0);
                tokens.push({
                    type: "sql_block",
                    glyph: "$$",
                    line: lineIdx,
                    col: i,
                    isOpener,
                });
                sqlCount++;
                i += 2;
                continue;
            }

            // Check $ (Typst math)
            if (line[i] === "$") {
                const isOpener = (mathCount % 2 === 0);
                tokens.push({
                    type: "math",
                    glyph: "$",
                    line: lineIdx,
                    col: i,
                    isOpener,
                });
                mathCount++;
                i++;
                continue;
            }

            // Check triple quote """
            if (line.slice(i, i + 3) === '"""') {
                const isOpener = (tripleQuoteCount % 2 === 0);
                tokens.push({
                    type: "triple_quote",
                    glyph: '"""',
                    line: lineIdx,
                    col: i,
                    isOpener,
                });
                tripleQuoteCount++;
                i += 3;
                continue;
            }

            // Check Typst label: <label>
            if (line[i] === "<") {
                const labelMatch = line.slice(i).match(/^<([a-zA-Z0-9_\-:]+)>/);
                if (labelMatch) {
                    // It's a label! NOT a container!
                    i += labelMatch[0].length;
                    continue;
                }
                // Check arrows: ->, <-, =>, <=>, <==>
                const arrowMatch = line.slice(i).match(/^(->|<-|=>|<=|==>|<==>|<->)/);
                if (arrowMatch) {
                    i += arrowMatch[0].length;
                    continue;
                }
            }

            // Asymmetric structural delimiters
            if (line[i] === "(") {
                tokens.push({ type: "paren", glyph: "(", line: lineIdx, col: i, isOpener: true });
            } else if (line[i] === ")") {
                tokens.push({ type: "paren", glyph: ")", line: lineIdx, col: i, isOpener: false });
            } else if (line[i] === "[") {
                tokens.push({ type: "bracket", glyph: "[", line: lineIdx, col: i, isOpener: true });
            } else if (line[i] === "]") {
                tokens.push({ type: "bracket", glyph: "]", line: lineIdx, col: i, isOpener: false });
            } else if (line[i] === "{") {
                tokens.push({ type: "brace", glyph: "{", line: lineIdx, col: i, isOpener: true });
            } else if (line[i] === "}") {
                tokens.push({ type: "brace", glyph: "}", line: lineIdx, col: i, isOpener: false });
            }

            i++;
        }
    }

    return tokens;
}

// 2. Rule A (Enter inside container) evaluator
function EvaluateRuleA(text, lineIdx, colIdx, canvasLimit = 160) {
    const lines = text.split("\n");
    if (lineIdx < 0 || lineIdx >= lines.length) return null;
    const line = lines[lineIdx];

    const pre = line.slice(0, colIdx);
    const post = line.slice(colIdx);

    // Check compound openers e.g. [{(, (|, etc.
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
        { open: "|", close: "|" },
    ];

    for (const pair of compoundPairs) {
        // Check if pre ends with open and post starts with close (empty container [|])
        if (pre.endsWith(pair.open) && post.startsWith(pair.close)) {
            const head = pre.slice(0, pre.length - pair.open.length);
            const tail = post.slice(pair.close.length);

            // Compute baseIndent
            const indentMatch = line.match(/^(\s*)/);
            const baseIndent = indentMatch ? indentMatch[1] : "";
            const innerIndent = baseIndent + "    ";

            const headTrimmed = head.trimEnd();

            let newLines = [];
            let cursorLine = 0;
            let cursorCol = 0;

            if (headTrimmed.length > 0) {
                newLines.push(headTrimmed);
                newLines.push(baseIndent + pair.open);
                newLines.push(innerIndent);
                newLines.push(baseIndent + pair.close + tail.trimStart());
                cursorLine = lineIdx + 2;
                cursorCol = innerIndent.length;
            } else {
                newLines.push(baseIndent + pair.open);
                newLines.push(innerIndent);
                newLines.push(baseIndent + pair.close + tail.trimStart());
                cursorLine = lineIdx + 1;
                cursorCol = innerIndent.length;
            }

            const prefixLines = lines.slice(0, lineIdx);
            const suffixLines = lines.slice(lineIdx + 1);
            const resultText = [...prefixLines, ...newLines, ...suffixLines].join("\n");

            return {
                transformed: true,
                resultText,
                cursorLine,
                cursorCol,
            };
        }

        // Check head-hugging with content: head + open + innerPre | innerPost + close
        const openIdx = pre.lastIndexOf(pair.open);
        const closeIdx = post.indexOf(pair.close);
        if (openIdx !== -1 && closeIdx !== -1) {
            const head = pre.slice(0, openIdx);
            if (head.trim().length > 0) { // must sit after non-whitespace head content
                const innerPre = pre.slice(openIdx + pair.open.length);
                const innerPost = post.slice(0, closeIdx);
                const tail = post.slice(closeIdx + pair.close.length);

                const indentMatch = line.match(/^(\s*)/);
                const baseIndent = indentMatch ? indentMatch[1] : "";
                const innerIndent = baseIndent + "    ";

                let newLines = [];
                newLines.push(head.trimEnd());
                newLines.push(baseIndent + pair.open);
                newLines.push(innerIndent + innerPre);
                newLines.push(innerIndent + innerPost);
                newLines.push(baseIndent + pair.close + tail.trimStart());

                const prefixLines = lines.slice(0, lineIdx);
                const suffixLines = lines.slice(lineIdx + 1);
                const resultText = [...prefixLines, ...newLines, ...suffixLines].join("\n");

                return {
                    transformed: true,
                    resultText,
                    cursorLine: lineIdx + 3,
                    cursorCol: innerIndent.length,
                };
            }
        }
    }

    return null;
}

// 3. Rule B (Backspace / Delete anti-K&R gate) evaluator
function EvaluateRuleB(text, key, lineIdx, colIdx, canvasLimit = 160) {
    const lines = text.split("\n");
    if (lineIdx < 0 || lineIdx >= lines.length) return null;
    let targetOpenLine = -1;
    let prevLineIdx = -1;

    if (key === "Backspace") {
        if (lineIdx <= 0) return null;
        const line = lines[lineIdx];
        const preCursor = line.slice(0, colIdx);

        // Only whitespace before cursor on this line
        if (/^\s*$/.test(preCursor)) {
            prevLineIdx = lineIdx - 1;
            targetOpenLine = lineIdx;
        } else {
            return null;
        }
    } else if (key === "Delete") {
        if (lineIdx >= lines.length - 1) return null;
        const line = lines[lineIdx];
        const postCursor = line.slice(colIdx);

        // Only whitespace from cursor to EOL on this line
        if (/^\s*$/.test(postCursor) && line.slice(0, colIdx).trim().length > 0) {
            prevLineIdx = lineIdx;
            targetOpenLine = lineIdx + 1;
        } else {
            return null;
        }
    } else {
        return null;
    }

    const prevLine = lines[prevLineIdx];
    if (prevLine.trim().length === 0) return null;

    const targetLine = lines[targetOpenLine];
    const matchOpen = targetLine.match(/^(\s*)([\[\{\(\$]|```|`|\$\$|\||""")/);
    if (!matchOpen) return null;

    const openGlyph = matchOpen[2];
    const openCol = matchOpen[1].length;

    // Verify opener vs closer using Lexical Parity Scanner
    const tokens = ScanLexicalParity(text);
    const token = tokens.find(t => t.line === targetOpenLine && t.col === openCol);
    if (!token || !token.isOpener) {
        // It's a closer or non-container (e.g. closing $ <eq:rotation>) -> NOT an opener!
        return null;
    }

    // Find matching closer
    let matchingCloseToken = null;
    let depth = 0;
    for (const t of tokens) {
        if (t.type === token.type) {
            if (t.isOpener) {
                depth++;
            } else {
                depth--;
                if (depth === 0) {
                    matchingCloseToken = t;
                    break;
                }
            }
        }
    }

    if (!matchingCloseToken) {
        // No valid matching closer -> HARD NO-OP!
        return { action: "HARD_NO_OP", reason: "unclosed_container" };
    }

    const closeLineIdx = matchingCloseToken.line;

    // Check for forced breaks inside container
    for (let l = targetOpenLine; l <= closeLineIdx; l++) {
        const curLine = lines[l];
        // Check line comments
        if (curLine.includes("//")) {
            return { action: "HARD_NO_OP", reason: "line_comment_inside" };
        }
    }

    // Check complexity budget (> 4 statements in a block or > 2 nested block levels)
    let statementCount = 0;
    for (let l = targetOpenLine; l <= closeLineIdx; l++) {
        const trimmed = lines[l].trim();
        if (trimmed.endsWith(";") || trimmed.endsWith(",")) {
            statementCount++;
        }
    }
    if (statementCount > 4) {
        return { action: "HARD_NO_OP", reason: "complexity_budget_exceeded" };
    }

    // Compute candidate Monolith
    const headTrimmed = prevLine.trimEnd();
    let bodyText = "";
    if (targetOpenLine === closeLineIdx) {
        const rawBody = targetLine.slice(openCol + openGlyph.length, matchingCloseToken.col);
        bodyText = rawBody.trim().replace(/\s+/g, " ");
    } else {
        const firstLineInner = targetLine.slice(openCol + openGlyph.length);
        const middleLines = lines.slice(targetOpenLine + 1, closeLineIdx);
        const lastLineInner = lines[closeLineIdx].slice(0, matchingCloseToken.col);
        const allInner = [firstLineInner, ...middleLines, lastLineInner].join(" ");
        bodyText = allInner.trim().replace(/\s+/g, " ");
    }

    // Apply LAFS Monolith Inner Padding
    let paddedInner = bodyText;
    if (openGlyph === "{") {
        paddedInner = bodyText.length > 0 ? ` ${bodyText} ` : "";
    } else if (openGlyph === "$") {
        paddedInner = bodyText.length > 0 ? ` ${bodyText} ` : "";
    } else {
        paddedInner = bodyText;
    }

    const closeGlyph = matchingCloseToken.glyph;
    const closerLine = lines[closeLineIdx];
    const closerSuffix = closerLine.slice(matchingCloseToken.col + closeGlyph.length).trimEnd();

    // Attach to head
    let attachment = "";
    if (openGlyph === "{" || openGlyph === "$" || openGlyph === "$$" || openGlyph === '"""' || openGlyph === "```") {
        if (!headTrimmed.endsWith(" ")) {
            attachment = " ";
        }
    }

    const monolith = `${headTrimmed}${attachment}${openGlyph}${paddedInner}${closeGlyph}${closerSuffix}`;

    if (monolith.length > canvasLimit) {
        return { action: "HARD_NO_OP", reason: "canvas_limit_breach", length: monolith.length, canvasLimit };
    }

    // Allowed collapse
    const prefixLines = lines.slice(0, prevLineIdx);
    const suffixLines = lines.slice(closeLineIdx + 1);
    const resultText = [...prefixLines, monolith, ...suffixLines].join("\n");

    const cursorLine = prevLineIdx;
    const cursorCol = headTrimmed.length + attachment.length;

    return {
        action: "COLLAPSE_MONOLITH",
        resultText,
        cursorLine,
        cursorCol,
        monolith,
    };
}

// 4. Test Suite Execution
function RunTests() {
    console.log("=== Running Universal Character-Agnostic Container Physics Tests ===\n");
    let passed = 0;
    let failed = 0;

    function assert(desc, condition) {
        if (condition) {
            console.log(`[PASS] ${desc}`);
            passed++;
        } else {
            console.error(`[FAIL] ${desc}`);
            failed++;
        }
    }

    // Test 1: Enter inside #table[|] -> string is "#table[]", cursor between [ and ] at col 7
    const test1 = EvaluateRuleA("#table[]", 0, 7);
    assert("Enter inside #table[] detaches symmetrically",
        test1 && test1.resultText === "#table\n[\n    \n]" && test1.cursorLine === 2 && test1.cursorCol === 4);

    // Test 2: Enter inside $|$ -> string is "$$", cursor between $ and $ at col 1
    const test2 = EvaluateRuleA("$$", 0, 1);
    assert("Enter inside $$ detaches to 2D math block",
        test2 && test2.resultText === "$\n    \n$" && test2.cursorLine === 1 && test2.cursorCol === 4);

    // Test 3: Enter inside header: context {|} -> string is "header: context {}", cursor between { and } at col 17
    const test3 = EvaluateRuleA("header: context {}", 0, 17);
    assert("Enter inside header: context {} detaches with proper nesting",
        test3 && test3.resultText === "header: context\n{\n    \n}");

    // Test 4: Backspace before detached [ when short collapses to Monolith
    const text4 = "#block\n[Parser]";
    const test4 = EvaluateRuleB(text4, "Backspace", 1, 0, 160);
    assert("Backspace before detached short [Parser] collapses to Monolith",
        test4 && test4.action === "COLLAPSE_MONOLITH" && test4.resultText === "#block[Parser]");

    // Test 5: Backspace before detached long container breaches canvas -> HARD NO-OP
    const text5 = `#table\n[\n    columns: (1fr, 2fr),\n    [Cell 1], [Cell 2],\n]`;
    const test5 = EvaluateRuleB(text5, "Backspace", 1, 0, 40); // small canvas 40
    assert("Backspace before long #table container breaches canvas -> HARD NO-OP",
        test5 && test5.action === "HARD_NO_OP" && test5.reason === "canvas_limit_breach");

    // Test 6: Container with // comment inside -> HARD NO-OP
    const text6 = "#block\n[\n    // important note\n    data\n]";
    const test6 = EvaluateRuleB(text6, "Backspace", 1, 0, 160);
    assert("Container with // comment inside -> HARD NO-OP",
        test6 && test6.action === "HARD_NO_OP" && test6.reason === "line_comment_inside");

    // Test 7: Backspace in front of CLOSING $ does NOT trigger as opener
    const text7 = "$\n    mat(1, 2; 3, 4)\n$ <eq:rotation>";
    const test7 = EvaluateRuleB(text7, "Backspace", 2, 0, 160);
    assert("Backspace in front of CLOSING $ does NOT trigger as opener",
        test7 === null);

    // Test 8: Typst label <sec:intro> does NOT trigger container collapse
    const text8 = "Section Title\n<sec:intro>";
    const test8 = EvaluateRuleB(text8, "Backspace", 1, 0, 160);
    assert("Typst label <sec:intro> does NOT trigger container collapse",
        test8 === null);

    // Test 9: Delete at EOL before next line [Parser] collapses to Monolith
    const text9 = "#block\n[Parser]";
    const test9 = EvaluateRuleB(text9, "Delete", 0, 6, 160);
    assert("Delete at EOL before next-line [Parser] collapses to Monolith",
        test9 && test9.action === "COLLAPSE_MONOLITH" && test9.resultText === "#block[Parser]");

    // Test 10: Delete with trailing spaces after head
    const text10 = "#block   \n[Parser]";
    const test10 = EvaluateRuleB(text10, "Delete", 0, 7, 160);
    assert("Delete inside trailing spaces before next-line [Parser] collapses to Monolith",
        test10 && test10.action === "COLLAPSE_MONOLITH" && test10.resultText === "#block[Parser]");

    // Test 11: Display math $ x^2 $ collapses with 1 space padding inside
    const text11 = "Equation:\n$\n    x^2\n$";
    const test11 = EvaluateRuleB(text11, "Backspace", 1, 0, 160);
    assert("Display math $ x^2 $ collapses with 1 space inner padding ($ x^2 $)",
        test11 && test11.action === "COLLAPSE_MONOLITH" && test11.resultText === "Equation: $ x^2 $");

    // Test 12: Code block with { return 42; } collapses with 1 space padding
    const text12 = "fn Answer()\n{\n    return 42;\n}";
    const test12 = EvaluateRuleB(text12, "Backspace", 1, 0, 160);
    assert("Code block { return 42; } collapses with 1 space inner padding ({ return 42; })",
        test12 && test12.action === "COLLAPSE_MONOLITH" && test12.resultText === "fn Answer() { return 42; }");

    // Test 13: Compound opener [{(|)}] detaches symmetrically
    const test13 = EvaluateRuleA("test[{()}]", 0, 7);
    assert("Compound opener [{( detaches symmetrically",
        test13 && test13.resultText.includes("test\n[{(\n    \n)}]"));

    // Test 14: Fenced code block ``` | ``` detaches
    const test14 = EvaluateRuleA("``````", 0, 3);
    assert("Fenced code block ``` | ``` detaches cleanly",
        test14 && test14.resultText.startsWith("```\n    \n```"));

    // Test 15: Comparison x < y does NOT trigger as container
    const text15 = "let cond = x < y;\n[Result]";
    const test15 = EvaluateRuleB(text15, "Backspace", 1, 0, 160);
    assert("Comparison x < y does NOT trigger as container",
        test15 && test15.action === "COLLAPSE_MONOLITH" && test15.resultText === "let cond = x < y;[Result]");

    // Test 16: Math equation with matrix in 0typ.typ style:
    const text16 = `Equation:
$
    mat(
        cos(theta), -sin(theta);
        sin(theta), cos(theta)
    )
$ <eq:rotation>`;
    const test16 = EvaluateRuleB(text16, "Backspace", 1, 0, 50); // canvas 50
    assert("Matrix in 0typ.typ style breaches canvas -> HARD NO-OP",
        test16 && test16.action === "HARD_NO_OP" && test16.reason === "canvas_limit_breach");

    // Test 17: Backspace at closing $ in 0typ.typ math equation does NOT trigger
    const test17 = EvaluateRuleB(text16, "Backspace", 6, 0, 160);
    assert("Backspace at closing $ in 0typ.typ equation does NOT trigger",
        test17 === null);

    // Test 18: Multiline #set page in 0typ.typ breaches canvas -> HARD NO-OP
    const text18 = `#set page
(
    paper: "a4",
    margin: (x: 1.5cm, top: 2.2cm, bottom: 2.0cm),
    header: context { [] },
)`;
    const test18 = EvaluateRuleB(text18, "Backspace", 1, 0, 80);
    assert("Multiline #set page in 0typ.typ breaches canvas -> HARD NO-OP",
        test18 && test18.action === "HARD_NO_OP" && test18.reason === "canvas_limit_breach");

    // Test 19: Multiline #table in 0typ.typ with nested cells
    const text19 = `#table
(
    columns: (1.2fr, 2fr, 1.2fr),
    fill: (_, row) => if row == 0 { rgb("#1E202E") } else { none },
    stroke: (x, y) => if y == 0 { (bottom: 1.2pt + rgb("#7100FF")) } else { 0.4pt + rgb("#282A36") },
    [*Service / Subsystem*], [*Primary Responsibilities*], [*Target SLA*],
)`;
    const test19 = EvaluateRuleB(text19, "Backspace", 1, 0, 160);
    assert("Multiline #table in 0typ.typ with > 4 statements -> HARD NO-OP",
        test19 && test19.action === "HARD_NO_OP");

    console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed.`);
    return failed === 0;
}

RunTests();

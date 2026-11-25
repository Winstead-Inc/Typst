const assert = require("assert");

function ExtractOutline(source) {
    const lines = source.split(/\r?\n/);
    const outline = [];
    let inRawBlock = false;
    let blockCommentDepth = 0;
    let codeBraceDepth = 0;

    for (let lineNum = 1; lineNum <= lines.length; lineNum++) {
        const lineText = lines[lineNum - 1];
        const trimmed = lineText.trim();

        // 1. Raw blocks ```
        if (trimmed.startsWith("```")) {
            inRawBlock = !inRawBlock;
            continue;
        }
        if (inRawBlock) continue;

        // 2. Track multiline comments and braces
        let masked = "";
        let inStr = false;
        let inLineComment = false;

        for (let i = 0; i < lineText.length; i++) {
            const c = lineText[i];
            const nextC = i + 1 < lineText.length ? lineText[i + 1] : "";
            const prevC = i > 0 ? lineText[i - 1] : "";

            if (inLineComment) break;

            if (c === '"' && prevC !== "\\") {
                inStr = !inStr;
                masked += " ";
                continue;
            }
            if (inStr) {
                masked += " ";
                continue;
            }

            if (c === "/" && nextC === "*") {
                blockCommentDepth++;
                i++;
                masked += "  ";
                continue;
            }
            if (blockCommentDepth > 0 && c === "*" && nextC === "/") {
                blockCommentDepth--;
                i++;
                masked += "  ";
                continue;
            }
            if (blockCommentDepth > 0) {
                masked += " ";
                continue;
            }

            if (c === "/" && nextC === "/") {
                inLineComment = true;
                break;
            }

            if (c === "{") codeBraceDepth++;
            else if (c === "}" && codeBraceDepth > 0) codeBraceDepth--;

            masked += c;
        }

        if (blockCommentDepth > 0) continue;

        const cleanTrimmed = masked.trim();
        if (!cleanTrimmed) continue;

        // 3. Markup headings (only outside code blocks)
        if (codeBraceDepth === 0 && cleanTrimmed.startsWith("=")) {
            const markupMatch = cleanTrimmed.match(/^(=+)\s+(.+)$/);
            if (markupMatch) {
                const level = markupMatch[1].length;
                let title = markupMatch[2].replace(/<[a-zA-Z0-9_\-:]+>\s*$/, "").trim();
                const solMatch = title.match(/#short-or-long\s*\[([^\]]+)\]\s*\[([^\]]+)\]/);
                if (solMatch) title = solMatch[2] || solMatch[1];
                outline.push({ Level: Math.min(level, 4), Title: title, Line: lineNum });
                continue;
            }
        }

        // 4. Programmatic #heading calls
        const progMatch = cleanTrimmed.match(/#heading\b(?:\s*\(([^)]*)\))?\s*(?:\[([^\]]+)\]|"([^"]+)")/);
        if (progMatch) {
            let level = 1;
            const args = progMatch[1] || "";
            const levelMatch = args.match(/\b(?:level|depth)\s*:\s*(\d+)/);
            if (levelMatch) {
                level = parseInt(levelMatch[1], 10);
            }
            const title = (progMatch[2] || progMatch[3] || "Untitled").replace(/<[a-zA-Z0-9_\-:]+>\s*$/, "").trim();
            outline.push({ Level: Math.min(level, 4), Title: title, Line: lineNum });
        }
    }
    return outline;
}

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
`;

const res = ExtractOutline(testDoc);
console.log("Extracted items:", res.length);
console.log(res);

assert.strictEqual(res.length, 4);
assert.strictEqual(res[0].Title, "Main Chapter");
assert.strictEqual(res[0].Level, 1);
assert.strictEqual(res[1].Title, "Section 1.1");
assert.strictEqual(res[1].Level, 2);
assert.strictEqual(res[2].Title, "Programmatic Subheading");
assert.strictEqual(res[2].Level, 3);
assert.strictEqual(res[3].Title, "Introduction");
assert.strictEqual(res[3].Level, 2);
console.log("PASS: Document outline extraction tests succeeded!");

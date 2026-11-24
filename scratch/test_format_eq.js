const fs = require('fs');

function FormatTypstLAFS(Source)
{
    const Lines = (Source || "").split(/\r?\n/);
    const ResultLines = [];
    let InRawBlock = false;
    let CurrentRawLines = [];
    let InBlockComment = false;

    for (let I = 0; I < Lines.length; I++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            if (!InRawBlock)
            {
                InRawBlock = true;
                CurrentRawLines = [];
                ResultLines.push(Line);
            }
            else
            {
                InRawBlock = false;
                ResultLines.push(...CurrentRawLines);
                ResultLines.push(Line);
            }
            continue;
        }

        if (InRawBlock)
        {
            CurrentRawLines.push(Line);
            continue;
        }

        if (Trimmed.startsWith("/*") && !Trimmed.includes("*/"))
        {
            InBlockComment = true;
            ResultLines.push(Line);
            continue;
        }

        if (InBlockComment)
        {
            if (Trimmed.includes("*/")) { InBlockComment = false; }
            ResultLines.push(Line);
            continue;
        }

        if (Trimmed === "" || Trimmed.startsWith("//"))
        {
            ResultLines.push(Line);
            continue;
        }

        // Standalone equals sign on its own line: '='
        // Attach '=' to the end of the previous parameter run or closure signature
        if (Trimmed === "=")
        {
            let Attached = false;
            for (let PrevIdx = ResultLines.length - 1; PrevIdx >= 0; PrevIdx--)
            {
                const PrevTrim = ResultLines[PrevIdx].trim();
                if (PrevTrim === "" || PrevTrim.startsWith("//") || PrevTrim.startsWith("/*"))
                {
                    continue;
                }
                if (PrevTrim.endsWith(")") || PrevTrim.endsWith("]"))
                {
                    ResultLines[PrevIdx] = ResultLines[PrevIdx] + " =";
                    Attached = true;
                }
                break;
            }
            if (Attached)
            {
                continue;
            }
        }

        // If this line is an opening '{' (or starts with '{')
        // Ensure let bindings have '=' attached before '{'
        if (Trimmed === "{" || Trimmed.startsWith("{\n") || Trimmed.startsWith("{ "))
        {
            for (let PrevIdx = ResultLines.length - 1; PrevIdx >= 0; PrevIdx--)
            {
                const PrevTrim = ResultLines[PrevIdx].trim();
                if (PrevTrim === "" || PrevTrim.startsWith("//") || PrevTrim.startsWith("/*"))
                {
                    continue;
                }
                if (PrevTrim.endsWith(")") && !PrevTrim.endsWith("=") && !PrevTrim.endsWith("=>"))
                {
                    let IsLet = false;
                    for (let ScanIdx = PrevIdx; ScanIdx >= 0 && ScanIdx >= PrevIdx - 20; ScanIdx--)
                    {
                        const ScanTrim = ResultLines[ScanIdx].trim();
                        if (ScanTrim.startsWith("#let ") || ScanTrim.startsWith("let "))
                        {
                            IsLet = true;
                            break;
                        }
                        if (ScanTrim.endsWith("}") || ScanTrim.endsWith(";"))
                        {
                            break;
                        }
                    }
                    if (IsLet)
                    {
                        ResultLines[PrevIdx] = ResultLines[PrevIdx] + " =";
                    }
                }
                break;
            }
        }

        // Already pure opening delimiter or compound delimiter run on its own line: '({', '([', '{', '(', '['
        if (/^[\(\[\{]+$/.test(Trimmed))
        {
            ResultLines.push(Line);
            continue;
        }

        // Already pure closing delimiter or compound delimiter run: '})', '])', '}', ')', ']', optionally with trailing punctuation
        if (/^[\)\]\}]+[;,]?$/.test(Trimmed))
        {
            ResultLines.push(Line);
            continue;
        }

        // Typst content literals on their own line: '[(]', '[)]', '[,]', '[.]', '[..]'
        if (/^\s*\[\s*[\(\)\,\.\;\:\-\+\*\/\`]+\s*\][;,]?$/.test(Line))
        {
            ResultLines.push(Line);
            continue;
        }

        // Check if inside string literal or single-line raw block
        if ((Trimmed.startsWith("`") && Trimmed.endsWith("`") && Trimmed.length >= 2) ||
            (Trimmed.startsWith('"') && Trimmed.endsWith('"') && Trimmed.length >= 2))
        {
            ResultLines.push(Line);
            continue;
        }

        // Handle '} else if (...) {' or '} else {'
        const ElseIfMatch = Trimmed.match(/^(\})\s*(else\s+if\s+.*?)(\s*\{)?$/);
        if (ElseIfMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}}`);
            ResultLines.push(`${Indent}${ElseIfMatch[2]}`);
            if (ElseIfMatch[3] || Trimmed.endsWith("{")) { ResultLines.push(`${Indent}{`); }
            continue;
        }

        const ElseMatch = Trimmed.match(/^(\})\s*(else)(\s*\{)?$/);
        if (ElseMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}}`);
            ResultLines.push(`${Indent}else`);
            if (ElseMatch[3] || Trimmed.endsWith("{")) { ResultLines.push(`${Indent}{`); }
            continue;
        }

        // Handle trailing single or compound opening delimiters '{', '(', '({', '([', '[{' on multiline constructs
        const EndsWithDelimiter = Trimmed.match(/^(.*?)(\s*)([\{\(\[]+)\s*$/);
        if (EndsWithDelimiter)
        {
            const Prefix = EndsWithDelimiter[1].trim();
            const Delims = EndsWithDelimiter[3];
            const Indent = Line.match(/^\s*/)[0];

            if (Prefix !== "" && !Prefix.includes("//"))
            {
                const Backticks = (Prefix.match(/`/g) || []).length;
                const Quotes = (Prefix.match(/"/g) || []).length;
                if (Backticks % 2 === 0 && Quotes % 2 === 0)
                {
                    ResultLines.push(`${Indent}${Prefix}`);
                    ResultLines.push(`${Indent}${Delims}`);
                    continue;
                }
            }
        }

        // Handle control flow statements like 'if ... {' or 'while ... {' or 'for ... {'
        const ControlMatch = Trimmed.match(/^(if\s+.*?|while\s+.*?|for\s+.*?|context)\s*\{$/);
        if (ControlMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}${ControlMatch[1]}`);
            ResultLines.push(`${Indent}{`);
            continue;
        }

        ResultLines.push(Line);
    }

    return ResultLines.join("\n");
}

const input1 = `#let params-section
(func, params, returns, base-label, path: auto , indent: false , muted: false ,)
=
{
    body
}`;

const input2 = `#let docs-category
(
    route,
    scope,
    body,
)
=
{
    body
}`;

const input3 = `#let params-section
(func, params, returns, base-label, path: auto , indent: false , muted: false ,)
{
    body
}`;

console.log("=== Output 1 ===");
console.log(FormatTypstLAFS(input1));
console.log("=== Output 2 ===");
console.log(FormatTypstLAFS(input2));
console.log("=== Output 3 ===");
console.log(FormatTypstLAFS(input3));

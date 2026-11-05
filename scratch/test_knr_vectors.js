function DetectKnrSlop(Source, FileName = "main.typ")
{
    const Lines = (Source || "").split(/\r?\n/);
    const Errors = [];

    // First pass: tokenization ignoring strings, raw blocks, comments
    // Track each delimiter: { type, char, line, col, lineText }
    const Stack = [];

    let InString = false;
    let InRawBlock = false;
    let InRawInline = false;
    let BlockCommentDepth = 0;

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx++)
    {
        const LineNum = LineIdx + 1;
        const LineText = Lines[LineIdx];
        let InLineComment = false;

        // Mask comment/string contents for semantic content checks
        let CleanLineChars = [];

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx++)
        {
            const ColNum = ColIdx + 1;
            const Char = LineText[ColIdx];
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1] : "";
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1] : "";

            if (InLineComment)
            {
                CleanLineChars.push(" ");
                continue;
            }

            // Raw blocks ```
            if (!InString && BlockCommentDepth === 0 && Char === "`")
            {
                if (LineText.substring(ColIdx, ColIdx + 3) === "```")
                {
                    InRawBlock = !InRawBlock;
                    ColIdx += 2;
                    CleanLineChars.push(" ", " ", " ");
                    continue;
                }
                else if (!InRawBlock)
                {
                    InRawInline = !InRawInline;
                    CleanLineChars.push(" ");
                    continue;
                }
            }
            if (InRawBlock || InRawInline)
            {
                CleanLineChars.push(" ");
                continue;
            }

            // Block comments /* */
            if (!InString && Char === "/" && NextChar === "*")
            {
                BlockCommentDepth++;
                ColIdx++;
                CleanLineChars.push(" ", " ");
                continue;
            }
            if (!InString && BlockCommentDepth > 0 && Char === "*" && NextChar === "/")
            {
                BlockCommentDepth--;
                ColIdx++;
                CleanLineChars.push(" ", " ");
                continue;
            }
            if (BlockCommentDepth > 0)
            {
                CleanLineChars.push(" ");
                continue;
            }

            // Line comments //
            if (!InString && Char === "/" && NextChar === "/")
            {
                InLineComment = true;
                CleanLineChars.push(" ");
                continue;
            }

            // String literals "..."
            if (Char === '"' && PrevChar !== "\\")
            {
                InString = !InString;
                CleanLineChars.push(" ");
                continue;
            }
            if (InString)
            {
                CleanLineChars.push(" ");
                continue;
            }

            CleanLineChars.push(Char);

            // Container delimiters: (, [, {, and multiline $
            if (Char === "(" || Char === "{" || Char === "[")
            {
                Stack.push
                ({
                    Delim: Char,
                    Line: LineNum,
                    Col: ColNum,
                    LineText: LineText
                });
            }
            else if (Char === ")" || Char === "}" || Char === "]")
            {
                const MatchDelim = Char === ")" ? "(" : (Char === "}" ? "{" : "[");
                let FoundIdx = -1;
                for (let S = Stack.length - 1; S >= 0; S--)
                {
                    if (Stack[S].Delim === MatchDelim)
                    {
                        FoundIdx = S;
                        break;
                    }
                }

                if (FoundIdx !== -1)
                {
                    const Opener = Stack[FoundIdx];
                    Stack.splice(FoundIdx, 1);

                    // Multiline check: if closed on a subsequent line
                    if (LineNum > Opener.Line)
                    {
                        // Check Vector 1 on Opener.Line:
                        // Opener.Line must only contain: optional whitespace + opening delimiter(s) + optional line comment
                        const OpenerCleanLine = GetCleanLineText(Lines[Opener.Line - 1]);
                        const OpenerPrefix = OpenerCleanLine.substring(0, Opener.Col - 1).trim();
                        const OpenerSuffix = OpenerCleanLine.substring(Opener.Col).trim();
                        const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{]/g, "").trim();
                        const OpenerSuffixSemantic = OpenerSuffix.replace(/[\(\[\{]/g, "").trim();

                        if (OpenerPrefixSemantic.length > 0)
                        {
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Delim: Opener.Delim,
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix,
                                Reason: "Preceding Semantic Content on Unpaired Opening Container"
                            });
                        }
                        else if (OpenerSuffixSemantic.length > 0 && !OpenerSuffixSemantic.startsWith("//") && !OpenerSuffixSemantic.startsWith("/*"))
                        {
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Delim: Opener.Delim,
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic,
                                Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                            });
                        }

                        // Check Vector 2 on Closer Line (LineNum):
                        // Closer Line must only contain: optional whitespace + closing delimiter(s) + optional trailing glue (, ; <label>)
                        const CloserCleanLine = GetCleanLineText(LineText);
                        const CloserPrefix = CloserCleanLine.substring(0, ColNum - 1).trim();
                        const CloserSuffix = CloserCleanLine.substring(ColNum).trim();
                        const CloserPrefixSemantic = CloserPrefix.replace(/[\)\]\}]/g, "").trim();
                        const CloserSuffixSemantic = CloserSuffix.replace(/[\)\]\}]/g, "").trim();

                        if (CloserPrefixSemantic.length > 0)
                        {
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Delim: Char,
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: CloserPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefix,
                                Reason: "Preceding Semantic Content on Unpaired Closing Container"
                            });
                        }
                        else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>|\/\/|\/\*)/.test(CloserSuffixSemantic))
                        {
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Delim: Char,
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic,
                                Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                            });
                        }
                    }
                }
            }
        }
    }

    // Helper to strip comments from a line for clean prefix/suffix checking
    function GetCleanLineText(Txt)
    {
        if (!Txt) return "";
        let Clean = "";
        let InStr = false;
        for (let I = 0; I < Txt.length; I++)
        {
            const C = Txt[I];
            const NextC = I + 1 < Txt.length ? Txt[I + 1] : "";
            const PrevC = I > 0 ? Txt[I - 1] : "";
            if (C === '"' && PrevC !== "\\") { InStr = !InStr; Clean += " "; continue; }
            if (InStr) { Clean += " "; continue; }
            if (C === "/" && NextC === "/") { break; }
            Clean += C;
        }
        return Clean;
    }

    // Remaining unclosed openers that span lines
    for (const Opener of Stack)
    {
        if (Lines.length > Opener.Line)
        {
            const OpenerCleanLine = GetCleanLineText(Lines[Opener.Line - 1]);
            const OpenerPrefix = OpenerCleanLine.substring(0, Opener.Col - 1).trim();
            if (OpenerPrefix.length > 0)
            {
                Errors.push
                ({
                    Type: "KNR_SLOP_VECTOR_1_PRECEDING",
                    Vector: 1,
                    Delim: Opener.Delim,
                    Line: Opener.Line,
                    Col: Opener.Col,
                    LineText: Lines[Opener.Line - 1],
                    Anchor: OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix,
                    Reason: "Preceding Semantic Content on Unpaired Opening Container"
                });
            }
        }
    }

    return Errors;
}

// Test cases
console.log("=== Test 1: Clean LAFS in Math ===");
const test1 = [
    "$",
    "  mat",
    "  (",
    "    1, 2;",
    "    3, 4",
    "  )",
    "$"
].join("\n");
console.log("Errors:", DetectKnrSlop(test1));

console.log("\n=== Test 2: K&R Slop in Math (mat() attached) ===");
const test2 = [
    "$",
    "  mat(",
    "    1, 2;",
    "    3, 4",
    "  )",
    "$"
].join("\n");
console.log("Errors:", DetectKnrSlop(test2));

console.log("\n=== Test 3: K&R Slop in Math (closing hug 3, 4 ) ) ===");
const test3 = [
    "$",
    "  mat",
    "  (",
    "    1, 2;",
    "    3, 4 )",
    "$"
].join("\n");
console.log("Errors:", DetectKnrSlop(test3));

console.log("\n=== Test 4: Monolith in Math (legal) ===");
const test4 = [
    "$mat(1, 2; 3, 4)$",
    "$vec(x, y, 1)$"
].join("\n");
console.log("Errors:", DetectKnrSlop(test4));

console.log("\n=== Test 5: K&R Slop in Math (opening with proceeding content) ===");
const test5 = [
    "$",
    "  mat",
    "  ( 1, 2;",
    "    3, 4",
    "  )",
    "$"
].join("\n");
console.log("Errors:", DetectKnrSlop(test5));

console.log("\n=== Test 6: K&R Slop in Code (#set text(font: ...) multiline) ===");
const test6 = [
    "#set text(",
    "    font: \"Liberation Sans\",",
    "    size: 11pt",
    ")"
].join("\n");
console.log("Errors:", DetectKnrSlop(test6));

console.log("\n=== Test 7: Compound Container Grouping [{( ... )}] (legal LAFS) ===");
const test7 = [
    "table.cell",
    "[{(",
    '  "SecurityModule",',
    '  "DatabaseDriver"',
    ")}]"
].join("\n");
console.log("Errors:", DetectKnrSlop(test7));

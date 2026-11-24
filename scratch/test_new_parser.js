const fs = require("fs");

function TestParser(Source, FileName = "main.typ")
{
    const Lines = (Source || "").split(/\r?\n/);
    const Errors = [];
    const Stack = [];

    let InString = false;
    let InRawBlock = false;
    let InRawInline = false;
    let BlockCommentDepth = 0;
    const MaskCache = new Map();

    function IsEscaped(Str, Idx)
    {
        let SlashCount = 0;
        for (let I = Idx - 1; I >= 0 && Str[I] === "\\"; I--)
        {
            SlashCount++;
        }
        return SlashCount % 2 === 1;
    }

    function GetMaskedLine(LineText)
    {
        const Cached = MaskCache.get(LineText);
        if (Cached !== undefined) { return Cached; }

        let Masked = "";
        let InStr = false;
        for (let I = 0; I < LineText.length; I++)
        {
            const C = LineText[I];
            const NextC = I + 1 < LineText.length ? LineText[I + 1] : "";
            if (C === '"' && !IsEscaped(LineText, I))
            {
                InStr = !InStr;
                Masked += " ";
                continue;
            }
            if (InStr)
            {
                Masked += " ";
                continue;
            }
            if (C === "/" && NextC === "/" && !IsEscaped(LineText, I))
            {
                Masked += " ".repeat(LineText.length - I);
                break;
            }
            Masked += C;
        }
        MaskCache.set(LineText, Masked);
        return Masked;
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx++)
    {
        const LineNum = LineIdx + 1;
        const LineText = Lines[LineIdx];
        let InLineComment = false;

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx++)
        {
            const ColNum = ColIdx + 1;
            const Char = LineText[ColIdx];
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1] : "";

            if (InLineComment) { break; }

            // Escaped characters in Typst: \(, \), \[, \], \{, \}, \$, \", \`
            if (IsEscaped(LineText, ColIdx))
            {
                continue;
            }

            // Raw blocks ```
            if (!InString && BlockCommentDepth === 0 && Char === "`")
            {
                if (LineText.substring(ColIdx, ColIdx + 3) === "```")
                {
                    InRawBlock = !InRawBlock;
                    ColIdx += 2;
                    continue;
                }
                else if (!InRawBlock)
                {
                    InRawInline = !InRawInline;
                    continue;
                }
            }
            if (InRawBlock || InRawInline) { continue; }

            // Block comments /* */
            if (!InString && Char === "/" && NextChar === "*")
            {
                BlockCommentDepth++;
                ColIdx++;
                continue;
            }
            if (!InString && BlockCommentDepth > 0 && Char === "*" && NextChar === "/")
            {
                BlockCommentDepth--;
                ColIdx++;
                continue;
            }
            if (BlockCommentDepth > 0) { continue; }

            // Line comments //
            if (!InString && Char === "/" && NextChar === "/")
            {
                InLineComment = true;
                break;
            }

            // String literals "..."
            if (Char === '"')
            {
                InString = !InString;
                continue;
            }
            if (InString) { continue; }

            // Multiline display math container: $
            if (Char === "$")
            {
                if (Stack.length > 0 && Stack[Stack.length - 1].Delim === "$")
                {
                    const Opener = Stack.pop();
                    if (LineNum > Opener.Line)
                    {
                        const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                        const MaskedCloserLine = GetMaskedLine(LineText);

                        const OpenerPrefixSemantic = MaskedOpenerLine.substring(0, Opener.Col - 1).replace(/[\(\[\{\$]/g, "").trim();
                        const OpenerSuffixSemantic = MaskedOpenerLine.substring(Opener.Col).replace(/[\(\[\{\$]/g, "").trim();

                        if (OpenerPrefixSemantic.length > 0)
                        {
                            const Anchor = OpenerPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefixSemantic;
                            Errors.push({ Type: "KNR_SLOP", Vector: 1, Subtype: "PRECEDING", Delim: "$", Line: Opener.Line, Col: Opener.Col, LineText: Lines[Opener.Line - 1], Anchor: Anchor, Reason: "Preceding Semantic Content on Unpaired Opening Container" });
                        }
                        else if (OpenerSuffixSemantic.length > 0)
                        {
                            const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                            Errors.push({ Type: "KNR_SLOP", Vector: 1, Subtype: "PROCEEDING", Delim: "$", Line: Opener.Line, Col: Opener.Col, LineText: Lines[Opener.Line - 1], Anchor: Anchor, Reason: "Proceeding Semantic Content on Unpaired Opening Container" });
                        }

                        const CloserPrefixSemantic = MaskedCloserLine.substring(0, ColNum - 1).replace(/[\)\]\}\$]/g, "").trim();
                        const CloserSuffixSemantic = MaskedCloserLine.substring(ColNum).replace(/[\)\]\}\$]/g, "").trim();

                        if (CloserPrefixSemantic.length > 0)
                        {
                            const Anchor = CloserPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefixSemantic;
                            Errors.push({ Type: "KNR_SLOP", Vector: 2, Subtype: "PRECEDING", Delim: "$", Line: LineNum, Col: ColNum, LineText: LineText, Anchor: Anchor, Reason: "Preceding Semantic Content on Unpaired Closing Container" });
                        }
                        else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                        {
                            const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                            Errors.push({ Type: "KNR_SLOP", Vector: 2, Subtype: "PROCEEDING", Delim: "$", Line: LineNum, Col: ColNum, LineText: LineText, Anchor: Anchor, Reason: "Proceeding Semantic Content on Unpaired Closing Container" });
                        }
                    }
                }
                else
                {
                    Stack.push({ Delim: "$", Line: LineNum, Col: ColNum, LineText: LineText });
                }
                continue;
            }

            // Standard containers: (, [, {
            if (Char === "(" || Char === "{" || Char === "[")
            {
                Stack.push({ Delim: Char, Line: LineNum, Col: ColNum, LineText: LineText });
            }
            else if (Char === ")" || Char === "}" || Char === "]")
            {
                const MatchDelim = Char === ")" ? "(" : (Char === "}" ? "{" : "[");

                // Check if closing delimiter matches top of stack
                if (Stack.length > 0 && Stack[Stack.length - 1].Delim === MatchDelim)
                {
                    const Opener = Stack.pop();
                    if (LineNum === Opener.Line) { continue; }

                    const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                    const MaskedCloserLine = GetMaskedLine(LineText);

                    const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
                    const OpenerSuffix = MaskedOpenerLine.substring(Opener.Col).trim();
                    const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
                    const OpenerSuffixSemantic = OpenerSuffix.replace(/[\(\[\{\$]/g, "").trim();

                    if (OpenerPrefixSemantic.length > 0)
                    {
                        const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                        Errors.push({ Type: "KNR_SLOP", Vector: 1, Subtype: "PRECEDING", Delim: Opener.Delim, Line: Opener.Line, Col: Opener.Col, LineText: Lines[Opener.Line - 1], Anchor: Anchor, Reason: "Preceding Semantic Content on Unpaired Opening Container" });
                    }
                    else if (OpenerSuffixSemantic.length > 0)
                    {
                        const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                        Errors.push({ Type: "KNR_SLOP", Vector: 1, Subtype: "PROCEEDING", Delim: Opener.Delim, Line: Opener.Line, Col: Opener.Col, LineText: Lines[Opener.Line - 1], Anchor: Anchor, Reason: "Proceeding Semantic Content on Unpaired Opening Container" });
                    }

                    const CloserPrefix = MaskedCloserLine.substring(0, ColNum - 1).trim();
                    const CloserSuffix = MaskedCloserLine.substring(ColNum).trim();
                    const CloserPrefixSemantic = CloserPrefix.replace(/[\)\]\}\$]/g, "").trim();
                    const CloserSuffixSemantic = CloserSuffix.replace(/[\)\]\}\$]/g, "").trim();

                    if (CloserPrefixSemantic.length > 0)
                    {
                        const Anchor = CloserPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefix;
                        Errors.push({ Type: "KNR_SLOP", Vector: 2, Subtype: "PRECEDING", Delim: Char, Line: LineNum, Col: ColNum, LineText: LineText, Anchor: Anchor, Reason: "Preceding Semantic Content on Unpaired Closing Container" });
                    }
                    // Allow legal suffix glue: commas, semicolons, labels, method chaining (.filter(...)), assignment (=, = context), concatenation (+)
                    else if (CloserSuffixSemantic.length > 0 && !/^(,|;|\.|=|\+|as\b|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                    {
                        const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                        Errors.push({ Type: "KNR_SLOP", Vector: 2, Subtype: "PROCEEDING", Delim: Char, Line: LineNum, Col: ColNum, LineText: LineText, Anchor: Anchor, Reason: "Proceeding Semantic Content on Unpaired Closing Container" });
                    }
                }
                else
                {
                    // Typst-aware content mode delimiter recovery:
                    // 1. If ']' closes an enclosing '[', discard any content-mode '(' or '{' inside that '['
                    if (Char === "]")
                    {
                        let BracketIdx = -1;
                        for (let SIdx = Stack.length - 1; SIdx >= 0; SIdx--)
                        {
                            if (Stack[SIdx].Delim === "[")
                            {
                                BracketIdx = SIdx;
                                break;
                            }
                        }
                        if (BracketIdx !== -1)
                        {
                            // Pop any nested text delimiters inside this content block
                            while (Stack.length > BracketIdx + 1)
                            {
                                Stack.pop();
                            }
                            const Opener = Stack.pop();
                            if (LineNum === Opener.Line) { continue; }
                            // Multiline content block evaluation
                            const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                            const MaskedCloserLine = GetMaskedLine(LineText);
                            const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
                            const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
                            if (OpenerPrefixSemantic.length > 0)
                            {
                                const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                                Errors.push({ Type: "KNR_SLOP", Vector: 1, Subtype: "PRECEDING", Delim: "[", Line: Opener.Line, Col: Opener.Col, LineText: Lines[Opener.Line - 1], Anchor: Anchor, Reason: "Preceding Semantic Content on Unpaired Opening Container" });
                            }
                            continue;
                        }
                    }

                    // 2. If ')' or '}' is encountered inside a content block '[' where no matching '(' or '{' was opened inside that block,
                    // in Typst markup mode it is literal text (e.g. '[)]', '[:)]', '[1) point]')
                    let InsideContentBlock = false;
                    for (let SIdx = Stack.length - 1; SIdx >= 0; SIdx--)
                    {
                        if (Stack[SIdx].Delim === "[")
                        {
                            InsideContentBlock = true;
                            break;
                        }
                    }
                    if (InsideContentBlock && (Char === ")" || Char === "}"))
                    {
                        // Literal punctuation in content block - not a syntax container error
                        continue;
                    }

                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "MISMATCH",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Char,
                        Reason: "Mismatched Closing Container not mirrored in the Opening Run"
                    });
                }
            }
        }
    }

    return { HasError: Errors.length > 0, Errors: Errors };
}

const sampleCode = fs.readFileSync("scratch/user_sample.typ", "utf8");
const res = TestParser(sampleCode, "user_sample.typ");
console.log("=== NEW PARSER ON USER SAMPLE ===");
console.log("HasError:", res.HasError);
console.log("Errors count:", res.Errors.length);
if (res.HasError) {
    res.Errors.forEach((e, idx) => {
        console.log(`[#${idx+1}] Line ${e.Line}:${e.Col} (${e.Delim}) Vector ${e.Vector} Subtype ${e.Subtype}: ${e.Reason} | LineText: "${e.LineText}"`);
    });
}

const knr = 'if (x > 1) {\n    return 42;\n}';
const resKnr = TestParser(knr);
console.log('K&R check HasError:', resKnr.HasError, 'Reason:', resKnr.Errors[0]?.Reason);

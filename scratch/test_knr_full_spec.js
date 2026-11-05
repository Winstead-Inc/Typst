const fs = require("fs");

function DetectKnrSlop(Source, FileName = "main.typ")
{
    const Lines = (Source || "").split(/\r?\n/);
    const Errors = [];

    // Stack holds active openers: { Delim, Line, Col, LineText }
    const Stack = [];

    let InString = false;
    let InRawBlock = false;
    let InRawInline = false;
    let BlockCommentDepth = 0;

    // Helper to get clean line text with strings/comments masked
    function GetMaskedLine(LineText)
    {
        let Masked = "";
        let InStr = false;
        for (let I = 0; I < LineText.length; I++)
        {
            const C = LineText[I];
            const NextC = I + 1 < LineText.length ? LineText[I + 1] : "";
            const PrevC = I > 0 ? LineText[I - 1] : "";
            if (C === '"' && PrevC !== "\\")
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
            if (C === "/" && NextC === "/")
            {
                Masked += " ".repeat(LineText.length - I);
                break;
            }
            Masked += C;
        }
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
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1] : "";

            if (InLineComment) { break; }

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
            if (Char === '"' && PrevChar !== "\\")
            {
                InString = !InString;
                continue;
            }
            if (InString) { continue; }

            // Multiline display math container: $
            if (Char === "$" && PrevChar !== "\\")
            {
                if (Stack.length > 0 && Stack[Stack.length - 1].Delim === "$")
                {
                    // Closer for $
                    const Opener = Stack.pop();
                    if (LineNum > Opener.Line)
                    {
                        // Multiline math container: evaluate Vector 1 and Vector 2
                        const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                        const MaskedCloserLine = GetMaskedLine(LineText);

                        const OpenerPrefixSemantic = MaskedOpenerLine.substring(0, Opener.Col - 1).replace(/[\(\[\{\$]/g, "").trim();
                        const OpenerSuffixSemantic = MaskedOpenerLine.substring(Opener.Col).replace(/[\(\[\{\$]/g, "").trim();

                        if (OpenerPrefixSemantic.length > 0)
                        {
                            const Anchor = OpenerPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Subtype: "PRECEDING",
                                Delim: "$",
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: Anchor,
                                Reason: "Preceding Semantic Content on Unpaired Opening Container"
                            });
                        }
                        else if (OpenerSuffixSemantic.length > 0)
                        {
                            const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Subtype: "PROCEEDING",
                                Delim: "$",
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: Anchor,
                                Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                            });
                        }

                        const CloserPrefixSemantic = MaskedCloserLine.substring(0, ColNum - 1).replace(/[\)\]\}\$]/g, "").trim();
                        const CloserSuffixSemantic = MaskedCloserLine.substring(ColNum).replace(/[\)\]\}\$]/g, "").trim();

                        if (CloserPrefixSemantic.length > 0)
                        {
                            const Anchor = CloserPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Subtype: "PRECEDING",
                                Delim: "$",
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: Anchor,
                                Reason: "Preceding Semantic Content on Unpaired Closing Container"
                            });
                        }
                        else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                        {
                            const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Subtype: "PROCEEDING",
                                Delim: "$",
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: Anchor,
                                Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                            });
                        }
                    }
                }
                else
                {
                    // Opener for $
                    Stack.push
                    ({
                        Delim: "$",
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText
                    });
                }
                continue;
            }

            // Standard containers: (, [, {
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

                if (Stack.length === 0 || Stack[Stack.length - 1].Delim !== MatchDelim)
                {
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
                    continue;
                }

                const Opener = Stack.pop();

                // Monolith Check: Same line openers and closers are valid Monoliths
                if (LineNum === Opener.Line)
                {
                    continue;
                }

                // Multiline container: Evaluate Vector 1 (Opener line) and Vector 2 (Closer line)
                const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                const MaskedCloserLine = GetMaskedLine(LineText);

                // --- VECTOR 1 EVALUATION (Opening Container Line) ---
                const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
                const OpenerSuffix = MaskedOpenerLine.substring(Opener.Col).trim();
                const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
                const OpenerSuffixSemantic = OpenerSuffix.replace(/[\(\[\{\$]/g, "").trim();

                if (OpenerPrefixSemantic.length > 0)
                {
                    const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 1,
                        Subtype: "PRECEDING",
                        Delim: Opener.Delim,
                        Line: Opener.Line,
                        Col: Opener.Col,
                        LineText: Lines[Opener.Line - 1],
                        Anchor: Anchor,
                        Reason: "Preceding Semantic Content on Unpaired Opening Container"
                    });
                }
                else if (OpenerSuffixSemantic.length > 0)
                {
                    const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 1,
                        Subtype: "PROCEEDING",
                        Delim: Opener.Delim,
                        Line: Opener.Line,
                        Col: Opener.Col,
                        LineText: Lines[Opener.Line - 1],
                        Anchor: Anchor,
                        Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                    });
                }

                // --- VECTOR 2 EVALUATION (Closing Container Line) ---
                const CloserPrefix = MaskedCloserLine.substring(0, ColNum - 1).trim();
                const CloserSuffix = MaskedCloserLine.substring(ColNum).trim();
                const CloserPrefixSemantic = CloserPrefix.replace(/[\)\]\}\$]/g, "").trim();
                const CloserSuffixSemantic = CloserSuffix.replace(/[\)\]\}\$]/g, "").trim();

                if (CloserPrefixSemantic.length > 0)
                {
                    const Anchor = CloserPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefix;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "PRECEDING",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Anchor,
                        Reason: "Preceding Semantic Content on Unpaired Closing Container"
                    });
                }
                else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                {
                    const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "PROCEEDING",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Anchor,
                        Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                    });
                }
            }
        }
    }

    // Remaining unclosed openers that span beyond end of file
    for (const Opener of Stack)
    {
        if (Lines.length > Opener.Line)
        {
            const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
            const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
            const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
            if (OpenerPrefixSemantic.length > 0)
            {
                const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                Errors.push
                ({
                    Type: "KNR_SLOP",
                    Vector: 1,
                    Subtype: "PRECEDING",
                    Delim: Opener.Delim,
                    Line: Opener.Line,
                    Col: Opener.Col,
                    LineText: Lines[Opener.Line - 1],
                    Anchor: Anchor,
                    Reason: "Preceding Semantic Content on Unpaired Opening Container"
                });
            }
        }
    }

    // Deduplicate errors by Line + Col + Vector + Subtype
    const UniqueErrors = [];
    const SeenKeys = new Set();
    for (const Err of Errors)
    {
        const Key = `${Err.Line}:${Err.Col}:${Err.Vector}:${Err.Subtype}`;
        if (!SeenKeys.has(Key))
        {
            SeenKeys.add(Key);
            UniqueErrors.push(Err);
        }
    }

    if (UniqueErrors.length === 0)
    {
        return { HasError: false, Errors: [] };
    }

    const First = UniqueErrors[0];
    const LineStr = String(First.Line);
    const Margin = " ".repeat(Math.max(2, LineStr.length));
    const FormattedLineNum = LineStr.padStart(Margin.length, " ");
    const PointerIndent = " ".repeat(Math.max(0, First.Col - 1));
    const AnchorTarget = First.Anchor ? `'${First.Anchor}'` : "the statement";

    let ActionHint = "";
    if (First.Vector === 1)
    {
        if (First.Subtype === "PRECEDING")
        {
            ActionHint = `Move opening container '${First.Delim}' to a new line aligned with ${AnchorTarget} and indent it properly if needed`;
        }
        else
        {
            ActionHint = `Move semantic content proceeding '${First.Delim}' to a new line indented within the container`;
        }
    }
    else if (First.Vector === 2)
    {
        if (First.Subtype === "PRECEDING")
        {
            ActionHint = `Move closing container '${First.Delim}' to a new line aligned with the opening container`;
        }
        else if (First.Subtype === "PROCEEDING")
        {
            ActionHint = `Move semantic content proceeding '${First.Delim}' to a new line`;
        }
        else if (First.Subtype === "MISMATCH")
        {
            ActionHint = `Closing container '${First.Delim}' does not mirror the opening container run in reverse sequence`;
        }
        else
        {
            ActionHint = `Format closing container '${First.Delim}' onto its own coordinate-aligned line`;
        }
    }
    else
    {
        ActionHint = `Move container '${First.Delim}' to a new line aligned with ${AnchorTarget} and indent it properly if needed`;
    }

    const FormattedMessage =
`error: Severe Critical Fatal Error & Structural Failure: Defecated (Deprecated | Outdated | Legacy) Structural Failure of 1978 K&R Slop detected: Headless multiline container: Container Asymmetry & Ugly Formatting are strictly Forbidden.
${Margin}┌─ ${FileName}:${First.Line}:${First.Col}
${Margin}│
${FormattedLineNum}│ ${First.LineText}
${Margin}│${PointerIndent}^ ${ActionHint}
${Margin}│
Hint: Click the button "Format LAFS" to fix it.`;

    return {
        HasError: true,
        Errors: UniqueErrors,
        PrimaryError: First,
        FormattedMessage: FormattedMessage
    };
}

module.exports = { DetectKnrSlop };

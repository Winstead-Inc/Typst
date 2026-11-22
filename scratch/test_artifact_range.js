// Test artifact range detection
function FindEnclosingArtifactRange(SourceText, CursorUtf16Offset)
{
    if (!SourceText || typeof CursorUtf16Offset !== "number" || CursorUtf16Offset < 0 || CursorUtf16Offset > SourceText.length)
    {
        return null;
    }

    // 1. Find paragraph boundaries strictly delimited by \n\s*\n or document boundaries
    let ParStart = 0;
    const PrevBreak = SourceText.lastIndexOf("\n\n", CursorUtf16Offset - 1);
    if (PrevBreak !== -1)
    {
        ParStart = PrevBreak + 2;
    }
    else
    {
        const PrevCrLfBreak = SourceText.lastIndexOf("\r\n\r\n", CursorUtf16Offset - 1);
        if (PrevCrLfBreak !== -1)
        {
            ParStart = PrevCrLfBreak + 4;
        }
    }

    let ParEnd = SourceText.length;
    const NextBreak = SourceText.indexOf("\n\n", CursorUtf16Offset);
    if (NextBreak !== -1)
    {
        ParEnd = NextBreak;
    }
    else
    {
        const NextCrLfBreak = SourceText.indexOf("\r\n\r\n", CursorUtf16Offset);
        if (NextCrLfBreak !== -1)
        {
            ParEnd = NextCrLfBreak;
        }
    }

    // Trim paragraph start of blank newlines or leading whitespace if any
    while (ParStart < ParEnd && (SourceText[ParStart] === "\r" || SourceText[ParStart] === "\n"))
    {
        ParStart++;
    }
    while (ParEnd > ParStart && (SourceText[ParEnd - 1] === "\r" || SourceText[ParEnd - 1] === "\n"))
    {
        ParEnd--;
    }

    if (ParStart >= ParEnd)
    {
        return null;
    }

    const ParText = SourceText.slice(ParStart, ParEnd);
    const RelCursor = CursorUtf16Offset - ParStart;

    // 2. Scan for enclosing delimiter pairs within ParText
    const Candidates = [];

    // Helper to check if a single quote at index I in ParText is an apostrophe
    function IsApostrophe(Str, Idx)
    {
        const Ch = Str[Idx];
        if (Ch !== "'" && Ch !== "\u2019") // ' or right single quotation mark
        {
            return false;
        }
        const Prev = Idx > 0 ? Str[Idx - 1] : "";
        const Next = Idx + 1 < Str.length ? Str[Idx + 1] : "";

        // Intra-word apostrophe: \w['’]\w (e.g. Foxtrot's, don't, king's)
        if (/\w/.test(Prev) && /\w/.test(Next))
        {
            return true;
        }
        // Trailing possessive: [sS]['’] followed by non-word or end (e.g. delegates', kids')
        if (/[sS]/.test(Prev) && (!Next || /[\s\p{P}]/u.test(Next)))
        {
            return true;
        }
        return false;
    }

    // A. Double quotes: "..." and “...” (\u201C and \u201D)
    // Match straight double quotes "..."
    let InQuote = false;
    let QuoteStart = -1;
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === '"' && (I === 0 || ParText[I - 1] !== "\\"))
        {
            if (!InQuote)
            {
                InQuote = true;
                QuoteStart = I;
            }
            else
            {
                Candidates.push({ Start: QuoteStart, End: I + 1 });
                InQuote = false;
                QuoteStart = -1;
            }
        }
    }

    // Match smart curly quotes “...” (\u201C ... \u201D)
    let SmartOpen = -1;
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === "\u201C")
        {
            SmartOpen = I;
        }
        else if (ParText[I] === "\u201D" && SmartOpen !== -1)
        {
            Candidates.push({ Start: SmartOpen, End: I + 1 });
            SmartOpen = -1;
        }
    }

    // B. Single quotes (excluding apostrophes): '...' and ‘...’ (\u2018 ... \u2019)
    let InSingle = false;
    let SingleStart = -1;
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === "'" && !IsApostrophe(ParText, I) && (I === 0 || ParText[I - 1] !== "\\"))
        {
            if (!InSingle)
            {
                InSingle = true;
                SingleStart = I;
            }
            else
            {
                Candidates.push({ Start: SingleStart, End: I + 1 });
                InSingle = false;
                SingleStart = -1;
            }
        }
    }

    // Smart single curly quotes ‘...’ (\u2018 ... \u2019), excluding apostrophes
    let SmartSingleOpen = -1;
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === "\u2018" && !IsApostrophe(ParText, I))
        {
            SmartSingleOpen = I;
        }
        else if (ParText[I] === "\u2019" && !IsApostrophe(ParText, I) && SmartSingleOpen !== -1)
        {
            Candidates.push({ Start: SmartSingleOpen, End: I + 1 });
            SmartSingleOpen = -1;
        }
    }

    // C. Content brackets [...] with nesting
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === "[" && (I === 0 || ParText[I - 1] !== "\\"))
        {
            let Depth = 1;
            let J = I + 1;
            while (J < ParText.length && Depth > 0)
            {
                if (ParText[J] === "[" && ParText[J - 1] !== "\\") Depth++;
                else if (ParText[J] === "]" && ParText[J - 1] !== "\\") Depth--;
                J++;
            }
            if (Depth === 0)
            {
                Candidates.push({ Start: I, End: J });
            }
        }
    }

    // D. Math $...$
    let InMath = false;
    let MathStart = -1;
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === "$" && (I === 0 || ParText[I - 1] !== "\\"))
        {
            if (!InMath)
            {
                InMath = true;
                MathStart = I;
            }
            else
            {
                Candidates.push({ Start: MathStart, End: I + 1 });
                InMath = false;
                MathStart = -1;
            }
        }
    }

    // E. Code `...`
    let InCode = false;
    let CodeStart = -1;
    for (let I = 0; I < ParText.length; I++)
    {
        if (ParText[I] === "`" && (I === 0 || ParText[I - 1] !== "\\"))
        {
            if (!InCode)
            {
                InCode = true;
                CodeStart = I;
            }
            else
            {
                Candidates.push({ Start: CodeStart, End: I + 1 });
                InCode = false;
                CodeStart = -1;
            }
        }
    }

    // F. Formatting *...* and _..._
    const FormatDelims = ["*", "_"];
    for (const Delim of FormatDelims)
    {
        let InFmt = false;
        let FmtStart = -1;
        for (let I = 0; I < ParText.length; I++)
        {
            if (ParText[I] === Delim && (I === 0 || ParText[I - 1] !== "\\"))
            {
                if (!InFmt)
                {
                    InFmt = true;
                    FmtStart = I;
                }
                else
                {
                    Candidates.push({ Start: FmtStart, End: I + 1 });
                    InFmt = false;
                    FmtStart = -1;
                }
            }
        }
    }

    // 3. Find innermost candidate that strictly encloses RelCursor
    let BestCandidate = null;
    let BestLen = Infinity;

    for (const Cand of Candidates)
    {
        // Enclosing check: RelCursor must be inside [Cand.Start, Cand.End]
        if (RelCursor >= Cand.Start && RelCursor <= Cand.End)
        {
            const Len = Cand.End - Cand.Start;
            if (Len < BestLen)
            {
                BestLen = Len;
                BestCandidate = Cand;
            }
        }
    }

    if (BestCandidate)
    {
        return {
            StartOffsetUtf16: ParStart + BestCandidate.Start,
            EndOffsetUtf16: ParStart + BestCandidate.End,
            IsArtifact: true
        };
    }

    // 4. Fallback: expand strictly to the current paragraph
    return {
        StartOffsetUtf16: ParStart,
        EndOffsetUtf16: ParEnd,
        IsArtifact: false
    };
}

// Tests
const testDoc = `Line 1 preamble

Foxtrot's words—"The vanguard is with you"—still seemed to vibrate in the cool dawn air.

"God help us," he muttered. "Sign your names, gentlemen."

[CHAPTER FIVE]
`;

console.log("--- Test 1: Inside quote with apostrophe and em-dash ---");
const quotePos = testDoc.indexOf("The vanguard");
const res1 = FindEnclosingArtifactRange(testDoc, quotePos);
console.log("Matched 1:", JSON.stringify(testDoc.slice(res1.StartOffsetUtf16, res1.EndOffsetUtf16)));

console.log("--- Test 2: Outside quote on Foxtrot's words ---");
const foxtrotPos = testDoc.indexOf("Foxtrot's");
const res2 = FindEnclosingArtifactRange(testDoc, foxtrotPos);
console.log("Matched 2:", JSON.stringify(testDoc.slice(res2.StartOffsetUtf16, res2.EndOffsetUtf16)));

console.log("--- Test 3: First quote on line with two quotes ---");
const godPos = testDoc.indexOf("God help us");
const res3 = FindEnclosingArtifactRange(testDoc, godPos);
console.log("Matched 3:", JSON.stringify(testDoc.slice(res3.StartOffsetUtf16, res3.EndOffsetUtf16)));

console.log("--- Test 4: Second quote on line with two quotes ---");
const signPos = testDoc.indexOf("Sign your names");
const res4 = FindEnclosingArtifactRange(testDoc, signPos);
console.log("Matched 4:", JSON.stringify(testDoc.slice(res4.StartOffsetUtf16, res4.EndOffsetUtf16)));

console.log("--- Test 5: Outside quote on narrator text 'he muttered' ---");
const mutteredPos = testDoc.indexOf("he muttered");
const res5 = FindEnclosingArtifactRange(testDoc, mutteredPos);
console.log("Matched 5:", JSON.stringify(testDoc.slice(res5.StartOffsetUtf16, res5.EndOffsetUtf16)));

console.log("--- Test 6: Inside [CHAPTER FIVE] ---");
const chapPos = testDoc.indexOf("CHAPTER");
const res6 = FindEnclosingArtifactRange(testDoc, chapPos);
console.log("Matched 6:", JSON.stringify(testDoc.slice(res6.StartOffsetUtf16, res6.EndOffsetUtf16)));

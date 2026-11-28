use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Container_Token_Type
{
    Paren,
    Bracket,
    Brace,
    Math,
    RawInline,
    RawBlock,
    SqlBlock,
    TripleQuote,
}

#[derive(Debug, Clone)]
pub struct Container_Token
{
    pub token_type: Container_Token_Type,
    pub glyph: String,
    pub line: usize,
    pub col: usize,
    pub is_opener: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Container_Action_Request
{
    pub text: String,
    pub key: String,
    pub line: usize,
    pub col: usize,
    pub canvas_limit: usize,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Container_Action_Response
{
    pub handled: bool,
    pub action: String,
    pub reason: String,
    pub result_text: Option<String>,
    pub cursor_line: usize,
    pub cursor_col: usize,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct Raw_Line_Context
{
    is_fence_line: bool,
    in_non_typst_raw: bool,
}

#[derive(Debug, Clone)]
struct Fence_Frame
{
    ticks: usize,
    is_typst_raw: bool,
}

fn SplitDocHarnessPrefix(Line: &str) -> (&str, &str)
{
    let IndentLen = Line.bytes().take_while(|&B| B == b' ' || B == b'\t').count();
    let AfterIndent = &Line[IndentLen..];
    for Marker in [">>>", "<<<"]
    {
        if let Some(AfterMarker) = AfterIndent.strip_prefix(Marker)
        {
            let SameChar = Marker.as_bytes()[0];
            if AfterMarker.as_bytes().first() == Some(&SameChar)
            {
                continue;
            }
            let SpaceLen = usize::from(AfterMarker.as_bytes().first() == Some(&b' '));
            let PrefixLen = IndentLen + Marker.len() + SpaceLen;
            return (&Line[..PrefixLen], &Line[PrefixLen..]);
        }
    }
    ("", Line)
}

fn HasDocHarnessPrefix(Line: &str) -> bool
{
    !SplitDocHarnessPrefix(Line).0.is_empty()
}

fn ParseFenceStart(Line: &str) -> Option<(usize, String)>
{
    let IndentLen = Line.bytes().take_while(|&B| B == b' ' || B == b'\t').count();
    let AfterIndent = &Line[IndentLen..];
    let Ticks = AfterIndent.bytes().take_while(|&B| B == b'`').count();
    if Ticks < 3
    {
        return None;
    }
    let Rest = &AfterIndent[Ticks..];
    if Rest.contains('`')
    {
        return None;
    }
    let Info = Rest.trim();
    if Info.is_empty()
    {
        return Some((Ticks, String::new()));
    }
    let ValidIdent = Info.chars().next().is_some_and(|C| C.is_ascii_alphabetic())
        && Info.chars().all(|C| C.is_ascii_alphanumeric() || matches!(C, '_' | '-' | '+' | '.'));
    if ValidIdent
    {
        Some((Ticks, Info.to_ascii_lowercase()))
    }
    else
    {
        None
    }
}

fn IsFenceClose(Line: &str, MinTicks: usize) -> bool
{
    let IndentLen = Line.bytes().take_while(|&B| B == b' ' || B == b'\t').count();
    let AfterIndent = &Line[IndentLen..];
    let Ticks = AfterIndent.bytes().take_while(|&B| B == b'`').count();
    if Ticks < MinTicks
    {
        return false;
    }
    let Rest = &AfterIndent[Ticks..];
    if Rest.contains('`')
    {
        return false;
    }
    let Trimmed = Rest.trim();
    Trimmed.is_empty()
        || Trimmed.starts_with(',')
        || Trimmed.starts_with(')')
        || Trimmed.starts_with(']')
        || Trimmed.starts_with('}')
        || Trimmed.starts_with(';')
        || Trimmed.starts_with("//")
}

fn IsPrecededByDocExampleCall(Lines: &[&str], FenceLineIdx: usize) -> bool
{
    let mut NonEmptyChecked = 0;
    let mut Idx = FenceLineIdx;
    while Idx > 0 && NonEmptyChecked < 8
    {
        Idx -= 1;
        let Trimmed = Lines[Idx].trim();
        if Trimmed.is_empty()
        {
            continue;
        }
        if Trimmed.starts_with("```")
        {
            break;
        }
        if Trimmed.contains("#example")
            || Trimmed.contains("#source")
            || Trimmed.contains("#preview")
            || Trimmed.starts_with("example(")
            || Trimmed.starts_with("source(")
            || Trimmed.starts_with("preview(")
        {
            return true;
        }
        NonEmptyChecked += 1;
    }
    false
}

fn UntaggedFenceHasDocHarness(Lines: &[&str], OpenLineIdx: usize, Ticks: usize) -> bool
{
    for Line in Lines.iter().skip(OpenLineIdx + 1)
    {
        if IsFenceClose(Line, Ticks)
        {
            break;
        }
        if HasDocHarnessPrefix(Line)
        {
            return true;
        }
    }
    false
}

fn ClassifyFencedRawLines(Lines: &[&str]) -> Vec<Raw_Line_Context>
{
    let mut States = Vec::with_capacity(Lines.len());
    let mut Stack: Vec<Fence_Frame> = Vec::new();

    for (LineIdx, Line) in Lines.iter().enumerate()
    {
        if let Some(Top) = Stack.last()
            && IsFenceClose(Line, Top.ticks)
        {
            States.push
            (
                Raw_Line_Context
                {
                    is_fence_line: true,
                    in_non_typst_raw: !Top.is_typst_raw,
                }
            );
            Stack.pop();
            continue;
        }

        if let Some((Ticks, Lang)) = ParseFenceStart(Line)
        {
            if let Some(Outer) = Stack.last()
            {
                if !Outer.is_typst_raw
                {
                    States.push
                    (
                        Raw_Line_Context
                        {
                            is_fence_line: false,
                            in_non_typst_raw: true,
                        }
                    );
                    continue;
                }
                let IsSubTypstRaw = if !Lang.is_empty()
                {
                    matches!(Lang.as_str(), "typ" | "typst" | "example" | "typc" | "typm")
                }
                else
                {
                    UntaggedFenceHasDocHarness(Lines, LineIdx, Ticks)
                };
                States.push
                (
                    Raw_Line_Context
                    {
                        is_fence_line: true,
                        in_non_typst_raw: !IsSubTypstRaw,
                    }
                );
                Stack.push(Fence_Frame { ticks: Ticks, is_typst_raw: IsSubTypstRaw });
                continue;
            }

            let IsTypstRaw = if !Lang.is_empty()
            {
                matches!(Lang.as_str(), "typ" | "typst" | "example" | "typc" | "typm")
            }
            else
            {
                UntaggedFenceHasDocHarness(Lines, LineIdx, Ticks)
                    || IsPrecededByDocExampleCall(Lines, LineIdx)
            };
            States.push
            (
                Raw_Line_Context
                {
                    is_fence_line: true,
                    in_non_typst_raw: !IsTypstRaw,
                }
            );
            Stack.push(Fence_Frame { ticks: Ticks, is_typst_raw: IsTypstRaw });
            continue;
        }

        let InNonTypstRaw = Stack.last().is_some_and(|Frame| !Frame.is_typst_raw);
        States.push
        (
            Raw_Line_Context
            {
                is_fence_line: false,
                in_non_typst_raw: InNonTypstRaw,
            }
        );
    }

    States
}

pub fn ScanLexicalParity(Text: &str) -> Vec<Container_Token>
{
    let Lines: Vec<&str> = Text.lines().collect();
    let RawStates = ClassifyFencedRawLines(&Lines);
    let mut MathCount = 0;
    let mut RawBlockCount = 0;
    let mut RawInlineCount = 0;
    let mut SqlCount = 0;
    let mut TripleQuoteCount = 0;

    let mut Tokens = Vec::new();

    for (LineIdx, Line) in Lines.iter().enumerate()
    {
        if RawStates[LineIdx].in_non_typst_raw && !RawStates[LineIdx].is_fence_line
        {
            continue;
        }
        let Chars: Vec<char> = Line.chars().collect();
        let Len = Chars.len();
        let mut I = 0;

        while I < Len
        {
            // Skip line comments
            if I + 1 < Len && Chars[I] == '/' && Chars[I + 1] == '/'
            {
                break;
            }

            // Skip escaped characters
            if Chars[I] == '\\' && I + 1 < Len
            {
                I += 2;
                continue;
            }

            // Check triple backticks
            if I + 2 < Len && Chars[I] == '`' && Chars[I + 1] == '`' && Chars[I + 2] == '`'
            {
                let IsOpener = RawBlockCount % 2 == 0;
                Tokens.push
                (
                    Container_Token
                    {
                        token_type: Container_Token_Type::RawBlock,
                        glyph: "```".to_string(),
                        line: LineIdx,
                        col: I,
                        is_opener: IsOpener,
                    }
                );
                RawBlockCount += 1;
                I += 3;
                continue;
            }

            // Check single backtick
            if Chars[I] == '`'
            {
                let IsOpener = RawInlineCount % 2 == 0;
                Tokens.push
                (
                    Container_Token
                    {
                        token_type: Container_Token_Type::RawInline,
                        glyph: "`".to_string(),
                        line: LineIdx,
                        col: I,
                        is_opener: IsOpener,
                    }
                );
                RawInlineCount += 1;
                I += 1;
                continue;
            }

            // Check $$
            if I + 1 < Len && Chars[I] == '$' && Chars[I + 1] == '$'
            {
                let IsOpener = SqlCount % 2 == 0;
                Tokens.push
                (
                    Container_Token
                    {
                        token_type: Container_Token_Type::SqlBlock,
                        glyph: "$$".to_string(),
                        line: LineIdx,
                        col: I,
                        is_opener: IsOpener,
                    }
                );
                SqlCount += 1;
                I += 2;
                continue;
            }

            // Check single $ (Typst math)
            if Chars[I] == '$'
            {
                let IsOpener = MathCount % 2 == 0;
                Tokens.push
                (
                    Container_Token
                    {
                        token_type: Container_Token_Type::Math,
                        glyph: "$".to_string(),
                        line: LineIdx,
                        col: I,
                        is_opener: IsOpener,
                    }
                );
                MathCount += 1;
                I += 1;
                continue;
            }

            // Check triple quote """
            if I + 2 < Len && Chars[I] == '"' && Chars[I + 1] == '"' && Chars[I + 2] == '"'
            {
                let IsOpener = TripleQuoteCount % 2 == 0;
                Tokens.push
                (
                    Container_Token
                    {
                        token_type: Container_Token_Type::TripleQuote,
                        glyph: "\"\"\"".to_string(),
                        line: LineIdx,
                        col: I,
                        is_opener: IsOpener,
                    }
                );
                TripleQuoteCount += 1;
                I += 3;
                continue;
            }

            // Check Typst label: <[a-zA-Z0-9_\-:]+>
            if Chars[I] == '<'
            {
                let Remainder: String = Chars[I..].iter().collect();
                if let Some(EndIdx) = Remainder.find('>')
                {
                    let Inside = &Remainder[1..EndIdx];
                    if !Inside.is_empty() && Inside.chars().all(|C| C.is_ascii_alphanumeric() || C == '_' || C == '-' || C == ':')
                    {
                        I += EndIdx + 1;
                        continue;
                    }
                }

                // Check arrows
                if Remainder.starts_with("->") || Remainder.starts_with("<-") || Remainder.starts_with("=>") || Remainder.starts_with("<=")
                {
                    I += 2;
                    continue;
                }
            }

            // Asymmetric structural delimiters
            if Chars[I] == '('
            {
                Tokens.push(Container_Token { token_type: Container_Token_Type::Paren, glyph: "(".to_string(), line: LineIdx, col: I, is_opener: true });
            }
            else if Chars[I] == ')'
            {
                Tokens.push(Container_Token { token_type: Container_Token_Type::Paren, glyph: ")".to_string(), line: LineIdx, col: I, is_opener: false });
            }
            else if Chars[I] == '['
            {
                Tokens.push(Container_Token { token_type: Container_Token_Type::Bracket, glyph: "[".to_string(), line: LineIdx, col: I, is_opener: true });
            }
            else if Chars[I] == ']'
            {
                Tokens.push(Container_Token { token_type: Container_Token_Type::Bracket, glyph: "]".to_string(), line: LineIdx, col: I, is_opener: false });
            }
            else if Chars[I] == '{'
            {
                Tokens.push(Container_Token { token_type: Container_Token_Type::Brace, glyph: "{".to_string(), line: LineIdx, col: I, is_opener: true });
            }
            else if Chars[I] == '}'
            {
                Tokens.push(Container_Token { token_type: Container_Token_Type::Brace, glyph: "}".to_string(), line: LineIdx, col: I, is_opener: false });
            }

            I += 1;
        }
    }

    Tokens
}

pub fn EvaluateRuleA(Text: &str, LineIdx: usize, ColIdx: usize) -> Option<Container_Action_Response>
{
    let Lines: Vec<&str> = Text.lines().collect();
    if LineIdx >= Lines.len()
    {
        return None;
    }
    let RawStates = ClassifyFencedRawLines(&Lines);
    if RawStates[LineIdx].is_fence_line || RawStates[LineIdx].in_non_typst_raw
    {
        return None;
    }

    let Line = Lines[LineIdx];
    if ColIdx > Line.len()
    {
        return None;
    }

    let (DocPrefix, CodePart) = SplitDocHarnessPrefix(Line);
    if ColIdx < DocPrefix.len()
    {
        return None;
    }

    let Pre = &Line[..ColIdx];
    let CodePre = &Pre[DocPrefix.len()..];
    let Post = &Line[ColIdx..];

    let CompoundPairs =
    [
        ("[{(", ")}]"),
        ("([", "])"),
        ("[(", ")]"),
        ("`${", "}`"),
        ("${", "}"),
        ("<!--", "-->"),
        ("$$", "$$"),
        ("\"\"\"", "\"\"\""),
        ("```", "```"),
        ("(", ")"),
        ("[", "]"),
        ("{", "}"),
        ("$", "$"),
        ("`", "`"),
        ("|", "|"),
    ];

    let CodeIndent: String = CodePart.chars().take_while(|C| C.is_whitespace()).collect();
    let FullBaseIndent = format!("{}{}", DocPrefix, CodeIndent);
    let FullInnerIndent = format!("{}    ", FullBaseIndent);

    // Case 1: Empty innermost container: CodePre ends with Open, Post starts with Close
    for &(Open, Close) in &CompoundPairs
    {
        if CodePre.ends_with(Open) && Post.starts_with(Close)
        {
            let CodeHead = &CodePre[..CodePre.len() - Open.len()];
            let Tail = &Post[Close.len()..];

            let mut NewLines = Vec::new();
            let CursorCol = FullInnerIndent.len();

            let CursorLine = if !CodeHead.trim().is_empty()
            {
                NewLines.push(format!("{}{}", DocPrefix, CodeHead.trim_end()));
                NewLines.push(format!("{}{}", FullBaseIndent, Open));
                NewLines.push(FullInnerIndent.clone());
                NewLines.push(format!("{}{}{}", FullBaseIndent, Close, Tail.trim_start()));
                LineIdx + 2
            }
            else
            {
                NewLines.push(format!("{}{}", FullBaseIndent, Open));
                NewLines.push(FullInnerIndent.clone());
                NewLines.push(format!("{}{}{}", FullBaseIndent, Close, Tail.trim_start()));
                LineIdx + 1
            };

            let mut ResultLines = Vec::new();
            ResultLines.extend(Lines[..LineIdx].iter().map(|S| S.to_string()));
            ResultLines.extend(NewLines);
            if LineIdx + 1 < Lines.len()
            {
                ResultLines.extend(Lines[LineIdx + 1..].iter().map(|S| S.to_string()));
            }

            return Some
            (
                Container_Action_Response
                {
                    handled: true,
                    action: "DETACH_2D".to_string(),
                    reason: "symmetrical_detachment".to_string(),
                    result_text: Some(ResultLines.join("\n")),
                    cursor_line: CursorLine,
                    cursor_col: CursorCol,
                }
            );
        }
    }

    // Case 2: Container with inner content after non-whitespace head
    for &(Open, Close) in &CompoundPairs
    {
        if let (Some(OpenIdx), Some(CloseIdx)) = (CodePre.rfind(Open), Post.find(Close))
        {
            let CodeHead = &CodePre[..OpenIdx];
            if !CodeHead.trim().is_empty()
            {
                let InnerPre = &CodePre[OpenIdx + Open.len()..];
                let InnerPost = &Post[..CloseIdx];
                let Tail = &Post[CloseIdx + Close.len()..];

                let mut NewLines = Vec::new();
                NewLines.push(format!("{}{}", DocPrefix, CodeHead.trim_end()));
                NewLines.push(format!("{}{}", FullBaseIndent, Open));

                let TrimmedPre = InnerPre.trim();
                let TrimmedPost = InnerPost.trim();

                let CursorLine;
                let CursorCol;

                if TrimmedPre.is_empty() && !TrimmedPost.is_empty()
                {
                    // Cursor is before inner content, e.g. #text(|size: 8.5pt)
                    NewLines.push(format!("{}{}", FullInnerIndent, InnerPost.trim_start()));
                    NewLines.push(format!("{}{}{}", FullBaseIndent, Close, Tail.trim_start()));
                    CursorLine = LineIdx + 2;
                    CursorCol = FullInnerIndent.len();
                }
                else if !TrimmedPre.is_empty() && TrimmedPost.is_empty()
                {
                    // Cursor is after inner content, e.g. #text(size: 8.5pt|)
                    NewLines.push(format!("{}{}", FullInnerIndent, InnerPre.trim_end()));
                    NewLines.push(FullInnerIndent.clone());
                    NewLines.push(format!("{}{}{}", FullBaseIndent, Close, Tail.trim_start()));
                    CursorLine = LineIdx + 3;
                    CursorCol = FullInnerIndent.len();
                }
                else
                {
                    // Both have content or both empty
                    NewLines.push(format!("{}{}", FullInnerIndent, InnerPre.trim_end()));
                    NewLines.push(format!("{}{}", FullInnerIndent, InnerPost.trim_start()));
                    NewLines.push(format!("{}{}{}", FullBaseIndent, Close, Tail.trim_start()));
                    CursorLine = LineIdx + 3;
                    CursorCol = FullInnerIndent.len();
                }

                let mut ResultLines = Vec::new();
                ResultLines.extend(Lines[..LineIdx].iter().map(|S| S.to_string()));
                ResultLines.extend(NewLines);
                if LineIdx + 1 < Lines.len()
                {
                    ResultLines.extend(Lines[LineIdx + 1..].iter().map(|S| S.to_string()));
                }

                return Some
                (
                    Container_Action_Response
                    {
                        handled: true,
                        action: "DETACH_2D".to_string(),
                        reason: "symmetrical_content_detachment".to_string(),
                        result_text: Some(ResultLines.join("\n")),
                        cursor_line: CursorLine,
                        cursor_col: CursorCol,
                    }
                );
            }
        }
    }

    None
}

pub fn EvaluateRuleB(Text: &str, Key: &str, LineIdx: usize, ColIdx: usize, CanvasLimit: usize) -> Option<Container_Action_Response>
{
    let Lines: Vec<&str> = Text.lines().collect();
    if LineIdx >= Lines.len()
    {
        return None;
    }

    let TargetOpenLine;
    let PrevLineIdx;

    if Key == "Backspace"
    {
        if LineIdx == 0
        {
            return None;
        }
        let Line = Lines[LineIdx];
        if ColIdx > Line.len()
        {
            return None;
        }
        let PreCursor = &Line[..ColIdx];
        if PreCursor.chars().all(|C| C.is_whitespace())
        {
            PrevLineIdx = LineIdx - 1;
            TargetOpenLine = LineIdx;
        }
        else
        {
            return None;
        }
    }
    else if Key == "Delete"
    {
        if LineIdx + 1 >= Lines.len()
        {
            return None;
        }
        let Line = Lines[LineIdx];
        if ColIdx > Line.len()
        {
            return None;
        }
        let PostCursor = &Line[ColIdx..];
        if PostCursor.chars().all(|C| C.is_whitespace()) && !Line[..ColIdx].trim().is_empty()
        {
            PrevLineIdx = LineIdx;
            TargetOpenLine = LineIdx + 1;
        }
        else
        {
            return None;
        }
    }
    else
    {
        return None;
    }

    let RawStates = ClassifyFencedRawLines(&Lines);
    if RawStates[PrevLineIdx].is_fence_line
        || RawStates[PrevLineIdx].in_non_typst_raw
        || RawStates[TargetOpenLine].is_fence_line
        || RawStates[TargetOpenLine].in_non_typst_raw
    {
        return None;
    }

    if HasDocHarnessPrefix(Lines[PrevLineIdx]) || HasDocHarnessPrefix(Lines[TargetOpenLine])
    {
        return None;
    }

    let PrevLine = Lines[PrevLineIdx];
    if PrevLine.trim().is_empty()
    {
        return None;
    }

    let TargetLine = Lines[TargetOpenLine];
    let LeadingSpaces: String = TargetLine.chars().take_while(|C| C.is_whitespace()).collect();
    let TrimmedTarget = &TargetLine[LeadingSpaces.len()..];

    let OpenGlyphs = ["```", "\"\"\"", "$$", "`", "$", "|", "[", "{", "("];
    let MatchedGlyph = OpenGlyphs.iter().find(|&&G| TrimmedTarget.starts_with(G))?;
    let OpenCol = LeadingSpaces.len();

    // Verify opener vs closer using Lexical Parity Scanner
    let Tokens = ScanLexicalParity(Text);
    let TokenOpt = Tokens.iter().find(|T| T.line == TargetOpenLine && T.col == OpenCol);
    let Token = match TokenOpt
    {
        Some(T) if T.is_opener => T,
        _ => return None,
    };

    // Find matching closer starting strictly from the opener token
    let StartIdx = Tokens.iter().position(|T| T.line == Token.line && T.col == Token.col).unwrap_or(0);
    let mut MatchingCloser = None;
    let mut Depth = 0;
    for T in &Tokens[StartIdx..]
    {
        if T.token_type == Token.token_type
        {
            if T.is_opener
            {
                Depth += 1;
            }
            else
            {
                Depth -= 1;
                if Depth == 0
                {
                    MatchingCloser = Some(T);
                    break;
                }
            }
        }
    }

    let CloseToken = match MatchingCloser
    {
        Some(T) => T,
        None =>
        {
            return Some
            (
                Container_Action_Response
                {
                    handled: true,
                    action: "HARD_NO_OP".to_string(),
                    reason: "unclosed_container".to_string(),
                    result_text: None,
                    cursor_line: LineIdx,
                    cursor_col: ColIdx,
                }
            );
        }
    };

    let CloseLineIdx = CloseToken.line;

    // Check for forced breaks inside container (e.g. line comments)
    for Line in &Lines[TargetOpenLine..=CloseLineIdx]
    {
        if Line.contains("//")
        {
            return Some
            (
                Container_Action_Response
                {
                    handled: true,
                    action: "HARD_NO_OP".to_string(),
                    reason: "line_comment_inside".to_string(),
                    result_text: None,
                    cursor_line: LineIdx,
                    cursor_col: ColIdx,
                }
            );
        }
    }

    // Check complexity budget (> 4 statements in a block)
    let mut StatementCount = 0;
    for Line in &Lines[TargetOpenLine..=CloseLineIdx]
    {
        let Trimmed = Line.trim();
        if Trimmed.ends_with(';') || Trimmed.ends_with(',')
        {
            StatementCount += 1;
        }
    }
    if StatementCount > 4
    {
        return Some
        (
            Container_Action_Response
            {
                handled: true,
                action: "HARD_NO_OP".to_string(),
                reason: "complexity_budget_exceeded".to_string(),
                result_text: None,
                cursor_line: LineIdx,
                cursor_col: ColIdx,
            }
        );
    }

    // Extract body and apply LAFS Monolith Inner Padding
    let HeadTrimmed = PrevLine.trim_end();
    

    let BodyText: String = if TargetOpenLine == CloseLineIdx
    {
        let RawBody = &TargetLine[OpenCol + MatchedGlyph.len()..CloseToken.col];
        RawBody.split_whitespace().collect::<Vec<&str>>().join(" ")
    }
    else
    {
        let FirstLineInner = &TargetLine[OpenCol + MatchedGlyph.len()..];
        let MiddleLines: Vec<&str> = Lines[TargetOpenLine + 1..CloseLineIdx].to_vec();
        let LastLineInner = &Lines[CloseLineIdx][..CloseToken.col];

        let mut Combined = Vec::new();
        Combined.push(FirstLineInner);
        Combined.extend(MiddleLines);
        Combined.push(LastLineInner);
        Combined.join(" ").split_whitespace().collect::<Vec<&str>>().join(" ")
    };

    let PaddedInner = match *MatchedGlyph
    {
        "{" | "$" if !BodyText.is_empty() => format!(" {} ", BodyText),
        _ => BodyText,
    };

    let CloserLine = Lines[CloseLineIdx];
    let CloserSuffix = CloserLine[CloseToken.col + CloseToken.glyph.len()..].trim_end();

    let Attachment = if (*MatchedGlyph == "{" || *MatchedGlyph == "$" || *MatchedGlyph == "$$" || *MatchedGlyph == "\"\"\"" || *MatchedGlyph == "```") && !HeadTrimmed.ends_with(' ')
    {
        " "
    }
    else
    {
        ""
    };

    let Monolith = format!("{}{}{}{}{}{}", HeadTrimmed, Attachment, MatchedGlyph, PaddedInner, CloseToken.glyph, CloserSuffix);

    if Monolith.len() > CanvasLimit
    {
        return Some
        (
            Container_Action_Response
            {
                handled: true,
                action: "HARD_NO_OP".to_string(),
                reason: "canvas_limit_breach".to_string(),
                result_text: None,
                cursor_line: LineIdx,
                cursor_col: ColIdx,
            }
        );
    }

    let mut ResultLines = Vec::new();
    ResultLines.extend(Lines[..PrevLineIdx].iter().map(|S| S.to_string()));
    ResultLines.push(Monolith);
    if CloseLineIdx + 1 < Lines.len()
    {
        ResultLines.extend(Lines[CloseLineIdx + 1..].iter().map(|S| S.to_string()));
    }

    let CursorCol = HeadTrimmed.len() + Attachment.len();

    Some
    (
        Container_Action_Response
        {
            handled: true,
            action: "COLLAPSE_MONOLITH".to_string(),
            reason: "allowed_monolith_collapse".to_string(),
            result_text: Some(ResultLines.join("\n")),
            cursor_line: PrevLineIdx,
            cursor_col: CursorCol,
        }
    )
}

pub fn EvaluateCrossLineSelection(Lines: &[&str], StartLine: usize, StartCol: usize, EndLine: usize, EndCol: usize, IsDelete: bool, InsertedText: &str) -> Option<Container_Action_Response>
{
    if StartLine >= EndLine || EndLine > Lines.len() || StartLine == 0
    {
        return None;
    }

    let RawStates = ClassifyFencedRawLines(Lines);
    if RawStates[StartLine - 1].is_fence_line
        || RawStates[StartLine - 1].in_non_typst_raw
        || RawStates[EndLine - 1].is_fence_line
        || RawStates[EndLine - 1].in_non_typst_raw
    {
        return None;
    }

    let LineL = Lines[EndLine - 1];
    let LineA = Lines[StartLine - 1];
    if HasDocHarnessPrefix(LineA) || HasDocHarnessPrefix(LineL)
    {
        return None;
    }

    let TrimmedL = LineL.trim_start();
    let LeadingL = LineL.len() - TrimmedL.len();

    let OpenGlyphs = ["```", "\"\"\"", "$$", "[{(", "([", "[(", "`", "$", "|", "[", "{", "("];
    let _MatchedGlyph = OpenGlyphs.iter().find(|&&G| TrimmedL.starts_with(G))?;
    let OpenCol1Based = LeadingL + 1;

    if EndCol > OpenCol1Based
    {
        return None;
    }

    if StartCol > LineA.len() + 1
    {
        return None;
    }

    let PreSelA = &LineA[..StartCol - 1];
    let SelA = &LineA[StartCol - 1..];

    if IsDelete
    {
        if SelA.chars().all(|C| C.is_whitespace())
        {
            Some
            (
                Container_Action_Response
                {
                    handled: true,
                    action: "HARD_NO_OP".to_string(),
                    reason: "cross_line_trailing_whitespace".to_string(),
                    result_text: None,
                    cursor_line: StartLine - 1,
                    cursor_col: StartCol - 1,
                }
            )
        }
        else
        {
            let mut NewLines: Vec<String> = Lines.iter().map(|S| S.to_string()).collect();
            NewLines[StartLine - 1] = PreSelA.to_string();
            Some
            (
                Container_Action_Response
                {
                    handled: true,
                    action: "CLAMP_DELETE".to_string(),
                    reason: "clamped_to_line_a".to_string(),
                    result_text: Some(NewLines.join("\n")),
                    cursor_line: StartLine - 1,
                    cursor_col: StartCol - 1,
                }
            )
        }
    }
    else
    {
        let mut NewLines: Vec<String> = Lines.iter().map(|S| S.to_string()).collect();
        NewLines[StartLine - 1] = format!("{}{}", PreSelA, InsertedText);
        let CursorCol = PreSelA.len() + InsertedText.len();
        Some
        (
            Container_Action_Response
            {
                handled: true,
                action: "CLAMP_INSERT".to_string(),
                reason: "clamped_insert_to_line_a".to_string(),
                result_text: Some(NewLines.join("\n")),
                cursor_line: StartLine - 1,
                cursor_col: CursorCol,
            }
        )
    }
}

pub fn NormalizeKnRJunctions(Text: &str) -> (bool, String)
{
    let Lines: Vec<&str> = Text.lines().collect();
    let RawStates = ClassifyFencedRawLines(&Lines);
    let mut Changed = false;
    let mut NewLines = Vec::new();

    let OpenGlyphs = ["```", "\"\"\"", "$$", "[{(", "([", "[(", "`", "$", "|", "[", "{", "("];

    for (LineIdx, Line) in Lines.iter().enumerate()
    {
        if RawStates[LineIdx].is_fence_line || RawStates[LineIdx].in_non_typst_raw
        {
            NewLines.push((*Line).to_string());
            continue;
        }

        let (DocPrefix, CodePart) = SplitDocHarnessPrefix(Line);
        let TrimmedCode = CodePart.trim();
        if TrimmedCode.is_empty() || TrimmedCode.starts_with("//")
        {
            NewLines.push((*Line).to_string());
            continue;
        }

        let mut Matched = None;
        for &Og in &OpenGlyphs
        {
            if let Some(Head) = CodePart.strip_suffix(Og).filter(|H| !H.trim().is_empty())
            {
                Matched = Some((Og, Head));
                break;
            }
        }

        if let Some((Og, Head)) = Matched
        {
            let CodeIndent: String = CodePart.chars().take_while(|C| C.is_whitespace()).collect();
            let FullIndent = format!("{}{}", DocPrefix, CodeIndent);
            NewLines.push(format!("{}{}", DocPrefix, Head.trim_end()));
            NewLines.push(format!("{}{}", FullIndent, Og));
            Changed = true;
        }
        else
        {
            NewLines.push((*Line).to_string());
        }
    }

    (Changed, NewLines.join("\n"))
}

pub fn ProcessContainerAction(Req: Container_Action_Request) -> Container_Action_Response
{
    if Req.key == "Enter"
    {
        if let Some(Resp) = EvaluateRuleA(&Req.text, Req.line, Req.col)
        {
            return Resp;
        }
    }
    else if (Req.key == "Backspace" || Req.key == "Delete")
        && let Some(Resp) = EvaluateRuleB(&Req.text, &Req.key, Req.line, Req.col, Req.canvas_limit)
        {
            return Resp;
        }

    Container_Action_Response
    {
        handled: false,
        action: "NONE".to_string(),
        reason: "no_trigger".to_string(),
        result_text: None,
        cursor_line: Req.line,
        cursor_col: Req.col,
    }
}

#[cfg(test)]
mod tests
{
    use super::*;

    #[test]
    fn TestEnterTableDetachment()
    {
        let Resp = EvaluateRuleA("#table[]", 0, 7).expect("should handle");
        assert_eq!(Resp.action, "DETACH_2D");
        assert_eq!(Resp.result_text.as_deref(), Some("#table\n[\n    \n]"));
        assert_eq!(Resp.cursor_line, 2);
        assert_eq!(Resp.cursor_col, 4);
    }

    #[test]
    fn TestEnterTextWithContentDetachment()
    {
        let Resp = EvaluateRuleA("#text(size: 8.5pt)", 0, 6).expect("should handle");
        assert_eq!(Resp.action, "DETACH_2D");
        assert_eq!(Resp.result_text.as_deref(), Some("#text\n(\n    size: 8.5pt\n)"));
        assert_eq!(Resp.cursor_line, 2);
        assert_eq!(Resp.cursor_col, 4);
    }

    #[test]
    fn TestEnterSquareBracketWithContentDetachment()
    {
        let Resp = EvaluateRuleA("#block[Parser]", 0, 7).expect("should handle");
        assert_eq!(Resp.action, "DETACH_2D");
        assert_eq!(Resp.result_text.as_deref(), Some("#block\n[\n    Parser\n]"));
        assert_eq!(Resp.cursor_line, 2);
        assert_eq!(Resp.cursor_col, 4);
    }

    #[test]
    fn TestEnterMathDetachment()
    {
        let Resp = EvaluateRuleA("$$", 0, 1).expect("should handle");
        assert_eq!(Resp.action, "DETACH_2D");
        assert_eq!(Resp.result_text.as_deref(), Some("$\n    \n$"));
        assert_eq!(Resp.cursor_line, 1);
        assert_eq!(Resp.cursor_col, 4);
    }

    #[test]
    fn TestBackspaceShortBlockCollapse()
    {
        let Text = "#block\n[Parser]";
        let Resp = EvaluateRuleB(Text, "Backspace", 1, 0, 160).expect("should handle");
        assert_eq!(Resp.action, "COLLAPSE_MONOLITH");
        assert_eq!(Resp.result_text.as_deref(), Some("#block[Parser]"));
    }

    #[test]
    fn TestBackspaceLongTableCanvasBreach()
    {
        let Text = "#table\n[\n    columns: (1fr, 2fr),\n    [Cell 1], [Cell 2],\n]";
        let Resp = EvaluateRuleB(Text, "Backspace", 1, 0, 40).expect("should handle");
        assert_eq!(Resp.action, "HARD_NO_OP");
        assert_eq!(Resp.reason, "canvas_limit_breach");
    }

    #[test]
    fn TestCommentInsideHardNoop()
    {
        let Text = "#block\n[\n    // comment\n    data\n]";
        let Resp = EvaluateRuleB(Text, "Backspace", 1, 0, 160).expect("should handle");
        assert_eq!(Resp.action, "HARD_NO_OP");
        assert_eq!(Resp.reason, "line_comment_inside");
    }

    #[test]
    fn TestClosingMathDollarDoesNotTrigger()
    {
        let Text = "Equation:\n$\n    mat(1, 2; 3, 4)\n$ <eq:rotation>";
        let Resp = EvaluateRuleB(Text, "Backspace", 3, 0, 160);
        assert!(Resp.is_none());
    }

    #[test]
    fn TestTypstLabelDoesNotTrigger()
    {
        let Text = "Title\n<sec:intro>";
        let Resp = EvaluateRuleB(Text, "Backspace", 1, 0, 160);
        assert!(Resp.is_none());
    }

    #[test]
    fn TestDeleteAtEolCollapses()
    {
        let Text = "#block\n[Parser]";
        let Resp = EvaluateRuleB(Text, "Delete", 0, 6, 160).expect("should handle");
        assert_eq!(Resp.action, "COLLAPSE_MONOLITH");
        assert_eq!(Resp.result_text.as_deref(), Some("#block[Parser]"));
    }

    #[test]
    fn TestCrossLineSelectionTrailingWhitespace()
    {
        let Lines = ["#block   ", "    [Parser]"];
        let Resp = EvaluateCrossLineSelection(&Lines, 1, 7, 2, 5, true, "").expect("should handle");
        assert_eq!(Resp.action, "HARD_NO_OP");
        assert_eq!(Resp.reason, "cross_line_trailing_whitespace");
    }

    #[test]
    fn TestCrossLineSelectionNonWhitespaceClamps()
    {
        let Lines = ["#block words   ", "    [Parser]"];
        let Resp = EvaluateCrossLineSelection(&Lines, 1, 7, 2, 5, true, "").expect("should handle");
        assert_eq!(Resp.action, "CLAMP_DELETE");
        assert_eq!(Resp.result_text.as_deref(), Some("#block\n    [Parser]"));
    }

    #[test]
    fn TestPostEditKnRJunctionNormalization()
    {
        let KnRSample = "#table[\n    [Cell 1], [Cell 2]\n]";
        let (Changed, Normalized) = NormalizeKnRJunctions(KnRSample);
        assert!(Changed);
        assert_eq!(Normalized, "#table\n[\n    [Cell 1], [Cell 2]\n]");
    }

    #[test]
    fn TestDocHarnessPrefixPreservedOnKnRNormalization()
    {
        // 1. Standalone doc-harness >>> line with inner indentation
        let StandaloneLine = ">>>   place(top, float: true, scope: \"parent\", {";
        let (Changed1, Norm1) = NormalizeKnRJunctions(StandaloneLine);
        assert!(Changed1);
        assert_eq!(
            Norm1,
            ">>>   place(top, float: true, scope: \"parent\",\n>>>   {"
        );
        assert!(!Norm1.lines().any(|L| L.trim() == "{"));

        // 2. Full fenced #example block containing >>> and <<< prefixed lines
        let ExampleBlock = concat!
        (
            "#example\n",
            "(\n",
            "    single: true,\n",
            "    ```\n",
            "  >>> #let conf(\n",
            "  >>>   doc,\n",
            "  >>> ) = {\n",
            "  >>>   place(top, float: true, scope: \"parent\", {\n",
            "  >>>     text[Hello]\n",
            "  >>>   })\n",
            "  >>> }\n",
            "  <<< #let preview_only() = {\n",
            "  <<< }\n",
            "  ```,\n",
            ")"
        );
        let (Changed2, Norm2) = NormalizeKnRJunctions(ExampleBlock);
        assert!(Changed2);
        assert!(Norm2.contains("  >>> ) =\n  >>> {"));
        assert!(Norm2.contains("  >>>   place(top, float: true, scope: \"parent\",\n  >>>   {"));
        assert!(Norm2.contains("  <<< #let preview_only() =\n  <<< {"));
        assert!(!Norm2.lines().any(|L| L.trim() == "{"));
    }

    #[test]
    fn TestDocHarnessPrefixPreservedOnEnterDetachment()
    {
        let DocWithHarness = concat!
        (
            "#example\n",
            "(\n",
            "    single: true,\n",
            "    ```\n",
            "  >>>   place(top, float: true, scope: \"parent\", {})\n",
            "  ```,\n",
            ")"
        );
        let TargetLine = 4;
        let LineStr = DocWithHarness.lines().nth(TargetLine).expect("line exists");
        let CursorCol = LineStr.find("{}").expect("brace pair exists") + 1;
        let Resp = ProcessContainerAction
        (
            Container_Action_Request
            {
                text: DocWithHarness.to_string(),
                key: "Enter".to_string(),
                line: TargetLine,
                col: CursorCol,
                canvas_limit: 160,
            }
        );
        assert!(Resp.handled);
        assert_eq!(Resp.action, "DETACH_2D");
        let ResultText = Resp.result_text.expect("result_text should exist");
        assert!(ResultText.contains("  >>>   place(top, float: true, scope: \"parent\",\n  >>>   {\n  >>>       \n  >>>   })"));
        assert!(!ResultText.lines().any(|L| L.trim() == "{"));
    }

    #[test]
    fn TestNonTypstAndUntaggedRawBlocksSkipContainerPhysics()
    {
        // 1. Explicit non-Typst fenced raw block (Rust, LaTeX)
        let RustBlock = "```rust\nfn main() {\n    let x = vec![1, 2];\n}\n```";
        let (ChangedRust, NormRust) = NormalizeKnRJunctions(RustBlock);
        assert!(!ChangedRust);
        assert_eq!(NormRust, RustBlock);
        assert!(EvaluateRuleA("```rust\nfn main() {}\n```", 1, 11).is_none());

        // 2. Nested ```latex inside ````example
        let NestedLatex = "````example\n```latex\n\\section{\n}\n```\n````";
        let (ChangedLatex, NormLatex) = NormalizeKnRJunctions(NestedLatex);
        assert!(!ChangedLatex);
        assert_eq!(NormLatex, NestedLatex);

        // 3. Plain untagged raw block without doc-harness markers or #example context
        let PlainRaw = "```\nvoid helper() {\n}\n```";
        let (ChangedPlain, NormPlain) = NormalizeKnRJunctions(PlainRaw);
        assert!(!ChangedPlain);
        assert_eq!(NormPlain, PlainRaw);
        assert!(EvaluateRuleA("```\nvoid helper() {}\n```", 1, 15).is_none());
    }
}

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

pub fn ScanLexicalParity(Text: &str) -> Vec<Container_Token>
{
    let Lines: Vec<&str> = Text.lines().collect();
    let mut MathCount = 0;
    let mut RawBlockCount = 0;
    let mut RawInlineCount = 0;
    let mut SqlCount = 0;
    let mut TripleQuoteCount = 0;

    let mut Tokens = Vec::new();

    for (LineIdx, Line) in Lines.iter().enumerate()
    {
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
    let Line = Lines[LineIdx];
    if ColIdx > Line.len()
    {
        return None;
    }

    let Pre = &Line[..ColIdx];
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

    for &(Open, Close) in &CompoundPairs
    {
        // Case 1: Empty container: pre ends with Open, post starts with Close
        if Pre.ends_with(Open) && Post.starts_with(Close)
        {
            let Head = &Pre[..Pre.len() - Open.len()];
            let Tail = &Post[Close.len()..];

            let BaseIndent: String = Line.chars().take_while(|C| C.is_whitespace()).collect();
            let InnerIndent = format!("{}    ", BaseIndent);
            let HeadTrimmed = Head.trim_end();

            let mut NewLines = Vec::new();
            
            let CursorCol = InnerIndent.len();

            let CursorLine = if !HeadTrimmed.is_empty()
            {
                NewLines.push(HeadTrimmed.to_string());
                NewLines.push(format!("{}{}", BaseIndent, Open));
                NewLines.push(InnerIndent.clone());
                NewLines.push(format!("{}{}{}", BaseIndent, Close, Tail.trim_start()));
                LineIdx + 2
            }
            else
            {
                NewLines.push(format!("{}{}", BaseIndent, Open));
                NewLines.push(InnerIndent.clone());
                NewLines.push(format!("{}{}{}", BaseIndent, Close, Tail.trim_start()));
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

        // Case 2: Container with inner content after non-whitespace head
        if let (Some(OpenIdx), Some(CloseIdx)) = (Pre.rfind(Open), Post.find(Close))
        {
            let Head = &Pre[..OpenIdx];
            if !Head.trim().is_empty()
            {
                let InnerPre = &Pre[OpenIdx + Open.len()..];
                let InnerPost = &Post[..CloseIdx];
                let Tail = &Post[CloseIdx + Close.len()..];

                let BaseIndent: String = Line.chars().take_while(|C| C.is_whitespace()).collect();
                let InnerIndent = format!("{}    ", BaseIndent);

                let mut NewLines = Vec::new();
                NewLines.push(Head.trim_end().to_string());
                NewLines.push(format!("{}{}", BaseIndent, Open));

                let TrimmedPre = InnerPre.trim();
                let TrimmedPost = InnerPost.trim();

                let CursorLine;
                let CursorCol;

                if TrimmedPre.is_empty() && !TrimmedPost.is_empty()
                {
                    // Cursor is before inner content, e.g. #text(|size: 8.5pt)
                    NewLines.push(format!("{}{}", InnerIndent, InnerPost.trim_start()));
                    NewLines.push(format!("{}{}{}", BaseIndent, Close, Tail.trim_start()));
                    CursorLine = LineIdx + 2;
                    CursorCol = InnerIndent.len();
                }
                else if !TrimmedPre.is_empty() && TrimmedPost.is_empty()
                {
                    // Cursor is after inner content, e.g. #text(size: 8.5pt|)
                    NewLines.push(format!("{}{}", InnerIndent, InnerPre.trim_end()));
                    NewLines.push(InnerIndent.clone());
                    NewLines.push(format!("{}{}{}", BaseIndent, Close, Tail.trim_start()));
                    CursorLine = LineIdx + 3;
                    CursorCol = InnerIndent.len();
                }
                else
                {
                    // Both have content or both empty
                    NewLines.push(format!("{}{}", InnerIndent, InnerPre.trim_end()));
                    NewLines.push(format!("{}{}", InnerIndent, InnerPost.trim_start()));
                    NewLines.push(format!("{}{}{}", BaseIndent, Close, Tail.trim_start()));
                    CursorLine = LineIdx + 3;
                    CursorCol = InnerIndent.len();
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

    let LineL = Lines[EndLine - 1];
    let TrimmedL = LineL.trim_start();
    let LeadingL = LineL.len() - TrimmedL.len();

    let OpenGlyphs = ["```", "\"\"\"", "$$", "[{(", "([", "[(", "`", "$", "|", "[", "{", "("];
    let _MatchedGlyph = OpenGlyphs.iter().find(|&&G| TrimmedL.starts_with(G))?;
    let OpenCol1Based = LeadingL + 1;

    if EndCol > OpenCol1Based
    {
        return None;
    }

    let LineA = Lines[StartLine - 1];
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
    let mut Changed = false;
    let mut NewLines = Vec::new();

    let OpenGlyphs = ["```", "\"\"\"", "$$", "[{(", "([", "[(", "`", "$", "|", "[", "{", "("];

    for Line in Lines
    {
        let Trimmed = Line.trim();
        if Trimmed.starts_with("//")
        {
            NewLines.push(Line.to_string());
            continue;
        }

        let mut Matched = None;
        for &Og in &OpenGlyphs
        {
            if let Some(Head) = Line.strip_suffix(Og).filter(|H| !H.trim().is_empty())
            {
                Matched = Some((Og, Head));
                break;
            }
        }

        if let Some((Og, Head)) = Matched
        {
            let BaseIndent: String = Line.chars().take_while(|C| C.is_whitespace()).collect();
            NewLines.push(Head.trim_end().to_string());
            NewLines.push(format!("{}{}", BaseIndent, Og));
            Changed = true;
        }
        else
        {
            NewLines.push(Line.to_string());
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
}

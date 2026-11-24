//! Parser and syntax tree for Typst.

pub mod ast;
pub mod package;

mod highlight;
mod kind;
mod lexer;
mod lines;
mod node;
mod parser;
mod path;
mod reparser;
mod set;
mod source;
mod span;

pub use self::highlight:: { Tag, highlight, highlight_html };
pub use self::kind::SyntaxKind;
pub use self::lexer:: { is_id_continue, is_id_start, is_ident, is_newline, is_valid_label_literal_id, link_prefix, split_newlines, };
pub use self::lines::Lines;
pub use self::node:: { Diagnosis, LinkedChildren, LinkedNode, Side, SyntaxDiagnostic, SyntaxNode, };
pub use self::parser:: { parse, parse_code, parse_math };
pub use self::path:: { FileId, PathError, RealizeError, RootedPath, VirtualPath, VirtualRoot, VirtualizeError, };
pub use self::source::Source;
pub use self::span:: { DiagSpan, DiagSpanKind, LooselySpanned, RangeMapper, Span, SpanKind, SpanNumber, Spanned, SubRange, };

use self::lexer::Lexer;
use self::parser:: { reparse_block, reparse_markup };

/// The syntax mode of a portion of Typst code.
#[derive(Debug, Copy, Clone, Eq, PartialEq, Hash)]
pub enum SyntaxMode
{
    /// Text and markup, as in the top level.
    Markup,
    /// Math atoms, operators, etc., as in equations.
    Math,
    /// Keywords, literals and operators, as after hashes.
    Code,
}

#[cfg(test)]
mod tests
{
    use super:: * ;

    # [test]
    fn test_allman_snippet()
    {
        let text = r#"#set page
(
  paper: "us-trade", // Standard 6" x 9" book size
  margin:
  (
    inside: 0.85in,  // Gutter for binding
    outside: 0.625in,
    top: 0.75in,
    bottom: 0.75in,
  ),
  header: context
  {
    let page_num = counter(page).get().first()
    if page_num > 2
    {
      if calc.even(page_num)
      {
        align(left, text(8.5pt)[INTERCEPTION])
      }
      else
      {
        align(right, text(8.5pt)[BOOK 0: GENESIS OF THE VANGUARD])
      }
    }
  },
  footer: context
  {
    let page_num = counter(page).get().first()
    if page_num > 2
    {
      align(center, text(9pt)[#page_num])
    }
  }
)

#set text
(
  font: ("Linux Libertine", "Noto Serif Devanagari"),
  size: 11pt,
  lang: "en"
)

#set par
(
  justify: true,
  leading: 0.78em,      // Line spacing
  first-line-indent: 0.25in
)

// --- TITLE PAGE ---
#align(center + horizon)
[
  #text(size: 24pt, weight: "bold")[INTERCEPTION]\
  #v(1em)
  #text(size: 14pt, style: "italic")[Book 0: Genesis of the Vanguard]\
  #v(3em)
  #text(size: 12pt, weight: "medium")[BY MR. NOBODY]
]

#pagebreak()
"#;
        let node = parse(text);
        let (errors, _) = node.errors_and_warnings();
        assert!(errors.is_empty(),"Expected 0 errors, got: {:#?}", errors);
    }

    # [test]
    fn test_allman_comprehensive()
    {
        let tests =
        [
            // If-else in markup
            r#"#if true
{
  1
}
else if false
{
  2
}
else
{
  3
}
"#,
            // While loop
            r#"#{
  let x = 0
  while x < 5
  {
    x += 1
  }
}
"#,
            // For loop
            r#"#{
  for x in (1, 2, 3)
  {
    x
  }
}
"#,
            // Function call in code
            r#"#{
  align
  (
    center
  )
}
"#,
            // Function call with trailing content block in code
            r#"#{
  align(center)
  [
    Hello
  ]
}
"#,
            // Let function definition
            r#"#{
  let f
  (
    x, y
  ) =
  {
    x + y
  }
}
"#,
            // Show rule
            r#"#show heading:
[
  Small heading
]
"#,
            // Context in markup
            r#"#context
{
  counter(page).get()
}
"#,
            // Closure in Allman style
            r#"#{
  let f = (x, y) =>
  {
    x + y
  }
}
"#,
            // Destructuring assignment in Allman style
            r#"#{
  let (a, b) =
  (
    1, 2
  )
}
"#,
        ];

        for (i, t) in tests.iter().enumerate()
        {
            let node = parse(t);
            let (errors, _warnings) = node.errors_and_warnings();
            assert!(errors.is_empty(),"Test {} failed with errors: {:#?}\nCode:\n{}", i, errors, t);
        }
    }

    #[test]
    fn test_parser_grammar_regressions()
    {
        let tests =
        [
            // Function definitions returning content-block calls
            "#let f() = text[hi]",
            "#let f(x) = text[#x]",
            "#{ let f() = text[hi] }",
            "#{ let f = () => text[hi] }",

            // Closures returning content-block calls
            "#let f = x => text[#x]",
            "#{ let f = x => text[#x] }",
            "#{ let f = (x, y) => text[#x #y] }",
            "#{ let _ = text[hi] }",
            "#{ let (a, b) = (text[hi], text[bye]) }",

            // Detached content blocks across newlines in markup mode
            "#align(center)\n[\n  Hello\n]",
            "#table.cell\n[\n  Content\n]",
            "#text\n[\n  Content\n]",
            "#table(columns: 2)[\n  A\n][\n  B\n]",

            // Detached content blocks in code blocks
            "#{ table.cell\n[\n  Content\n] }",
            "#{ align(center)\n[\n  Hello\n] }",

            // Conditionals and loops preserving block boundaries
            "#if true [yes] else [no]",
            "#if true {\n  1\n} else {\n  2\n}",
            "#{ while x < 5 { x += 1 } }",
            "#{ for x in (1, 2) [item #x] }",
            "#set text(10pt) if true",
            "#show heading: it => it.body",
        ];

        for (i, t) in tests.iter().enumerate()
        {
            let node = parse(t);
            let (errors, _warnings) = node.errors_and_warnings();
            assert!(errors.is_empty(), "Regression test {} failed with errors: {:#?}\nCode:\n{}", i, errors, t);
        }
    }

    #[test]
    fn test_ast_hierarchy_verification()
    {
        // 1. Verify #align(center)\n[Hello] attaches [Hello] into FuncCall Args
        let text1 = "#align(center)\n[Hello]";
        let node1 = parse(text1);
        let (errors1, _) = node1.errors_and_warnings();
        assert!(errors1.is_empty(), "Parse errors in text1: {:#?}", errors1);

        let calls: Vec<_> = node1.children()
            .filter(|n| n.kind() == SyntaxKind::FuncCall)
            .collect();
        assert_eq!(calls.len(), 1, "Expected exactly 1 FuncCall in root");
        let call = calls[0];
        let args: Vec<_> = call.children()
            .filter(|n| n.kind() == SyntaxKind::Args)
            .collect();
        assert_eq!(args.len(), 1, "Expected exactly 1 Args in FuncCall");
        let has_content_block = args[0].children()
            .any(|n| n.kind() == SyntaxKind::ContentBlock);
        assert!(has_content_block, "Detached [Hello] must be a child of FuncCall Args");

        // 2. Verify #table.cell\n[Content] parses as FuncCall with FieldAccess callee
        let text2 = "#table.cell\n[Content]";
        let node2 = parse(text2);
        let (errors2, _) = node2.errors_and_warnings();
        assert!(errors2.is_empty(), "Parse errors in text2: {:#?}", errors2);

        let calls2: Vec<_> = node2.children()
            .filter(|n| n.kind() == SyntaxKind::FuncCall)
            .collect();
        assert_eq!(calls2.len(), 1, "Expected FuncCall for #table.cell[Content]");
        let callee = calls2[0].children().next().unwrap();
        assert_eq!(callee.kind(), SyntaxKind::FieldAccess, "Callee must be FieldAccess");

        // 3. Verify #let f() = text[hi] parses closure body as FuncCall
        let text3 = "#let f() = text[hi]";
        let node3 = parse(text3);
        let (errors3, _) = node3.errors_and_warnings();
        assert!(errors3.is_empty(), "Parse errors in text3: {:#?}", errors3);

        let bindings: Vec<_> = node3.children()
            .filter(|n| n.kind() == SyntaxKind::LetBinding)
            .collect();
        assert_eq!(bindings.len(), 1, "Expected LetBinding");
        let closure = bindings[0].children()
            .find(|n| n.kind() == SyntaxKind::Closure)
            .expect("Expected Closure in function let binding");
        let closure_call = closure.children()
            .any(|n| n.kind() == SyntaxKind::FuncCall);
        assert!(closure_call, "Closure body must parse text[hi] as FuncCall");

        // 4. Verify #let f = x => text[#x] parses closure body as FuncCall
        let text4 = "#let f = x => text[#x]";
        let node4 = parse(text4);
        let (errors4, _) = node4.errors_and_warnings();
        assert!(errors4.is_empty(), "Parse errors in text4: {:#?}", errors4);

        let bindings4: Vec<_> = node4.children()
            .filter(|n| n.kind() == SyntaxKind::LetBinding)
            .collect();
        assert_eq!(bindings4.len(), 1, "Expected LetBinding");
        let closure4 = bindings4[0].children()
            .find(|n| n.kind() == SyntaxKind::Closure)
            .expect("Expected Closure");
        let closure_call4 = closure4.children()
            .any(|n| n.kind() == SyntaxKind::FuncCall);
        assert!(closure_call4, "Arrow closure body must parse text[#x] as FuncCall");

        // 5. False-Attachment Trap: { let x = a \n (b + c) } must be 2 separate statements
        let text5 = "let x = a\n(b + c)";
        let node5 = parse_code(text5);
        let (errors5, _) = node5.errors_and_warnings();
        assert!(errors5.is_empty(), "Parse errors in text5: {:#?}", errors5);
        let non_trivia5: Vec<_> = node5.children()
            .filter(|n| !n.kind().is_trivia())
            .collect();
        assert_eq!(non_trivia5.len(), 2, "Expected 2 statements in code: {:#?}", non_trivia5);
        assert_eq!(non_trivia5[0].kind(), SyntaxKind::LetBinding);
        assert_eq!(non_trivia5[1].kind(), SyntaxKind::Parenthesized);
        let has_call5 = non_trivia5[0].children().any(|n| n.kind() == SyntaxKind::FuncCall);
        assert!(!has_call5, "LetBinding must NOT have falsely attached (b + c) as a FuncCall");

        // 6. False-Attachment Trap: { let x = a \n [content] } must be 2 separate statements
        let text6 = "let x = a\n[content]";
        let node6 = parse_code(text6);
        let (errors6, _) = node6.errors_and_warnings();
        assert!(errors6.is_empty(), "Parse errors in text6: {:#?}", errors6);
        let non_trivia6: Vec<_> = node6.children()
            .filter(|n| !n.kind().is_trivia())
            .collect();
        assert_eq!(non_trivia6.len(), 2, "Expected 2 statements in code: {:#?}", non_trivia6);
        assert_eq!(non_trivia6[0].kind(), SyntaxKind::LetBinding);
        assert_eq!(non_trivia6[1].kind(), SyntaxKind::ContentBlock);

        // 7. Valid LAFS: func \n ( \n arg1, \n arg2 \n ) must parse as single FuncCall
        let text7 = "func\n(\n  arg1,\n  arg2\n)";
        let node7 = parse_code(text7);
        let (errors7, _) = node7.errors_and_warnings();
        assert!(errors7.is_empty(), "Parse errors in text7: {:#?}", errors7);
        let non_trivia7: Vec<_> = node7.children()
            .filter(|n| !n.kind().is_trivia())
            .collect();
        assert_eq!(non_trivia7.len(), 1, "Expected 1 statement for detached func call");
        assert_eq!(non_trivia7[0].kind(), SyntaxKind::FuncCall);
        let args7 = non_trivia7[0].children().find(|n| n.kind() == SyntaxKind::Args).expect("Expected Args");
        let arg_count = args7.children().filter(|n| !n.kind().is_trivia() && n.kind() != SyntaxKind::LeftParen && n.kind() != SyntaxKind::RightParen && n.kind() != SyntaxKind::Comma).count();
        assert_eq!(arg_count, 2, "Expected 2 arguments in detached FuncCall");

        // 8. Valid LAFS: chained method calls across newlines
        let text8 = "x\n.map(str)\n.join(\", \")";
        let node8 = parse_code(text8);
        let (errors8, _) = node8.errors_and_warnings();
        assert!(errors8.is_empty(), "Parse errors in text8: {:#?}", errors8);
        let non_trivia8: Vec<_> = node8.children()
            .filter(|n| !n.kind().is_trivia())
            .collect();
        assert_eq!(non_trivia8.len(), 1, "Expected 1 statement for chained method call");
        assert_eq!(non_trivia8[0].kind(), SyntaxKind::FuncCall);

        // 9. Valid LAFS: detached function let binding
        let text9 = "#let f\n(\n  a,\n  b\n)\n=\n{\n  a + b\n}";
        let node9 = parse(text9);
        let (errors9, _) = node9.errors_and_warnings();
        assert!(errors9.is_empty(), "Parse errors in text9: {:#?}", errors9);
        let binding9 = node9.children().find(|n| n.kind() == SyntaxKind::LetBinding).expect("Expected LetBinding");
        let closure9 = binding9.children().find(|n| n.kind() == SyntaxKind::Closure).expect("Expected Closure");
        assert!(closure9.children().any(|n| n.kind() == SyntaxKind::Params));
        assert!(closure9.children().any(|n| n.kind() == SyntaxKind::CodeBlock));

        // Helper to recursively search for a syntax kind
        fn has_kind(node: &SyntaxNode, kind: SyntaxKind) -> bool {
            node.kind() == kind || node.children().any(|c| has_kind(c, kind))
        }

        // 10. False-Attachment Trap: prose in markup mode with parentheses on next line
        let text10 = "Hello #name\n(this is prose)";
        let node10 = parse(text10);
        let (errors10, _) = node10.errors_and_warnings();
        assert!(errors10.is_empty(), "Parse errors in text10: {:#?}", errors10);
        let has_call10 = has_kind(&node10, SyntaxKind::FuncCall);
        assert!(!has_call10, "Hello #name \\n (this is prose) must NOT parse as FuncCall");

        // 11. False-Attachment Trap: prose in markup mode with brackets on next line
        let text11 = "Hello #name\n[this is prose]";
        let node11 = parse(text11);
        let (errors11, _) = node11.errors_and_warnings();
        assert!(errors11.is_empty(), "Parse errors in text11: {:#?}", errors11);
        let has_call11 = has_kind(&node11, SyntaxKind::FuncCall);
        assert!(!has_call11, "Hello #name \\n [this is prose] must NOT parse as FuncCall");

        // 12. Heading after bracket in markup mode
        let text12 = "[some text]\n= Heading\n";
        let node12 = parse(text12);
        let (errors12, _) = node12.errors_and_warnings();
        assert!(errors12.is_empty(), "Parse errors in text12: {:#?}", errors12);
        assert!(node12.children().any(|n| n.kind() == SyntaxKind::Heading));
    }
}

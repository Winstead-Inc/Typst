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

pub use self::highlight::{Tag, highlight, highlight_html};
pub use self::kind::SyntaxKind;
pub use self::lexer::{
    is_id_continue, is_id_start, is_ident, is_newline, is_valid_label_literal_id,
    link_prefix, split_newlines,
};
pub use self::lines::Lines;
pub use self::node::{
    Diagnosis, LinkedChildren, LinkedNode, Side, SyntaxDiagnostic, SyntaxNode,
};
pub use self::parser::{parse, parse_code, parse_math};
pub use self::path::{
    FileId, PathError, RealizeError, RootedPath, VirtualPath, VirtualRoot,
    VirtualizeError,
};
pub use self::source::Source;
pub use self::span::{
    DiagSpan, DiagSpanKind, LooselySpanned, RangeMapper, Span, SpanKind, SpanNumber,
    Spanned, SubRange,
};

use self::lexer::Lexer;
use self::parser::{reparse_block, reparse_markup};

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
    use super::*;

    #[test]
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
        assert!(errors.is_empty(), "Expected 0 errors, got: {:#?}", errors);
    }

    #[test]
    fn test_allman_comprehensive()
    {
        let tests = [
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
            assert!(
                errors.is_empty(),
                "Test {} failed with errors: {:#?}\nCode:\n{}",
                i,
                errors,
                t
            );
        }
    }
}

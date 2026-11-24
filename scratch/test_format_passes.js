function FormatTypstLAFS(Source)
{
    const Lines = (Source || "").split(/\r?\n/);
    const ResultLines = [];
    let InRawBlock = false;
    let CurrentRawLines = [];
    let InBlockComment = false;

    for (let I = 0; I < Lines.length; I ++)
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
                // Ensure prefix does not end with backtick or unclosed quote
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

const original = `#import "system.typ": colors
#import "base.typ": (
  classnames, folding-details, heading-offset, html-heading-n, icon, labelled,
  oneliner, paged-heading-offset, short-or-long, small, text-with-code,
  title-case, to-func, use-icon, with-tooltip,
)
#import "example.typ": example, example-like-block

#let param-signature(func, path, params, returns) = context {
  let func-label = def-label(func)

  if target() == "paged" {
    example-like-block({
      set par(leading: 0.8em)
      let path = path.map(raw)
      path.last() = text(fill: colors.text.syntax.blue, path.last())
      path.join(\`.\`)
      if params.len() > 1 {
        [\\ \`(\`]
      } else {
        \`(\`
      }
      for param in params {
        let param-label = label(str(func-label) + "." + param.name)
        if params.len() > 1 {
          [\\ \`    \`]
        }
        if param.variadic {
          [\`..\`]
        }
        if param.named {
          ref(param-label, supplement: raw(param.name))
          \`: \`
        }
        flat-types(param.input).map(ty-pill).join(h(0.3em))
        if params.len() > 1 {
          [\`,\`]
        }
      }
      if params.len() > 1 {
        [\\ \`)\`]
      } else {
        \`)\`
      }

      let returns = flat-types(returns)
      if returns.len() > 0 {
        raw(" " + sym.arrow.r + " ")
        returns.map(ty-pill).join(h(0.3em))
      }
    })
  }
}`;

let current = original;
for (let pass = 1; pass <= 3; pass++) {
    current = FormatTypstLAFS(current);
    console.log(`\n--- PASS ${pass} ---`);
    console.log(current);
}

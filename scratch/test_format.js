const fs = require("fs");
const AppJs = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const ServerJs = fs.readFileSync("TypstStudio/Server.js", "utf8");

// Extract FormatTypstLAFS from AppJs
const startIdx = AppJs.indexOf("function FormatTypstLAFS(Source)");
const endIdx = AppJs.indexOf("\nfunction InitializeMonaco()", startIdx);
const funcStr = AppJs.slice(startIdx, endIdx);

eval(funcStr);

const snippet = `#import "system.typ": colors
#import "base.typ": (
  classnames, folding-details, heading-offset, html-heading-n, icon, labelled,
  oneliner, paged-heading-offset, short-or-long, small, text-with-code,
  title-case, to-func, use-icon, with-tooltip,
)
#import "example.typ": example, example-like-block
#import "linking.typ": def-dest, def-label, register-def
#import "live.typ": item-source-link, live-docs
#import "pill.typ": ty-pill
#import "reflect.typ": cast-strings, flat-types, std-path-of
#import "search.typ": register-index-item
#import "section.typ": docs-section
#import "styling.typ": prose-styling
#import "table.typ": docs-table

// Build a scope from a module and binding info.
#let scope-from(val, info) = {
  let mod = if type(val) == function {
    stdx.describe(val).scope
  } else {
    val
  }
  return (val: val, dict: dictionary(mod), info: info)
}

// Build the scope information for a module.
//
// Requires the parent module and the name of the module.
#let scope(parent, key) = scope-from(
  dictionary(parent).at(key),
  stdx.binding(parent, key),
)

// Get nested binding information, feature gates of the parent scope info will
// be forwarded to the nested item info.
#let nested-binding(scope, key) = {
  let info = stdx.binding(scope.val, key)
  if info.feature == none {
    info.feature = scope.info.feature
  }
  info
}

// Displays the overview box for a function signature.
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

const result = FormatTypstLAFS(snippet);
console.log("=== FORMATTED RESULT ===");
console.log(result);

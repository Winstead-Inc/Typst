const fs = require("fs");
const AppJs = fs.readFileSync("TypstStudio/public/App.js", "utf8");

const startIdx = AppJs.indexOf("function DetectKnrSlop(");
const endIdx = AppJs.indexOf("\nfunction ValidateEditorLAFS()", startIdx);
const funcStr = AppJs.slice(startIdx, endIdx);

eval(funcStr);

const testCode = `{
  let path = path
  path.last() = html.span(class: "typ-func", path.last())
  path.join(html.span(class: "typ-punct", [.]))
  [(]
  container
  (
    class: "arguments",
    {
      for param in params
      {
        let param-label = label(str(func-label) + "." + param.name)
        html.span
        (
          class: "overview-param", context
          {
            if param.variadic { [..] }
            if param.named { ref(param-label, supplement: param.name) }
            flat-types(param.input).map(ty-pill).join()
            if params.len() > 1 { [,] }
          }
        )
      }
    }
  )
  [)]
}`;

const res = DetectKnrSlop(testCode, "category.typ");
console.log("Live App.js DetectKnrSlop result:");
console.log("HasError:", res.HasError);
if (res.HasError) {
    console.log("Errors:", res.Errors);
} else {
    console.log("SUCCESS: 0 errors detected for [(] and [)] in live App.js!");
}

const fs = require('fs');
const app = fs.readFileSync('TypstStudio/public/App.js', 'utf8');
const lines = app.split(/\r?\n/);
const fnStartLine = 2541; // 1-based
const fnEndLine = 3067;
const fnCode = lines.slice(fnStartLine - 1, fnEndLine).join('\n');

eval(fnCode);

const snippet = `{
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
                        if param.named { ref(param-label, supplement: param.name) + [:] }
                        flat-types(param.input).map(ty-pill).join()
                        if params.len() > 1 { [,] }
                    }
                )
            }
        }
    )
    [)]
}`;

const res = DetectKnrSlop(snippet, 'test.typ');
console.log('Errors count:', res.Errors.length);
console.log('Errors:', JSON.stringify(res.Errors, null, 2));

const fs = require("fs");

let appJs = fs.readFileSync("TypstStudio/public/App.js", "utf8");

const completionProviderCode =
`
            // Typst IntelliSense & LAFS Snippets Provider (Priority 1)
            monaco.languages.registerCompletionItemProvider
            (
                "typst",
                {
                    triggerCharacters: ["#", "$", "@", "<", ".", " ", ":", "/", "\\\\"],
                    provideCompletionItems: (Model, Position) =>
                    {
                        const Word = Model.getWordUntilPosition(Position);
                        const Range =
                        {
                            startLineNumber: Position.lineNumber,
                            endLineNumber: Position.lineNumber,
                            startColumn: Word.startColumn,
                            endColumn: Word.endColumn
                        };

                        const Suggestions = [];

                        // 1. LAFS Snippets with Allman detached delimiters
                        const Snippets =
                        [
                            {
                                label: "mat (LAFS Matrix)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "mat\\n(\\n\\t\${1:1}, \${2:2};\\n\\t\${3:3}, \${4:4}\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "2D Matrix with LAFS Allman detached delimiters",
                                detail: "LAFS Matrix"
                            },
                            {
                                label: "vec (LAFS Vector)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "vec\\n(\\n\\t\${1:x},\\n\\t\${2:y}\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Vector with LAFS Allman detached delimiters",
                                detail: "LAFS Vector"
                            },
                            {
                                label: "cases (LAFS Cases)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "cases\\n(\\n\\t\${1:1} \\"if\\" \${2:x > 0},\\n\\t\${3:0} \\"otherwise\\"\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Piecewise cases with LAFS Allman detached delimiters",
                                detail: "LAFS Cases"
                            },
                            {
                                label: "table (LAFS Table)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#table\\n(\\n\\tcolumns: (\${1:1fr, 1fr}),\\n\\tstroke: 0.5pt + rgb(\\"CCCCCC\\"),\\n\\ttable.header([*\${2:Header 1}*], [*\${3:Header 2}*]),\\n\\t[\${4:Item 1}], [\${5:Value 1}]\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Table with LAFS Allman detached delimiters and headers",
                                detail: "LAFS Table"
                            },
                            {
                                label: "table-merged (LAFS Merged Cells)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#table\\n(\\n\\tcolumns: (\${1:1.5fr, 1fr, 1.2fr, 2fr}),\\n\\tstroke: 0.5pt + rgb(\\"CCCCCC\\"),\\n\\ttable.header\\n\\t(\\n\\t\\ttable.cell(colspan: 4, fill: rgb(\\"E4E9F0\\"))[*\${2:Full Title}*]\\n\\t),\\n\\ttable.cell(rowspan: 2, fill: rgb(\\"FAFAFA\\"))[*\${3:Group}*],\\n\\t[\${4:Sub 1}], [\${5:4.2 ms}], [\${6:Incremental Allman AST}],\\n\\t[\${7:Sub 2}], [\${8:18.7 ms}], [\${9:Vector Layout Engine}]\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Table with merged cells (colspan & rowspan) in LAFS",
                                detail: "LAFS Merged Table"
                            },
                            {
                                label: "setpage (LAFS Page Setup)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#set page\\n(\\n\\tpaper: \\"\${1:a4}\\",\\n\\tmargin: \${2:2.5cm}\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Configure page paper size and margins in LAFS",
                                detail: "LAFS Page Setup"
                            },
                            {
                                label: "settext (LAFS Typography Setup)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#set text\\n(\\n\\tfont: \\"\${1:Times New Roman}\\",\\n\\tsize: \${2:11pt}\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Configure font family and size in LAFS",
                                detail: "LAFS Typography Setup"
                            },
                            {
                                label: "setpar (LAFS Paragraph Setup)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#set par\\n(\\n\\tjustify: \${1:true},\\n\\tleading: \${2:0.75em}\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Configure paragraph justification and leading in LAFS",
                                detail: "LAFS Paragraph Setup"
                            },
                            {
                                label: "figure (LAFS Figure)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#figure\\n(\\n\\t\${1:content},\\n\\tcaption: [\${2:Caption description}]\\n) <\${3:fig:label}>",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Numbered figure with caption and label in LAFS",
                                detail: "LAFS Figure"
                            },
                            {
                                label: "grid (LAFS Grid)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#grid\\n(\\n\\tcolumns: (\${1:1fr, 1fr}),\\n\\tgutter: \${2:10pt},\\n\\t[\${3:Left}],\\n\\t[\${4:Right}]\\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Multi-column grid in LAFS",
                                detail: "LAFS Grid"
                            },
                            {
                                label: "let-func (LAFS Function)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#let \${1:FunctionName}(\${2:Param1, Param2}) =\\n{\\n\\t\${3:[Result content]}\\n}",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Turing-complete functional helper in LAFS",
                                detail: "LAFS Function"
                            }
                        ];
                        for (const S of Snippets)
                        {
                            Suggestions.push({ ...S, range: Range });
                        }

                        // 2. Builtin Functions & Primitives
                        const Builtins =
                        [
                            { label: "align", detail: "align(alignment)[body]", insertText: "align(\${1:center})[\\n\\t\${2:body}\\n]" },
                            { label: "text", detail: "text(size, fill)[content]", insertText: "text(\${1:11pt})[\${2:content}]" },
                            { label: "par", detail: "par(justify: true)[...]", insertText: "par(justify: \${1:true})[\\n\\t\${2:content}\\n]" },
                            { label: "image", detail: "image(path, width: ...)", insertText: "image(\\"\${1:path.png}\\", width: \${2:100%})" },
                            { label: "rect", detail: "rect(width, height, fill)", insertText: "rect(width: \${1:100%}, height: \${2:30pt}, fill: rgb(\\"\${3:4338CA}\\"))" },
                            { label: "circle", detail: "circle(radius, fill)", insertText: "circle(radius: \${1:15pt}, fill: rgb(\\"\${2:6366F1}\\"))" },
                            { label: "columns", detail: "columns(n)[body]", insertText: "columns(\${1:2})[\\n\\t\${2:body}\\n]" },
                            { label: "line", detail: "line(length, stroke)", insertText: "line(length: \${1:100%}, stroke: \${2:0.5pt + rgb(\\"CCCCCC\\")})" },
                            { label: "v", detail: "v(spacing)", insertText: "v(\${1:1em})" },
                            { label: "h", detail: "h(spacing)", insertText: "h(\${1:1fr})" },
                            { label: "box", detail: "box(inset: ...)[...]", insertText: "box(inset: \${1:4pt})[\${2:content}]" },
                            { label: "block", detail: "block(fill: ...)[...]", insertText: "block(fill: rgb(\\"\${1:F1F3F6}\\"), inset: \${2:8pt})[\\n\\t\${3:content}\\n]" },
                            { label: "outline", detail: "outline(title: ...)", insertText: "outline(title: \\"\${1:Document Index}\\", indent: \${2:1.5em})" },
                            { label: "footnote", detail: "footnote[text]", insertText: "footnote[\${1:Footnote text}]" },
                            { label: "bibliography", detail: "bibliography(path)", insertText: "bibliography(\\"\${1:works.bib}\\")" },
                            { label: "cite", detail: "@key citation", insertText: "@\${1:key}" }
                        ];
                        for (const B of Builtins)
                        {
                            Suggestions.push
                            ({
                                label: B.label,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: B.insertText,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                detail: B.detail,
                                range: Range
                            });
                        }

                        // 3. Keywords
                        const Keywords = ["let", "set", "show", "context", "if", "else", "while", "for", "in", "return", "import", "include"];
                        for (const Kw of Keywords)
                        {
                            Suggestions.push
                            ({
                                label: Kw,
                                kind: monaco.languages.CompletionItemKind.Keyword,
                                insertText: Kw,
                                range: Range
                            });
                        }

                        // 4. Math symbols & Greek
                        const MathSymbols =
                        [
                            "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta",
                            "iota", "kappa", "lambda", "mu", "nu", "xi", "pi", "rho", "sigma",
                            "tau", "upsilon", "phi", "chi", "psi", "omega", "infinity", "nabla",
                            "partial", "dif", "times", "integral", "sum", "product", "lim",
                            "sqrt", "root", "binom", "abs", "norm", "arrow", "hat", "tilde",
                            "dot", "dot.double", "macron"
                        ];
                        for (const Sym of MathSymbols)
                        {
                            Suggestions.push
                            ({
                                label: Sym,
                                kind: monaco.languages.CompletionItemKind.Variable,
                                insertText: Sym,
                                detail: "Math Symbol",
                                range: Range
                            });
                        }

                        return { suggestions: Suggestions };
                    }
                }
            );`;

appJs = appJs.replace
(
    'const Container = document.getElementById("MonacoContainer");',
    `${completionProviderCode}\n\n            const Container = document.getElementById("MonacoContainer");`
);

fs.writeFileSync("TypstStudio/public/App.js", appJs, "utf8");
console.log("SUCCESS: Added registerCompletionItemProvider to App.js");

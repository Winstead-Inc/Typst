const fs = require("fs");
const path = require("path");

const appJsPath = "TypstStudio/public/App.js";
let appJs = fs.readFileSync(appJsPath, "utf8");
// 1. Read the comprehensive showcase from projects/GenesisOfTheVanguard/main.typ
const showcaseContent = fs.readFileSync("projects/GenesisOfTheVanguard/main.typ", "utf8");
// Escape backticks and backslashes for template literal
const escapedShowcase = showcaseContent
.replace(/\\/g, "\\\\")
.replace(/`/g, "\\`")
.replace(/\${/g, "\\${");
// Replace showcase template in TEMPLATES
appJs = appJs.replace(/showcase:\s*`[\s\S]*?`\s*};/, `showcase: \`${escapedShowcase}\`\n};`);
// 2. Add global state variables and helper functions after let RenderToken = 0;
const globalAdditions = `let RenderToken = 0;
let LastSavedContent = "";
let IsDocumentDirty = false;
let PrimaryErrorLocation = null;

function ShowToast(Message, Type = "info", DurationMs = 3000)
{
    const Container = document.getElementById("ToastContainer");
    if (!Container) { return; }

    const Toast = document.createElement("div");
    const NormalizedType = Type.charAt(0).toUpperCase() + Type.slice(1).toLowerCase();
    Toast.className = \`Toast Toast\${NormalizedType}\`;

    let IconSvg = "";
    if (Type === "success")
    {
        IconSvg = \`<svg Class = "ToastIcon" Width = "16" Height = "16" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2"><polyline Points = "20 6 9 17 4 12" /></svg>\`;
    }
    else if (Type === "error")
    {
        IconSvg = \`<svg Class = "ToastIcon" Width = "16" Height = "16" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2"><circle Cx = "12" Cy = "12" R = "10" /><line X1 = "15" Y1 = "9" X2 = "9" Y2 = "15" /><line X1 = "9" Y1 = "9" X2 = "15" Y2 = "15" /></svg>\`;
    }
    else
    {
        IconSvg = \`<svg Class = "ToastIcon" Width = "16" Height = "16" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2"><circle Cx = "12" Cy = "12" R = "10" /><line X1 = "12" Y1 = "16" X2 = "12" Y2 = "12" /><line X1 = "12" Y1 = "8" X2 = "12.01" Y2 = "8" /></svg>\`;
    }

    Toast.innerHTML = \`\${IconSvg}<span Class = "ToastMessage">\${Message}</span>\`;
    Container.appendChild(Toast);

    requestAnimationFrame
    (
        () =>
        {
            Toast.classList.add("Visible");
        }
    );

    setTimeout
    (
        () =>
        {
            Toast.classList.remove("Visible");
            setTimeout
            (
                () =>
                {
                    if (Toast.parentNode)
                    {
                        Toast.parentNode.removeChild(Toast);
                    }
                },
                300
            );
        },
        DurationMs
    );
}

function MarkDocumentClean(Content)
{
    LastSavedContent = typeof Content === "string" ? Content : (MonacoInstance ? MonacoInstance.getValue() : "");
    IsDocumentDirty = false;
    UpdateDirtyStateUI();
}

function CheckDocumentDirty()
{
    if (!MonacoInstance) { return; }
    const Current = MonacoInstance.getValue();
    const WasDirty = IsDocumentDirty;
    IsDocumentDirty = (Current !== LastSavedContent);
    if (WasDirty !== IsDocumentDirty)
    {
        UpdateDirtyStateUI();
    }
}

function UpdateDirtyStateUI()
{
    const Dot = document.getElementById("UnsavedDirtyDot");
    const TitleInput = document.getElementById("DocumentTitleInput");
    const ActiveName = TitleInput ? TitleInput.value.trim() : (CurrentFilePath ? CurrentFilePath.split(/[\\/\\\\]/).pop() : "main.typ");

    if (Dot)
    {
        Dot.style.display = IsDocumentDirty ? "inline-block" : "none";
    }

    if (IsDocumentDirty)
    {
        document.title = \`● Typst Studio — \${ActiveName}*\`;
    }
    else
    {
        document.title = \`Typst Studio — \${ActiveName}\`;
    }
}

function JumpToEditorLocation(Line, Col)
{
    if (!MonacoInstance) { return; }
    MonacoInstance.revealPositionInCenter({ lineNumber: Line, column: Col });
    MonacoInstance.setPosition({ lineNumber: Line, column: Col });
    MonacoInstance.focus();
}`;

appJs = appJs.replace("let RenderToken = 0;", globalAdditions);
// 3. Extract DetectKnrSlop from Server.js and insert it into App.js
const serverJs = fs.readFileSync("TypstStudio/Server.js", "utf8");
const knrMatch = serverJs.match(/function DetectKnrSlop\(Source, FileName = "main\.typ"\)[\s\S]*?\n\}/);
if (!knrMatch)
{
    console.error("Could not find DetectKnrSlop in Server.js");
    process.exit(1);
}
const detectKnrSlopCode = knrMatch[0];

const validateEditorLafsCode =
`
function ValidateEditorLAFS()
{
    if (!MonacoInstance)
    {
        return { HasError: false, Errors: [] };
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return { HasError: false, Errors: [] };
    }

    const Source = Model.getValue();
    const ActiveFileName = CurrentFilePath ? CurrentFilePath.split(/[\\/\\\\]/).pop() : "main.typ";
    const KnrResult = DetectKnrSlop(Source, ActiveFileName);

    if (KnrResult.HasError)
    {
        const Markers = KnrResult.Errors.map
        (
            (Err) =>
            ({
                severity: monaco.MarkerSeverity.Error,
                message: \`Defecated (Deprecated | Outdated | Legacy) Structural Failure of 1978 K&R Slop detected (Vector \${Err.Vector || 1}): \${Err.Reason}. Hint: Click 'Format LAFS' to fix it.\`,
                startLineNumber: Err.Line,
                startColumn: Err.Col,
                endLineNumber: Err.Line,
                endColumn: Err.Col + 1
            })
        );
        monaco.editor.setModelMarkers(Model, "lafs-validator", Markers);
    }
    else
    {
        monaco.editor.setModelMarkers(Model, "lafs-validator", []);
        const ErrorContent = document.getElementById("ErrorContent");
        if (ErrorContent && ErrorContent.textContent.includes("1978 K&R Slop"))
        {
            const ErrorDrawer = document.getElementById("ErrorDrawer");
            if (ErrorDrawer)
            {
                ErrorDrawer.classList.remove("Visible");
            }
        }
    }

    return KnrResult;
}`;
// Insert DetectKnrSlop and ValidateEditorLAFS before function FormatTypstLAFS
appJs = appJs.replace(/function FormatTypstLAFS\(Source\)/, `${detectKnrSlopCode}\n${validateEditorLafsCode}\n\nfunction FormatTypstLAFS(Source)`);
// 4. Register CompletionItemProvider in InitializeMonaco
const completionProviderCode =
`            );

            // Typst IntelliSense & LAFS Snippets Provider
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

                        // 1. LAFS Snippets
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
    /monaco\.languages\.setMonarchTokensProvider\([\s\S]*?\n            \);/, (match) => `${match}\n\n${completionProviderCode}`
);
// 5. Update onDidChangeModelContent to check dirty state
appJs = appJs.replace
(
    /MonacoInstance\.onDidChangeModelContent\(\(Event\) => {/,
    `MonacoInstance.onDidChangeModelContent((Event) => {
                    CheckDocumentDirty();`
);
// 6. Update ShowCompilationError to support jump-to-error & clickable links
const oldShowCompilationError = `function ShowCompilationError(ErrorMessage)
{
    const ErrorDrawer = document.getElementById("ErrorDrawer");
    const ErrorContent = document.getElementById("ErrorContent");
    const Cleaned = ErrorErrorMessageClean(ErrorMessage);

    // Escape HTML entities to prevent injection
    const Escaped = Cleaned
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Highlight error keywords with prominent red highlight class
    const Highlighted = Escaped.replace
    (
        /\\b(error|Error|ERROR|Severe Critical Fatal Error)\\b/g,
        (Token) => \`<span class = "ErrorKeywordHighlight">\${Token}</span>\`
    );

    ErrorContent.innerHTML = Highlighted;
    ErrorDrawer.classList.add("Visible");
}`;

const newShowCompilationError = `function ShowCompilationError(ErrorMessage)
{
    const ErrorDrawer = document.getElementById("ErrorDrawer");
    const ErrorContent = document.getElementById("ErrorContent");
    const Cleaned = ErrorErrorMessageClean(ErrorMessage);

    // Escape HTML entities to prevent injection
    const Escaped = Cleaned
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // Detect primary error line and column for direct jump
    PrimaryErrorLocation = null;
    const LocMatch = Cleaned.match(/(?:┌─\\s*|-->\\s*|\\b)([a-zA-Z0-9_\\-.]+\\.typ):(\\d+):(\\d+)/);
    const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
    if (LocMatch)
    {
        PrimaryErrorLocation =
        {
            File: LocMatch[1],
            Line: parseInt(LocMatch[2], 10),
            Col: parseInt(LocMatch[3], 10)
        };
        if (JumpBtn)
        {
            JumpBtn.style.display = "inline-flex";
            JumpBtn.textContent = \`Jump to L\${LocMatch[2]}:\${LocMatch[3]}\`;
        }
    }
    else if (JumpBtn)
    {
        JumpBtn.style.display = "none";
    }

    // Highlight error keywords with prominent red highlight class
    let Highlighted = Escaped.replace
    (
        /\\b(error|Error|ERROR|Severe Critical Fatal Error)\\b/g,
        (Token) => \`<span class = "ErrorKeywordHighlight">\${Token}</span>\`
    );

    // Convert file location references into clickable links
    Highlighted = Highlighted.replace
    (
        /(┌─\\s*|-->\\s*|\\b)([a-zA-Z0-9_\\-.]+\\.typ):(\\d+):(\\d+)/g,
        (Full, Prefix, File, Line, Col) => \`\${Prefix}<span Class = "ErrorLocationLink" Data-Line = "\${Line}" Data-Col = "\${Col}" Title = "Click to jump to Line \${Line}, Col \${Col}">\${File}:\${Line}:\${Col} ↗</span>\`
    );

    ErrorContent.innerHTML = Highlighted;
    ErrorDrawer.classList.add("Visible");
}`;

appJs = appJs.replace(oldShowCompilationError, newShowCompilationError);
// 7. In SetupEventListeners: add Jump button, Error link delegation, and beforeunload
const eventListenersHooks = `    const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
    if (JumpBtn)
    {
        JumpBtn.addEventListener
        (
            "click",
            () =>
            {
                if (PrimaryErrorLocation)
                {
                    JumpToEditorLocation(PrimaryErrorLocation.Line, PrimaryErrorLocation.Col);
                }
            }
        );
    }

    const ErrorContent = document.getElementById("ErrorContent");
    if (ErrorContent)
    {
        ErrorContent.addEventListener
        (
            "click",
            (Event) =>
            {
                const Link = Event.target.closest(".ErrorLocationLink");
                if (Link)
                {
                    const Line = parseInt(Link.getAttribute("Data-Line"), 10);
                    const Col = parseInt(Link.getAttribute("Data-Col"), 10) || 1;
                    if (!isNaN(Line))
                    {
                        JumpToEditorLocation(Line, Col);
                    }
                }
            }
        );
    }

    window.addEventListener
    (
        "beforeunload",
        (Event) =>
        {
            if (IsDocumentDirty)
            {
                Event.preventDefault();
                Event.returnValue = "";
            }
        }
    );`;

appJs = appJs.replace
(
    'document.getElementById("CloseErrorButton").addEventListener("click", () =>',
    `${eventListenersHooks}\n\n    document.getElementById("CloseErrorButton").addEventListener("click", () =>`
);
// 8. Integrate ShowToast and MarkDocumentClean into SaveCurrentFile
appJs = appJs.replace
(
    'LoadWorkspaceInfo();',
    `LoadWorkspaceInfo();\n            MarkDocumentClean(Content);\n            ShowToast(\`Saved \${TargetPath.split(/[\\/\\\\]/).pop()}\`, "success");`
);
// 9. Integrate MarkDocumentClean into OpenFileFromWorkspace
appJs = appJs.replace
(
    'MonacoInstance.setValue(Data.Content);',
    `MonacoInstance.setValue(Data.Content);\n            MarkDocumentClean(Data.Content);\n            ShowToast(\`Loaded \${FileName}\`, "info");`
);
// 10. Integrate ShowToast into ExportPdf, ExportPng, ExportSvg, ApplyFormattingToEditor
appJs = appJs.replace
(
    'StatusText.textContent = "PDF Exported";',
    `StatusText.textContent = "PDF Exported";\n        ShowToast("PDF exported successfully", "success");`
);

appJs = appJs.replace
(
    'StatusText.textContent = "PNG Exported";',
    `StatusText.textContent = "PNG Exported";\n        ShowToast(IsMultiPage ? "Multi-page PNG ZIP exported" : "PNG exported successfully", "success");`
);

appJs = appJs.replace
(
    'StatusText.textContent = "SVG Copied";',
    `StatusText.textContent = "SVG Copied";\n    ShowToast("Page SVG copied to clipboard", "success");`
);

appJs = appJs.replace
(
    'TriggerCompileNow();\n}',
    `TriggerCompileNow();\n    ShowToast("Formatted to LAFS standard", "info");\n}`
);
// 11. Initial clean state in InitializeMonaco
appJs = appJs.replace
(
    'TriggerCompileNow();\n        }\n    );',
    `TriggerCompileNow();\n            MarkDocumentClean(InitialSource);\n        }\n    );`
);

fs.writeFileSync(appJsPath, appJs, "utf8");
console.log("SUCCESS: Updated App.js");

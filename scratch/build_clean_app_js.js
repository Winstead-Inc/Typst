const fs = require("fs");
const path = require("path");

const appJsPath = "TypstStudio/public/App.js";
let appJs = fs.readFileSync(appJsPath, "utf8");

// Safe replace helper
function SafeReplace(Source, Target, Replacement)
{
    if (typeof Target === "string")
    {
        if (!Source.includes(Target))
        {
            throw new Error(`Target string not found: ${Target.slice(0, 50)}...`);
        }
        return Source.replace(Target, () => Replacement);
    }
    else if (Target instanceof RegExp)
    {
        if (!Target.test(Source))
        {
            throw new Error(`Target regex not found: ${Target}`);
        }
        return Source.replace(Target, () => Replacement);
    }
    return Source;
}

// 1. Read showcase from projects/GenesisOfTheVanguard/main.typ
const showcaseContent = fs.readFileSync("projects/GenesisOfTheVanguard/main.typ", "utf8");
const escapedShowcase = showcaseContent
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\${/g, "\\${");

appJs = SafeReplace
(
    appJs,
    /showcase:\s*`[\s\S]*?`\s*};/,
    `showcase: \`${escapedShowcase}\`\n};`
);

// 2. Global state and helpers after let RenderToken = 0;
const globalAdditions = `let RenderToken = 0;
let LastSavedContent = "";
let IsDocumentDirty = false;
let PrimaryErrorLocation = null;
let IsExportMenuOpen = false;

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

appJs = SafeReplace(appJs, "let RenderToken = 0;", globalAdditions);

// 3. Extract DetectKnrSlop from Server.js and insert ValidateEditorLAFS
const serverJs = fs.readFileSync("TypstStudio/Server.js", "utf8");
const knrMatch = serverJs.match(/function DetectKnrSlop\(Source, FileName = "main\.typ"\)[\s\S]*?\n\}/);
if (!knrMatch)
{
    console.error("Could not find DetectKnrSlop in Server.js");
    process.exit(1);
}
const detectKnrSlopCode = knrMatch[0];

const validateEditorLafsCode = `
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

appJs = SafeReplace
(
    appJs,
    "function FormatTypstLAFS(Source)",
    `${detectKnrSlopCode}\n${validateEditorLafsCode}\n\nfunction FormatTypstLAFS(Source)`
);

// 4. Register CompletionItemProvider in InitializeMonaco
const completionProviderCode = `            // Typst IntelliSense & LAFS Snippets Provider (Priority 1)
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

appJs = SafeReplace
(
    appJs,
    'const Container = document.getElementById("MonacoContainer");',
    `${completionProviderCode}\n\n            const Container = document.getElementById("MonacoContainer");`
);

// 5. In InitializeMonaco onDidChangeModelContent: add dirty check & throttled outline
appJs = SafeReplace
(
    appJs,
    `MonacoInstance.onDidChangeModelContent
            (
                (Event) =>
                {
                    UpdateStatusBar();`,
    `MonacoInstance.onDidChangeModelContent
            (
                (Event) =>
                {
                    CheckDocumentDirty();
                    UpdateDocumentOutlineThrottled();
                    UpdateStatusBar();`
);

// 6. Monaco Commands: Add shortcuts
const monacoCommands = `            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit1,
                () => { SetViewportLayout("split"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit2,
                () => { SetViewportLayout("editor"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit3,
                () => { SetViewportLayout("preview"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.KeyO,
                () => { ToggleDocumentOutline(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
                () => { TriggerDocumentPrint(); }
            );`;

appJs = SafeReplace
(
    appJs,
    'MonacoInstance.addCommand\n            (\n                monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,\n                () => { ApplyFormattingToEditor(); }\n            );',
    'MonacoInstance.addCommand\n            (\n                monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,\n                () => { ApplyFormattingToEditor(); }\n            );\n\n' + monacoCommands
);

// 7. Initial clean state and outline in InitializeMonaco
appJs = SafeReplace
(
    appJs,
    'TriggerCompileNow();\n        }\n    );',
    'TriggerCompileNow();\n            MarkDocumentClean(InitialSource);\n            UpdateDocumentOutline();\n        }\n    );'
);

// 8. Update ShowCompilationError for error navigation
const oldShowCompilationError = `function ShowCompilationError(ErrorMessage)
{
    const ErrorDrawer = document.getElementById("ErrorDrawer");
    const ErrorContent = document.getElementById("ErrorContent");
    ErrorContent.textContent = ErrorErrorMessageClean(ErrorMessage);
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

appJs = SafeReplace(appJs, oldShowCompilationError, newShowCompilationError);

// 9. Feature architectures (Viewport layout, Document outline, Asset drag&drop, Shortcuts modal, Print, Export menu)
const featureArchitectures = `// --- VIEWPORT SEGMENTED CONTROL ARCHITECTURE (PRIORITY 2) ---

let CurrentViewportLayout = "split"; // 'split', 'editor', 'preview'

function SetViewportLayout(Layout)
{
    CurrentViewportLayout = Layout;
    const MainArea = document.getElementById("EditorMainView");
    const SplitBtn = document.getElementById("LayoutSplitBtn");
    const EditorBtn = document.getElementById("LayoutEditorBtn");
    const PreviewBtn = document.getElementById("LayoutPreviewBtn");

    if (MainArea)
    {
        MainArea.classList.remove("LayoutSplit", "LayoutEditorOnly", "LayoutPreviewOnly");
        if (Layout === "editor")
        {
            MainArea.classList.add("LayoutEditorOnly");
        }
        else if (Layout === "preview")
        {
            MainArea.classList.add("LayoutPreviewOnly");
        }
        else
        {
            MainArea.classList.add("LayoutSplit");
        }
    }

    if (SplitBtn) { SplitBtn.classList.toggle("Active", Layout === "split"); }
    if (EditorBtn) { EditorBtn.classList.toggle("Active", Layout === "editor"); }
    if (PreviewBtn) { PreviewBtn.classList.toggle("Active", Layout === "preview"); }

    try
    {
        localStorage.setItem("TypstStudio_Layout", Layout);
    }
    catch (Ignored) { }

    if (MonacoInstance && (Layout === "split" || Layout === "editor"))
    {
        requestAnimationFrame
        (
            () =>
            {
                MonacoInstance.layout();
            }
        );
    }

    if (Layout === "split" || Layout === "preview")
    {
        requestAnimationFrame
        (
            () =>
            {
                RecalculateScale();
            }
        );
    }
}

// --- DOCUMENT OUTLINE (TOC) ARCHITECTURE (PRIORITY 2) ---

let IsOutlineVisible = false;
let OutlineHeadingsList = [];
let OutlineThrottleTimer = null;

function ToggleDocumentOutline(ForceState)
{
    const Sidebar = document.getElementById("OutlineSidebar");
    if (!Sidebar) { return; }

    IsOutlineVisible = (typeof ForceState === "boolean") ? ForceState : !IsOutlineVisible;
    Sidebar.style.display = IsOutlineVisible ? "flex" : "none";

    if (IsOutlineVisible)
    {
        UpdateDocumentOutline();
    }

    if (MonacoInstance)
    {
        requestAnimationFrame
        (
            () =>
            {
                MonacoInstance.layout();
            }
        );
    }
}

function UpdateDocumentOutlineThrottled()
{
    if (OutlineThrottleTimer) { clearTimeout(OutlineThrottleTimer); }
    OutlineThrottleTimer = setTimeout
    (
        () =>
        {
            UpdateDocumentOutline();
        },
        300
    );
}

function UpdateDocumentOutline()
{
    const ListContainer = document.getElementById("OutlineList");
    const Badge = document.getElementById("OutlineCountBadge");
    const StatusBadge = document.getElementById("StatusOutlineCount");
    if (!MonacoInstance || !ListContainer) { return; }

    const Source = MonacoInstance.getValue();
    const Lines = Source.split(/\\r?\\n/);
    OutlineHeadingsList = [];

    let InCodeBlock = false;
    for (let Index = 0; Index < Lines.length; Index++)
    {
        const LineText = Lines[Index];
        const Trimmed = LineText.trim();

        if (Trimmed.startsWith("\`\`\`"))
        {
            InCodeBlock = !InCodeBlock;
            continue;
        }
        if (InCodeBlock) { continue; }

        const HeadingMatch = LineText.match(/^(=+)\\s+(.+)$/);
        if (HeadingMatch)
        {
            const Level = HeadingMatch[1].length;
            const CleanTitle = HeadingMatch[2].replace(/<[a-zA-Z0-9_\\-:]+>\\s*$/, "").trim();
            OutlineHeadingsList.push
            ({
                Level: Math.min(Level, 4),
                Title: CleanTitle,
                Line: Index + 1
            });
        }
    }

    const Count = OutlineHeadingsList.length;
    if (Badge) { Badge.textContent = Count; }
    if (StatusBadge) { StatusBadge.textContent = Count; }

    RenderOutlineItems(OutlineHeadingsList);
}

function RenderOutlineItems(Headings)
{
    const ListContainer = document.getElementById("OutlineList");
    if (!ListContainer) { return; }

    const SearchInput = document.getElementById("OutlineSearchInput");
    const Filter = SearchInput ? SearchInput.value.toLowerCase().trim() : "";

    const Filtered = Filter
        ? Headings.filter((H) => H.Title.toLowerCase().includes(Filter))
        : Headings;

    if (Filtered.length === 0)
    {
        ListContainer.innerHTML = Filter
            ? \`<div Class = "OutlineEmptyState">No sections match "\${Filter}"</div>\`
            : \`<div Class = "OutlineEmptyState">No headings in document.<br><span style="color:#71717A; font-size:10.5px;">Add '= Section Name' to generate an outline.</span></div>\`;
        return;
    }

    let Html = "";
    for (const Item of Filtered)
    {
        Html += \`<div Class = "OutlineItem Level\${Item.Level}" Data-Line = "\${Item.Line}" Title = "Jump to line \${Item.Line}">
            <span Class = "OutlineItemText">\${EscapeHtml(Item.Title)}</span>
            <span Class = "OutlineItemLine">L\${Item.Line}</span>
        </div>\`;
    }

    ListContainer.innerHTML = Html;
}

// --- ASSET DRAG & DROP ARCHITECTURE (PRIORITY 3) ---

function SetupAssetDragAndDrop()
{
    const Overlay = document.getElementById("AssetDropOverlay");
    if (!Overlay) { return; }

    let DragCounter = 0;

    window.addEventListener
    (
        "dragenter",
        (Event) =>
        {
            if (Event.dataTransfer && Event.dataTransfer.types.includes("Files"))
            {
                DragCounter++;
                Overlay.classList.add("Active");
            }
        }
    );

    window.addEventListener
    (
        "dragleave",
        (Event) =>
        {
            DragCounter--;
            if (DragCounter <= 0)
            {
                DragCounter = 0;
                Overlay.classList.remove("Active");
            }
        }
    );

    window.addEventListener
    (
        "dragover",
        (Event) =>
        {
            Event.preventDefault();
        }
    );

    window.addEventListener
    (
        "drop",
        async (Event) =>
        {
            Event.preventDefault();
            DragCounter = 0;
            Overlay.classList.remove("Active");

            const Files = Event.dataTransfer ? Event.dataTransfer.files : null;
            if (!Files || Files.length === 0) { return; }

            for (let I = 0; I < Files.length; I++)
            {
                await HandleDroppedAssetFile(Files[I]);
            }
        }
    );
}

async function HandleDroppedAssetFile(File)
{
    const ValidExtensions = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".pdf"];
    const Ext = ("." + File.name.split(".").pop()).toLowerCase();
    if (!ValidExtensions.includes(Ext))
    {
        ShowToast(\`Unsupported file type: \${File.name}\`, "error");
        return;
    }

    const Reader = new FileReader();
    Reader.onload = async () =>
    {
        const Base64Data = Reader.result.split(",")[1];
        try
        {
            const Response = await fetch
            (
                "/api/workspace/upload",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "x-typst-auth-token": SessionAuthToken
                    },
                    body: JSON.stringify
                    ({
                        FileName: File.name,
                        Base64Data: Base64Data,
                        ActiveFilePath: CurrentFilePath
                    })
                }
            );

            const Data = await Response.json();
            if (Data.Success && MonacoInstance)
            {
                const CleanFileName = Data.FileName;
                const Snippet = \`\\n#image\\n(\\n\\t"\${CleanFileName}",\\n\\twidth: 80%\\n)\\n\`;

                const Position = MonacoInstance.getPosition();
                MonacoInstance.executeEdits
                (
                    "asset-drop",
                    [
                        {
                            range: new monaco.Range(Position.lineNumber, Position.column, Position.lineNumber, Position.column),
                            text: Snippet
                        }
                    ]
                );

                ShowToast(\`Uploaded \${CleanFileName} and inserted #image\`, "success");
                TriggerCompileNow();
            }
            else
            {
                ShowToast(\`Upload failed: \${Data.Error || "Server error"}\`, "error");
            }
        }
        catch (Err)
        {
            ShowToast(\`Upload failed: \${Err.message}\`, "error");
        }
    };
    Reader.readAsDataURL(File);
}

// --- KEYBOARD SHORTCUTS & PRINT ARCHITECTURE (PRIORITY 4) ---

function ToggleShortcutsModal(ForceOpen)
{
    const Modal = document.getElementById("ShortcutsModal");
    if (!Modal) { return; }

    const IsOpen = Modal.style.display !== "none";
    const ShouldOpen = (typeof ForceOpen === "boolean") ? ForceOpen : !IsOpen;
    Modal.style.display = ShouldOpen ? "flex" : "none";
}

function TriggerDocumentPrint()
{
    ShowToast("Preparing document for print...", "info", 1500);
    setTimeout(() => { window.print(); }, 200);
}

// --- UNIFIED EXPORT MENU ARCHITECTURE ---

function ToggleExportMenu(ForceState)
{
    const Menu = document.getElementById("ExportMenuDropdown");
    if (!Menu) { return; }

    IsExportMenuOpen = (typeof ForceState === "boolean") ? ForceState : !IsExportMenuOpen;
    Menu.style.display = IsExportMenuOpen ? "flex" : "none";
}
`;

appJs = SafeReplace(appJs, "function SetupEventListeners()", featureArchitectures + "\nfunction SetupEventListeners()");

// 10. Wire up all event listeners in SetupEventListeners
const eventListenersHooks = `    // Priority 2: Viewport Layout Controls
    const SplitBtn = document.getElementById("LayoutSplitBtn");
    const EditorBtn = document.getElementById("LayoutEditorBtn");
    const PreviewBtn = document.getElementById("LayoutPreviewBtn");
    if (SplitBtn) { SplitBtn.addEventListener("click", () => { SetViewportLayout("split"); }); }
    if (EditorBtn) { EditorBtn.addEventListener("click", () => { SetViewportLayout("editor"); }); }
    if (PreviewBtn) { PreviewBtn.addEventListener("click", () => { SetViewportLayout("preview"); }); }

    // Priority 2: Document Outline Controls
    const OutlineToggle = document.getElementById("StatusOutlineToggle");
    const OutlineClose = document.getElementById("CloseOutlineBtn");
    const OutlineSearch = document.getElementById("OutlineSearchInput");
    const OutlineList = document.getElementById("OutlineList");
    if (OutlineToggle) { OutlineToggle.addEventListener("click", () => { ToggleDocumentOutline(); }); }
    if (OutlineClose) { OutlineClose.addEventListener("click", () => { ToggleDocumentOutline(false); }); }
    if (OutlineSearch) { OutlineSearch.addEventListener("input", () => { RenderOutlineItems(OutlineHeadingsList); }); }
    if (OutlineList)
    {
        OutlineList.addEventListener
        (
            "click",
            (E) =>
            {
                const Item = E.target.closest(".OutlineItem");
                if (Item)
                {
                    const Line = parseInt(Item.getAttribute("Data-Line"), 10);
                    if (!isNaN(Line)) { JumpToEditorLocation(Line, 1); }
                }
            }
        );
    }

    // Unified Export Menu Toggle & Actions
    const ExportToggle = document.getElementById("ExportMenuToggleBtn");
    const ExportPdfMenu = document.getElementById("ExportPdfMenuOption");
    const OpenSettingsExport = document.getElementById("OpenSettingsFromExportBtn");
    if (ExportToggle)
    {
        ExportToggle.addEventListener
        (
            "click",
            (E) =>
            {
                E.stopPropagation();
                ToggleExportMenu();
            }
        );
    }
    if (ExportPdfMenu)
    {
        ExportPdfMenu.addEventListener
        (
            "click",
            () =>
            {
                ToggleExportMenu(false);
                ExportPdf();
            }
        );
    }
    if (OpenSettingsExport)
    {
        OpenSettingsExport.addEventListener
        (
            "click",
            () =>
            {
                ToggleExportMenu(false);
                SwitchToDashboard();
            }
        );
    }

    // Close export menu when clicking anywhere outside
    document.addEventListener
    (
        "click",
        (E) =>
        {
            if (IsExportMenuOpen && !E.target.closest("#ExportGroupWrapper"))
            {
                ToggleExportMenu(false);
            }
        }
    );

    // Priority 4: Print Document
    const PrintBtn = document.getElementById("PrintDocButton");
    if (PrintBtn)
    {
        PrintBtn.addEventListener
        (
            "click",
            () =>
            {
                ToggleExportMenu(false);
                TriggerDocumentPrint();
            }
        );
    }

    // Priority 4: Keyboard Shortcuts Modal
    const HelpBtn = document.getElementById("ShortcutsHelpBtn");
    const CloseModalBtn = document.getElementById("CloseShortcutsModalBtn");
    const ShortcutsModal = document.getElementById("ShortcutsModal");
    if (HelpBtn) { HelpBtn.addEventListener("click", () => { ToggleShortcutsModal(true); }); }
    if (CloseModalBtn) { CloseModalBtn.addEventListener("click", () => { ToggleShortcutsModal(false); }); }
    if (ShortcutsModal)
    {
        ShortcutsModal.addEventListener
        (
            "click",
            (E) =>
            {
                if (E.target.id === "ShortcutsModal") { ToggleShortcutsModal(false); }
            }
        );
    }

    // Priority 1: Jump to Primary Error button
    const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
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

    // Interactive clickable error location links in ErrorDrawer
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

    // Unsaved dirty state warning before closing/reloading window
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

appJs = SafeReplace
(
    appJs,
    'document.getElementById("ManualCompileButton").addEventListener("click", () => { TriggerCompileNow(); });',
    `${eventListenersHooks}\n\n    document.getElementById("ManualCompileButton").addEventListener("click", () => { TriggerCompileNow(); });`
);

// 11. Global Keyboard Shortcuts in window keydown listener
const globalShortcutsCode = `            // Priority 2 & 4 Global Shortcuts
            if (E.altKey && E.key === "1")
            {
                E.preventDefault();
                SetViewportLayout("split");
            }
            else if (E.altKey && E.key === "2")
            {
                E.preventDefault();
                SetViewportLayout("editor");
            }
            else if (E.altKey && E.key === "3")
            {
                E.preventDefault();
                SetViewportLayout("preview");
            }
            else if (E.altKey && (E.key === "o" || E.key === "O"))
            {
                E.preventDefault();
                ToggleDocumentOutline();
            }
            else if ((E.ctrlKey || E.metaKey) && E.shiftKey && (E.key === "P" || E.key === "p"))
            {
                E.preventDefault();
                TriggerDocumentPrint();
            }
            else if ((E.ctrlKey || E.metaKey) && E.key === "/")
            {
                E.preventDefault();
                ToggleShortcutsModal();
            }
            else if (E.key === "?" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
            {
                E.preventDefault();
                ToggleShortcutsModal();
            }
            else if (E.key === "Escape")
            {
                ToggleShortcutsModal(false);
                ToggleExportMenu(false);
                const Drawer = document.getElementById("ErrorDrawer");
                if (Drawer) { Drawer.classList.remove("Visible"); }
            }`;

appJs = SafeReplace
(
    appJs,
    'if ((E.ctrlKey || E.metaKey) && E.key === "s")',
    `${globalShortcutsCode}\n            if ((E.ctrlKey || E.metaKey) && E.key === "s")`
);

// 12. Toasts & Clean State on File Save
appJs = SafeReplace
(
    appJs,
    "LoadWorkspaceInfo();",
    `LoadWorkspaceInfo();\n            MarkDocumentClean(Content);\n            ShowToast(\`Saved \${TargetPath.split(/[\\/\\\\]/).pop()}\`, "success");`
);

// 13. Toasts & Clean State on File Load
appJs = SafeReplace
(
    appJs,
    "MonacoInstance.setValue(Data.Content);",
    `MonacoInstance.setValue(Data.Content);\n            MarkDocumentClean(Data.Content);\n            ShowToast(\`Loaded \${FileName}\`, "info");`
);

// 14. Toasts on Exports & Formatting
appJs = SafeReplace
(
    appJs,
    'StatusText.textContent = "PDF Exported";',
    `StatusText.textContent = "PDF Exported";\n        ShowToast("PDF exported successfully", "success");`
);

appJs = SafeReplace
(
    appJs,
    'URL.revokeObjectURL(DownloadUrl);',
    `URL.revokeObjectURL(DownloadUrl);\n        ShowToast("PNG exported successfully", "success");`
);

appJs = SafeReplace
(
    appJs,
    'setTimeout(() => { CopyBtn.innerHTML = OriginalHTML; }, 1500);',
    `setTimeout(() => { CopyBtn.innerHTML = OriginalHTML; }, 1500);\n            ShowToast("Typst source copied to clipboard", "success");`
);

appJs = SafeReplace
(
    appJs,
    `        MonacoInstance.pushUndoStop();
        TriggerCompileNow();
    }`,
    `        MonacoInstance.pushUndoStop();
        TriggerCompileNow();
        ShowToast("Formatted to LAFS standard", "info");
    }`
);

// 15. In DOMContentLoaded: SetupAssetDragAndDrop and restore layout
appJs = SafeReplace
(
    appJs,
    `        InitializeMonaco();
        LoadWorkspaceInfo();
    }`,
    `        InitializeMonaco();
        LoadWorkspaceInfo();
        SetupAssetDragAndDrop();
        SetViewportLayout(localStorage.getItem("TypstStudio_Layout") || "split");
    }`
);

// Write clean file
fs.writeFileSync(appJsPath, appJs, "utf8");
console.log("SUCCESS: Clean, error-free App.js generated!");

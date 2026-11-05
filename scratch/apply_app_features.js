const fs = require("fs");

let appJs = fs.readFileSync("TypstStudio/public/App.js", "utf8");

// 1. Add feature architectures before SetupEventListeners
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
`;

appJs = appJs.replace("function SetupEventListeners()", featureArchitectures + "\nfunction SetupEventListeners()");

// 2. Wire event listeners into SetupEventListeners()
const additionalEventListeners = `    // Priority 2: Viewport Layout Controls
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

    // Priority 4: Print Document
    const PrintBtn = document.getElementById("PrintDocButton");
    if (PrintBtn) { PrintBtn.addEventListener("click", () => { TriggerDocumentPrint(); }); }

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
`;

appJs = appJs.replace(
    'document.getElementById("ManualCompileButton").addEventListener("click", () => { TriggerCompileNow(); });',
    additionalEventListeners + '\n    document.getElementById("ManualCompileButton").addEventListener("click", () => { TriggerCompileNow(); });'
);

// 3. Add Keyboard Shortcuts to window keydown listener
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
                const Drawer = document.getElementById("ErrorDrawer");
                if (Drawer) { Drawer.classList.remove("Visible"); }
            }`;

appJs = appJs.replace(
    'if ((E.ctrlKey || E.metaKey) && E.key === "s")',
    globalShortcutsCode + '\n            if ((E.ctrlKey || E.metaKey) && E.key === "s")'
);

// 4. In Monaco onDidChangeModelContent: add UpdateDocumentOutlineThrottled()
appJs = appJs.replace(
    'CheckDocumentDirty();',
    'CheckDocumentDirty();\n                    UpdateDocumentOutlineThrottled();'
);

// 5. In Monaco commands: register Alt+1/2/3, Alt+O, Ctrl+Shift+P
const monacoCommandsCode = `            MonacoInstance.addCommand
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

appJs = appJs.replace(
    'MonacoInstance.addCommand\n            (\n                monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,\n                () => { ApplyFormattingToEditor(); }\n            );',
    'MonacoInstance.addCommand\n            (\n                monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,\n                () => { ApplyFormattingToEditor(); }\n            );\n\n' + monacoCommandsCode
);

// 6. In InitializeMonaco completion: UpdateDocumentOutline()
appJs = appJs.replace(
    'MarkDocumentClean(InitialSource);',
    'MarkDocumentClean(InitialSource);\n            UpdateDocumentOutline();'
);

// 7. In DOMContentLoaded: SetupAssetDragAndDrop and restore layout
appJs = appJs.replace(
    'LoadWorkspaceInfo();',
    'LoadWorkspaceInfo();\n        SetupAssetDragAndDrop();\n        SetViewportLayout(localStorage.getItem("TypstStudio_Layout") || "split");'
);

fs.writeFileSync("TypstStudio/public/App.js", appJs, "utf8");
console.log("SUCCESS: App.js updated with all priority features!");


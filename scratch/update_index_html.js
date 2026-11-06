const fs = require("fs");

let html = fs.readFileSync("TypstStudio/public/Index.html", "utf8");
// 1. Update Style.css version
html = html.replace('Style.css?v=20261105_06', 'Style.css?v=20261105_09');
// 2. Add LayoutSwitcherNav in HeaderRight before ViewSwitcherNav
const layoutSwitcherHtml = `            <!-- Viewport Layout Segmented Control (Priority 2) -->
            <div Class = "LayoutSwitcherNav" Id = "LayoutSwitcherNav" Title = "Viewport Layout">
                <button Type  = "button"
                        Id    = "LayoutSplitBtn"
                        Class = "LayoutTabBtn Active"
                        Title = "Split View: 50/50 Editor &amp; Preview (Alt+1)">
                    <svg Width = "13" Height = "13" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <rect X = "3" Y = "3" Width = "18" Height = "18" Rx = "2" Ry = "2" />
                        <line X1 = "12" Y1 = "3" X2 = "12" Y2 = "21" />
                    </svg>
                    <span>Split</span>
                </button>
                <button Type  = "button"
                        Id    = "LayoutEditorBtn"
                        Class = "LayoutTabBtn"
                        Title = "Editor Only: Code Focus (Alt+2)">
                    <svg Width = "13" Height = "13" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <rect X = "3" Y = "3" Width = "18" Height = "18" Rx = "2" Ry = "2" />
                        <polyline Points = "9 3 9 21" />
                    </svg>
                    <span>Editor</span>
                </button>
                <button Type  = "button"
                        Id    = "LayoutPreviewBtn"
                        Class = "LayoutTabBtn"
                        Title = "Preview Only: Document Focus (Alt+3)">
                    <svg Width = "13" Height = "13" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <rect X = "3" Y = "3" Width = "18" Height = "18" Rx = "2" Ry = "2" />
                        <polyline Points = "15 3 15 21" />
                    </svg>
                    <span>Preview</span>
                </button>
            </div>

            <div Class = "ViewSwitcherNav">`;

html = html.replace('<div Class = "ViewSwitcherNav">', layoutSwitcherHtml);
// 3. Add Print and Help buttons after ExportPdfButton
const headerButtonsAddition = `            <button Type  = "button"
                    Id    = "PrintDocButton"
                    Class = "Button Secondary"
                    Title = "Print Document (Ctrl+Shift+P)">
                <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                    <polyline Points = "6 9 6 2 18 2 18 9" />
                    <path D = "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect X = "6" Y = "14" Width = "12" Height = "8" />
                </svg>
                <span>Print</span>
            </button>

            <button Type  = "button"
                    Id    = "ShortcutsHelpBtn"
                    Class = "Button Secondary HelpBtn"
                    Title = "Keyboard Shortcuts Cheat Sheet (?)">
                <span>?</span>
            </button>`;

html = html.replace
(
    '            </button>\n        </div>\n    </header>',
    `            </button>\n\n${headerButtonsAddition}\n        </div>\n    </header>`
);
// 4. Update MainSplitArea with OutlineSidebar and AssetDropOverlay
const outlineSidebarHtml = `    <main Class = "MainSplitArea LayoutSplit" Id = "EditorMainView">
        <!-- Document Outline Sidebar (Priority 2) -->
        <aside Class = "OutlineSidebar" Id = "OutlineSidebar" Style = "display: none;">
            <div Class = "OutlineHeader">
                <div Class = "OutlineHeaderTitle">
                    <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#A855F7" Stroke-Width = "2">
                        <line X1 = "8" Y1 = "6" X2 = "21" Y2 = "6" />
                        <line X1 = "8" Y1 = "12" X2 = "21" Y2 = "12" />
                        <line X1 = "8" Y1 = "18" X2 = "21" Y2 = "18" />
                        <line X1 = "3" Y1 = "6" X2 = "3.01" Y2 = "6" />
                        <line X1 = "3" Y1 = "12" X2 = "3.01" Y2 = "12" />
                        <line X1 = "3" Y1 = "18" X2 = "3.01" Y2 = "18" />
                    </svg>
                    <span>Outline (<span Id = "OutlineCountBadge">0</span>)</span>
                </div>
                <button Type  = "button"
                        Id    = "CloseOutlineBtn"
                        Class = "MiniCloseBtn"
                        Title = "Close Outline (Alt+O)">×</button>
            </div>
            <div Class = "OutlineSearchBox">
                <input Type        = "text"
                       Id          = "OutlineSearchInput"
                       Class       = "OutlineSearchInput"
                       Placeholder = "Filter sections..." />
            </div>
            <div Class = "OutlineList" Id = "OutlineList">
                <!-- Dynamically populated by App.js -->
            </div>
        </aside>

        <section Class = "EditorPane" Id = "EditorPane">
            <!-- Asset Drag & Drop Overlay (Priority 3) -->
            <div Class = "AssetDropOverlay" Id = "AssetDropOverlay">
                <div Class = "DropOverlayContent">
                    <svg Width = "48" Height = "48" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#7C3AED" Stroke-Width = "2">
                        <rect X = "3" Y = "3" Width = "18" Height = "18" Rx = "2" Ry = "2" />
                        <circle Cx = "8.5" Cy = "8.5" R = "1.5" />
                        <polyline Points = "21 15 16 10 5 21" />
                    </svg>
                    <p>Drop image here to upload and insert into document</p>
                </div>
            </div>`;

html = html.replace
(
    '    <main Class = "MainSplitArea" Id = "EditorMainView">\n        <section Class = "EditorPane" Id = "EditorPane">',
    outlineSidebarHtml
);
// 5. Add Outline button into EditorStatusBar
const outlineStatusButton = `                <div Class = "StatusItem" Id = "CharacterCount">0 chars</div>
                <button Type  = "button"
                        Id    = "StatusOutlineToggle"
                        Class = "StatusBarBtn"
                        Title = "Toggle Document Outline / Headings (Alt+O)">
                    <span>📋 Outline (<span Id = "StatusOutlineCount">0</span>)</span>
                </button>`;

html = html.replace
(
    '                <div Class = "StatusItem" Id = "CharacterCount">0 chars</div>',
    outlineStatusButton
);
// 6. Add ShortcutsModal before ToastContainer
const shortcutsModalHtml = `    <!-- Keyboard Shortcut Cheat Sheet Modal (Priority 4) -->
    <div Class = "ModalOverlay" Id = "ShortcutsModal" Style = "display: none;">
        <div Class = "ModalDialog ShortcutsModalDialog">
            <div Class = "ModalHeader">
                <div Class = "ModalHeaderTitle">
                    <svg Width = "18" Height = "18" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#A855F7" Stroke-Width = "2">
                        <rect X = "2" Y = "4" Width = "20" Height = "16" Rx = "2" />
                        <path D = "M6 8h.001M10 8h.001M14 8h.001M18 8h.001M8 12h.001M12 12h.001M16 12h.001M7 16h10" />
                    </svg>
                    <h3>Keyboard Shortcuts</h3>
                </div>
                <button Type = "button" Id = "CloseShortcutsModalBtn" Class = "MiniCloseBtn">×</button>
            </div>
            <div Class = "ModalBody ShortcutsGrid">
                <div Class = "ShortcutCategory">
                    <h4>Document &amp; Compilation</h4>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>S</kbd></span><span Class = "ShortcutDesc">Save document to disk</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>Enter</kbd></span><span Class = "ShortcutDesc">Compile &amp; refresh preview</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Shift</kbd> + <kbd>Alt</kbd> + <kbd>F</kbd></span><span Class = "ShortcutDesc">Format code to LAFS standard</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>P</kbd></span><span Class = "ShortcutDesc">Export document to PDF</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd></span><span Class = "ShortcutDesc">Print document</span></div>
                </div>
                <div Class = "ShortcutCategory">
                    <h4>Views &amp; Navigation</h4>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Alt</kbd> + <kbd>1</kbd></span><span Class = "ShortcutDesc">Split View (50/50)</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Alt</kbd> + <kbd>2</kbd></span><span Class = "ShortcutDesc">Editor Only (Focus code)</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Alt</kbd> + <kbd>3</kbd></span><span Class = "ShortcutDesc">Preview Only (Focus output)</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Alt</kbd> + <kbd>O</kbd></span><span Class = "ShortcutDesc">Toggle Document Outline</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>?</kbd> or <kbd>Ctrl</kbd> + <kbd>/</kbd></span><span Class = "ShortcutDesc">Open shortcuts cheat sheet</span></div>
                </div>
                <div Class = "ShortcutCategory">
                    <h4>Editor IntelliSense &amp; Editing</h4>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>Space</kbd></span><span Class = "ShortcutDesc">Typst IntelliSense &amp; Snippets</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>F1</kbd></span><span Class = "ShortcutDesc">Monaco Command Palette</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>F</kbd></span><span Class = "ShortcutDesc">Find text in code</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Ctrl</kbd> + <kbd>H</kbd></span><span Class = "ShortcutDesc">Replace text in code</span></div>
                    <div Class = "ShortcutRow"><span Class = "ShortcutKeys"><kbd>Alt</kbd> + <kbd>↑ / ↓</kbd></span><span Class = "ShortcutDesc">Move line up / down</span></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Floating Toast Notification System -->`;

html = html.replace('    <!-- Floating Toast Notification System -->', shortcutsModalHtml);
// 7. Update App.js script tag
html = html.replace('App.js?v=20261105_08', 'App.js?v=20261105_09');

fs.writeFileSync("TypstStudio/public/Index.html", html, "utf8");
console.log("SUCCESS: Index.html updated");

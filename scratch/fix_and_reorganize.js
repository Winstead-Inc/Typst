const fs = require("fs");
const cp = require("child_process");

console.log("=== Step 1: Updating Index.html ===");
let html = fs.readFileSync("TypstStudio/public/Index.html", "utf8");

// Update version
html = html.replace(/v=20261105_\d+/g, "v=20261105_10");

// Replace HeaderRight contents with the compact ExportGroupWrapper
const oldHeaderRightButtons = `<button Type  = "button"
                    Id    = "CopyCodeButton"
                    Class = "Button Secondary"
                    Title = "Copy Typst Source">
                <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                    <rect X = "9" Y = "9" Width = "13" Height = "13" Rx = "2" Ry = "2" />
                    <path D = "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span>Copy</span>
            </button>

            <button Type  = "button"
                    Id    = "ExportSvgButton"
                    Class = "Button Secondary"
                    Title = "Download Current Page as SVG">
                <span>SVG</span>
            </button>

            <button Type  = "button"
                    Id    = "ExportPngButton"
                    Class = "Button Secondary"
                    Title = "Download Current Page as 300 PPI PNG">
                <span>PNG</span>
            </button>

            <label Class = "ExportOptionLabel"
                   Id    = "ExportBlackModeOption"
                   Title = "Export PDF, PNG, and SVG in Black Mode (Black Paper color as previewed in Dark mode)">
                <input Type  = "checkbox"
                       Id    = "ExportBlackModeCheckbox"
                       Class = "ExportOptionCheckbox" />
                <span Class = "CustomTickBox">
                    <svg Width = "10" Height = "8" ViewBox = "0 0 10 8" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <polyline Points = "1 4 3.5 6.5 9 1" />
                    </svg>
                </span>
                <span Class = "TickBoxText">Export in Black mode</span>
            </label>

            <label Class = "ExportOptionLabel"
                   Id    = "ExportTransparentOption"
                   Title = "Export with Transparent Background (Applies to PDF, PNG, and SVG in both Light and Black modes)">
                <input Type  = "checkbox"
                       Id    = "ExportTransparentCheckbox"
                       Class = "ExportOptionCheckbox" />
                <span Class = "CustomTickBox">
                    <svg Width = "10" Height = "8" ViewBox = "0 0 10 8" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <polyline Points = "1 4 3.5 6.5 9 1" />
                    </svg>
                </span>
                <span Class = "TickBoxText">Transparent Background</span>
            </label>

            <button Type  = "button"
                    Id    = "ExportPdfButton"
                    Class = "Button Primary"
                    Title = "Export Complete Document to PDF (Ctrl+P)">
                <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                    <path D = "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline Points = "7 10 12 15 17 10" />
                    <line X1 = "12" Y1 = "15" X2 = "12" Y2 = "3" />
                </svg>
                <span>Export PDF</span>
            </button>

            <button Type  = "button"
                    Id    = "PrintDocButton"
                    Class = "Button Secondary"
                    Title = "Print Document (Ctrl+Shift+P)">
                <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                    <polyline Points = "6 9 6 2 18 2 18 9" />
                    <path D = "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect X = "6" Y = "14" Width = "12" Height = "8" />
                </svg>
                <span>Print</span>
            </button>`;

const newHeaderRightExportGroup = `<div Class = "ExportGroupWrapper" Id = "ExportGroupWrapper">
                <button Type  = "button"
                        Id    = "ExportPdfButton"
                        Class = "Button Primary ExportMainBtn"
                        Title = "Export Complete Document to PDF (Ctrl+P)">
                    <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <path D = "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline Points = "7 10 12 15 17 10" />
                        <line X1 = "12" Y1 = "15" X2 = "12" Y2 = "3" />
                    </svg>
                    <span>Export PDF</span>
                </button>
                <button Type  = "button"
                        Id    = "ExportMenuToggleBtn"
                        Class = "Button Primary ExportMenuToggleBtn"
                        Title = "Export Formats &amp; Options">
                    <svg Width = "10" Height = "10" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <polyline Points = "6 9 12 15 18 9" />
                    </svg>
                </button>

                <!-- Floating Export Menu Dropdown -->
                <div Class = "ExportMenuDropdown" Id = "ExportMenuDropdown" Style = "display: none;">
                    <div Class = "ExportMenuSectionTitle">Export Formats</div>
                    <button Type = "button" Id = "ExportPdfMenuOption" Class = "ExportMenuItem">
                        <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline Points = "14 2 14 8 20 8" />
                        </svg>
                        <span>Export PDF (Vector)</span>
                        <span Class = "MenuShortcut">Ctrl+P</span>
                    </button>
                    <button Type = "button" Id = "ExportPngButton" Class = "ExportMenuItem" Title = "Download Current Page as 300 PPI PNG">
                        <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <rect X = "3" Y = "3" Width = "18" Height = "18" Rx = "2" Ry = "2" />
                            <circle Cx = "8.5" Cy = "8.5" R = "1.5" />
                            <polyline Points = "21 15 16 10 5 21" />
                        </svg>
                        <span>Export PNG (300 PPI ZIP)</span>
                    </button>
                    <button Type = "button" Id = "ExportSvgButton" Class = "ExportMenuItem" Title = "Download Current Page as SVG">
                        <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <polyline Points = "16 18 22 12 16 6" />
                            <polyline Points = "8 6 2 12 8 18" />
                        </svg>
                        <span>Export SVG (Vector)</span>
                    </button>
                    <button Type = "button" Id = "PrintDocButton" Class = "ExportMenuItem" Title = "Print Document (Ctrl+Shift+P)">
                        <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <polyline Points = "6 9 6 2 18 2 18 9" />
                            <path D = "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                            <rect X = "6" Y = "14" Width = "12" Height = "8" />
                        </svg>
                        <span>Print Document</span>
                        <span Class = "MenuShortcut">Ctrl+Shift+P</span>
                    </button>
                    <button Type = "button" Id = "CopyCodeButton" Class = "ExportMenuItem" Title = "Copy Typst Source">
                        <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <rect X = "9" Y = "9" Width = "13" Height = "13" Rx = "2" Ry = "2" />
                            <path D = "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy Typst Source</span>
                    </button>

                    <div Class = "ExportMenuDivider"></div>
                    <div Class = "ExportMenuSectionTitle">Export Options</div>
                    <label Class = "ExportMenuItem CheckboxItem" Id = "ExportBlackModeOption" Title = "Export PDF, PNG, and SVG in Black Mode">
                        <input Type  = "checkbox"
                               Id    = "ExportBlackModeCheckbox"
                               Class = "ExportOptionCheckbox" />
                        <span Class = "CustomTickBox">
                            <svg Width = "10" Height = "8" ViewBox = "0 0 10 8" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                <polyline Points = "1 4 3.5 6.5 9 1" />
                            </svg>
                        </span>
                        <span Class = "TickBoxText">Export in Black mode</span>
                    </label>
                    <label Class = "ExportMenuItem CheckboxItem" Id = "ExportTransparentOption" Title = "Export with Transparent Background">
                        <input Type  = "checkbox"
                               Id    = "ExportTransparentCheckbox"
                               Class = "ExportOptionCheckbox" />
                        <span Class = "CustomTickBox">
                            <svg Width = "10" Height = "8" ViewBox = "0 0 10 8" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                <polyline Points = "1 4 3.5 6.5 9 1" />
                            </svg>
                        </span>
                        <span Class = "TickBoxText">Transparent Background</span>
                    </label>

                    <div Class = "ExportMenuFooter">
                        <button Type = "button" Id = "OpenSettingsFromExportBtn" Class = "ExportMenuFooterBtn">Configure in Dashboard Settings →</button>
                    </div>
                </div>
            </div>`;

html = html.replace(oldHeaderRightButtons, newHeaderRightExportGroup);

// Add Export Paper Color Mode setting to SettingsPanel in DashboardView
const exportSettingAddition = `                        <!-- Export Paper Color Mode Setting -->
                        <div Class = "SettingItem">
                            <div Class = "SettingLabelRow">
                                <span Class = "SettingLabel">Export Paper Color Mode</span>
                                <span Class = "SettingValueBadge" Id = "ExportPaperModeBadge">Light Mode (Normal)</span>
                            </div>
                            <select Id = "ExportPaperModeSelect" Class = "SelectDropdown SettingDropdown">
                                <option Value = "light">Light Paper Mode (Default standard document)</option>
                                <option Value = "black">Black Paper Mode (Dark/OLED monochrome output)</option>
                            </select>
                        </div>`;

html = html.replace(
    '                        <!-- Default Export Background Setting -->',
    exportSettingAddition + '\n\n                        <!-- Default Export Background Setting -->'
);

fs.writeFileSync("TypstStudio/public/Index.html", html, "utf8");
console.log("Index.html updated successfully!");


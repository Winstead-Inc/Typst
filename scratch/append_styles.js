const fs = require("fs");

let css = fs.readFileSync("TypstStudio/public/Style.css", "utf8");

const additions =
`/* --- VIEWPORT SEGMENTED CONTROL (PRIORITY 2) --- */
.LayoutSwitcherNav
{
    display: inline-flex;
    align-items: center;
    background-color: #18181B;
    border: 1px solid #27272A;
    border-radius: 6px;
    padding: 2px;
    gap: 2px;
}

.LayoutTabBtn
{
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    font-size: 11px;
    font-weight: 500;
    color: #A1A1AA;
    background: transparent;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}

.LayoutTabBtn:hover
{
    color: #F4F4F5;
    background-color: #27272A;
}

.LayoutTabBtn.Active
{
    color: #FFFFFF;
    background-color: #3F3F46;
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* Viewport Layout States on MainSplitArea */
.MainSplitArea.LayoutEditorOnly .EditorPane
{
    flex: 1 1 100% !important;
    max-width: 100% !important;
    width: 100% !important;
}

.MainSplitArea.LayoutEditorOnly .SplitResizer,
.MainSplitArea.LayoutEditorOnly .PreviewPane
{
    display: none !important;
}

.MainSplitArea.LayoutPreviewOnly .PreviewPane
{
    flex: 1 1 100% !important;
    max-width: 100% !important;
    width: 100% !important;
}

.MainSplitArea.LayoutPreviewOnly .SplitResizer,
.MainSplitArea.LayoutPreviewOnly .EditorPane,
.MainSplitArea.LayoutPreviewOnly .OutlineSidebar
{
    display: none !important;
}

/* --- DOCUMENT OUTLINE / TOC SIDEBAR (PRIORITY 2) --- */
.OutlineSidebar
{
    width: 260px;
    min-width: 220px;
    max-width: 380px;
    background-color: #0D0D0E;
    border-right: 1px solid #27272A;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    transition: width 0.2s ease, opacity 0.2s ease;
    z-index: 5;
}

.OutlineHeader
{
    height: 38px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #1F1F23;
    background-color: #121215;
}

.OutlineHeaderTitle
{
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #E4E4E7;
    letter-spacing: 0.02em;
}

.MiniCloseBtn
{
    background: transparent;
    border: none;
    color: #71717A;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: all 0.15s ease;
}

.MiniCloseBtn:hover
{
    color: #FFFFFF;
    background-color: #27272A;
}

.OutlineSearchBox
{
    padding: 8px 10px;
    border-bottom: 1px solid #1F1F23;
    background-color: #0D0D0E;
}

.OutlineSearchInput
{
    width: 100%;
    padding: 5px 8px;
    font-size: 11px;
    background-color: #18181B;
    border: 1px solid #27272A;
    border-radius: 4px;
    color: #F4F4F5;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
}

.OutlineSearchInput:focus
{
    border-color: #7C3AED;
}

.OutlineList
{
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
    scrollbar-width: thin;
    scrollbar-color: #3F3F46 #121214;
}

.OutlineList::-webkit-scrollbar
{
    width: 6px;
}

.OutlineList::-webkit-scrollbar-thumb
{
    background: #3F3F46;
    border-radius: 3px;
}

.OutlineItem
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 12px;
    font-size: 11.5px;
    color: #A1A1AA;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all 0.12s ease;
    user-select: none;
    line-height: 1.35;
}

.OutlineItem:hover
{
    color: #FFFFFF;
    background-color: #18181C;
    border-left-color: #7C3AED;
}

.OutlineItem.Level1
{
    font-weight: 600;
    color: #E4E4E7;
    padding-left: 12px;
}

.OutlineItem.Level2
{
    padding-left: 24px;
    font-weight: 800 !important;
}

.OutlineItem.Level3
{
    padding-left: 36px;
    font-size: 11px;
    color: #8E8E93;
}

.OutlineItem.Level4
{
    padding-left: 48px;
    font-size: 10.5px;
    color: #71717A;
}

.OutlineItemText
{
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 6px;
}

.OutlineItemLine
{
    font-size: 9.5px;
    color: #52525B;
    font-family: "JetBrains Mono", monospace;
    flex-shrink: 0;
}

.OutlineEmptyState
{
    padding: 24px 16px;
    text-align: center;
    font-size: 12px;
    color: #52525B;
}

/* Status Bar Button */
.StatusBarBtn
{
    background: transparent;
    border: none;
    color: #A1A1AA;
    font-size: 11px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 3px;
    transition: all 0.15s ease;
}

.StatusBarBtn:hover
{
    color: #FFFFFF;
    background-color: #27272A;
}

/* --- ASSET DRAG & DROP OVERLAY (PRIORITY 3) --- */
.AssetDropOverlay
{
    position: absolute;
    inset: 0;
    background: rgba(10, 10, 15, 0.88);
    border: 2px dashed #7C3AED;
    border-radius: 4px;
    z-index: 100;
    display: none;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    backdrop-filter: blur(4px);
    transition: opacity 0.2s ease;
}

.AssetDropOverlay.Active
{
    display: flex;
}

.DropOverlayContent
{
    text-align: center;
    color: #E4E4E7;
}

.DropOverlayContent svg
{
    margin-bottom: 12px;
    filter: drop-shadow(0 0 12px rgba(124, 58, 237, 0.6));
}

.DropOverlayContent p
{
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    letter-spacing: 0.02em;
}

/* --- KEYBOARD SHORTCUTS MODAL (PRIORITY 4) --- */
.ModalOverlay
{
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.ShortcutsModalDialog
{
    background-color: #121215;
    border: 1px solid #27272A;
    border-radius: 10px;
    max-width: 680px;
    width: 100%;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(124, 58, 237, 0.15);
    overflow: hidden;
    animation: ModalFadeIn 0.2s ease-out;
}

@keyframes ModalFadeIn
{
    from { opacity: 0; transform: scale(0.96) translateY(-8px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

.ModalHeader
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border-bottom: 1px solid #1F1F23;
    background-color: #18181C;
}

.ModalHeaderTitle
{
    display: flex;
    align-items: center;
    gap: 10px;
    color: #F4F4F5;
    font-size: 14px;
    font-weight: 600;
}

.ModalHeaderTitle h3
{
    margin: 0;
    font-size: 14px;
}

.ShortcutsGrid
{
    padding: 18px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 18px;
    max-height: 70vh;
    overflow-y: auto;
}

.ShortcutCategory h4
{
    margin: 0 0 10px 0;
    font-size: 11.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #A855F7;
    border-bottom: 1px solid #27272A;
    padding-bottom: 4px;
}

.ShortcutRow
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 0;
    font-size: 12px;
}

.ShortcutDesc
{
    color: #A1A1AA;
}

.ShortcutKeys
{
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: #F4F4F5;
}

kbd
{
    background-color: #27272A;
    border: 1px solid #3F3F46;
    border-bottom: 2px solid #52525B;
    border-radius: 4px;
    padding: 2px 6px;
    font-family: "JetBrains Mono", monospace;
    font-size: 10.5px;
    font-weight: 600;
    color: #F4F4F5;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.HelpBtn
{
    padding: 4px 10px !important;
    font-weight: 700 !important;
    font-size: 13px !important;
}

/* --- NATIVE BROWSER PRINT INTEGRATION (PRIORITY 4) --- */
@media print
{
    body, html
    {
        background: #FFFFFF !important;
        color: #000000 !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    .AppHeader,
    .EditorPane,
    .SplitResizer,
    .PreviewToolbar,
    .ErrorDrawer,
    .DashboardView,
    .ToastContainer,
    .ModalOverlay,
    .OutlineSidebar
    {
        display: none !important;
    }

    .MainSplitArea,
    .PreviewPane,
    .PreviewViewport,
    .PagesContainer
    {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        position: static !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
    }

    .PageWrapper
    {
        box-shadow: none !important;
        margin: 0 !important;
        page-break-after: always;
        break-after: page;
        border: none !important;
    }

    .PageSvgContainer svg
    {
        width: 100% !important;
        height: auto !important;
    }
}
`;

fs.writeFileSync("TypstStudio/public/Style.css", css + additions, "utf8");
console.log("SUCCESS: Style.css updated");

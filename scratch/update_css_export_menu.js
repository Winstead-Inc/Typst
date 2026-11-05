const fs = require("fs");

let css = fs.readFileSync("TypstStudio/public/Style.css", "utf8");

const exportMenuStyles = `
/* --- UNIFIED EXPORT GROUP & FLOATING DROPDOWN MENU --- */
.ExportGroupWrapper
{
    position: relative;
    display: inline-flex;
    align-items: stretch;
}

.ExportMainBtn
{
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-right: 1px solid rgba(0, 0, 0, 0.15) !important;
    padding: 6px 10px !important;
}

.ExportMenuToggleBtn
{
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    padding: 6px 7px !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.ExportMenuDropdown
{
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    width: 260px;
    background-color: #121215;
    border: 1px solid #27272A;
    border-radius: 8px;
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.8), 0 0 16px rgba(124, 58, 237, 0.15);
    display: flex;
    flex-direction: column;
    padding: 6px;
    gap: 2px;
    z-index: 1000;
    animation: DropdownFadeIn 0.15s ease-out;
}

@keyframes DropdownFadeIn
{
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
}

.ExportMenuSectionTitle
{
    font-size: 10.5px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #71717A;
    padding: 6px 8px 4px 8px;
}

.ExportMenuItem
{
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    font-size: 12px;
    color: #E4E4E7;
    background: transparent;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: all 0.12s ease;
    box-sizing: border-box;
    user-select: none;
}

.ExportMenuItem:hover
{
    background-color: #27272A;
    color: #FFFFFF;
}

.ExportMenuItem.CheckboxItem
{
    cursor: pointer;
    padding: 6px 8px;
}

.ExportMenuItem svg
{
    color: #A1A1AA;
    flex-shrink: 0;
}

.ExportMenuItem:hover svg
{
    color: #FFFFFF;
}

.MenuShortcut
{
    margin-left: auto;
    font-size: 10.5px;
    color: #71717A;
    font-family: "JetBrains Mono", monospace;
}

.ExportMenuDivider
{
    height: 1px;
    background-color: #1F1F23;
    margin: 4px 0;
}

.ExportMenuFooter
{
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid #1F1F23;
}

.ExportMenuFooterBtn
{
    width: 100%;
    background: transparent;
    border: none;
    font-size: 11px;
    color: #A855F7;
    cursor: pointer;
    padding: 5px 8px;
    text-align: left;
    border-radius: 4px;
    transition: all 0.12s ease;
}

.ExportMenuFooterBtn:hover
{
    background-color: rgba(168, 85, 247, 0.12);
    color: #C084FC;
}

/* Template Selector Compactness */
.TemplateSelectorContainer
{
    max-width: 150px;
    flex-shrink: 1;
}

.TemplateSelectorContainer .SelectDropdown
{
    max-width: 150px;
    text-overflow: ellipsis;
}

/* Ensure AppHeader never wraps awkwardly */
.AppHeader
{
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scrollbar-width: none !important;
}

.AppHeader::-webkit-scrollbar
{
    display: none !important;
}
`;

css += exportMenuStyles;
fs.writeFileSync("TypstStudio/public/Style.css", css, "utf8");
console.log("Style.css updated with Export menu styles!");


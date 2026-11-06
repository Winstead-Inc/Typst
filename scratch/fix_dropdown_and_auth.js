const fs = require("fs");

console.log("=== Step 1: Fixing Style.css Stacking & Overflow ===");
let css = fs.readFileSync("TypstStudio/public/Style.css", "utf8");
// 1. Fix .AppHeader at line 152
css = css.replace
(
    `.AppHeader
{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--ui-height-header);
    padding: 0 18px;
    background-color: var(--bg-header);
    border-bottom: 1px solid var(--border-color);
    user-select: none;
    z-index: 10;
}`,
    `.AppHeader
{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--ui-height-header);
    padding: 0 18px;
    background-color: var(--bg-header);
    border-bottom: 1px solid var(--border-color);
    user-select: none;
    z-index: 1000;
    overflow: visible !important;
    flex-wrap: nowrap;
}`
);
// 2. Remove the conflicting .AppHeader overflow-y: hidden at bottom
css = css.replace
(
    `/* Ensure AppHeader never wraps awkwardly */
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
}`,
    `/* Ensure AppHeader never wraps awkwardly */
.AppHeader
{
    flex-wrap: nowrap !important;
    overflow: visible !important;
}`
);
// 3. Make sure .ExportGroupWrapper and .ExportMenuDropdown have highest z-index
css = css.replace
(
    `.ExportGroupWrapper
{
    position: relative;
    display: inline-flex;
    align-items: stretch;
}`,
    `.ExportGroupWrapper
{
    position: relative;
    display: inline-flex;
    align-items: stretch;
    z-index: 1002;
}`
);

css = css.replace
(
    `    z-index: 1000;
    animation: DropdownFadeIn 0.15s ease-out;
}

@keyframes DropdownFadeIn`,
    `    z-index: 99999 !important;
    animation: DropdownFadeIn 0.15s ease-out;
}

@keyframes DropdownFadeIn`
);

css = css.replace
(
    `    width: var(--ui-width-doc-menu);
    max-height: 420px;
    background-color: #0d0d0e;
    border: 1px solid #27272a;
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05);
    z-index: 100;`,
    `    width: var(--ui-width-doc-menu);
    max-height: 420px;
    background-color: #0d0d0e;
    border: 1px solid #27272a;
    border-radius: 8px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05);
    z-index: 99999 !important;`
);

fs.writeFileSync("TypstStudio/public/Style.css", css, "utf8");
console.log("Style.css updated with proper stacking and overflow: visible!");

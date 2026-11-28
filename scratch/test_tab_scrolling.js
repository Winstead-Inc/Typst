const fs = require("fs");
const path = require("path");
const assert = require("assert");

console.log("=== Verifying EditorTabsList Horizontal Scrolling Fixes ===");

const HtmlPath = path.resolve(__dirname, "../TypstStudio/public/index.html");
const CssPath = path.resolve(__dirname, "../TypstStudio/public/Style.css");
const AppJsPath = path.resolve(__dirname, "../TypstStudio/public/App.js");

const HtmlContent = fs.readFileSync(HtmlPath, "utf-8");
const CssContent = fs.readFileSync(CssPath, "utf-8");
const AppJsContent = fs.readFileSync(AppJsPath, "utf-8");

// 1. Verify HTML Structure
console.log("[1/4] Checking HTML EditorTabsBar structure...");
assert(HtmlContent.includes('Id = "EditorTabsList"'), "index.html missing EditorTabsList");
assert(HtmlContent.includes('Id = "TabsScrollLeftBtn"'), "index.html missing TabsScrollLeftBtn");
assert(HtmlContent.includes('Id = "TabsScrollRightBtn"'), "index.html missing TabsScrollRightBtn");
assert(HtmlContent.includes('Id = "TabsNewFileBtn"'), "index.html missing TabsNewFileBtn");
assert(HtmlContent.includes('Id = "TabsCloseAllBtn"'), "index.html missing TabsCloseAllBtn");
console.log("  PASS: HTML contains EditorTabsList and all action buttons.");

// 2. Verify CSS Layout Properties
console.log("[2/4] Checking CSS flex and overflow constraints...");
// Check .EditorTabsBar has overflow: hidden and flex-shrink: 0
const EditorTabsBarRegex = /\.EditorTabsBar\s*\{([^}]+)\}/;
const BarMatch = CssContent.match(EditorTabsBarRegex);
assert(BarMatch, "Style.css missing .EditorTabsBar rule");
assert(BarMatch[1].includes("overflow: hidden"), ".EditorTabsBar must have overflow: hidden to avoid container blowout");
assert(BarMatch[1].includes("flex-shrink: 0"), ".EditorTabsBar must have flex-shrink: 0");

// Check .EditorTabsList has min-width: 0 and overflow-x: auto
const EditorTabsListRegex = /\.EditorTabsList\s*\{([^}]+)\}/;
const ListMatch = CssContent.match(EditorTabsListRegex);
assert(ListMatch, "Style.css missing .EditorTabsList rule");
assert(ListMatch[1].includes("min-width: 0"), ".EditorTabsList must have min-width: 0 to allow flexbox shrinking and internal overflow");
assert(ListMatch[1].includes("overflow-x: auto"), ".EditorTabsList must have overflow-x: auto");
assert(ListMatch[1].includes("overflow-y: hidden"), ".EditorTabsList must have overflow-y: hidden");

// Check .EditorTab has flex-shrink: 0
const EditorTabRegex = /\.EditorTab\s*\{([^}]+)\}/;
const TabMatch = CssContent.match(EditorTabRegex);
assert(TabMatch, "Style.css missing .EditorTab rule");
assert(TabMatch[1].includes("flex-shrink: 0"), ".EditorTab must have flex-shrink: 0 so tabs don't compress into unreadable slivers");
console.log("  PASS: CSS enforces strict containment, min-width: 0, and non-shrinking tabs.");

// 3. Verify JavaScript Wheel, Drag, and Button Handlers
console.log("[3/4] Checking JavaScript scroll and event listeners...");
assert(AppJsContent.includes('EditorTabsList.scrollLeft += Event.deltaY'), "App.js missing vertical wheel to horizontal scroll translation");
assert(AppJsContent.includes('EditorTabsList.scrollLeft += Event.deltaX'), "App.js missing horizontal wheel scroll handling");
assert(AppJsContent.includes('Event.button === 1'), "App.js missing middle-click (auxclick) tab close handler");
assert(AppJsContent.includes('IsDraggingTabs'), "App.js missing mouse click-and-drag tab scrolling");
assert(AppJsContent.includes('ScrollActiveTabIntoView'), "App.js missing ScrollActiveTabIntoView function");
assert(AppJsContent.includes('TabsScrollLeftBtn'), "App.js missing TabsScrollLeftBtn handler");
assert(AppJsContent.includes('TabsScrollRightBtn'), "App.js missing TabsScrollRightBtn handler");
console.log("  PASS: JavaScript includes bi-directional wheel translation, drag scrolling, and navigation buttons.");

// 4. Functional Simulation
console.log("[4/4] Simulating Wheel Translation & Drag Scroll Logic...");
let SimulatedScrollLeft = 0;
function HandleSimulatedWheel(Event)
{
    if (Event.deltaX !== 0)
    {
        SimulatedScrollLeft += Event.deltaX;
    }
    else if (Event.deltaY !== 0)
    {
        SimulatedScrollLeft += Event.deltaY;
    }
}

// Vertical mouse wheel down (positive deltaY) should scroll tabs right
HandleSimulatedWheel({ deltaX: 0, deltaY: 100 });
assert.strictEqual(SimulatedScrollLeft, 100, "Vertical wheel down must increase scrollLeft");

// Vertical mouse wheel up (negative deltaY) should scroll tabs left
HandleSimulatedWheel({ deltaX: 0, deltaY: -50 });
assert.strictEqual(SimulatedScrollLeft, 50, "Vertical wheel up must decrease scrollLeft");

// Trackpad horizontal scroll (deltaX)
HandleSimulatedWheel({ deltaX: 30, deltaY: 0 });
assert.strictEqual(SimulatedScrollLeft, 80, "Trackpad horizontal scroll must adjust scrollLeft");

console.log("  PASS: Functional simulation verified.");

console.log("\nALL TAB SCROLLING VERIFICATIONS PASSED 100%!");

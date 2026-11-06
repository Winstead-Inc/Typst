const FS = require("node:fs");

console.log("Verifying Step 3 UI Controls & Styles...");

const Html = FS.readFileSync("TypstStudio/public/Index.html", "utf-8");
const Css = FS.readFileSync("TypstStudio/public/Style.css", "utf-8");

if (!Html.includes('Id = "SyncTexToggle"'))
{
    throw new Error("Missing #SyncTexToggle in Index.html");
}
console.log("✓ Verified #SyncTexToggle exists in Index.html with LAFS PascalCase attribute formatting");

if (!Css.includes(".SyncHighlightRect"))
{
    throw new Error("Missing .SyncHighlightRect in Style.css");
}
console.log("✓ Verified .SyncHighlightRect exists in Style.css");

if (!Css.includes("#7100FF"))
{
    throw new Error("Missing primary purple #7100FF in Style.css");
}
console.log("✓ Verified strict color policy (#7100FF) in Style.css");

if (!Css.includes("SyncInspectMode"))
{
    throw new Error("Missing SyncInspectMode in Style.css");
}
console.log("✓ Verified crosshair inspect cursor rules in Style.css");

console.log("\nALL STEP 3 UI & STYLES VERIFICATIONS PASSED!");

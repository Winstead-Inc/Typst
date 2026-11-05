const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/Style.css", "utf8");
const lines = s.split("\n");

lines.forEach((l, i) => {
    if (l.includes("AppHeader") || l.includes("ExportMenuDropdown") || l.includes("PreviewToolbar") || l.includes("ExportGroupWrapper")) {
        console.log(`Line ${i + 1}: ${l}`);
    }
});


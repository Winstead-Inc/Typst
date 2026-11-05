const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const idx = s.indexOf("function ExportPdf()");
console.log(s.slice(idx + 500, idx + 1100));

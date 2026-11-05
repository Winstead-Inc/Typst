const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const idx = s.indexOf("ApplyFormattingToEditor");
console.log(s.slice(idx + 250, idx + 600));

const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const idx = s.indexOf("DeleteFileFromWorkspace");
console.log(s.slice(idx, idx + 400));


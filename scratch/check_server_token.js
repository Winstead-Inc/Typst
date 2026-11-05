const fs = require("fs");
const s = fs.readFileSync("TypstStudio/Server.js", "utf8");
const idx = s.indexOf("window.__TYPST_STUDIO_AUTH_TOKEN__");
console.log(s.slice(idx - 200, idx + 400));


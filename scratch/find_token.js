const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");

lines.forEach((l, i) => {
    if (l.includes("SessionAuthToken") || l.includes("__TYPST_STUDIO_AUTH_TOKEN__") || l.includes("Token")) {
        console.log(`Line ${i + 1}: ${l}`);
    }
});


const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");

lines.forEach
(
    (l, i) =>
    {
        if (l.includes("fetch(") || l.includes('"/api/'))
        {
            console.log(`Line ${i + 1}: ${l}`);
        }
    }
);

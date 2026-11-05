const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");

lines.forEach((l, i) => {
    if (l.includes("DELETE") || l.includes("delete") || l.includes("Delete")) {
        console.log(`Line ${i + 1}: ${l}`);
    }
});


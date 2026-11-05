const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/Style.css", "utf8");
const lines = s.split("\n");

lines.forEach((l, i) => {
    if (l.includes("z-index")) {
        console.log(`Line ${i + 1}: ${l}`);
    }
});


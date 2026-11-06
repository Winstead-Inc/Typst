const fs = require("fs");
const s = fs.readFileSync("TypstStudio/Server.js", "utf8");
const lines = s.split("\n");

lines.forEach
(
    (l, i) =>
    {
        if (l.includes("SESSION_AUTH_TOKEN") || l.includes("AUTH_TOKEN"))
        {
            console.log(`Line ${i + 1}: ${l}`);
        }
    }
);

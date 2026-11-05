const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");
for (let i = 2270; i < 2315; i++)
{
    console.log(`${i + 1}: ${lines[i]}`);
}


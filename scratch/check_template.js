const fs = require("fs");
const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");

for (let i = 220; i < 571; i ++)
{
    const line = lines[i];
    if (line.includes("${"))
    {
        console.log(`Line ${i + 1}: ${line}`);
    }
}

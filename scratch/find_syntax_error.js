const fs = require("fs");
const vm = require("vm");

const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");
console.log("Total lines in App.js:", lines.length);

let firstErrorLine = - 1;
let firstErrorMsg = "";

for (let i = 1; i <= lines.length; i ++)
{
    const chunk = lines.slice(0, i).join("\n");
    try
    {
        new vm.Script(chunk);
    }
    catch (e)
    {
        // Ignore "Unexpected end of input" since chunk is incomplete
        if (e.message !== "Unexpected end of input")
        {
            firstErrorLine = i;
            firstErrorMsg = e.message;
            break;
        }
    }
}

console.log("First real syntax error at line:", firstErrorLine, "Error:", firstErrorMsg);
if (firstErrorLine !== - 1)
{
    for (let j = Math.max(0, firstErrorLine - 15); j <= Math.min(lines.length - 1, firstErrorLine + 5); j ++)
    {
        console.log(`${j + 1}: ${lines[j]}`);
    }
}

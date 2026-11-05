const fs = require("fs");
const vm = require("vm");

const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const lines = s.split("\n");

console.log("Lines 1 to 572 parse test:");
try
{
    new vm.Script(lines.slice(0, 572).join("\n"));
    console.log("Lines 1 to 572 parsed cleanly!");
}
catch (e)
{
    console.log("Error in 1 to 572:", e.message);
}

console.log("Lines 573 to 700 parse test:");
try
{
    new vm.Script(lines.slice(572, 700).join("\n"));
    console.log("Lines 573 to 700 parsed cleanly!");
}
catch (e)
{
    console.log("Error in 573 to 700:", e.message);
}


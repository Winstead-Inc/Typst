const fs = require("fs");
const cp = require("child_process");

const orig = cp.execSync("git show HEAD:TypstStudio/public/App.js", { encoding: "utf8" });
console.log("Original HEAD App.js line count:", orig.split("\n").length);

const current = fs.readFileSync("TypstStudio/public/App.js", "utf8");
console.log("Current App.js line count:", current.split("\n").length);

// Let's see what is at line 3680-3720
const curLines = current.split("\n");
for (let i = 3680; i < Math.min(curLines.length, 3720); i++)
{
    console.log(`${i + 1}: ${curLines[i]}`);
}


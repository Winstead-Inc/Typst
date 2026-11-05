const fs = require("fs");

const s = fs.readFileSync("TypstStudio/public/App.js", "utf8");

// Count unescaped backticks outside of comments
let inLineComment = false;
let inBlockComment = false;
let inSingleQuote = false;
let inDoubleQuote = false;
let inBacktick = false;
let backtickStarts = [];

for (let i = 0; i < s.length; i++)
{
    const c = s[i];
    const prev = i > 0 ? s[i - 1] : "";
    const next = i < s.length - 1 ? s[i + 1] : "";

    if (inLineComment)
    {
        if (c === "\n") inLineComment = false;
        continue;
    }
    if (inBlockComment)
    {
        if (c === "*" && next === "/")
        {
            inBlockComment = false;
            i++;
        }
        continue;
    }
    if (inSingleQuote)
    {
        if (c === "'" && prev !== "\\") inSingleQuote = false;
        continue;
    }
    if (inDoubleQuote)
    {
        if (c === '"' && prev !== "\\") inDoubleQuote = false;
        continue;
    }
    if (inBacktick)
    {
        if (c === "`" && prev !== "\\")
        {
            inBacktick = false;
            backtickStarts.pop();
        }
        continue;
    }

    // Normal code
    if (c === "/" && next === "/")
    {
        inLineComment = true;
        i++;
    }
    else if (c === "/" && next === "*")
    {
        inBlockComment = true;
        i++;
    }
    else if (c === "'")
    {
        inSingleQuote = true;
    }
    else if (c === '"')
    {
        inDoubleQuote = true;
    }
    else if (c === "`")
    {
        inBacktick = true;
        // Calculate line number
        const line = s.slice(0, i).split("\n").length;
        backtickStarts.push({ line, pos: i });
    }
}

if (inBacktick)
{
    console.log("Unclosed backtick opened at line:", backtickStarts[backtickStarts.length - 1].line);
    const startPos = backtickStarts[backtickStarts.length - 1].pos;
    console.log("Context around unclosed backtick:");
    console.log(s.slice(startPos, startPos + 300));
}
else
{
    console.log("All backticks matched! Something else is wrong.");
}


const fs = require("fs");
const app = fs.readFileSync("TypstStudio/public/App.js", "utf8");

// Extract DetectKnrSlop
const startIdx = app.indexOf("function DetectKnrSlop(");
const endIdx = app.indexOf("function InProcessFormatSnippetLAFS(");
const fnCode = app.substring(startIdx, endIdx);
eval(fnCode);

const genesisSrc = fs.readFileSync("projects/GenesisOfTheVanguard/main.typ", "utf8");
const res = DetectKnrSlop(genesisSrc, "main.typ");
console.log("GenesisOfTheVanguard/main.typ errors:", res.Errors.length);
if (res.Errors.length > 0)
{
    console.log(JSON.stringify(res.Errors, null, 2));
}

const showCaseSrc = fs.readFileSync("0typ.txt", "utf8");
const res2 = DetectKnrSlop(showCaseSrc, "0typ.txt");
console.log("0typ.txt errors:", res2.Errors.length);
if (res2.Errors.length > 0)
{
    console.log(JSON.stringify(res2.Errors, null, 2));
}

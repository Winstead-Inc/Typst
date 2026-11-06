const FS = require("fs");
const AppCode = FS.readFileSync("TypstStudio/public/App.js", "utf8");

const Lines = AppCode.split("\n");
const ShowcaseLines = Lines.slice(230, 564);
const Showcase = ShowcaseLines.join("\n").replace(/^\s*showcase:\s*`/, "").replace(/`\s*$/, "");

const KnrStart = AppCode.indexOf("function DetectKnrSlop");
const KnrEnd = AppCode.indexOf("function ValidateEditorLAFS");
const KnrFuncCode = AppCode.substring(KnrStart, KnrEnd);

const DetectKnrSlop = new Function(KnrFuncCode + "\nreturn DetectKnrSlop;");
const Fn = DetectKnrSlop();
const Result = Fn(Showcase, "showcase.typ");
console.log("K&R Slop in showcase:", Result.HasError);
console.log("Error count:", Result.Errors.length);
Result.Errors.forEach
(
    (E, I) =>
    {
        console.log(`[${I}] Line ${E.Line}:${E.Col} - ${E.Reason} (${E.LineText ? E.LineText.trim() : ""})`);
    }
);

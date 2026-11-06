const FS = require("fs");
const Path = require("path");
const CP = require("child_process");

const Content = FS.readFileSync("TypstStudio/public/App.js", "utf8");
const Lines = Content.split("\n");
const FirstLine = Lines[230].replace(/^\s*showcase:\s*`/, "");
const MiddleLines = Lines.slice(231, 563);
const LastLine = Lines[563].replace(/`\s*$/, "");
const ShowcaseLines = [FirstLine, ...MiddleLines, LastLine];
const Showcase = ShowcaseLines.join("\n");

console.log("Showcase lines count:", ShowcaseLines.length);

ShowcaseLines.forEach((L, Idx) => {
    if (L.includes("Matrices and vectors"))
    {
        console.log(`Line ${Idx + 1}: ${L}`);
    }
});

const TempDir = Path.resolve("scratch/test_line100_out");
FS.mkdirSync(TempDir, { recursive: true });

const Res = CP.spawnSync("TypstStudio/bin/typst.exe", ["compile", "--format", "svg", "-", Path.join(TempDir, "page-{n}.svg")], {
    input: Showcase,
    encoding: "utf-8"
});

console.log("Exit code:", Res.status);
if (Res.stderr && Res.stderr.length > 0) console.log("Stderr:", Res.stderr);

const SyncFile = Path.join(TempDir, "synctex.json");
if (FS.existsSync(SyncFile))
{
    const Sync = JSON.parse(FS.readFileSync(SyncFile, "utf8"));
    console.log("Total sync elements:", Sync.length);
    const Matching = Sync.filter(E => E.line === 100 || E.end_line === 100);
    console.log("Matching elements on line 100:", Matching.length);
    Matching.forEach(E => {
        console.log(`Page: ${E.page}, x: ${E.x.toFixed(1)}, y: ${E.y.toFixed(1)}, w: ${E.width.toFixed(1)}, h: ${E.height.toFixed(1)}, line: ${E.line}:${E.col} -> ${E.end_line}:${E.end_col}, span: ${E.span}`);
    });
}

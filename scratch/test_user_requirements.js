const FS = require("fs");
const Path = require("path");
const HTTP = require("http");

console.log("===============================================================================");
console.log("Verification Suite for User Requirements");
console.log("===============================================================================");

let Passed = 0;
let Failed = 0;

function Assert(Condition, Desc) {
    if (Condition) {
        Passed++;
        console.log(`  ✓ PASS: ${Desc}`);
    } else {
        Failed++;
        console.error(`  ✗ FAIL: ${Desc}`);
    }
}

// -----------------------------------------------------------------------------
// Test 1: Merge Overlapping Boxes (No inner/nested boxes, longer box covers artifact)
// -----------------------------------------------------------------------------
console.log("\n[Test 1: Merge Overlapping Boxes]");
const AppCode = FS.readFileSync("TypstStudio/public/App.js", "utf8");

// Extract MergeOverlappingBoxes function
const MergeFnStr = AppCode.substring(AppCode.indexOf("function MergeOverlappingBoxes"), AppCode.indexOf("function GroupElementsIntoVisualBoxes"));
const MergeOverlappingBoxes = new Function(MergeFnStr + "\nreturn MergeOverlappingBoxes;")();

const NestedBoxes = [
    { page: 1, x: 70.9, y: 85.7, width: 446.2, height: 11.0 },  // Giant line box
    { page: 1, x: 357.4, y: 83.2, width: 27.5, height: 17.6 },  // Matrix box inside
    { page: 1, x: 418.4, y: 97.2, width: 3.7, height: 5.5 },   // Subscript box inside
    { page: 1, x: 70.9, y: 102.1, width: 67.0, height: 11.0 }  // Second line box
];

const MergedResult = MergeOverlappingBoxes(NestedBoxes);
Assert(MergedResult.length === 2, `Expected 2 visual line boxes (1 per line), got ${MergedResult.length}`);
Assert(MergedResult[0].width >= 446.2, `Longer box maintained width (${MergedResult[0].width.toFixed(1)})`);
Assert(MergedResult[0].y <= 83.2, `Longer box covers top of matrix (${MergedResult[0].y.toFixed(1)})`);
Assert(MergedResult[0].y + MergedResult[0].height >= 102.7, `Longer box covers bottom of subscript (${(MergedResult[0].y + MergedResult[0].height).toFixed(1)})`);

// Verify zero nested boxes exist on the same line
let AnyNested = false;
for (let i = 0; i < MergedResult.length; i++) {
    for (let j = 0; j < MergedResult.length; j++) {
        if (i === j) continue;
        const A = MergedResult[i];
        const B = MergedResult[j];
        if (A.page === B.page) {
            const InsideX = A.x >= B.x && (A.x + A.width) <= (B.x + B.width);
            const InsideY = A.y >= B.y && (A.y + A.height) <= (B.y + B.height);
            if (InsideX && InsideY) AnyNested = true;
        }
    }
}
Assert(!AnyNested, "Zero nested or inner overlapping boxes exist in final output");

// -----------------------------------------------------------------------------
// Test 2: Strict Selection with Trailing Whitespace
// -----------------------------------------------------------------------------
console.log("\n[Test 2: Strict Selection with Trailing Whitespace]");

const MockSyncElements = [
    { start: 64, end: 81, line: 2, col: 65, end_line: 2, end_col: 81, text: "$mat(1, 2; 3, 4)$" },
    { start: 81, end: 86, line: 2, col: 82, end_line: 2, end_col: 86, text: " and " },
    { start: 86, end: 101, line: 2, col: 87, end_line: 2, end_col: 101, text: "$vec(x_1, x_2)$" },
    { start: 101, end: 102, line: 2, col: 102, end_line: 2, end_col: 103, text: " " }, // trailing space
    { start: 102, end: 137, line: 2, col: 103, end_line: 2, end_col: 138, text: "integrate smoothly into..." } // next word
];

const SelStart = 64;
const SelEnd = 102;
const SelStartCol = 65;
const SelEndCol = 103;

const Selected = MockSyncElements.filter(Elem => {
    const StartsBeforeEnd = typeof Elem.start === "number" && typeof SelEnd === "number"
        ? Elem.start < SelEnd
        : Elem.col < SelEndCol;
    const EndsAfterStart = typeof Elem.end === "number" && typeof SelStart === "number"
        ? Elem.end > SelStart
        : Elem.end_col > SelStartCol;
    return StartsBeforeEnd && EndsAfterStart;
});

Assert(Selected.length === 4, `Expected 4 selected elements (including trailing space), got ${Selected.length}`);
Assert(Selected.some(E => E.text === " "), "Trailing whitespace element IS included in selection");
Assert(!Selected.some(E => E.text.startsWith("integrate")), "Subsequent unselected word is NOT included");

// -----------------------------------------------------------------------------
// Test 3: Heading Selection Highlights Both TOC and Document Body
// -----------------------------------------------------------------------------
console.log("\n[Test 3: Both TOC and Body Headings Highlighted]");

const MockTocSync = [
    { page: 1, line: 9, col: 3, end_line: 9, end_col: 43, span: "span_heading_calculus", text: "2.5 Calculus (TOC)" },
    { page: 3, line: 9, col: 3, end_line: 9, end_col: 43, span: "span_heading_calculus", text: "2.5 Calculus (Body)" }
];

const BestElem = MockTocSync[0];
const Related = MockTocSync.filter(Elem => Elem.span === BestElem.span || (Elem.line === BestElem.line && Elem.end_line === BestElem.end_line));

Assert(Related.length === 2, `Heading cursor matched ${Related.length} related occurrences across pages`);
Assert(Related.some(E => E.page === 1), "TOC entry on Page 1 is included in Related highlight");
Assert(Related.some(E => E.page === 3), "Document body heading on Page 3 is included in Related highlight");

// -----------------------------------------------------------------------------
// Test 4: Live Server API Error Handling (No 400 Bad Request on Click)
// -----------------------------------------------------------------------------
console.log("\n[Test 4: Server Responds 200 OK on Invalid/Margin Click Coordinates]");

function TestApiClick(Payload, Callback) {
    HTTP.get("http://127.0.0.1:3000/api/auth/token", (Res) => {
        let Data = "";
        Res.on("data", C => Data += C);
        Res.on("end", () => {
            const Token = JSON.parse(Data).Token;
            const PostData = JSON.stringify(Payload);
            const Req = HTTP.request({
                hostname: "127.0.0.1",
                port: 3000,
                path: "/api/sync/click",
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Typst-Auth-Token": Token,
                    "Content-Length": Buffer.byteLength(PostData)
                }
            }, (ClickRes) => {
                let Body = "";
                ClickRes.on("data", C => Body += C);
                ClickRes.on("end", () => {
                    Callback(ClickRes.statusCode, JSON.parse(Body));
                });
            });
            Req.write(PostData);
            Req.end();
        });
    });
}

TestApiClick({ Page: 1, X: null, Y: null }, (Status, Body) => {
    Assert(Status === 200, `Expected status 200 for null coordinates, got ${Status}`);
    Assert(Body.Success === false && Body.Found === false, "Returns graceful Found: false instead of 400 Bad Request");

    TestApiClick({ Page: 1, X: 9999, Y: 9999 }, (Status2, Body2) => {
        Assert(Status2 === 200, `Expected status 200 for out-of-bounds click, got ${Status2}`);
        Assert(Body2.Success === false && Body2.Found === false, "Returns graceful Found: false for empty click point");

        console.log("\n===============================================================================");
        console.log(`SUMMARY: ${Passed} PASSED, ${Failed} FAILED`);
        console.log("===============================================================================");
    });
});

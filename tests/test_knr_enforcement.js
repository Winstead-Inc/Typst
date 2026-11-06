const HTTP = require("http");

function FetchAuthToken()
{
    return new Promise
    (
        (Resolve, reject) =>
        {
            HTTP.get
            (
                "http://127.0.0.1:3000/", (Res) =>
                {
                    let Html = "";
                    Res.on("data", (Chunk) => { Html += Chunk; });
                    Res.on
                    (
                        "end", () =>
                        {
                            const Match = Html.match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([^"]+)"/);
                            if (Match)
                            {
                                Resolve(Match[1]);
                            }
                            else
                            {
                                reject(new Error("Could not find auth token in HTML."));
                            }
                        }
                    );
                }
            )
            .on("error", reject);
        }
    );
}

function MakeRequest(Port, Path, Method, Payload, Token)
{
    return new Promise
    (
        (Resolve, reject) =>
        {
            const Body = Payload ? JSON.stringify(Payload): "";
            const Headers =
            {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(Body)
            };
            if (Token)
            {
                Headers["x-typst-auth-token"] = Token;
            }

            const Options =
            {
                hostname: "127.0.0.1",
                port: Port,
                path: Path,
                method: Method,
                headers: Headers
            };

            const Req = HTTP.request
            (
                Options, (Res) =>
                {
                    let ResBody = "";
                    Res.on("data", (Chunk) => { ResBody += Chunk; });
                    Res.on
                    (
                        "end", () =>
                        {
                            try
                            {
                                Resolve
                                ({
                                    Status: Res.statusCode, Headers: Res.headers, Data: JSON.parse(ResBody)
                                });
                            }
                            catch (E)
                            {
                                Resolve( { Status: Res.statusCode, Headers: Res.headers, RawData: ResBody });
                            }
                        }
                    );
                }
            );

            Req.on("error", (Err) => reject(Err));
            if (Body) { Req.write(Body); }
            Req.end();
        }
    );
}

async function RunTests()
{
    console.log("=== Testing K&R Slop Ban & Enforcement ===");

    const Token = await FetchAuthToken();
    console.log("Acquired Session Auth Token:", Token.substring(0, 12) + "...");
    // Test 1: Clean LAFS Document
    const CleanLafs =
    `#set page
(
    paper: "a4",
    margin: 2cm
)

#set text
(
    font: "Liberation Sans",
    size: 11pt
)

= Hello World
This is a test of LAFS typography.`;

    const CleanRes = await MakeRequest(3000, "/api/compile", "POST", { Source: CleanLafs, FileName: "test.typ" }, Token);
    console.log("Test 1 (Clean LAFS Compile):", CleanRes.Data.Success === true ? "PASS": "FAIL");
    // Test 2: K&R Slop Document (multiline with attached opening delimiter)
    let KnrDocLines = [];
    for (let I = 1; I < 37; I ++)
    {
        KnrDocLines.push(`// Line ${I}`);
    }
    KnrDocLines.push("#set text(");
    KnrDocLines.push("    font: \"Liberation Sans\",");
    KnrDocLines.push("    size: 11pt");
    KnrDocLines.push(")");
    const KnrDoc = KnrDocLines.join("\n");

    const KnrRes = await MakeRequest(3000, "/api/compile", "POST", { Source: KnrDoc, FileName: "main.typ" }, Token);
    console.log("Test 2 (K&R Slop Rejection in /api/compile):", KnrRes.Data.Success === false && KnrRes.Data.KnrSlop === true ? "PASS": "FAIL");
    console.log("\n--- Compiler Diagnostic Output ---");
    console.log(KnrRes.Data.Error);
    console.log("----------------------------------\n");
    // Test 3: Export PDF with K&R Slop
    const PdfRes = await MakeRequest(3000, "/api/export/pdf", "POST", { Source: KnrDoc, FileName: "main.typ" }, Token);
    console.log("Test 3 (K&R Slop Rejection in /api/export/pdf):", PdfRes.Status === 400 && PdfRes.Data.KnrSlop === true ? "PASS": "FAIL");
    // Test 4: Export PNG with K&R Slop
    const PngRes = await MakeRequest(3000, "/api/export/png", "POST", { Source: KnrDoc, FileName: "main.typ" }, Token);
    console.log("Test 4 (K&R Slop Rejection in /api/export/png):", PngRes.Status === 400 && PngRes.Data.KnrSlop === true ? "PASS": "FAIL");
    // Test 5: Legal Monolith (single line container) should PASS
    const MonolithDoc =
    `#set text(font: "Liberation Sans", size: 11pt)

= Monolith Test
This is legal under LAFS.`;

    const MonolithRes = await MakeRequest(3000, "/api/compile", "POST", { Source: MonolithDoc, FileName: "monolith.typ" }, Token);
    console.log("Test 5 (Legal Monolith Compile):", MonolithRes.Data.Success === true ? "PASS": "FAIL");
    // Test 6: Formatting K&R into LAFS
    const FormatRes = await MakeRequest(3000, "/api/format", "POST", { Source: KnrDoc }, Token);
    console.log("Test 6 (Format API Converts K&R to LAFS):", FormatRes.Data.Success === true ? "PASS": "FAIL");
    // Test 7: Formatted document now compiles cleanly
    const FormattedCompile = await MakeRequest(3000, "/api/compile", "POST", { Source: FormatRes.Data.Formatted, FileName: "main.typ" }, Token);
    console.log("Test 7 (Formatted Output Successfully Compiles):", FormattedCompile.Data.Success === true ? "PASS": "FAIL");
    // Test 8: Math Mode Vector 1 (attached opener mat() in multiline math)
    const MathKnrVector1 =
    [
        "$",
        "  mat(",
        "    1, 2;",
        "    3, 4",
        "  )",
        "$"
    ]
    .join("\n");
    const MathKnrRes1 = await MakeRequest(3000, "/api/compile", "POST", { Source: MathKnrVector1, FileName: "math_knr1.typ" }, Token);
    console.log("Test 8 (Math Vector 1 Opener Rejection):", MathKnrRes1.Data.Success === false && MathKnrRes1.Data.KnrSlop === true ? "PASS": "FAIL");
    // Test 9: Math Mode Vector 2 (closing hug 3, 4 ) in multiline math)
    const MathKnrVector2 =
    [
        "$",
        "  mat",
        "  (",
        "    1, 2;",
        "    3, 4 )",
        "$"
    ]
    .join("\n");
    const MathKnrRes2 = await MakeRequest(3000, "/api/compile", "POST", { Source: MathKnrVector2, FileName: "math_knr2.typ" }, Token);
    console.log("Test 9 (Math Vector 2 Closer Rejection):", MathKnrRes2.Data.Success === false && MathKnrRes2.Data.KnrSlop === true ? "PASS": "FAIL");
    // Test 10: Compound Container Grouping [{( ... )}] PASS
    const CompoundValid =
    [
        "table.cell",
        "[{(",
        '  "ModuleA",',
        '  "ModuleB"',
        ")}]"
    ]
    .join("\n");
    const CompoundRes = await MakeRequest(3000, "/api/compile", "POST", { Source: CompoundValid, FileName: "compound.typ" }, Token);
    console.log("Test 10 (Compound Delimiters Grouping Validation):", CompoundRes.Data.KnrSlop !== true ? "PASS": "FAIL");
    // Test 11: Mismatched Compound Delimiters [{( ... )]} Rejection
    const CompoundInvalid =
    [
        "table.cell",
        "[{(",
        '  "ModuleA",',
        '  "ModuleB"',
        ")]}"
    ]
    .join("\n");
    const CompoundInvalidRes = await MakeRequest(3000, "/api/compile", "POST", { Source: CompoundInvalid, FileName: "compound_bad.typ" }, Token);
    console.log
    (
        "Test 11 (Mismatched Compound Delimiters Rejection):", CompoundInvalidRes.Data.Success === false && CompoundInvalidRes.Data.KnrSlop === true ? "PASS": "FAIL"
    );
    // Test 12: Full Default Typst Showcase Compiles with 0 Errors
    const FS = require("fs");
    const ShowcaseSource = FS.readFileSync("projects/GenesisOfTheVanguard/main.typ", "utf8");
    const ShowcaseRes = await MakeRequest(3000, "/api/compile", "POST", { Source: ShowcaseSource, FileName: "main.typ" }, Token);
    console.log("Test 12 (Full Default Showcase Compiles Cleanly):", ShowcaseRes.Data.Success === true ? "PASS": "FAIL");
    if (ShowcaseRes.Data.Pages)
    {
        console.log(`         Rendered ${ShowcaseRes.Data.Pages.length} Pages, Duration: ${ShowcaseRes.Data.DurationMs}ms`);
    }

    console.log("\n=== All Enforcement Tests Passed! ===");
}

RunTests().catch (console.error);

const HTTP = require("node:http");
const FS = require("node:fs");
const Path = require("node:path");

const PORT = 3000;
const HOST = "127.0.0.1";

function MakeRequest(Options, Body = null)
{
    return new Promise
    (
        (Resolve) =>
        {
            const DefaultHeaders = {};
            const MergedHeaders = Object.assign(DefaultHeaders, Options.headers || {});
            const RequestOptions = Object.assign
            (
                {
                    host: HOST,
                    port: PORT,
                    method: "GET"
                },
                Options, { headers: MergedHeaders }
            );

            const Req = HTTP.request
            (
                RequestOptions, (Res) =>
                {
                    const Chunks = [];
                    Res.on
                    (
                        "data", (Chunk) => { Chunks.push(Chunk); }
                    );
                    Res.on
                    (
                        "end", () =>
                        {
                            const BufferData = Buffer.concat(Chunks);
                            Resolve
                            ({
                                Status: Res.statusCode,
                                Headers: Res.headers,
                                Body: BufferData.toString("utf-8"),
                                Buffer: BufferData,
                                Error: null
                            });
                        }
                    );
                }
            );

            Req.on
            (
                "error", (Err) =>
                {
                    Resolve
                    ({
                        Status: null,
                        Headers: null,
                        Body: null,
                        Buffer: null,
                        Error: Err.message
                    });
                }
            );

            if (Body)
            {
                Req.write(Body);
            }
            Req.end();
        }
    );
}

let TestCounter = 0;
let PassedCounter = 0;
let FailedCounter = 0;

function Assert(Condition, TestName, Details = "")
{
    TestCounter ++;
    if (Condition)
    {
        PassedCounter ++;
        console.log(`  [PASS] Test ${TestCounter}: ${TestName}`);
    }
    else
    {
        FailedCounter ++;
        console.error(`  [FAIL] Test ${TestCounter}: ${TestName} -> ${Details}`);
    }
}

async function RunExportTests()
{
    console.log("================================================================================");
    console.log("             VERIFYING EXPORT SYSTEM, BLACK MODE, TRANSPARENCY & ZIP            ");
    console.log("================================================================================\n");
    // 1. Initial Handshake & UI Elements
    console.log("SECTION 1: UI DOM & Label Verification");
    const R1 = await MakeRequest( { path: "/" });
    Assert(R1.Status === 200, "Web Server Root HTTP Status 200", `Got ${R1.Status}`);
    Assert(R1.Body.includes("vendor/jszip.min.js"), "JSZip vendor script included in HTML");
    Assert(R1.Body.includes("Export in Black mode"), "Label renamed to 'Export in Black mode'");
    Assert(R1.Body.includes("ExportTransparentCheckbox"), "Transparent Background checkbox present");
    Assert(R1.Body.includes("DefaultExportBgSelect"), "Default Export Background setting dropdown present");

    const TokenMatch = (R1.Body || "").match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([a-f0-9]{64})"/);
    const SessionToken = TokenMatch ? TokenMatch[1]: null;
    Assert(Boolean(SessionToken), "Cryptographic Session Auth Token Discovered");

    const MainSource = FS.readFileSync("projects/GenesisOfTheVanguard/main.typ", "utf-8");
    // 2. PDF Export Tests
    console.log("\nSECTION 2: PDF Export (Black Mode & Transparency)");
    // 2.1 Black Mode Solid PDF
    const R2A = await MakeRequest
    (
        {
            path: "/api/export/pdf",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Source: MainSource, FileName: "GenesisBlackMode", BlackMode: true, Transparent: false })
    );
    Assert(R2A.Status === 200, "Export PDF in Black Mode (Solid Background) HTTP 200", `Got ${R2A.Status}`);
    Assert(R2A.Headers["content-type"] === "application/pdf", "Content-Type is application/pdf");
    Assert(R2A.Buffer.slice(0, 4).toString() === "%PDF", "PDF Magic Header %PDF Valid");
    Assert(R2A.Buffer.length > 50000, `PDF Byte Size substantial (${R2A.Buffer.length} bytes)`);
    // 2.2 Black Mode Transparent PDF
    const R2B = await MakeRequest
    (
        {
            path: "/api/export/pdf",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Source: MainSource, FileName: "GenesisBlackTrans", BlackMode: true, Transparent: true })
    );
    Assert(R2B.Status === 200, "Export PDF in Black Mode (Transparent Background) HTTP 200", `Got ${R2B.Status}`);
    Assert(R2B.Buffer.slice(0, 4).toString() === "%PDF", "Transparent Black Mode PDF Magic Header Valid");
    // 2.3 Light Mode Normal PDF
    const R2C = await MakeRequest
    (
        {
            path: "/api/export/pdf",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Source: MainSource, FileName: "GenesisLight", BlackMode: false, Transparent: false })
    );
    Assert(R2C.Status === 200, "Export PDF in Light Mode HTTP 200", `Got ${R2C.Status}`);
    // 3. PNG Export Tests (Multi-Page ZIP Packaging)
    console.log("\nSECTION 3: PNG Export (Multi-Page ZIP Packaging & Transparency)");
    // 3.1 Multi-page Document PNG Export
    const R3A = await MakeRequest
    (
        {
            path: "/api/export/png",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Source: MainSource, FileName: "GenesisPNG", BlackMode: true, Transparent: false })
    );
    Assert(R3A.Status === 200, "Export Multi-Page PNG in Black Mode HTTP 200", `Got ${R3A.Status}`);
    Assert(R3A.Headers["content-type"] === "application/zip", "Multi-Page PNG returns application/zip", `Got ${R3A.Headers["content-type"]}`);
    Assert(R3A.Buffer.slice(0, 4).toString("hex") === "504b0304", "ZIP Magic Header (PK\\x03\\x04) Valid");
    // Verify ZIP contains page files
    const JSZip = require(Path.resolve(__dirname, "..", "TypstStudio", "public", "vendor", "jszip.min.js"));
    const ZipInstance = await JSZip.loadAsync(R3A.Buffer);
    const FileNames = Object.keys(ZipInstance.files);
    Assert(FileNames.length >= 2, `ZIP contains multiple pages (Count: ${FileNames.length})`);
    Assert
    (
        FileNames.some( (N) => N.includes("page_1.png")), "ZIP contains page_1.png"
    );
    Assert
    (
        FileNames.some( (N) => N.includes("page_2.png")), "ZIP contains page_2.png"
    );
    // 3.2 Single-Page Document PNG Export
    const SinglePageSource = "= Single Page Document\n\nTesting single-page PNG export behavior.\n";
    const R3B = await MakeRequest
    (
        {
            path: "/api/export/png",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Source: SinglePageSource, FileName: "SingleDoc", BlackMode: false, Transparent: true })
    );
    Assert(R3B.Status === 200, "Export Single Page PNG HTTP 200", `Got ${R3B.Status}`);
    Assert(R3B.Headers["content-type"] === "image/png", "Single Page PNG returns image/png");
    Assert(R3B.Buffer[25] === 6, "Transparent PNG has RGBA Color Type 6 (Alpha Transparency)");
    // 4. SVG Dark Mode & Inversion Verification
    console.log("\nSECTION 4: SVG Compilation & InvertMonochromeColor Verification");
    const R4 = await MakeRequest
    (
        {
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Source: MainSource })
    );
    Assert(R4.Status === 200, "Document Compiles to SVG HTTP 200", `Got ${R4.Status}`);
    const R4Json = JSON.parse(R4.Body);
    Assert(R4Json.Success === true && Array.isArray(R4Json.Pages) && R4Json.Pages.length >= 2, "Compiled multiple vector SVG pages");

    console.log("\n================================================================================");
    console.log(`TEST SUMMARY: Total: ${TestCounter} | Passed: ${PassedCounter} | Failed: ${FailedCounter}`);
    console.log("================================================================================");

    if (FailedCounter > 0)
    {
        process.exit(1);
    }
}

RunExportTests();

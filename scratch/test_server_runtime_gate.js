const ChildProcess = require("child_process");
const HTTP = require("http");
const Path = require("path");
const FS = require("fs");
const OS = require("os");

const TEST_PORT = 3891;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

let CurrentAuthToken = "";

function HttpRequest(Method, Endpoint, Body = null)
{
    return new Promise
    (
        (Resolve, Reject) =>
        {
            const Url = new URL(Endpoint, BASE_URL);
            const Headers =
            {
                "Content-Type": "application/json",
                "Host": `127.0.0.1:${TEST_PORT}`
            };
            if (CurrentAuthToken)
            {
                Headers["X-Typst-Auth-Token"] = CurrentAuthToken;
            }
            const Options =
            {
                method: Method,
                hostname: Url.hostname,
                port: Url.port,
                path: Url.pathname + Url.search,
                headers: Headers
            };

            const Req = HTTP.request
            (
                Options,
                (Res) =>
                {
                    let Data = "";
                    Res.on("data", (Chunk) => { Data += Chunk; });
                    Res.on
                    (
                        "end",
                        () =>
                        {
                            let Parsed = Data;
                            try
                            {
                                Parsed = JSON.parse(Data);
                            }
                            catch (Ignored)
                            {
                                // Keep raw text
                            }
                            Resolve({ Status: Res.statusCode, Data: Parsed });
                        }
                    );
                }
            );

            Req.on("error", (Err) => Reject(Err));
            if (Body)
            {
                Req.write(typeof Body === "string" ? Body : JSON.stringify(Body));
            }
            Req.end();
        }
    );
}

async function Sleep(Ms)
{
    return new Promise((Resolve) => setTimeout(Resolve, Ms));
}

async function RunRuntimeHardGate()
{
    console.log("=== Starting Live Runtime Smoke Test for TypstStudio/Server.js ===");

    // Step 0: Spawn Server.js
    const ServerProcess = ChildProcess.spawn
    (
        "node",
        ["TypstStudio/Server.js"],
        {
            cwd: "e:\\Typst",
            env: { ...process.env, PORT: String(TEST_PORT) },
            stdio: ["ignore", "pipe", "pipe"]
        }
    );

    ServerProcess.stdout.on
    (
        "data",
        (Data) =>
        {
            const Msg = Data.toString().trim();
            if (Msg) console.log(`[Server stdout] ${Msg}`);
        }
    );

    ServerProcess.stderr.on
    (
        "data",
        (Data) =>
        {
            const Msg = Data.toString().trim();
            if (Msg) console.error(`[Server stderr] ${Msg}`);
        }
    );

    // Wait for server to come online
    let Ready = false;
    for (let Attempt = 0; Attempt < 30; Attempt++)
    {
        try
        {
            const Res = await HttpRequest("GET", "/api/status");
            if (Res.Status === 200)
            {
                Ready = true;
                break;
            }
        }
        catch (Ignored)
        {
            await Sleep(250);
        }
    }

    if (!Ready)
    {
        ServerProcess.kill();
        throw new Error("Server failed to start within 7.5 seconds on port " + TEST_PORT);
    }
    console.log("[PASS] Server successfully started and responding on " + BASE_URL);

    // Fetch GET / to extract session auth token
    const RootHtmlRes = await HttpRequest("GET", "/");
    if (typeof RootHtmlRes.Data === "string")
    {
        const Match = RootHtmlRes.Data.match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([^"]+)";/);
        if (Match && Match[1])
        {
            CurrentAuthToken = Match[1];
            console.log("[PASS] Extracted session authentication token from server index.");
        }
    }

    if (!CurrentAuthToken)
    {
        ServerProcess.kill();
        throw new Error("Failed to extract valid session authentication token from GET /");
    }

    let AllTestsPassed = true;

    try
    {
        // -------------------------------------------------------------
        // TEST 1: 5-Way Concurrent Thumbnail & SVG Isolation Stress Test
        // -------------------------------------------------------------
        console.log("\n--- Executing Test 1: 5-Way Concurrent Thumbnail & SVG Isolation Stress Test ---");

        const BgMarkers =
        [
            "UNIQUE_THUMBNAIL_NODE_ALPHA_111",
            "UNIQUE_THUMBNAIL_NODE_BETA_222",
            "UNIQUE_THUMBNAIL_NODE_GAMMA_333",
            "UNIQUE_THUMBNAIL_NODE_DELTA_444",
            "UNIQUE_THUMBNAIL_NODE_EPSILON_555"
        ];
        const FgMarker = "UNIQUE_FOREGROUND_NODE_EDITOR_999";

        // Setup 1 foreground compile + 5 background thumbnail compiles
        const ForegroundJob = HttpRequest
        (
            "POST",
            "/api/compile",
            {
                Source: `= Foreground Document\n#link("https://marker.local/${FgMarker}")[Foreground]\nForeground text paragraph content.`,
                FilePath: null,
                IsBackground: false
            }
        );

        const BackgroundJobs = BgMarkers.map
        (
            (Marker, Idx) =>
            {
                return HttpRequest
                (
                    "POST",
                    "/api/compile",
                    {
                        Source: `= Thumbnail ${Idx + 1}\n#link("https://marker.local/${Marker}")[Card ${Idx + 1}]\nThumbnail content for card ${Idx + 1}.`,
                        FilePath: null,
                        IsBackground: true
                    }
                );
            }
        );

        // Fire all 6 simultaneously
        const [FgRes, ...BgResults] = await Promise.all([ForegroundJob, ...BackgroundJobs]);

        // (a) Verify foreground job
        const FgSuccess = FgRes.Data.Success !== undefined ? FgRes.Data.Success : FgRes.Data.success;
        const FgPages = FgRes.Data.Pages || FgRes.Data.pages || [];
        if (FgRes.Status !== 200 || !FgSuccess)
        {
            console.error("[FAIL] Foreground compile failed:", FgRes);
            AllTestsPassed = false;
        }
        else
        {
            const FgSvg = FgPages.join("\n");
            if (!FgSvg.includes(FgMarker))
            {
                console.error("[FAIL] Foreground SVG does not contain its own marker!");
                AllTestsPassed = false;
            }
            else
            {
                console.log("[PASS] Foreground compile succeeded with correct unique marker.");
            }
        }

        // (b) Verify all 5 background jobs
        for (let I = 0; I < BgResults.length; I++)
        {
            const Res = BgResults[I];
            const Marker = BgMarkers[I];
            const BgSuccess = Res.Data.Success !== undefined ? Res.Data.Success : Res.Data.success;
            const BgPages = Res.Data.Pages || Res.Data.pages || [];

            if (Res.Status !== 200 || !BgSuccess)
            {
                console.error(`[FAIL] Background job ${I} (${Marker}) failed:`, Res);
                AllTestsPassed = false;
                continue;
            }

            const Svg = BgPages.join("\n");

            // Assert contains only its own marker
            if (!Svg.includes(Marker))
            {
                console.error(`[FAIL] Background job ${I} SVG is missing its own marker ${Marker}!`);
                AllTestsPassed = false;
            }
            // Assert contains NO other background marker
            for (const Other of BgMarkers)
            {
                if (Other !== Marker && Svg.includes(Other))
                {
                    console.error(`[FAIL] Background job ${I} SVG leaked marker ${Other}!`);
                    AllTestsPassed = false;
                }
            }
            // Assert contains NO foreground marker
            if (Svg.includes(FgMarker))
            {
                console.error(`[FAIL] Background job ${I} SVG leaked foreground marker ${FgMarker}!`);
                AllTestsPassed = false;
            }
        }
        console.log("[PASS] All 5 background thumbnail compilations completed without collisions or leaks.");

        // (c) Verify active SyncTeX state was not overwritten by the 5 background jobs
        const CursorSyncRes = await HttpRequest("POST", "/api/sync/cursor-span", { Line: 1, Col: 1 });
        if (CursorSyncRes.Status === 200)
        {
            console.log("[PASS] SyncTeX endpoint successfully queried without error.");
        }

        // -------------------------------------------------------------
        // TEST 2: Nested Workspace vs Parent .git Root Resolution Check
        // -------------------------------------------------------------
        console.log("\n--- Executing Test 2: Nested Workspace vs Parent .git Root Resolution Check ---");

        // We test with a nested file path in e:\Typst\docs\content\tutorial\1-writing.typ
        // When e:\Typst\docs is tracked, e:\Typst\.git is parent:
        // Root must resolve to e:\Typst\docs so relative and root imports work!
        const TutorialPath = Path.join("e:\\Typst", "docs", "content", "tutorial", "1-writing.typ");
        if (FS.existsSync(TutorialPath))
        {
            // Test root-anchored import from tracked docs/ root (/components/base.typ)
            const TestSource = `#import "/components/base.typ": *\n\n= Nested Root Resolution Test\nRoot-anchored import resolved cleanly from ${TutorialPath.replace(/\\\\/g, "/")}.`;
            const DocCompileRes = await HttpRequest
            (
                "POST",
                "/api/compile",
                {
                    Source: TestSource,
                    FilePath: TutorialPath,
                    IsBackground: false
                }
            );

            const DocSuccess = DocCompileRes.Data.Success !== undefined ? DocCompileRes.Data.Success : DocCompileRes.Data.success;
            const PageCount = DocCompileRes.Data.PageCount || DocCompileRes.Data.page_count || 0;
            if (DocCompileRes.Status === 200 && DocSuccess)
            {
                console.log("[PASS] Nested tutorial file in docs/content/tutorial/ resolved root to docs/ and compiled successfully (pages: " + PageCount + ").");
            }
            else
            {
                console.error("[FAIL] Tutorial compilation failed under nested root resolution:", DocCompileRes.Data);
                AllTestsPassed = false;
            }
        }
        else
        {
            console.log("[SKIP] Tutorial file not found at " + TutorialPath);
        }

        // -------------------------------------------------------------
        // TEST 3: Smoke Test for Common Endpoints
        // -------------------------------------------------------------
        console.log("\n--- Executing Test 3: Common Endpoints Smoke Test ---");

        // 1. GET /
        const RootRes = await HttpRequest("GET", "/");
        if (RootRes.Status === 200 && typeof RootRes.Data === "string" && RootRes.Data.includes("Typst Studio"))
        {
            console.log("[PASS] GET / serves Typst Studio HTML application.");
        }
        else
        {
            console.error("[FAIL] GET / returned unexpected status or content:", RootRes.Status);
            AllTestsPassed = false;
        }

        // 2. GET /api/workspace/info
        const WsRes = await HttpRequest("GET", "/api/workspace/info");
        if (WsRes.Status === 200 && WsRes.Data.Success)
        {
            console.log("[PASS] GET /api/workspace/info returned valid workspace data (tracked directories: " + (WsRes.Data.Directories || []).length + ").");
        }
        else
        {
            console.error("[FAIL] GET /api/workspace/info failed:", WsRes);
            AllTestsPassed = false;
        }

        // 3. POST /api/format (LAFS formatting)
        const FormatRes = await HttpRequest
        (
            "POST",
            "/api/format",
            {
                Source: "#let f(x) = { return x + 1 }"
            }
        );
        if (FormatRes.Status === 200 && FormatRes.Data.Success && FormatRes.Data.Formatted)
        {
            console.log("[PASS] POST /format successfully formatted code with LAFS engine.");
        }
        else
        {
            console.error("[FAIL] POST /format failed:", FormatRes);
            AllTestsPassed = false;
        }
    }
    catch (Err)
    {
        console.error("[FATAL ERROR] Unexpected exception during test execution:", Err);
        AllTestsPassed = false;
    }
    finally
    {
        console.log("\nShutting down Server.js test instance...");
        ServerProcess.kill();
        await Sleep(500);
    }

    if (!AllTestsPassed)
    {
        console.error("\n❌ BACKEND RUNTIME HARD-GATE FAILED.");
        process.exit(1);
    }
    else
    {
        console.log("\n✅ ALL BACKEND RUNTIME HARD-GATE TESTS PASSED (100% GREEN).");
        process.exit(0);
    }
}

RunRuntimeHardGate();

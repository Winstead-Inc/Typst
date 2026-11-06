const ChildProcess = require("node:child_process");
const HTTP = require("node:http");

const TEST_PORT = 3199;

const ServerProcess = ChildProcess.spawn
(
    "node",["TypstStudio/Server.js"],
    {
        env: { ...process.env, PORT: TEST_PORT.toString() },
        stdio:["pipe", "pipe", "pipe"]
    }
);

ServerProcess.stderr.on
(
    "data", (D) =>
    {
        console.error("Server stderr:", D.toString());
    }
);

function HttpRequest(Method, Path, Headers = {}, Body = null)
{
    return new Promise
    (
        (Resolve, Reject) =>
        {
            const Opts =
            {
                hostname: "127.0.0.1",
                port: TEST_PORT,
                path: Path,
                method: Method,
                headers: Headers
            };

            const Req = HTTP.request
            (
                Opts, (Res) =>
                {
                    let Data = "";
                    Res.on("data", (Chunk) => { Data += Chunk; });
                    Res.on
                    (
                        "end", () =>
                        {
                            try
                            {
                                Resolve
                                ({
                                    Status: Res.statusCode, Body: JSON.parse(Data)
                                });
                            }
                            catch (Err)
                            {
                                Resolve( { Status: Res.statusCode, Body: Data });
                            }
                        }
                    );
                }
            );

            Req.on("error", Reject);
            if (Body)
            {
                Req.write(typeof Body === "string" ? Body: JSON.stringify(Body));
            }
            Req.end();
        }
    );
}

async function RunVerification()
{
    // Wait 1 second for server to bind
    await new Promise( (R) => setTimeout(R, 1000));

    console.log("1. Fetching session auth token...");
    const AuthRes = await HttpRequest("GET", "/api/auth/token");
    console.log("   Auth response status:", AuthRes.Status);
    const Token = AuthRes.Body.Token;
    if (!Token)
    {
        throw new Error("Failed to get auth token");
    }
    console.log("   ✓ Acquired Auth Token");

    console.log("2. Compiling document via /api/compile...");
    const CompilePayload =
    {
        Source: "= Title\nThis is line two with *strong* text.\n$a^2 + b^2 = c^2$\n",
        FileName: "main.typ"
    };

    const CompileRes = await HttpRequest
    (
        "POST", "/api/compile",
        {
            "Content-Type": "application/json",
            "X-Typst-Auth-Token": Token
        },
        CompilePayload
    );

    console.log("   Compile status:", CompileRes.Status);
    console.log("   Compile success:", CompileRes.Body.Success);
    console.log("   Pages count:", CompileRes.Body.PageCount);
    const SpanMap = CompileRes.Body.SpanMap || {};
    const SpanKeys = Object.keys(SpanMap);
    console.log("   SpanMap entries count:", SpanKeys.length);

    if (SpanKeys.length === 0)
    {
        throw new Error("SpanMap was empty in /api/compile response!");
    }
    console.log("   ✓ SpanMap returned in compile response");

    const SampleSpan = SpanKeys[0];
    const SampleLoc = SpanMap[SampleSpan];
    console.log(`3. Testing /api/sync/resolve-span for span '${SampleSpan}'...`);
    const ResolveRes = await HttpRequest
    (
        "POST", "/api/sync/resolve-span",
        {
            "Content-Type": "application/json",
            "X-Typst-Auth-Token": Token
        },
        { Span: SampleSpan }
    );

    console.log("   Resolve status:", ResolveRes.Status);
    console.log("   Resolved position:", `Line ${ResolveRes.Body.Line}, Col ${ResolveRes.Body.Column}`);
    if (ResolveRes.Body.Line !== SampleLoc.line || ResolveRes.Body.Column !== SampleLoc.col)
    {
        throw new Error("Resolved position mismatch!");
    }
    console.log("   ✓ /api/sync/resolve-span returned matching coordinates");

    console.log("4. Testing /api/sync/cursor-span for Line 2, Column 5...");
    const CursorRes = await HttpRequest
    (
        "POST", "/api/sync/cursor-span",
        {
            "Content-Type": "application/json",
            "X-Typst-Auth-Token": Token
        },
        { Line: 2, Column: 5 }
    );

    console.log("   Cursor status:", CursorRes.Status);
    console.log("   Matched span:", CursorRes.Body.Span);
    console.log("   Span target line:", CursorRes.Body.line);
    if (!CursorRes.Body.Span)
    {
        throw new Error("Failed to find span at cursor");
    }
    console.log("   ✓ /api/sync/cursor-span returned matching span");

    console.log("\nALL STEP 2 BACKEND VERIFICATIONS PASSED SUCCESSFULLY!");
}

RunVerification()
.catch
(
    (Err) =>
    {
        console.error("Test failed with error:", Err);
        process.exitCode = 1;
    }
)
.finally
(
    () =>
    {
        ServerProcess.kill();
        process.exit();
    }
);

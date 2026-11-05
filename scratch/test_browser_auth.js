const HTTP = require("node:http");

async function TestBrowserFlow()
{
    console.log("=== Testing Browser Client Authentication Flow ===");

    // Step 1: Client loads / (Index.html) and extracts injected token
    const Html = await new Promise((Resolve) =>
    {
        HTTP.get("http://127.0.0.1:3000/", (Res) =>
        {
            let Data = "";
            Res.on("data", (C) => Data += C);
            Res.on("end", () => Resolve(Data));
        });
    });

    const TokenMatch = Html.match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([^"]+)"/);
    if (!TokenMatch)
    {
        console.error("FAIL: window.__TYPST_STUDIO_AUTH_TOKEN__ not found in Index.html");
        process.exit(1);
    }

    const Token = TokenMatch[1];
    console.log("Extracted Token from HTML:", Token.slice(0, 16) + "...");

    // Step 2: TriggerCompileNow calls /api/compile with x-typst-auth-token
    const Payload = JSON.stringify({ Source: "#set page(paper: \"a4\")\n\n= Ready\n\nClient compile test." });

    const CompileRes = await new Promise((Resolve) =>
    {
        const Req = HTTP.request
        (
            "http://127.0.0.1:3000/api/compile",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(Payload),
                    "x-typst-auth-token": Token
                }
            },
            (Res) =>
            {
                let Data = "";
                Res.on("data", (C) => Data += C);
                Res.on("end", () => Resolve({ Status: Res.statusCode, Data: JSON.parse(Data) }));
            }
        );
        Req.write(Payload);
        Req.end();
    });

    if (CompileRes.Status === 200 && CompileRes.Data.Success)
    {
        console.log("SUCCESS: /api/compile returned HTTP 200 and compiled cleanly!");
        console.log(`Rendered ${CompileRes.Data.Pages ? CompileRes.Data.Pages.length : 1} page(s) in ${CompileRes.Data.DurationMs}ms.`);
    }
    else
    {
        console.error("FAIL: /api/compile error:", CompileRes);
        process.exit(1);
    }
}

TestBrowserFlow().catch((Err) =>
{
    console.error(Err);
    process.exit(1);
});


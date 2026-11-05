const HTTP = require("node:http");

function MakeRequest(Options, Body)
{
    return new Promise
    (
        (Resolve) =>
        {
            const Req = HTTP.request
            (
                Options,
                (Res) =>
                {
                    let Data = "";
                    Res.on("data", (Chunk) => { Data += Chunk; });
                    Res.on("end", () => { Resolve({ Status: Res.statusCode, Headers: Res.headers, Body: Data }); });
                }
            );
            Req.on("error", (Err) => { Resolve({ Error: Err.message }); });
            if (Body) { Req.write(Body); }
            Req.end();
        }
    );
}

async function RunTests()
{
    console.log("=== SECURITY HARDENING VERIFICATION SUITE ===\n");

    console.log("--- TEST 1: GET / (Check Security Headers & Token Injection) ---");
    const R1 = await MakeRequest({ host: "127.0.0.1", port: 3000, path: "/", method: "GET" });
    console.log("HTTP Status:", R1.Status);
    console.log("X-Frame-Options:", R1.Headers["x-frame-options"]);
    console.log("X-Content-Type-Options:", R1.Headers["x-content-type-options"]);
    console.log("Content-Security-Policy:", R1.Headers["content-security-policy"] ? "Present" : "Missing");
    const TokenMatch = R1.Body.match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([a-f0-9]+)"/);
    const Token = TokenMatch ? TokenMatch[1] : null;
    console.log("Auth Token Injected:", Token ? `YES (${Token.substring(0, 8)}...)` : "NO");

    console.log("\n--- TEST 2: DNS Rebinding / Host Header Spoofing ---");
    const R2 = await MakeRequest
    ({
        host: "127.0.0.1",
        port: 3000,
        path: "/api/status",
        method: "GET",
        headers: { "Host": "evil-attacker.example.com" }
    });
    console.log("Spoofed Host Status:", R2.Status, "(Expected: 400 Bad Request)");

    console.log("\n--- TEST 3: Unauthenticated State Mutation (CSRF Attempt) ---");
    const R3 = await MakeRequest
    (
        {
            host: "127.0.0.1",
            port: 3000,
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        JSON.stringify({ Source: "= Test" })
    );
    console.log("CSRF Compile Status:", R3.Status, "(Expected: 403 Forbidden)");

    console.log("\n--- TEST 4: Out-of-Bounds Path Traversal (Arbitrary File Read) ---");
    const R4 = await MakeRequest
    ({
        host: "127.0.0.1",
        port: 3000,
        path: "/api/workspace/file?path=C%3A%5CWindows%5Cwin.ini",
        method: "GET",
        headers: { "X-Typst-Auth-Token": Token }
    });
    console.log("Arbitrary File Read Status:", R4.Status, "(Expected: 403 Forbidden)");
    console.log("Response Body:", R4.Body);

    console.log("\n--- TEST 5: Out-of-Bounds Path Traversal (Arbitrary File Write) ---");
    const R5 = await MakeRequest
    (
        {
            host: "127.0.0.1",
            port: 3000,
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": Token }
        },
        JSON.stringify({ Path: "C:\\evil.bat", Content: "malicious" })
    );
    console.log("Arbitrary File Write Status:", R5.Status, "(Expected: 403 Forbidden)");
    console.log("Response Body:", R5.Body);

    console.log("\n--- TEST 6: Static File Traversal Attempt ---");
    const R6 = await MakeRequest
    ({
        host: "127.0.0.1",
        port: 3000,
        path: "/../../Server.js",
        method: "GET"
    });
    console.log("Static Traversal Status:", R6.Status, "(Expected: 403 or 404)");

    console.log("\n--- TEST 7: Legitimate Compilation with Auth Token ---");
    const R7 = await MakeRequest
    (
        {
            host: "127.0.0.1",
            port: 3000,
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": Token }
        },
        JSON.stringify({ Source: "= Security Hardening Complete\nTypst Studio is secure." })
    );
    console.log("Legitimate Compile Status:", R7.Status, "(Expected: 200 OK)");
    console.log("Full Response Body:", R7.Body);

    console.log("\n=== ALL SECURITY VERIFICATION TESTS COMPLETE ===");
}

RunTests();

const HTTP = require("node:http");
const Path = require("node:path");
const FS = require("node:fs");

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
                    let ResponseData = "";
                    Res.on("data", (Chunk) => { ResponseData += Chunk; });
                    Res.on
                    (
                        "end", () =>
                        {
                            Resolve
                            ({
                                Status: Res.statusCode,
                                Headers: Res.headers,
                                Body: ResponseData,
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

async function RunBattleTest()
{
    console.log("================================================================================");
    console.log("             TYPST STUDIO SECURITY BATTLE-TEST & HARDENING VERIFICATION         ");
    console.log("================================================================================\n");
    // 1. Initial Handshake & Token Discovery
    console.log("SECTION 1: Security Headers & Session Token Injection");
    const R1 = await MakeRequest( { path: "/" });
    Assert(R1.Status === 200, "Web Server Root HTTP Status 200", `Got ${R1.Status}`);
    Assert(R1.Headers["x-content-type-options"] === "nosniff", "X-Content-Type-Options: nosniff present");
    Assert(R1.Headers["x-frame-options"] === "DENY", "X-Frame-Options: DENY present");
    Assert(R1.Headers["referrer-policy"] === "no-referrer", "Referrer-Policy: no-referrer present");
    Assert
    (
        R1.Headers["content-security-policy"] && R1.Headers["content-security-policy"].includes("frame-ancestors 'none'"),
        "Content-Security-Policy contains frame-ancestors 'none'"
    );

    const TokenMatch = (R1.Body || "").match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([a-f0-9]{64})"/);
    const SessionToken = TokenMatch ? TokenMatch[1]: null;
    Assert(Boolean(SessionToken), "Cryptographically Secure 64-char Session Token Injected in HTML");
    // 2. DNS Rebinding & Host Header Validation
    console.log("\nSECTION 2: DNS Rebinding & Host Header Poisoning (RFC 2616 / OWASP A01)");
    const R2A = await MakeRequest
    ({
        path: "/api/status",
        headers: { "Host": "evil-attacker.example.com" }
    });
    Assert(R2A.Status === 400, "Reject External Host Header with 400 Bad Request", `Got ${R2A.Status}`);

    const R2B = await MakeRequest
    ({
        path: "/api/status",
        headers: { "Host": "localhost:3000" }
    });
    Assert(R2B.Status === 200, "Accept Whitelisted localhost:3000 Host Header", `Got ${R2B.Status}`);
    // 3. CSRF & State Mutation Protection
    console.log("\nSECTION 3: CSRF & Unauthorized State Mutation Protection");
    const R3A = await MakeRequest
    (
        {
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        JSON.stringify( { Source: "= Unauthorized Attack Document" })
    );
    Assert(R3A.Status === 403, "Reject Compilation without Auth Token with 403 Forbidden", `Got ${R3A.Status}`);

    const R3B = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json" }
        },
        JSON.stringify( { Path: "C:\\evil.typ", Content: "pwn" })
    );
    Assert(R3B.Status === 403, "Reject File Write without Auth Token with 403 Forbidden", `Got ${R3B.Status}`);

    const R3C = await MakeRequest
    ({
        path: "/api/workspace/file?path=C%3A%5Cevil.typ",
        method: "DELETE"
    });
    Assert(R3C.Status === 403, "Reject File Deletion without Auth Token with 403 Forbidden", `Got ${R3C.Status}`);
    // 4. Token Theft & Cross-Site Origin / Referer Validation
    console.log("\nSECTION 4: Cross-Site Token Theft Defense (/api/auth/token)");
    const R4A = await MakeRequest
    ({
        path: "/api/auth/token",
        headers: { "Sec-Fetch-Site": "cross-site" }
    });
    Assert(R4A.Status === 403, "Reject cross-site Sec-Fetch-Site with 403 Forbidden", `Got ${R4A.Status}`);

    const R4B = await MakeRequest
    ({
        path: "/api/auth/token",
        headers: { "Origin": "http://evil-tracker.attacker.com" }
    });
    Assert(R4B.Status === 403, "Reject untrusted Origin with 403 Forbidden", `Got ${R4B.Status}`);

    const R4C = await MakeRequest
    ({
        path: "/api/auth/token",
        headers: { "Referer": "http://evil-tracker.attacker.com/malicious.html" }
    });
    Assert(R4C.Status === 403, "Reject untrusted Referer with 403 Forbidden", `Got ${R4C.Status}`);

    const R4D = await MakeRequest
    ({
        path: "/api/auth/token",
        method: "POST"
    });
    Assert(R4D.Status === 405, "Reject Non-GET/HEAD Token Request with 405 Method Not Allowed", `Got ${R4D.Status}`);
    // 5. Workspace Metadata Information Disclosure
    console.log("\nSECTION 5: Information Disclosure - Workspace Architecture");
    const R5A = await MakeRequest( { path: "/api/workspace/info" });
    Assert(R5A.Status === 403, "Protect /api/workspace/info from Unauthenticated Snooping", `Got ${R5A.Status}`);

    const R5B = await MakeRequest
    ({
        path: "/api/workspace/info",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R5B.Status === 200, "Allow Authorized /api/workspace/info with Session Token", `Got ${R5B.Status}`);
    // 6. Directory Traversal & Out-of-Bounds File Read
    console.log("\nSECTION 6: Path Traversal - Arbitrary File Read (CWE-22)");
    const R6A = await MakeRequest
    ({
        path: "/api/workspace/file?path=C%3A%5CWindows%5Cwin.ini",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R6A.Status === 403, "Block Reading C:\\Windows\\win.ini with 403 Forbidden", `Got ${R6A.Status}`);

    const R6B = await MakeRequest
    ({
        path: "/api/workspace/file?path=%2E%2E%2F%2E%2E%2FServer.js",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R6B.Status === 403, "Block Reading Traversing Parent Path with 403 Forbidden", `Got ${R6B.Status}`);
    // 7. Arbitrary File Write & System File Integrity Protection
    console.log("\nSECTION 7: Arbitrary File Write, RCE Extensions & System File Overwrite");
    const R7A = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Path: "C:\\evil.bat", Content: "calc.exe" })
    );
    Assert(R7A.Status === 403, "Block Writing to C:\\evil.bat with 403 Forbidden", `Got ${R7A.Status}`);

    const R7B = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.resolve(__dirname, "..", "TypstStudio", "Server.js"), Content: "// corrupted"
        })
    );
    Assert(R7B.Status === 403, "Block Overwriting Server.js (Protected System File)", `Got ${R7B.Status}`);

    const R7C = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.resolve(__dirname, "..", "TypstStudio", ".workspace_config.json"), Content: "{}"
        })
    );
    Assert(R7C.Status === 403, "Block Overwriting .workspace_config.json (Protected System File)", `Got ${R7C.Status}`);
    // 8. Arbitrary File Deletion & Forbidden Extension Protection
    console.log("\nSECTION 8: Arbitrary File Deletion & System File Preservation");
    const R8A = await MakeRequest
    ({
        path: `/api/workspace/file?path=${encodeURIComponent(Path.resolve(__dirname, "..", "TypstStudio", "Server.js"))}`,
        method: "DELETE",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R8A.Status === 403, "Block Deleting Server.js with 403 Forbidden", `Got ${R8A.Status}`);

    const R8B = await MakeRequest
    ({
        path: `/api/workspace/file?path=${encodeURIComponent("C:\\Windows\\System32\\cmd.exe")}`,
        method: "DELETE",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R8B.Status === 403, "Block Deleting External Executable with 403 Forbidden", `Got ${R8B.Status}`);
    // 9. Static File Serving & Directory Stream Error Handling
    console.log("\nSECTION 9: Static File Traversal & Directory Stream EISDIR Immunity");
    const R9A = await MakeRequest( { path: "/../../Server.js" });
    Assert(R9A.Status === 403 || R9A.Status === 404, "Block Static File Path Traversal with 403 or 404", `Got ${R9A.Status}`);

    const R9A2 = await MakeRequest( { path: "/%2e%2e/%2e%2e/Server.js" });
    Assert(R9A2.Status === 403 || R9A2.Status === 404, "Block Encoded Static File Traversal with 403 or 404", `Got ${R9A2.Status}`);

    const R9B = await MakeRequest( { path: "/fonts" });
    Assert(R9B.Status === 403, "Block Directory Listing on /fonts (Prevent EISDIR Stream Crash)", `Got ${R9B.Status}`);
    // 10. Font File Boundary Escape
    console.log("\nSECTION 10: Font File Traversal & Boundary Containment (/api/font-file)");
    const R10A = await MakeRequest( { path: "/api/font-file?path=C%3A%5CWindows%5Cwin.ini" });
    Assert(R10A.Status === 403, "Block Non-Font File Extension in /api/font-file", `Got ${R10A.Status}`);

    const R10B = await MakeRequest( { path: "/api/font-file?path=C%3A%5CWindows%5CSystem32%5Cfake.ttf" });
    Assert(R10B.Status === 403, "Block Font File Outside Approved Directories", `Got ${R10B.Status}`);

    const R10C = await MakeRequest( { path: "/api/font-file?path=C%3A%5CWindows%5CFonts" });
    Assert(R10C.Status === 403, "Block Directory Target in /api/font-file", `Got ${R10C.Status}`);

    const R10D = await MakeRequest( { path: "/api/font-file?path=C%3A%5CWindows%5CFonts%5Carial.ttf" });
    Assert(R10D.Status === 200 || R10D.Status === 404, "Legitimate Font Handled Appropriately (200 or 404 if not present)", `Got ${R10D.Status}`);
    // 11. DoS Mitigation - Body Payload Limit (10 MB Limit)
    console.log("\nSECTION 11: DoS Mitigation - 10 MB Payload Truncation / Destruction");
    const LargePayload = Buffer.alloc(11 * 1024 * 1024, "A").toString();
    const R11 = await MakeRequest
    (
        {
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        LargePayload
    );
    Assert
    (
        R11.Error !== null || R11.Status === 500,
        "Payload exceeding 10 MB rejected / connection reset safely",
        `Status: ${R11.Status}, Error: ${R11.Error}`
    );
    // 12. Typst Compiler Sandboxing (--root project boundary)
    console.log("\nSECTION 12: Typst Engine Sandboxing & Out-of-Root Read Defense");
    const R12 = await MakeRequest
    (
        {
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Source: '#read("../../win.ini")\n\n= Sandboxed Heading\n'
        })
    );
    Assert(R12.Status === 200, "Compile request handled cleanly", `Got ${R12.Status}`);
    let R12Json = {};
    try { R12Json = JSON.parse(R12.Body); }
    catch (E) {}
    Assert
    (
        R12Json.Success === false &&
        (
            (R12Json.Error || "").toLowerCase().includes("root") || (R12Json.Error || "").toLowerCase().includes("sandbox")
        ),
        "Typst engine strictly enforces --root sandbox (denies reading files outside root)",
        `Result Error: ${R12Json.Error}`
    );
    // 13. End-to-End Legitimate Workflow Verification
    console.log("\nSECTION 13: End-to-End Legitimate Workflow Lifecycle");
    const WorkspaceInfo = JSON.parse(R5B.Body);
    const TargetTrackedDir = (WorkspaceInfo.Directories && WorkspaceInfo.Directories.length > 0)
    ? WorkspaceInfo.Directories[0]
    : process.cwd();
    // 13.1 Create legitimate document
    const R13Create = await MakeRequest
    (
        {
            path: "/api/workspace/create",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Directory: TargetTrackedDir,
            FileName: "SecurityBattleTestDoc.typ",
            Content: "= Security Battle Test Document\n\nAll defensive perimeters validated successfully.\n"
        })
    );
    Assert(R13Create.Status === 200, "Create legitimate test document SecurityBattleTestDoc.typ", `Got ${R13Create.Status}`);
    // 13.2 Compile legitimate document
    const R13Compile = await MakeRequest
    (
        {
            path: "/api/compile",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Source: "= Security Battle Test Document\n\nAll defensive perimeters validated successfully.\n"
        })
    );
    let R13CompileJson = {};
    try { R13CompileJson = JSON.parse(R13Compile.Body); }
    catch (E) {}
    Assert(R13CompileJson.Success === true && Array.isArray(R13CompileJson.Pages), "Legitimate Document Compiles to Vector SVG with Page Array");
    // 13.3 Clean up / Delete legitimate test document
    const CreatedDocPath = Path.join(TargetTrackedDir, "SecurityBattleTestDoc.typ");
    const R13Delete = await MakeRequest
    ({
        path: `/api/workspace/file?path=${encodeURIComponent(CreatedDocPath)}`,
        method: "DELETE",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R13Delete.Status === 200, "Clean up and delete SecurityBattleTestDoc.typ via authenticated API", `Got ${R13Delete.Status}`);
    // 14. Remote Code Execution (RCE) & Arbitrary Code Execution (ACE) Prevention
    console.log("\nSECTION 14: Remote Code Execution (RCE) & Arbitrary Code Execution (ACE) Prevention");
    // 14.1 Block adding User Home Directory
    const OS = require("node:os");
    const UserHomeDir = OS.homedir();
    const R14A = await MakeRequest
    (
        {
            path: "/api/workspace/directory",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Path: UserHomeDir })
    );
    Assert(R14A.Status === 403, "Block Adding User Home Directory Root with 403 Forbidden", `Got ${R14A.Status}`);
    // 14.2 Block adding sensitive credential directory (.ssh)
    const SshPath = Path.join(UserHomeDir, ".ssh");
    const R14B = await MakeRequest
    (
        {
            path: "/api/workspace/directory",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Path: SshPath })
    );
    Assert(R14B.Status === 400 || R14B.Status === 403, "Block Adding .ssh Directory with 400 or 403 Forbidden", `Got ${R14B.Status}`);
    // 14.3 Block adding Windows Startup / Autostart folder
    const StartupFolder = process.platform === "win32"
    ? Path.join(UserHomeDir, "AppData", "Roaming", "Microsoft", "Windows", "Start Menu", "Programs", "Startup")
    : "/etc/init.d";
    const R14C = await MakeRequest
    (
        {
            path: "/api/workspace/directory",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Path: StartupFolder })
    );
    Assert(R14C.Status === 400 || R14C.Status === 403, "Block Adding System Startup Folder with 400 or 403 Forbidden", `Got ${R14C.Status}`);
    // 14.4 Block adding OS System Root (Windows / etc)
    const SysRoot = process.platform === "win32" ? "C:\\Windows": "/etc";
    const R14D = await MakeRequest
    (
        {
            path: "/api/workspace/directory",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify( { Path: SysRoot })
    );
    Assert(R14D.Status === 403, "Block Adding OS System Root with 403 Forbidden", `Got ${R14D.Status}`);
    // 14.5 Block writing Python script (.py)
    const R14E = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "malicious.py"), Content: "import os; os.system('calc')"
        })
    );
    Assert(R14E.Status === 403, "Block Writing Python Script (.py) with 403 Forbidden", `Got ${R14E.Status}`);
    // 14.6 Block writing JavaScript payload (.js)
    const R14F = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "payload.js"), Content: "require('child_process').exec('calc')"
        })
    );
    Assert(R14F.Status === 403, "Block Writing JavaScript Payload (.js) with 403 Forbidden", `Got ${R14F.Status}`);
    // 14.7 Block writing Windows Shortcut (.lnk)
    const R14G = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "exploit.lnk"), Content: "shortcut data"
        })
    );
    Assert(R14G.Status === 403, "Block Writing Shortcut File (.lnk) with 403 Forbidden", `Got ${R14G.Status}`);
    // 14.8 Block writing Unix Shell Script (.sh)
    const R14H = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "backdoor.sh"), Content: "#!/bin/bash\nrm -rf /"
        })
    );
    Assert(R14H.Status === 403, "Block Writing Shell Script (.sh) with 403 Forbidden", `Got ${R14H.Status}`);
    // 14.9 Block writing VBScript (.vbs)
    const R14I = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "agent.vbs"), Content: "MsgBox 'pwned'"
        })
    );
    Assert(R14I.Status === 403, "Block Writing VBScript (.vbs) with 403 Forbidden", `Got ${R14I.Status}`);
    // 14.10 Block writing with NTFS Alternate Data Stream (:evil.bat)
    const R14J = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "doc.typ:evil.bat"), Content: "calc.exe"
        })
    );
    Assert(R14J.Status === 403, "Block Writing NTFS Alternate Data Stream (:evil.bat) with 403 Forbidden", `Got ${R14J.Status}`);
    // 14.11 Block writing with Alternate Data Stream (::$DATA)
    const R14K = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, "malicious.bat::$DATA"), Content: "calc.exe"
        })
    );
    Assert(R14K.Status === 403, "Block Writing Alternate Data Stream (::$DATA) with 403 Forbidden", `Got ${R14K.Status}`);
    // 14.12 Block writing .env protected system file
    const R14L = await MakeRequest
    (
        {
            path: "/api/workspace/file",
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Typst-Auth-Token": SessionToken }
        },
        JSON.stringify
        ({
            Path: Path.join(TargetTrackedDir, ".env"), Content: "SECRET=exposed"
        })
    );
    Assert(R14L.Status === 403, "Block Writing .env Protected System File with 403 Forbidden", `Got ${R14L.Status}`);
    // 14.13 Block reading .env or Server.js via document read API
    const R14M = await MakeRequest
    ({
        path: `/api/workspace/file?path=${encodeURIComponent(Path.join(TargetTrackedDir, ".env"))}`,
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R14M.Status === 403, "Block Reading .env Configuration File with 403 Forbidden", `Got ${R14M.Status}`);
    // 14.14 Verify Font Listing via execFile works safely without shell
    const R14N = await MakeRequest
    ({
        path: "/api/fonts",
        headers: { "X-Typst-Auth-Token": SessionToken }
    });
    Assert(R14N.Status === 200, "Font Listing via execFile Executes Safely (HTTP 200)", `Got ${R14N.Status}`);
    let R14NJson = {};
    try { R14NJson = JSON.parse(R14N.Body); }
    catch (E) {}
    Assert(Array.isArray(R14NJson.Fonts) && R14NJson.Fonts.length > 0, "Font Listing returns non-empty font list via safe execFile");

    console.log("\n================================================================================");
    console.log(`BATTLE-TEST SUMMARY: Total: ${TestCounter} | Passed: ${PassedCounter} | Failed: ${FailedCounter}`);
    console.log("================================================================================");

    if (FailedCounter > 0)
    {
        process.exit(1);
    }
}

RunBattleTest();

const HTTP = require("http");

async function TestFileCompile()
{
    // Step 1: Get Token
    const Token = await new Promise
    (
        (res, rej) =>
        {
            HTTP.get
            (
                "http://127.0.0.1:3000/api/auth/token", (r) =>
                {
                    let d = "";
                    r.on("data", c => d += c);
                    r.on("end", () => res(JSON.parse(d).Token));
                }
            ).on("error", rej);
        }
    );

    console.log("Auth token acquired:", Token.substring(0, 10) + "...");

    // Step 2: Compile with FilePath pointing to GenesisOfTheVanguard
    const CompilePayload =
    {
        Source: "= Chapter One\nThis is a test of stdin compilation with project root.",
        FilePath: "e:\\Typst\\projects\\GenesisOfTheVanguard\\main.typ"
    };

    const Body = JSON.stringify(CompilePayload);
    const CompileRes = await new Promise
    (
        (res, rej) =>
        {
            const req = HTTP.request
            (
                {
                    hostname: "127.0.0.1",
                    port: 3000,
                    path: "/api/compile",
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(Body),
                        "x-typst-auth-token": Token
                    }
                },
                (r) =>
                {
                    let d = "";
                    r.on("data", c => d += c);
                    r.on("end", () => res(JSON.parse(d)));
                }
            );
            req.on("error", rej);
            req.write(Body);
            req.end();
        }
    );

    console.log("Compile Result with FilePath:", CompileRes);
    if (CompileRes.Success && CompileRes.Pages && CompileRes.Pages.length > 0)
    {
        console.log("TEST PASSED: Compilation succeeded without 'source file must be contained in project root' error!");
    }
    else
    {
        console.log("TEST FAILED:", CompileRes.Error);
    }

    // Step 3: Test PDF export with FilePath
    const PdfPayload =
    {
        Source: "= Chapter One\nPDF Test.",
        FilePath: "e:\\Typst\\projects\\GenesisOfTheVanguard\\main.typ",
        FileName: "test_doc"
    };
    const PdfBody = JSON.stringify(PdfPayload);
    const PdfRes = await new Promise
    (
        (res, rej) =>
        {
            const req = HTTP.request
            (
                {
                    hostname: "127.0.0.1",
                    port: 3000,
                    path: "/api/export/pdf",
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(PdfBody),
                        "x-typst-auth-token": Token
                    }
                },
                (r) =>
                {
                    res({ status: r.statusCode, type: r.headers["content-type"] });
                }
            );
            req.on("error", rej);
            req.write(PdfBody);
            req.end();
        }
    );

    console.log("PDF Export Result:", PdfRes);
    if (PdfRes.status === 200 && PdfRes.type === "application/pdf")
    {
        console.log("TEST PASSED: PDF Export succeeded with project root!");
    }
    else
    {
        console.log("TEST FAILED on PDF export");
    }
}

TestFileCompile().catch(console.error);

const HTTP = require("node:http");

async function RunUploadTest()
{
    console.log("=== Testing /api/workspace/upload Endpoint ===");

    // 1. Get Auth Token
    const TokenRes = await new Promise((Resolve) =>
    {
        HTTP.get("http://127.0.0.1:3000/api/auth/token", (Res) =>
        {
            let Body = "";
            Res.on("data", (C) => Body += C);
            Res.on("end", () => Resolve(JSON.parse(Body)));
        });
    });

    const Token = TokenRes.Token;
    console.log("Acquired Session Auth Token:", Token.slice(0, 12) + "...");

    // 2. Test valid PNG upload
    const TestPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const UploadPayload = JSON.stringify
    ({
        FileName: "test_upload_badge.png",
        Base64Data: TestPngBase64
    });

    const UploadRes = await new Promise((Resolve) =>
    {
        const Req = HTTP.request
        (
            "http://127.0.0.1:3000/api/workspace/upload",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(UploadPayload),
                    "x-typst-auth-token": Token
                }
            },
            (Res) =>
            {
                let Body = "";
                Res.on("data", (C) => Body += C);
                Res.on("end", () => Resolve({ Status: Res.statusCode, Data: JSON.parse(Body) }));
            }
        );
        Req.write(UploadPayload);
        Req.end();
    });

    if (UploadRes.Status === 200 && UploadRes.Data.Success)
    {
        console.log("Test 1 (Valid PNG upload): PASS");
    }
    else
    {
        console.error("Test 1 FAILED:", UploadRes);
        process.exit(1);
    }

    // 3. Test forbidden extension rejection (.exe)
    const BadUploadPayload = JSON.stringify
    ({
        FileName: "malicious.exe",
        Base64Data: "AQID"
    });

    const BadUploadRes = await new Promise((Resolve) =>
    {
        const Req = HTTP.request
        (
            "http://127.0.0.1:3000/api/workspace/upload",
            {
                method: "POST",
                headers:
                {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(BadUploadPayload),
                    "x-typst-auth-token": Token
                }
            },
            (Res) =>
            {
                let Body = "";
                Res.on("data", (C) => Body += C);
                Res.on("end", () => Resolve({ Status: Res.statusCode, Data: JSON.parse(Body) }));
            }
        );
        Req.write(BadUploadPayload);
        Req.end();
    });

    if (BadUploadRes.Status === 400 && !BadUploadRes.Data.Success)
    {
        console.log("Test 2 (Forbidden extension rejection): PASS");
    }
    else
    {
        console.error("Test 2 FAILED:", BadUploadRes);
        process.exit(1);
    }

    console.log("=== All Upload Tests Passed! ===");
}

RunUploadTest().catch((Err) =>
{
    console.error(Err);
    process.exit(1);
});

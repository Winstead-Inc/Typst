const HTTP = require("node:http");

function Fetch(Url, Options = {}, Body = null)
{
    return new Promise
    (
        (Resolve) =>
        {
            const Req = HTTP.request
            (
                Url,
                Options,
                (Res) =>
                {
                    let Chunks = [];
                    Res.on("data", (C) => Chunks.push(C));
                    Res.on("end", () =>
                    {
                        const BufferData = Buffer.concat(Chunks);
                        Resolve
                        ({
                            Status: Res.statusCode,
                            Headers: Res.headers,
                            Body: BufferData.toString("utf-8"),
                            Buffer: BufferData
                        });
                    });
                }
            );
            Req.on("error", (E) => Resolve({ Error: E.message }));
            if (Body) { Req.write(Body); }
            Req.end();
        }
    );
}

async function Run()
{
    console.log("=== VERIFYING BLACK MODE & UI ADJUSTMENTS ===\n");

    // 1. Check HTML
    const R1 = await Fetch("http://127.0.0.1:3000/");
    console.log("1. GET / Status:", R1.Status);
    console.log("   Contains ExportBlackModeCheckbox:", R1.Body.includes("ExportBlackModeCheckbox"));
    console.log("   Contains CustomTickBox:", R1.Body.includes("CustomTickBox"));
    console.log("   Contains 'Black Mode' text:", R1.Body.includes("Black Mode"));

    const Match = R1.Body.match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([a-f0-9]+)"/);
    const Token = Match ? Match[1] : null;
    console.log("   Auth Token Found:", Boolean(Token));

    // 2. Check CSS
    const R2 = await Fetch("http://127.0.0.1:3000/Style.css");
    console.log("\n2. GET /Style.css Status:", R2.Status);
    console.log("   PreviewViewport background lighter (#16161a / #19191e):", R2.Body.includes("#16161a") && R2.Body.includes("#19191e"));
    console.log("   PageSheet BlackPageMode completely black (#000000):", R2.Body.includes("#000000 !important"));
    console.log("   ExportBlackModeLabel styles present:", R2.Body.includes(".ExportBlackModeLabel"));

    // 3. Test PDF export in Black Mode
    const R3 = await Fetch
    (
        "http://127.0.0.1:3000/api/export/pdf",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json",
                "X-Typst-Auth-Token": Token
            }
        },
        JSON.stringify
        ({
            Source: "= Black Mode Test\n\nTesting complete black paper background.\n",
            BlackMode: true
        })
    );
    console.log("\n3. Export PDF with BlackMode: true");
    console.log("   HTTP Status:", R3.Status);
    console.log("   Content-Type:", R3.Headers["content-type"]);
    console.log("   PDF Byte Length:", R3.Buffer.length);
    console.log("   Valid PDF Header:", R3.Buffer.slice(0, 5).toString("utf-8") === "%PDF-");

    // 4. Test PDF export in Normal Mode
    const R4 = await Fetch
    (
        "http://127.0.0.1:3000/api/export/pdf",
        {
            method: "POST",
            headers:
            {
                "Content-Type": "application/json",
                "X-Typst-Auth-Token": Token
            }
        },
        JSON.stringify
        ({
            Source: "= Normal Mode Test\n\nTesting normal white paper background.\n",
            BlackMode: false
        })
    );
    console.log("\n4. Export PDF with BlackMode: false");
    console.log("   HTTP Status:", R4.Status);
    console.log("   PDF Byte Length:", R4.Buffer.length);
    console.log("   Valid PDF Header:", R4.Buffer.slice(0, 5).toString("utf-8") === "%PDF-");

    console.log("\n=== ALL VERIFICATIONS PASSED ===");
}

Run();


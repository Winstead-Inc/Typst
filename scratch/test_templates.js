const fs = require("fs");
const HTTP = require("node:http");

const appJs = fs.readFileSync("TypstStudio/public/App.js", "utf8");
// Extract TEMPLATES object
const templatesMatch = appJs.match(/const TEMPLATES =\s*(\{[\s\S]*?\n\};)/);
if (!templatesMatch)
{
    console.error("TEMPLATES not found!");
    process.exit(1);
}

const TEMPLATES = eval("(" + templatesMatch[1].replace(/;$/, "") + ")");
console.log("Found templates:", Object.keys(TEMPLATES));

async function TestAllTemplates()
{
    // Acquire Token
    const TokenRes = await new Promise
    (
        (Resolve) =>
        {
            HTTP.get
            (
                "http://127.0.0.1:3000/api/auth/token", (Res) =>
                {
                    let Body = "";
                    Res.on("data", (C) => Body += C);
                    Res.on
                    (
                        "end", () => Resolve(JSON.parse(Body))
                    );
                }
            );
        }
    );

    const Token = TokenRes.Token;

    for (const[Key, Code] of Object.entries(TEMPLATES))
    {
        process.stdout.write(`Testing template "${Key}"... `);

        const Payload = JSON.stringify( { Source: Code, FileName: `${Key}.typ` });
        const Res = await new Promise
        (
            (Resolve) =>
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
                    (R) =>
                    {
                        let Body = "";
                        R.on("data", (C) => Body += C);
                        R.on
                        (
                            "end", () => Resolve
                            ({
                                Status: R.statusCode, Data: JSON.parse(Body)
                            })
                        );
                    }
                );
                Req.write(Payload);
                Req.end();
            }
        );

        if (Res.Status === 200 && Res.Data.Success)
        {
            console.log(`PASS (${Res.Data.Pages ? Res.Data.Pages.length : 1} pages, ${Res.Data.DurationMs}ms)`);
        }
        else
        {
            console.log(`FAIL! Status: ${Res.Status}`);
            console.error(Res.Data.Error || Res.Data);
        }
    }
}

TestAllTemplates().catch (console.error);

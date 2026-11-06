const HTTP = require("http");

HTTP.get
(
    "http://127.0.0.1:3000/api/auth/token", (Res) =>
    {
        let Data = "";
        Res.on("data", C => Data += C);
        Res.on
        (
            "end", () =>
            {
                const Token = JSON.parse(Data).Token;
                const FS = require("fs");
                const AppJs = FS.readFileSync("TypstStudio/public/App.js", "utf8");
                const Lines = AppJs.split("\n");
                const ShowcaseLines = Lines.slice(230, 564);
                const Showcase = ShowcaseLines.join("\n").replace(/^\s*showcase:\s*`/, "").replace(/`\s*$/, "");

                const PostData = JSON.stringify( { Source: Showcase });
                const Req = HTTP.request
                (
                    {
                        hostname: "127.0.0.1",
                        port: 3000,
                        path: "/api/compile",
                        method: "POST",
                        headers:
                        {
                            "Content-Type": "application/json",
                            "X-Typst-Auth-Token": Token,
                            "Content-Length": Buffer.byteLength(PostData)
                        }
                    },
                    (Res) =>
                    {
                        let D = "";
                        Res.on("data", C => D += C);
                        Res.on
                        (
                            "end", () =>
                            {
                                const Json = JSON.parse(D);
                                console.log("Compile success:", Json.Success);
                                console.log("Error:", Json.Error);
                            }
                        );
                    }
                );
                Req.write(PostData);
                Req.end();
            }
        );
    }
);

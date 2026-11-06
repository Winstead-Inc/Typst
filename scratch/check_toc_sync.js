const HTTP = require("http");

HTTP.get("http://127.0.0.1:3000/api/auth/token", (Res) => {
    let Data = "";
    Res.on("data", C => Data += C);
    Res.on("end", () => {
        const Token = JSON.parse(Data).Token;
        const Source = `#set page(paper: "a4")
#outline()

#pagebreak()
= Introduction & Geometry
First page content.

#pagebreak()
= Calculus, Integrals & Differential Forms
Second page content.
`;
        const PostData = JSON.stringify({ Source });
        const Req = HTTP.request({
            hostname: "127.0.0.1",
            port: 3000,
            path: "/api/compile",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Typst-Auth-Token": Token,
                "Content-Length": Buffer.byteLength(PostData)
            }
        }, (Res) => {
            let D = "";
            Res.on("data", C => D += C);
            Res.on("end", () => {
                const Json = JSON.parse(D);
                console.log("Compile success:", Json.Success);
                console.log("Pages count:", Json.Pages.length);
                const CalculusElems = Json.SyncMap.filter(E => E.line === 9 || E.end_line === 9);
                console.log("Elements for line 9 (= Calculus...):", CalculusElems.length);
                CalculusElems.forEach((E, I) => {
                    console.log(`[${I}] page:${E.page} line:${E.line}:${E.col}->${E.end_line}:${E.end_col} x:${E.x.toFixed(1)} y:${E.y.toFixed(1)} w:${E.width.toFixed(1)} h:${E.height.toFixed(1)} span:${E.span}`);
                });
            });
        });
        Req.write(PostData);
        Req.end();
    });
});


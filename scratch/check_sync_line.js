const HTTP = require("http");

function GetToken(Callback) {
    HTTP.get("http://127.0.0.1:3000/api/auth/token", (Res) => {
        let Data = "";
        Res.on("data", C => Data += C);
        Res.on("end", () => {
            const Json = JSON.parse(Data);
            Callback(Json.Token);
        });
    });
}

GetToken((Token) => {
    const Source = `= Intro
Matrices and vectors express linear mappings. Inline forms like $mat(1, 2; 3, 4)$ and $vec(x_1, x_2)$ integrate smoothly into text flows.
`;

    const PostData = JSON.stringify({ Source: Source });

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
        let Data = "";
        Res.on("data", Chunk => Data += Chunk);
        Res.on("end", () => {
            const Json = JSON.parse(Data);
            console.log("Compile success:", Json.Success);
            if (Json.Error) console.log("Compile error:", Json.Error);
            if (Json.SyncMap) {
                console.log("Sync elements count:", Json.SyncMap.length);
                Json.SyncMap.forEach((E, Idx) => {
                    console.log(`[${Idx}] page:${E.page} line:${E.line}:${E.col}->${E.end_line}:${E.end_col} x:${E.x.toFixed(1)} y:${E.y.toFixed(1)} w:${E.width.toFixed(1)} h:${E.height.toFixed(1)} span:${E.span}`);
                });
            }
        });
    });

    Req.write(PostData);
    Req.end();
});

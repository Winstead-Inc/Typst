const HTTP = require("http");

HTTP.get("http://127.0.0.1:3000/api/auth/token", (Res) => {
    let Data = "";
    Res.on("data", C => Data += C);
    Res.on("end", () => {
        const Token = JSON.parse(Data).Token;
        const Source = `#set page(paper: "a4")
#set math.equation(numbering: "(1)")

Display matrix affine rotation:
$
  mat
  (
    cos theta, -sin theta, 0;
    sin theta,  cos theta, 0;
    0,          0,         1
  )
  vec(x, y, 1)
  =
  vec(x cos theta - y sin theta, x sin theta + y cos theta, 1)
$ <eq:rotation>
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
                if (Json.SyncMap) {
                    console.log("Total sync elements:", Json.SyncMap.length);
                    Json.SyncMap.forEach((E, I) => {
                        console.log(`[${I}] line:${E.line}:${E.col}->${E.end_line}:${E.end_col} x:${E.x.toFixed(1)} y:${E.y.toFixed(1)} w:${E.width.toFixed(1)} h:${E.height.toFixed(1)} span:${E.span}`);
                    });
                }
            });
        });
        Req.write(PostData);
        Req.end();
    });
});

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
                const Source = `= Intro
Matrices and vectors express linear mappings. Inline forms like $mat(1, 2; 3, 4)$ and $vec(x_1, x_2)$ integrate smoothly into text flows.
`;
                const PostData = JSON.stringify( { Source });
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
                                console.log
                                (
                                    "Keys:", Object.keys(Json.SyncMap[0])
                                );
                                console.log("Elem [18]:", Json.SyncMap[18]);
                                console.log("Elem [19]:", Json.SyncMap[19]);
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

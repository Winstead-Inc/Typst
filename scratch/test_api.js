const HTTP = require("http");

const Req = HTTP.get
(
    "http://127.0.0.1:3000/", (Res) =>
    {
        console.log("Server responded with status:", Res.statusCode);
    }
);

Req.on
(
    "error", (Err) =>
    {
        console.log("Error connecting:", Err.message);
    }
);

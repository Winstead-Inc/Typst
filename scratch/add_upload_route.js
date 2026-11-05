const fs = require("fs");

let serverJs = fs.readFileSync("TypstStudio/Server.js", "utf8");

const assetCode = `const ALLOWED_ASSET_EXTENSIONS = new Set
([
    ".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".bmp", ".ico", ".pdf"
]);

async function HandleUploadAsset(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const RawFileName = (Payload.FileName || "image.png").trim();
        const CleanFileName = require("node:path").basename(RawFileName).replace(/[^a-zA-Z0-9_\\-\\.]/g, "_");
        const Ext = Path.extname(CleanFileName).toLowerCase();

        if (!ALLOWED_ASSET_EXTENSIONS.has(Ext))
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false,
                    Error: \`Unsupported asset extension '\${Ext}'. Allowed: \${Array.from(ALLOWED_ASSET_EXTENSIONS).join(", ")}\`
                })
            );
            return;
        }

        let TargetDir = GetTrackedDirectories()[0];
        if (Payload.Directory)
        {
            TargetDir = Path.resolve(Payload.Directory);
        }
        else if (Payload.ActiveFilePath)
        {
            TargetDir = Path.dirname(Path.resolve(Payload.ActiveFilePath));
        }

        const TargetFullPath = Path.join(TargetDir, CleanFileName);
        const Validation = ValidateWorkspacePath(TargetFullPath, false, true);

        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: Validation.Error }));
            return;
        }

        if (!Payload.Base64Data)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Missing Base64Data in request payload." }));
            return;
        }

        const BufferData = Buffer.from(Payload.Base64Data, "base64");
        if (BufferData.length > MAX_REQUEST_BODY_BYTES)
        {
            Response.writeHead(413, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Asset exceeds maximum allowed file size of 10 MB." }));
            return;
        }

        if (!FS.existsSync(TargetDir))
        {
            await FSPromises.mkdir(TargetDir, { recursive: true });
        }

        await FSPromises.writeFile(TargetFullPath, BufferData);

        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                FileName: CleanFileName,
                Path: TargetFullPath,
                Size: BufferData.length
            })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}
`;

serverJs = serverJs.replace(
    "async function HandleDeleteFile(Request, Response, QueryPath)",
    assetCode + "\nasync function HandleDeleteFile(Request, Response, QueryPath)"
);

const routeCode = `        if (Request.method === "POST" && Pathname === "/api/workspace/upload")
        {
            await HandleUploadAsset(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/create")`;

serverJs = serverJs.replace(
    'if (Request.method === "POST" && Pathname === "/api/workspace/create")',
    routeCode
);

fs.writeFileSync("TypstStudio/Server.js", serverJs, "utf8");
console.log("SUCCESS: Server.js updated with /api/workspace/upload");


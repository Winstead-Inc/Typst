const HTTP = require("node:http");
const FS = require("node:fs");
const FSPromises = require("node:fs/promises");
const Path = require("node:path");
const ChildProcess = require("node:child_process");
const OS = require("node:os");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = "127.0.0.1";

function ResolveTypstBinary()
{
    const BinaryName = process.platform === "win32" ? "typst.exe" : "typst";
    const SearchLocations =
    [
        process.env.TYPST_BINARY,
        Path.join(__dirname, "bin", BinaryName),
        Path.join(__dirname, BinaryName),
        Path.resolve(__dirname, "..", "target", "release", BinaryName),
        Path.resolve(__dirname, "..", "target", "debug", BinaryName)
    ];

    for (const Candidate of SearchLocations)
    {
        if (Candidate && FS.existsSync(Candidate))
        {
            return Candidate;
        }
    }

    return Path.resolve(__dirname, "..", "target", "release", BinaryName);
}

const TYPST_BINARY = ResolveTypstBinary();
const TEMP_DIR = Path.resolve(__dirname, ".temp");
const PUBLIC_DIR = Path.resolve(__dirname, "public");
const WORKSPACE_CONFIG_FILE = Path.resolve(__dirname, ".workspace_config.json");

let ActiveCompileProcess = null;
let ActiveJobDir = null;

if (!FS.existsSync(TEMP_DIR))
{
    FS.mkdirSync(TEMP_DIR, { recursive: true });
}

function GetTrackedDirectories()
{
    const UserHome = OS.homedir();
    const PotentialDefaults =
    [
        Path.resolve(__dirname, "..", "projects", "GenesisOfTheVanguard"),
        Path.resolve(__dirname, "..", "projects"),
        Path.join(__dirname, "projects"),
        Path.join(UserHome, "TypstProjects"),
        Path.join(UserHome, "Documents", "Typst")
    ];

    const ExistingDefaults = PotentialDefaults.filter((Dir) => FS.existsSync(Dir));
    const DefaultDirs = ExistingDefaults.length > 0 ? ExistingDefaults : [Path.join(UserHome, "Documents")];

    if (!FS.existsSync(WORKSPACE_CONFIG_FILE))
    {
        try
        {
            FS.writeFileSync(WORKSPACE_CONFIG_FILE, JSON.stringify({ Directories: DefaultDirs }, null, 4), "utf-8");
        }
        catch (Ignored)
        {
        }
        return DefaultDirs;
    }

    try
    {
        const Raw = FS.readFileSync(WORKSPACE_CONFIG_FILE, "utf-8");
        const Parsed = JSON.parse(Raw);
        return Array.isArray(Parsed.Directories) ? Parsed.Directories : DefaultDirs;
    }
    catch (E)
    {
        return DefaultDirs;
    }
}

function SaveTrackedDirectories(Directories)
{
    try
    {
        FS.writeFileSync(WORKSPACE_CONFIG_FILE, JSON.stringify({ Directories: Directories }, null, 4), "utf-8");
    }
    catch (E)
    {
    }
}

async function ScanTypstFiles()
{
    const Dirs = GetTrackedDirectories();
    const AllFiles = [];

    for (const Dir of Dirs)
    {
        if (!FS.existsSync(Dir)) { continue; }

        try
        {
            const Entries = await FSPromises.readdir(Dir, { withFileTypes: true });
            for (const Entry of Entries)
            {
                if (Entry.isFile() && Entry.name.endsWith(".typ"))
                {
                    const FullPath = Path.join(Dir, Entry.name);
                    const Stats = await FSPromises.stat(FullPath);
                    AllFiles.push
                    ({
                        Name: Entry.name,
                        Path: FullPath,
                        Directory: Dir,
                        Size: Stats.size,
                        Modified: Stats.mtime.toISOString()
                    });
                }
                else if (Entry.isDirectory() && !Entry.name.startsWith(".") && Entry.name !== "node_modules" && Entry.name !== "target")
                {
                    const SubDir = Path.join(Dir, Entry.name);
                    try
                    {
                        const SubEntries = await FSPromises.readdir(SubDir, { withFileTypes: true });
                        for (const SubEntry of SubEntries)
                        {
                            if (SubEntry.isFile() && SubEntry.name.endsWith(".typ"))
                            {
                                const SubFullPath = Path.join(SubDir, SubEntry.name);
                                const SubStats = await FSPromises.stat(SubFullPath);
                                AllFiles.push
                                ({
                                    Name: `${Entry.name}/${SubEntry.name}`,
                                    Path: SubFullPath,
                                    Directory: SubDir,
                                    Size: SubStats.size,
                                    Modified: SubStats.mtime.toISOString()
                                });
                            }
                        }
                    }
                    catch (Ignored) {}
                }
            }
        }
        catch (E) {}
    }

    const SeenPaths = new Set();
    const UniqueFiles = [];
    for (const File of AllFiles)
    {
        const Normalized = Path.resolve(File.Path).toLowerCase();
        if (!SeenPaths.has(Normalized))
        {
            SeenPaths.add(Normalized);
            UniqueFiles.push(File);
        }
    }

    return { Directories: Dirs, Files: UniqueFiles };
}

function ExecuteCommand(Command, Arguments, Options = {})
{
    return new Promise
    (
        (Resolve, Reject) =>
        {
            ChildProcess.execFile
            (
                Command,
                Arguments,
                Options,
                (Error, Stdout, Stderr) =>
                {
                    if (Error)
                    {
                        Resolve
                        ({
                            Success: false,
                            Code: Error.code,
                            Stdout: Stdout ? Stdout.toString() : "",
                            Stderr: Stderr ? Stderr.toString() : ""
                        });
                    }
                    else
                    {
                        Resolve
                        ({
                            Success: true,
                            Code: 0,
                            Stdout: Stdout ? Stdout.toString() : "",
                            Stderr: Stderr ? Stderr.toString() : ""
                        });
                    }
                }
            );
        }
    );
}

function ExecuteCompile(Command, Arguments, Options = {})
{
    return new Promise
    (
        (Resolve) =>
        {
            const Child = ChildProcess.execFile
            (
                Command,
                Arguments,
                Options,
                (Error, Stdout, Stderr) =>
                {
                    if (ActiveCompileProcess === Child) { ActiveCompileProcess = null; }

                    if (Error)
                    {
                        Resolve
                        ({
                            Success: false,
                            Code: Error.code,
                            Killed: Child.killed,
                            Stdout: Stdout ? Stdout.toString() : "",
                            Stderr: Stderr ? Stderr.toString() : ""
                        });
                    }
                    else
                    {
                        Resolve
                        ({
                            Success: true,
                            Code: 0,
                            Killed: false,
                            Stdout: Stdout ? Stdout.toString() : "",
                            Stderr: Stderr ? Stderr.toString() : ""
                        });
                    }
                }
            );
            ActiveCompileProcess = Child;
        }
    );
}

function ReadRequestBody(Request)
{
    return new Promise
    (
        (Resolve, Reject) =>
        {
            let Body = "";
            Request.on("data", (Chunk) => { Body += Chunk; });
            Request.on("end", () => { Resolve(Body); });
            Request.on("error", (Error) => { Reject(Error); });
        }
    );
}

async function HandleCompile(Request, Response)
{
    const StartTime = Date.now();

    if (ActiveCompileProcess)
    {
        try
        {
            ActiveCompileProcess.kill();
        }
        catch (Ignored)
        {
        }
        ActiveCompileProcess = null;
        if (ActiveJobDir)
        {
            FSPromises.rm(ActiveJobDir, { recursive: true, force: true }).catch(() => {});
            ActiveJobDir = null;
        }
    }

    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        ActiveJobDir = JobDir;
        await FSPromises.mkdir(JobDir, { recursive: true });

        const InputPath = Path.join(JobDir, "document.typ");
        const OutputPattern = Path.join(JobDir, "page-{n}.svg");

        await FSPromises.writeFile(InputPath, Source, "utf-8");

        const CompileResult = await ExecuteCompile
        (
            TYPST_BINARY,
            ["compile", InputPath, OutputPattern],
            { cwd: JobDir, timeout: 20000 }
        );

        if (CompileResult.Killed)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Aborted: true }));
            return;
        }

        const DurationMs = Date.now() - StartTime;

        if (!CompileResult.Success)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false,
                    Error: CompileResult.Stderr || CompileResult.Stdout || "Compilation failed.",
                    DurationMs: DurationMs
                })
            );
            return;
        }

        const Files = await FSPromises.readdir(JobDir);
        const SvgFiles = Files
            .filter((FileName) => FileName.startsWith("page-") && FileName.endsWith(".svg"))
            .sort
            (
                (A, B) =>
                {
                    const NumA = parseInt(A.replace("page-", "").replace(".svg", ""), 10);
                    const NumB = parseInt(B.replace("page-", "").replace(".svg", ""), 10);
                    return NumA - NumB;
                }
            );

        const Pages = [];
        for (const SvgFile of SvgFiles)
        {
            const SvgContent = await FSPromises.readFile(Path.join(JobDir, SvgFile), "utf-8");
            Pages.push(SvgContent);
        }

        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
        ActiveJobDir = null;

        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                Pages: Pages,
                PageCount: Pages.length,
                DurationMs: DurationMs
            })
        );
    }
    catch (Exception)
    {
        const DurationMs = Date.now() - StartTime;
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: false,
                Error: Exception.message,
                DurationMs: DurationMs
            })
        );
    }
}

async function HandleExportPdf(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const OutputFileName = (Payload.FileName || "document").replace(/[^a-zA-Z0-9_\-]/g, "_") + ".pdf";

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        const InputPath = Path.join(JobDir, "document.typ");
        const OutputPath = Path.join(JobDir, "output.pdf");

        await FSPromises.writeFile(InputPath, Source, "utf-8");

        const CompileResult = await ExecuteCommand
        (
            TYPST_BINARY,
            ["compile", InputPath, OutputPath],
            { cwd: JobDir, timeout: 30000 }
        );

        if (!CompileResult.Success || !FS.existsSync(OutputPath))
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false,
                    Error: CompileResult.Stderr || "PDF Generation failed."
                })
            );
            return;
        }

        const PdfBuffer = await FSPromises.readFile(OutputPath);
        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});

        Response.writeHead
        (
            200,
            {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${OutputFileName}"`,
                "Content-Length": PdfBuffer.length
            }
        );
        Response.end(PdfBuffer);
    }
    catch (Exception)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Exception.message }));
    }
}

async function HandleExportPng(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const PageNum = Payload.PageNum || 1;

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        const InputPath = Path.join(JobDir, "document.typ");
        const OutputPattern = Path.join(JobDir, "page-{n}.png");

        await FSPromises.writeFile(InputPath, Source, "utf-8");

        const CompileResult = await ExecuteCommand
        (
            TYPST_BINARY,
            ["compile", InputPath, OutputPattern, "--ppi", "288"],
            { cwd: JobDir, timeout: 20000 }
        );

        const TargetPng = Path.join(JobDir, `page-${PageNum}.png`);
        if (!FS.existsSync(TargetPng))
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Requested page not found." }));
            return;
        }

        const PngBuffer = await FSPromises.readFile(TargetPng);
        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});

        Response.writeHead
        (
            200,
            {
                "Content-Type": "image/png",
                "Content-Disposition": `attachment; filename="page-${PageNum}.png"`,
                "Content-Length": PngBuffer.length
            }
        );
        Response.end(PngBuffer);
    }
    catch (Exception)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Exception.message }));
    }
}

async function HandleFormat(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const Lines = Source.split(/\r?\n/);
        const ResultLines = [];
        let InRawBlock = false;
        let InBlockComment = false;

        for (let I = 0; I < Lines.length; I++)
        {
            const Line = Lines[I];
            const Trimmed = Line.trim();

            if (Trimmed.startsWith("```"))
            {
                InRawBlock = !InRawBlock;
                ResultLines.push(Line);
                continue;
            }

            if (InRawBlock)
            {
                ResultLines.push(Line);
                continue;
            }

            if (Trimmed.startsWith("/*") && !Trimmed.includes("*/"))
            {
                InBlockComment = true;
                ResultLines.push(Line);
                continue;
            }

            if (InBlockComment)
            {
                if (Trimmed.includes("*/")) { InBlockComment = false; }
                ResultLines.push(Line);
                continue;
            }

            if (Trimmed === "" || Trimmed.startsWith("//"))
            {
                ResultLines.push(Line);
                continue;
            }

            const ElseIfMatch = Trimmed.match(/^(\})\s*(else\s+if\s+.*?)(\s*\{)?$/);
            if (ElseIfMatch)
            {
                const Indent = Line.match(/^\s*/)[0];
                ResultLines.push(`${Indent}}`);
                ResultLines.push(`${Indent}${ElseIfMatch[2]}`);
                if (ElseIfMatch[3] || Trimmed.endsWith("{")) { ResultLines.push(`${Indent}{`); }
                continue;
            }

            const ElseMatch = Trimmed.match(/^(\})\s*(else)(\s*\{)?$/);
            if (ElseMatch)
            {
                const Indent = Line.match(/^\s*/)[0];
                ResultLines.push(`${Indent}}`);
                ResultLines.push(`${Indent}else`);
                if (ElseMatch[3] || Trimmed.endsWith("{")) { ResultLines.push(`${Indent}{`); }
                continue;
            }

            const EndsWithDelimiter = Trimmed.match(/^(.*?)(\s*)([\{\(\[])\s*$/);
            if (EndsWithDelimiter)
            {
                const Prefix = EndsWithDelimiter[1].trim();
                const Delim = EndsWithDelimiter[3];
                const Indent = Line.match(/^\s*/)[0];

                if (Prefix === "" || Prefix.includes("//"))
                {
                    ResultLines.push(Line);
                    continue;
                }

                ResultLines.push(`${Indent}${Prefix}`);
                ResultLines.push(`${Indent}${Delim}`);
                continue;
            }

            const ControlMatch = Trimmed.match(/^(if\s+.*?|while\s+.*?|for\s+.*?|context)\s*\{$/);
            if (ControlMatch)
            {
                const Indent = Line.match(/^\s*/)[0];
                ResultLines.push(`${Indent}${ControlMatch[1]}`);
                ResultLines.push(`${Indent}{`);
                continue;
            }

            ResultLines.push(Line);
        }

        const Formatted = ResultLines.join("\n");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, Formatted: Formatted }));
    }
    catch (Exception)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Exception.message }));
    }
}

// Workspace API Handlers
async function HandleWorkspaceInfo(Request, Response)
{
    try
    {
        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, ...Info }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

async function HandleAddDirectory(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const TargetPath = Payload.Path ? Path.resolve(Payload.Path) : null;

        if (!TargetPath || !FS.existsSync(TargetPath))
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Directory does not exist." }));
            return;
        }

        const Dirs = GetTrackedDirectories();
        if (!Dirs.includes(TargetPath))
        {
            Dirs.push(TargetPath);
            SaveTrackedDirectories(Dirs);
        }

        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, ...Info }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

async function HandleRemoveDirectory(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const TargetPath = Payload.Path ? Path.resolve(Payload.Path) : null;

        let Dirs = GetTrackedDirectories();
        Dirs = Dirs.filter((D) => D !== TargetPath);
        SaveTrackedDirectories(Dirs);

        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, ...Info }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

async function HandleReadFile(Request, Response, FilePath)
{
    try
    {
        if (!FilePath || !FS.existsSync(FilePath))
        {
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "File not found." }));
            return;
        }

        const Content = await FSPromises.readFile(FilePath, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, Content: Content, Path: FilePath, Name: Path.basename(FilePath) }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

async function HandleSaveFile(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const FilePath = Payload.Path ? Path.resolve(Payload.Path) : null;
        const Content = Payload.Content || "";

        if (!FilePath)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Missing file path." }));
            return;
        }

        const Dir = Path.dirname(FilePath);
        if (!FS.existsSync(Dir))
        {
            await FSPromises.mkdir(Dir, { recursive: true });
        }

        await FSPromises.writeFile(FilePath, Content, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, Path: FilePath, Name: Path.basename(FilePath) }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

async function HandleCreateFile(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        let TargetDir = Payload.Directory ? Path.resolve(Payload.Directory) : GetTrackedDirectories()[0];
        let FileName = (Payload.FileName || "Untitled.typ").trim();
        if (!FileName.endsWith(".typ")) { FileName += ".typ"; }

        if (!FS.existsSync(TargetDir)) { await FSPromises.mkdir(TargetDir, { recursive: true }); }

        const FullPath = Path.join(TargetDir, FileName);
        const Content = Payload.Content || `#set text(size: 11pt)\n\n= ${Path.basename(FileName, ".typ")}\n\nStart writing in Typst...\n`;

        await FSPromises.writeFile(FullPath, Content, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, Path: FullPath, Name: FileName, Content: Content }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

async function HandleDeleteFile(Request, Response, QueryPath)
{
    try
    {
        let TargetPath = QueryPath ? Path.resolve(QueryPath) : null;
        if (!TargetPath)
        {
            try
            {
                const RawBody = await ReadRequestBody(Request);
                if (RawBody && RawBody.trim())
                {
                    const Payload = JSON.parse(RawBody);
                    if (Payload.Path) { TargetPath = Path.resolve(Payload.Path); }
                }
            }
            catch (Ignored) { }
        }

        if (TargetPath && FS.existsSync(TargetPath)) { await FSPromises.unlink(TargetPath); }

        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, ...Info }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
    }
}

function ServeStatic(Request, Response, FilePath)
{
    let NormalizedPath = Path.normalize(FilePath);
    if (!NormalizedPath.startsWith(PUBLIC_DIR))
    {
        Response.writeHead(403, { "Content-Type": "text/plain" });
        Response.end("Forbidden");
        return;
    }

    if (!FS.existsSync(NormalizedPath))
    {
        // Case-insensitivity fallback for Linux/macOS case-sensitive filesystems
        const RequestedBase = Path.basename(NormalizedPath).toLowerCase();
        const ParentDir = Path.dirname(NormalizedPath);
        if (FS.existsSync(ParentDir))
        {
            try
            {
                const Entries = FS.readdirSync(ParentDir);
                const Matched = Entries.find((E) => E.toLowerCase() === RequestedBase);
                if (Matched)
                {
                    NormalizedPath = Path.join(ParentDir, Matched);
                }
            }
            catch (Ignored)
            {
            }
        }
    }

    if (!FS.existsSync(NormalizedPath))
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Not Found");
        return;
    }

    const Extension = Path.extname(NormalizedPath).toLowerCase();
    const MimeTypes =
    {
        ".html": "text/html; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".js": "application/javascript; charset=utf-8",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".json": "application/json",
        ".ico": "image/x-icon"
    };

    const ContentType = MimeTypes[Extension] || "application/octet-stream";
    const Stream = FS.createReadStream(NormalizedPath);
    Response.writeHead(200, { "Content-Type": ContentType });
    Stream.pipe(Response);
}

async function HandlePickFolder(Request, Response)
{
    try
    {
        let Selected = "";

        if (process.platform === "win32")
        {
            const PsCommand = "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Add-Type -AssemblyName System.Windows.Forms; $Dialog = New-Object System.Windows.Forms.FolderBrowserDialog; $Dialog.Description = 'Select Typst Projects Directory'; $Dialog.ShowNewFolderButton = $true; $Dialog.AutoUpgradeEnabled = $true; if ($Dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { Write-Output $Dialog.SelectedPath; }";

            const Result = await ExecuteCommand
            (
                "powershell",
                ["-NoProfile", "-Command", PsCommand],
                { timeout: 120000 }
            );
            Selected = (Result.Stdout || "").trim();
        }
        else if (process.platform === "darwin")
        {
            const AppleScript = 'POSIX path of (choose folder with prompt "Select Typst Projects Directory")';
            const Result = await ExecuteCommand
            (
                "osascript",
                ["-e", AppleScript],
                { timeout: 120000 }
            );
            Selected = (Result.Stdout || "").trim();
        }
        else
        {
            // Linux: Try zenity, fallback to kdialog
            try
            {
                const Result = await ExecuteCommand
                (
                    "zenity",
                    ["--file-selection", "--directory", "--title=Select Typst Projects Directory"],
                    { timeout: 120000 }
                );
                Selected = (Result.Stdout || "").trim();
            }
            catch (ZenityErr)
            {
                const Result = await ExecuteCommand
                (
                    "kdialog",
                    ["--getexistingdirectory", "--title", "Select Typst Projects Directory"],
                    { timeout: 120000 }
                );
                Selected = (Result.Stdout || "").trim();
            }
        }

        if (Selected)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: true, Path: Selected }));
        }
        else
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Cancelled: true }));
        }
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Err.message }));
    }
}

const Server = HTTP.createServer
(
    async (Request, Response) =>
    {
        const Origin = Request.headers.origin;
        const AllowedOrigins = new Set
        ([
            `http://${HOST}:${PORT}`,
            `http://localhost:${PORT}`,
            `http://[::1]:${PORT}`
        ]);

        if (Origin && AllowedOrigins.has(Origin))
        {
            Response.setHeader("Access-Control-Allow-Origin", Origin);
            Response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
            Response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        }

        if (Request.method === "OPTIONS")
        {
            Response.writeHead(204);
            Response.end();
            return;
        }

        const URLInstance = new URL(Request.url, `http://${Request.headers.host}`);
        const Pathname = URLInstance.pathname;

        if (Request.method === "POST" && Pathname === "/api/compile")
        {
            await HandleCompile(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/export/pdf")
        {
            await HandleExportPdf(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/export/png")
        {
            await HandleExportPng(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/format")
        {
            await HandleFormat(Request, Response);
            return;
        }

        if (Request.method === "GET" && Pathname === "/api/workspace/info")
        {
            await HandleWorkspaceInfo(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/directory")
        {
            await HandleAddDirectory(Request, Response);
            return;
        }

        if ((Request.method === "POST" || Request.method === "GET") && Pathname === "/api/workspace/pick-folder")
        {
            await HandlePickFolder(Request, Response);
            return;
        }

        if (Request.method === "DELETE" && Pathname === "/api/workspace/directory")
        {
            await HandleRemoveDirectory(Request, Response);
            return;
        }

        if (Request.method === "GET" && Pathname === "/api/workspace/file")
        {
            const TargetPath = URLInstance.searchParams.get("path");
            await HandleReadFile(Request, Response, TargetPath);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/file")
        {
            await HandleSaveFile(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/create")
        {
            await HandleCreateFile(Request, Response);
            return;
        }

        if (Request.method === "DELETE" && Pathname === "/api/workspace/file")
        {
            const TargetPath = URLInstance.searchParams.get("path");
            await HandleDeleteFile(Request, Response, TargetPath);
            return;
        }

        if (Request.method === "GET" && Pathname === "/api/status")
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Status: "Online",
                    TypstBinary: TYPST_BINARY,
                    BinaryExists: FS.existsSync(TYPST_BINARY),
                    Version: "0.15.1-lafs"
                })
            );
            return;
        }

        let TargetFile = Path.join(PUBLIC_DIR, Pathname === "/" ? "Index.html" : Pathname);
        ServeStatic(Request, Response, TargetFile);
    }
);

Server.listen
(
    PORT,
    HOST,
    () =>
    {
        console.log(`Typst Studio Web Server active at http://${HOST}:${PORT}`);
        console.log(`Using LAFS-enabled Typst Engine: ${TYPST_BINARY}`);
    }
);

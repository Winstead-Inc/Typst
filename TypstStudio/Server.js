const HTTP = require("node:http");
const FS = require("node:fs");
const FSPromises = require("node:fs/promises");
const Path = require("node:path");
const ChildProcess = require("node:child_process");
const OS = require("node:os");
const Crypto = require("node:crypto");
const JSZip = require("./public/vendor/jszip.min.js");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10): 3000;
const HOST = "127.0.0.1";
const SESSION_AUTH_TOKEN = Crypto.randomBytes(32).toString("hex");
const MAX_REQUEST_BODY_BYTES = 10 * 1024 * 1024;
// 10 MB maximum request payload
const FORBIDDEN_EXTENSIONS = new Set
([
    // Windows Executables & Binaries
    ".exe", ".msi", ".msp", ".com", ".scr", ".pif", ".cpl", ".dll", ".sys", ".drv", ".ocx", // Windows Scripting & Batch
    ".bat", ".cmd", ".vbs", ".vbe", ".js", ".jse", ".ws", ".wsf", ".wsc", ".wsh", ".ps1", ".psm1", ".psd1", // Shortcuts & Links
    ".lnk", ".url", ".scf", // Unix Shell & Scripting
    ".sh", ".bash", ".zsh", ".fish", ".csh", ".tcsh", ".ksh", ".awk", ".sed", // Dynamic Interpreted Languages
    ".py", ".pyw", ".pyc", ".pyo", ".pyd", ".rb", ".pl", ".pm", ".php", ".cgi", // Java & Managed Runtimes
    ".jar", ".class", // Native Shared Objects & Installers
    ".so", ".dylib", ".bin", ".app", ".dmg", ".pkg", ".deb", ".rpm", // Windows Setup & System Configurations
    ".inf", ".sct", ".reg", ".hta"
]);
const PROTECTED_SYSTEM_FILES = new Set
([
    ".workspace_config.json",
    "server.js",
    "package.json",
    "package-lock.json",
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    ".bashrc",
    ".bash_profile",
    ".bash_login",
    ".bash_logout",
    ".zshrc",
    ".zprofile",
    ".profile",
    ".gitconfig",
    ".gitignore",
    ".gitmodules",
    "id_rsa",
    "id_ed25519",
    "id_ecdsa",
    "id_dsa",
    "authorized_keys",
    "known_hosts",
    "desktop.ini",
    "autorun.inf"
]);
const ALLOWED_SPAWN_BINARIES = new Set
([
    "pwsh",
    "pwsh.exe",
    "powershell",
    "powershell.exe",
    "osascript",
    "zenity",
    "kdialog",
    "python3",
    "python",
    "reg",
    "reg.exe",
    "lafs",
    "lafs.exe"
]);

// Compile-time pinned cryptographic digests of immutable official LAFS releases
const PINNED_LAFS_HASHES = new Set
([
    "91faa0ece4e1278ebf2cc58a776de0290e10d31f0d59456410862b52c86067fc",
    "45a755ee1d42e04d42362b9aa312c301068f438739732c9a395017cbf5d44d02",
    "aa8243a43abe3b5fe0b9143aa9be8e2a9ede1329b42689e8e2ade4096154001c",
    "36d0a66a6af9a0a24b905f405ef5dc36a0f607004bd7a6ae57082dd49e1d80ec"
]);

function VerifyLafsBinaryIntegrity(BinaryPath)
{
    if (!BinaryPath || !FS.existsSync(BinaryPath))
    {
        return { Valid: false, Reason: "Binary file does not exist" };
    }
    try
    {
        const Resolved = Path.resolve(BinaryPath);
        const AllowedDirs =
        [
            Path.resolve(__dirname, "bin"),
            Path.resolve(__dirname),
            Path.resolve(__dirname, "..")
        ];
        const IsInAllowedDir = AllowedDirs.some(Dir => Resolved.toLowerCase().startsWith(Dir.toLowerCase()));
        if (!IsInAllowedDir)
        {
            return { Valid: false, Reason: "Path traversal / foreign path rejected: binary outside trusted application tree" };
        }
        const FileBuffer = FS.readFileSync(Resolved);
        const HashSum = Crypto.createHash("sha256");
        HashSum.update(FileBuffer);
        const Digest = HashSum.digest("hex").toLowerCase();
        if (!PINNED_LAFS_HASHES.has(Digest))
        {
            return { Valid: false, Reason: `Cryptographic digest mismatch: '${Digest}' is not an authorized pinned release` };
        }
        return { Valid: true, Digest: Digest };
    }
    catch (Err)
    {
        return { Valid: false, Reason: `Integrity check failed: ${Err.message}` };
    }
}

function ResolveLafsBinary()
{
    const BinaryName = process.platform === "win32" ? "lafs.exe": "lafs";
    const SearchLocations =
    [
        Path.join(__dirname, "bin", BinaryName),
        Path.join(__dirname, BinaryName),
        Path.resolve(__dirname, "..", BinaryName)
    ];

    for (const Candidate of SearchLocations)
    {
        if (Candidate && FS.existsSync(Candidate))
        {
            const Integrity = VerifyLafsBinaryIntegrity(Candidate);
            if (Integrity.Valid)
            {
                return Candidate;
            }
        }
    }
    return null;
}

const LAFS_BINARY = ResolveLafsBinary();

// In-process immutable LAFS formatting engine: guaranteed fallback that cannot be removed or replaced
function InProcessFormatSnippetLAFS(Code)
{
    const Lines = (Code || "").split(/\r?\n/);
    const Out = [];
    for (let Line of Lines)
    {
        const Trimmed = Line.trim();
        const Match = Trimmed.match(/^(.*?)\s*\{$/);
        if (Match && !Trimmed.startsWith("{"))
        {
            const Indent = Line.match(/^\s*/)[0];
            Out.push(`${Indent}${Match[1]}`);
            Out.push(`${Indent}{`);
            continue;
        }
        Out.push(Line);
    }
    return Out.join("\n");
}

function FormatCodeBlockWithLAFS(Code, Language)
{
    const CleanLang = (Language || "").trim().toLowerCase();
    const SupportedLangs = new Set(["c", "cpp", "csharp", "cs", "js", "ts", "jsx", "tsx", "sh", "bash", "kt", "kotlin", "dart", "rust", "rs", "typ", "typst"]);
    const LangMap = {
        "cs": "csharp",
        "bash": "sh",
        "kotlin": "kt",
        "rs": "rust",
        "typst": "typ"
    };
    const TargetLang = LangMap[CleanLang] || CleanLang;
    if (!SupportedLangs.has(TargetLang))
    {
        return (TargetLang === "typ") ? Code : InProcessFormatSnippetLAFS(Code);
    }

    if (LAFS_BINARY)
    {
        const Integrity = VerifyLafsBinaryIntegrity(LAFS_BINARY);
        if (Integrity.Valid)
        {
            try
            {
                const Proc = ChildProcess.spawnSync
                (
                    LAFS_BINARY,
                    ["-l", TargetLang, "--no-log", "-c", "160", "-"],
                    {
                        input: Code,
                        encoding: "utf-8",
                        timeout: 5000,
                        windowsHide: true,
                        shell: false,
                        cwd: TEMP_DIR
                    }
                );
                if (Proc.status === 0 && Proc.stdout)
                {
                    return Proc.stdout.trimEnd();
                }
            }
            catch (Err)
            {
                // Fallback on execution glitch
            }
        }
        else
        {
            console.warn(`[SECURITY INTEGRITY ALERT] LAFS binary integrity failed: ${Integrity.Reason}. Utilizing in-process immutable engine.`);
        }
    }

    return (TargetLang === "typ") ? Code : InProcessFormatSnippetLAFS(Code);
}

function ResolveTypstBinary()
{
    const BinaryName = process.platform === "win32" ? "typst.exe": "typst";
    const SearchLocations =
    [
        process.env.TYPST_BINARY,
        Path.resolve(__dirname, "..", "target", "release", BinaryName),
        Path.resolve(__dirname, "..", "target", "debug", BinaryName),
        Path.join(__dirname, "bin", BinaryName),
        Path.join(__dirname, BinaryName),
        Path.resolve(__dirname, "..", BinaryName)
    ];

    let BestCandidate = null;
    let BestMtime = -1;

    for (const Candidate of SearchLocations)
    {
        if (Candidate && FS.existsSync(Candidate))
        {
            try
            {
                const Stat = FS.statSync(Candidate);
                if (Stat.isFile() && Stat.mtimeMs > BestMtime)
                {
                    BestMtime = Stat.mtimeMs;
                    BestCandidate = Candidate;
                }
            }
            catch (Ignored)
            {
                if (!BestCandidate)
                {
                    BestCandidate = Candidate;
                }
            }
        }
    }

    if (BestCandidate)
    {
        return BestCandidate;
    }

    return Path.resolve(__dirname, "..", "target", "release", BinaryName);
}

const TYPST_BINARY = ResolveTypstBinary();
const TEMP_DIR = Path.resolve(__dirname, ".temp");
const PUBLIC_DIR = Path.resolve(__dirname, "public");
const WORKSPACE_CONFIG_FILE = Path.resolve(__dirname, ".workspace_config.json");

const ActiveCompileProcesses = new Map();
let ActiveCompileProcess = null;
let ActiveJobDir = null;
const ActiveSyncMapsByFile = new Map();
const ActiveSpanMapsByFile = new Map();
let LastActiveSpanMap = {};
let LastActiveSyncMap = [];
let JobCounter = 1;

function IsPathContainedIn(ParentDir, ChildPath)
{
    let CanonParent = Path.resolve(ParentDir);
    let CanonChild = Path.resolve(ChildPath);
    if (process.platform === "win32")
    {
        CanonParent = CanonParent.toLowerCase();
        CanonChild = CanonChild.toLowerCase();
    }
    const Rel = Path.relative(CanonParent, CanonChild);
    return !Rel.startsWith("..") && !Path.isAbsolute(Rel);
}

function ResolveDocRoot(FilePath, JobDir)
{
    if (FilePath)
    {
        let StartDir = Path.resolve(FilePath);
        try
        {
            if (FS.existsSync(StartDir))
            {
                if (!FS.statSync(StartDir).isDirectory())
                {
                    StartDir = Path.dirname(StartDir);
                }
            }
            else if (Path.extname(StartDir))
            {
                StartDir = Path.dirname(StartDir);
            }
        }
        catch (Ignored)
        {
            StartDir = Path.dirname(StartDir);
        }

        // 1. Upward walk for official Typst package manifest: typst.toml
        let Current = StartDir;
        while (Current)
        {
            if (FS.existsSync(Path.join(Current, "typst.toml")))
            {
                return Current;
            }
            const Parent = Path.dirname(Current);
            if (!Parent || Parent === Current)
            {
                break;
            }
            Current = Parent;
        }

        // 2. Match against tracked workspace directories: choose deepest containing match
        // Tracked workspace folders (e.g. docs/) take precedence over parent repos and local subfolders
        const TrackedDirs = GetTrackedDirectories();
        let BestTracked = null;
        for (const Dir of TrackedDirs)
        {
            if (IsPathContainedIn(Dir, StartDir))
            {
                if (!BestTracked || Dir.length > BestTracked.length)
                {
                    BestTracked = Path.resolve(Dir);
                }
            }
        }
        if (BestTracked)
        {
            return BestTracked;
        }

        // 3. Upward walk for version control or studio boundary: .git or .typst-studio
        Current = StartDir;
        while (Current)
        {
            if
            (
                FS.existsSync(Path.join(Current, ".typst-studio")) ||
                FS.existsSync(Path.join(Current, ".git"))
            )
            {
                return Current;
            }
            const Parent = Path.dirname(Current);
            if (!Parent || Parent === Current)
            {
                break;
            }
            Current = Parent;
        }

        return StartDir;
    }
    return JobDir;
}

async function PrepareCompilationInput(Source, FilePath, JobID)
{
    if (FilePath)
    {
        const Resolved = Path.resolve(FilePath);
        if (FS.existsSync(Resolved))
        {
            try
            {
                if (FS.statSync(Resolved).isFile())
                {
                    const DiskContent = await FSPromises.readFile(Resolved, "utf-8");
                    if (DiskContent === Source)
                    {
                        return { InputArg: Resolved, ShadowFile: null };
                    }
                }
            }
            catch (Ignored)
            {
                // Fallback to shadow file
            }
        }

        const Parent = Path.dirname(Resolved);
        if (FS.existsSync(Parent))
        {
            try
            {
                if (FS.statSync(Parent).isDirectory())
                {
                    const ShadowFile = Path.join(Parent, `.preview_${JobID}.typ`);
                    await FSPromises.writeFile(ShadowFile, Source, "utf-8");
                    return { InputArg: ShadowFile, ShadowFile: ShadowFile };
                }
            }
            catch (Ignored)
            {
                // Fallback to stdin
            }
        }
    }
    return { InputArg: "-", ShadowFile: null };
}

if (!FS.existsSync(TEMP_DIR))
{
    FS.mkdirSync(TEMP_DIR, { recursive: true });
}

function GetLocalFontArgs()
{
    const Args = [];
    const CandidateDirs =
    [
        Path.join(PUBLIC_DIR, "fonts"),
        Path.resolve(__dirname, "..", "assets", "fonts"),
        Path.resolve(__dirname, "assets", "fonts")
    ];
    for (const Dir of CandidateDirs)
    {
        if (FS.existsSync(Dir))
        {
            Args.push("--font-path", Dir);
        }
    }
    return Args;
}

function ApplySecurityHeaders(Response)
{
    Response.setHeader("X-Content-Type-Options", "nosniff");
    Response.setHeader("X-Frame-Options", "DENY");
    Response.setHeader("Referrer-Policy", "no-referrer");
    Response.setHeader
    (
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: blob:; connect-src 'self' https://cdnjs.cloudflare.com; worker-src 'self' blob:; frame-ancestors 'none';"
    );
}

function ValidateWorkspacePath(CandidatePath, MustExist = false, CheckExtension = false)
{
    if (!CandidatePath || typeof CandidatePath !== "string")
    {
        return { Valid: false, Error: "Invalid path specification." };
    }

    if (CandidatePath.includes("\0"))
    {
        return { Valid: false, Error: "Access denied: Path contains prohibited null byte." };
    }
    // Windows Alternate Data Streams (ADS) protection: Colon is only allowed as drive letter (e.g. C:)
    const AfterDrive = process.platform === "win32" && /^[a-zA-Z]:/.test(CandidatePath)
    ? CandidatePath.slice(2)
    : CandidatePath;

    if (AfterDrive.includes(":"))
    {
        return { Valid: false, Error: "Access denied: Alternate Data Streams are strictly prohibited." };
    }

    const Resolved = Path.resolve(CandidatePath);
    const AllowedRoots = GetTrackedDirectories().map( (D) => Path.resolve(D));

    const IsContained = AllowedRoots.some
    (
        (Root) =>
        {
            const Relative = Path.relative(Root, Resolved);
            return ! Relative.startsWith("..") && ! Path.isAbsolute(Relative);
        }
    );

    if (!IsContained)
    {
        return { Valid: false, Error: "Access denied: Path is outside tracked workspace directories." };
    }

    const BaseName = Path.basename(Resolved).toLowerCase();
    const NormalizedBase = BaseName.replace(/[.\s]+$/, "");

    if (PROTECTED_SYSTEM_FILES.has(NormalizedBase))
    {
        return { Valid: false, Error: `Access denied: '${Path.basename(Resolved)}' is a protected system configuration file.` };
    }

    if (CheckExtension)
    {
        const Ext = Path.extname(Resolved).toLowerCase();
        const ExtFromNormalized = ("." + NormalizedBase.split(".").pop()).toLowerCase();

        if (FORBIDDEN_EXTENSIONS.has(Ext) || FORBIDDEN_EXTENSIONS.has(ExtFromNormalized))
        {
            return { Valid: false, Error: `Access denied: Files with extension '${Ext}' cannot be created, modified, or deleted.` };
        }
    }

    if (MustExist && !FS.existsSync(Resolved))
    {
        return { Valid: false, Error: "Target file does not exist." };
    }

    return { Valid: true, Path: Resolved };
}

function VerifyClientAuthorization(Request)
{
    // Whitelist Host header to mitigate DNS Rebinding
    const RawHost = (Request.headers.host || "").toLowerCase().trim();
    const HostWithoutPort = RawHost.replace(/:\d+$/, "");

    const AllowedBaseHosts = new Set
    ([
        "127.0.0.1",
        "localhost",
        "[::1]",
        "::1"
    ]);

    const AllowedHosts = new Set
    ([
        `127.0.0.1:${PORT}`,
        `localhost:${PORT}`,
        `[::1]:${PORT}`,
        "127.0.0.1",
        "localhost",
        "[::1]"
    ]);

    if (!AllowedHosts.has(RawHost) && !AllowedBaseHosts.has(HostWithoutPort))
    {
        return { Authorized: false, Status: 400, Error: "Bad Request: Invalid Host header." };
    }
    // Protect all state-modifying requests and sensitive file operations with local session token
    const URLInstance = new URL(Request.url, `http://${Request.headers.host}`);
    const Pathname = URLInstance.pathname;
    const SafePublicEndpoints = new Set(["/api/status", "/api/auth/token", "/api/fonts", "/api/font-file"]);

    if (Pathname === "/api/auth/token")
    {
        if (Request.method !== "GET" && Request.method !== "HEAD")
        {
            return { Authorized: false, Status: 405, Error: "Method Not Allowed" };
        }

        const SecFetchSite = Request.headers["sec-fetch-site"];
        if (SecFetchSite && SecFetchSite !== "same-origin" && SecFetchSite !== "none")
        {
            return { Authorized: false, Status: 403, Error: "Forbidden: Cross-site request denied." };
        }

        const OriginHeader = Request.headers.origin;
        if (OriginHeader)
        {
            const AllowedOriginPrefixes =
            [
                `http://127.0.0.1:${PORT}`,
                `http://localhost:${PORT}`,
                `http://[::1]:${PORT}`
            ];
            const IsAllowedOrigin = AllowedOriginPrefixes.some( (Prefix) => OriginHeader.startsWith(Prefix));
            if (!IsAllowedOrigin)
            {
                return { Authorized: false, Status: 403, Error: "Forbidden: Cross-origin token access denied." };
            }
        }

        const RefererHeader = Request.headers.referer;
        if (RefererHeader)
        {
            const AllowedRefererPrefixes =
            [
                `http://127.0.0.1:${PORT}/`,
                `http://localhost:${PORT}/`,
                `http://[::1]:${PORT}/`
            ];
            const IsAllowedReferer = AllowedRefererPrefixes.some( (Prefix) => RefererHeader.startsWith(Prefix));
            if (!IsAllowedReferer)
            {
                return { Authorized: false, Status: 403, Error: "Forbidden: Cross-site referer denied." };
            }
        }
    }

    if (Pathname.startsWith("/api/") && !SafePublicEndpoints.has(Pathname))
    {
        const SafeMethods = new Set(["OPTIONS"]);
        if (!SafeMethods.has(Request.method))
        {
            const ClientToken = Request.headers["x-typst-auth-token"];
            if (!ClientToken || ClientToken !== SESSION_AUTH_TOKEN)
            {
                return { Authorized: false, Status: 403, Error: "Forbidden: Missing or invalid authentication token." };
            }
        }
    }

    return { Authorized: true };
}

function NormalizeMathFunctionCalls(Source)
{
    if (!Source || typeof Source !== "string")
    {
        return Source;
    }
    // In Typst math mode ($ ... $), function calls formatted with detached delimiters
    // (e.g., 'mat\n  (' or 'vec\n  (' or 'cases\n  (') must have the opening delimiter attached to the identifier
    // so the Typst math parser recognizes them as MathCall rather than literal text spill.
    // Crucially, we preserve the EXACT line count so Synctex line numbers and compiler diagnostics
    // remain 100% synchronized with the user's Monaco editor lines: 'mat\n  (' -> 'mat(\n   '.
    return Source.replace
    (
        /\$(?:[^$]|\\\$)+\$/g, (MathBlock) =>
        {
            return MathBlock.replace
            (
                /([a-zA-Z_][a-zA-Z0-9_.]*)[^\S\r\n]*(\r?\n)(\s*)([\(\[\{])/g, (Match, Ident, Newline, Indent, Delim) =>
                {
                    return `${Ident}${Delim}${Newline}${Indent} `;
                }
            );
        }
    );
}

function DetectKnrSlop(Source, FileName = "main.typ")
{
    const Lines = (Source || "").split(/\r?\n/);
    const Errors = [];
    // Stack holds active openers: { Delim, Line, Col, LineText }
    const Stack = [];

    let InString = false;
    let InRawBlock = false;
    let InRawInline = false;
    let BlockCommentDepth = 0;
    // Helper to get clean line text with strings/comments masked
    function GetMaskedLine(LineText)
    {
        let Masked = "";
        let InStr = false;
        for (let I = 0; I < LineText.length; I ++)
        {
            const C = LineText[I];
            const NextC = I + 1 < LineText.length ? LineText[I + 1]: "";
            const PrevC = I > 0 ? LineText[I - 1]: "";
            if (C === '"' && PrevC !== "\\")
            {
                InStr = ! InStr;
                Masked += " ";
                continue;
            }
            if (InStr)
            {
                Masked += " ";
                continue;
            }
            if (C === "/" && NextC === "/")
            {
                Masked += " ".repeat(LineText.length - I);
                break;
            }
            Masked += C;
        }
        return Masked;
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineNum = LineIdx + 1;
        const LineText = Lines[LineIdx];
        let InLineComment = false;

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx ++)
        {
            const ColNum = ColIdx + 1;
            const Char = LineText[ColIdx];
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1]: "";
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1]: "";

            if (InLineComment) { break; }
            // Raw blocks ```
            if (!InString && BlockCommentDepth === 0 && Char === "`")
            {
                if (LineText.substring(ColIdx, ColIdx + 3) === "```")
                {
                    InRawBlock = ! InRawBlock;
                    ColIdx += 2;
                    continue;
                }
                else if (!InRawBlock)
                {
                    InRawInline = ! InRawInline;
                    continue;
                }
            }
            if (InRawBlock || InRawInline) { continue; }
            // Block comments /* */
            if (!InString && Char === "/" && NextChar === "*")
            {
                BlockCommentDepth ++;
                ColIdx ++;
                continue;
            }
            if (!InString && BlockCommentDepth > 0 && Char === "*" && NextChar === "/")
            {
                BlockCommentDepth --;
                ColIdx ++;
                continue;
            }
            if (BlockCommentDepth > 0) { continue; }
            // Line comments //
            if (!InString && Char === "/" && NextChar === "/")
            {
                InLineComment = true;
                break;
            }
            // String literals "..."
            if (Char === '"' && PrevChar !== "\\")
            {
                InString = ! InString;
                continue;
            }
            if (InString) { continue; }
            // Multiline display math container: $
            if (Char === "$" && PrevChar !== "\\")
            {
                if (Stack.length > 0 && Stack[Stack.length - 1].Delim === "$")
                {
                    // Closer for $
                    const Opener = Stack.pop();
                    if (LineNum > Opener.Line)
                    {
                        // Multiline math container: evaluate Vector 1 and Vector 2
                        const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                        const MaskedCloserLine = GetMaskedLine(LineText);

                        const OpenerPrefixSemantic = MaskedOpenerLine.substring(0, Opener.Col - 1).replace(/[\(\[\{\$]/g, "").trim();
                        const OpenerSuffixSemantic = MaskedOpenerLine.substring(Opener.Col).replace(/[\(\[\{\$]/g, "").trim();

                        if (OpenerPrefixSemantic.length > 0)
                        {
                            const Anchor = OpenerPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Subtype: "PRECEDING",
                                Delim: "$",
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: Anchor,
                                Reason: "Preceding Semantic Content on Unpaired Opening Container"
                            });
                        }
                        else if (OpenerSuffixSemantic.length > 0)
                        {
                            const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Subtype: "PROCEEDING",
                                Delim: "$",
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: Anchor,
                                Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                            });
                        }

                        const CloserPrefixSemantic = MaskedCloserLine.substring(0, ColNum - 1).replace(/[\)\]\}\$]/g, "").trim();
                        const CloserSuffixSemantic = MaskedCloserLine.substring(ColNum).replace(/[\)\]\}\$]/g, "").trim();

                        if (CloserPrefixSemantic.length > 0)
                        {
                            const Anchor = CloserPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Subtype: "PRECEDING",
                                Delim: "$",
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: Anchor,
                                Reason: "Preceding Semantic Content on Unpaired Closing Container"
                            });
                        }
                        else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                        {
                            const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Subtype: "PROCEEDING",
                                Delim: "$",
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: Anchor,
                                Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                            });
                        }
                    }
                }
                else
                {
                    // Opener for $
                    Stack.push
                    ({
                        Delim: "$",
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText
                    });
                }
                continue;
            }
            // Standard containers: (, [, {
            if (Char === "(" || Char === "{" || Char === "[")
            {
                Stack.push
                ({
                    Delim: Char,
                    Line: LineNum,
                    Col: ColNum,
                    LineText: LineText
                });
            }
            else if (Char === ")" || Char === "}" || Char === "]")
            {
                const MatchDelim = Char === ")" ? "(": (Char === "}" ? "{": "[");

                if (Stack.length === 0 || Stack[Stack.length - 1].Delim !== MatchDelim)
                {
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "MISMATCH",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Char,
                        Reason: "Mismatched Closing Container not mirrored in the Opening Run"
                    });
                    continue;
                }

                const Opener = Stack.pop();
                // Monolith Check: Same line openers and closers are valid Monoliths
                if (LineNum === Opener.Line)
                {
                    continue;
                }
                // Multiline container: Evaluate Vector 1 (Opener line) and Vector 2 (Closer line)
                const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                const MaskedCloserLine = GetMaskedLine(LineText);
                // --- VECTOR 1 EVALUATION (Opening Container Line) ---
                const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
                const OpenerSuffix = MaskedOpenerLine.substring(Opener.Col).trim();
                const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
                const OpenerSuffixSemantic = OpenerSuffix.replace(/[\(\[\{\$]/g, "").trim();

                if (OpenerPrefixSemantic.length > 0)
                {
                    const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 1,
                        Subtype: "PRECEDING",
                        Delim: Opener.Delim,
                        Line: Opener.Line,
                        Col: Opener.Col,
                        LineText: Lines[Opener.Line - 1],
                        Anchor: Anchor,
                        Reason: "Preceding Semantic Content on Unpaired Opening Container"
                    });
                }
                else if (OpenerSuffixSemantic.length > 0)
                {
                    const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 1,
                        Subtype: "PROCEEDING",
                        Delim: Opener.Delim,
                        Line: Opener.Line,
                        Col: Opener.Col,
                        LineText: Lines[Opener.Line - 1],
                        Anchor: Anchor,
                        Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                    });
                }
                // --- VECTOR 2 EVALUATION (Closing Container Line) ---
                const CloserPrefix = MaskedCloserLine.substring(0, ColNum - 1).trim();
                const CloserSuffix = MaskedCloserLine.substring(ColNum).trim();
                const CloserPrefixSemantic = CloserPrefix.replace(/[\)\]\}\$]/g, "").trim();
                const CloserSuffixSemantic = CloserSuffix.replace(/[\)\]\}\$]/g, "").trim();

                if (CloserPrefixSemantic.length > 0)
                {
                    const Anchor = CloserPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefix;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "PRECEDING",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Anchor,
                        Reason: "Preceding Semantic Content on Unpaired Closing Container"
                    });
                }
                else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                {
                    const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "PROCEEDING",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Anchor,
                        Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                    });
                }
            }
        }
    }
    // Remaining unclosed openers that span beyond end of file
    for (const Opener of Stack)
    {
        if (Lines.length > Opener.Line)
        {
            const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
            const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
            const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
            if (OpenerPrefixSemantic.length > 0)
            {
                const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                Errors.push
                ({
                    Type: "KNR_SLOP",
                    Vector: 1,
                    Subtype: "PRECEDING",
                    Delim: Opener.Delim,
                    Line: Opener.Line,
                    Col: Opener.Col,
                    LineText: Lines[Opener.Line - 1],
                    Anchor: Anchor,
                    Reason: "Preceding Semantic Content on Unpaired Opening Container"
                });
            }
        }
    }
    // Deduplicate errors by Line + Col + Vector + Subtype
    const UniqueErrors = [];
    const SeenKeys = new Set();
    for (const Err of Errors)
    {
        const Key = `${Err.Line}:${Err.Col}:${Err.Vector}:${Err.Subtype}`;
        if (!SeenKeys.has(Key))
        {
            SeenKeys.add(Key);
            UniqueErrors.push(Err);
        }
    }

    if (UniqueErrors.length === 0)
    {
        return { HasError: false, Errors:[] };
    }

    const First = UniqueErrors[0];
    const LineStr = String(First.Line);
    const Margin = " ".repeat(Math.max(2, LineStr.length));
    const FormattedLineNum = LineStr.padStart(Margin.length, " ");
    const PointerIndent = " ".repeat(Math.max(0, First.Col - 1));
    const AnchorTarget = First.Anchor ? `'${First.Anchor}'`: "the statement";

    let ActionHint = "";
    if (First.Vector === 1)
    {
        if (First.Subtype === "PRECEDING")
        {
            ActionHint = `Move opening container '${First.Delim}' to a new line aligned with ${AnchorTarget} and indent it properly if needed`;
        }
        else
        {
            ActionHint = `Move semantic content proceeding '${First.Delim}' to a new line indented within the container`;
        }
    }
    else if (First.Vector === 2)
    {
        if (First.Subtype === "PRECEDING")
        {
            ActionHint = `Move closing container '${First.Delim}' to a new line aligned with the opening container`;
        }
        else if (First.Subtype === "PROCEEDING")
        {
            ActionHint = `Move semantic content proceeding '${First.Delim}' to a new line`;
        }
        else if (First.Subtype === "MISMATCH")
        {
            ActionHint = `Closing container '${First.Delim}' does not mirror the opening container run in reverse sequence`;
        }
        else
        {
            ActionHint = `Format closing container '${First.Delim}' onto its own coordinate-aligned line`;
        }
    }
    else
    {
        ActionHint = `Move container '${First.Delim}' to a new line aligned with ${AnchorTarget} and indent it properly if needed`;
    }

    const FormattedMessage =
    `error: Severe Critical Fatal Error & Structural Failure: Defecated (Deprecated | Outdated | Legacy) Structural Failure of 1978 K&R Slop detected: Headless multiline container: Container Asymmetry & Ugly Formatting are strictly Forbidden.
${Margin}┌─ ${FileName}:${First.Line}:${First.Col}
${Margin}│
${FormattedLineNum}│ ${First.LineText}
${Margin}│${PointerIndent}^ ${ActionHint}
${Margin}│
Hint: Click the button "Format LAFS" to fix it.`;

    return {
        HasError: true,
        Errors: UniqueErrors,
        PrimaryError: First,
        FormattedMessage: FormattedMessage
    };
}

function TryFormatTypstNative(Source)
{
    if (!Source || typeof Source !== "string")
    {
        return { Success: true, Formatted: Source || "", Error: null };
    }

    if (!LAFS_BINARY)
    {
        return { Success: false, Formatted: Source, Error: "Native LAFS binary is unavailable; source kept untouched." };
    }

    const Integrity = VerifyLafsBinaryIntegrity(LAFS_BINARY);
    if (!Integrity.Valid)
    {
        return { Success: false, Formatted: Source, Error: `Native LAFS integrity failed (${Integrity.Reason}); source kept untouched.` };
    }

    let Formatted = null;
    try
    {
        const Proc = ChildProcess.spawnSync
        (
            LAFS_BINARY,
            ["-l", "typ", "--no-log", "-c", "160", "-"],
            {
                input: Source,
                encoding: "utf-8",
                timeout: 5000,
                windowsHide: true,
                shell: false,
                cwd: TEMP_DIR
            }
        );
        if (Proc.status === 0 && Proc.stdout)
        {
            Formatted = Proc.stdout.trimEnd();
        }
        else
        {
            return { Success: false, Formatted: Source, Error: Proc.stderr || "Native LAFS formatter returned non-zero exit status." };
        }
    }
    catch (Err)
    {
        return { Success: false, Formatted: Source, Error: Err.message || "Native LAFS formatting failed." };
    }

    const Lines = Formatted.split(/\r?\n/);
    const ResultLines = [];
    let InRawBlock = false;
    let CurrentRawLang = "";
    let CurrentRawLines = [];

    for (let I = 0; I < Lines.length; I++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            if (!InRawBlock)
            {
                InRawBlock = true;
                CurrentRawLang = Trimmed.slice(3).trim();
                CurrentRawLines = [];
                ResultLines.push(Line);
            }
            else
            {
                InRawBlock = false;
                const RawCode = CurrentRawLines.join("\n");
                if (RawCode.trim().length > 0 && CurrentRawLang)
                {
                    const FormattedBlock = FormatCodeBlockWithLAFS(RawCode, CurrentRawLang);
                    ResultLines.push(FormattedBlock);
                }
                else
                {
                    ResultLines.push(...CurrentRawLines);
                }
                ResultLines.push(Line);
            }
            continue;
        }

        if (InRawBlock)
        {
            CurrentRawLines.push(Line);
            continue;
        }

        ResultLines.push(Line);
    }

    return { Success: true, Formatted: ResultLines.join("\n"), Error: null };
}

function FormatTypstLAFS(Source)
{
    return TryFormatTypstNative(Source).Formatted;
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

    const ExistingDefaults = PotentialDefaults.filter( (Dir) => FS.existsSync(Dir));
    const DefaultDirs = ExistingDefaults.length > 0 ? ExistingDefaults:[Path.join(UserHome, "Documents")];

    if (!FS.existsSync(WORKSPACE_CONFIG_FILE))
    {
        try
        {
            FS.writeFileSync
            (
                WORKSPACE_CONFIG_FILE, JSON.stringify( { Directories: DefaultDirs }, null, 4), "utf-8"
            );
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
        return Array.isArray(Parsed.Directories) ? Parsed.Directories: DefaultDirs;
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
        FS.writeFileSync
        (
            WORKSPACE_CONFIG_FILE, JSON.stringify( { Directories: Directories }, null, 4), "utf-8"
        );
    }
    catch (E)
    {
    }
}

async function ScanDirectoryRecursive(CurrentDir, MaxDepth = 6, CurrentDepth = 0)
{
    const Result = { Files:[], Folders:[] };
    if (CurrentDepth > MaxDepth || !FS.existsSync(CurrentDir))
    {
        return Result;
    }

    try
    {
        const Entries = await FSPromises.readdir(CurrentDir, { withFileTypes: true });
        for (const Entry of Entries)
        {
            if (Entry.name.startsWith(".") || Entry.name === "node_modules" || Entry.name === "target" || Entry.name === "bin")
            {
                continue;
            }

            const FullPath = Path.join(CurrentDir, Entry.name);

            if (Entry.isFile())
            {
                if (Entry.name.toLowerCase().endsWith(".typ"))
                {
                    try
                    {
                        const Stats = await FSPromises.stat(FullPath);
                        Result.Files.push
                        ({
                            Name: Entry.name,
                            Path: FullPath,
                            Directory: CurrentDir,
                            Size: Stats.size,
                            Modified: Stats.mtime.toISOString()
                        });
                    }
                    catch (StatErr) {}
                }
            }
            else if (Entry.isDirectory())
            {
                try
                {
                    const Stats = await FSPromises.stat(FullPath);
                    Result.Folders.push
                    ({
                        Name: Entry.name,
                        Path: FullPath,
                        ParentDirectory: CurrentDir,
                        Modified: Stats.mtime.toISOString()
                    });

                    const SubResult = await ScanDirectoryRecursive(FullPath, MaxDepth, CurrentDepth + 1);
                    Result.Files.push(...SubResult.Files);
                    Result.Folders.push(...SubResult.Folders);
                }
                catch (SubErr) {}
            }
        }
    }
    catch (Err) {}

    return Result;
}

async function ScanTypstFiles()
{
    const Dirs = GetTrackedDirectories();
    const AllFiles = [];
    const AllFolders = [];

    for (const Dir of Dirs)
    {
        if (!FS.existsSync(Dir))
        {
            continue;
        }

        const ScanResult = await ScanDirectoryRecursive(Dir);
        AllFiles.push(...ScanResult.Files);
        AllFolders.push(...ScanResult.Folders);
    }

    const SeenFiles = new Set();
    const UniqueFiles = [];
    for (const File of AllFiles)
    {
        const Normalized = Path.resolve(File.Path).toLowerCase();
        if (!SeenFiles.has(Normalized))
        {
            SeenFiles.add(Normalized);
            UniqueFiles.push(File);
        }
    }

    const SeenFolders = new Set();
    const UniqueFolders = [];
    for (const Folder of AllFolders)
    {
        const Normalized = Path.resolve(Folder.Path).toLowerCase();
        if (!SeenFolders.has(Normalized))
        {
            SeenFolders.add(Normalized);
            UniqueFolders.push(Folder);
        }
    }

    for (const Folder of UniqueFolders)
    {
        const FolderNorm = Path.resolve(Folder.Path).toLowerCase();
        const FolderPrefix = FolderNorm + Path.sep.toLowerCase();
        Folder.FileCount = UniqueFiles.filter
        (
            (F) =>
            {
                const FileDirNorm = Path.resolve(F.Directory).toLowerCase();
                return FileDirNorm === FolderNorm || FileDirNorm.startsWith(FolderPrefix);
            }
        )
        .length;
    }

    return { Directories: Dirs, Files: UniqueFiles, Folders: UniqueFolders };
}

function ExecuteCommand(Command, Arguments, Options = {}, StdinData = null)
{
    const CommandBase = Path.basename(Command).toLowerCase();
    const CommandResolved = Path.resolve(Command).toLowerCase();
    const TypstResolved = Path.resolve(TYPST_BINARY).toLowerCase();
    const IsAllowed = ALLOWED_SPAWN_BINARIES.has(CommandBase) || CommandResolved === TypstResolved;

    if (!IsAllowed)
    {
        return Promise.resolve
        ({
            Success: false,
            Code: - 1,
            Stdout: "",
            Stderr: `Security Error: Execution of unauthorized binary '${Command}' is strictly prohibited.`
        });
    }

    return new Promise
    (
        (Resolve) =>
        {
            const Child = ChildProcess.spawn
            (
                Command,
                Arguments,
                {
                    cwd: Options.cwd,
                    timeout: Options.timeout || 30000,
                    windowsHide: Options.windowsHide !== undefined ? Options.windowsHide: true,
                    shell: false
                }
            );

            let Stdout = "";
            let Stderr = "";

            if (Child.stdout)
            {
                Child.stdout.on("data", (Chunk) => { Stdout += Chunk; });
            }

            if (Child.stderr)
            {
                Child.stderr.on("data", (Chunk) => { Stderr += Chunk; });
            }

            if (StdinData !== null && Child.stdin)
            {
                Child.stdin.write(StdinData, "utf-8");
                Child.stdin.end();
            }

            Child.on
            (
                "error", (Error) =>
                {
                    Resolve
                    ({
                        Success: false,
                        Code: Error.code || - 1,
                        Stdout: Stdout,
                        Stderr: Error.message || Stderr
                    });
                }
            );

            Child.on
            (
                "close", (Code) =>
                {
                    Resolve
                    ({
                        Success: Code === 0,
                        Code: Code,
                        Stdout: Stdout,
                        Stderr: Stderr
                    });
                }
            );
        }
    );
}

function ExecuteCompile(Command, Arguments, Options = {}, StdinData = null)
{
    const CommandResolved = Path.resolve(Command).toLowerCase();
    const TypstResolved = Path.resolve(TYPST_BINARY).toLowerCase();

    if (CommandResolved !== TypstResolved)
    {
        return Promise.resolve
        ({
            Success: false,
            Code: - 1,
            Stdout: "",
            Stderr: `Security Error: Execution of unauthorized compile binary '${Command}' is strictly prohibited.`
        });
    }

    return new Promise
    (
        (Resolve) =>
        {
            const Child = ChildProcess.spawn
            (
                Command,
                Arguments,
                {
                    cwd: Options.cwd,
                    timeout: Options.timeout || 20000,
                    windowsHide: true,
                    shell: false
                }
            );

            let Stdout = "";
            let Stderr = "";

            if (Child.stdout)
            {
                Child.stdout.on("data", (Chunk) => { Stdout += Chunk; });
            }

            if (Child.stderr)
            {
                Child.stderr.on("data", (Chunk) => { Stderr += Chunk; });
            }

            if (StdinData !== null && Child.stdin)
            {
                Child.stdin.write(StdinData, "utf-8");
                Child.stdin.end();
            }

            Child.on
            (
                "error", (Error) =>
                {
                    if (Options.FileKey && ActiveCompileProcesses.get(Options.FileKey)?.Process === Child)
                    {
                        ActiveCompileProcesses.delete(Options.FileKey);
                    }
                    if (ActiveCompileProcess === Child) { ActiveCompileProcess = null; }
                    Resolve
                    ({
                        Success: false,
                        Code: Error.code || - 1,
                        Killed: Child.killed,
                        Stdout: Stdout,
                        Stderr: Error.message || Stderr
                    });
                }
            );

            Child.on
            (
                "close", (Code) =>
                {
                    if (Options.FileKey && ActiveCompileProcesses.get(Options.FileKey)?.Process === Child)
                    {
                        ActiveCompileProcesses.delete(Options.FileKey);
                    }
                    if (ActiveCompileProcess === Child) { ActiveCompileProcess = null; }
                    Resolve
                    ({
                        Success: Code === 0,
                        Code: Code,
                        Killed: Child.killed,
                        Stdout: Stdout,
                        Stderr: Stderr
                    });
                }
            );

            if (!Options.IsBackground)
            {
                ActiveCompileProcess = Child;
                if (Options.FileKey)
                {
                    ActiveCompileProcesses.set(Options.FileKey, { Process: Child, JobDir: Options.cwd });
                }
            }
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
            let TotalBytes = 0;

            Request.on
            (
                "data", (Chunk) =>
                {
                    TotalBytes += Chunk.length;
                    if (TotalBytes > MAX_REQUEST_BODY_BYTES)
                    {
                        Request.destroy();
                        Reject(new Error("Payload entity too large. Limit is 10 MB."));
                        return ;
                    }
                    Body += Chunk;
                }
            );

            Request.on
            (
                "end", () => { Resolve(Body); }
            );
            Request.on
            (
                "error", (Error) => { Reject(Error); }
            );
        }
    );
}

const PREDEFINED_MATH_OPERATORS = new Set
([
    "arccos", "arcsin", "arctan", "arg", "cos", "cosh", "cot", "coth",
    "csc", "csch", "ctg", "deg", "det", "dim", "exp", "gcd", "lcm",
    "hom", "id", "im", "inf", "ker", "lg", "lim", "liminf", "limsup",
    "ln", "log", "max", "min", "mod", "Pr", "sec", "sech", "sin",
    "sinc", "sinh", "sup", "tan", "tanh", "tg", "tr", "dif", "Dif"
]);

function GetMathIntervals(Source)
{
    const Intervals = [];
    const Regex = /(?<!\\)\$(?:[^$]|\\\$)*\$/g;
    let Match;

    while
    (
        (Match = Regex.exec(Source)) !== null
    )
    {
        Intervals.push
        ({
            Start: Match.index, End: Match.index + Match[0].length
        });
    }

    return Intervals;
}

function EnrichMathSyncMap(SyncMap, Source, SvgPages)
{
    if (!SyncMap || !Source)
    {
        return SyncMap || [];
    }

    const Enriched = [...SyncMap];
    const Lines = Source.split(/\r?\n/);
    const MathIntervals = GetMathIntervals(Source);
    let ByteOffset = 0;
    const ClaimedGroups = new Map();

    const LineMap = new Map();
    for (const E of Enriched)
    {
        if (!LineMap.has(E.line))
        {
            LineMap.set(E.line,[]);
        }
        LineMap.get(E.line).push(E);
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineText = Lines[LineIdx];
        const LineNum = LineIdx + 1;

        const Regex = /\b([a-zA-Z_]+)\b/g;
        let Match;

        while
        (
            (Match = Regex.exec(LineText)) !== null
        )
        {
            const Ident = Match[1];
            if (!PREDEFINED_MATH_OPERATORS.has(Ident))
            {
                continue;
            }

            const Col = Match.index + 1;
            const EndCol = Col + Ident.length;
            const Start = ByteOffset + Match.index;
            const End = Start + Ident.length;

            const InsideMath = MathIntervals.some( (Int) => Start >= Int.Start && End <= Int.End);
            if (!InsideMath)
            {
                continue;
            }

            const LineElems = LineMap.get(LineNum) || [];
            const Exists = LineElems.some
            (
                (E) => Math.abs(E.col - Col) <= 1 && Math.abs(E.end_col - EndCol) <= 1
            );

            if (Exists)
            {
                continue;
            }

            LineElems.sort( (A, B) => A.col - B.col);

            let PageNum = 1;
            let EstY = null;
            let EstH = 11.0;
            let EstX = null;
            let EstW = Ident.length * 5.3;

            const NextElem = LineElems.find( (E) => E.col >= EndCol);
            const PrevElem = [...LineElems].reverse().find( (E) => E.end_col <= Col);

            if (NextElem)
            {
                PageNum = NextElem.page;
                EstY = NextElem.y;
                EstH = NextElem.height;
                EstX = NextElem.x - EstW - 1.0;
            }
            else if (PrevElem)
            {
                PageNum = PrevElem.page;
                EstY = PrevElem.y;
                EstH = PrevElem.height;
                EstX = PrevElem.x + PrevElem.width + 1.0;
            }
            else
            {
                const EqElems = Enriched.filter( (E) => LineNum >= E.line && LineNum <= E.end_line);
                if (EqElems.length > 0)
                {
                    PageNum = EqElems[0].page;
                    EstY = EqElems[0].y;
                    EstH = EqElems[0].height;
                }
            }

            if (SvgPages && SvgPages[PageNum - 1])
            {
                const Svg = SvgPages[PageNum - 1];
                if (!ClaimedGroups.has(PageNum))
                {
                    ClaimedGroups.set(PageNum, new Set());
                }
                const Claimed = ClaimedGroups.get(PageNum);

                const GroupRegex = /<g transform="matrix\(1 0 0 -1 ([^ ]+) ([^)]+)\)">([\s\S]*?)<\/g>/g;
                let GMatch;
                let BestGroup = null;
                let BestDist = Infinity;
                let BestMatchIndex = - 1;

                while
                (
                    (GMatch = GroupRegex.exec(Svg)) !== null
                )
                {
                    const GroupIndex = GMatch.index;
                    if (Claimed.has(GroupIndex))
                    {
                        continue;
                    }

                    const Tx = parseFloat(GMatch[1]);
                    const Ty = parseFloat(GMatch[2]);
                    const Uses = [...GMatch[3].matchAll(/<use[^>]*x="([^"]*)"/g)].map
                    (
                        (U) => parseFloat(U[1])
                    );

                    if (Uses.length === Ident.length)
                    {
                        const GroupY = Ty - EstH;
                        const YDist = EstY !== null ? Math.abs(GroupY - EstY): 0;
                        const XDist = EstX !== null ? Math.abs(Tx - EstX): 0;
                        const TotalDist = (YDist * 10) + XDist;

                        if (YDist < 4.0 && TotalDist < BestDist)
                        {
                            BestDist = TotalDist;
                            const MinUseX = Math.min(...Uses);
                            const MaxUseX = Math.max(...Uses);
                            BestGroup =
                            {
                                X: Tx + MinUseX,
                                Y: GroupY,
                                Width: (MaxUseX - MinUseX) + 5.5,
                                Height: EstH
                            };
                            BestMatchIndex = GroupIndex;
                        }
                    }
                }

                if (BestGroup)
                {
                    Claimed.add(BestMatchIndex);
                    EstX = BestGroup.X;
                    EstY = BestGroup.Y;
                    EstW = BestGroup.Width;
                    EstH = BestGroup.Height;
                }
            }

            if (EstX !== null && EstY !== null)
            {
                Enriched.push
                ({
                    page: PageNum,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    x: EstX,
                    y: EstY,
                    width: EstW,
                    height: EstH,
                    span: `synth_math_${LineNum}_${Col}`
                });
            }
        }

        ByteOffset += LineText.length + 1;
    }

    return Enriched;
}

function EnrichFunctionCalls(SyncMap, SourceCode)
{
    if (!SyncMap || !SourceCode)
    {
        return SyncMap || [];
    }

    const Enriched = [...SyncMap];
    const Lines = SourceCode.split(/\r?\n/);

    const DefRegex = /#let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*=/g;
    let DefMatch;
    const Definitions = [];

    while
    (
        (DefMatch = DefRegex.exec(SourceCode)) !== null
    )
    {
        const FuncName = DefMatch[1];
        const Params = DefMatch[2].split(",").map( (P) => P.trim());
        const DefOffset = DefMatch.index;

        let DefLine = 1;
        let CurrOff = 0;
        for (let I = 0; I < Lines.length; I ++)
        {
            if (CurrOff + Lines[I].length + 1 > DefOffset)
            {
                DefLine = I + 1;
                break;
            }
            CurrOff += Lines[I].length + 1;
        }

        let OpenChar = "";
        let CloseChar = "";
        let BodyStart = - 1;
        for (let I = DefMatch.index + DefMatch[0].length; I < SourceCode.length; I ++)
        {
            if (SourceCode[I] === "{" || SourceCode[I] === "(")
            {
                OpenChar = SourceCode[I];
                CloseChar = OpenChar === "{" ? "}": ")";
                BodyStart = I;
                break;
            }
        }
        if (BodyStart === - 1)
        {
            continue;
        }

        let Depth = 1;
        let BodyEnd = - 1;
        for (let I = BodyStart + 1; I < SourceCode.length; I ++)
        {
            if (SourceCode[I] === OpenChar)
            {
                Depth ++;
            }
            else if (SourceCode[I] === CloseChar)
            {
                Depth --;
                if (Depth === 0)
                {
                    BodyEnd = I;
                    break;
                }
            }
        }
        if (BodyEnd === - 1)
        {
            continue;
        }

        let EndLine = 1;
        CurrOff = 0;
        for (let I = 0; I < Lines.length; I ++)
        {
            if (CurrOff + Lines[I].length + 1 > BodyEnd)
            {
                EndLine = I + 1;
                break;
            }
            CurrOff += Lines[I].length + 1;
        }

        Definitions.push
        ({
            Name: FuncName,
            Params: Params,
            DefOffset: DefOffset,
            DefEndOffset: BodyEnd,
            DefLineStart: DefLine,
            DefLineEnd: EndLine
        });
    }

    for (const Def of Definitions)
    {
        const BodyElems = SyncMap.filter( (E) => E.line >= Def.DefLineStart && E.end_line <= Def.DefLineEnd);
        const RawRects = BodyElems.filter( (E) => E.width > 50 && E.height > 20);
        const UniqueRects = [];

        for (const R of RawRects)
        {
            const Exists = UniqueRects.some
            (
                (U) => (U.page || 1) === (R.page || 1) && Math.abs(U.x - R.x) < 2 && Math.abs(U.y - R.y) < 2
            );
            if (!Exists)
            {
                UniqueRects.push(R);
            }
        }

        UniqueRects.sort
        (
            (A, B) => ( (A.page || 1) - (B.page || 1)) || (A.y - B.y) || (A.x - B.x)
        );

        const CallRegex = new RegExp("\\b" + Def.Name + "\\s*\\(([^)]*)\\)", "g");
        let CallMatch;
        let InstanceIndex = 0;

        while
        (
            (CallMatch = CallRegex.exec(SourceCode)) !== null
        )
        {
            if (CallMatch.index < Def.DefEndOffset)
            {
                continue;
            }

            const CallStart = CallMatch.index;
            const CallEnd = CallStart + CallMatch[0].length;
            const ArgsText = CallMatch[1];

            let CallLine = 1;
            let LineStartOff = 0;
            for (let I = 0; I < Lines.length; I ++)
            {
                if (LineStartOff + Lines[I].length + 1 > CallStart)
                {
                    CallLine = I + 1;
                    break;
                }
                LineStartOff += Lines[I].length + 1;
            }
            const CallCol = CallStart - LineStartOff + 1;
            const CallEndCol = CallCol + CallMatch[0].length;

            if (InstanceIndex < UniqueRects.length)
            {
                const InstanceRect = UniqueRects[InstanceIndex];
                const PageNum = InstanceRect.page || 1;

                const InstElems = BodyElems.filter
                (
                    (E) => (E.page || 1) === PageNum &&
                    E.x >= InstanceRect.x - 2 && (E.x + E.width) <= (InstanceRect.x + InstanceRect.width + 2) &&
                    E.y >= InstanceRect.y - 2 && (E.y + E.height) <= (InstanceRect.y + InstanceRect.height + 2)
                );

                Enriched.push
                ({
                    page: PageNum,
                    line: CallLine,
                    col: CallCol,
                    end_line: CallLine,
                    end_col: CallEndCol,
                    start: CallStart,
                    end: CallEnd,
                    x: InstanceRect.x,
                    y: InstanceRect.y,
                    width: InstanceRect.width,
                    height: InstanceRect.height,
                    span: "call_box_" + CallLine + "_" + CallCol
                });

                const ArgRegex = /"([^"]*)"|(\b\d+\b)/g;
                let ArgMatch;

                while
                (
                    (ArgMatch = ArgRegex.exec(ArgsText)) !== null
                )
                {
                    const ArgOffsetInCall = CallMatch[0].indexOf(ArgMatch[0]);
                    const ArgStart = CallStart + ArgOffsetInCall;
                    const ArgEnd = ArgStart + ArgMatch[0].length;
                    const ArgCol = CallCol + ArgOffsetInCall;
                    const ArgEndCol = ArgCol + ArgMatch[0].length;

                    if (ArgMatch[1] !== undefined)
                    {
                        const TextElem = InstElems.find
                        (
                            (E) => E.line === Def.DefLineStart + 6 ||
                            (
                                E.height < 15 && E.width > 20 && E.x < InstanceRect.x + InstanceRect.width * 0.5
                            )
                        );
                        if (TextElem)
                        {
                            Enriched.push
                            ({
                                page: PageNum,
                                line: CallLine,
                                col: ArgCol,
                                end_line: CallLine,
                                end_col: ArgEndCol,
                                start: ArgStart,
                                end: ArgEnd,
                                x: TextElem.x,
                                y: TextElem.y,
                                width: TextElem.width,
                                height: TextElem.height,
                                span: "call_arg_" + CallLine + "_" + ArgCol
                            });
                        }
                    }
                    else if (ArgMatch[2] !== undefined)
                    {
                        const ScoreElems = InstElems.filter( (E) => E.x > InstanceRect.x + InstanceRect.width * 0.5 && E.height < 15);
                        if (ScoreElems.length > 0)
                        {
                            const MinX = Math.min
                            (
                                ...ScoreElems.map( (E) => E.x)
                            );
                            const MaxX = Math.max
                            (
                                ...ScoreElems.map( (E) => E.x + E.width)
                            );
                            const MinY = Math.min
                            (
                                ...ScoreElems.map( (E) => E.y)
                            );
                            const MaxY = Math.max
                            (
                                ...ScoreElems.map( (E) => E.y + E.height)
                            );

                            Enriched.push
                            ({
                                page: PageNum,
                                line: CallLine,
                                col: ArgCol,
                                end_line: CallLine,
                                end_col: ArgEndCol,
                                start: ArgStart,
                                end: ArgEnd,
                                x: MinX,
                                y: MinY,
                                width: MaxX - MinX,
                                height: MaxY - MinY,
                                span: "call_arg_" + CallLine + "_" + ArgCol
                            });
                        }
                    }
                }
            }

            InstanceIndex ++;
        }
    }

    return Enriched;
}

function EnrichReferences(SyncMap, SourceCode)
{
    if (!SyncMap || !SourceCode)
    {
        return SyncMap || [];
    }

    const Enriched = [...SyncMap];
    const Lines = SourceCode.split(/\r?\n/);
    let ByteOffset = 0;

    const LineMap = new Map();
    for (const E of Enriched)
    {
        if (!LineMap.has(E.line))
        {
            LineMap.set(E.line,[]);
        }
        LineMap.get(E.line).push(E);
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineText = Lines[LineIdx];
        const LineNum = LineIdx + 1;
        const RefRegex = /@([a-zA-Z0-9_\-:]+)/g;
        let Match;

        while
        (
            (Match = RefRegex.exec(LineText)) !== null
        )
        {
            const Label = Match[1];
            const Col = Match.index + 1;
            const EndCol = Col + Match[0].length;
            const Start = ByteOffset + Match.index;
            const End = Start + Match[0].length;

            const LineElems = LineMap.get(LineNum) || [];
            const Before = LineElems.filter( (E) => E.start <= Start + 2).sort( (A, B) => B.start - A.start)[0];
            const After = LineElems.filter( (E) => E.start >= End - 1).sort( (A, B) => A.start - B.start)[0];

            if (Before && After && (Before.page || 1) === (After.page || 1) && Math.abs(Before.y - After.y) < 3.0)
            {
                const GapX = Before.x + Before.width;
                const GapW = Math.max(12.0, After.x - GapX);
                Enriched.push
                ({
                    page: Before.page || 1,
                    x: GapX,
                    y: Before.y,
                    width: GapW,
                    height: Before.height,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    span: `ref_${Label}`
                });
            }
            else if (Before)
            {
                Enriched.push
                ({
                    page: Before.page || 1,
                    x: Before.x + Before.width,
                    y: Before.y,
                    width: 35.0,
                    height: Before.height,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    span: `ref_${Label}`
                });
            }
        }

        ByteOffset += LineText.length + 1;
    }

    return Enriched;
}

async function HandleCompile(Request, Response)
{
    const StartTime = Date.now();

    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath): (Payload.FileName || "main.typ");
        const FileKey = Payload.FilePath ? Path.resolve(Payload.FilePath).toLowerCase() : "__default__";
        const IsBackground = Boolean(Payload.IsBackground || Payload.IsThumbnail);

        if (!IsBackground && ActiveCompileProcesses.has(FileKey))
        {
            const Previous = ActiveCompileProcesses.get(FileKey);
            try
            {
                Previous.Process.kill();
            }
            catch (Ignored)
            {
            }
            if (Previous.JobDir)
            {
                FSPromises.rm(Previous.JobDir, { recursive: true, force: true }).catch ( () => {});
            }
            ActiveCompileProcesses.delete(FileKey);
        }

        const KnrCheck = DetectKnrSlop(Source, ActiveFileName);
        if (KnrCheck.HasError)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false,
                    Error: KnrCheck.FormattedMessage,
                    DurationMs: Date.now() - StartTime,
                    KnrSlop: true,
                    Errors: KnrCheck.Errors,
                    PrimaryError: KnrCheck.PrimaryError
                })
            );
            return ;
        }

        const JobID = `job_${Date.now()}_${JobCounter++}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        const DocRoot = ResolveDocRoot(Payload.FilePath, JobDir);
        const OutputPattern = Path.join(JobDir, "page-{p}.svg");
        const SourceToCompile = NormalizeMathFunctionCalls(Source);

        const { InputArg, ShadowFile } = await PrepareCompilationInput(SourceToCompile, Payload.FilePath, JobID);

        let CompileResult;
        try
        {
            CompileResult = await ExecuteCompile
            (
                TYPST_BINARY,
                ["compile", "--features", "html", "--root", DocRoot, "--format", "svg", ...GetLocalFontArgs(), InputArg, OutputPattern],
                { cwd: JobDir, timeout: 20000, FileKey: FileKey, IsBackground: IsBackground },
                InputArg === "-" ? SourceToCompile : null
            );
        }
        finally
        {
            if (ShadowFile)
            {
                await FSPromises.unlink(ShadowFile).catch(() => {});
            }
        }

        if (CompileResult.Killed)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Aborted: true })
            );
            return ;
        }

        const DurationMs = Date.now() - StartTime;

        if (!CompileResult.Success)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
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
            return ;
        }

        const Files = await FSPromises.readdir(JobDir);
        const SvgFiles = Files
        .filter( (FileName) => FileName.startsWith("page-") && FileName.endsWith(".svg"))
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

        let SyncMap = [];
        const SynctexPath = Path.join(JobDir, "synctex.json");
        if (FS.existsSync(SynctexPath))
        {
            try
            {
                const RawSync = await FSPromises.readFile(SynctexPath, "utf-8");
                SyncMap = JSON.parse(RawSync);
                SyncMap = EnrichMathSyncMap(SyncMap, Source, Pages);
                SyncMap = EnrichFunctionCalls(SyncMap, Source);
                SyncMap = EnrichReferences(SyncMap, Source);
            }
            catch (Ignored)
            {
            }
        }

        let SpanMap = {};
        for (const Elem of SyncMap)
        {
            if (Elem.span && !SpanMap[Elem.span])
            {
                SpanMap[Elem.span] = Elem;
            }
        }

        if (!IsBackground)
        {
            LastActiveSyncMap = SyncMap;
            LastActiveSpanMap = SpanMap;
            ActiveSyncMapsByFile.set(FileKey, SyncMap);
            ActiveSpanMapsByFile.set(FileKey, SpanMap);
        }

        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});

        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                Pages: Pages,
                PageCount: Pages.length,
                SyncMap: SyncMap,
                SpanMap: SpanMap,
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

async function HandleResolveClick(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Page = parseInt(Payload.Page, 10) || 1;
        const X = parseFloat(Payload.X);
        const Y = parseFloat(Payload.Y);
        const FileKey = Payload.FilePath ? Path.resolve(Payload.FilePath).toLowerCase() : null;
        const SyncMap = (FileKey && ActiveSyncMapsByFile.get(FileKey)) || LastActiveSyncMap;

        if (isNaN(X) || isNaN(Y))
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Found: false, Error: "Valid X and Y coordinates are required." })
            );
            return ;
        }

        let BestElem = null;
        let MinDist = Infinity;

        for (const Elem of SyncMap)
        {
            if (Elem.page !== Page)
            {
                continue;
            }

            const InX = X >= Elem.x && X <= (Elem.x + Elem.width);
            const InY = Y >= Elem.y && Y <= (Elem.y + Elem.height);

            if (InX && InY)
            {
                BestElem = Elem;
                break;
            }

            const CenterX = Elem.x + (Elem.width / 2);
            const CenterY = Elem.y + (Elem.height / 2);
            const Dx = X - CenterX;
            const Dy = (Y - CenterY) * 3;
            const DistSq = (Dx * Dx) + (Dy * Dy);

            if (DistSq < MinDist)
            {
                MinDist = DistSq;
                BestElem = Elem;
            }
        }

        if (BestElem)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: true,
                    Line: BestElem.line,
                    Column: BestElem.col,
                    EndLine: BestElem.end_line,
                    EndColumn: BestElem.end_col,
                    Start: BestElem.start,
                    End: BestElem.end,
                    Span: BestElem.span
                })
            );
        }
        else
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Found: false, Error: "No matching source location found." })
            );
        }
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Err.message })
        );
    }
}

async function HandleResolveCursor(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Line = parseInt(Payload.Line, 10);
        const Col = parseInt(Payload.Column || Payload.Col, 10);
        const FileKey = Payload.FilePath ? Path.resolve(Payload.FilePath).toLowerCase() : null;
        const SyncMap = (FileKey && ActiveSyncMapsByFile.get(FileKey)) || LastActiveSyncMap;

        if (!Line || !Col)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Found: false, Error: "Line and Column parameters required." })
            );
            return ;
        }

        let BestElem = null;
        let SmallestRange = Infinity;

        for (const Elem of SyncMap)
        {
            const StartsBefore = Elem.line < Line || (Elem.line === Line && Elem.col <= Col);
            const EndsAfter = Elem.end_line > Line || (Elem.end_line === Line && Elem.end_col >= Col);

            if (StartsBefore && EndsAfter)
            {
                const RangeLen = Elem.end - Elem.start;
                if (RangeLen < SmallestRange)
                {
                    SmallestRange = RangeLen;
                    BestElem = Elem;
                }
            }
        }

        if (!BestElem)
        {
            let MinColDist = Infinity;
            for (const Elem of LastActiveSyncMap)
            {
                if (Elem.line === Line)
                {
                    const Dist = Math.abs(Elem.col - Col);
                    if (Dist < MinColDist)
                    {
                        MinColDist = Dist;
                        BestElem = Elem;
                    }
                }
            }
        }

        if (BestElem)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: true,
                    Found: true,
                    Page: BestElem.page,
                    X: BestElem.x,
                    Y: BestElem.y,
                    Width: BestElem.width,
                    Height: BestElem.height,
                    Span: BestElem.span
                })
            );
        }
        else
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Found: false, Error: "No matching preview element found." })
            );
        }
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Err.message })
        );
    }
}

async function HandleResolveSpan(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Span = Payload.Span;
        const FileKey = Payload.FilePath ? Path.resolve(Payload.FilePath).toLowerCase() : null;
        const SpanMap = (FileKey && ActiveSpanMapsByFile.get(FileKey)) || LastActiveSpanMap;

        if (!Span || !SpanMap[Span])
        {
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Span not found in active map." })
            );
            return ;
        }

        const Loc = SpanMap[Span];
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                Span: Span,
                Line: Loc.line,
                Column: Loc.col,
                EndLine: Loc.end_line,
                EndColumn: Loc.end_col,
                Start: Loc.start,
                End: Loc.end
            })
        );
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Err.message })
        );
    }
}

async function HandleCursorSpan(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Line = parseInt(Payload.Line, 10);
        const Col = parseInt(Payload.Column || Payload.Col, 10);
        const FileKey = Payload.FilePath ? Path.resolve(Payload.FilePath).toLowerCase() : null;
        const SpanMap = (FileKey && ActiveSpanMapsByFile.get(FileKey)) || LastActiveSpanMap;

        if (!Line || !Col)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Line and Column parameters required." })
            );
            return ;
        }

        let BestSpan = null;
        let SmallestRange = Infinity;

        for (const[SpanId, Loc] of Object.entries(SpanMap))
        {
            const StartsBefore = Loc.line < Line || (Loc.line === Line && Loc.col <= Col);
            const EndsAfter = Loc.end_line > Line || (Loc.end_line === Line && Loc.end_col >= Col);

            if (StartsBefore && EndsAfter)
            {
                const RangeLen = Loc.end - Loc.start;
                if (RangeLen < SmallestRange)
                {
                    SmallestRange = RangeLen;
                    BestSpan = SpanId;
                }
            }
        }

        if (!BestSpan)
        {
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "No matching span at cursor position." })
            );
            return ;
        }

        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                Span: BestSpan,
                ...SpanMap[BestSpan]
            })
        );
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Err.message })
        );
    }
}

function InvertShapeColorHex(Hex)
{
    let CleanHex = Hex.replace(/^#/, "");
    if (CleanHex.length === 3)
    {
        CleanHex = CleanHex[0] + CleanHex[0] + CleanHex[1] + CleanHex[1] + CleanHex[2] + CleanHex[2];
    }
    const LowerHex = CleanHex.toLowerCase();
    if (LowerHex === "ffffff")
    {
        return "181818";
    }

    const Red = parseInt(CleanHex.slice(0, 2), 16);
    const Green = parseInt(CleanHex.slice(2, 4), 16);
    const Blue = parseInt(CleanHex.slice(4, 6), 16);
    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 22)
    {
        return CleanHex.toUpperCase();
    }

    const Avg = (Red + Green + Blue) / 3;
    const MapComp = (L) =>
    {
        const D = 255 - L;
        if (D <= 3) { return 24; }
        if (D <= 8) { return Math.round(30 + D * 0.8); }
        if (D <= 18) { return Math.round(46 + (D - 8) * 1.2); }
        if (D <= 32) { return Math.round(68 + (D - 18) * 1.2); }
        if (D <= 55) { return Math.round(86 + (D - 32) * 0.6); }
        if (L <= 30) { return 68; }
        return Math.round(255 - L);
    };

    const BaseDark = MapComp(Avg);
    const OutR = Math.max
    (
        0, Math.min
        (
            255, Math.round(BaseDark + (Red - Avg))
        )
    )
    .toString(16).padStart(2, "0").toUpperCase();
    const OutG = Math.max
    (
        0, Math.min
        (
            255, Math.round(BaseDark + (Green - Avg))
        )
    )
    .toString(16).padStart(2, "0").toUpperCase();
    const OutB = Math.max
    (
        0, Math.min
        (
            255, Math.round(BaseDark + (Blue - Avg))
        )
    )
    .toString(16).padStart(2, "0").toUpperCase();
    return `${OutR}${OutG}${OutB}`;
}

function InvertGlyphColorHex(Hex)
{
    let CleanHex = Hex.replace(/^#/, "");
    if (CleanHex.length === 3)
    {
        CleanHex = CleanHex[0] + CleanHex[0] + CleanHex[1] + CleanHex[1] + CleanHex[2] + CleanHex[2];
    }
    const LowerHex = CleanHex.toLowerCase();
    if (LowerHex === "ffffff")
    {
        return "FFFFFF";
    }

    const Red = parseInt(CleanHex.slice(0, 2), 16);
    const Green = parseInt(CleanHex.slice(2, 4), 16);
    const Blue = parseInt(CleanHex.slice(4, 6), 16);
    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 22)
    {
        return CleanHex.toUpperCase();
    }

    const Avg = (Red + Green + Blue) / 3;
    if (Avg >= 240 || Avg <= 50)
    {
        return "FFFFFF";
    }
    const Inv = Math.min(255, Math.max(0, Math.round(255 - Avg)));
    const H = Inv.toString(16).padStart(2, "0").toUpperCase();
    return `${H}${H}${H}`;
}

function ConvertColorHex(Hex)
{
    return InvertShapeColorHex(Hex);
}

function ConvertTypstSourceToDarkMode(Source, Transparent = false)
{
    let Transformed = Source.replace
    (
        /rgb\(\s*"#?([0-9a-fA-F]{3,8})"\s*\)/g, (Match, HexVal) =>
        {
            return `rgb("#${ConvertColorHex(HexVal)}")`;
        }
    );

    Transformed = Transformed.replace
    (
        /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)/g, (Match, R, G, B) =>
        {
            const Hex = [R, G, B].map( (V) => parseInt(V, 10).toString(16).padStart(2, "0")).join("");
            return `rgb("#${ConvertColorHex(Hex)}")`;
        }
    );

    Transformed = Transformed.replace
    (
        /luma\(\s*(\d{1,3})\s*\)/g, (Match, Val) =>
        {
            const Num = parseInt(Val, 10);
            const Hex = Num.toString(16).padStart(2, "0").repeat(3);
            return `rgb("#${ConvertColorHex(Hex)}")`;
        }
    );

    const PageFill = Transparent ? "none": `rgb("000000")`;
    Transformed = Transformed.replace
    (
        /(#set\s+page\s*\([^)]*)\bfill\s*:\s*(?:rgb\([^)]*\)|"[^"]*"|'[^']*'|[a-zA-Z0-9_\.]+)/g,
        `$1fill: ${PageFill}`
    );
    const Header = `#set page(fill: ${PageFill})\n#set text(fill: rgb("ffffff"))\n\n`;
    return Header + Transformed;
}

async function HandleExportPdf(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath): (Payload.FileName || "main.typ");
        const OutputFileName = (Payload.FileName || "document").replace(/[^a-zA-Z0-9_\-]/g, "_") + ".pdf";

        const KnrCheck = DetectKnrSlop(Source, ActiveFileName);
        if (KnrCheck.HasError)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: KnrCheck.FormattedMessage, KnrSlop: true })
            );
            return ;
        }

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        const DocRoot = ResolveDocRoot(Payload.FilePath, JobDir);

        let SourceToCompile = Source;
        if (Payload.BlackMode)
        {
            SourceToCompile = ConvertTypstSourceToDarkMode(Source, Boolean(Payload.Transparent));
        }
        else if (Payload.Transparent)
        {
            SourceToCompile = `#set page(fill: none)\n\n` + Source;
        }

        SourceToCompile = NormalizeMathFunctionCalls(SourceToCompile);

        const OutputPath = Path.join(JobDir, "output.pdf");

        const CompileResult = await ExecuteCommand
        (
            TYPST_BINARY,["compile", "--root", DocRoot, "--format", "pdf", ...GetLocalFontArgs(), "-", OutputPath], { cwd: JobDir, timeout: 30000 },
            SourceToCompile
        );

        if (!CompileResult.Success || !FS.existsSync(OutputPath))
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false,
                    Error: CompileResult.Stderr || "PDF Generation failed."
                })
            );
            return ;
        }

        const PdfBuffer = await FSPromises.readFile(OutputPath);
        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});

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
        Response.end
        (
            JSON.stringify( { Success: false, Error: Exception.message })
        );
    }
}

async function HandleExportPng(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath): (Payload.FileName || "main.typ");

        const KnrCheck = DetectKnrSlop(Source, ActiveFileName);
        if (KnrCheck.HasError)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: KnrCheck.FormattedMessage, KnrSlop: true })
            );
            return ;
        }

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        const DocRoot = ResolveDocRoot(Payload.FilePath, JobDir);

        let SourceToCompile = Source;
        if (Payload.BlackMode)
        {
            SourceToCompile = ConvertTypstSourceToDarkMode(Source, Boolean(Payload.Transparent));
        }
        else if (Payload.Transparent)
        {
            SourceToCompile = SourceToCompile.replace
            (
                /(#set\s+page\s*\([^)]*)\bfill\s*:\s*(?:rgb\([^)]*\)|"[^"]*"|'[^']*'|[a-zA-Z0-9_\.]+)/g,
                `$1fill: none`
            );
            SourceToCompile = `#set page(fill: none)\n\n` + SourceToCompile;
        }

        SourceToCompile = NormalizeMathFunctionCalls(SourceToCompile);

        const OutputPattern = Path.join(JobDir, "page-{p}.png");

        const CompileResult = await ExecuteCommand
        (
            TYPST_BINARY,
            ["compile", "--root", DocRoot, "--format", "png", "--ppi", "300", ...GetLocalFontArgs(), "-", OutputPattern],
            { cwd: JobDir, timeout: 30000 },
            SourceToCompile
        );

        if (!CompileResult.Success)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: CompileResult.Stderr || "PNG compilation failed." })
            );
            return ;
        }

        const DirEntries = await FSPromises.readdir(JobDir);
        const PngFiles = DirEntries
        .filter( (F) => /^page-\d+\.png$/i.test(F))
        .sort
        (
            (A, B) =>
            {
                const NumA = parseInt(A.match(/\d+/)[0], 10);
                const NumB = parseInt(B.match(/\d+/)[0], 10);
                return NumA - NumB;
            }
        );

        if (PngFiles.length === 0)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Requested page not found." })
            );
            return ;
        }

        const BaseDocName = (Payload.FileName || "document").replace(/[^a-zA-Z0-9_\-]/g, "_");

        // Always package all pages into a ZIP file with page numbers!
        const Zip = new JSZip();
        for (let Index = 0; Index < PngFiles.length; Index ++)
        {
            const PageBuffer = await FSPromises.readFile
            (
                Path.join(JobDir, PngFiles[Index])
            );
            Zip.file(`${BaseDocName}_page_${Index + 1}.png`, PageBuffer);
        }

        const ZipBuffer = await Zip.generateAsync( { type: "nodebuffer" });
        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});

        Response.writeHead
        (
            200,
            {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${BaseDocName}_png.zip"`,
                "Content-Length": ZipBuffer.length
            }
        );
        Response.end(ZipBuffer);
    }
    catch (Exception)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Exception.message })
        );
    }
}

async function HandleExportSvg(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath): (Payload.FileName || "main.typ");

        const KnrCheck = DetectKnrSlop(Source, ActiveFileName);
        if (KnrCheck.HasError)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: KnrCheck.FormattedMessage, KnrSlop: true })
            );
            return ;
        }

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        const DocRoot = ResolveDocRoot(Payload.FilePath, JobDir);

        let SourceToCompile = Source;
        if (Payload.BlackMode)
        {
            SourceToCompile = ConvertTypstSourceToDarkMode(Source, Boolean(Payload.Transparent));
        }
        else if (Payload.Transparent)
        {
            SourceToCompile = SourceToCompile.replace
            (
                /(#set\s+page\s*\([^)]*)\bfill\s*:\s*(?:rgb\([^)]*\)|"[^"]*"|'[^']*'|[a-zA-Z0-9_\.]+)/g,
                `$1fill: none`
            );
            SourceToCompile = `#set page(fill: none)\n\n` + SourceToCompile;
        }

        SourceToCompile = NormalizeMathFunctionCalls(SourceToCompile);

        const OutputPattern = Path.join(JobDir, "page-{p}.svg");

        const CompileResult = await ExecuteCommand
        (
            TYPST_BINARY,
            ["compile", "--root", DocRoot, "--format", "svg", ...GetLocalFontArgs(), "-", OutputPattern],
            { cwd: JobDir, timeout: 30000 },
            SourceToCompile
        );

        if (!CompileResult.Success)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: CompileResult.Stderr || "SVG compilation failed." })
            );
            return ;
        }

        const DirEntries = await FSPromises.readdir(JobDir);
        const SvgFiles = DirEntries
        .filter( (F) => /^page-\d+\.svg$/i.test(F))
        .sort
        (
            (A, B) =>
            {
                const NumA = parseInt(A.match(/\d+/)[0], 10);
                const NumB = parseInt(B.match(/\d+/)[0], 10);
                return NumA - NumB;
            }
        );

        if (SvgFiles.length === 0)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "No SVG pages found." })
            );
            return ;
        }

        const BaseDocName = (Payload.FileName || "document").replace(/[^a-zA-Z0-9_\-]/g, "_");

        // Package all SVG pages into a ZIP file with page numbers!
        const Zip = new JSZip();
        for (let Index = 0; Index < SvgFiles.length; Index ++)
        {
            let PageContent = await FSPromises.readFile
            (
                Path.join(JobDir, SvgFiles[Index]),
                "utf8"
            );

            if (Payload.Transparent)
            {
                PageContent = PageContent.replace
                (
                    /<path\s+[^>]*\bfill\s*=\s*["']#(?:ffffff|000000|0c0c0c)["'][^>]*d\s*=\s*["']M\s*0\s+0v[^"']*Z\s*["'][^>]*\/?>/gi,
                    ""
                );
                PageContent = PageContent.replace
                (
                    /<path\s+[^>]*d\s*=\s*["']M\s*0\s+0v[^"']*Z\s*["'][^>]*\bfill\s*=\s*["']#(?:ffffff|000000|0c0c0c)["'][^>]*\/?>/gi,
                    ""
                );
            }

            Zip.file(`${BaseDocName}_page_${Index + 1}.svg`, PageContent);
        }

        const ZipBuffer = await Zip.generateAsync( { type: "nodebuffer" });
        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch ( () => {});

        Response.writeHead
        (
            200,
            {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${BaseDocName}_svg.zip"`,
                "Content-Length": ZipBuffer.length
            }
        );
        Response.end(ZipBuffer);
    }
    catch (Exception)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Exception.message })
        );
    }
}

async function HandleFormat(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Source = Payload.Source || "";
        const Formatted = FormatTypstLAFS(Source);
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify({ Success: true, Formatted: Formatted, Error: null })
        );
    }
    catch (Exception)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify({ Success: false, Error: Exception.message })
        );
    }
}
// Workspace API Handlers
async function HandleWorkspaceInfo(Request, Response)
{
    try
    {
        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: true, ...Info })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleAddDirectory(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const TargetPath = Payload.Path ? Path.resolve(Payload.Path): null;

        if (!TargetPath || !FS.existsSync(TargetPath))
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Directory does not exist." })
            );
            return ;
        }

        const Stat = await FSPromises.stat(TargetPath);
        if (!Stat.isDirectory())
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Target path is not a directory." })
            );
            return ;
        }

        const RootParsed = Path.parse(TargetPath);
        if (TargetPath.toLowerCase() === RootParsed.root.toLowerCase())
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Cannot add an entire drive root as a workspace directory." })
            );
            return ;
        }

        const LowerTarget = TargetPath.toLowerCase();
        const UserHome = Path.resolve(OS.homedir()).toLowerCase();
        // 1. Block user home directory itself
        if (LowerTarget === UserHome)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Cannot add user home root directory directly as a workspace directory." })
            );
            return ;
        }
        // 2. Block sensitive user profile folders & autostart directories
        const ProhibitedUserFolders =
        [
            Path.join(UserHome, ".ssh").toLowerCase(),
            Path.join(UserHome, ".gnupg").toLowerCase(),
            Path.join(UserHome, ".aws").toLowerCase(),
            Path.join(UserHome, ".azure").toLowerCase(),
            Path.join(UserHome, ".kube").toLowerCase(),
            Path.join(UserHome, "appdata", "roaming", "microsoft", "windows", "start menu", "programs", "startup").toLowerCase(),
            "c:\\programdata\\microsoft\\windows\\start menu\\programs\\startup"
        ];

        const MatchesProhibitedUserFolder = ProhibitedUserFolders.some
        (
            (Blocked) => LowerTarget === Blocked || LowerTarget.startsWith(Blocked + Path.sep)
        );

        if (MatchesProhibitedUserFolder)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Sensitive user profile or startup directories cannot be added as workspace directories." })
            );
            return ;
        }
        // 3. Block sensitive subfolder names (.ssh, .gnupg) anywhere in path
        const TargetSegments = TargetPath.split(Path.sep).map( (S) => S.toLowerCase());
        if (TargetSegments.includes(".ssh") || TargetSegments.includes(".gnupg"))
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false, Error: "Directories containing cryptographic or credential stores cannot be added as workspace directories."
                })
            );
            return ;
        }
        // 4. Block system directories
        const ForbiddenSystemDirs =
        [
            "c:\\windows",
            "c:\\program files",
            "c:\\program files (x86)",
            "c:\\programdata",
            "c:\\$recycle.bin",
            "c:\\recovery",
            "/etc",
            "/bin",
            "/sbin",
            "/usr",
            "/var",
            "/sys",
            "/proc",
            "/dev",
            "/root",
            "/boot",
            "/opt"
        ];

        if
        (
            ForbiddenSystemDirs.some( (Sys) => LowerTarget === Sys || LowerTarget.startsWith(Sys + Path.sep))
        )
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "System directories cannot be added as workspace directories." })
            );
            return ;
        }

        const Dirs = GetTrackedDirectories();
        if (!Dirs.includes(TargetPath))
        {
            Dirs.push(TargetPath);
            SaveTrackedDirectories(Dirs);
        }

        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: true, ...Info })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleRemoveDirectory(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const TargetPath = Payload.Path ? Path.resolve(Payload.Path): null;

        let Dirs = GetTrackedDirectories();
        Dirs = Dirs.filter( (D) => D !== TargetPath);
        SaveTrackedDirectories(Dirs);

        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: true, ...Info })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleListFiles(Request, Response, TargetDir)
{
    try
    {
        const Dirs = GetTrackedDirectories();
        const BaseDir = TargetDir || Dirs[0] || process.cwd();
        const Entries = await FSPromises.readdir(BaseDir, { withFileTypes: true });
        const Results = [];

        for (const Entry of Entries)
        {
            if (Entry.name === ".git" || Entry.name === "target" || Entry.name === "node_modules")
            {
                continue;
            }
            const FullPath = Path.join(BaseDir, Entry.name);
            const IsDir = Entry.isDirectory();
            let Size = 0;
            if (!IsDir)
            {
                try
                {
                    const Stat = await FSPromises.stat(FullPath);
                    Size = Stat.size;
                }
                catch (Ignored)
                {
                }
            }
            Results.push
            ({
                name: Entry.name,
                path: FullPath,
                is_dir: IsDir,
                size: Size
            });
        }

        Results.sort
        (
            (A, B) =>
            {
                if (A.is_dir !== B.is_dir)
                {
                    return B.is_dir ? - 1: 1;
                }
                return A.name.toLowerCase().localeCompare(B.name.toLowerCase());
            }
        );

        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify( { Success: true, Files: Results }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify( { Success: false, Error: E.message, Files: [] }));
    }
}

async function HandleReadFile(Request, Response, FilePath)
{
    try
    {
        const Validation = ValidateWorkspacePath(FilePath, true, false);
        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: Validation.Error })
            );
            return ;
        }

        const Content = await FSPromises.readFile(Validation.Path, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true, Content: Content, Path: Validation.Path, Name: Path.basename(Validation.Path)
            })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleSaveFile(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Validation = ValidateWorkspacePath(Payload.Path, false, true);

        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: Validation.Error })
            );
            return ;
        }

        const FilePath = Validation.Path;
        const Content = Payload.Content || "";
        const Dir = Path.dirname(FilePath);

        if (!FS.existsSync(Dir))
        {
            await FSPromises.mkdir(Dir, { recursive: true });
        }

        await FSPromises.writeFile(FilePath, Content, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true, Path: FilePath, Name: Path.basename(FilePath)
            })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleCreateFile(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        let TargetDir = Payload.Directory ? Path.resolve(Payload.Directory): GetTrackedDirectories()[0];
        const RawFileName = (Payload.FileName || "Untitled.typ").trim();
        let FileName = Path.basename(RawFileName);
        if (!FileName.endsWith(".typ")) { FileName += ".typ"; }

        const TargetFullPath = Path.join(TargetDir, FileName);
        const Validation = ValidateWorkspacePath(TargetFullPath, false, true);

        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: Validation.Error })
            );
            return ;
        }

        const FullPath = Validation.Path;
        const Dir = Path.dirname(FullPath);
        if (!FS.existsSync(Dir))
        {
            await FSPromises.mkdir(Dir, { recursive: true });
        }

        const Content = Payload.Content ||
        `#set page
(
    paper: "a4",
    margin: 2.5cm
)

#set text
(
    font: "Segoe UI",
    size: 11pt
)

= ${Path.basename(FileName, ".typ")}

Start writing in Typst...
`;

        await FSPromises.writeFile(FullPath, Content, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: true, Path: FullPath, Name: FileName, Content: Content })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

const ALLOWED_ASSET_EXTENSIONS = new Set
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
        const CleanFileName = require("node:path").basename(RawFileName).replace(/[^a-zA-Z0-9_\-\.]/g, "_");
        const Ext = Path.extname(CleanFileName).toLowerCase();

        if (!ALLOWED_ASSET_EXTENSIONS.has(Ext))
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify
                ({
                    Success: false,
                    Error: `Unsupported asset extension '${Ext}'. Allowed: ${Array.from(ALLOWED_ASSET_EXTENSIONS).join(", ")}`
                })
            );
            return ;
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
            Response.end
            (
                JSON.stringify( { Success: false, Error: Validation.Error })
            );
            return ;
        }

        if (!Payload.Base64Data)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Missing Base64Data in request payload." })
            );
            return ;
        }

        const BufferData = Buffer.from (Payload.Base64Data, "base64");
        if (BufferData.length > MAX_REQUEST_BODY_BYTES)
        {
            Response.writeHead(413, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: "Asset exceeds maximum allowed file size of 10 MB." })
            );
            return ;
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
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleDeleteFile(Request, Response, QueryPath)
{
    try
    {
        let TargetPath = QueryPath ? Path.resolve(QueryPath): null;
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
            catch (Ignored) {}
        }

        const Validation = ValidateWorkspacePath(TargetPath, true, true);
        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: Validation.Error })
            );
            return ;
        }

        await FSPromises.unlink(Validation.Path);

        const Info = await ScanTypstFiles();
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: true, ...Info })
        );
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: E.message })
        );
    }
}

async function HandleRenameFile(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody || "{}");
        const OldPath = Payload.oldPath || Payload.OldPath;
        const NewName = Payload.newName || Payload.NewName;

        if (!OldPath || !NewName)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Message: "Missing oldPath or newName" }));
            return ;
        }

        const OldValidation = ValidateWorkspacePath(OldPath, true, true);
        if (!OldValidation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Message: OldValidation.Error }));
            return ;
        }

        const ParentDir = Path.dirname(OldValidation.Path);
        const SanitizedName = Path.basename(NewName.trim()).replace(/[\\\/]/g, "");
        const FinalName = SanitizedName.toLowerCase().endsWith(".typ") ? SanitizedName : `${SanitizedName}.typ`;
        const TargetNewPath = Path.join(ParentDir, FinalName);

        const NewValidation = ValidateWorkspacePath(TargetNewPath, false, true);
        if (!NewValidation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Message: NewValidation.Error }));
            return ;
        }

        if (FS.existsSync(NewValidation.Path) && NewValidation.Path.toLowerCase() !== OldValidation.Path.toLowerCase())
        {
            Response.writeHead(409, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Message: `A file named '${FinalName}' already exists` }));
            return ;
        }

        await FSPromises.rename(OldValidation.Path, NewValidation.Path);
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, NewPath: NewValidation.Path }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Message: E.message }));
    }
}

function ServeStatic(Request, Response, FilePath)
{
    let NormalizedPath = Path.normalize(FilePath);
    const RelativeToPublic = Path.relative(PUBLIC_DIR, NormalizedPath);

    if (RelativeToPublic.startsWith("..") || Path.isAbsolute(RelativeToPublic))
    {
        Response.writeHead(403, { "Content-Type": "text/plain" });
        Response.end("Forbidden");
        return ;
    }

    if (!FS.existsSync(NormalizedPath))
    {
        // Case-insensitivity fallback for Linux/macOS case-sensitive filesystems
        const RequestedBase = Path.basename(NormalizedPath).toLowerCase();
        const ParentDir = Path.dirname(NormalizedPath);
        const RelParent = Path.relative(PUBLIC_DIR, ParentDir);
        if (!RelParent.startsWith("..") && FS.existsSync(ParentDir))
        {
            try
            {
                const Entries = FS.readdirSync(ParentDir);
                const Matched = Entries.find( (E) => E.toLowerCase() === RequestedBase);
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
        return ;
    }

    try
    {
        const Stat = FS.statSync(NormalizedPath);
        if (Stat.isDirectory())
        {
            const CandidateIndex = Path.join(NormalizedPath, "index.html");
            const CandidateIndexAlt = Path.join(NormalizedPath, "Index.html");
            if (FS.existsSync(CandidateIndex) && FS.statSync(CandidateIndex).isFile())
            {
                NormalizedPath = CandidateIndex;
            }
            else if (FS.existsSync(CandidateIndexAlt) && FS.statSync(CandidateIndexAlt).isFile())
            {
                NormalizedPath = CandidateIndexAlt;
            }
            else
            {
                Response.writeHead(403, { "Content-Type": "text/plain" });
                Response.end("Forbidden: Directory listing denied.");
                return ;
            }
        }
    }
    catch (Err)
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Not Found");
        return ;
    }

    if (Path.basename(NormalizedPath).toLowerCase() === "index.html")
    {
        try
        {
            let Html = FS.readFileSync(NormalizedPath, "utf-8");
            const TokenScript = `<script>window.__TYPST_STUDIO_AUTH_TOKEN__ = "${SESSION_AUTH_TOKEN}";</script>\n</head>`;
            Html = Html.replace("</head>", TokenScript);
            Response.writeHead
            (
                200,
                {
                    "Content-Type": "text/html; charset=utf-8",
                    "Content-Length": Buffer.byteLength(Html, "utf-8")
                }
            );
            Response.end(Html);
            return ;
        }
        catch (Ignored)
        {
        }
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
        ".ico": "image/x-icon",
        ".ttf": "font/ttf",
        ".otf": "font/otf",
        ".woff": "font/woff",
        ".woff2": "font/woff2"
    };

    const ContentType = MimeTypes[Extension] || "application/octet-stream";
    const Stream = FS.createReadStream(NormalizedPath);
    Stream.on
    (
        "error", () =>
        {
            if (!Response.headersSent)
            {
                Response.writeHead(500, { "Content-Type": "text/plain" });
            }
            Response.end("Internal Server Error");
        }
    );
    Response.writeHead
    (
        200,
        {
            "Content-Type": ContentType,
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    );
    Stream.pipe(Response);
}

async function HandlePickFolder(Request, Response)
{
    try
    {
        let Selected = "";

        if (process.platform === "win32")
        {
            // Windows: Use native modern IFileOpenDialog with FOS_PICKFOLDERS
            const WinPickerBin = Path.join(__dirname, "bin", "win_folder_picker.exe");
            if (FS.existsSync(WinPickerBin))
            {
                const PickerResult = await ExecuteCommand
                (
                    WinPickerBin,["Select Typst Projects Directory"], { timeout: 180000, windowsHide: true }
                );
                Selected = (PickerResult.Stdout || "").trim();
            }

            if (!Selected)
            {
                // Fallback to powershell.exe if native binary not available
                const PsCommand =
                "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; " +
                "Add-Type -AssemblyName System.Windows.Forms; " +
                "$Dialog = New-Object System.Windows.Forms.FolderBrowserDialog; " +
                "$Dialog.Description = 'Select Typst Projects Directory'; " +
                "$Dialog.ShowNewFolderButton = $true; " +
                "if ($Dialog.PSObject.Properties['AutoUpgradeEnabled']) { $Dialog.AutoUpgradeEnabled = $true; } " +
                "$Form = New-Object System.Windows.Forms.Form; " +
                "$Form.TopMost = $true; " +
                "$Form.Opacity = 0; " +
                "$Form.ShowInTaskbar = $false; " +
                "$Form.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::None; " +
                "$Form.Size = New-Object System.Drawing.Size(1, 1); " +
                "$Form.StartPosition = [System.Windows.Forms.FormStartPosition]::CenterScreen; " +
                "$Form.Visible = $true; " +
                "$Form.Show(); " +
                "$Form.Activate(); " +
                "$Form.BringToFront(); " +
                "if ($Dialog.ShowDialog($Form) -eq [System.Windows.Forms.DialogResult]::OK) { " +
                "    Write-Output $Dialog.SelectedPath; " +
                "} " +
                "$Form.Dispose();";

                let Result = await ExecuteCommand
                (
                    "powershell",["-NoProfile", "-STA", "-Command", PsCommand], { timeout: 180000, windowsHide: true }
                );

                Selected = (Result.Stdout || "").trim();
            }
        }
        else if (process.platform === "darwin")
        {
            // macOS: Bring dialog to front using System Events
            const AppleScript =
            'tell application "System Events"\n' +
            '    activate\n' +
            '    set FolderPath to POSIX path of (choose folder with prompt "Select Typst Projects Directory")\n' +
            'end tell\n' +
            'return FolderPath';

            const Result = await ExecuteCommand
            (
                "osascript",["-e", AppleScript], { timeout: 180000, windowsHide: false }
            );
            Selected = (Result.Stdout || "").trim();
        }
        else
        {
            // Linux: Try zenity, then kdialog, then python3 tkinter
            const ZenityResult = await ExecuteCommand
            (
                "zenity",["--file-selection", "--directory", "--title=Select Typst Projects Directory"], { timeout: 180000, windowsHide: false }
            );
            Selected = (ZenityResult.Stdout || "").trim();

            if (!Selected)
            {
                const KdialogResult = await ExecuteCommand
                (
                    "kdialog",["--getexistingdirectory", "--title", "Select Typst Projects Directory"], { timeout: 180000, windowsHide: false }
                );
                Selected = (KdialogResult.Stdout || "").trim();
            }

            if (!Selected)
            {
                const PyScript =
                "import tkinter as tk; from tkinter import filedialog; " +
                "root = tk.Tk(); root.withdraw(); root.attributes('-topmost', True); " +
                "path = filedialog.askdirectory(title='Select Typst Projects Directory'); " +
                "print(path if path else '')";

                const PyResult = await ExecuteCommand
                (
                    "python3",["-c", PyScript], { timeout: 180000, windowsHide: false }
                );
                Selected = (PyResult.Stdout || "").trim();
            }
        }

        if (Selected)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: true, Path: Selected })
            );
        }
        else
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Cancelled: true })
            );
        }
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Err.message })
        );
    }
}

let CachedSystemFontsList = null;
let CachedSystemFontDetails = null;

async function ScanAllSystemFonts()
{
    if (CachedSystemFontsList && CachedSystemFontsList.length > 0)
    {
        return { Fonts: CachedSystemFontsList, FontDetails: CachedSystemFontDetails };
    }

    const FontMap = new Map();

    function AddFont(Name, Family, Weight = "400", Style = "normal", Stretch = "normal", FilePath = "")
    {
        if (!Name) { return; }
        const CleanName = Name.replace(/\s*\((?:TrueType|OpenType|Variable)\)$/i, "").trim();
        if (!CleanName || CleanName.length < 2) { return; }
        if (CleanName.startsWith("─") || CleanName.startsWith("=")) { return; }

        let DetectedWeight = Weight;
        let DetectedStyle = Style;
        const Lower = CleanName.toLowerCase();
        if (Lower.includes("thin") || Lower.includes("hairline")) { DetectedWeight = "100"; }
        else if (Lower.includes("extralight") || Lower.includes("ultralight")) { DetectedWeight = "200"; }
        else if (Lower.includes("light")) { DetectedWeight = "300"; }
        else if (Lower.includes("demibold") || Lower.includes("semibold")) { DetectedWeight = "600"; }
        else if (Lower.includes("extrabold") || Lower.includes("ultrabold")) { DetectedWeight = "800"; }
        else if (Lower.includes("bold") || Lower.includes(" bd")) { DetectedWeight = "700"; }
        else if (Lower.includes("medium") || Lower.includes(" md")) { DetectedWeight = "500"; }
        else if (Lower.includes("black") || Lower.includes("heavy") || Lower.includes(" blc")) { DetectedWeight = "900"; }

        if (Lower.includes("italic") || Lower.includes("oblique") || Lower.includes(" it"))
        {
            DetectedStyle = "italic";
        }

        if (!FontMap.has(CleanName))
        {
            FontMap.set
            (
                CleanName,
                {
                    Name: CleanName,
                    Family: Family || CleanName,
                    Weight: DetectedWeight,
                    Style: DetectedStyle,
                    Stretch: Stretch,
                    FilePath: FilePath || ""
                }
            );
        }
        else
        {
            const Existing = FontMap.get(CleanName);
            if (!Existing.FilePath && FilePath)
            {
                Existing.FilePath = FilePath;
            }
            if (Existing.Weight === "400" && DetectedWeight !== "400")
            {
                Existing.Weight = DetectedWeight;
            }
            if (Existing.Style === "normal" && DetectedStyle !== "normal")
            {
                Existing.Style = DetectedStyle;
            }
        }
    }
    // 0. Query Local Project Fonts in TypstStudio/public/fonts
    const LocalFontsDir = Path.join(PUBLIC_DIR, "fonts");
    if (FS.existsSync(LocalFontsDir))
    {
        try
        {
            const FontFiles = FS.readdirSync(LocalFontsDir);
            for (const File of FontFiles)
            {
                const Ext = Path.extname(File).toLowerCase();
                if (Ext === ".ttf" || Ext === ".otf" || Ext === ".ttc")
                {
                    const BaseName = Path.basename(File, Ext);
                    const FullPath = Path.join(LocalFontsDir, File);
                    AddFont(BaseName, BaseName, "500", "normal", "normal", FullPath);
                }
            }
        }
        catch (Ignored)
        {
        }
    }
    // 1. Query typst fonts --variants to extract every installed font variant and font file
    try
    {
        const TypstStdout = await new Promise
        (
            (Resolve) =>
            {
                ChildProcess.execFile
                (
                    TYPST_BINARY,["fonts", "--variants", ...GetLocalFontArgs()], { maxBuffer: 50 * 1024 * 1024, windowsHide: true },
                    (Err, Stdout) =>
                    {
                        Resolve(Stdout || "");
                    }
                );
            }
        );

        if (TypstStdout)
        {
            const Lines = TypstStdout.split(/\r?\n/);
            let CurrentFamily = "";

            for (let I = 0; I < Lines.length; I ++)
            {
                const Line = Lines[I];
                if (!Line.trim()) { continue; }

                if (/^[^\s├└│]/.test(Line))
                {
                    CurrentFamily = Line.trim();
                    AddFont(CurrentFamily, CurrentFamily);
                    continue;
                }

                const FileMatch = Line.match(/[├└]\s*(.+?\.(?:ttf|otf|ttc))(?:\s*\(Variable\))?/i);
                if (FileMatch)
                {
                    const FilePath = FileMatch[1].trim();
                    let Style = "normal";
                    let Weight = "400";
                    let Stretch = "normal";

                    if (I + 1 < Lines.length)
                    {
                        const NextLine = Lines[I + 1];
                        const InfoMatch = NextLine.match(/Style:\s*([^,]+),\s*Weight:\s*([^,]+)(?:,\s*Stretch:\s*(.+))?/);
                        if (InfoMatch)
                        {
                            Style = InfoMatch[1].trim().toLowerCase();
                            Weight = InfoMatch[2].trim();
                            Stretch = InfoMatch[3] ? InfoMatch[3].trim(): "normal";
                        }
                    }

                    const BaseName = Path.basename(FilePath).replace(/\.(?:ttf|otf|ttc)$/i, "");
                    AddFont(BaseName, CurrentFamily, Weight, Style, Stretch, FilePath);

                    if (CurrentFamily && Style !== "normal" && !BaseName.toLowerCase().includes(Style))
                    {
                        AddFont(`${CurrentFamily} ${Style}`, CurrentFamily, Weight, Style, Stretch, FilePath);
                    }
                }
            }
        }
    }
    catch (E)
    {
        console.error("typst fonts --variants error:", E.message);
    }
    // 2. Query Windows Registry for HKLM and HKCU fonts
    if (process.platform === "win32")
    {
        const WinFontsDir = "C:\\Windows\\Fonts";
        const UserFontsDir = Path.join(process.env.LOCALAPPDATA || "", "Microsoft", "Windows", "Fonts");

        for
        (
            const RegPath of
            [
                'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts',
                'HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'
            ]
        )
        {
            try
            {
                const RegOut = await new Promise
                (
                    (Resolve) =>
                    {
                        ChildProcess.execFile
                        (
                            "reg",["query", RegPath], { windowsHide: true },
                            (Err, Stdout) =>
                            {
                                Resolve(Stdout || "");
                            }
                        );
                    }
                );

                if (RegOut)
                {
                    const RegLines = RegOut.split(/\r?\n/).filter( (L) => L.trim().length > 0 && !L.startsWith("HKEY_"));
                    for (const L of RegLines)
                    {
                        const Parts = L.trim().split(/\s{2,}/);
                        if (Parts[0])
                        {
                            const FontName = Parts[0];
                            const FontFile = Parts[1] || "";
                            let FullPath = "";

                            if (FontFile)
                            {
                                if (Path.isAbsolute(FontFile))
                                {
                                    FullPath = FontFile;
                                }
                                else if
                                (
                                    FS.existsSync(Path.join(WinFontsDir, FontFile))
                                )
                                {
                                    FullPath = Path.join(WinFontsDir, FontFile);
                                }
                                else if
                                (
                                    UserFontsDir && FS.existsSync(Path.join(UserFontsDir, FontFile))
                                )
                                {
                                    FullPath = Path.join(UserFontsDir, FontFile);
                                }
                            }

                            AddFont(FontName, FontName, "400", "normal", "normal", FullPath);
                        }
                    }
                }
            }
            catch (Ignored)
            {
            }
        }
    }

    const SortedDetails = Array.from (FontMap.values()).sort
    (
        (A, B) => A.Name.localeCompare(B.Name, undefined, { sensitivity: "base" })
    );

    const SortedNames = SortedDetails.map( (D) => D.Name);

    CachedSystemFontsList = SortedNames;
    CachedSystemFontDetails = SortedDetails;

    return { Fonts: SortedNames, FontDetails: SortedDetails };
}

async function HandleListFonts(Request, Response)
{
    try
    {
        const Result = await ScanAllSystemFonts();
        Response.writeHead
        (
            200,
            {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache, no-store, must-revalidate"
            }
        );
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                Fonts: Result.Fonts,
                FontDetails: Result.FontDetails
            })
        );
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify( { Success: false, Error: Err.message })
        );
    }
}

function GetAllowedFontRoots()
{
    const Roots = [];
    if (process.platform === "win32")
    {
        Roots.push(Path.resolve("C:\\Windows\\Fonts"));
        const LocalAppData = process.env.LOCALAPPDATA;
        if (LocalAppData)
        {
            Roots.push(Path.resolve(LocalAppData, "Microsoft", "Windows", "Fonts"));
        }
    }
    else if (process.platform === "darwin")
    {
        Roots.push(Path.resolve("/System/Library/Fonts"));
        Roots.push(Path.resolve("/Library/Fonts"));
        const Home = process.env.HOME;
        if (Home)
        {
            Roots.push(Path.resolve(Home, "Library", "Fonts"));
        }
    }
    else
    {
        Roots.push(Path.resolve("/usr/share/fonts"));
        Roots.push(Path.resolve("/usr/local/share/fonts"));
        const Home = process.env.HOME;
        if (Home)
        {
            Roots.push(Path.resolve(Home, ".fonts"));
            Roots.push(Path.resolve(Home, ".local", "share", "fonts"));
        }
    }

    Roots.push(PUBLIC_DIR);
    const TrackedDirs = GetTrackedDirectories();
    for (const Dir of TrackedDirs)
    {
        Roots.push(Path.resolve(Dir));
    }

    return Roots;
}

function HandleServeFontFile(Request, Response, TargetPath)
{
    if (!TargetPath || typeof TargetPath !== "string")
    {
        Response.writeHead(400, { "Content-Type": "text/plain" });
        Response.end("Bad Request: Font path parameter required.");
        return ;
    }

    const Resolved = Path.resolve(TargetPath);
    const Ext = Path.extname(Resolved).toLowerCase();
    const AllowedFontExts = new Set([".ttf", ".otf", ".ttc", ".woff", ".woff2"]);

    if (!AllowedFontExts.has(Ext))
    {
        Response.writeHead(403, { "Content-Type": "text/plain" });
        Response.end("Forbidden: Only font files (.ttf, .otf, .ttc, .woff, .woff2) can be served.");
        return ;
    }

    const AllowedRoots = GetAllowedFontRoots();
    const IsContained = AllowedRoots.some
    (
        (Root) =>
        {
            const Rel = Path.relative(Root, Resolved);
            return ! Rel.startsWith("..") && ! Path.isAbsolute(Rel);
        }
    );

    if (!IsContained)
    {
        Response.writeHead(403, { "Content-Type": "text/plain" });
        Response.end("Forbidden: Font path outside permitted font directories.");
        return ;
    }

    if (!FS.existsSync(Resolved))
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Font file not found on disk.");
        return ;
    }

    try
    {
        const Stat = FS.statSync(Resolved);
        if (!Stat.isFile())
        {
            Response.writeHead(403, { "Content-Type": "text/plain" });
            Response.end("Forbidden: Target is not a file.");
            return ;
        }
    }
    catch (Err)
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Font file not accessible.");
        return ;
    }

    const MimeMap =
    {
        ".ttf": "font/ttf",
        ".otf": "font/otf",
        ".ttc": "font/collection",
        ".woff": "font/woff",
        ".woff2": "font/woff2"
    };

    const MimeType = MimeMap[Ext] || "application/octet-stream";
    const Stream = FS.createReadStream(Resolved);
    Stream.on
    (
        "error", () =>
        {
            if (!Response.headersSent)
            {
                Response.writeHead(500, { "Content-Type": "text/plain" });
            }
            Response.end("Internal Server Error");
        }
    );
    Response.writeHead
    (
        200,
        {
            "Content-Type": MimeType,
            "Cache-Control": "public, max-age=31536000, immutable",
            "Access-Control-Allow-Origin": "*"
        }
    );
    Stream.pipe(Response);
}

const Server = HTTP.createServer
(
    async (Request, Response) =>
    {
        // 1. Inject Defensive Security Headers
        ApplySecurityHeaders(Response);
        // 2. Validate Client Authorization (Host Whitelist & Anti-CSRF Token)
        const AuthCheck = VerifyClientAuthorization(Request);
        if (!AuthCheck.Authorized)
        {
            Response.writeHead(AuthCheck.Status || 403, { "Content-Type": "application/json" });
            Response.end
            (
                JSON.stringify( { Success: false, Error: AuthCheck.Error })
            );
            return ;
        }

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
            Response.setHeader("Access-Control-Allow-Headers", "Content-Type, X-Typst-Auth-Token");
        }

        if (Request.method === "OPTIONS")
        {
            Response.writeHead(204);
            Response.end();
            return ;
        }

        const URLInstance = new URL(Request.url, `http://${Request.headers.host}`);
        const Pathname = URLInstance.pathname;

        if (Request.method === "POST" && Pathname === "/api/compile")
        {
            await HandleCompile(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/click")
        {
            await HandleResolveClick(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/cursor")
        {
            await HandleResolveCursor(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/resolve-span")
        {
            await HandleResolveSpan(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/cursor-span")
        {
            await HandleCursorSpan(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/export/pdf")
        {
            await HandleExportPdf(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/export/png")
        {
            await HandleExportPng(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/export/svg")
        {
            await HandleExportSvg(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/format")
        {
            await HandleFormat(Request, Response);
            return ;
        }

        if (Request.method === "GET" && Pathname === "/api/workspace/info")
        {
            await HandleWorkspaceInfo(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/directory")
        {
            await HandleAddDirectory(Request, Response);
            return ;
        }

        if ( (Request.method === "POST" || Request.method === "GET") && Pathname === "/api/workspace/pick-folder")
        {
            await HandlePickFolder(Request, Response);
            return ;
        }

        if (Request.method === "DELETE" && Pathname === "/api/workspace/directory")
        {
            await HandleRemoveDirectory(Request, Response);
            return ;
        }

        if (Request.method === "GET" && Pathname === "/api/workspace/list")
        {
            const TargetDir = URLInstance.searchParams.get("dir");
            await HandleListFiles(Request, Response, TargetDir);
            return ;
        }

        if (Request.method === "GET" && Pathname === "/api/workspace/file")
        {
            const TargetPath = URLInstance.searchParams.get("path");
            await HandleReadFile(Request, Response, TargetPath);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/file")
        {
            await HandleSaveFile(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/upload")
        {
            await HandleUploadAsset(Request, Response);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/create")
        {
            await HandleCreateFile(Request, Response);
            return ;
        }

        if (Request.method === "DELETE" && Pathname === "/api/workspace/file")
        {
            const TargetPath = URLInstance.searchParams.get("path");
            await HandleDeleteFile(Request, Response, TargetPath);
            return ;
        }

        if (Request.method === "POST" && Pathname === "/api/workspace/rename")
        {
            await HandleRenameFile(Request, Response);
            return ;
        }

        if (Request.method === "GET" && Pathname === "/api/fonts")
        {
            await HandleListFonts(Request, Response);
            return ;
        }

        if (Request.method === "GET" && Pathname === "/api/font-file")
        {
            const TargetFontPath = URLInstance.searchParams.get("path");
            HandleServeFontFile(Request, Response, TargetFontPath);
            return ;
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
            return ;
        }

        const DecodedPathname = decodeURIComponent(Pathname);
        let TargetFile = Path.join(PUBLIC_DIR, DecodedPathname === "/" ? "index.html": DecodedPathname);
        if (!FS.existsSync(TargetFile) && DecodedPathname === "/")
        {
            TargetFile = Path.join(PUBLIC_DIR, "Index.html");
        }
        ServeStatic(Request, Response, TargetFile);
    }
);

Server.listen
(
    PORT,
    HOST, () =>
    {
        console.log(`Typst Studio Web Server active at http://${HOST}:${PORT}`);
        console.log(`Using LAFS-enabled Typst Engine: ${TYPST_BINARY}`);
    }
);

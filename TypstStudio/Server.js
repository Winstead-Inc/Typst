const HTTP = require("node:http");
const FS = require("node:fs");
const FSPromises = require("node:fs/promises");
const Path = require("node:path");
const ChildProcess = require("node:child_process");
const OS = require("node:os");
const Crypto = require("node:crypto");
const JSZip = require("./public/vendor/jszip.min.js");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const HOST = "127.0.0.1";
const SESSION_AUTH_TOKEN = Crypto.randomBytes(32).toString("hex");
const MAX_REQUEST_BODY_BYTES = 10 * 1024 * 1024; // 10 MB maximum request payload
const FORBIDDEN_EXTENSIONS = new Set
([
    // Windows Executables & Binaries
    ".exe", ".msi", ".msp", ".com", ".scr", ".pif", ".cpl", ".dll", ".sys", ".drv", ".ocx",
    // Windows Scripting & Batch
    ".bat", ".cmd", ".vbs", ".vbe", ".js", ".jse", ".ws", ".wsf", ".wsc", ".wsh", ".ps1", ".psm1", ".psd1",
    // Shortcuts & Links
    ".lnk", ".url", ".scf",
    // Unix Shell & Scripting
    ".sh", ".bash", ".zsh", ".fish", ".csh", ".tcsh", ".ksh", ".awk", ".sed",
    // Dynamic Interpreted Languages
    ".py", ".pyw", ".pyc", ".pyo", ".pyd", ".rb", ".pl", ".pm", ".php", ".cgi",
    // Java & Managed Runtimes
    ".jar", ".class",
    // Native Shared Objects & Installers
    ".so", ".dylib", ".bin", ".app", ".dmg", ".pkg", ".deb", ".rpm",
    // Windows Setup & System Configurations
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
    "reg.exe"
]);

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
let LastActiveSpanMap = {};
let LastActiveSyncMap = [];

if (!FS.existsSync(TEMP_DIR))
{
    FS.mkdirSync(TEMP_DIR, { recursive: true });
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
    const AllowedRoots = GetTrackedDirectories().map((D) => Path.resolve(D));

    const IsContained = AllowedRoots.some
    (
        (Root) =>
        {
            const Relative = Path.relative(Root, Resolved);
            return !Relative.startsWith("..") && !Path.isAbsolute(Relative);
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
    const HostHeader = (Request.headers.host || "").toLowerCase();
    const AllowedHosts = new Set
    ([
        `127.0.0.1:${PORT}`,
        `localhost:${PORT}`,
        `[::1]:${PORT}`
    ]);

    if (!AllowedHosts.has(HostHeader))
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
            const IsAllowedOrigin = AllowedOriginPrefixes.some((Prefix) => OriginHeader.startsWith(Prefix));
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
            const IsAllowedReferer = AllowedRefererPrefixes.some((Prefix) => RefererHeader.startsWith(Prefix));
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
    return Source.replace(/\$(?:[^$]|\\\$)+\$/g, (MathBlock) => {
        return MathBlock.replace(/([a-zA-Z_][a-zA-Z0-9_.]*)[^\S\r\n]*(\r?\n)(\s*)([\(\[\{])/g, (Match, Ident, Newline, Indent, Delim) => {
            return `${Ident}${Delim}${Newline}${Indent} `;
        });
    });
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
        for (let I = 0; I < LineText.length; I++)
        {
            const C = LineText[I];
            const NextC = I + 1 < LineText.length ? LineText[I + 1] : "";
            const PrevC = I > 0 ? LineText[I - 1] : "";
            if (C === '"' && PrevC !== "\\")
            {
                InStr = !InStr;
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

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx++)
    {
        const LineNum = LineIdx + 1;
        const LineText = Lines[LineIdx];
        let InLineComment = false;

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx++)
        {
            const ColNum = ColIdx + 1;
            const Char = LineText[ColIdx];
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1] : "";
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1] : "";

            if (InLineComment) { break; }

            // Raw blocks ```
            if (!InString && BlockCommentDepth === 0 && Char === "`")
            {
                if (LineText.substring(ColIdx, ColIdx + 3) === "```")
                {
                    InRawBlock = !InRawBlock;
                    ColIdx += 2;
                    continue;
                }
                else if (!InRawBlock)
                {
                    InRawInline = !InRawInline;
                    continue;
                }
            }
            if (InRawBlock || InRawInline) { continue; }

            // Block comments /* */
            if (!InString && Char === "/" && NextChar === "*")
            {
                BlockCommentDepth++;
                ColIdx++;
                continue;
            }
            if (!InString && BlockCommentDepth > 0 && Char === "*" && NextChar === "/")
            {
                BlockCommentDepth--;
                ColIdx++;
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
                InString = !InString;
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
                const MatchDelim = Char === ")" ? "(" : (Char === "}" ? "{" : "[");

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
        return { HasError: false, Errors: [] };
    }

    const First = UniqueErrors[0];
    const LineStr = String(First.Line);
    const Margin = " ".repeat(Math.max(2, LineStr.length));
    const FormattedLineNum = LineStr.padStart(Margin.length, " ");
    const PointerIndent = " ".repeat(Math.max(0, First.Col - 1));
    const AnchorTarget = First.Anchor ? `'${First.Anchor}'` : "the statement";

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

function FormatTypstLAFS(Source)
{
    const Lines = (Source || "").split(/\r?\n/);
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

        // Handle '} else if (...) {' or '} else {'
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

        // Handle control flow statements like 'if ... {' or 'while ... {' or 'for ... {'
        const ControlMatch = Trimmed.match(/^(if\s+.*?|while\s+.*?|for\s+.*?|context)\s*\{$/);
        if (ControlMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}${ControlMatch[1]}`);
            ResultLines.push(`${Indent}{`);
            continue;
        }

        // Handle trailing delimiters '{', '(', '[' on multiline constructs
        const EndsWithDelimiter = Trimmed.match(/^(.*?)(\s*)([\{\(\[])\s*$/);
        if (EndsWithDelimiter)
        {
            const Prefix = EndsWithDelimiter[1].trim();
            const Delim = EndsWithDelimiter[3];
            const Indent = Line.match(/^\s*/)[0];

            if (Prefix !== "" && !Prefix.includes("//"))
            {
                ResultLines.push(`${Indent}${Prefix}`);
                ResultLines.push(`${Indent}${Delim}`);
                continue;
            }
        }

        // Handle lines with attached delimiters and inner content, e.g. '#set text(font: "Inter",'
        const AttachedWithContent = Trimmed.match(/^([#a-zA-Z0-9_\-\.]+.*?)(\s*)([\(\{\[])(\s*[^\)\}\]]+)$/);
        if (AttachedWithContent && !Trimmed.endsWith(")") && !Trimmed.endsWith("}") && !Trimmed.endsWith("]"))
        {
            const Prefix = AttachedWithContent[1].trim();
            const Delim = AttachedWithContent[3];
            const Remainder = AttachedWithContent[4].trim();
            const Indent = Line.match(/^\s*/)[0];

            if (Prefix !== "" && !Prefix.includes("//"))
            {
                ResultLines.push(`${Indent}${Prefix}`);
                ResultLines.push(`${Indent}${Delim}`);
                ResultLines.push(`${Indent}    ${Remainder}`);
                continue;
            }
        }

        ResultLines.push(Line);
    }

    return ResultLines.join("\n");
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

async function ScanDirectoryRecursive(CurrentDir, MaxDepth = 6, CurrentDepth = 0)
{
    const Result = { Files: [], Folders: [] };
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
        ).length;
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
            Code: -1,
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
                    windowsHide: Options.windowsHide !== undefined ? Options.windowsHide : true,
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
                "error",
                (Error) =>
                {
                    Resolve
                    ({
                        Success: false,
                        Code: Error.code || -1,
                        Stdout: Stdout,
                        Stderr: Error.message || Stderr
                    });
                }
            );

            Child.on
            (
                "close",
                (Code) =>
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
            Code: -1,
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
                "error",
                (Error) =>
                {
                    if (ActiveCompileProcess === Child) { ActiveCompileProcess = null; }
                    Resolve
                    ({
                        Success: false,
                        Code: Error.code || -1,
                        Killed: Child.killed,
                        Stdout: Stdout,
                        Stderr: Error.message || Stderr
                    });
                }
            );

            Child.on
            (
                "close",
                (Code) =>
                {
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
            let TotalBytes = 0;

            Request.on
            (
                "data",
                (Chunk) =>
                {
                    TotalBytes += Chunk.length;
                    if (TotalBytes > MAX_REQUEST_BODY_BYTES)
                    {
                        Request.destroy();
                        Reject(new Error("Payload entity too large. Limit is 10 MB."));
                        return;
                    }
                    Body += Chunk;
                }
            );

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
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath) : (Payload.FileName || "main.typ");

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
            return;
        }

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        ActiveJobDir = JobDir;
        await FSPromises.mkdir(JobDir, { recursive: true });

        let DocRoot = JobDir;
        if (Payload.FilePath)
        {
            const Validated = ValidateWorkspacePath(Payload.FilePath, false, false);
            if (Validated.Valid)
            {
                DocRoot = Path.dirname(Validated.Path);
            }
        }

        const OutputPattern = Path.join(JobDir, "page-{n}.svg");
        const SourceToCompile = NormalizeMathFunctionCalls(Source);

        const CompileResult = await ExecuteCompile
        (
            TYPST_BINARY,
            ["compile", "--root", DocRoot, "--format", "svg", "-", OutputPattern],
            { cwd: JobDir, timeout: 20000 },
            SourceToCompile
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

        let SyncMap = [];
        const SynctexPath = Path.join(JobDir, "synctex.json");
        if (FS.existsSync(SynctexPath))
        {
            try
            {
                const RawSync = await FSPromises.readFile(SynctexPath, "utf-8");
                SyncMap = JSON.parse(RawSync);
                LastActiveSyncMap = SyncMap;
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
        LastActiveSpanMap = SpanMap;

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

        if (isNaN(X) || isNaN(Y))
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Found: false, Error: "Valid X and Y coordinates are required." }));
            return;
        }

        let BestElem = null;
        let MinDist = Infinity;

        for (const Elem of LastActiveSyncMap)
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
            Response.end(JSON.stringify({ Success: false, Found: false, Error: "No matching source location found." }));
        }
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Err.message }));
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

        if (!Line || !Col)
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Found: false, Error: "Line and Column parameters required." }));
            return;
        }

        let BestElem = null;
        let SmallestRange = Infinity;

        for (const Elem of LastActiveSyncMap)
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
            Response.end(JSON.stringify({ Success: false, Found: false, Error: "No matching preview element found." }));
        }
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Err.message }));
    }
}

async function HandleResolveSpan(Request, Response)
{
    try
    {
        const RawBody = await ReadRequestBody(Request);
        const Payload = JSON.parse(RawBody);
        const Span = Payload.Span;

        if (!Span || !LastActiveSpanMap[Span])
        {
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Span not found in active map." }));
            return;
        }

        const Loc = LastActiveSpanMap[Span];
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
        Response.end(JSON.stringify({ Success: false, Error: Err.message }));
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

        if (!Line || !Col)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Line and Column parameters required." }));
            return;
        }

        let BestSpan = null;
        let SmallestRange = Infinity;

        for (const [SpanId, Loc] of Object.entries(LastActiveSpanMap))
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
            Response.end(JSON.stringify({ Success: false, Error: "No matching span at cursor position." }));
            return;
        }

        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end
        (
            JSON.stringify
            ({
                Success: true,
                Span: BestSpan,
                ...LastActiveSpanMap[BestSpan]
            })
        );
    }
    catch (Err)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: Err.message }));
    }
}

function ConvertColorHex(Hex)
{
    let CleanHex = Hex.replace(/^#/, "");
    if (CleanHex.length === 3)
    {
        CleanHex = CleanHex[0] + CleanHex[0] + CleanHex[1] + CleanHex[1] + CleanHex[2] + CleanHex[2];
    }
    const LowerHex = CleanHex.toLowerCase();
    // Author-defined pure white (e.g. text on colored containers like #4338ca) must remain white!
    if (LowerHex === "ffffff")
    {
        return "ffffff";
    }

    const Red = parseInt(CleanHex.slice(0, 2), 16);
    const Green = parseInt(CleanHex.slice(2, 4), 16);
    const Blue = parseInt(CleanHex.slice(4, 6), 16);
    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 18)
    {
        return CleanHex; // Keep vibrant saturated hue!
    }

    const Avg = (Red + Green + Blue) / 3;
    const MapComp = (L) =>
    {
        if (L >= 254.5) { return 0; }
        const D = 255 - L;
        if (D <= 8) { return Math.round(30 + D * 0.8); } // 30 - 36 (#1e1e1e - #242424) clearly visible subtle alternating rows
        if (D <= 18) { return Math.round(46 + (D - 8) * 1.2); } // 46 - 58 (#2e2e2e - #3a3a3a) distinct card/box backgrounds
        if (D <= 32) { return Math.round(68 + (D - 18) * 1.2); } // 68 - 85 (#444444 - #555555) prominent table header
        if (D <= 55) { return Math.round(86 + (D - 32) * 0.6); } // 86 - 100 (#565656 - #646464) visible borders & dividers
        if (L <= 30) { return 245; } // crisp legible white text
        return Math.round(255 - L);
    };

    const BaseDark = MapComp(Avg);
    const OutR = Math.max(0, Math.min(255, Math.round(BaseDark + (Red - Avg)))).toString(16).padStart(2, "0");
    const OutG = Math.max(0, Math.min(255, Math.round(BaseDark + (Green - Avg)))).toString(16).padStart(2, "0");
    const OutB = Math.max(0, Math.min(255, Math.round(BaseDark + (Blue - Avg)))).toString(16).padStart(2, "0");
    return `${OutR}${OutG}${OutB}`;
}

function ConvertTypstSourceToDarkMode(Source, Transparent = false)
{
    let Transformed = Source.replace
    (
        /rgb\(\s*"#?([0-9a-fA-F]{3,8})"\s*\)/g,
        (Match, HexVal) =>
        {
            return `rgb("#${ConvertColorHex(HexVal)}")`;
        }
    );

    Transformed = Transformed.replace
    (
        /rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+\s*)?\)/g,
        (Match, R, G, B) =>
        {
            const Hex = [R, G, B].map((V) => parseInt(V, 10).toString(16).padStart(2, "0")).join("");
            return `rgb("#${ConvertColorHex(Hex)}")`;
        }
    );

    Transformed = Transformed.replace
    (
        /luma\(\s*(\d{1,3})\s*\)/g,
        (Match, Val) =>
        {
            const Num = parseInt(Val, 10);
            const Hex = Num.toString(16).padStart(2, "0").repeat(3);
            return `rgb("#${ConvertColorHex(Hex)}")`;
        }
    );

    const PageFill = Transparent ? "none" : `rgb("000000")`;
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
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath) : (Payload.FileName || "main.typ");
        const OutputFileName = (Payload.FileName || "document").replace(/[^a-zA-Z0-9_\-]/g, "_") + ".pdf";

        const KnrCheck = DetectKnrSlop(Source, ActiveFileName);
        if (KnrCheck.HasError)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: KnrCheck.FormattedMessage, KnrSlop: true }));
            return;
        }

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        let DocRoot = JobDir;
        if (Payload.FilePath)
        {
            const Validated = ValidateWorkspacePath(Payload.FilePath, false, false);
            if (Validated.Valid)
            {
                DocRoot = Path.dirname(Validated.Path);
            }
        }

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
            TYPST_BINARY,
            ["compile", "--root", DocRoot, "--format", "pdf", "-", OutputPath],
            { cwd: JobDir, timeout: 30000 },
            SourceToCompile
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
        const ActiveFileName = Payload.FilePath ? Path.basename(Payload.FilePath) : (Payload.FileName || "main.typ");

        const KnrCheck = DetectKnrSlop(Source, ActiveFileName);
        if (KnrCheck.HasError)
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: KnrCheck.FormattedMessage, KnrSlop: true }));
            return;
        }

        const JobID = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const JobDir = Path.join(TEMP_DIR, JobID);
        await FSPromises.mkdir(JobDir, { recursive: true });

        let DocRoot = JobDir;
        if (Payload.FilePath)
        {
            const Validated = ValidateWorkspacePath(Payload.FilePath, false, false);
            if (Validated.Valid)
            {
                DocRoot = Path.dirname(Validated.Path);
            }
        }

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

        const OutputPattern = Path.join(JobDir, "page-{n}.png");

        const CompileResult = await ExecuteCommand
        (
            TYPST_BINARY,
            ["compile", "--root", DocRoot, "--format", "png", "--ppi", "288", "-", OutputPattern],
            { cwd: JobDir, timeout: 30000 },
            SourceToCompile
        );

        if (!CompileResult.Success)
        {
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: CompileResult.Stderr || "PNG compilation failed." }));
            return;
        }

        const DirEntries = await FSPromises.readdir(JobDir);
        const PngFiles = DirEntries
            .filter((F) => /^page-\d+\.png$/i.test(F))
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
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});
            Response.writeHead(404, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Requested page not found." }));
            return;
        }

        const BaseDocName = (Payload.FileName || "document").replace(/[^a-zA-Z0-9_\-]/g, "_");

        if (PngFiles.length === 1)
        {
            const SinglePath = Path.join(JobDir, PngFiles[0]);
            const PngBuffer = await FSPromises.readFile(SinglePath);
            await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});

            Response.writeHead
            (
                200,
                {
                    "Content-Type": "image/png",
                    "Content-Disposition": `attachment; filename="${BaseDocName}_page_1.png"`,
                    "Content-Length": PngBuffer.length
                }
            );
            Response.end(PngBuffer);
            return;
        }

        // Multiple pages: package into a ZIP file with page numbers!
        const Zip = new JSZip();
        for (let Index = 0; Index < PngFiles.length; Index++)
        {
            const PageBuffer = await FSPromises.readFile(Path.join(JobDir, PngFiles[Index]));
            Zip.file(`${BaseDocName}_page_${Index + 1}.png`, PageBuffer);
        }

        const ZipBuffer = await Zip.generateAsync({ type: "nodebuffer" });
        await FSPromises.rm(JobDir, { recursive: true, force: true }).catch(() => {});

        Response.writeHead
        (
            200,
            {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename="${BaseDocName}_png_pages.zip"`,
                "Content-Length": ZipBuffer.length
            }
        );
        Response.end(ZipBuffer);
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
        const Formatted = FormatTypstLAFS(Source);
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

        const Stat = await FSPromises.stat(TargetPath);
        if (!Stat.isDirectory())
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Target path is not a directory." }));
            return;
        }

        const RootParsed = Path.parse(TargetPath);
        if (TargetPath.toLowerCase() === RootParsed.root.toLowerCase())
        {
            Response.writeHead(400, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Cannot add an entire drive root as a workspace directory." }));
            return;
        }

        const LowerTarget = TargetPath.toLowerCase();
        const UserHome = Path.resolve(OS.homedir()).toLowerCase();

        // 1. Block user home directory itself
        if (LowerTarget === UserHome)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Cannot add user home root directory directly as a workspace directory." }));
            return;
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
            Response.end(JSON.stringify({ Success: false, Error: "Sensitive user profile or startup directories cannot be added as workspace directories." }));
            return;
        }

        // 3. Block sensitive subfolder names (.ssh, .gnupg) anywhere in path
        const TargetSegments = TargetPath.split(Path.sep).map((S) => S.toLowerCase());
        if (TargetSegments.includes(".ssh") || TargetSegments.includes(".gnupg"))
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "Directories containing cryptographic or credential stores cannot be added as workspace directories." }));
            return;
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

        if (ForbiddenSystemDirs.some((Sys) => LowerTarget === Sys || LowerTarget.startsWith(Sys + Path.sep)))
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: "System directories cannot be added as workspace directories." }));
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
        const Validation = ValidateWorkspacePath(FilePath, true, false);
        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: Validation.Error }));
            return;
        }

        const Content = await FSPromises.readFile(Validation.Path, "utf-8");
        Response.writeHead(200, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: true, Content: Content, Path: Validation.Path, Name: Path.basename(Validation.Path) }));
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
        const Validation = ValidateWorkspacePath(Payload.Path, false, true);

        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: Validation.Error }));
            return;
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
        const RawFileName = (Payload.FileName || "Untitled.typ").trim();
        let FileName = Path.basename(RawFileName);
        if (!FileName.endsWith(".typ")) { FileName += ".typ"; }

        const TargetFullPath = Path.join(TargetDir, FileName);
        const Validation = ValidateWorkspacePath(TargetFullPath, false, true);

        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: Validation.Error }));
            return;
        }

        const FullPath = Validation.Path;
        const Dir = Path.dirname(FullPath);
        if (!FS.existsSync(Dir)) { await FSPromises.mkdir(Dir, { recursive: true }); }

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
        Response.end(JSON.stringify({ Success: true, Path: FullPath, Name: FileName, Content: Content }));
    }
    catch (E)
    {
        Response.writeHead(500, { "Content-Type": "application/json" });
        Response.end(JSON.stringify({ Success: false, Error: E.message }));
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

        const Validation = ValidateWorkspacePath(TargetPath, true, true);
        if (!Validation.Valid)
        {
            Response.writeHead(403, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: false, Error: Validation.Error }));
            return;
        }

        await FSPromises.unlink(Validation.Path);

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
    const RelativeToPublic = Path.relative(PUBLIC_DIR, NormalizedPath);

    if (RelativeToPublic.startsWith("..") || Path.isAbsolute(RelativeToPublic))
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
        const RelParent = Path.relative(PUBLIC_DIR, ParentDir);
        if (!RelParent.startsWith("..") && FS.existsSync(ParentDir))
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

    try
    {
        const Stat = FS.statSync(NormalizedPath);
        if (Stat.isDirectory())
        {
            const CandidateIndex = Path.join(NormalizedPath, "Index.html");
            if (FS.existsSync(CandidateIndex) && FS.statSync(CandidateIndex).isFile())
            {
                NormalizedPath = CandidateIndex;
            }
            else
            {
                Response.writeHead(403, { "Content-Type": "text/plain" });
                Response.end("Forbidden: Directory listing denied.");
                return;
            }
        }
    }
    catch (Err)
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Not Found");
        return;
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
            return;
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
        "error",
        () =>
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
            // Windows: Try modern pwsh (PowerShell 7+) first, fallback to powershell.exe
            const PsCommand =
                "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; " +
                "Add-Type -AssemblyName System.Windows.Forms; " +
                "$Dialog = New-Object System.Windows.Forms.FolderBrowserDialog; " +
                "$Dialog.Description = 'Select Typst Projects Directory'; " +
                "$Dialog.ShowNewFolderButton = $true; " +
                "$TopForm = New-Object System.Windows.Forms.Form; " +
                "$TopForm.TopMost = $true; " +
                "$TopForm.StartPosition = [System.Windows.Forms.FormStartPosition]::CenterScreen; " +
                "if ($Dialog.ShowDialog($TopForm) -eq [System.Windows.Forms.DialogResult]::OK) { " +
                "    Write-Output $Dialog.SelectedPath; " +
                "}";

            // Try pwsh (PowerShell 7+) first
            let Result = await ExecuteCommand
            (
                "pwsh",
                ["-NoProfile", "-STA", "-Command", PsCommand],
                { timeout: 180000, windowsHide: false }
            );

            Selected = (Result.Stdout || "").trim();

            // If pwsh failed to launch or had non-zero exit with empty output, fallback to powershell.exe
            if (!Selected && (!Result.Success || Result.Code !== 0))
            {
                Result = await ExecuteCommand
                (
                    "powershell",
                    ["-NoProfile", "-STA", "-Command", PsCommand],
                    { timeout: 180000, windowsHide: false }
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
                "osascript",
                ["-e", AppleScript],
                { timeout: 180000, windowsHide: false }
            );
            Selected = (Result.Stdout || "").trim();
        }
        else
        {
            // Linux: Try zenity, then kdialog, then python3 tkinter
            const ZenityResult = await ExecuteCommand
            (
                "zenity",
                ["--file-selection", "--directory", "--title=Select Typst Projects Directory"],
                { timeout: 180000, windowsHide: false }
            );
            Selected = (ZenityResult.Stdout || "").trim();

            if (!Selected)
            {
                const KdialogResult = await ExecuteCommand
                (
                    "kdialog",
                    ["--getexistingdirectory", "--title", "Select Typst Projects Directory"],
                    { timeout: 180000, windowsHide: false }
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
                    "python3",
                    ["-c", PyScript],
                    { timeout: 180000, windowsHide: false }
                );
                Selected = (PyResult.Stdout || "").trim();
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
                    TYPST_BINARY,
                    ["fonts", "--variants"],
                    { maxBuffer: 50 * 1024 * 1024, windowsHide: true },
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

            for (let I = 0; I < Lines.length; I++)
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
                            Stretch = InfoMatch[3] ? InfoMatch[3].trim() : "normal";
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

        for (const RegPath of [
            'HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts',
            'HKCU\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts'
        ])
        {
            try
            {
                const RegOut = await new Promise
                (
                    (Resolve) =>
                    {
                        ChildProcess.execFile
                        (
                            "reg",
                            ["query", RegPath],
                            { windowsHide: true },
                            (Err, Stdout) =>
                            {
                                Resolve(Stdout || "");
                            }
                        );
                    }
                );

                if (RegOut)
                {
                    const RegLines = RegOut.split(/\r?\n/).filter((L) => L.trim().length > 0 && !L.startsWith("HKEY_"));
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
                                else if (FS.existsSync(Path.join(WinFontsDir, FontFile)))
                                {
                                    FullPath = Path.join(WinFontsDir, FontFile);
                                }
                                else if (UserFontsDir && FS.existsSync(Path.join(UserFontsDir, FontFile)))
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

    const SortedDetails = Array.from(FontMap.values()).sort
    (
        (A, B) => A.Name.localeCompare(B.Name, undefined, { sensitivity: "base" })
    );

    const SortedNames = SortedDetails.map((D) => D.Name);

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
        Response.end(JSON.stringify({ Success: false, Error: Err.message }));
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
        return;
    }

    const Resolved = Path.resolve(TargetPath);
    const Ext = Path.extname(Resolved).toLowerCase();
    const AllowedFontExts = new Set([".ttf", ".otf", ".ttc", ".woff", ".woff2"]);

    if (!AllowedFontExts.has(Ext))
    {
        Response.writeHead(403, { "Content-Type": "text/plain" });
        Response.end("Forbidden: Only font files (.ttf, .otf, .ttc, .woff, .woff2) can be served.");
        return;
    }

    const AllowedRoots = GetAllowedFontRoots();
    const IsContained = AllowedRoots.some
    (
        (Root) =>
        {
            const Rel = Path.relative(Root, Resolved);
            return !Rel.startsWith("..") && !Path.isAbsolute(Rel);
        }
    );

    if (!IsContained)
    {
        Response.writeHead(403, { "Content-Type": "text/plain" });
        Response.end("Forbidden: Font path outside permitted font directories.");
        return;
    }

    if (!FS.existsSync(Resolved))
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Font file not found on disk.");
        return;
    }

    try
    {
        const Stat = FS.statSync(Resolved);
        if (!Stat.isFile())
        {
            Response.writeHead(403, { "Content-Type": "text/plain" });
            Response.end("Forbidden: Target is not a file.");
            return;
        }
    }
    catch (Err)
    {
        Response.writeHead(404, { "Content-Type": "text/plain" });
        Response.end("Font file not accessible.");
        return;
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
        "error",
        () =>
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
            Response.end(JSON.stringify({ Success: false, Error: AuthCheck.Error }));
            return;
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
            return;
        }

        const URLInstance = new URL(Request.url, `http://${Request.headers.host}`);
        const Pathname = URLInstance.pathname;

        if (Request.method === "GET" && Pathname === "/api/auth/token")
        {
            Response.writeHead(200, { "Content-Type": "application/json" });
            Response.end(JSON.stringify({ Success: true, Token: SESSION_AUTH_TOKEN }));
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/compile")
        {
            await HandleCompile(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/click")
        {
            await HandleResolveClick(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/cursor")
        {
            await HandleResolveCursor(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/resolve-span")
        {
            await HandleResolveSpan(Request, Response);
            return;
        }

        if (Request.method === "POST" && Pathname === "/api/sync/cursor-span")
        {
            await HandleCursorSpan(Request, Response);
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

                if (Request.method === "POST" && Pathname === "/api/workspace/upload")
        {
            await HandleUploadAsset(Request, Response);
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

        if (Request.method === "GET" && Pathname === "/api/fonts")
        {
            await HandleListFonts(Request, Response);
            return;
        }

        if (Request.method === "GET" && Pathname === "/api/font-file")
        {
            const TargetFontPath = URLInstance.searchParams.get("path");
            HandleServeFontFile(Request, Response, TargetFontPath);
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

        const DecodedPathname = decodeURIComponent(Pathname);
        let TargetFile = Path.join(PUBLIC_DIR, DecodedPathname === "/" ? "Index.html" : DecodedPathname);
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

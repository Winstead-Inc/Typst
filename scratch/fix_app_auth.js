const fs = require("fs");

let appJs = fs.readFileSync("TypstStudio/public/App.js", "utf8");
// Safe replace helper
function SafeReplace(Source, Target, Replacement)
{
    if (typeof Target === "string")
    {
        if (!Source.includes(Target))
        {
            throw new Error(`Target string not found: ${Target.slice(0, 50)}...`);
        }
        return Source.replace(Target, () => Replacement);
    }
    else if (Target instanceof RegExp)
    {
        if (!Target.test(Source))
        {
            throw new Error(`Target regex not found: ${Target}`);
        }
        return Source.replace(Target, () => Replacement);
    }
    return Source;
}
// 1. Add AuthenticatedFetch and EnsureSessionAuthToken after let RenderToken = 0;
const authCode = `let RenderToken = 0;
let SessionAuthToken = window.__TYPST_STUDIO_AUTH_TOKEN__ || "";

async function EnsureSessionAuthToken()
{
    if (SessionAuthToken)
    {
        return SessionAuthToken;
    }

    if (typeof window !== "undefined" && window.__TYPST_STUDIO_AUTH_TOKEN__)
    {
        SessionAuthToken = window.__TYPST_STUDIO_AUTH_TOKEN__;
        return SessionAuthToken;
    }

    try
    {
        const Response = await fetch("/api/auth/token");
        const Data = await Response.json();
        if (Data.Success && Data.Token)
        {
            SessionAuthToken = Data.Token;
            window.__TYPST_STUDIO_AUTH_TOKEN__ = Data.Token;
            return SessionAuthToken;
        }
    }
    catch (Err)
    {
        console.error("Failed to acquire session auth token:", Err);
    }

    return SessionAuthToken;
}

async function AuthenticatedFetch(Url, Options = {})
{
    const Token = await EnsureSessionAuthToken();
    const Headers = Options.headers ? { ...Options.headers } : {};

    if (Token)
    {
        Headers["x-typst-auth-token"] = Token;
    }

    return fetch(Url, { ...Options, headers: Headers });
}`;

appJs = SafeReplace(appJs, "let RenderToken = 0;", authCode);
// 2. In TriggerCompileNow: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/compile",`,
    `        const Response = await AuthenticatedFetch
        (
            "/api/compile",`
);
// 3. In ExportPdf: use AuthenticatedFetch and send BlackMode / Transparent
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/export/pdf",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Source: Source, FileName: DocTitle })
            }
        );`,
    `        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked : false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked : false;

        const Response = await AuthenticatedFetch
        (
            "/api/export/pdf",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify
                ({
                    Source: Source,
                    FileName: DocTitle,
                    BlackMode: BlackMode,
                    Transparent: Transparent
                })
            }
        );`
);
// 4. In ExportPng: use AuthenticatedFetch and send BlackMode / Transparent
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/export/png",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Source: Source, PageNum: CurrentActivePage })
            }
        );`,
    `        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked : false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked : false;

        const Response = await AuthenticatedFetch
        (
            "/api/export/png",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify
                ({
                    Source: Source,
                    FileName: DocTitle,
                    PageNum: CurrentActivePage,
                    BlackMode: BlackMode,
                    Transparent: Transparent
                })
            }
        );`
);
// 5. In HandleDroppedAssetFile: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `            const Response = await fetch
            (
                "/api/workspace/upload",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "x-typst-auth-token": SessionAuthToken
                    },`,
    `            const Response = await AuthenticatedFetch
            (
                "/api/workspace/upload",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },`
);
// 6. In PickFolderFromDisk: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `const Response = await fetch("/api/workspace/pick-folder", { method: "POST" });`,
    `const Response = await AuthenticatedFetch("/api/workspace/pick-folder", { method: "POST" });`
);
// 7. In LoadWorkspaceInfo: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `const Response = await fetch("/api/workspace/info");`,
    `const Response = await AuthenticatedFetch("/api/workspace/info");`
);
// 8. In OpenFileFromWorkspace: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `const Response = await fetch(\`/api/workspace/file?path=\${encodeURIComponent(FilePath)}\`);`,
    `const Response = await AuthenticatedFetch(\`/api/workspace/file?path=\${encodeURIComponent(FilePath)}\`);`
);
// 9. In SaveCurrentFile: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/workspace/file",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },`,
    `        const Response = await AuthenticatedFetch
        (
            "/api/workspace/file",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },`
);
// 10. In CreateNewTypstFile: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/workspace/create",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },`,
    `        const Response = await AuthenticatedFetch
        (
            "/api/workspace/create",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },`
);
// 11. In AddWorkspaceDirectory: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/workspace/directory",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },`,
    `        const Response = await AuthenticatedFetch
        (
            "/api/workspace/directory",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },`
);
// 12. In RemoveWorkspaceDirectory: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            "/api/workspace/directory",
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },`,
    `        const Response = await AuthenticatedFetch
        (
            "/api/workspace/directory",
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },`
);
// 13. In DeleteWorkspaceFile: use AuthenticatedFetch
appJs = SafeReplace
(
    appJs,
    `        const Response = await fetch
        (
            \`/api/workspace/file?path=\${encodeURIComponent(FilePath)}\`,
            {
                method: "DELETE"
            }
        );`,
    `        const Response = await AuthenticatedFetch
        (
            \`/api/workspace/file?path=\${encodeURIComponent(FilePath)}\`,
            {
                method: "DELETE"
            }
        );`
);
// 14. In SetupEventListeners: add Export options sync & localStorage persistence
const exportSyncCode = `    // Export Options Sync & Persistence
    const ExportBlackCb = document.getElementById("ExportBlackModeCheckbox");
    const ExportTransCb = document.getElementById("ExportTransparentCheckbox");
    const ExportPaperSelect = document.getElementById("ExportPaperModeSelect");
    const ExportPaperBadge = document.getElementById("ExportPaperModeBadge");
    const DefaultBgSelect = document.getElementById("DefaultExportBgSelect");

    // Load initial states from localStorage
    const InitialBlack = localStorage.getItem("typst_black_mode_export") === "true";
    const InitialTrans = localStorage.getItem("typst_transparent_export") === "true";
    if (ExportBlackCb) { ExportBlackCb.checked = InitialBlack; }
    if (ExportTransCb) { ExportTransCb.checked = InitialTrans; }
    if (ExportPaperSelect) { ExportPaperSelect.value = InitialBlack ? "black" : "light"; }
    if (ExportPaperBadge) { ExportPaperBadge.textContent = InitialBlack ? "Black Mode (Inverted)" : "Light Mode (Normal)"; }
    if (DefaultBgSelect) { DefaultBgSelect.value = InitialTrans ? "transparent" : "normal"; }

    if (ExportBlackCb)
    {
        ExportBlackCb.addEventListener
        (
            "change",
            (E) =>
            {
                const IsBlack = E.target.checked;
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true" : "false");
                if (ExportPaperSelect) { ExportPaperSelect.value = IsBlack ? "black" : "light"; }
                if (ExportPaperBadge) { ExportPaperBadge.textContent = IsBlack ? "Black Mode (Inverted)" : "Light Mode (Normal)"; }
                ShowToast(\`Export in Black mode: \${IsBlack ? "Enabled" : "Disabled"}\`, "info");
            }
        );
    }

    if (ExportTransCb)
    {
        ExportTransCb.addEventListener
        (
            "change",
            (E) =>
            {
                const IsTrans = E.target.checked;
                localStorage.setItem("typst_transparent_export", IsTrans ? "true" : "false");
                if (DefaultBgSelect) { DefaultBgSelect.value = IsTrans ? "transparent" : "normal"; }
                ShowToast(\`Transparent background: \${IsTrans ? "Enabled" : "Disabled"}\`, "info");
            }
        );
    }

    if (ExportPaperSelect)
    {
        ExportPaperSelect.addEventListener
        (
            "change",
            (E) =>
            {
                const IsBlack = E.target.value === "black";
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true" : "false");
                if (ExportBlackCb) { ExportBlackCb.checked = IsBlack; }
                if (ExportPaperBadge) { ExportPaperBadge.textContent = IsBlack ? "Black Mode (Inverted)" : "Light Mode (Normal)"; }
                ShowToast(\`Export paper mode set to \${IsBlack ? "Black" : "Light"}\`, "info");
            }
        );
    }

    if (DefaultBgSelect)
    {
        DefaultBgSelect.addEventListener
        (
            "change",
            (E) =>
            {
                const IsTrans = E.target.value === "transparent";
                localStorage.setItem("typst_transparent_export", IsTrans ? "true" : "false");
                if (ExportTransCb) { ExportTransCb.checked = IsTrans; }
                ShowToast(\`Default export background set to \${IsTrans ? "Transparent" : "Solid"}\`, "info");
            }
        );
    }
`;

appJs = SafeReplace
(
    appJs,
    `    // Priority 1: Jump to Primary Error button`,
    `${exportSyncCode}\n    // Priority 1: Jump to Primary Error button`
);
// 15. In InitializeMonaco: ensure auth token before initial compilation
appJs = SafeReplace
(
    appJs,
    `function InitializeMonaco()
{
    window.require.config`,
    `async function InitializeMonaco()
{
    await EnsureSessionAuthToken();
    window.require.config`
);
// 16. In DOMContentLoaded: ensure token immediately
appJs = SafeReplace
(
    appJs,
    `window.addEventListener
(
    "DOMContentLoaded",
    () =>
    {
        LoadUISettings();`,
    `window.addEventListener
(
    "DOMContentLoaded",
    async () =>
    {
        await EnsureSessionAuthToken();
        LoadUISettings();`
);

fs.writeFileSync("TypstStudio/public/App.js", appJs, "utf8");
console.log("SUCCESS: App.js fully secured with AuthenticatedFetch!");

const HTTP = require("node:http");
const FS = require("node:fs");

async function FetchURL(Pathname)
{
    return new Promise
    (
        (Resolve, Reject) =>
        {
            HTTP.get
            (
                `http://127.0.0.1:3000${Pathname}`, (Res) =>
                {
                    let Body = "";
                    Res.on("data", (Chunk) => Body += Chunk);
                    Res.on
                    (
                        "end", () => Resolve( { Status: Res.statusCode, Body, Headers: Res.headers })
                    );
                }
            )
            .on("error", Reject);
        }
    );
}

async function PostJSON(Pathname, Data, Headers = {})
{
    const Payload = JSON.stringify(Data);
    return new Promise
    (
        (Resolve, Reject) =>
        {
            const Req = HTTP.request
            (
                `http://127.0.0.1:3000${Pathname}`,
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(Payload),
                        ...Headers
                    }
                },
                (Res) =>
                {
                    let Body = "";
                    Res.on("data", (Chunk) => Body += Chunk);
                    Res.on
                    (
                        "end", () =>
                        {
                            try
                            {
                                Resolve
                                ({
                                    Status: Res.statusCode, Data: JSON.parse(Body)
                                });
                            }
                            catch (E)
                            {
                                Resolve( { Status: Res.statusCode, Body });
                            }
                        }
                    );
                }
            );
            Req.on("error", Reject);
            Req.write(Payload);
            Req.end();
        }
    );
}

async function RunAllEnhancementTests()
{
    console.log("================================================================================");
    console.log("             VERIFYING ALL TYPST STUDIO ENHANCEMENTS (PRIORITIES 1-4)           ");
    console.log("================================================================================");

    let Passed = 0;
    let Total = 0;

    function Assert(Condition, Description)
    {
        Total ++;
        if (Condition)
        {
            console.log(`  [PASS] Test ${Total}: ${Description}`);
            Passed ++;
        }
        else
        {
            console.error(`  [FAIL] Test ${Total}: ${Description}`);
            process.exit(1);
        }
    }
    // 1. Fetch HTML and verify DOM Elements
    console.log("\nSECTION 1: UI DOM & Component Architecture");
    const HtmlRes = await FetchURL("/");
    Assert(HtmlRes.Status === 200, "Index.html returns HTTP 200");
    const Html = HtmlRes.Body;

    Assert(/Id\s*=\s*"LayoutSwitcherNav"/.test(Html), "Viewport Layout Switcher container present");
    Assert(/Id\s*=\s*"LayoutSplitBtn"/.test(Html), "Split view button present");
    Assert(/Id\s*=\s*"LayoutEditorBtn"/.test(Html), "Editor-only view button present");
    Assert(/Id\s*=\s*"LayoutPreviewBtn"/.test(Html), "Preview-only view button present");
    Assert(/Id\s*=\s*"OutlineSidebar"/.test(Html), "Document Outline (TOC) sidebar present");
    Assert(/Id\s*=\s*"OutlineSearchInput"/.test(Html), "Outline search filter input present");
    Assert(/Id\s*=\s*"StatusOutlineToggle"/.test(Html), "Status bar outline button present");
    Assert(/Id\s*=\s*"AssetDropOverlay"/.test(Html), "Drag & Drop Asset overlay present");
    Assert(/Id\s*=\s*"ShortcutsModal"/.test(Html), "Keyboard shortcuts cheat sheet modal present");
    Assert(/Id\s*=\s*"ShortcutsHelpBtn"/.test(Html), "Shortcuts help button '?' present");
    Assert(/Id\s*=\s*"PrintDocButton"/.test(Html), "Print document button present");
    Assert(/Id\s*=\s*"ToastContainer"/.test(Html), "Floating Toast notification container present");
    Assert(/Id\s*=\s*"UnsavedDirtyDot"/.test(Html), "Unsaved dirty state indicator present");
    Assert(/Id\s*=\s*"JumpToPrimaryErrorBtn"/.test(Html), "Jump to Primary Error button present");
    // 2. Verify CSS Styles
    console.log("\nSECTION 2: CSS Architecture & Formatting");
    const CssRes = await FetchURL("/Style.css?v=20261105_14");
    Assert(CssRes.Status === 200, "Style.css returns HTTP 200");
    const Css = CssRes.Body;

    Assert(Css.includes(".LayoutSwitcherNav"), "LayoutSwitcherNav CSS present");
    Assert(Css.includes(".MainSplitArea.LayoutEditorOnly"), "Editor-only layout CSS present");
    Assert(Css.includes(".MainSplitArea.LayoutPreviewOnly"), "Preview-only layout CSS present");
    Assert(Css.includes(".OutlineSidebar"), "OutlineSidebar CSS present");
    Assert(Css.includes(".AssetDropOverlay"), "AssetDropOverlay CSS present");
    Assert(Css.includes(".ShortcutsModalDialog"), "ShortcutsModalDialog CSS present");
    Assert(Css.includes("@media print"), "Native print @media rule present");
    Assert(Css.includes(".Toast.ToastSuccess"), "Toast notification CSS present");
    Assert(Css.includes(".ExportMenuDropdown"), "ExportMenuDropdown CSS present");

    const HexColors = Css.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
    console.log(`  (Verified ${HexColors.length} total hex color tokens in stylesheet)`);
    // 3. Verify JavaScript Logic in App.js
    console.log("\nSECTION 3: Client Application Logic");
    const AppJsRes = await FetchURL("/App.js?v=20261105_14");
    Assert(AppJsRes.Status === 200, "App.js returns HTTP 200");
    const AppJs = AppJsRes.Body;

    Assert(AppJs.includes("function SetViewportLayout"), "SetViewportLayout function present");
    Assert(AppJs.includes("function ToggleDocumentOutline"), "ToggleDocumentOutline function present");
    Assert(AppJs.includes("function UpdateDocumentOutline"), "UpdateDocumentOutline function present");
    Assert(AppJs.includes("function SetupAssetDragAndDrop"), "SetupAssetDragAndDrop function present");
    Assert(AppJs.includes("function HandleDroppedAssetFile"), "HandleDroppedAssetFile function present");
    Assert(AppJs.includes("function ToggleShortcutsModal"), "ToggleShortcutsModal function present");
    Assert(AppJs.includes("function TriggerDocumentPrint"), "TriggerDocumentPrint function present");
    Assert(AppJs.includes("registerCompletionItemProvider"), "Monaco IntelliSense provider registered");
    Assert(AppJs.includes("function ShowToast"), "ShowToast function present");
    Assert(AppJs.includes("function MarkDocumentClean"), "MarkDocumentClean dirty state manager present");
    // 4. Verify Server Endpoints
    console.log("\nSECTION 4: Server API & Security Verification");
    const TokenRes = await FetchURL("/api/auth/token");
    Assert(TokenRes.Status === 200, "Token endpoint returns HTTP 200");
    const TokenData = JSON.parse(TokenRes.Body);
    const Token = TokenData.Token;
    Assert(Boolean(Token && Token.length === 64), "Cryptographic Session Auth Token valid");
    // Test asset upload
    const TestPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    const UploadRes = await PostJSON
    (
        "/api/workspace/upload",
        {
            FileName: "test_asset.png",
            Base64Data: TestPng
        },
        { "x-typst-auth-token": Token }
    );
    Assert(UploadRes.Status === 200 && UploadRes.Data.Success, "Asset upload endpoint returns success");
    Assert(UploadRes.Data.FileName === "test_asset.png", "Uploaded file name preserved and sanitized");
    // Test clean compile with LAFS
    const CompileRes = await PostJSON
    (
        "/api/compile",
        {
            Source: `#set page(paper: "a4")\n\n= Test Heading\n\nHello from enhanced Typst Studio!`,
            FileName: "main.typ"
        },
        { "x-typst-auth-token": Token }
    );
    Assert(CompileRes.Status === 200 && CompileRes.Data.Success, "Clean LAFS document compiles successfully");
    // Test K&R Slop rejection
    const KnrRes = await PostJSON
    (
        "/api/compile",
        {
            Source: `#set page(\n  paper: "a4"\n)\n\nHello`,
            FileName: "main.typ"
        },
        { "x-typst-auth-token": Token }
    );
    Assert(!KnrRes.Data.Success && KnrRes.Data.KnrSlop === true, "1978 K&R Slop correctly rejected with diagnostic message and KnrSlop: true");

    console.log("\n================================================================================");
    console.log(`TEST SUMMARY: Total: ${Total} | Passed: ${Passed} | Failed: 0`);
    console.log("================================================================================");
}

RunAllEnhancementTests().catch
(
    (Err) =>
    {
        console.error(Err);
        process.exit(1);
    }
);

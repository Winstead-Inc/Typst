const Assert = require("node:assert/strict");
const FS = require("node:fs");
const OS = require("node:os");
const Path = require("node:path");
const VM = require("node:vm");

const
{
    GetRustTargetTriple,
    GetExecutableSuffix,
    GetBinaryCandidateNames,
    StripVerbatimPrefix,
    IsWindowsPathStyle,
    CanonicalizePathKey,
    IsPathContainedIn,
    CheckWorkspacePathSecurityForPlatform,
    ValidateWorkspacePath,
    ResolveDocRoot,
    GetTrackedDirectories,
    ResolveTypstBinary,
    VerifyLafsBinaryIntegrity,
    PINNED_LAFS_HASHES_BY_PLATFORM,
    ComputeLineOffsets,
    FindLineInfoForOffset,
    EnrichReferences
} = require("../TypstStudio/Server.js");

function LoadFrontendCrossPlatformHelpers()
{
    const AppSource = FS.readFileSync(Path.resolve(__dirname, "..", "TypstStudio", "public", "App.js"), "utf8");
    const StartMarker = "function StripWindowsVerbatimStrFrontend(PathStr)";
    const EndMarker = "let CurrentPaperColorMode =";
    const StartIdx = AppSource.indexOf(StartMarker);
    const EndIdx = AppSource.indexOf(EndMarker);
    Assert.ok(StartIdx !== -1 && EndIdx !== -1 && EndIdx > StartIdx, "Frontend path helpers slice must exist in App.js");

    const Slice = AppSource.slice(StartIdx, EndIdx);
    const Sandbox =
    {
        TextEncoder,
        btoa: (Str) => Buffer.from(Str, "binary").toString("base64"),
        navigator: { platform: "Linux x86_64" }
    };
    VM.createContext(Sandbox);
    VM.runInContext(Slice, Sandbox);
    return Sandbox;
}

function CreateMockPreviewEnvironment()
{
    const ElementsById = new Map();

    function ParseTagClassTokens(ClassStr)
    {
        return String(ClassStr || "").split(/\s+/).filter(Boolean);
    }

    class FakeClassList
    {
        constructor(Owner)
        {
            this.Owner = Owner;
        }
        add(...Names)
        {
            const SetTokens = new Set(ParseTagClassTokens(this.Owner._className));
            for (const Name of Names)
            {
                if (Name) { SetTokens.add(Name); }
            }
            this.Owner._className = Array.from(SetTokens).join(" ");
        }
        remove(...Names)
        {
            const RemoveSet = new Set(Names);
            this.Owner._className = ParseTagClassTokens(this.Owner._className)
                .filter((Token) => !RemoveSet.has(Token))
                .join(" ");
        }
        contains(Name)
        {
            return ParseTagClassTokens(this.Owner._className).includes(Name);
        }
    }

    class FakeElement
    {
        constructor(TagName, Id = "")
        {
            this.tagName = TagName.toLowerCase();
            this._id = Id;
            this._className = "";
            this.classList = new FakeClassList(this);
            this.dataset = {};
            this.style = {};
            this.children = [];
            this._innerHTML = "";
            this.value = "";
            this.textContent = "";
            if (Id)
            {
                ElementsById.set(Id, this);
            }
        }
        get id()
        {
            return this._id;
        }
        set id(Val)
        {
            if (this._id && ElementsById.get(this._id) === this)
            {
                ElementsById.delete(this._id);
            }
            this._id = Val;
            if (Val)
            {
                ElementsById.set(Val, this);
            }
        }
        get className()
        {
            return this._className;
        }
        set className(Val)
        {
            this._className = String(Val || "");
        }
        get lastChild()
        {
            return this.children.length > 0 ? this.children[this.children.length - 1] : null;
        }
        get innerHTML()
        {
            return this._innerHTML;
        }
        set innerHTML(Val)
        {
            this._innerHTML = String(Val || "");
            this.children = [];
            if (this._innerHTML.includes("<svg"))
            {
                const SvgChild = new FakeElement("svg");
                SvgChild._innerHTML = this._innerHTML;
                this.children.push(SvgChild);
            }
        }
        appendChild(Child)
        {
            this.children.push(Child);
            if (Child.id)
            {
                ElementsById.set(Child.id, Child);
            }
            return Child;
        }
        removeChild(Child)
        {
            const Idx = this.children.indexOf(Child);
            if (Idx !== -1)
            {
                this.children.splice(Idx, 1);
            }
            if (Child.id && ElementsById.get(Child.id) === Child)
            {
                ElementsById.delete(Child.id);
            }
            return Child;
        }
        querySelector(Selector)
        {
            const Parts = String(Selector || "").trim().split(/\s+/).filter(Boolean);
            if (Parts.length === 0)
            {
                return null;
            }
            const MatchesPart = (El, Part) =>
            {
                if (Part.startsWith("."))
                {
                    return El.classList.contains(Part.slice(1));
                }
                return El.tagName === Part.toLowerCase();
            };
            const FindRecursive = (Root, PartIdx) =>
            {
                for (const Child of Root.children)
                {
                    if (MatchesPart(Child, Parts[PartIdx]))
                    {
                        if (PartIdx === Parts.length - 1)
                        {
                            return Child;
                        }
                        const SubMatch = FindRecursive(Child, PartIdx + 1);
                        if (SubMatch)
                        {
                            return SubMatch;
                        }
                    }
                    const Deep = FindRecursive(Child, PartIdx);
                    if (Deep)
                    {
                        return Deep;
                    }
                }
                return null;
            };
            return FindRecursive(this, 0);
        }
    }

    const PreviewViewport = new FakeElement("div", "PreviewViewport");
    const PagesContainer = new FakeElement("div", "PagesContainer");
    PreviewViewport.appendChild(PagesContainer);
    new FakeElement("span", "BlackPageIcon");
    new FakeElement("span", "BlackPageLabel");
    new FakeElement("button", "BlackPageToggle");
    new FakeElement("select", "ExportPaperModeSelect");
    new FakeElement("span", "ExportPaperModeBadge");

    const DocumentMock =
    {
        getElementById: (Id) => ElementsById.get(Id) || null,
        createElement: (Tag) => new FakeElement(Tag),
        querySelectorAll: () => []
    };

    return { DocumentMock, ElementsById, PreviewViewport, PagesContainer };
}

function LoadFrontendPreviewHelpers()
{
    const AppSource = FS.readFileSync(Path.resolve(__dirname, "..", "TypstStudio", "public", "App.js"), "utf8");

    const Slice1Start = AppSource.indexOf("function FastHash(Str)");
    const Slice1End = AppSource.indexOf("function ParseCompilerDiagnostics(");
    Assert.ok(Slice1Start !== -1 && Slice1End > Slice1Start, "Preview SVG & RenderPages slice must exist in App.js");

    const Slice2Start = AppSource.indexOf("function SetPaperColorMode(NewMode)");
    const Slice2End = AppSource.indexOf("function ToggleBlackPageMode()");
    Assert.ok(Slice2Start !== -1 && Slice2End > Slice2Start, "SetPaperColorMode & UpdateBlackPageMode slice must exist in App.js");

    const Slice3Start = AppSource.indexOf("function HandlePreviewClick(Event)");
    const Slice3End = AppSource.indexOf("function JumpMonacoToLocation(Line, Column)");
    Assert.ok(Slice3Start !== -1 && Slice3End > Slice3Start, "HandlePreviewClick slice must exist in App.js");

    const Env = CreateMockPreviewEnvironment();
    const RafQueue = [];
    const StorageMap = new Map();
    const RecordedJumps = [];
    const RecordedHighlights = [];

    const Preamble = `
        let ActiveDocumentCanonicalPath = "/docs/tables.typ";
        let CurrentFilePath = "/docs/tables.typ";
        let ActiveCompileGeneration = 1;
        let CompileGeneration = 1;
        let CurrentZoomLevel = 1.0;
        let RenderToken = 0;
        let CurrentPaperColorMode = "light";
        let IsBlackPageMode = false;
        let LastCompiledPages = [];
        let IsSyncTexEnabled = true;
        let ActiveSyncMap = [];
        let SuppressForwardSync = false;
    `;

    const Postamble = `
        function __SetLastCompiledPages(Pages) { LastCompiledPages = Pages; }
        function __GetPaperMode() { return CurrentPaperColorMode; }
        function __SetActiveSyncMap(Items) { ActiveSyncMap = Items; }
    `;

    const CombinedSource = [
        Preamble,
        AppSource.slice(Slice1Start, Slice1End),
        AppSource.slice(Slice2Start, Slice2End),
        AppSource.slice(Slice3Start, Slice3End),
        Postamble
    ].join("\n\n");

    const Sandbox =
    {
        AppSource,
        document: Env.DocumentMock,
        window:
        {
            getSelection: () => ({ toString: () => "" })
        },
        navigator: { platform: "Linux x86_64" },
        localStorage:
        {
            getItem: (K) => StorageMap.has(K) ? StorageMap.get(K) : null,
            setItem: (K, V) => StorageMap.set(K, String(V))
        },
        requestAnimationFrame: (Cb) =>
        {
            RafQueue.push(Cb);
            return RafQueue.length;
        },
        setTimeout: (Fn) => { Fn(); return 1; },
        RebuildMonotonicSyncAnchors: () => {},
        GroupElementsIntoVisualBoxes: (Items) => Items,
        HighlightSvgRects: (Boxes) => { RecordedHighlights.push(Boxes); },
        JumpMonacoToLocation: (Line, Col) => { RecordedJumps.push({ Line, Col }); }
    };

    VM.createContext(Sandbox);
    VM.runInContext(CombinedSource, Sandbox);

    function FlushAnimationFrames()
    {
        let Guard = 0;
        while (RafQueue.length > 0 && Guard < 500)
        {
            Guard ++;
            const Batch = RafQueue.splice(0, RafQueue.length);
            for (const Cb of Batch)
            {
                Cb();
            }
        }
    }

    return {
        Sandbox,
        Env,
        FlushAnimationFrames,
        RecordedJumps,
        RecordedHighlights
    };
}

let PassedCount = 0;

function RunTest(Name, Fn)
{
    Fn();
    PassedCount ++;
    console.log(`  [PASS] ${Name}`);
}

function Main()
{
    console.log("Running TypstStudio Cross-Platform Portability Test Suite...\n");
    const Frontend = LoadFrontendCrossPlatformHelpers();

    RunTest
    (
        "Executable suffix and Tauri sidecar triple resolution across Windows, macOS, and Linux",
        () =>
        {
            Assert.equal(GetExecutableSuffix("win32"), ".exe");
            Assert.equal(GetExecutableSuffix("darwin"), "");
            Assert.equal(GetExecutableSuffix("linux"), "");

            Assert.equal(GetRustTargetTriple("win32", "x64"), "x86_64-pc-windows-msvc");
            Assert.equal(GetRustTargetTriple("darwin", "arm64"), "aarch64-apple-darwin");
            Assert.equal(GetRustTargetTriple("darwin", "x64"), "x86_64-apple-darwin");
            Assert.equal(GetRustTargetTriple("linux", "x64"), "x86_64-unknown-linux-gnu");
            Assert.equal(GetRustTargetTriple("linux", "arm64"), "aarch64-unknown-linux-gnu");

            Assert.deepEqual
            (
                GetBinaryCandidateNames("typst", "win32", "x64"),
                ["typst-x86_64-pc-windows-msvc.exe", "typst.exe"]
            );
            Assert.deepEqual
            (
                GetBinaryCandidateNames("typst", "darwin", "arm64"),
                ["typst-aarch64-apple-darwin", "typst"]
            );
            Assert.deepEqual
            (
                GetBinaryCandidateNames("lafs", "linux", "x64"),
                ["lafs-x86_64-unknown-linux-gnu", "lafs"]
            );

            const ResolvedTypst = ResolveTypstBinary();
            Assert.ok(typeof ResolvedTypst === "string" && ResolvedTypst.length > 0);
            if (process.platform === "win32")
            {
                Assert.ok(ResolvedTypst.endsWith(".exe"), "Windows typst binary path must end with .exe");
            }
            else
            {
                Assert.ok(!ResolvedTypst.endsWith(".exe"), "POSIX typst binary path must not force .exe");
            }
        }
    );

    RunTest
    (
        "Per-OS LAFS hash table and untrusted path rejection",
        () =>
        {
            for (const Key of ["win32-x64", "win32-arm64", "darwin-arm64", "darwin-x64", "linux-x64", "linux-arm64"])
            {
                Assert.ok(PINNED_LAFS_HASHES_BY_PLATFORM[Key] instanceof Set, `Missing platform entry: ${Key}`);
            }
            Assert.ok(PINNED_LAFS_HASHES_BY_PLATFORM["win32-x64"].size >= 5);

            const OutsideCheck = VerifyLafsBinaryIntegrity(Path.join(OS.tmpdir(), "nonexistent-lafs"));
            Assert.equal(OutsideCheck.Valid, false);
        }
    );

    RunTest
    (
        "CanonicalizePathKey and frontend CanonicalizeDocKey preserve POSIX case & leading '/' while normalizing Windows paths",
        () =>
        {
            // Server.js checks
            Assert.equal
            (
                CanonicalizePathKey("\\\\?\\E:\\Typst\\My Docs\\Main.typ", "win32"),
                "e:\\typst\\my docs\\main.typ"
            );
            Assert.equal
            (
                CanonicalizePathKey("/Users/Alice Smith/Docs/Main.typ", "darwin"),
                "/Users/Alice Smith/Docs/Main.typ"
            );
            Assert.notEqual
            (
                CanonicalizePathKey("/home/alice/Docs/Main.typ", "linux"),
                CanonicalizePathKey("/home/alice/docs/main.typ", "linux")
            );

            // Frontend App.js checks
            Assert.equal
            (
                Frontend.CanonicalizeDocKey("\\\\?\\E:\\Typst\\My Docs\\Main.typ"),
                "e:/typst/my docs/main.typ"
            );
            Assert.equal
            (
                Frontend.CanonicalizeDocKey("C:\\Users\\Alice\\file.typ"),
                "c:/users/alice/file.typ"
            );
            Assert.equal
            (
                Frontend.CanonicalizeDocKey("/Users/Alice Smith/My Docs/Main.typ"),
                "/Users/Alice Smith/My Docs/Main.typ"
            );
            Assert.equal
            (
                Frontend.CanonicalizeDocKey("/home/alice/Docs/Main.typ"),
                "/home/alice/Docs/Main.typ"
            );
            Assert.notEqual
            (
                Frontend.CanonicalizeDocKey("/home/alice/Docs/Main.typ"),
                Frontend.CanonicalizeDocKey("/home/alice/docs/main.typ")
            );
            Assert.equal(Frontend.PathsEqualFrontend("/home/alice/Docs/A.typ", "/home/alice/docs/A.typ"), false);
            Assert.equal(Frontend.PathsEqualFrontend("C:\\Docs\\A.typ", "c:/docs/a.typ"), true);

            // UTF-8 safe cache key encoding
            const Encoded = Frontend.EncodeCacheKey("/Users/Alice/Übung — 日本語/Main.typ");
            Assert.ok(Encoded && Encoded.length > 0);
        }
    );

    RunTest
    (
        "OS-correct IsPathContainedIn and security checks (ADS Windows-only, ':' valid on POSIX, null/'..' blocked everywhere)",
        () =>
        {
            Assert.equal(IsPathContainedIn("e:\\Typst\\Docs", "E:\\typst\\docs\\Sub\\Main.typ", "win32"), true);
            Assert.equal(IsPathContainedIn("e:\\Typst\\Docs", "E:\\typst\\DocsEvil\\Main.typ", "win32"), false);

            Assert.equal(IsPathContainedIn("/home/alice/Docs", "/home/alice/Docs/Sub Dir/Main.typ", "linux"), true);
            Assert.equal(IsPathContainedIn("/home/alice/Docs", "/home/alice/docs/Main.typ", "linux"), false);
            Assert.equal(IsPathContainedIn("/home/alice/Docs", "/home/alice/DocsEvil/Main.typ", "linux"), false);
            Assert.equal(IsPathContainedIn("/home/alice/Docs", "/home/alice/Docs/..hidden.typ", "linux"), true);

            // Security checks
            Assert.equal(CheckWorkspacePathSecurityForPlatform("E:\\Typst\\doc.typ", "win32").Valid, true);
            Assert.equal(CheckWorkspacePathSecurityForPlatform("\\\\?\\E:\\Typst\\doc.typ", "win32").Valid, true);
            Assert.equal(CheckWorkspacePathSecurityForPlatform("E:\\Typst\\doc.typ:hidden", "win32").Valid, false);

            Assert.equal(CheckWorkspacePathSecurityForPlatform("/home/alice/notes:v2/doc.typ", "linux").Valid, true);
            Assert.equal(CheckWorkspacePathSecurityForPlatform("/Users/alice/Draft:1/My File.typ", "darwin").Valid, true);

            Assert.equal(CheckWorkspacePathSecurityForPlatform("/home/alice/doc\0.typ", "linux").Valid, false);
            Assert.equal(CheckWorkspacePathSecurityForPlatform("/home/alice/../etc/passwd", "linux").Valid, false);
            Assert.equal(CheckWorkspacePathSecurityForPlatform("E:\\ws\\..\\Windows\\win.ini", "win32").Valid, false);

            // Live temporary filesystem check on active host OS
            const TempRoot = FS.mkdtempSync(Path.join(OS.tmpdir(), "typst-xplat-"));
            try
            {
                const UpperDir = Path.join(TempRoot, "Docs");
                FS.mkdirSync(UpperDir, { recursive: true });
                const TargetFile = Path.join(UpperDir, "Main With Spaces.typ");
                FS.writeFileSync(TargetFile, "= Hello\n", "utf8");
                Assert.equal(IsPathContainedIn(UpperDir, TargetFile), true);

                if (process.platform === "linux")
                {
                    Assert.equal(IsPathContainedIn(UpperDir, Path.join(TempRoot, "docs", "Main With Spaces.typ")), false);
                }
            }
            finally
            {
                FS.rmSync(TempRoot, { recursive: true, force: true });
            }
        }
    );

    RunTest
    (
        "Cross-platform compiler diagnostics parsing matches Windows, verbatim, macOS, Linux, and relative paths with spaces",
        () =>
        {
            const Samples =
            [
                { Line: "   ┌─ E:\\My Docs\\sub dir\\main.typ:10:5", File: "E:\\My Docs\\sub dir\\main.typ", L: 10, C: 5 },
                { Line: "   ┌─ \\\\?\\E:\\Typst\\With Spaces\\doc.typ:14:2", File: "\\\\?\\E:\\Typst\\With Spaces\\doc.typ", L: 14, C: 2 },
                { Line: "   ┌─ /Users/Alice Smith/Papers/main.typ:22:9", File: "/Users/Alice Smith/Papers/main.typ", L: 22, C: 9 },
                { Line: "   ┌─ /home/alice/my repo/ch 1.typ:33:1", File: "/home/alice/my repo/ch 1.typ", L: 33, C: 1 },
                { Line: "   --> ../components/base.typ:7:12", File: "../components/base.typ", L: 7, C: 12 },
                { Line: "   ┌─ sub dir/ch 1.typ:4:1", File: "sub dir/ch 1.typ", L: 4, C: 1 }
            ];

            for (const Case of Samples)
            {
                const Parsed = Frontend.ParseDiagnosticLocationLine(Case.Line);
                Assert.ok(Parsed !== null, `Failed to parse diagnostic line: ${Case.Line}`);
                Assert.equal(Parsed.File, Case.File);
                Assert.equal(Parsed.Line, Case.L);
                Assert.equal(Parsed.Col, Case.C);
            }
        }
    );

    RunTest
    (
        "CRLF vs LF line offset mapping in SyncTeX helpers produces exact offsets",
        () =>
        {
            const LfDoc = "= Intro <sec_intro>\nSecond line\nSee @sec_intro here.";
            const CrlfDoc = LfDoc.replace(/\n/g, "\r\n");

            const LfOffsets = ComputeLineOffsets(LfDoc);
            const CrlfOffsets = ComputeLineOffsets(CrlfDoc);
            Assert.equal(LfOffsets[2].StartOffset, LfDoc.indexOf("See @sec_intro"));
            Assert.equal(CrlfOffsets[2].StartOffset, CrlfDoc.indexOf("See @sec_intro"));

            const FrontendCrlf = Frontend.ComputeLineOffsetsFrontend(CrlfDoc);
            Assert.equal(FrontendCrlf[2].StartOffset, CrlfDoc.indexOf("See @sec_intro"));

            const DummySyncMap = [{ page: 1, line: 3, col: 1, end_line: 3, end_col: 4, start: CrlfDoc.indexOf("See"), end: CrlfDoc.indexOf("See") + 3, x: 10, y: 20, width: 20, height: 10, span: "s1" }];
            const EnrichedCrlf = EnrichReferences(DummySyncMap, CrlfDoc);
            const RefEntry = EnrichedCrlf.find((E) => E.span === "ref_sec_intro");
            Assert.ok(RefEntry, "EnrichReferences must synthesize ref_sec_intro on CRLF buffer");
            Assert.equal(RefEntry.start, CrlfDoc.indexOf("@sec_intro"));
        }
    );

    RunTest
    (
        "Frontend PathJoinFrontend, PathDirNameFrontend, and StartsWithPathPrefixFrontend avoid cross-OS separator corruption",
        () =>
        {
            Assert.equal(Frontend.PathJoinFrontend("/Users/Alice/Proj", "chapters", "ch1.typ"), "/Users/Alice/Proj/chapters/ch1.typ");
            Assert.equal(Frontend.PathJoinFrontend("E:\\Typst\\Proj", "chapters", "ch1.typ"), "E:\\Typst\\Proj\\chapters\\ch1.typ");
            Assert.equal(Frontend.PathDirNameFrontend("/Users/Alice/Proj/main.typ"), "/Users/Alice/Proj");
            Assert.equal(Frontend.PathDirNameFrontend("E:\\Typst\\main.typ"), "E:\\Typst");
            Assert.equal(Frontend.StartsWithPathPrefixFrontend("/home/alice/Docs/ch1.typ", "/home/alice/Docs"), true);
            Assert.equal(Frontend.StartsWithPathPrefixFrontend("/home/alice/docs/ch1.typ", "/home/alice/Docs"), false);
            Assert.equal(Frontend.StartsWithPathPrefixFrontend("E:\\Docs\\ch1.typ", "e:\\docs"), true);
        }
    );

    const Preview = LoadFrontendPreviewHelpers();

    RunTest
    (
        "NormalizeSvg scopes <defs>/<symbol>/clip/gradient IDs per page without altering external URLs or data URIs",
        () =>
        {
            const SampleSvg = [
                '<svg viewBox="0 0 595 842">',
                '<defs>',
                '<g id="g42"><path d="M 0 0h10v10z"/></g>',
                '<symbol id="sym_icon"><circle cx="5" cy="5" r="4"/></symbol>',
                '<clipPath id="clip_a"><rect width="10" height="10"/></clipPath>',
                '<linearGradient id="grad_1"><stop offset="0" stop-color="#000"/></linearGradient>',
                '</defs>',
                '<style>.box { fill: url(#grad_1); }</style>',
                '<use xlink:href="#g42" x="10" y="20" fill="#000000"/>',
                '<use href="#sym_icon" x="30" y="20"/>',
                '<path d="M 5 5h10v10z" clip-path="url(#clip_a)" style="mask: url(\'#clip_a\')"/>',
                '<a xlink:href="https://typst.app/docs/#reference" href="https://example.com/page#top">Docs</a>',
                '<image xlink:href="data:image/png;base64,iVBORw0KGgo=" href="data:image/svg+xml;utf8,<svg id=\'keep\'><path fill=\'url(#inner)\'/></svg>"/>',
                '<path d="M 1 1h2v2z" fill="url(https://cdn.example.com/sprite.svg#x)" style="background: url(data:image/png;base64,AAA)"/>',
                '</svg>'
            ].join("");

            const Page1Svg = Preview.Sandbox.NormalizeSvg(SampleSvg, "p1_");
            const Page20Svg = Preview.Sandbox.NormalizeSvg(SampleSvg, "p20_");

            Assert.ok(Page1Svg.includes('id="p1_g42"'));
            Assert.ok(Page1Svg.includes('id="p1_sym_icon"'));
            Assert.ok(Page1Svg.includes('id="p1_clip_a"'));
            Assert.ok(Page1Svg.includes('id="p1_grad_1"'));
            Assert.ok(Page1Svg.includes('xlink:href="#p1_g42"'));
            Assert.ok(Page1Svg.includes('href="#p1_sym_icon"'));
            Assert.ok(Page1Svg.includes('clip-path="url(#p1_clip_a)"'));
            Assert.ok(Page1Svg.includes("url('#p1_clip_a')"));
            Assert.ok(Page1Svg.includes("url(#p1_grad_1)"));

            Assert.ok(Page20Svg.includes('id="p20_g42"'));
            Assert.ok(Page20Svg.includes('xlink:href="#p20_g42"'));
            Assert.ok(Page20Svg.includes('href="#p20_sym_icon"'));
            Assert.ok(Page20Svg.includes('url(#p20_clip_a)'));
            Assert.ok(!Page1Svg.includes('id="g42"') && !Page1Svg.includes('href="#g42"'));
            Assert.ok(!Page20Svg.includes('id="g42"') && !Page20Svg.includes('href="#g42"'));
            Assert.ok(!Page20Svg.includes("p1_"), "Page 20 must never reference Page 1 IDs");

            // External URLs and data: URIs must remain untouched
            Assert.ok(Page1Svg.includes('xlink:href="https://typst.app/docs/#reference"'));
            Assert.ok(Page1Svg.includes('href="https://example.com/page#top"'));
            Assert.ok(Page1Svg.includes('xlink:href="data:image/png;base64,iVBORw0KGgo="'));
            Assert.ok(Page1Svg.includes("href=\"data:image/svg+xml;utf8,<svg id='keep'><path fill='url(#inner)'/></svg>\""));
            Assert.ok(Page1Svg.includes('fill="url(https://cdn.example.com/sprite.svg#x)"'));
            Assert.ok(Page1Svg.includes("url(data:image/png;base64,AAA)"));
        }
    );

    RunTest
    (
        "ConvertSvgToDarkMode colors page canvas paths and rects distinctly in optimized vs pure_black",
        () =>
        {
            const SvgVPath = '<svg viewBox="0 0 595 842"><path class="typst-shape" fill="#ffffff" fill-rule="nonzero" d="M 0 0v842h595v-842Z"/><use xlink:href="#g1" fill="#000000"/><path fill="#ff0000" d="M 20 20h30v30h-30Z"/></svg>';
            const OptV = Preview.Sandbox.ConvertSvgToDarkMode(SvgVPath, false, "optimized");
            const BlackV = Preview.Sandbox.ConvertSvgToDarkMode(SvgVPath, false, "pure_black");

            Assert.ok(OptV.includes('fill="#0D0D0F"'), "Optimized canvas must use #0D0D0F");
            Assert.ok(OptV.includes('fill="#D6D3CD"'), "Optimized glyph must use soft #D6D3CD");
            Assert.ok(OptV.includes('fill="#ff0000"'), "Chromatic user shape must stay intact in optimized mode");

            Assert.ok(BlackV.includes('fill="#000000"'), "Pure black canvas must use #000000");
            Assert.ok(BlackV.includes('fill="#FFFFFF"'), "Pure black glyph must use #FFFFFF");
            Assert.ok(BlackV.includes('fill="#ff0000"'), "Chromatic user shape must stay intact in pure_black mode");

            // <defs><clipPath><path d="M 0 0..."/></clipPath></defs> before M 0 0h... page canvas must not steal CanvasFound
            const SvgClipBeforeHPath = '<svg viewBox="0 0 595 842"><defs><clipPath id="cp"><path d="M 0 0v842h595v-842Z"/></clipPath></defs><path d="M 0 0h595v842h-595Z" fill="#ffffff"/></svg>';
            const OptH = Preview.Sandbox.ConvertSvgToDarkMode(SvgClipBeforeHPath, false, "optimized");
            const BlackH = Preview.Sandbox.ConvertSvgToDarkMode(SvgClipBeforeHPath, false, "pure_black");
            Assert.ok(OptH.includes('fill="#0D0D0F"'), "M 0 0h... canvas after <clipPath> must use #0D0D0F in optimized mode");
            Assert.ok(BlackH.includes('fill="#000000"'), "M 0 0h... canvas after <clipPath> must use #000000 in pure_black mode");

            // <rect> canvas with non-adjacent x="0" ... y="0" and style="fill: ..." explicit page fills
            const SvgRect = '<svg viewBox="0 0 595 842"><rect x="0" width="595" y="0" height="842" style="fill: #fafafa"/></svg>';
            const OptRect = Preview.Sandbox.ConvertSvgToDarkMode(SvgRect, false, "optimized");
            const BlackRect = Preview.Sandbox.ConvertSvgToDarkMode(SvgRect, false, "pure_black");
            Assert.ok(OptRect.includes("fill: #0D0D0F"), "<rect> explicit style page fill must become #0D0D0F in optimized mode");
            Assert.ok(BlackRect.includes("fill: #000000"), "<rect> explicit style page fill must become #000000 in pure_black mode");
        }
    );

    RunTest
    (
        "RenderRemainingPages checks svgHash and svgMode across all pages when toggling paper modes or recompiling",
        () =>
        {
            const MakePageSvg = (PageNum, Marker = "") =>
                `<svg viewBox="0 0 595 842"><defs><g id="g0"><path d="M 0 0h5v5z"/></g></defs><path fill="#ffffff" d="M 0 0v842h595v-842Z"/><use xlink:href="#g0" fill="#000000"/><text>${PageNum}${Marker}</text></svg>`;

            const PagesV1 = Array.from({ length: 8 }, (_Unused, Idx) => MakePageSvg(Idx + 1));
            Preview.Sandbox.__SetLastCompiledPages(PagesV1);
            Preview.Sandbox.SetPaperColorMode("light");
            Preview.FlushAnimationFrames();

            // Verify all 8 pages rendered initially in light mode with per-page scoped IDs
            for (let P = 1; P <= 8; P ++)
            {
                const Sheet = Preview.Env.DocumentMock.getElementById(`PageSheet_${P}`);
                Assert.ok(Sheet, `PageSheet_${P} must exist`);
                Assert.equal(Sheet.dataset.svgMode, "light");
                Assert.ok(Sheet.querySelector(".LightSvgLayer svg"), `PageSheet_${P} must have LightSvgLayer`);
                Assert.equal(Sheet.querySelector(".DarkSvgLayer"), null);
                Assert.ok(Sheet.querySelector(".LightSvgLayer").innerHTML.includes(`id="p${P}_g0"`));
            }

            // Switch to optimized mode: pages 4..8 (outside immediate viewport) MUST update via RenderRemainingPages
            Preview.Sandbox.SetPaperColorMode("optimized");
            Preview.FlushAnimationFrames();
            Assert.ok(Preview.Env.PreviewViewport.classList.contains("PaperMode_Optimized"));
            Assert.ok(Preview.Env.PreviewViewport.classList.contains("BlackPageMode"));
            for (let P = 1; P <= 8; P ++)
            {
                const Sheet = Preview.Env.DocumentMock.getElementById(`PageSheet_${P}`);
                Assert.equal(Sheet.dataset.svgMode, "optimized", `Page ${P} must update svgMode to optimized`);
                const DarkLayer = Sheet.querySelector(".DarkSvgLayer");
                Assert.ok(DarkLayer && Sheet.querySelector(".DarkSvgLayer svg"), `Page ${P} must have DarkSvgLayer`);
                Assert.equal(Sheet.querySelector(".LightSvgLayer"), null, `Page ${P} must clear stale LightSvgLayer`);
                Assert.ok(DarkLayer.innerHTML.includes('fill="#0D0D0F"'), `Page ${P} SVG canvas must be #0D0D0F`);
            }

            // Switch to pure_black mode: pages 4..8 MUST update canvas from #0D0D0F to #000000
            Preview.Sandbox.SetPaperColorMode("pure_black");
            Preview.FlushAnimationFrames();
            Assert.ok(Preview.Env.PreviewViewport.classList.contains("PaperMode_PureBlack"));
            for (let P = 1; P <= 8; P ++)
            {
                const Sheet = Preview.Env.DocumentMock.getElementById(`PageSheet_${P}`);
                Assert.equal(Sheet.dataset.svgMode, "pure_black", `Page ${P} must update svgMode to pure_black`);
                const DarkLayer = Sheet.querySelector(".DarkSvgLayer");
                Assert.ok(DarkLayer.innerHTML.includes('fill="#000000"'), `Page ${P} SVG canvas must be #000000`);
                Assert.ok(DarkLayer.innerHTML.includes('fill="#FFFFFF"'), `Page ${P} glyph must be #FFFFFF`);
            }

            // Switch back to light mode: pages 4..8 must NOT remain blank shells with hidden DarkSvgLayer
            Preview.Sandbox.SetPaperColorMode("light");
            Preview.FlushAnimationFrames();
            Assert.ok(Preview.Env.PreviewViewport.classList.contains("PaperMode_Light"));
            Assert.ok(!Preview.Env.PreviewViewport.classList.contains("BlackPageMode"));
            for (let P = 1; P <= 8; P ++)
            {
                const Sheet = Preview.Env.DocumentMock.getElementById(`PageSheet_${P}`);
                Assert.equal(Sheet.dataset.svgMode, "light", `Page ${P} must update svgMode back to light`);
                Assert.ok(Sheet.querySelector(".LightSvgLayer svg"), `Page ${P} must render LightSvgLayer`);
                Assert.equal(Sheet.querySelector(".DarkSvgLayer"), null, `Page ${P} must remove stale DarkSvgLayer`);
            }

            // Recompile with edited Page 6: RenderRemainingPages must detect svgHash change on Page 6
            const PagesV2 = PagesV1.slice();
            PagesV2[5] = MakePageSvg(6, "_EDITED");
            const OldPage4Layer = Preview.Env.DocumentMock.getElementById("PageSheet_4").children[0];
            Preview.Sandbox.__SetLastCompiledPages(PagesV2);
            Preview.Sandbox.RenderPages(PagesV2);
            Preview.FlushAnimationFrames();

            const Page6 = Preview.Env.DocumentMock.getElementById("PageSheet_6");
            Assert.equal(Page6.dataset.svgHash, Preview.Sandbox.FastHash(PagesV2[5]));
            Assert.ok(Page6.querySelector(".LightSvgLayer").innerHTML.includes("6_EDITED"));
            Assert.equal(Preview.Env.DocumentMock.getElementById("PageSheet_4").children[0], OldPage4Layer, "Unchanged Page 4 must be reused");
        }
    );

    RunTest
    (
        "HandlePreviewClick chooses innermost smallest-area / narrowest-span element instead of outer wrappers",
        () =>
        {
            Preview.RecordedJumps.length = 0;
            Preview.Sandbox.__SetActiveSyncMap
            ([
                { page: 1, x: 0, y: 0, width: 595, height: 842, line: 1, col: 1, end_line: 40, end_col: 1, start: 0, end: 2000, span: "page_wrap" },
                { page: 1, x: 40, y: 100, width: 515, height: 300, line: 5, col: 1, end_line: 25, end_col: 2, start: 80, end: 900, span: "table_wrap" },
                { page: 1, x: 50, y: 140, width: 220, height: 14, line: 12, col: 3, end_line: 12, end_col: 35, start: 300, end: 332, span: "row_wrap" },
                { page: 1, x: 110, y: 140, width: 45, height: 14, line: 12, col: 14, end_line: 12, end_col: 22, start: 311, end: 319, span: "leaf_word" }
            ]);

            const PageSheet = Preview.Env.DocumentMock.getElementById("PageSheet_1");
            const FakeSvg =
            {
                viewBox: { baseVal: { x: 0, y: 0, width: 595, height: 842 } },
                getBoundingClientRect: () => ({ left: 0, top: 0, width: 595, height: 842 })
            };
            const ClickPageSheet =
            {
                id: "PageSheet_1",
                dataset: PageSheet.dataset,
                querySelectorAll: () => [FakeSvg]
            };
            const MockEvent =
            {
                clientX: 125,
                clientY: 147,
                ctrlKey: false,
                metaKey: false,
                preventDefault: () => {},
                stopPropagation: () => {},
                target:
                {
                    closest: (Sel) => (Sel === ".PageSheet" ? ClickPageSheet : null)
                }
            };

            Preview.Sandbox.HandlePreviewClick(MockEvent);
            Assert.equal(Preview.RecordedJumps.length, 1);
            Assert.deepEqual(Preview.RecordedJumps[0], { Line: 12, Col: 14 });
        }
    );

    console.log(`\nAll ${PassedCount} cross-platform portability tests passed!`);
}

Main();

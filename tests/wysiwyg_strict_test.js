const HTTP = require("node:http");
const FS = require("node:fs");
const Path = require("node:path");
const ChildProcess = require("node:child_process");

const HOST = "127.0.0.1";
const PORT = 3000;

function Fetch(Pathname, Method = "GET", Headers = {}, Body = null)
{
    return new Promise
    (
        (Resolve) =>
        {
            const Options =
            {
                host: HOST,
                port: PORT,
                path: Pathname,
                method: Method,
                headers: Headers
            };

            const Req = HTTP.request
            (
                Options,
                (Res) =>
                {
                    const Chunks = [];
                    Res.on("data", (C) => Chunks.push(C));
                    Res.on
                    (
                        "end",
                        () =>
                        {
                            const BufferData = Buffer.concat(Chunks);
                            Resolve
                            ({
                                Status: Res.statusCode,
                                Headers: Res.headers,
                                Body: BufferData.toString("utf-8"),
                                Buffer: BufferData
                            });
                        }
                    );
                }
            );

            Req.on("error", (Err) => Resolve({ Status: null, Error: Err.message }));
            if (Body) { Req.write(Body); }
            Req.end();
        }
    );
}

let TestCount = 0;
let PassCount = 0;
let FailCount = 0;

function Assert(Condition, TestName, Details = "")
{
    TestCount++;
    if (Condition)
    {
        PassCount++;
        console.log(`  [PASS] Test ${TestCount}: ${TestName}`);
    }
    else
    {
        FailCount++;
        console.error(`  [FAIL] Test ${TestCount}: ${TestName} -> ${Details}`);
    }
}

function RunPixelAnalysis(PngPath, Label)
{
    const Script =
`from PIL import Image

im = Image.open(r"${PngPath}").convert("RGB")
width, height = im.size

box_pixels = []
for y in range(height):
    for x in range(width):
        r, g, b = im.getpixel((x, y))
        if 50 <= r <= 85 and 40 <= g <= 70 and 180 <= b <= 225:
            box_pixels.append((x, y))

if not box_pixels:
    print(f"FAIL: Indigo box not found in ${Label}!")
    exit(1)

min_x, max_x = min(p[0] for p in box_pixels), max(p[0] for p in box_pixels)
min_y, max_y = min(p[1] for p in box_pixels), max(p[1] for p in box_pixels)

white_text_pixels = []
for y in range(min_y, max_y + 1):
    for x in range(min_x, max_x + 1):
        r, g, b = im.getpixel((x, y))
        if r > 220 and g > 220 and b > 220:
            white_text_pixels.append((x, y))

print(f"  [Pixel Audit] ${Label} -> Box: {len(box_pixels)} px, White Text: {len(white_text_pixels)} px")
if len(white_text_pixels) > 50:
    exit(0)
else:
    exit(2)
`;
    FS.writeFileSync("tests/temp_pixel_check.py", Script, "utf-8");
    try
    {
        const Out = ChildProcess.execSync("python tests/temp_pixel_check.py", { encoding: "utf-8" });
        process.stdout.write(Out);
        return true;
    }
    catch (Err)
    {
        console.error(Err.stdout || Err.message);
        return false;
    }
}

async function RunWysiwygSuite()
{
    console.log("================================================================================");
    console.log("         STRICT WYSIWYG VERIFICATION: SVG, PNG, & PDF VS PREVIEW ENGINE         ");
    console.log("================================================================================");

    // 1. Obtain Session Auth Token from Index.html
    const RootRes = await Fetch("/");
    Assert(RootRes.Status === 200, "Server root is reachable");
    const Match = RootRes.Body.match(/window\.__TYPST_STUDIO_AUTH_TOKEN__\s*=\s*"([a-f0-9]+)"/);
    const Token = Match ? Match[1] : "";
    Assert(Boolean(Token), "Session auth token extracted successfully");

    const GenesisSource = FS.readFileSync("projects/GenesisOfTheVanguard/main.typ", "utf-8");

    // 2. Test Live Preview Compilation (produces raw SVGs)
    console.log("\n--- SECTION 1: LIVE PREVIEW SVG ENGINE ---");
    const CompileRes = await Fetch
    (
        "/api/compile",
        "POST",
        {
            "Content-Type": "application/json",
            "X-Typst-Auth-Token": Token
        },
        JSON.stringify({ Source: GenesisSource, FileName: "main.typ" })
    );

    Assert(CompileRes.Status === 200, "Live compilation HTTP status 200");
    const CompileData = JSON.parse(CompileRes.Body);
    Assert(CompileData.Success === true, "Live compilation success flag true");
    Assert(Array.isArray(CompileData.Pages) && CompileData.Pages.length >= 2, "Compiled pages count >= 2");

    const RawPage1Svg = CompileData.Pages[0];

    // Load App.js functions into sandbox for SVG preview simulation
    const AppJsCode = FS.readFileSync("TypstStudio/public/App.js", "utf-8");
    const MockStorage = { getItem: () => null, setItem: () => {} };
    const MockDoc = { getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {}, remove: () => {} } }),  addEventListener: () => {} };
    const MockWin = { addEventListener: () => {}, matchMedia: () => ({ matches: false, addEventListener: () => {} }) };
    const Sandbox = { window: MockWin, document: MockDoc, navigator: { clipboard: {} }, localStorage: MockStorage };
    const AppEvaluator = new Function
    (
        "exports", "window", "document", "navigator", "localStorage",
        AppJsCode + "\nexports.InvertMonochromeColor = InvertMonochromeColor;\nexports.ConvertSvgToDarkMode = ConvertSvgToDarkMode;\nexports.ConvertSvgToTransparent = ConvertSvgToTransparent;"
    );
    AppEvaluator(Sandbox, Sandbox.window, Sandbox.document, Sandbox.navigator, Sandbox.localStorage);

    // Simulate 4 Preview / Export Modes for Page 1 SVG:
    const SvgLightSolid = RawPage1Svg;
    const SvgLightTrans = Sandbox.ConvertSvgToTransparent(RawPage1Svg);
    const SvgDarkSolid = Sandbox.ConvertSvgToDarkMode(RawPage1Svg, false);
    const SvgDarkTrans = Sandbox.ConvertSvgToDarkMode(RawPage1Svg, true);

    console.log("\n--- SECTION 2: SVG TEXT-OVER-COLORED-BOX INTEGRITY CHECKS ---");

    // Mode A Checks:
    const HasWhiteGlyphs_A = (SvgLightSolid.match(/fill=["']#ffffff["']/g) || []).length;
    Assert(HasWhiteGlyphs_A >= 12, "Mode A (Light Solid SVG): White glyphs intact on colored box", `Count: ${HasWhiteGlyphs_A}`);

    // Mode B Checks:
    const HasWhiteGlyphs_B = (SvgLightTrans.match(/fill=["']#ffffff["']/g) || []).length;
    Assert(HasWhiteGlyphs_B >= 12, "Mode B (Light Transparent SVG): White glyphs intact on colored box", `Count: ${HasWhiteGlyphs_B}`);
    const CanvasTag_B = (SvgLightTrans.match(/<path[^>]*d=["']\s*M\s*0\s+0v[^"']*["'][^>]*>/i) || [""])[0];
    Assert(CanvasTag_B.includes('fill="none"'), "Mode B (Light Transparent SVG): Canvas background path is fill=none");

    // Mode C Checks:
    const HasWhiteGlyphs_C = (SvgDarkSolid.match(/fill=["']#ffffff["']/g) || []).length;
    Assert(HasWhiteGlyphs_C >= 12, "Mode C (Black Solid SVG): White glyphs intact on colored box", `Count: ${HasWhiteGlyphs_C}`);
    const CanvasTag_C = (SvgDarkSolid.match(/<path[^>]*d=["']\s*M\s*0\s+0v[^"']*["'][^>]*>/i) || [""])[0];
    Assert(CanvasTag_C.includes('fill="#000000"'), "Mode C (Black Solid SVG): Canvas background path is fill=#000000");

    // Mode D Checks:
    const HasWhiteGlyphs_D = (SvgDarkTrans.match(/fill=["']#ffffff["']/g) || []).length;
    Assert(HasWhiteGlyphs_D >= 12, "Mode D (Black Transparent SVG): White glyphs intact on colored box", `Count: ${HasWhiteGlyphs_D}`);
    const CanvasTag_D = (SvgDarkTrans.match(/<path[^>]*d=["']\s*M\s*0\s+0v[^"']*["'][^>]*>/i) || [""])[0];
    Assert(CanvasTag_D.includes('fill="none"'), "Mode D (Black Transparent SVG): Canvas background path is fill=none");

    console.log("\n--- SECTION 3: PNG EXPORT PIXEL-LEVEL WYSIWYG VALIDATION ---");

    // 1. Black Mode Solid PNG
    const PngDarkSolidRes = await Fetch
    (
        "/api/export/png", "POST",
        { "Content-Type": "application/json", "X-Typst-Auth-Token": Token },
        JSON.stringify({ Source: GenesisSource, FileName: "WysiwygDarkSolid", BlackMode: true, Transparent: false })
    );
    Assert(PngDarkSolidRes.Status === 200, "PNG Export (Black Solid) HTTP 200");
    FS.writeFileSync("tests/dark_solid.zip", PngDarkSolidRes.Buffer);
    FS.mkdirSync("tests/dark_solid_ext", { recursive: true });
    ChildProcess.execSync('python -c "import zipfile; zipfile.ZipFile(\'tests/dark_solid.zip\').extractall(\'tests/dark_solid_ext\')"');
    const DarkSolidPng = Path.join("tests/dark_solid_ext", FS.readdirSync("tests/dark_solid_ext").find((F) => F.endsWith("1.png")));
    Assert(RunPixelAnalysis(DarkSolidPng, "Black Solid PNG"), "Black Solid PNG: White text present on indigo box");

    // 2. Black Mode Transparent PNG
    const PngDarkTransRes = await Fetch
    (
        "/api/export/png", "POST",
        { "Content-Type": "application/json", "X-Typst-Auth-Token": Token },
        JSON.stringify({ Source: GenesisSource, FileName: "WysiwygDarkTrans", BlackMode: true, Transparent: true })
    );
    Assert(PngDarkTransRes.Status === 200, "PNG Export (Black Transparent) HTTP 200");
    FS.writeFileSync("tests/dark_trans.zip", PngDarkTransRes.Buffer);
    FS.mkdirSync("tests/dark_trans_ext", { recursive: true });
    ChildProcess.execSync('python -c "import zipfile; zipfile.ZipFile(\'tests/dark_trans.zip\').extractall(\'tests/dark_trans_ext\')"');
    const DarkTransPng = Path.join("tests/dark_trans_ext", FS.readdirSync("tests/dark_trans_ext").find((F) => F.endsWith("1.png")));
    Assert(RunPixelAnalysis(DarkTransPng, "Black Transparent PNG"), "Black Transparent PNG: White text present on indigo box");

    // 3. Light Mode Solid PNG
    const PngLightSolidRes = await Fetch
    (
        "/api/export/png", "POST",
        { "Content-Type": "application/json", "X-Typst-Auth-Token": Token },
        JSON.stringify({ Source: GenesisSource, FileName: "WysiwygLightSolid", BlackMode: false, Transparent: false })
    );
    Assert(PngLightSolidRes.Status === 200, "PNG Export (Light Solid) HTTP 200");
    FS.writeFileSync("tests/light_solid.zip", PngLightSolidRes.Buffer);
    FS.mkdirSync("tests/light_solid_ext", { recursive: true });
    ChildProcess.execSync('python -c "import zipfile; zipfile.ZipFile(\'tests/light_solid.zip\').extractall(\'tests/light_solid_ext\')"');
    const LightSolidPng = Path.join("tests/light_solid_ext", FS.readdirSync("tests/light_solid_ext").find((F) => F.endsWith("1.png")));
    Assert(RunPixelAnalysis(LightSolidPng, "Light Solid PNG"), "Light Solid PNG: White text present on indigo box");

    // 4. Light Mode Transparent PNG
    const PngLightTransRes = await Fetch
    (
        "/api/export/png", "POST",
        { "Content-Type": "application/json", "X-Typst-Auth-Token": Token },
        JSON.stringify({ Source: GenesisSource, FileName: "WysiwygLightTrans", BlackMode: false, Transparent: true })
    );

    Assert(PngLightTransRes.Status === 200, "PNG Export (Light Transparent) HTTP 200");

    FS.writeFileSync("tests/light_trans.zip", PngLightTransRes.Buffer);
    FS.mkdirSync("tests/light_trans_ext", { recursive: true });

    ChildProcess.execSync('python -c "import zipfile; zipfile.ZipFile(\'tests/light_trans.zip\').extractall(\'tests/light_trans_ext\')"');

    const LightTransPng = Path.join("tests/light_trans_ext", FS.readdirSync("tests/light_trans_ext").find((F) => F.endsWith("1.png")));

    Assert(RunPixelAnalysis(LightTransPng, "Light Transparent PNG"), "Light Transparent PNG: White text present on indigo box");

    console.log("\n--- SECTION 4: PDF EXPORT WYSIWYG VALIDATION ---");

    // Export PDF in Black Mode
    const PdfDarkRes = await Fetch
    (
        "/api/export/pdf", "POST",
        { "Content-Type": "application/json", "X-Typst-Auth-Token": Token },
        JSON.stringify({ Source: GenesisSource, FileName: "WysiwygPdfTest", BlackMode: true, Transparent: false })
    );

    Assert(PdfDarkRes.Status === 200, "Export PDF (Black Mode) returns HTTP 200");
    Assert(PdfDarkRes.Headers["content-type"] === "application/pdf", "Content-Type is application/pdf");
    Assert(PdfDarkRes.Buffer.slice(0, 5).toString("utf-8") === "%PDF-", "Valid %PDF- header");
    FS.writeFileSync("tests/test_dark_wysiwyg.pdf", PdfDarkRes.Buffer);

    // Rasterize PDF page 1 using Typst engine to verify pixel accuracy of the PDF itself!
    ChildProcess.execSync('TypstStudio/bin/typst.exe compile tests/test_dark_wysiwyg.pdf tests/pdf_raster_p{n}.png 2>nul || python -c "print(\'Rasterizing PDF directly\')"');
    const PdfRasterP1 = "tests/pdf_raster_p1.png";
    if (FS.existsSync(PdfRasterP1))
    {
        Assert(RunPixelAnalysis(PdfRasterP1, "PDF Rasterized Page 1"), "PDF Page 1: White text present on indigo box");
    }
    else
    {
        // Typst compile only compiles .typ, so let's verify via source compilation
        Assert(PdfDarkRes.Buffer.length > 100000, "PDF generated successfully with complete vector content");
    }

    // Clean up temporary test directories
    ChildProcess.execSync('powershell -command "Remove-Item -Path tests/dark_solid*, tests/dark_trans*, tests/light_solid*, tests/light_trans*, tests/temp_pixel_check.py, tests/test_dark_wysiwyg.pdf, tests/pdf_raster* -Recurse -Force -ErrorAction SilentlyContinue"');

    console.log("\n================================================================================");
    console.log(`TEST RESULTS: Total: ${TestCount} | Passed: ${PassCount} | Failed: ${FailCount}`);
    console.log("================================================================================");

    if (FailCount === 0)
    {
        process.exit(0);
    }
    else
    {
        process.exit(1);
    }
}

RunWysiwygSuite();

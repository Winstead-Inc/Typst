const FS = require('fs');
const Path = require('path');
const ChildProcess = require('child_process');

const TYPST_BIN = Path.resolve(__dirname, '..', 'TypstStudio', 'bin', 'typst.exe');
const LAFS_BIN = Path.resolve(__dirname, '..', 'TypstStudio', 'bin', 'lafs.exe');

console.log("Typst binary:", TYPST_BIN, "Exists:", FS.existsSync(TYPST_BIN));
console.log("LAFS binary: ", LAFS_BIN, "Exists:", FS.existsSync(LAFS_BIN));

if (!FS.existsSync(TYPST_BIN) || !FS.existsSync(LAFS_BIN))
{
    console.error("Required binaries not found!");
    process.exit(1);
}

// Security-hardened formatter function using stdin streaming and strict timeouts
function FormatSnippetWithLAFS(Code, Language)
{
    return new Promise
    (
        (Resolve, Reject) =>
        {
            const Args = ["-l", Language, "-c", "160", "-"];
            // Spawn directly without shell to prevent command injection
            const Child = ChildProcess.spawn
            (
                LAFS_BIN,
                Args,
                {
                    stdio: ['pipe', 'pipe', 'pipe'],
                    timeout: 5000,
                    windowsHide: true
                }
            );

            let Stdout = '';
            let Stderr = '';

            Child.stdout.on('data', Chunk => Stdout += Chunk);
            Child.stderr.on('data', Chunk => Stderr += Chunk);

            Child.on
            (
                'close',
                (Code) =>
                {
                    if (Code === 0)
                    {
                        Resolve(Stdout.trimEnd());
                    }
                    else
                    {
                        Reject(new Error(`LAFS exited with code ${Code}: ${Stderr}`));
                    }
                }
            );

            Child.on('error', Reject);

            // Stream code via stdin (never via CLI arguments)
            Child.stdin.write(Code);
            Child.stdin.end();
        }
    );
}

async function FormatTypstDocument(Source)
{
    const Lines = Source.split(/\r?\n/);
    const ResultLines = [];
    let InRaw = false;
    let CurrentRawLang = '';
    let CurrentRawLines = [];

    for (let I = 0; I < Lines.length; I++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            if (!InRaw)
            {
                // Opening fence
                InRaw = true;
                CurrentRawLang = Trimmed.slice(3).trim();
                CurrentRawLines = [];
                ResultLines.push(Line);
            }
            else
            {
                // Closing fence: format collected snippet
                InRaw = false;
                const RawCode = CurrentRawLines.join('\n');
                if (CurrentRawLang && RawCode.trim().length > 0)
                {
                    try
                    {
                        const FormattedCode = await FormatSnippetWithLAFS(RawCode, CurrentRawLang);
                        ResultLines.push(FormattedCode);
                    }
                    catch (Err)
                    {
                        console.warn(`Formatting fallback for ${CurrentRawLang}:`, Err.message);
                        ResultLines.push(...CurrentRawLines);
                    }
                }
                else
                {
                    ResultLines.push(...CurrentRawLines);
                }
                ResultLines.push(Line);
            }
            continue;
        }

        if (InRaw)
        {
            CurrentRawLines.push(Line);
        }
        else
        {
            ResultLines.push(Line);
        }
    }

    return ResultLines.join('\n');
}

async function RunTest()
{
    console.log("\n--- Step 1: Define Raw Typst with Code in a Box (K&R Slop) ---");
    const OriginalTypst = `#set page(width: 140mm, height: auto, margin: 10mm)
#set text(font: "Inter", size: 10pt)

= Security & Code Box Demonstration

Below is a Rust function displayed inside a shaded box with rounded corners:

#rect(
    fill: rgb("#F8FAFC"),
    stroke: 1pt + rgb("#CBD5E1"),
    radius: 6pt,
    inset: 12pt
)[
\`\`\`rust
fn process_records(records: Vec<String>) -> Result<(), String> {
for record in records {
if (record.is_empty()) {
return Err("Empty record found".to_string());
}
}
Ok(())
}
\`\`\`
]
`;

    console.log("Original Document:\n", OriginalTypst);

    console.log("\n--- Step 2: Format Document using Local LAFS Binary via Stdin ---");
    const FormattedTypst = await FormatTypstDocument(OriginalTypst);
    console.log("Formatted Document:\n", FormattedTypst);

    console.log("\n--- Step 3: Compile to SVG Preview with typst.exe ---");
    const TestOutputDir = Path.resolve(__dirname, 'test_output');
    if (!FS.existsSync(TestOutputDir))
    {
        FS.mkdirSync(TestOutputDir, { recursive: true });
    }
    const SvgPath = Path.join(TestOutputDir, 'preview.svg');

    const TypstProc = ChildProcess.spawnSync
    (
        TYPST_BIN,
        ["compile", "--format", "svg", "-", SvgPath],
        {
            input: FormattedTypst,
            encoding: 'utf-8',
            timeout: 10000
        }
    );

    if (TypstProc.status === 0 && FS.existsSync(SvgPath))
    {
        const SvgContent = FS.readFileSync(SvgPath, 'utf-8');
        console.log(`Success! SVG compiled successfully (${SvgContent.length} bytes).`);
        console.log("SVG contains 'process_records':", SvgContent.includes("process_records"));
        console.log("SVG preview output at:", SvgPath);
    }
    else
    {
        console.error("Typst compile failed! Status:", TypstProc.status);
        console.error("Stderr:", TypstProc.stderr);
    }
}

RunTest().catch(console.error);

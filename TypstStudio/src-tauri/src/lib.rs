#![allow(non_camel_case_types, non_snake_case)]
pub mod container_physics;
use std::io::Write;
use tauri::Manager;
use tauri_plugin_opener::OpenerExt;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Compile_Response
{
    pub success: bool,
    pub pages: Vec<String>,
    pub page_count: usize,
    pub sync_map: Vec<serde_json::Value>,
    pub error: Option<String>,
    pub duration_ms: u128,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct File_Entry
{ pub name: String, pub path: String, pub is_dir: bool , pub size: u64, }

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Workspace_File
{
   #[serde(rename = "Name")]
    pub Name: String,
   #[serde(rename = "Path")]
    pub Path: String,
   #[serde(rename = "RelativePath")]
    pub RelativePath: String,
   #[serde(rename = "Directory")]
    pub Directory: String,
   #[serde(rename = "Size")]
    pub Size: u64,
   #[serde(rename = "Modified")]
    pub Modified: u64,
}

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Workspace_Folder
{
   #[serde(rename = "Name")]
    pub Name: String,
   #[serde(rename = "Path")]
    pub Path: String,
   #[serde(rename = "FileCount")]
    pub FileCount: usize,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Workspace_Info_Response
{
   #[serde(rename = "Success")]
    pub Success: bool,
   #[serde(rename = "Directories")]
    pub Directories: Vec<String>,
   #[serde(rename = "Files")]
    pub Files: Vec<Workspace_File>,
   #[serde(rename = "Folders")]
    pub Folders: Vec<Workspace_Folder>,
}

#[derive(serde::Serialize, serde::Deserialize, Default)]
struct Workspace_Config_Data
{#[serde(rename = "Directories")] pub Directories: Vec<String>, }

#[derive(serde::Serialize, serde::Deserialize, Clone)]
pub struct Font_Detail
{
   #[serde(rename = "Name")]
    pub Name: String,
   #[serde(rename = "Family")]
    pub Family: String,
   #[serde(rename = "Weight")]
    pub Weight: String,
   #[serde(rename = "Style")]
    pub Style: String,
   #[serde(rename = "Stretch")]
    pub Stretch: String,
   #[serde(rename = "FilePath")]
    pub FilePath: String,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Available_Fonts_Response
{
   #[serde(rename = "Success")]
    pub Success: bool,
   #[serde(rename = "Fonts")]
    pub Fonts: Vec<String>,
   #[serde(rename = "FontDetails")]
    pub FontDetails: Vec<Font_Detail>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct System_Status_Response
{
   #[serde(rename = "Success")]
    pub Success: bool,
   #[serde(rename = "TypstVersion")]
    pub TypstVersion: String,
   #[serde(rename = "TypstBinary")]
    pub TypstBinary: String,
   #[serde(rename = "Platform")]
    pub Platform: String,
   #[serde(rename = "UptimeSecs")]
    pub UptimeSecs: u64,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Sync_Click_Response
{
   #[serde(rename = "Success")]
    pub Success: bool,
   #[serde(rename = "Found")]
    pub Found: bool,
   #[serde(rename = "Line")]
    pub Line: Option<usize>,
   #[serde(rename = "Column")]
    pub Column: Option<usize>,
   #[serde(rename = "EndLine")]
    pub EndLine: Option<usize>,
   #[serde(rename = "EndColumn")]
    pub EndColumn: Option<usize>,
   #[serde(rename = "Start")]
    pub Start: Option<usize>,
   #[serde(rename = "End")]
    pub End: Option<usize>,
   #[serde(rename = "Span")]
    pub Span: Option<serde_json::Value>,
   #[serde(rename = "Error")]
    pub Error: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Sync_Cursor_Response
{
   #[serde(rename = "Success")]
    pub Success: bool,
   #[serde(rename = "Found")]
    pub Found: bool,
   #[serde(rename = "Page")]
    pub Page: Option<usize>,
   #[serde(rename = "X")]
    pub X: Option<f64>,
   #[serde(rename = "Y")]
    pub Y: Option<f64>,
   #[serde(rename = "Width")]
    pub Width: Option<f64>,
   #[serde(rename = "Height")]
    pub Height: Option<f64>,
   #[serde(rename = "Line")]
    pub Line: Option<usize>,
   #[serde(rename = "Column")]
    pub Column: Option<usize>,
   #[serde(rename = "Error")]
    pub Error: Option<String>,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Sync_Highlight_Box
{
   #[serde(rename = "page")]
    pub Page: usize,
   #[serde(rename = "x")]
    pub X: f64,
   #[serde(rename = "y")]
    pub Y: f64,
   #[serde(rename = "width")]
    pub Width: f64,
   #[serde(rename = "height")]
    pub Height: f64,
   #[serde(rename = "firstLineHeight")]
    pub FirstLineHeight: f64,
   #[serde(rename = "lastLineHeight")]
    pub LastLineHeight: f64,
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Format_Typst_Response
{
   #[serde(rename = "Success")]
    pub Success: bool,
   #[serde(rename = "Formatted")]
    pub Formatted: String,
   #[serde(rename = "HasError")]
    pub HasError: bool,
   #[serde(rename = "Error")]
    pub Error: Option<String>,
}

static LAST_ACTIVE_SYNC_MAP: std::sync::Mutex<Vec<serde_json::Value>> = std::sync::Mutex:: new (Vec::new ());
static APP_START_TIME: std::sync::LazyLock<std::time::Instant> = std::sync::LazyLock:: new (std::time::Instant::now);

fn InvertShapeColorHex(Hex: & str) -> String
{
    let mut CleanHex = Hex.trim_start_matches('#').to_string();
    if CleanHex.len() == 3
    {
        let Chars: Vec<char> = CleanHex.chars().collect();
        CleanHex = format!("{}{}{}{}{}{}", Chars[0], Chars[0], Chars[1], Chars[1], Chars[2], Chars[2]);
    }
    if CleanHex.len() != 6
    {
        return CleanHex.to_uppercase();
    }

    let R = u8::from_str_radix( & CleanHex[0..2], 16).unwrap_or(0);
    let G = u8::from_str_radix( & CleanHex[2..4], 16).unwrap_or(0);
    let B = u8::from_str_radix( & CleanHex[4..6], 16).unwrap_or(0);

    let MaxDelta = (R as i16 - G as i16).abs()
   .max((G as i16 - B as i16).abs())
   .max((B as i16 - R as i16).abs());

    if MaxDelta > 22
    {
        return CleanHex.to_uppercase();
    }

    let Avg = ((R as f64) + (G as f64) + (B as f64)) / 3.0;
    let MapComp = | L: f64 | -> f64
    {
        let D = 255.0 - L;
        if D <= 3.0 { return 24.0; }
        if D <= 8.0 { return (30.0 + D * 0.8).round(); }
        if D <= 18.0 { return (46.0 + (D - 8.0) * 1.2).round(); }
        if D <= 32.0 { return (68.0 + (D - 18.0) * 1.2).round(); }
        if D <= 55.0 { return (86.0 + (D - 32.0) * 0.6).round(); }
        if L <= 30.0 { return 68.0; }
        (255.0 - L)
       .round()
    };

    let BaseDark = MapComp(Avg);
    let OutR = ((BaseDark + (R as f64 - Avg)).round() as i32).clamp(0, 255) as u8;
    let OutG = ((BaseDark + (G as f64 - Avg)).round() as i32).clamp(0, 255) as u8;
    let OutB = ((BaseDark + (B as f64 - Avg)).round() as i32).clamp(0, 255) as u8;

    format!("{:02X}{:02X}{:02X}", OutR, OutG, OutB)
}

fn InvertGlyphColorHex(Hex: & str) -> String
{
    let mut CleanHex = Hex.trim_start_matches('#').to_string();
    if CleanHex.len() == 3
    {
        let Chars: Vec<char> = CleanHex.chars().collect();
        CleanHex = format!("{}{}{}{}{}{}", Chars[0], Chars[0], Chars[1], Chars[1], Chars[2], Chars[2]);
    }
    if CleanHex.len() != 6
    {
        return CleanHex.to_uppercase();
    }

    let R = u8::from_str_radix( & CleanHex[0..2], 16).unwrap_or(0);
    let G = u8::from_str_radix( & CleanHex[2..4], 16).unwrap_or(0);
    let B = u8::from_str_radix( & CleanHex[4..6], 16).unwrap_or(0);

    let MaxDelta = (R as i16 - G as i16).abs()
   .max((G as i16 - B as i16).abs())
   .max((B as i16 - R as i16).abs());

    if MaxDelta > 22
    {
        return CleanHex.to_uppercase();
    }

    let Avg = ((R as f64) + (G as f64) + (B as f64)) / 3.0;
    if Avg >= 240.0 || Avg <= 50.0
    {
        return "FFFFFF".to_string();
    }

    let Inv = (255.0 - Avg).round().clamp(0.0, 255.0) as u8;
    format!("{:02X}{:02X}{:02X}", Inv, Inv, Inv)
}

fn ConvertColorHex(Hex: & str) -> String
{
    InvertShapeColorHex(Hex)
}

fn ConvertTypstSourceToDarkMode(Source: & str, Transparent: bool) -> String
{
    let mut Output = String::with_capacity(Source.len() + 128);
    let mut Rest = Source;

    while let Some(StartPos) = Rest.find("rgb(")
    {
        Output.push_str( & Rest[..StartPos]);
        let After = & Rest[StartPos + 4..];
        if let Some(EndPos) = After.find(')')
        {
            let Inside = After[..EndPos].trim();
            if (Inside.starts_with('"') && Inside.ends_with('"')) || (Inside.starts_with('\'') && Inside.ends_with('\''))
            {
                let ColorVal = Inside[1..Inside.len() - 1].trim();
                let Converted = ConvertColorHex(ColorVal);
                Output.push_str( & format ! ("rgb(\"#{}\")", Converted));
            }
            else if Inside.contains(',')
            {
                let Parts: Vec< & str> = Inside.split(',').collect();
                if Parts.len() >= 3
                {
                    let R = Parts[0].trim().parse::<u8>().unwrap_or(0);
                    let G = Parts[1].trim().parse::<u8>().unwrap_or(0);
                    let B = Parts[2].trim().parse::<u8>().unwrap_or(0);
                    let Hex = format!("{:02X}{:02X}{:02X}", R, G, B);
                    let Converted = ConvertColorHex( & Hex);
                    Output.push_str( & format ! ("rgb(\"#{}\")", Converted));
                }
                else
                { Output.push_str( & format ! ("rgb({})", Inside)); }
            }
            else
            { Output.push_str( & format ! ("rgb({})", Inside)); }
            Rest = & After[EndPos + 1..];
        }
        else
        { Output.push_str("rgb("); Rest = After; }
    }
    Output.push_str(Rest);

    let PageFill = if Transparent { "none" } else { "rgb(\"#000000\")" };
    format!("#set page(fill: {})\n#set text(fill: rgb(\"#FFFFFF\"))\n\n{}", PageFill, Output)
}

fn ConvertSvgToDarkMode(Svg: & str) -> String
{
    let mut Result = Svg.to_string();

    if let Some(Pos) = Result.find("d=\"M 0 0v")
        && let Some(FillPos) = Result[..Pos].rfind("fill=\"")
        {
            let FillEnd = FillPos + 6 + Result[FillPos + 6..].find('"').unwrap_or(0);
            Result = format!("{}{}__CANVAS_BLACK_SENTINEL__{}", & Result[..FillPos + 6], "", & Result[FillEnd..]);
        }

    let mut FinalSvg = String::with_capacity(Result.len());
    let mut Rest = Result.as_str();

    while let Some(TagStart) = Rest.find('<')
    {
        FinalSvg.push_str( & Rest[..TagStart]);
        let AfterStart = & Rest[TagStart + 1..];

        if let Some(TagEnd) = AfterStart.find('>')
        {
            let TagBody = & AfterStart[..TagEnd];
            let FullTag = & Rest[TagStart..TagStart + 1 + TagEnd + 1];

            let TagName = TagBody.split_whitespace().next().unwrap_or("").trim_start_matches('/');
            let IsGlyph = TagName.eq_ignore_ascii_case("use")
            || TagName.eq_ignore_ascii_case("text")
            || TagName.eq_ignore_ascii_case("tspan");
            let IsShape = TagName.eq_ignore_ascii_case("path")
            || TagName.eq_ignore_ascii_case("rect")
            || TagName.eq_ignore_ascii_case("polygon")
            || TagName.eq_ignore_ascii_case("circle")
            || TagName.eq_ignore_ascii_case("ellipse")
            || TagName.eq_ignore_ascii_case("line")
            || TagName.eq_ignore_ascii_case("g");

            if IsGlyph || IsShape
            {
                let mut ProcessedTag = String::with_capacity(FullTag.len());
                let mut TagRest = FullTag;

                while let Some(AttrPos) = TagRest.find("fill=\"").or_else( || TagRest.find("stroke=\""))
                {
                    let IsFill = TagRest[AttrPos..].starts_with("fill=\"");
                    let AttrName = if IsFill { "fill" } else { "stroke" };
                    let ValueStart = AttrPos + AttrName.len() + 2;
                    ProcessedTag.push_str( & TagRest[..AttrPos]);

                    let SubRest = & TagRest[ValueStart..];
                    if let Some(QuoteEnd) = SubRest.find('"')
                    {
                        let ColorVal = & SubRest[..QuoteEnd];
                        if ColorVal == "__CANVAS_BLACK_SENTINEL__"
                        {
                            ProcessedTag.push_str( & format ! ("{}=\"#000000\"", AttrName));
                        }
                        else if ColorVal.starts_with('#')
                        {
                            let Converted = if IsGlyph
                            {
                                InvertGlyphColorHex(ColorVal)
                            }
                            else
                            {
                                InvertShapeColorHex(ColorVal)
                            };
                            ProcessedTag.push_str( & format ! ("{}=\"#{}\"", AttrName, Converted));
                        }
                        else
                        {
                            ProcessedTag.push_str( & format ! ("{}=\"{}\"", AttrName, ColorVal));
                        }
                        TagRest = & SubRest[QuoteEnd + 1..];
                    }
                    else
                    {
                        ProcessedTag.push_str( & TagRest[AttrPos..ValueStart]);
                        TagRest = SubRest;
                    }
                }
                ProcessedTag.push_str(TagRest);
                FinalSvg.push_str( & ProcessedTag);
            }
            else
            {
                FinalSvg.push_str(FullTag);
            }

            Rest = & AfterStart[TagEnd + 1..];
        }
        else
        {
            FinalSvg.push_str( & Rest[TagStart..]);
            break;
        }
    }
    FinalSvg
}

fn FindTypstBinary() -> std::path::PathBuf
{
    let BinName = if cfg!(windows)
    {
        "typst.exe"
    }
    else
    {
        "typst"
    };

    if let Ok(ExePath) = std::env::current_exe()
        && let Some(ExeDir) = ExePath.parent()
        {
            let CandidateBin = ExeDir.join("bin").join(BinName);
            if CandidateBin.exists()
            {
                return CandidateBin;
            }

            let CandidateResBin = ExeDir.join("resources").join("bin").join(BinName);
            if CandidateResBin.exists()
            {
                return CandidateResBin;
            }

            let CandidateRes = ExeDir.join("resources").join(BinName);
            if CandidateRes.exists()
            {
                return CandidateRes;
            }

            let CandidateDirect = ExeDir.join(BinName);
            if CandidateDirect.exists()
            {
                return CandidateDirect;
            }

            // macOS .app bundle: TypstStudio.app/Contents/MacOS/typst-studio -> Resources/bin/typst
            let MacOsResBin = ExeDir.join("../Resources/bin").join(BinName);
            if MacOsResBin.exists()
            {
                return MacOsResBin;
            }

            let DevCandidate = ExeDir.join("../../../bin").join(BinName);
            if DevCandidate.exists()
            {
                return DevCandidate;
            }
        }

    for Rel in &["bin", "../bin", "TypstStudio/bin"]
    {
        let Cand = std::path::PathBuf::from(Rel).join(BinName);
        if Cand.exists()
        {
            return Cand;
        }
    }

    std::path::PathBuf::from(BinName)
}

fn GetFontDirectories() -> Vec<std::path::PathBuf>
{
    let mut Dirs = Vec::new();
    let Candidates =
    [
        "TypstStudio/public/fonts",
        "public/fonts",
        "assets/fonts",
        "../public/fonts",
        "../assets/fonts",
        "../../TypstStudio/public/fonts",
        "../../assets/fonts",
        r"E:\Typst\TypstStudio\public\fonts",
        r"E:\Typst\assets\fonts",
    ];

    if let Ok(CurrentExe) = std::env::current_exe()
        && let Some(ExeDir) = CurrentExe.parent()
        {
            let CandidateRes = ExeDir.join("resources").join("fonts");
            if CandidateRes.exists() && CandidateRes.is_dir()
            {
                Dirs.push(CandidateRes);
            }
            let CandidatePub = ExeDir.join("public").join("fonts");
            if CandidatePub.exists() && CandidatePub.is_dir()
            {
                Dirs.push(CandidatePub);
            }
        }

    for Cand in Candidates
    {
        let P = std::path::PathBuf::from(Cand);
        if P.exists() && P.is_dir() && !Dirs.contains(&P)
        {
            Dirs.push(P);
        }
    }

    Dirs
}

fn CreateCommand<P: AsRef<std::ffi::OsStr>>(Program: P) -> std::process::Command
{
    let mut Cmd = std::process::Command::new(Program);
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        Cmd.creation_flags(0x08000000);
    }
    Cmd
}

fn ResolveDocRoot(FilePath: Option<&str>, JobDir: &std::path::Path) -> std::path::PathBuf
{
    if let Some(Path) = FilePath
        && let Ok(Validated) = ValidateWorkspacePath(Path, false, false)
        {
            if Validated.exists() && Validated.is_file()
            {
                return Validated.parent().map(|Dir| Dir.to_path_buf()).unwrap_or_else(|| JobDir.to_path_buf());
            }
            else if Validated.exists() && Validated.is_dir()
            {
                return Validated;
            }
        }
    JobDir.to_path_buf()
}

fn ExecuteCommandWithTimeout
(
    mut Child: std::process::Child,
    TimeoutDuration: std::time::Duration,
) -> Result<std::process::Output, String>
{
    let PollInterval = std::time::Duration::from_millis(50);
    let Start = std::time::Instant::now();

    loop
    {
        match Child.try_wait()
        {
            Ok(Some(_)) =>
            {
                return Child.wait_with_output()
                    .map_err(|Error| format!("Execution failed: {}", Error));
            }
            Ok(None) =>
            {
                if Start.elapsed() >= TimeoutDuration
                {
                    let _ = Child.kill();
                    let _ = Child.wait();
                    return Err(format!("Typst process timed out after {} seconds", TimeoutDuration.as_secs()));
                }
                std::thread::sleep(PollInterval);
            }
            Err(Error) =>
            {
                let _ = Child.kill();
                return Err(format!("Process polling failure: {}", Error));
            }
        }
    }
}

fn CompileTypstSync(Source: String, FilePath: Option<String>) -> Result<Compile_Response, String>
{
    let StartTime = std::time::Instant::now();
    let TypstBin = FindTypstBinary();

    let TempBase = std::env::temp_dir();
    let UniqueId = format!
    (
        "job_{}_{}",
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis(),
        std::process::id()
    );
    let JobDir = TempBase.join("typst_studio").join(UniqueId);
    let _ = std::fs::create_dir_all(&JobDir);

    let DocRoot = ResolveDocRoot(FilePath.as_deref(), &JobDir);

    let OutputPattern = JobDir.join("page-{p}.svg");

    let mut Command = CreateCommand(&TypstBin);
    Command.args(["compile", "--root", DocRoot.to_str().unwrap_or("."), "--format", "svg", "-", OutputPattern.to_str().unwrap_or("page-{p}.svg")]);
    for FontDir in GetFontDirectories()
    {
        Command.arg("--font-path").arg(FontDir);
    }
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (|Error| format!("Failed to spawn typst binary at {:?}: {}", TypstBin, Error))?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(Source.as_bytes());
    }

    let Output = ExecuteCommandWithTimeout(Child, std::time::Duration::from_secs(30))?;
    let DurationMs = StartTime.elapsed().as_millis();

    if ! Output.status.success()
    {
        let Stderr = String::from_utf8_lossy( & Output.stderr).to_string();
        let Stdout = String::from_utf8_lossy( & Output.stdout).to_string();
        let ErrorMsg = if ! Stderr.trim().is_empty() { Stderr } else { Stdout };
        let _ = std::fs::remove_dir_all( & JobDir);
        return Ok
        (
            Compile_Response
            { success: false, pages: Vec::new (), page_count: 0, sync_map: Vec::new (), error: Some(ErrorMsg), duration_ms: DurationMs, }
        );
    }

    let mut SvgFiles = Vec:: new ();
    if let Ok(Entries) = std::fs::read_dir( & JobDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name.starts_with("page-") && Name.ends_with(".svg")
                && let Some(NumPart) = Name.strip_prefix("page-").and_then( | S | S.strip_suffix(".svg")) && let Ok(PageNum) = NumPart.parse::<usize>() { SvgFiles.push((PageNum, Entry.path())); }
        }
    }
    SvgFiles.sort_by_key( | Item | Item.0);

    let mut Pages = Vec:: new ();
    for (_, Path) in & SvgFiles
    { if let Ok(Content) = std::fs::read_to_string(Path) { Pages.push(Content); } }

    let SynctexPath = JobDir.join("synctex.json");
    let mut SyncMap = Vec:: new ();
    if SynctexPath.exists()
        && let Ok(RawSync) = std::fs::read_to_string( & SynctexPath) && let Ok(Parsed) = serde_json::from_str::<Vec<serde_json::Value>>( & RawSync) { SyncMap = Parsed; }

    if let Ok(mut Guard) = LAST_ACTIVE_SYNC_MAP.lock() && ! SyncMap.is_empty() { * Guard = SyncMap.clone(); }

    let _ = std::fs::remove_dir_all( & JobDir);

    Ok(Compile_Response { page_count: Pages.len(), success: true, pages: Pages, sync_map: SyncMap, error: None, duration_ms: DurationMs, })
}

#[tauri::command]
async fn CompileTypst(Source: String, FilePath: Option<String>) -> Result<Compile_Response, String>
{
    tauri::async_runtime::spawn_blocking(move || CompileTypstSync(Source, FilePath))
        .await
        .map_err( | Error | Error.to_string())?
}

fn ExportPdfSync(Source: String, FilePath: Option<String>, BlackMode: Option<bool>, Transparent: Option<bool>,) -> Result<Vec<u8>, String>
{
    let TypstBin = FindTypstBinary();
    let TempBase = std::env::temp_dir();
    let UniqueId = format!
    (
        "pdf_{}_{}",
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis(),
        std::process::id()
    );
    let JobDir = TempBase.join("typst_studio").join(UniqueId);
    let _ = std::fs::create_dir_all(&JobDir);

    let DocRoot = ResolveDocRoot(FilePath.as_deref(), &JobDir);

    let mut SourceToCompile = Source;
    if BlackMode.unwrap_or(false)
    {
        SourceToCompile = ConvertTypstSourceToDarkMode(&SourceToCompile, Transparent.unwrap_or(false));
    }
    else if Transparent.unwrap_or(false)
    {
        SourceToCompile = format!("#set page(fill: none)\n\n{}", SourceToCompile);
    }

    let OutputPdf = JobDir.join("output.pdf");

    let mut Command = CreateCommand(&TypstBin);
    Command.args(["compile", "--root", DocRoot.to_str().unwrap_or("."), "--format", "pdf", "-", OutputPdf.to_str().unwrap_or("output.pdf")]);
    for FontDir in GetFontDirectories()
    {
        Command.arg("--font-path").arg(FontDir);
    }
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (|Error| format!("Failed to spawn typst: {}", Error))?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(SourceToCompile.as_bytes());
    }

    let Output = ExecuteCommandWithTimeout(Child, std::time::Duration::from_secs(30))?;

    if ! Output.status.success()
    {
        let Stderr = String::from_utf8_lossy( & Output.stderr).to_string();
        let _ = std::fs::remove_dir_all( & JobDir);
        return Err(Stderr);
    }

    let PdfBytes = std::fs::read( & OutputPdf).map_err
    ( | Error | format ! ("Failed to read generated PDF: {}", Error))
    ?;
    let _ = std::fs::remove_dir_all( & JobDir);

    Ok(PdfBytes)
}

#[tauri::command]
async fn ExportPdf(Source: String, FilePath: Option<String>, BlackMode: Option<bool>, Transparent: Option<bool>,) -> Result<Vec<u8>, String>
{
    tauri::async_runtime::spawn_blocking(move || ExportPdfSync(Source, FilePath, BlackMode, Transparent))
        .await
        .map_err( | Error | Error.to_string())?
}

fn ExportPngSync(Source: String, FilePath: Option<String>, BaseDocName: String, BlackMode: bool , Transparent: bool ,) -> Result<Vec<u8>, String>
{
    let TypstBin = FindTypstBinary();
    let TempBase = std::env::temp_dir();
    let UniqueId = format!
    (
        "png_{}_{}",
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis(),
        std::process::id()
    );
    let JobDir = TempBase.join("typst_studio").join(UniqueId);
    let _ = std::fs::create_dir_all(&JobDir);

    let DocRoot = ResolveDocRoot(FilePath.as_deref(), &JobDir);

    let mut SourceToCompile = Source;
    if BlackMode
    {
        SourceToCompile = ConvertTypstSourceToDarkMode(&SourceToCompile, Transparent);
    }
    else if Transparent
    {
        SourceToCompile = format!("#set page(fill: none)\n\n{}", SourceToCompile);
    }

    let OutputPattern = JobDir.join("page-{p}.png");

    let mut Command = CreateCommand(&TypstBin);
    Command.args
    ([
        "compile",
        "--root",
        DocRoot.to_str().unwrap_or("."),
        "--format",
        "png",
        "--ppi",
        "300",
        "-",
        OutputPattern.to_str().unwrap_or("page-{p}.png"),
    ]);
    for FontDir in GetFontDirectories()
    {
        Command.arg("--font-path").arg(FontDir);
    }
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (|Error| format!("Failed to spawn typst: {}", Error))?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(SourceToCompile.as_bytes());
    }

    let Output = ExecuteCommandWithTimeout(Child, std::time::Duration::from_secs(30))?;

    if ! Output.status.success()
    {
        let Stderr = String::from_utf8_lossy( & Output.stderr).to_string();
        let _ = std::fs::remove_dir_all( & JobDir);
        return Err(Stderr);
    }

    let mut PngFiles = Vec:: new ();
    if let Ok(Entries) = std::fs::read_dir( & JobDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name.starts_with("page-") && Name.ends_with(".png")
                && let Some(NumPart) = Name.strip_prefix("page-").and_then( | S | S.strip_suffix(".png")) && let Ok(PageNum) = NumPart.parse::<usize>() { PngFiles.push((PageNum, Entry.path())); }
        }
    }
    PngFiles.sort_by_key( | Item | Item.0);

    if PngFiles.is_empty()
    { let _ = std::fs::remove_dir_all( & JobDir); return Err("No PNG pages were generated.".to_string()); }

    use std::io::Cursor;
    use zip::write:: { SimpleFileOptions, ZipWriter };

    let mut ZipBuffer = Vec:: new ();
    {
        let mut Zip = ZipWriter:: new (Cursor::new ( & mut ZipBuffer));
        let Options = SimpleFileOptions:: default().compression_method(zip::CompressionMethod::Deflated);

        let SafeBaseDocName = std::path::Path::new(&BaseDocName)
            .file_name()
            .map(|N| N.to_string_lossy().to_string())
            .unwrap_or_else(|| "document".to_string())
            .replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], "_");

        for (Idx, (_, PngPath)) in PngFiles.iter().enumerate()
        {
            let EntryName = format!("{}_page_{}.png", SafeBaseDocName, Idx + 1);
            Zip.start_file(EntryName, Options).map_err( | Error | format ! ("Zip error: {}", Error))?;
            let PageData = std::fs::read(PngPath).map_err( | Error | format ! ("Failed to read PNG: {}", Error))?;
            Zip.write_all( & PageData).map_err( | Error | format ! ("Zip write error: {}", Error))?;
        }
        Zip.finish().map_err( | Error | format ! ("Zip finish error: {}", Error))?;
    }

    let _ = std::fs::remove_dir_all( & JobDir);
    Ok(ZipBuffer)
}

#[tauri::command]
async fn ExportPng(Source: String, FilePath: Option<String>, BaseDocName: String, BlackMode: bool , Transparent: bool ,) -> Result<Vec<u8>, String>
{
    tauri::async_runtime::spawn_blocking(move || ExportPngSync(Source, FilePath, BaseDocName, BlackMode, Transparent))
        .await
        .map_err( | Error | Error.to_string())?
}

fn ExportSvgSync(Source: String, FilePath: Option<String>, BaseDocName: String, BlackMode: bool , Transparent: bool ,) -> Result<Vec<u8>, String>
{
    let TypstBin = FindTypstBinary();
    let TempBase = std::env::temp_dir();
    let UniqueId = format!
    (
        "svg_{}_{}",
        std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap_or_default().as_millis(),
        std::process::id()
    );
    let JobDir = TempBase.join("typst_studio").join(UniqueId);
    let _ = std::fs::create_dir_all(&JobDir);

    let DocRoot = ResolveDocRoot(FilePath.as_deref(), &JobDir);

    let mut SourceToCompile = Source;
    if BlackMode
    {
        SourceToCompile = ConvertTypstSourceToDarkMode(&SourceToCompile, Transparent);
    }
    else if Transparent
    {
        SourceToCompile = format!("#set page(fill: none)\n\n{}", SourceToCompile);
    }

    let OutputPattern = JobDir.join("page-{p}.svg");

    let mut Command = CreateCommand(&TypstBin);
    Command.args(["compile", "--root", DocRoot.to_str().unwrap_or("."), "--format", "svg", "-", OutputPattern.to_str().unwrap_or("page-{p}.svg")]);
    for FontDir in GetFontDirectories()
    {
        Command.arg("--font-path").arg(FontDir);
    }
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (|Error| format!("Failed to spawn typst: {}", Error))?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(SourceToCompile.as_bytes());
    }

    let Output = ExecuteCommandWithTimeout(Child, std::time::Duration::from_secs(30))?;

    if ! Output.status.success()
    {
        let Stderr = String::from_utf8_lossy( & Output.stderr).to_string();
        let _ = std::fs::remove_dir_all( & JobDir);
        return Err(Stderr);
    }

    let mut SvgFiles = Vec:: new ();
    if let Ok(Entries) = std::fs::read_dir( & JobDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name.starts_with("page-") && Name.ends_with(".svg")
                && let Some(NumPart) = Name.strip_prefix("page-").and_then( | S | S.strip_suffix(".svg")) && let Ok(PageNum) = NumPart.parse::<usize>() { SvgFiles.push((PageNum, Entry.path())); }
        }
    }
    SvgFiles.sort_by_key( | Item | Item.0);

    if SvgFiles.is_empty()
    { let _ = std::fs::remove_dir_all( & JobDir); return Err("No SVG pages were generated.".to_string()); }

    use std::io::Cursor;
    use zip::write:: { SimpleFileOptions, ZipWriter };

    let mut ZipBuffer = Vec:: new ();
    {
        let mut Zip = ZipWriter:: new (Cursor::new ( & mut ZipBuffer));
        let Options = SimpleFileOptions:: default().compression_method(zip::CompressionMethod::Deflated);

        let SafeBaseDocName = std::path::Path::new(&BaseDocName)
            .file_name()
            .map(|N| N.to_string_lossy().to_string())
            .unwrap_or_else(|| "document".to_string())
            .replace(['/', '\\', ':', '*', '?', '"', '<', '>', '|'], "_");

        for (Idx, (_, SvgPath)) in SvgFiles.iter().enumerate()
        {
            let EntryName = format!("{}_page_{}.svg", SafeBaseDocName, Idx + 1);
            Zip.start_file(EntryName, Options).map_err( | Error | format ! ("Zip error: {}", Error))?;
            let mut SvgContent = std::fs::read_to_string(SvgPath).map_err
            ( | Error | format ! ("Failed to read SVG: {}", Error))
            ?;

            if BlackMode
            { SvgContent = ConvertSvgToDarkMode( & SvgContent); }

            if Transparent
            {
                SvgContent = SvgContent.replace("fill=\"#000000\" fill-rule=\"nonzero\" d=\"M 0 0v", "fill=\"none\" fill-rule=\"nonzero\" d=\"M 0 0v");
                SvgContent = SvgContent.replace("fill=\"#ffffff\" fill-rule=\"nonzero\" d=\"M 0 0v", "fill=\"none\" fill-rule=\"nonzero\" d=\"M 0 0v");
                SvgContent = SvgContent.replace("fill=\"#FFFFFF\" fill-rule=\"nonzero\" d=\"M 0 0v", "fill=\"none\" fill-rule=\"nonzero\" d=\"M 0 0v");
            }

            Zip.write_all(SvgContent.as_bytes()).map_err( | Error | format ! ("Zip write error: {}", Error))?;
        }
        Zip.finish().map_err( | Error | format ! ("Zip finish error: {}", Error))?;
    }

    let _ = std::fs::remove_dir_all( & JobDir);
    Ok(ZipBuffer)
}

#[tauri::command]
async fn ExportSvg(Source: String, FilePath: Option<String>, BaseDocName: String, BlackMode: bool , Transparent: bool ,) -> Result<Vec<u8>, String>
{
    tauri::async_runtime::spawn_blocking(move || ExportSvgSync(Source, FilePath, BaseDocName, BlackMode, Transparent))
        .await
        .map_err( | Error | Error.to_string())?
}

#[tauri::command]
fn PickFolder() -> Result<Option<String>, String>
{
    let Selected = rfd::FileDialog:: new ()
   .set_title("Select Typst Project Folder")
   .pick_folder();

    Ok(Selected.map( | P | P.to_string_lossy().to_string()))
}

// =============================================================================
// Security Hardening & Workspace Boundary Sandboxing
// =============================================================================

const FORBIDDEN_EXTENSIONS: &[&str] =
&[
    ".exe", ".msi", ".msp", ".com", ".scr", ".pif", ".cpl", ".dll", ".sys", ".drv", ".ocx",
    ".bat", ".cmd", ".vbs", ".vbe", ".js", ".jse", ".ws", ".wsf", ".wsc", ".wsh", ".ps1", ".psm1", ".psd1",
    ".lnk", ".url", ".scf",
    ".sh", ".bash", ".zsh", ".fish", ".csh", ".tcsh", ".ksh",
    ".py", ".pyw", ".rb", ".pl", ".php", ".cgi",
    ".jar", ".class",
    ".so", ".dylib", ".bin", ".app", ".dmg", ".pkg", ".deb", ".rpm",
    ".inf", ".sct", ".reg", ".hta",
    ".rs", ".toml", ".yaml", ".yml", ".cargo", ".git", ".lock",
];

const PROTECTED_SYSTEM_FILES: &[&str] =
&[
    ".workspace_config.json",
    "server.js",
    "package.json",
    "package-lock.json",
    ".env",
    ".env.local",
    ".bashrc",
    ".bash_profile",
    ".zshrc",
    ".profile",
    ".gitconfig",
    ".gitignore",
    ".gitmodules",
    "id_rsa",
    "id_ed25519",
    "authorized_keys",
    "known_hosts",
    "desktop.ini",
    "autorun.inf",
    "cargo.toml",
    "build.rs",
    "tauri.conf.json",
    "cargo.lock",
    "pre-commit",
    "post-checkout",
    "makefile",
    "dockerfile",
];

const ALLOWED_ASSET_EXTENSIONS: &[&str] =
&[
    ".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".bmp", ".ico", ".tiff",
    ".pdf", ".typ", ".txt", ".json", ".csv", ".tsv", ".bib",
];

fn NormalizePath(Path: &std::path::Path) -> std::path::PathBuf
{
    use std::path::Component;
    let mut Components = Vec::new();
    for Comp in Path.components()
    {
        match Comp
        {
            Component::CurDir => {},
            Component::ParentDir =>
            {
                if let Some(Last) = Components.last()
                    && !matches!(Last, Component::RootDir | Component::Prefix(_))
                    {
                        Components.pop();
                    }
            },
            _ => Components.push(Comp),
        }
    }
    Components.into_iter().collect()
}

fn StripVerbatimPrefix(Path: &std::path::Path) -> std::path::PathBuf
{
    let PathStr = Path.to_string_lossy();
    if let Some(Stripped) = PathStr.strip_prefix(r"\\?\UNC\")
    {
        std::path::PathBuf::from(format!(r"\\{}", Stripped))
    }
    else if let Some(Stripped) = PathStr.strip_prefix(r"\\?\")
    {
        std::path::PathBuf::from(Stripped)
    }
    else
    {
        Path.to_path_buf()
    }
}

fn CanonicalizeOrResolve(Path: &std::path::Path) -> std::path::PathBuf
{
    if let Ok(Canon) = Path.canonicalize()
    {
        StripVerbatimPrefix(&Canon)
    }
    else if let Some(Parent) = Path.parent()
    {
        if let Ok(CanonParent) = Parent.canonicalize()
        {
            if let Some(FileName) = Path.file_name()
            {
                StripVerbatimPrefix(&CanonParent).join(FileName)
            }
            else
            {
                StripVerbatimPrefix(&CanonParent)
            }
        }
        else
        {
            NormalizePath(Path)
        }
    }
    else
    {
        NormalizePath(Path)
    }
}

fn IsPathContainedIn(ParentDir: &std::path::Path, ChildPath: &std::path::Path) -> bool
{
    let CanonParent = CanonicalizeOrResolve(ParentDir);
    let CanonChild = CanonicalizeOrResolve(ChildPath);

    #[cfg(windows)]
    {
        let ParentComponents: Vec<_> = CanonParent.components()
            .map(|C| C.as_os_str().to_string_lossy().to_lowercase())
            .collect();
        let ChildComponents: Vec<_> = CanonChild.components()
            .map(|C| C.as_os_str().to_string_lossy().to_lowercase())
            .collect();

        if ChildComponents.len() < ParentComponents.len()
        {
            return false;
        }

        ChildComponents[..ParentComponents.len()] == ParentComponents[..]
    }
    #[cfg(not(windows))]
    {
        CanonChild.strip_prefix(&CanonParent).is_ok()
    }
}

fn ValidateWorkspacePath(CandidatePath: &str, MustExist: bool, CheckExtension: bool) -> Result<std::path::PathBuf, String>
{
    let Trimmed = CandidatePath.trim();
    if Trimmed.is_empty()
    {
        return Err("Path specification cannot be empty.".to_string());
    }

    if Trimmed.contains('\0')
    {
        return Err("Access denied: Path contains prohibited null byte.".to_string());
    }

    #[cfg(windows)]
    {
        let AfterDrive = if Trimmed.len() >= 2 && Trimmed.as_bytes()[1] == b':'
        {
            &Trimmed[2..]
        }
        else
        {
            Trimmed
        };
        if AfterDrive.contains(':')
        {
            return Err("Access denied: Alternate Data Streams are strictly prohibited.".to_string());
        }
    }

    let RawPath = std::path::Path::new(Trimmed);
    let CanonCandidate = CanonicalizeOrResolve(RawPath);

    let TrackedDirs = GetTrackedDirectories();
    if TrackedDirs.is_empty()
    {
        return Err("No tracked workspace directories configured.".to_string());
    }

    let mut IsContained = false;
    for Dir in &TrackedDirs
    {
        let TrackedPath = std::path::Path::new(Dir);
        if IsPathContainedIn(TrackedPath, &CanonCandidate)
        {
            IsContained = true;
            break;
        }
    }

    if !IsContained
    {
        return Err(format!("Access denied: Path '{}' is outside tracked workspace directories.", Trimmed));
    }

    let FileName = CanonCandidate
        .file_name()
        .map(|N| N.to_string_lossy().to_string())
        .unwrap_or_default();
    let LowerName = FileName.to_lowercase();
    let CleanBase = LowerName.trim_end_matches(&['.', ' '][..]);

    for Protected in PROTECTED_SYSTEM_FILES
    {
        if CleanBase == *Protected
        {
            return Err(format!("Access denied: '{}' is a protected system configuration file.", FileName));
        }
    }

    if CheckExtension
    {
        let Ext = CanonCandidate
            .extension()
            .and_then(|E| E.to_str())
            .map(|E| format!(".{}", E.to_lowercase()))
            .unwrap_or_default();

        for Forbidden in FORBIDDEN_EXTENSIONS
        {
            if Ext == *Forbidden
            {
                return Err(format!("Access denied: Files with extension '{}' are strictly forbidden.", Ext));
            }
        }
    }

    if MustExist && !RawPath.exists()
    {
        return Err(format!("Target file does not exist: {}", Trimmed));
    }

    Ok(CanonCandidate)
}

fn ValidateExternalUrl(Url: &str) -> Result<String, String>
{
    let Trimmed = Url.trim();
    if Trimmed.is_empty()
    {
        return Err("URL cannot be empty".to_string());
    }

    if Trimmed.contains('\0') || Trimmed.contains('\n') || Trimmed.contains('\r')
    {
        return Err("Access denied: URL contains prohibited control characters.".to_string());
    }

    let Lower = Trimmed.to_lowercase();

    let IsHttp = Lower.starts_with("https://") || Lower.starts_with("http://");
    let IsMailto = Lower.starts_with("mailto:");
    if !IsHttp && !IsMailto
    {
        return Err("Access denied: Only HTTP, HTTPS, and mailto URLs can be opened externally.".to_string());
    }

    if Lower.contains("javascript:") || Lower.contains("data:") || Lower.contains("file:") || Lower.contains("powershell") || Lower.contains("vbscript:")
    {
        return Err("Access denied: Prohibited scheme or content detected.".to_string());
    }

    if IsHttp
        && let Some(HostPart) = Trimmed.split("://").nth(1)
        {
            let Domain = HostPart.split('/').next().unwrap_or(HostPart);
            if Domain.contains('@')
            {
                return Err("Access denied: URLs with embedded credentials are prohibited.".to_string());
            }
        }

    Ok(Trimmed.to_string())
}

#[tauri::command]
fn ReadWorkspaceFile(PathStr: String) -> Result<String, String>
{
    let CleanPath = PathStr.trim().replace('/', "\\");
    let RawPath = std::path::Path::new(&CleanPath);

    if RawPath.is_absolute()
    {
        let Validated = ValidateWorkspacePath(&CleanPath, true, false)?;
        return std::fs::read_to_string(&Validated).map_err(|Error| format!("Failed to read file: {}", Error));
    }

    for Dir in GetTrackedDirectories()
    {
        let Candidate = std::path::Path::new(&Dir).join(&CleanPath);
        if Candidate.exists() && Candidate.is_file()
            && let Ok(Validated) = ValidateWorkspacePath(&Candidate.to_string_lossy(), true, false)
            {
                return std::fs::read_to_string(&Validated).map_err(|Error| format!("Failed to read file: {}", Error));
            }
    }

    let TargetFileName = RawPath
        .file_name()
        .map(|N| N.to_string_lossy().to_string())
        .unwrap_or_else(|| CleanPath.clone());

    for Dir in GetTrackedDirectories()
    {
        let Candidate = std::path::Path::new(&Dir).join(&TargetFileName);
        if Candidate.exists() && Candidate.is_file()
            && let Ok(Validated) = ValidateWorkspacePath(&Candidate.to_string_lossy(), true, false)
            {
                return std::fs::read_to_string(&Validated).map_err(|Error| format!("Failed to read file: {}", Error));
            }
    }

    Err(format!("Access denied or file not found in tracked workspace directories: {}", CleanPath))
}

#[tauri::command]
fn SaveWorkspaceFile(PathStr: String, Content: String) -> Result<(), String>
{
    let CleanPath = PathStr.trim().replace('/', "\\");
    let RawPath = std::path::Path::new(&CleanPath);

    let TargetPath = if RawPath.is_absolute()
    {
        RawPath.to_path_buf()
    }
    else
    {
        let PrimaryDir = GetTrackedDirectories().first().cloned().unwrap_or_else(|| ".".to_string());
        std::path::Path::new(&PrimaryDir).join(&CleanPath)
    };

    let Validated = ValidateWorkspacePath(&TargetPath.to_string_lossy(), false, true)?;

    if let Some(Parent) = Validated.parent()
    {
        let _ = std::fs::create_dir_all(Parent);
    }

    std::fs::write(&Validated, Content).map_err(|Error| format!("Failed to save file: {}", Error))
}

#[tauri::command]
fn ListWorkspaceFiles(DirPath: Option<String>) -> Result<Vec<File_Entry>, String>
{
    let TargetDir = if let Some(ref Dir) = DirPath
    {
        let Trimmed = Dir.trim();
        if !Trimmed.is_empty()
        {
            let NormTarget = NormalizePath(std::path::Path::new(Trimmed));
            let Tracked = GetTrackedDirectories();
            let mut Contained = false;
            for T in &Tracked
            {
                let NormT = NormalizePath(std::path::Path::new(T));
                if IsPathContainedIn(&NormT, &NormTarget)
                {
                    Contained = true;
                    break;
                }
            }
            if !Contained
            {
                return Err(format!("Access denied: Directory '{}' is outside tracked workspace.", Trimmed));
            }
            NormTarget
        }
        else
        {
            GetTrackedDirectories().first().map(std::path::PathBuf::from).unwrap_or_else(|| std::env::current_dir().unwrap_or_default())
        }
    }
    else
    {
        GetTrackedDirectories().first().map(std::path::PathBuf::from).unwrap_or_else(|| std::env::current_dir().unwrap_or_default())
    };

    let mut Results = Vec::new();

    if let Ok(Entries) = std::fs::read_dir(&TargetDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name == ".git" || Name == "target" || Name == "node_modules" || Name == ".typst-studio" || Name.starts_with('.')
            {
                continue;
            }

            let Meta = Entry.metadata().ok();
            let IsDir = Meta.as_ref().map(|M| M.is_dir()).unwrap_or(false);
            let Size = Meta.as_ref().map(|M| M.len()).unwrap_or(0);
            let Path = Entry.path().to_string_lossy().to_string();

            Results.push(File_Entry { name: Name, path: Path, is_dir: IsDir, size: Size });
        }
    }

    Results.sort_by(|A, B| {
        if A.is_dir != B.is_dir
        {
            B.is_dir.cmp(&A.is_dir)
        }
        else
        {
            A.name.to_lowercase().cmp(&B.name.to_lowercase())
        }
    });

    Ok(Results)
}

fn FindWorkspaceConfigFile() -> std::path::PathBuf
{
    for Rel in &
    [".workspace_config.json", "TypstStudio/.workspace_config.json", "../.workspace_config.json", "../../.workspace_config.json",]
    {
        let P = std::path::PathBuf::from(Rel);
        if P.exists()
        { return P; }
    }

    if let Ok(Exe) = std::env::current_exe()
        && let Some(Dir) = Exe.parent()
        {
            let Candidate = Dir.join(".workspace_config.json");
            if Candidate.exists()
            { return Candidate; }
            let DevCandidate = Dir.join("../../../.workspace_config.json");
            if DevCandidate.exists()
            { return DevCandidate; }
        }

    std::path::PathBuf::from(r"E:\Typst\TypstStudio\.workspace_config.json")
}

fn GetTrackedDirectories() -> Vec<String>
{
    let ConfigPath = FindWorkspaceConfigFile();
    if ConfigPath.exists()
        && let Ok(Content) = std::fs::read_to_string( & ConfigPath)
            && let Ok(Data) = serde_json::from_str::<Workspace_Config_Data>( & Content) && ! Data.Directories.is_empty() { return Data.Directories; }

    vec![r"e:\Typst\projects".to_string()]
}

fn SaveTrackedDirectories(Dirs: & [String]) -> Result < (), String >
{
    let ConfigPath = FindWorkspaceConfigFile();
    let Data = Workspace_Config_Data
    { Directories: Dirs.to_vec(), };
    let Json = serde_json::to_string_pretty( & Data).map_err
    ( | Error | format ! ("Serialize error: {}", Error))
    ?;
    std::fs::write( & ConfigPath, Json).map_err( | Error | format ! ("Write config error: {}", Error))?;
    Ok(())
}

fn ScanDirectoryRecursive(BaseDir: & std::path::Path, CurrentDir: & std::path::Path, Files: & mut Vec<Workspace_File>, Folders: & mut Vec<Workspace_Folder>,)
{
    let Entries = match std::fs::read_dir(CurrentDir)
    { Ok(E) => E, Err(_) => return , };

    let CurrentStr = CurrentDir.to_string_lossy().to_string();
    let FolderName = CurrentDir.file_name().map( | N | N.to_string_lossy().to_string()).unwrap_or_default();

    if CurrentDir != BaseDir
    { Folders.push(Workspace_Folder { Name: FolderName, Path: CurrentStr.clone(), FileCount: 0, }); }

    for Entry in Entries.flatten()
    {
        let Path = Entry.path();
        let Name = Entry.file_name().to_string_lossy().to_string();

        if Name.starts_with('.') || Name == "node_modules" || Name == "target" || Name == ".temp"
        { continue ; }

        if Path.is_dir()
        { ScanDirectoryRecursive(BaseDir, & Path, Files, Folders); }
        else if Path.is_file() && Name.ends_with(".typ")
        {
            let Meta = Entry.metadata().ok();
            let Size = Meta.as_ref().map( | M | M.len()).unwrap_or(0);
            let Modified = Meta
           .and_then( | M | M.modified().ok())
           .and_then( | T | T.duration_since(std::time::UNIX_EPOCH).ok())
           .map( | D | D.as_millis() as u64)
           .unwrap_or(0);

            let Rel = Path
           .strip_prefix(BaseDir)
           .map( | P | P.to_string_lossy().to_string())
           .unwrap_or_else( | _ | Name.clone());

            let ParentDir = Path.parent().map( | P | P.to_string_lossy().to_string()).unwrap_or_default();

            Files.push
            (
                Workspace_File
                { Name, Path: Path.to_string_lossy().to_string(), RelativePath: Rel, Directory: ParentDir, Size, Modified, }
            );
        }
    }
}

#[tauri::command]
fn GetWorkspaceInfo() -> Result<Workspace_Info_Response, String>
{
    let Dirs = GetTrackedDirectories();
    let mut AllFiles = Vec:: new ();
    let mut AllFolders = Vec:: new ();

    for DirStr in & Dirs
    {
        let Base = std::path::Path:: new (DirStr);
        if Base.exists() && Base.is_dir()
        { ScanDirectoryRecursive(Base, Base, & mut AllFiles, & mut AllFolders); }
    }

    let mut SeenFiles = std::collections::HashSet:: new ();
    let mut UniqueFiles = Vec:: new ();
    for File in AllFiles
    {
        let Key = File.Path.to_lowercase();
        if ! SeenFiles.contains( & Key)
        { SeenFiles.insert(Key); UniqueFiles.push(File); }
    }

    let mut SeenFolders = std::collections::HashSet:: new ();
    let mut UniqueFolders = Vec:: new ();
    for mut Folder in AllFolders
    {
        let Key = Folder.Path.to_lowercase();
        if ! SeenFolders.contains( & Key)
        {
            SeenFolders.insert(Key.clone());
            let FolderPrefix = format!("{}\\", Key);
            let FolderPrefixAlt = format!("{}/", Key);
            Folder.FileCount = UniqueFiles
           .iter()
           .filter( | F | { let FDir = F.Directory.to_lowercase(); FDir == Key || FDir.starts_with( & FolderPrefix) || FDir.starts_with( & FolderPrefixAlt) })
           .count();
            UniqueFolders.push(Folder);
        }
    }

    UniqueFiles.sort_by_key(|A| std::cmp::Reverse(A.Modified));

    Ok(Workspace_Info_Response { Success: true, Directories: Dirs, Files: UniqueFiles, Folders: UniqueFolders, })
}

#[tauri::command]
fn CreateWorkspaceFile(Directory: Option<String>, FileName: String, Content: Option<String>) -> Result<String, String>
{
    let Dirs = GetTrackedDirectories();
    let TargetDir = if let Some(ref Dir) = Directory
    {
        let Trimmed = Dir.trim();
        if !Trimmed.is_empty()
        {
            let NormTarget = NormalizePath(std::path::Path::new(Trimmed));
            let mut Contained = false;
            for D in &Dirs
            {
                let NormD = NormalizePath(std::path::Path::new(D));
                if IsPathContainedIn(&NormD, &NormTarget)
                {
                    Contained = true;
                    break;
                }
            }
            if !Contained
            {
                return Err(format!("Access denied: Directory '{}' is outside tracked workspace.", Trimmed));
            }
            Trimmed.to_string()
        }
        else
        {
            Dirs.first().cloned().unwrap_or_else(|| ".".to_string())
        }
    }
    else
    {
        Dirs.first().cloned().unwrap_or_else(|| ".".to_string())
    };

    let CleanName = std::path::Path::new(&FileName)
        .file_name()
        .map(|N| N.to_string_lossy().to_string())
        .unwrap_or_else(|| "Untitled.typ".to_string());

    let mut FinalName = CleanName;
    if !FinalName.ends_with(".typ")
    {
        FinalName.push_str(".typ");
    }

    let FullPath = std::path::Path::new(&TargetDir).join(&FinalName);
    let Validated = ValidateWorkspacePath(&FullPath.to_string_lossy(), false, true)?;

    if let Some(Parent) = Validated.parent()
    {
        let _ = std::fs::create_dir_all(Parent);
    }

    let InitialContent = Content.unwrap_or_else
    (
        ||
        {
            "#set page\n(\n    paper: \"a4\",\n    margin: 2.5cm\n)\n\n#set text\n(\n    font: \"Segoe UI\",\n    size: 11pt\n)\n\n= New Document\n\nStart writing your Typst document here.\n".to_string()
        }
    );

    std::fs::write(&Validated, InitialContent).map_err(|Error| format!("Failed to create file: {}", Error))?;
    Ok(Validated.to_string_lossy().to_string())
}

#[tauri::command]
fn DeleteWorkspaceFile(PathStr: String) -> Result<(), String>
{
    let CleanPath = PathStr.trim().replace('/', "\\");
    let RawPath = std::path::Path::new(&CleanPath);

    let TargetPath = if RawPath.is_absolute()
    {
        RawPath.to_path_buf()
    }
    else
    {
        let mut Found = None;
        for Dir in GetTrackedDirectories()
        {
            let Candidate = std::path::Path::new(&Dir).join(&CleanPath);
            if Candidate.exists()
            {
                Found = Some(Candidate);
                break;
            }
        }
        Found.unwrap_or_else(|| RawPath.to_path_buf())
    };

    let Validated = ValidateWorkspacePath(&TargetPath.to_string_lossy(), true, true)?;
    std::fs::remove_file(&Validated).map_err(|Error| format!("Failed to delete file: {}", Error))?;
    Ok(())
}

#[tauri::command]
fn RenameWorkspaceFile(OldPathStr: String, NewNameStr: String) -> Result<String, String>
{
    let CleanOld = OldPathStr.trim().replace('/', "\\");
    let ValidatedOld = ValidateWorkspacePath(&CleanOld, true, true)?;
    let Parent = ValidatedOld.parent().ok_or_else
    (
        || "Target file has no parent directory".to_string()
    )?;

    let SanitizedNewName = NewNameStr.trim().replace('/', "").replace('\\', "").replace("..", "");
    if SanitizedNewName.is_empty() || SanitizedNewName == "."
    {
        return Err("Invalid new document name".to_string());
    }
    let FinalName = if SanitizedNewName.to_lowercase().ends_with(".typ")
    {
        SanitizedNewName
    }
    else
    {
        format!("{}.typ", SanitizedNewName)
    };

    let NewTarget = Parent.join(&FinalName);
    let ValidatedNew = ValidateWorkspacePath(&NewTarget.to_string_lossy(), false, true)?;

    if ValidatedNew.exists() && ValidatedNew != ValidatedOld
    {
        return Err(format!("A document named '{}' already exists in this folder", FinalName));
    }

    std::fs::rename(&ValidatedOld, &ValidatedNew).map_err
    (
        |Error| format!("Failed to rename file: {}", Error)
    )?;
    Ok(ValidatedNew.to_string_lossy().to_string())
}

#[tauri::command]
fn AddWorkspaceDirectory(PathStr: String) -> Result<(), String>
{
    let Trimmed = PathStr.trim();
    if Trimmed.is_empty()
    {
        return Err("Directory path cannot be empty".to_string());
    }
    if Trimmed.contains('\0')
    {
        return Err("Path contains prohibited null byte".to_string());
    }

    let P = std::path::Path::new(Trimmed);
    let Canon = CanonicalizeOrResolve(P);

    // Prevent adding bare drive roots (e.g. C:\ or /) or operating system directories
    if Canon.parent().is_none() || Canon.file_name().is_none()
    {
        return Err("Security Violation: Adding an entire drive or filesystem root to the workspace is strictly prohibited.".to_string());
    }

    let LowerStr = Canon.to_string_lossy().to_lowercase();
    if LowerStr.contains("\\windows") || LowerStr.contains("/windows") || LowerStr.contains("\\system32") || LowerStr.contains("/system32")
    {
        return Err("Security Violation: Operating system directories cannot be added as workspace roots.".to_string());
    }

    if !P.exists()
    {
        let _ = std::fs::create_dir_all(P);
    }

    let mut Dirs = GetTrackedDirectories();
    let Canonical = Canon.to_string_lossy().to_string();

    if !Dirs.iter().any(|D| D.eq_ignore_ascii_case(&Canonical))
    {
        Dirs.push(Canonical);
        SaveTrackedDirectories(&Dirs)?;
    }
    Ok(())
}

#[tauri::command]
fn RemoveWorkspaceDirectory(PathStr: String) -> Result<(), String>
{
    let Trimmed = PathStr.trim();
    let P = std::path::Path::new(Trimmed);
    let Canon = CanonicalizeOrResolve(P).to_string_lossy().to_string();

    let mut Dirs = GetTrackedDirectories();
    Dirs.retain(|D| !D.eq_ignore_ascii_case(Trimmed) && !D.eq_ignore_ascii_case(&Canon));
    SaveTrackedDirectories(&Dirs)?;
    Ok(())
}

#[tauri::command]
fn UploadAsset(Directory: Option<String>, FileName: String, Base64Data: String) -> Result<String, String>
{
    let Dirs = GetTrackedDirectories();
    let TargetDir = if let Some(ref Dir) = Directory
    {
        let Trimmed = Dir.trim();
        if !Trimmed.is_empty()
        {
            let NormTarget = NormalizePath(std::path::Path::new(Trimmed));
            let mut Contained = false;
            for D in &Dirs
            {
                let NormD = NormalizePath(std::path::Path::new(D));
                if IsPathContainedIn(&NormD, &NormTarget)
                {
                    Contained = true;
                    break;
                }
            }
            if !Contained
            {
                return Err(format!("Access denied: Directory '{}' is outside tracked workspace.", Trimmed));
            }
            Trimmed.to_string()
        }
        else
        {
            Dirs.first().cloned().unwrap_or_else(|| ".".to_string())
        }
    }
    else
    {
        Dirs.first().cloned().unwrap_or_else(|| ".".to_string())
    };

    let CleanName = std::path::Path::new(&FileName)
        .file_name()
        .map(|N| N.to_string_lossy().to_string())
        .unwrap_or_else(|| "asset.png".to_string());

    let Ext = std::path::Path::new(&CleanName)
        .extension()
        .and_then(|E| E.to_str())
        .map(|E| format!(".{}", E.to_lowercase()))
        .unwrap_or_default();

    if !ALLOWED_ASSET_EXTENSIONS.contains(&Ext.as_str())
    {
        return Err(format!("Access denied: File extension '{}' is not an allowed asset type.", Ext));
    }

    let OutPath = std::path::Path::new(&TargetDir).join(&CleanName);
    let Validated = ValidateWorkspacePath(&OutPath.to_string_lossy(), false, true)?;

    if let Some(Parent) = Validated.parent()
    {
        let _ = std::fs::create_dir_all(Parent);
    }

    let CleanBase64 = if let Some(Pos) = Base64Data.find(";base64,")
    {
        &Base64Data[Pos + 8..]
    }
    else
    {
        &Base64Data
    };

    use base64::Engine;
    let Decoded = base64::engine::general_purpose::STANDARD
        .decode(CleanBase64.trim())
        .map_err(|Error| format!("Base64 decode error: {}", Error))?;

    std::fs::write(&Validated, Decoded).map_err(|Error| format!("Failed to write asset: {}", Error))?;
    Ok(Validated.to_string_lossy().to_string())
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Paste_Image_Result
{
    #[serde(rename = "Success")]
    pub Success: bool,
    #[serde(rename = "RelativePath")]
    pub RelativePath: String,
    #[serde(rename = "FileName")]
    pub FileName: String,
    #[serde(rename = "IsDuplicate")]
    pub IsDuplicate: bool,
    #[serde(rename = "Width")]
    pub Width: u32,
    #[serde(rename = "Height")]
    pub Height: u32,
    #[serde(rename = "ErrorMessage")]
    pub ErrorMessage: Option<String>,
}

fn FormatTimestamp(Secs: u64) -> String
{
    let Days = Secs / 86400;
    let RemSecs = Secs % 86400;
    let Hours = RemSecs / 3600;
    let Mins = (RemSecs % 3600) / 60;
    let Seconds = RemSecs % 60;

    let mut Y = 1970;
    let mut D = Days;
    loop
    {
        let Leap = (Y % 4 == 0 && Y % 100 != 0) || (Y % 400 == 0);
        let DaysInYear = if Leap { 366 } else { 365 };
        if D < DaysInYear
        {
            break;
        }
        D -= DaysInYear;
        Y += 1;
    }

    let Leap = (Y % 4 == 0 && Y % 100 != 0) || (Y % 400 == 0);
    let DaysInMonths = [
        31, if Leap { 29 } else { 28 }, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ];
    let mut M = 1;
    for (Idx, &Dim) in DaysInMonths.iter().enumerate()
    {
        if D < Dim
        {
            M = Idx + 1;
            break;
        }
        D -= Dim;
    }
    let Day = D + 1;

    format!("{:04}{:02}{:02}-{:02}{:02}{:02}", Y, M, Day, Hours, Mins, Seconds)
}

fn ResolveAssetsDirectory(DocPath: Option<&str>) -> std::path::PathBuf
{
    if let Some(PathStr) = DocPath
    {
        let Trimmed = PathStr.trim();
        if !Trimmed.is_empty()
            && let Ok(Validated) = ValidateWorkspacePath(Trimmed, false, false)
            {
                if Validated.is_file()
                {
                    if let Some(Parent) = Validated.parent()
                    {
                        return Parent.join("assets");
                    }
                }
                else if Validated.exists() && Validated.is_dir()
                {
                    return Validated.join("assets");
                }
                else if let Some(Parent) = Validated.parent()
                    && !Parent.as_os_str().is_empty()
                    {
                        return Parent.join("assets");
                    }
            }
    }

    let Dirs = GetTrackedDirectories();
    if let Some(First) = Dirs.first()
    {
        return std::path::Path::new(First).join("assets");
    }

    std::path::PathBuf::from("assets")
}

#[tauri::command]
fn PasteClipboardImage(DocPath: Option<String>) -> Result<Paste_Image_Result, String>
{
    let mut Clipboard = arboard::Clipboard::new()
        .map_err(|Error| format!("Failed to access OS clipboard: {}", Error))?;

    let ImgData = Clipboard.get_image()
        .map_err(|Error| format!("No image found on OS clipboard: {}", Error))?;

    let Width = ImgData.width as u32;
    let Height = ImgData.height as u32;
    let Rgba = image::RgbaImage::from_raw(Width, Height, ImgData.bytes.into_owned())
        .ok_or_else(|| "Failed to decode RGBA clipboard image".to_string())?;

    let mut PngBytes = Vec::new();
    let mut Cursor = std::io::Cursor::new(&mut PngBytes);
    Rgba.write_to(&mut Cursor, image::ImageFormat::Png)
        .map_err(|Error| format!("Failed to encode image to PNG: {}", Error))?;

    use sha2::{Digest, Sha256};
    let mut Hasher = Sha256::new();
    Hasher.update(&PngBytes);
    let FullHash = format!("{:x}", Hasher.finalize());
    let ShortHash = &FullHash[..8.min(FullHash.len())];

    let AssetsDir = ResolveAssetsDirectory(DocPath.as_deref());
    let _ = std::fs::create_dir_all(&AssetsDir);

    if let Ok(Entries) = std::fs::read_dir(&AssetsDir)
    {
        for Entry in Entries.flatten()
        {
            if let Ok(Meta) = Entry.metadata()
                && Meta.is_file() && Meta.len() == PngBytes.len() as u64
                    && let Ok(Existing) = std::fs::read(Entry.path())
                        && Existing == PngBytes
                        {
                            let ExistingName = Entry.file_name().to_string_lossy().to_string();
                            return Ok
                            (
                                Paste_Image_Result
                                {
                                    Success: true,
                                    RelativePath: format!("assets/{}", ExistingName),
                                    FileName: ExistingName,
                                    IsDuplicate: true,
                                    Width,
                                    Height,
                                    ErrorMessage: None,
                                }
                            );
                        }
        }
    }

    let Secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let TimestampStr = FormatTimestamp(Secs);
    let FileName = format!("paste-{}-{}.png", TimestampStr, ShortHash);
    let OutPath = AssetsDir.join(&FileName);

    ValidateWorkspacePath(&OutPath.to_string_lossy(), false, false)?;

    std::fs::write(&OutPath, &PngBytes)
        .map_err(|Error| format!("Failed to save image to {}: {}", OutPath.display(), Error))?;

    Ok
    (
        Paste_Image_Result
        {
            Success: true,
            RelativePath: format!("assets/{}", FileName),
            FileName,
            IsDuplicate: false,
            Width,
            Height,
            ErrorMessage: None,
        }
    )
}

#[tauri::command]
fn SavePastedFileAsset(DocPath: Option<String>, FileName: Option<String>, Base64Data: String) -> Result<Paste_Image_Result, String>
{
    let CleanBase64 = if let Some(Pos) = Base64Data.find(";base64,")
    {
        &Base64Data[Pos + 8..]
    }
    else
    {
        &Base64Data
    };

    use base64::Engine;
    let Decoded = base64::engine::general_purpose::STANDARD
        .decode(CleanBase64.trim())
        .map_err(|Error| format!("Base64 decode error: {}", Error))?;

    use sha2::{Digest, Sha256};
    let mut Hasher = Sha256::new();
    Hasher.update(&Decoded);
    let FullHash = format!("{:x}", Hasher.finalize());
    let ShortHash = &FullHash[..8.min(FullHash.len())];

    let AssetsDir = ResolveAssetsDirectory(DocPath.as_deref());
    let _ = std::fs::create_dir_all(&AssetsDir);

    if let Ok(Entries) = std::fs::read_dir(&AssetsDir)
    {
        for Entry in Entries.flatten()
        {
            if let Ok(Meta) = Entry.metadata()
                && Meta.is_file() && Meta.len() == Decoded.len() as u64
                    && let Ok(Existing) = std::fs::read(Entry.path())
                        && Existing == Decoded
                        {
                            let ExistingName = Entry.file_name().to_string_lossy().to_string();
                            return Ok
                            (
                                Paste_Image_Result
                                {
                                    Success: true,
                                    RelativePath: format!("assets/{}", ExistingName),
                                    FileName: ExistingName,
                                    IsDuplicate: true,
                                    Width: 0,
                                    Height: 0,
                                    ErrorMessage: None,
                                }
                            );
                        }
        }
    }

    let OriginalName = FileName.as_deref().unwrap_or("paste.png");
    let Ext = std::path::Path::new(OriginalName)
        .extension()
        .and_then(|E| E.to_str())
        .map(|E| format!(".{}", E.to_ascii_lowercase()))
        .unwrap_or_else(|| ".png".to_string());

    const ALLOWED_PASTE_EXTENSIONS: &[&str] = &[".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    if !ALLOWED_PASTE_EXTENSIONS.contains(&Ext.as_str())
    {
        return Err(format!("Security Violation: Prohibited asset extension '{}'. Allowed: png, jpg, jpeg, webp, svg, gif", Ext));
    }

    let Secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let TimestampStr = FormatTimestamp(Secs);
    let SavedFileName = format!("paste-{}-{}{}", TimestampStr, ShortHash, Ext);
    let OutPath = AssetsDir.join(&SavedFileName);

    ValidateWorkspacePath(&OutPath.to_string_lossy(), false, false)?;

    std::fs::write(&OutPath, &Decoded)
        .map_err(|Error| format!("Failed to write asset {}: {}", OutPath.display(), Error))?;

    Ok
    (
        Paste_Image_Result
        {
            Success: true,
            RelativePath: format!("assets/{}", SavedFileName),
            FileName: SavedFileName,
            IsDuplicate: false,
            Width: 0,
            Height: 0,
            ErrorMessage: None,
        }
    )
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Timeline_Snapshot
{
    #[serde(rename = "Id")]
    pub Id: String,
    #[serde(rename = "Timestamp")]
    pub Timestamp: u64,
    #[serde(rename = "FormattedTime")]
    pub FormattedTime: String,
    #[serde(rename = "Label")]
    pub Label: String,
    #[serde(rename = "WordCount")]
    pub WordCount: usize,
    #[serde(rename = "CharacterCount")]
    pub CharacterCount: usize,
    #[serde(rename = "ContentHash")]
    pub ContentHash: String,
    #[serde(rename = "Content")]
    pub Content: String,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Timeline_History_Summary
{
    #[serde(rename = "Id")]
    pub Id: String,
    #[serde(rename = "Timestamp")]
    pub Timestamp: u64,
    #[serde(rename = "FormattedTime")]
    pub FormattedTime: String,
    #[serde(rename = "Label")]
    pub Label: String,
    #[serde(rename = "WordCount")]
    pub WordCount: usize,
    #[serde(rename = "CharacterCount")]
    pub CharacterCount: usize,
    #[serde(rename = "ContentHash")]
    pub ContentHash: String,
}

fn GetDocumentHistoryPath(DocPath: Option<&str>) -> std::path::PathBuf
{
    let DocPathBuf = DocPath.filter(|P| !P.trim().is_empty()).map(std::path::PathBuf::from);
    let ProjectDir = DocPathBuf.as_ref()
        .and_then(|P| if P.is_file() { P.parent() } else { Some(P.as_path()) })
        .map(|P| P.to_path_buf())
        .or_else(|| GetTrackedDirectories().first().map(std::path::PathBuf::from))
        .unwrap_or_else(|| std::path::PathBuf::from("."));

    let DotTypstStudio = ProjectDir.join(".typst-studio");
    let HistoryDir = DotTypstStudio.join("history");
    let _ = std::fs::create_dir_all(&HistoryDir);

    let GitIgnorePath = DotTypstStudio.join(".gitignore");
    if !GitIgnorePath.exists()
    {
        let _ = std::fs::write(&GitIgnorePath, "*\n");
    }

    use sha2::{Digest, Sha256};
    let Key = DocPathBuf.map(|P| P.to_string_lossy().to_string()).unwrap_or_else(|| "main.typ".to_string());
    let mut Hasher = Sha256::new();
    Hasher.update(Key.as_bytes());
    let HashHex = format!("{:x}", Hasher.finalize());
    let ShortHash = &HashHex[..8];

    HistoryDir.join(format!("timeline_{}.jsonl", ShortHash))
}

#[tauri::command]
fn SaveTimelineSnapshot(DocPath: Option<String>, Content: String, Label: Option<String>) -> Result<Timeline_Snapshot, String>
{
    let HistoryFile = GetDocumentHistoryPath(DocPath.as_deref());

    use sha2::{Digest, Sha256};
    let mut Hasher = Sha256::new();
    Hasher.update(Content.as_bytes());
    let ContentHash = format!("{:x}", Hasher.finalize());

    if HistoryFile.exists()
        && let Ok(FileContent) = std::fs::read_to_string(&HistoryFile)
            && let Some(LastLine) = FileContent.lines().rev().find(|L| !L.trim().is_empty())
                && let Ok(Parsed) = serde_json::from_str::<serde_json::Value>(LastLine)
                    && let Some(Hash) = Parsed.get("ContentHash").and_then(|H| H.as_str())
                        && Hash == ContentHash
                            && let Ok(ExistingSnapshot) = serde_json::from_str::<Timeline_Snapshot>(LastLine)
                            {
                                return Ok(ExistingSnapshot);
                            }

    let Secs = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let FormattedTime = FormatTimestamp(Secs);

    let WordCount = Content.split_whitespace().count();
    let CharacterCount = Content.chars().count();
    let SnapshotId = format!("{}_{}", Secs, &ContentHash[..6.min(ContentHash.len())]);
    let DefaultLabel = if Label.as_deref().unwrap_or("").trim().is_empty() { "Checkpoint".to_string() } else { Label.unwrap() };

    let Snapshot = Timeline_Snapshot
    {
        Id: SnapshotId,
        Timestamp: Secs,
        FormattedTime,
        Label: DefaultLabel,
        WordCount,
        CharacterCount,
        ContentHash,
        Content,
    };

    let JsonLine = serde_json::to_string(&Snapshot).map_err(|E| E.to_string())?;
    use std::io::Write;
    let mut File = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&HistoryFile)
        .map_err(|E| format!("Failed to open history file {}: {}", HistoryFile.display(), E))?;

    writeln!(File, "{}", JsonLine).map_err(|E| format!("Failed to write snapshot: {}", E))?;

    Ok(Snapshot)
}

#[tauri::command]
fn GetTimelineSnapshots(DocPath: Option<String>) -> Result<Vec<Timeline_History_Summary>, String>
{
    let HistoryFile = GetDocumentHistoryPath(DocPath.as_deref());
    if !HistoryFile.exists()
    {
        return Ok(Vec::new());
    }

    let Content = std::fs::read_to_string(&HistoryFile)
        .map_err(|E| format!("Failed to read history file: {}", E))?;

    let mut Summaries = Vec::new();
    for Line in Content.lines()
    {
        let Trimmed = Line.trim();
        if Trimmed.is_empty()
        {
            continue;
        }

        if let Ok(Summary) = serde_json::from_str::<Timeline_History_Summary>(Trimmed)
        {
            Summaries.push(Summary);
        }
    }

    Ok(Summaries)
}

#[tauri::command]
fn GetTimelineSnapshotContent(DocPath: Option<String>, SnapshotId: String) -> Result<String, String>
{
    let HistoryFile = GetDocumentHistoryPath(DocPath.as_deref());
    if !HistoryFile.exists()
    {
        return Err("No history found for document".to_string());
    }

    let Content = std::fs::read_to_string(&HistoryFile)
        .map_err(|E| format!("Failed to read history file: {}", E))?;

    for Line in Content.lines().rev()
    {
        let Trimmed = Line.trim();
        if Trimmed.is_empty()
        {
            continue;
        }

        if let Ok(Snapshot) = serde_json::from_str::<Timeline_Snapshot>(Trimmed)
            && Snapshot.Id == SnapshotId
            {
                return Ok(Snapshot.Content);
            }
    }

    Err(format!("Snapshot {} not found", SnapshotId))
}

#[tauri::command]
fn SyncClick(Page: usize, X: f64, Y: f64) -> Result<Sync_Click_Response, String>
{
    let Guard = LAST_ACTIVE_SYNC_MAP.lock().map_err( | Error | Error.to_string())?;
    let SyncMap = & * Guard;

    let mut BestElem: Option< & serde_json::Value> = None;
    let mut MinDist = f64::INFINITY;

    for Elem in SyncMap
    {
        if Elem. get("page").and_then( | Val | Val.as_u64()).map( | Val | Val as usize) != Some(Page)
        { continue ; }

        let ElemX = Elem. get("x").and_then( | Val | Val.as_f64()).unwrap_or(0.0);
        let ElemY = Elem. get("y").and_then( | Val | Val.as_f64()).unwrap_or(0.0);
        let ElemW = Elem. get("width").and_then( | Val | Val.as_f64()).unwrap_or(0.0);
        let ElemH = Elem. get("height").and_then( | Val | Val.as_f64()).unwrap_or(0.0);

        let InX = X >= ElemX && X <= (ElemX + ElemW);
        let InY = Y >= ElemY && Y <= (ElemY + ElemH);

        if InX && InY
        { BestElem = Some(Elem); break ; }

        let CenterX = ElemX + (ElemW / 2.0);
        let CenterY = ElemY + (ElemH / 2.0);
        let Dx = X - CenterX;
        let Dy = (Y - CenterY) * 3.0;
        let DistSq = (Dx * Dx) + (Dy * Dy);

        if DistSq < MinDist
        { MinDist = DistSq; BestElem = Some(Elem); }
    }

    if let Some(Elem) = BestElem
    {
        Ok
        (
            Sync_Click_Response
            {
                Success: true,
                Found: true,
                Line: Elem. get("line").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                Column: Elem. get("col").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                EndLine: Elem. get("end_line").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                EndColumn: Elem. get("end_col").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                Start: Elem. get("start").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                End: Elem. get("end").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                Span: Elem. get("span").cloned(),
                Error: None,
            }
        )
    }
    else
    {
        Ok
        (
            Sync_Click_Response
            {
                Success: false,
                Found: false,
                Line: None,
                Column: None,
                EndLine: None,
                EndColumn: None,
                Start: None,
                End: None,
                Span: None,
                Error: Some("No matching source location found.".to_string()),
            }
        )
    }
}

#[tauri::command]
fn SyncCursor(Line: usize, Col: usize) -> Result<Sync_Cursor_Response, String>
{
    let Guard = LAST_ACTIVE_SYNC_MAP.lock().map_err( | Error | Error.to_string())?;
    let SyncMap = & * Guard;

    let mut BestElem: Option< & serde_json::Value> = None;
    let mut MinColDist = usize::MAX;

    for Elem in SyncMap
    {
        let ElemLine = Elem. get("line").and_then( | Val | Val.as_u64()).map( | Val | Val as usize).unwrap_or(0);
        let ElemEndLine = Elem. get("end_line").and_then( | Val | Val.as_u64()).map( | Val | Val as usize).unwrap_or(ElemLine);
        let ElemCol = Elem. get("col").and_then( | Val | Val.as_u64()).map( | Val | Val as usize).unwrap_or(0);
        let ElemEndCol = Elem. get("end_col").and_then( | Val | Val.as_u64()).map( | Val | Val as usize).unwrap_or(ElemCol);

        let StartsBefore = ElemLine < Line || (ElemLine == Line && ElemCol <= Col);
        let EndsAfter = ElemEndLine > Line || (ElemEndLine == Line && ElemEndCol >= Col);

        if StartsBefore && EndsAfter
        { BestElem = Some(Elem); break ; }
    }

    if BestElem.is_none()
    {
        for Elem in SyncMap
        {
            let ElemLine = Elem. get("line").and_then( | Val | Val.as_u64()).map( | Val | Val as usize).unwrap_or(0);
            if ElemLine == Line
            {
                let ElemCol = Elem. get("col").and_then( | Val | Val.as_u64()).map( | Val | Val as usize).unwrap_or(0);
                let Dist = (ElemCol as isize - Col as isize).unsigned_abs();
                if Dist < MinColDist
                { MinColDist = Dist; BestElem = Some(Elem); }
            }
        }
    }

    if let Some(Elem) = BestElem
    {
        Ok
        (
            Sync_Cursor_Response
            {
                Success: true,
                Found: true,
                Page: Elem. get("page").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                X: Elem. get("x").and_then( | Val | Val.as_f64()),
                Y: Elem. get("y").and_then( | Val | Val.as_f64()),
                Width: Elem. get("width").and_then( | Val | Val.as_f64()),
                Height: Elem. get("height").and_then( | Val | Val.as_f64()),
                Line: Elem. get("line").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                Column: Elem. get("col").and_then( | Val | Val.as_u64()).map( | Val | Val as usize),
                Error: None,
            }
        )
    }
    else
    {
        Ok
        (
            Sync_Cursor_Response
            {
                Success: false,
                Found: false,
                Page: None,
                X: None,
                Y: None,
                Width: None,
                Height: None,
                Line: None,
                Column: None,
                Error: Some("No matching element for cursor.".to_string()),
            }
        )
    }
}

#[tauri::command]
fn ResolveSpan(Span: String) -> Result<Option<serde_json::Value>, String>
{
    let Guard = LAST_ACTIVE_SYNC_MAP.lock().map_err( | Error | Error.to_string())?;
    for Elem in & * Guard
    {
        if let Some(Val) = Elem. get("span").and_then( | S | S.as_str()) && Val == Span { return Ok(Some(Elem.clone())); }
    }
    Ok(None)
}

#[tauri::command]
fn SyncSelection
(
    StartByte: usize,
    EndByte: usize,
    HasSelection: bool,
    Line: Option<usize>,
    _Col: Option<usize>,
) -> Result<Vec<Sync_Highlight_Box>, String>
{
    let Guard = LAST_ACTIVE_SYNC_MAP.lock().map_err( | Error | Error.to_string())?;
    let SyncMap = & * Guard;

    if HasSelection && StartByte < EndByte
    {
        let mut Matched = Vec::new();
        for Elem in SyncMap
        {
            let ElemStart = Elem.get("start").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(0);
            let ElemEnd = Elem.get("end").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(0);
            let Width = Elem.get("width").and_then( | V | V.as_f64()).unwrap_or(0.0);
            let X = Elem.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
            let ElemLine = Elem.get("line").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(0);
            let ElemEndLine = Elem.get("end_line").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(ElemLine);

            if Width < 50.0 && X > 450.0 && (ElemEndLine.saturating_sub(ElemLine)) >= 2
            {
                continue;
            }

            if ElemStart < EndByte && ElemEnd > StartByte
            {
                Matched.push(Elem);
            }
        }

        if Matched.is_empty()
        {
            return Ok(Vec::new());
        }

        let mut PageGroups: std::collections::BTreeMap<usize, Vec<&serde_json::Value>> = std::collections::BTreeMap::new();
        for Elem in Matched
        {
            let PageNum = Elem.get("page").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(1);
            PageGroups.entry(PageNum).or_default().push(Elem);
        }

        let mut ResultBoxes = Vec::new();

        for (PageNum, mut PageElements) in PageGroups
        {
            PageElements.sort_by
            (
                | A, B |
                {
                    let Ay = A.get("y").and_then( | V | V.as_f64()).unwrap_or(0.0);
                    let Ah = A.get("height").and_then( | V | V.as_f64()).unwrap_or(0.0);
                    let By = B.get("y").and_then( | V | V.as_f64()).unwrap_or(0.0);
                    let Bh = B.get("height").and_then( | V | V.as_f64()).unwrap_or(0.0);
                    let Ax = A.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
                    let Bx = B.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);

                    let CenterA = Ay + (Ah / 2.0);
                    let CenterB = By + (Bh / 2.0);

                    CenterA.partial_cmp(&CenterB).unwrap_or(std::cmp::Ordering::Equal)
                        .then_with( || Ax.partial_cmp(&Bx).unwrap_or(std::cmp::Ordering::Equal))
                }
            );

            struct Line_Cluster<'a>
            {
                CenterY: f64,
                Elements: Vec<&'a serde_json::Value>,
            }

            let mut Clusters: Vec<Line_Cluster> = Vec::new();

            for Elem in PageElements
            {
                let Ey = Elem.get("y").and_then( | V | V.as_f64()).unwrap_or(0.0);
                let Eh = Elem.get("height").and_then( | V | V.as_f64()).unwrap_or(10.5);
                let CenterY = Ey + (Eh / 2.0);

                if let Some(Cluster) = Clusters.iter_mut().find( | C | (C.CenterY - CenterY).abs() < 4.5)
                {
                    Cluster.Elements.push(Elem);
                    let SumY: f64 = Cluster.Elements.iter().map
                    (
                        | E |
                        {
                            let Y = E.get("y").and_then( | V | V.as_f64()).unwrap_or(0.0);
                            let H = E.get("height").and_then( | V | V.as_f64()).unwrap_or(10.5);
                            Y + (H / 2.0)
                        }
                    ).sum();
                    Cluster.CenterY = SumY / Cluster.Elements.len() as f64;
                }
                else
                {
                    Clusters.push
                    (
                        Line_Cluster
                        {
                            CenterY,
                            Elements: vec![Elem],
                        }
                    );
                }
            }

            for Cluster in Clusters
            {
                let mut SortedElems = Cluster.Elements;
                SortedElems.sort_by
                (
                    | A, B |
                    {
                        let Ax = A.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        let Bx = B.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        Ax.partial_cmp(&Bx).unwrap_or(std::cmp::Ordering::Equal)
                    }
                );

                let mut Segments: Vec<Vec<&serde_json::Value>> = Vec::new();
                for Elem in SortedElems
                {
                    let Ex = Elem.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
                    let SpanStr = Elem.get("span").and_then( | V | V.as_str()).unwrap_or("");
                    let LineNum = Elem.get("line").and_then( | V | V.as_u64()).unwrap_or(0);

                    let ShouldSplit = if let Some(LastSeg) = Segments.last()
                    {
                        let Prev = LastSeg.last().unwrap();
                        let Px = Prev.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        let Pw = Prev.get("width").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        let PrevSpan = Prev.get("span").and_then( | V | V.as_str()).unwrap_or("");
                        let PrevLine = Prev.get("line").and_then( | V | V.as_u64()).unwrap_or(0);

                        let Gap = Ex - (Px + Pw);
                        let DiffCall = (SpanStr.starts_with("call_box_") || PrevSpan.starts_with("call_box_")) && SpanStr != PrevSpan;
                        let DiffLine = LineNum != PrevLine && Gap > 4.5;
                        Gap > 5.5 || DiffCall || DiffLine
                    }
                    else
                    {
                        false
                    };

                    if ShouldSplit || Segments.is_empty()
                    {
                        Segments.push(vec![Elem]);
                    }
                    else
                    {
                        Segments.last_mut().unwrap().push(Elem);
                    }
                }

                for Seg in Segments
                {
                    let mut MinX = f64::INFINITY;
                    let mut MaxX = f64::NEG_INFINITY;
                    let mut MinY = f64::INFINITY;
                    let mut MaxY = f64::NEG_INFINITY;
                    let mut MinH = f64::INFINITY;
                    let mut MaxH = 0.0f64;

                    for E in Seg
                    {
                        let Ex = E.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        let Ey = E.get("y").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        let Ew = E.get("width").and_then( | V | V.as_f64()).unwrap_or(0.0);
                        let Eh = E.get("height").and_then( | V | V.as_f64()).unwrap_or(10.5);

                        MinX = MinX.min(Ex);
                        MaxX = MaxX.max(Ex + Ew);
                        MinY = MinY.min(Ey);
                        MaxY = MaxY.max(Ey + Eh);
                        MinH = MinH.min(Eh);
                        MaxH = MaxH.max(Eh);
                    }

                    if MinX.is_finite() && MaxX.is_finite() && MaxX > MinX
                    {
                        ResultBoxes.push
                        (
                            Sync_Highlight_Box
                            {
                                Page: PageNum,
                                X: MinX,
                                Y: MinY,
                                Width: (MaxX - MinX).max(2.0),
                                Height: (MaxY - MinY).max(2.0),
                                FirstLineHeight: if MinH.is_finite() { MinH } else { 10.5 },
                                LastLineHeight: if MaxH > 0.0 { MaxH } else { 10.5 },
                            }
                        );
                    }
                }
            }
        }

        return Ok(ResultBoxes);
    }

    let TargetLine = Line.unwrap_or(0);
    if TargetLine == 0
    {
        return Ok(Vec::new());
    }

    let mut LineElements = Vec::new();
    for Elem in SyncMap
    {
        let ElemLine = Elem.get("line").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(0);
        let ElemEndLine = Elem.get("end_line").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(ElemLine);
        if TargetLine >= ElemLine && TargetLine <= ElemEndLine
        {
            LineElements.push(Elem);
        }
    }

    if LineElements.is_empty()
    {
        return Ok(Vec::new());
    }

    let mut PageGroups: std::collections::BTreeMap<usize, Vec<&serde_json::Value>> = std::collections::BTreeMap::new();
    for Elem in LineElements
    {
        let PageNum = Elem.get("page").and_then( | V | V.as_u64()).map( | V | V as usize).unwrap_or(1);
        PageGroups.entry(PageNum).or_default().push(Elem);
    }

    let mut ResultBoxes = Vec::new();
    for (PageNum, PageElems) in PageGroups
    {
        let mut MinX = f64::INFINITY;
        let mut MaxX = f64::NEG_INFINITY;
        let mut MinY = f64::INFINITY;
        let mut MaxY = f64::NEG_INFINITY;
        let mut MinH = f64::INFINITY;
        let mut MaxH = 0.0f64;

        for E in PageElems
        {
            let Ex = E.get("x").and_then( | V | V.as_f64()).unwrap_or(0.0);
            let Ey = E.get("y").and_then( | V | V.as_f64()).unwrap_or(0.0);
            let Ew = E.get("width").and_then( | V | V.as_f64()).unwrap_or(0.0);
            let Eh = E.get("height").and_then( | V | V.as_f64()).unwrap_or(10.5);

            MinX = MinX.min(Ex);
            MaxX = MaxX.max(Ex + Ew);
            MinY = MinY.min(Ey);
            MaxY = MaxY.max(Ey + Eh);
            MinH = MinH.min(Eh);
            MaxH = MaxH.max(Eh);
        }

        if MinX.is_finite() && MaxX.is_finite() && MaxX > MinX
        {
            ResultBoxes.push
            (
                Sync_Highlight_Box
                {
                    Page: PageNum,
                    X: MinX,
                    Y: MinY,
                    Width: (MaxX - MinX).max(2.0),
                    Height: (MaxY - MinY).max(2.0),
                    FirstLineHeight: if MinH.is_finite() { MinH } else { 10.5 },
                    LastLineHeight: if MaxH > 0.0 { MaxH } else { 10.5 },
                }
            );
        }
    }

    Ok(ResultBoxes)
}

#[tauri::command]
async fn GetAvailableFonts() -> Result<Available_Fonts_Response, String>
{
    tauri::async_runtime::spawn_blocking
    (
        move ||
        {
            GetAvailableFontsSync()
        }
    )
    .await
    .map_err( | Error | format ! ("Font query task join error: {}", Error))?
}

fn GetAvailableFontsSync() -> Result<Available_Fonts_Response, String>
{
    let TypstBin = FindTypstBinary();
    let mut Command = CreateCommand( & TypstBin);
    Command.args(["fonts", "--variants"]);
    for FontDir in GetFontDirectories()
    {
        Command.arg("--font-path").arg(FontDir);
    }
    let Output = Command.output().map_err( | Error | format ! ("Failed to query fonts: {}", Error))?;
    let Stdout = String::from_utf8_lossy( & Output.stdout);

    let mut FontSet = std::collections::BTreeSet:: new ();
    let mut FontDetails = Vec:: new ();
    let mut CurrentFamily = String:: new ();

    for Line in Stdout.lines()
    {
        let Trimmed = Line.trim();
        if Trimmed.is_empty()
        { continue ; }

        if ! Line.starts_with(' ') && ! Line.starts_with('\t') && ! Line.starts_with('│') && ! Line.starts_with('├') && ! Line.starts_with('└')
        {
            CurrentFamily = Trimmed.to_string();
            FontSet.insert(CurrentFamily.clone());
            continue;
        }

        if Line.contains('├') || Line.contains('└')
        {
            let Clean = Line.trim_start_matches( [' ', '│', '├', '└', '─']).trim();
            if ! Clean.is_empty()
            {
                let FilePart = Clean.split('(').next().unwrap_or(Clean).trim();
                let Name = std::path::Path:: new (FilePart)
               .file_stem()
               .map( | Stem | Stem.to_string_lossy().to_string())
               .unwrap_or_else( || Clean.to_string());

                FontDetails.push
                (
                    Font_Detail
                    {
                        Name: Name.clone(),
                        Family: if CurrentFamily.is_empty() { Name } else { CurrentFamily.clone() },
                        Weight: "400".to_string(),
                        Style: "normal".to_string(),
                        Stretch: "normal".to_string(),
                        FilePath: FilePart.to_string(),
                    }
                );
            }
        }
    }

    for SearchDir in & ["assets/fonts", "public/fonts", "TypstStudio/public/fonts"]
    {
        let DirPath = std::path::Path:: new (SearchDir);
        if DirPath.exists() && DirPath.is_dir()
            && let Ok(Entries) = std::fs::read_dir(DirPath)
            {
                for Entry in Entries.flatten()
                {
                    let Path = Entry.path();
                    let ExtMatches = Path.extension()
                        .and_then(|E| E.to_str())
                        .is_some_and(|Ext| Ext.eq_ignore_ascii_case("ttf") || Ext.eq_ignore_ascii_case("otf") || Ext.eq_ignore_ascii_case("ttc"));

                    if let (true, Some(Stem)) = (ExtMatches, Path.file_stem().and_then(|S| S.to_str()))
                    {
                        FontSet.insert(Stem.to_string());
                        FontDetails.push
                        (
                            Font_Detail
                            {
                                Name: Stem.to_string(),
                                Family: Stem.to_string(),
                                Weight: "400".to_string(),
                                Style: "normal".to_string(),
                                Stretch: "normal".to_string(),
                                FilePath: Path.to_string_lossy().to_string(),
                            }
                        );
                    }
                }
            }
    }

    Ok(Available_Fonts_Response { Success: true, Fonts: FontSet.into_iter().collect(), FontDetails, })
}

#[tauri::command]
fn GetSystemStatus() -> Result<System_Status_Response, String>
{
    let TypstBin = FindTypstBinary();
    let VersionOutput = CreateCommand( & TypstBin)
   .arg("--version")
   .output()
   .map( | Out | String::from_utf8_lossy( & Out.stdout).trim().to_string())
   .unwrap_or_else( | _ | "typst unknown".to_string());

    let Uptime = APP_START_TIME.elapsed().as_secs();

    Ok
    (
        System_Status_Response
        {
            Success: true,
            TypstVersion: VersionOutput,
            TypstBinary: TypstBin.to_string_lossy().to_string(),
            Platform: std::env::consts::OS.to_string(),
            UptimeSecs: Uptime,
        }
    )
}

const PINNED_LAFS_SHA256: &str = "91faa0ece4e1278ebf2cc58a776de0290e10d31f0d59456410862b52c86067fc";

fn VerifyLafsBinaryIntegrity(Path: &std::path::Path) -> bool
{
    if !Path.exists() || !Path.is_file()
    {
        return false;
    }
    if let Ok(Bytes) = std::fs::read(Path)
    {
        use sha2::{Digest, Sha256};
        let mut Hasher = Sha256::new();
        Hasher.update(&Bytes);
        let Digest = format!("{:x}", Hasher.finalize());
        return Digest.eq_ignore_ascii_case(PINNED_LAFS_SHA256);
    }
    false
}

fn ResolveLafsBinary() -> Option<std::path::PathBuf>
{
    let BinName = if cfg!(windows) { "lafs.exe" } else { "lafs" };
    if let Ok(CurrentExe) = std::env::current_exe()
        && let Some(Parent) = CurrentExe.parent()
        {
            let Candidate = Parent.join("bin").join(BinName);
            if VerifyLafsBinaryIntegrity(&Candidate)
            {
                return Some(Candidate);
            }
            let CandidateDirect = Parent.join(BinName);
            if VerifyLafsBinaryIntegrity(&CandidateDirect)
            {
                return Some(CandidateDirect);
            }
        }
    let Fallback = std::path::PathBuf::from("bin").join(BinName);
    if VerifyLafsBinaryIntegrity(&Fallback)
    {
        return Some(Fallback);
    }
    let DirectFallback = std::path::PathBuf::from(BinName);
    if VerifyLafsBinaryIntegrity(&DirectFallback)
    {
        return Some(DirectFallback);
    }
    None
}

fn InProcessLafsFormatSnippet(Code: &str) -> String
{
    let mut Output = Vec::new();
    for Line in Code.lines()
    {
        let Trimmed = Line.trim();
        if Trimmed.ends_with('{') && !Trimmed.starts_with('{')
        {
            let Prefix = Trimmed[..Trimmed.len() - 1].trim_end();
            if !Prefix.chars().all(|C| C == '(' || C == '[' || C == '{') && !Prefix.contains("//")
            {
                let Backticks = Prefix.chars().filter(|&C| C == '`').count();
                let Quotes = Prefix.chars().filter(|&C| C == '"').count();
                if Backticks % 2 == 0 && Quotes % 2 == 0
                {
                    let Indent = Line.chars().take_while(|C| C.is_whitespace()).collect::<String>();
                    Output.push(format!("{}{}", Indent, Prefix));
                    Output.push(format!("{}{{", Indent));
                    continue;
                }
            }
        }
        Output.push(Line.to_string());
    }
    Output.join("\n")
}

fn FormatSnippetWithVerifiedLafs(Code: &str, Lang: &str) -> String
{
    let CleanLang = Lang.trim().to_lowercase();
    let Supported = ["c", "cpp", "csharp", "cs", "js", "ts", "jsx", "tsx", "sh", "bash", "kt", "kotlin", "dart", "rust", "rs"];
    if !Supported.contains(&CleanLang.as_str())
    {
        return InProcessLafsFormatSnippet(Code);
    }
    let TargetLang = match CleanLang.as_str()
    {
        "cs" => "csharp",
        "bash" => "sh",
        "kotlin" => "kt",
        "rs" => "rust",
        Other => Other,
    };

    if let Some(BinPath) = ResolveLafsBinary()
    {
        let mut Cmd = CreateCommand(&BinPath);
        Cmd.args(["-l", TargetLang, "-c", "160", "-"]);
        Cmd.stdin(std::process::Stdio::piped());
        Cmd.stdout(std::process::Stdio::piped());
        Cmd.stderr(std::process::Stdio::piped());

        if let Ok(mut Child) = Cmd.spawn()
        {
            if let Some(mut Stdin) = Child.stdin.take()
            {
                use std::io::Write;
                let _ = Stdin.write_all(Code.as_bytes());
            }

            let Timeout = std::time::Duration::from_secs(5);
            let Start = std::time::Instant::now();
            loop
            {
                match Child.try_wait()
                {
                    Ok(Some(Status)) =>
                    {
                        if Status.success()
                            && let Some(mut Stdout) = Child.stdout.take()
                            {
                                use std::io::Read;
                                let mut OutStr = String::new();
                                if Stdout.read_to_string(&mut OutStr).is_ok() && !OutStr.is_empty()
                                {
                                    return OutStr.trim_end().to_string();
                                }
                            }
                        break;
                    }
                    Ok(None) =>
                    {
                        if Start.elapsed() > Timeout
                        {
                            let _ = Child.kill();
                            break;
                        }
                        std::thread::sleep(std::time::Duration::from_millis(10));
                    }
                    Err(_) => break,
                }
            }
        }
    }

    InProcessLafsFormatSnippet(Code)
}

#[tauri::command]
fn FormatTypst(Source: String) -> Result<Format_Typst_Response, String>
{
    let Lines: Vec<&str> = Source.lines().collect();
    let mut ResultLines = Vec::new();
    let mut InRaw = false;
    let mut CurrentRawLang = String::new();
    let mut CurrentRawLines: Vec<String> = Vec::new();

    for Line in Lines
    {
        let Trimmed = Line.trim();
        if Trimmed.starts_with("```")
        {
            if !InRaw
            {
                InRaw = true;
                CurrentRawLang = Trimmed.trim_start_matches('`').trim().to_string();
                CurrentRawLines.clear();
                ResultLines.push(Line.to_string());
            }
            else
            {
                InRaw = false;
                let RawCode = CurrentRawLines.join("\n");
                if !RawCode.trim().is_empty()
                {
                    let Formatted = FormatSnippetWithVerifiedLafs(&RawCode, &CurrentRawLang);
                    ResultLines.push(Formatted);
                }
                else
                {
                    ResultLines.append(&mut CurrentRawLines);
                }
                ResultLines.push(Line.to_string());
            }
            continue;
        }

        if InRaw
        {
            CurrentRawLines.push(Line.to_string());
            continue;
        }

        ResultLines.push(Line.to_string());
    }

    Ok(Format_Typst_Response { Success: true, Formatted: ResultLines.join("\n"), HasError: false, Error: None, })
}

#[tauri::command]
fn ToggleFullscreen(App: tauri::AppHandle) -> Result<bool, String>
{
    if let Some(Window) = App.get_webview_window("main")
    {
        let Current = Window.is_fullscreen().map_err( | Error | Error.to_string())?;
        Window.set_fullscreen( ! Current).map_err( | Error | Error.to_string())?;
        Ok( ! Current)
    }
    else
    {
        Err("Main window not found".to_string())
    }
}

#[tauri::command]
fn SetFullscreen(App: tauri::AppHandle, Fullscreen: bool) -> Result<bool, String>
{
    if let Some(Window) = App.get_webview_window("main")
    {
        Window.set_fullscreen(Fullscreen).map_err(|Error| Error.to_string())?;
        Ok(Fullscreen)
    }
    else
    {
        Err("Main window not found".to_string())
    }
}

#[tauri::command]
fn ToggleDevTools(App: tauri::AppHandle) -> Result<bool, String>
{
    #[cfg(any(debug_assertions, feature = "devtools"))]
    {
        if let Some(Window) = App.get_webview_window("main")
        {
            if Window.is_devtools_open()
            {
                Window.close_devtools();
                Ok(false)
            }
            else
            {
                Window.open_devtools();
                Ok(true)
            }
        }
        else
        {
            Err("Main window not found".to_string())
        }
    }
    #[cfg(not(any(debug_assertions, feature = "devtools")))]
    {
        let _ = App;
        Ok(false)
    }
}

#[tauri::command]
fn OpenExternalUrl(App: tauri::AppHandle, Url: String) -> Result<(), String>
{
    let ValidUrl = ValidateExternalUrl(&Url)?;
    App.opener().open_url(&ValidUrl, None::<&str>).map_err(|E| E.to_string())
}

#[tauri::command]
fn EnforceContainerPhysics(Request: container_physics::Container_Action_Request) -> Result<container_physics::Container_Action_Response, String>
{
    Ok(container_physics::ProcessContainerAction(Request))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run()
{
    let builder = tauri::Builder::default();
    #[cfg(debug_assertions)]
    let builder = builder.plugin(tauri_plugin_mcp_bridge::init());

    builder
       .plugin(tauri_plugin_dialog::init())
       .plugin(tauri_plugin_opener::init())
       .plugin(tauri_plugin_fs::init())
       .plugin(tauri_plugin_shell::init())
   .invoke_handler
    (
        tauri::generate_handler!
        [
            CompileTypst,
            ExportPdf,
            ExportPng,
            ExportSvg,
            PickFolder,
            ReadWorkspaceFile,
            SaveWorkspaceFile,
            ListWorkspaceFiles,
            GetWorkspaceInfo,
            CreateWorkspaceFile,
            DeleteWorkspaceFile,
            RenameWorkspaceFile,
            AddWorkspaceDirectory,
            RemoveWorkspaceDirectory,
            UploadAsset,
            GetAvailableFonts,
            GetSystemStatus,
            SyncClick,
            SyncCursor,
            ResolveSpan,
            SyncSelection,
            FormatTypst,
            EnforceContainerPhysics,
            ToggleFullscreen,
            SetFullscreen,
            ToggleDevTools,
            OpenExternalUrl,
            PasteClipboardImage,
            SavePastedFileAsset,
            SaveTimelineSnapshot,
            GetTimelineSnapshots,
            GetTimelineSnapshotContent
        ]
    )
   .setup
    (
        | app |
        {
            if cfg!(debug_assertions)
            {
                app.handle().plugin(tauri_plugin_log::Builder::default().level(log::LevelFilter::Info).build())?;
            }
            Ok(())
        }
    )
   .run(tauri::generate_context!())
   .expect("error while building tauri application");
}

#[cfg(test)]
mod tests
{
    use super:: * ;

   #[test]
    fn TestCompileTypst()
    {
        let Source = "= Hello Typst\nTesting Tauri command.".to_string();
        let Resp = CompileTypstSync(Source, None).expect("CompileTypst should succeed");
        assert!(Resp.success);
        assert_eq!(Resp.page_count, 1);
        assert!( ! Resp.pages.is_empty());
    }

   #[test]
    fn TestExportPdf()
    {
        let Source = "= Test Document\nTesting PDF export.".to_string();
        let PdfData = ExportPdfSync(Source, None, None, None).expect("ExportPdf should succeed");
        assert!( ! PdfData.is_empty());
        assert!(PdfData.starts_with(b"%PDF"));
    }

   #[test]
    fn TestDarkColorConversion()
    {
        assert_eq!(InvertShapeColorHex("FAFAFA"), "222222");
        assert_eq!(InvertShapeColorHex("FFFFFF"), "181818");
        assert_eq!(InvertShapeColorHex("E4E9F0"), "42474E");
        assert_eq!(InvertShapeColorHex("F1F3F6"), "303235");
        assert_eq!(InvertGlyphColorHex("000000"), "FFFFFF");
        assert_eq!(InvertGlyphColorHex("FFFFFF"), "FFFFFF");
        assert_eq!(InvertGlyphColorHex("16A34A"), "16A34A");
    }

   #[test]
    fn TestGetSystemStatus()
    {
        let Status = GetSystemStatus().expect("GetSystemStatus should succeed");
        assert!(Status.Success);
        assert!( ! Status.TypstVersion.is_empty());
    }

   #[test]
    fn TestFormatTypst()
    {
        let Formatted = FormatTypst("= Title\n".to_string()).expect("FormatTypst should succeed");
        assert!(Formatted.Success);
    }

   #[test]
    fn TestFormatTypstRawCodeBlock()
    {
        let Source = "#rect[\n```rust\nfn test() {\nlet x = 1;\nreturn x;\n}\n```\n]".to_string();
        let Formatted = FormatTypst(Source).expect("FormatTypst should succeed");
        assert!(Formatted.Success);
        assert!(!Formatted.Formatted.contains("fn test() {"));
    }

   #[test]
    fn TestExportPngZip()
    {
        let Source = "= Page 1\n#pagebreak()\n= Page 2".to_string();
        let ZipData = ExportPngSync(Source, None, "test_doc".to_string(), false, false).expect("ExportPng should succeed");
        assert!( ! ZipData.is_empty());
        let Reader = std::io::Cursor:: new (ZipData);
        let mut Archive = zip::ZipArchive:: new (Reader).expect("Valid ZIP archive");
        assert_eq!(Archive.len(), 2);
        assert_eq!(Archive.by_index(0).unwrap().name().unwrap(), "test_doc_page_1.png");
        assert_eq!(Archive.by_index(1).unwrap().name().unwrap(), "test_doc_page_2.png");
    }

   #[test]
    fn TestExportSvgZip()
    {
        let Source = "= Vector Page 1\n#pagebreak()\n= Vector Page 2".to_string();
        let ZipData = ExportSvgSync(Source, None, "vector_doc".to_string(), true, true).expect("ExportSvg should succeed");
        assert!( ! ZipData.is_empty());
        let Reader = std::io::Cursor:: new (ZipData);
        let mut Archive = zip::ZipArchive:: new (Reader).expect("Valid ZIP archive");
        assert_eq!(Archive.len(), 2);
        assert_eq!(Archive.by_index(0).unwrap().name().unwrap(), "vector_doc_page_1.svg");
        assert_eq!(Archive.by_index(1).unwrap().name().unwrap(), "vector_doc_page_2.svg");
    }

   #[test]
    fn TestWorkspaceFileOperations()
    {
        let OriginalDirs = GetTrackedDirectories();
        let TempDir = std::env::temp_dir().join(format!("test_ws_{}", std::process::id()));
        let _ = std::fs::create_dir_all(&TempDir);
        let CanonicalTempDir = CanonicalizeOrResolve(&TempDir);
        let TempDirStr = CanonicalTempDir.to_string_lossy().to_string();

        let _ = AddWorkspaceDirectory(TempDirStr.clone());

        let CreatedPath = CreateWorkspaceFile
        (Some(TempDirStr.clone()), "MyTestDoc.typ".to_string(), Some("= Test Content".to_string()),)
       .expect("CreateWorkspaceFile should succeed");

        assert!(std::path::Path::new(&CreatedPath).exists());

        let ReadContent = ReadWorkspaceFile(CreatedPath.clone()).expect("ReadWorkspaceFile should succeed");
        assert_eq!(ReadContent, "= Test Content");

        SaveWorkspaceFile(CreatedPath.clone(), "= Updated Content".to_string()).expect("SaveWorkspaceFile should succeed");
        let UpdatedContent = ReadWorkspaceFile(CreatedPath.clone()).expect("ReadWorkspaceFile should succeed");
        assert_eq!(UpdatedContent, "= Updated Content");

        DeleteWorkspaceFile(CreatedPath.clone()).expect("DeleteWorkspaceFile should succeed");
        assert!(!std::path::Path::new(&CreatedPath).exists());

        let _ = SaveTrackedDirectories(&OriginalDirs);
        let _ = std::fs::remove_dir_all(&TempDir);
    }

   #[test]
    fn TestGetWorkspaceInfo()
    {
        let Info = GetWorkspaceInfo().expect("GetWorkspaceInfo should succeed");
        assert!(Info.Success);
        assert!( ! Info.Directories.is_empty());
    }

   #[test]
    fn TestFormatTimestamp()
    {
        let Epoch = FormatTimestamp(0);
        assert_eq!(Epoch, "19700101-000000");

        let Ts = 1700000000;
        let Formatted = FormatTimestamp(Ts);
        assert_eq!(Formatted.len(), 15);
        assert!(Formatted.contains('-'));
    }

   #[test]
    fn TestResolveAssetsDirectory()
    {
        let DocFile = "E:/Typst/Books/Novel.typ";
        let Assets = ResolveAssetsDirectory(Some(DocFile));
        assert!(Assets.ends_with("assets"));
    }

   #[test]
    fn TestSavePastedFileAssetAndDeduplication()
    {
        let OriginalDirs = GetTrackedDirectories();
        let Nanos = std::time::SystemTime::now().duration_since(std::time::UNIX_EPOCH).unwrap().as_nanos();
        let TempDir = std::env::temp_dir().join(format!("typst_paste_test_{}_{}", std::process::id(), Nanos));
        let _ = std::fs::remove_dir_all(&TempDir);
        let _ = std::fs::create_dir_all(&TempDir);
        let CanonicalTempDir = CanonicalizeOrResolve(&TempDir);
        let TempDirStr = CanonicalTempDir.to_string_lossy().to_string();
        let _ = AddWorkspaceDirectory(TempDirStr.clone());
        let TempDoc = CanonicalTempDir.join("TestDoc.typ");
        let _ = std::fs::write(&TempDoc, "= Test");

        // Small 1x1 transparent PNG in base64
        let SamplePngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==".to_string();

        let Res1 = SavePastedFileAsset(Some(TempDoc.to_string_lossy().to_string()), Some("test.png".to_string()), SamplePngBase64.clone())
            .expect("First paste should succeed");

        assert!(Res1.Success);
        assert!(!Res1.IsDuplicate);
        assert!(Res1.RelativePath.starts_with("assets/"));
        assert!(TempDir.join(&Res1.RelativePath).exists());

        // Second paste with identical data must deduplicate
        let Res2 = SavePastedFileAsset(Some(TempDoc.to_string_lossy().to_string()), Some("test.png".to_string()), SamplePngBase64)
            .expect("Second paste should succeed");

        assert!(Res2.Success);
        assert!(Res2.IsDuplicate);
        assert_eq!(Res1.RelativePath, Res2.RelativePath);
        assert_eq!(Res1.FileName, Res2.FileName);

        let _ = SaveTrackedDirectories(&OriginalDirs);
        let _ = std::fs::remove_dir_all(&TempDir);
    }

   #[test]
    fn TestTimelineSnapshotsAndRestoration()
    {
        let TempDir = std::env::temp_dir().join(format!("typst_timeline_test_{}", std::process::id()));
        let _ = std::fs::create_dir_all(&TempDir);
        let TempDoc = TempDir.join("Book.typ");
        let DocPathStr = TempDoc.to_string_lossy().to_string();

        let Snap1 = SaveTimelineSnapshot(Some(DocPathStr.clone()), "= Chapter 1\nIn the beginning...".to_string(), Some("Draft 1".to_string()))
            .expect("First snapshot should save");
        assert_eq!(Snap1.WordCount, 6);

        // Duplicate content should return existing snapshot without creating new entry
        let Snap1Dup = SaveTimelineSnapshot(Some(DocPathStr.clone()), "= Chapter 1\nIn the beginning...".to_string(), Some("Draft 1".to_string()))
            .expect("Duplicate snapshot should return existing");
        assert_eq!(Snap1.Id, Snap1Dup.Id);

        let Snap2 = SaveTimelineSnapshot(Some(DocPathStr.clone()), "= Chapter 1\nIn the beginning...\n= Chapter 2\nNext phase.".to_string(), Some("Draft 2".to_string()))
            .expect("Second snapshot should save");
        assert_eq!(Snap2.WordCount, 11);

        let List = GetTimelineSnapshots(Some(DocPathStr.clone())).expect("Get snapshots should succeed");
        assert_eq!(List.len(), 2);
        assert_eq!(List[0].Id, Snap1.Id);
        assert_eq!(List[1].Id, Snap2.Id);

        let Content1 = GetTimelineSnapshotContent(Some(DocPathStr.clone()), Snap1.Id.clone())
            .expect("Get content should succeed");
        assert_eq!(Content1, "= Chapter 1\nIn the beginning...");

        let _ = std::fs::remove_dir_all(&TempDir);
    }

    #[test]
    fn TestPathTraversalAndWorkspaceContainment()
    {
        // 1. Attempting to access an arbitrary system path outside workspace must fail
        let OutsidePath = if cfg!(windows) { r"C:\Windows\System32\cmd.exe" } else { "/etc/passwd" };
        let Result = ValidateWorkspacePath(OutsidePath, false, false);
        assert!(Result.is_err(), "Outside system path must be rejected");
        assert!(Result.unwrap_err().contains("Access denied"));

        // 2. Relative traversal attempting to escape workspace must fail
        let TraversalPath = r"e:\Typst\projects\..\..\Windows\System32\cmd.exe";
        let Result2 = ValidateWorkspacePath(TraversalPath, false, false);
        assert!(Result2.is_err(), "Relative traversal escaping workspace must be rejected");

        // 3. Prohibited null bytes must fail
        let NullByte = "e:\\Typst\\projects\\doc\0.typ";
        let Result3 = ValidateWorkspacePath(NullByte, false, false);
        assert!(Result3.is_err(), "Null byte path must be rejected");
    }

    #[test]
    fn TestForbiddenExtensionsAndProtectedFiles()
    {
        let Tracked = GetTrackedDirectories();
        let Root = Tracked.first().cloned().unwrap_or_else(|| r"e:\Typst\projects".to_string());

        // 1. Forbidden executable extensions (.bat, .exe, .ps1, .sh) must fail
        for Ext in &[".exe", ".bat", ".ps1", ".cmd", ".vbs", ".sh"]
        {
            let Malicious = format!("{}\\{}exploit{}", Root, std::path::MAIN_SEPARATOR, Ext);
            let Res = ValidateWorkspacePath(&Malicious, false, true);
            assert!(Res.is_err(), "Executable extension {} must be rejected", Ext);
            assert!(Res.unwrap_err().contains("strictly forbidden"));
        }

        // 2. Protected system configuration files must fail
        for Protected in &[".workspace_config.json", ".env", "server.js", "package.json"]
        {
            let Target = format!("{}\\{}{}", Root, std::path::MAIN_SEPARATOR, Protected);
            let Res = ValidateWorkspacePath(&Target, false, false);
            assert!(Res.is_err(), "Protected system file {} must be rejected", Protected);
            assert!(Res.unwrap_err().contains("protected system configuration file"));
        }
    }

    #[test]
    fn TestExternalUrlValidationSecurity()
    {
        // Safe URLs must pass
        assert!(ValidateExternalUrl("https://typst.app").is_ok());
        assert!(ValidateExternalUrl("http://127.0.0.1:3000/docs").is_ok());
        assert!(ValidateExternalUrl("mailto:author@example.com").is_ok());

        // Dangerous URI schemes must be rejected
        assert!(ValidateExternalUrl("file:///C:/Windows/System32/cmd.exe").is_err());
        assert!(ValidateExternalUrl("calc.exe").is_err());
        assert!(ValidateExternalUrl("javascript:alert(1)").is_err());
        assert!(ValidateExternalUrl("data:text/html,<script>alert(1)</script>").is_err());
        assert!(ValidateExternalUrl("powershell -ExecutionPolicy Bypass").is_err());
        assert!(ValidateExternalUrl("ms-msdt:/id PCWDiagnostic").is_err());

        // Embedded credentials must be rejected
        assert!(ValidateExternalUrl("https://user:password@evil.com").is_err());
    }

    #[test]
    fn TestSyncSelectionPrecision()
    {
        let MockSyncMap = vec![
            serde_json::json!({
                "page": 1,
                "x": 100.0,
                "y": 200.0,
                "width": 10.0,
                "height": 12.0,
                "line": 204,
                "col": 1,
                "end_line": 204,
                "end_col": 2,
                "start": 5000,
                "end": 5001,
                "span": "1a2b"
            }),
            serde_json::json!({
                "page": 1,
                "x": 110.0,
                "y": 200.0,
                "width": 10.0,
                "height": 12.0,
                "line": 204,
                "col": 2,
                "end_line": 204,
                "end_col": 3,
                "start": 5001,
                "end": 5002,
                "span": "1a2b"
            }),
            serde_json::json!({
                "page": 1,
                "x": 100.0,
                "y": 216.0,
                "width": 15.0,
                "height": 12.0,
                "line": 205,
                "col": 1,
                "end_line": 205,
                "end_col": 3,
                "start": 5010,
                "end": 5012,
                "span": "1a2b"
            }),
        ];

        if let Ok(mut Guard) = LAST_ACTIVE_SYNC_MAP.lock()
        {
            *Guard = MockSyncMap;
        }

        // Test 1: Selecting only the first character (5000..5001)
        let Res1 = SyncSelection(5000, 5001, true, None, None).expect("SyncSelection must succeed");
        assert_eq!(Res1.len(), 1);
        assert_eq!(Res1[0].Page, 1);
        assert!((Res1[0].X - 100.0).abs() < 0.01);
        assert!((Res1[0].Width - 10.0).abs() < 0.01);

        // Test 2: Multi-line selection (5000..5012)
        let Res2 = SyncSelection(5000, 5012, true, None, None).expect("Multi-line selection must succeed");
        // Must produce 2 separate lines, NOT a merged box!
        assert_eq!(Res2.len(), 2);
        assert!((Res2[0].Y - 200.0).abs() < 0.01);
        assert!((Res2[1].Y - 216.0).abs() < 0.01);
    }
}

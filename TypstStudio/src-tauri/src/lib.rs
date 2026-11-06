#![allow(non_camel_case_types, non_snake_case)]
use std::io::Write;

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
{
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
}

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
{
    #[serde(rename = "Directories")]
    pub Directories: Vec<String>,
}

fn FindTypstBinary() -> std::path::PathBuf
{
    if let Ok(ExePath) = std::env::current_exe()
    {
        if let Some(ExeDir) = ExePath.parent()
        {
            let Candidate1 = ExeDir.join("bin").join("typst.exe");
            if Candidate1.exists()
            {
                return Candidate1;
            }
            let CandidateRes = ExeDir.join("resources").join("bin").join("typst.exe");
            if CandidateRes.exists()
            {
                return CandidateRes;
            }
            let CandidateRes2 = ExeDir.join("resources").join("typst.exe");
            if CandidateRes2.exists()
            {
                return CandidateRes2;
            }
            let Candidate2 = ExeDir.join("typst.exe");
            if Candidate2.exists()
            {
                return Candidate2;
            }
            let DevCandidate = ExeDir.join("../../../bin/typst.exe");
            if DevCandidate.exists()
            {
                return DevCandidate;
            }
        }
    }

    for Rel in &["bin/typst.exe", "../bin/typst.exe", "TypstStudio/bin/typst.exe"]
    {
        let Cand = std::path::PathBuf::from(Rel);
        if Cand.exists()
        {
            return Cand;
        }
    }

    let Fixed = std::path::PathBuf::from(r"E:\Typst\TypstStudio\bin\typst.exe");
    if Fixed.exists()
    {
        return Fixed;
    }

    if cfg!(windows)
    {
        std::path::PathBuf::from("typst.exe")
    }
    else
    {
        std::path::PathBuf::from("typst")
    }
}

#[tauri::command]
fn CompileTypst(Source: String, FilePath: Option<String>) -> Result<Compile_Response, String>
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

    let DocRoot = if let Some(ref Path) = FilePath
    {
        let P = std::path::Path::new(Path);
        if P.exists() && P.is_file()
        {
            P.parent().map(|Dir| Dir.to_path_buf()).unwrap_or_else(|| JobDir.clone())
        }
        else if P.exists() && P.is_dir()
        {
            P.to_path_buf()
        }
        else
        {
            JobDir.clone()
        }
    }
    else
    {
        JobDir.clone()
    };

    let OutputPattern = JobDir.join("page-{p}.svg");

    let mut Command = std::process::Command::new(&TypstBin);
    Command.args
    ([
        "compile",
        "--root",
        DocRoot.to_str().unwrap_or("."),
        "--format",
        "svg",
        "-",
        OutputPattern.to_str().unwrap_or("page-{p}.svg"),
    ]);
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (
        |Error| format!("Failed to spawn typst binary at {:?}: {}", TypstBin, Error)
    )?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(Source.as_bytes());
    }

    let Output = Child.wait_with_output().map_err
    (
        |Error| format!("Typst execution failed: {}", Error)
    )?;
    let DurationMs = StartTime.elapsed().as_millis();

    if !Output.status.success()
    {
        let Stderr = String::from_utf8_lossy(&Output.stderr).to_string();
        let Stdout = String::from_utf8_lossy(&Output.stdout).to_string();
        let ErrorMsg = if !Stderr.trim().is_empty() { Stderr } else { Stdout };
        let _ = std::fs::remove_dir_all(&JobDir);
        return Ok
        (
            Compile_Response
            {
                success: false,
                pages: Vec::new(),
                page_count: 0,
                sync_map: Vec::new(),
                error: Some(ErrorMsg),
                duration_ms: DurationMs,
            }
        );
    }

    let mut SvgFiles = Vec::new();
    if let Ok(Entries) = std::fs::read_dir(&JobDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name.starts_with("page-") && Name.ends_with(".svg")
            {
                if let Some(NumPart) = Name.strip_prefix("page-").and_then(|S| S.strip_suffix(".svg"))
                {
                    if let Ok(PageNum) = NumPart.parse::<usize>()
                    {
                        SvgFiles.push((PageNum, Entry.path()));
                    }
                }
            }
        }
    }
    SvgFiles.sort_by_key(|Item| Item.0);

    let mut Pages = Vec::new();
    for (_, Path) in &SvgFiles
    {
        if let Ok(Content) = std::fs::read_to_string(Path)
        {
            Pages.push(Content);
        }
    }

    let SynctexPath = JobDir.join("synctex.json");
    let mut SyncMap = Vec::new();
    if SynctexPath.exists()
    {
        if let Ok(RawSync) = std::fs::read_to_string(&SynctexPath)
        {
            if let Ok(Parsed) = serde_json::from_str::<Vec<serde_json::Value>>(&RawSync)
            {
                SyncMap = Parsed;
            }
        }
    }

    let _ = std::fs::remove_dir_all(&JobDir);

    Ok
    (
        Compile_Response
        {
            page_count: Pages.len(),
            success: true,
            pages: Pages,
            sync_map: SyncMap,
            error: None,
            duration_ms: DurationMs,
        }
    )
}

#[tauri::command]
fn ExportPdf(Source: String, FilePath: Option<String>) -> Result<Vec<u8>, String>
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

    let DocRoot = if let Some(ref Path) = FilePath
    {
        let P = std::path::Path::new(Path);
        if P.exists() && P.is_file()
        {
            P.parent().map(|Dir| Dir.to_path_buf()).unwrap_or_else(|| JobDir.clone())
        }
        else if P.exists() && P.is_dir()
        {
            P.to_path_buf()
        }
        else
        {
            JobDir.clone()
        }
    }
    else
    {
        JobDir.clone()
    };

    let OutputPdf = JobDir.join("output.pdf");

    let mut Command = std::process::Command::new(&TypstBin);
    Command.args
    ([
        "compile",
        "--root",
        DocRoot.to_str().unwrap_or("."),
        "--format",
        "pdf",
        "-",
        OutputPdf.to_str().unwrap_or("output.pdf"),
    ]);
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (
        |Error| format!("Failed to spawn typst: {}", Error)
    )?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(Source.as_bytes());
    }

    let Output = Child.wait_with_output().map_err
    (
        |Error| format!("Typst execution failed: {}", Error)
    )?;

    if !Output.status.success()
    {
        let Stderr = String::from_utf8_lossy(&Output.stderr).to_string();
        let _ = std::fs::remove_dir_all(&JobDir);
        return Err(Stderr);
    }

    let PdfBytes = std::fs::read(&OutputPdf).map_err
    (
        |Error| format!("Failed to read generated PDF: {}", Error)
    )?;
    let _ = std::fs::remove_dir_all(&JobDir);

    Ok(PdfBytes)
}

#[tauri::command]
fn ExportPng
(
    Source: String,
    FilePath: Option<String>,
    BaseDocName: String,
    BlackMode: bool,
    Transparent: bool,
) -> Result<Vec<u8>, String>
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

    let DocRoot = if let Some(ref Path) = FilePath
    {
        let P = std::path::Path::new(Path);
        if P.exists() && P.is_file()
        {
            P.parent().map(|Dir| Dir.to_path_buf()).unwrap_or_else(|| JobDir.clone())
        }
        else if P.exists() && P.is_dir()
        {
            P.to_path_buf()
        }
        else
        {
            JobDir.clone()
        }
    }
    else
    {
        JobDir.clone()
    };

    let mut SourceToCompile = Source;
    if BlackMode
    {
        let PageFill = if Transparent { "none" } else { "rgb(\"#000000\")" };
        SourceToCompile = format!("#set page(fill: {})\n#set text(fill: rgb(\"#FFFFFF\"))\n\n{}", PageFill, SourceToCompile);
    }
    else if Transparent
    {
        SourceToCompile = format!("#set page(fill: none)\n\n{}", SourceToCompile);
    }

    let OutputPattern = JobDir.join("page-{p}.png");

    let mut Command = std::process::Command::new(&TypstBin);
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
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (
        |Error| format!("Failed to spawn typst: {}", Error)
    )?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(SourceToCompile.as_bytes());
    }

    let Output = Child.wait_with_output().map_err
    (
        |Error| format!("Typst execution failed: {}", Error)
    )?;

    if !Output.status.success()
    {
        let Stderr = String::from_utf8_lossy(&Output.stderr).to_string();
        let _ = std::fs::remove_dir_all(&JobDir);
        return Err(Stderr);
    }

    let mut PngFiles = Vec::new();
    if let Ok(Entries) = std::fs::read_dir(&JobDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name.starts_with("page-") && Name.ends_with(".png")
            {
                if let Some(NumPart) = Name.strip_prefix("page-").and_then(|S| S.strip_suffix(".png"))
                {
                    if let Ok(PageNum) = NumPart.parse::<usize>()
                    {
                        PngFiles.push((PageNum, Entry.path()));
                    }
                }
            }
        }
    }
    PngFiles.sort_by_key(|Item| Item.0);

    if PngFiles.is_empty()
    {
        let _ = std::fs::remove_dir_all(&JobDir);
        return Err("No PNG pages were generated.".to_string());
    }

    use std::io::Cursor;
    use zip::write::{SimpleFileOptions, ZipWriter};

    let mut ZipBuffer = Vec::new();
    {
        let mut Zip = ZipWriter::new(Cursor::new(&mut ZipBuffer));
        let Options = SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated);

        for (Idx, (_, PngPath)) in PngFiles.iter().enumerate()
        {
            let EntryName = format!("{}_page_{}.png", BaseDocName, Idx + 1);
            Zip.start_file(EntryName, Options).map_err(|Error| format!("Zip error: {}", Error))?;
            let PageData = std::fs::read(PngPath).map_err(|Error| format!("Failed to read PNG: {}", Error))?;
            Zip.write_all(&PageData).map_err(|Error| format!("Zip write error: {}", Error))?;
        }
        Zip.finish().map_err(|Error| format!("Zip finish error: {}", Error))?;
    }

    let _ = std::fs::remove_dir_all(&JobDir);
    Ok(ZipBuffer)
}

#[tauri::command]
fn ExportSvg
(
    Source: String,
    FilePath: Option<String>,
    BaseDocName: String,
    BlackMode: bool,
    Transparent: bool,
) -> Result<Vec<u8>, String>
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

    let DocRoot = if let Some(ref Path) = FilePath
    {
        let P = std::path::Path::new(Path);
        if P.exists() && P.is_file()
        {
            P.parent().map(|Dir| Dir.to_path_buf()).unwrap_or_else(|| JobDir.clone())
        }
        else if P.exists() && P.is_dir()
        {
            P.to_path_buf()
        }
        else
        {
            JobDir.clone()
        }
    }
    else
    {
        JobDir.clone()
    };

    let OutputPattern = JobDir.join("page-{p}.svg");

    let mut Command = std::process::Command::new(&TypstBin);
    Command.args
    ([
        "compile",
        "--root",
        DocRoot.to_str().unwrap_or("."),
        "--format",
        "svg",
        "-",
        OutputPattern.to_str().unwrap_or("page-{p}.svg"),
    ]);
    Command.current_dir(&JobDir);
    Command.stdin(std::process::Stdio::piped());
    Command.stdout(std::process::Stdio::piped());
    Command.stderr(std::process::Stdio::piped());

    let mut Child = Command.spawn().map_err
    (
        |Error| format!("Failed to spawn typst: {}", Error)
    )?;

    if let Some(mut Stdin) = Child.stdin.take()
    {
        let _ = Stdin.write_all(Source.as_bytes());
    }

    let Output = Child.wait_with_output().map_err
    (
        |Error| format!("Typst execution failed: {}", Error)
    )?;

    if !Output.status.success()
    {
        let Stderr = String::from_utf8_lossy(&Output.stderr).to_string();
        let _ = std::fs::remove_dir_all(&JobDir);
        return Err(Stderr);
    }

    let mut SvgFiles = Vec::new();
    if let Ok(Entries) = std::fs::read_dir(&JobDir)
    {
        for Entry in Entries.flatten()
        {
            let Name = Entry.file_name().to_string_lossy().to_string();
            if Name.starts_with("page-") && Name.ends_with(".svg")
            {
                if let Some(NumPart) = Name.strip_prefix("page-").and_then(|S| S.strip_suffix(".svg"))
                {
                    if let Ok(PageNum) = NumPart.parse::<usize>()
                    {
                        SvgFiles.push((PageNum, Entry.path()));
                    }
                }
            }
        }
    }
    SvgFiles.sort_by_key(|Item| Item.0);

    if SvgFiles.is_empty()
    {
        let _ = std::fs::remove_dir_all(&JobDir);
        return Err("No SVG pages were generated.".to_string());
    }

    use std::io::Cursor;
    use zip::write::{SimpleFileOptions, ZipWriter};

    let mut ZipBuffer = Vec::new();
    {
        let mut Zip = ZipWriter::new(Cursor::new(&mut ZipBuffer));
        let Options = SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated);

        for (Idx, (_, SvgPath)) in SvgFiles.iter().enumerate()
        {
            let EntryName = format!("{}_page_{}.svg", BaseDocName, Idx + 1);
            Zip.start_file(EntryName, Options).map_err(|Error| format!("Zip error: {}", Error))?;
            let mut SvgContent = std::fs::read_to_string(SvgPath).map_err
            (
                |Error| format!("Failed to read SVG: {}", Error)
            )?;

            if Transparent
            {
                SvgContent = SvgContent.replace("fill=\"#ffffff\" fill-rule=\"nonzero\" d=\"M 0 0v", "fill=\"none\" fill-rule=\"nonzero\" d=\"M 0 0v");
                SvgContent = SvgContent.replace("fill=\"#ffffff\"", "fill=\"none\"");
                SvgContent = SvgContent.replace("fill=\"#FFFFFF\"", "fill=\"none\"");
            }

            if BlackMode
            {
                SvgContent = SvgContent.replace("fill=\"#000000\"", "fill=\"#FFFFFF\"");
                SvgContent = SvgContent.replace("stroke=\"#000000\"", "stroke=\"#FFFFFF\"");
                if !Transparent
                {
                    SvgContent = SvgContent.replace("fill=\"none\" fill-rule=\"nonzero\" d=\"M 0 0v", "fill=\"#000000\" fill-rule=\"nonzero\" d=\"M 0 0v");
                }
            }

            Zip.write_all(SvgContent.as_bytes()).map_err(|Error| format!("Zip write error: {}", Error))?;
        }
        Zip.finish().map_err(|Error| format!("Zip finish error: {}", Error))?;
    }

    let _ = std::fs::remove_dir_all(&JobDir);
    Ok(ZipBuffer)
}

#[tauri::command]
fn PickFolder() -> Result<Option<String>, String>
{
    let Selected = rfd::FileDialog::new()
        .set_title("Select Typst Project Folder")
        .pick_folder();

    Ok(Selected.map(|P| P.to_string_lossy().to_string()))
}

#[tauri::command]
fn ReadWorkspaceFile(PathStr: String) -> Result<String, String>
{
    std::fs::read_to_string(&PathStr).map_err
    (
        |Error| format!("Failed to read file: {}", Error)
    )
}

#[tauri::command]
fn SaveWorkspaceFile(PathStr: String, Content: String) -> Result<(), String>
{
    if let Some(Parent) = std::path::Path::new(&PathStr).parent()
    {
        let _ = std::fs::create_dir_all(Parent);
    }
    std::fs::write(&PathStr, Content).map_err
    (
        |Error| format!("Failed to save file: {}", Error)
    )
}

#[tauri::command]
fn ListWorkspaceFiles(DirPath: Option<String>) -> Result<Vec<File_Entry>, String>
{
    let TargetDir = DirPath.map(std::path::PathBuf::from).unwrap_or_else(|| std::env::current_dir().unwrap_or_default());
    let mut Results = Vec::new();

    if let Ok(Entries) = std::fs::read_dir(&TargetDir)
    {
        for Entry in Entries.flatten()
        {
            let Meta = Entry.metadata().ok();
            let IsDir = Meta.as_ref().map(|M| M.is_dir()).unwrap_or(false);
            let Size = Meta.as_ref().map(|M| M.len()).unwrap_or(0);
            let Name = Entry.file_name().to_string_lossy().to_string();
            let Path = Entry.path().to_string_lossy().to_string();

            Results.push
            (
                File_Entry
                {
                    name: Name,
                    path: Path,
                    is_dir: IsDir,
                    size: Size,
                }
            );
        }
    }

    Results.sort_by
    (
        |A, B|
        {
            if A.is_dir != B.is_dir
            {
                B.is_dir.cmp(&A.is_dir)
            }
            else
            {
                A.name.to_lowercase().cmp(&B.name.to_lowercase())
            }
        }
    );

    Ok(Results)
}

fn FindWorkspaceConfigFile() -> std::path::PathBuf
{
    for Rel in &
    [
        ".workspace_config.json",
        "TypstStudio/.workspace_config.json",
        "../.workspace_config.json",
        "../../.workspace_config.json",
    ]
    {
        let P = std::path::PathBuf::from(Rel);
        if P.exists()
        {
            return P;
        }
    }

    if let Ok(Exe) = std::env::current_exe()
    {
        if let Some(Dir) = Exe.parent()
        {
            let Candidate = Dir.join(".workspace_config.json");
            if Candidate.exists()
            {
                return Candidate;
            }
            let DevCandidate = Dir.join("../../../.workspace_config.json");
            if DevCandidate.exists()
            {
                return DevCandidate;
            }
        }
    }

    std::path::PathBuf::from(r"E:\Typst\TypstStudio\.workspace_config.json")
}

fn GetTrackedDirectories() -> Vec<String>
{
    let ConfigPath = FindWorkspaceConfigFile();
    if ConfigPath.exists()
    {
        if let Ok(Content) = std::fs::read_to_string(&ConfigPath)
        {
            if let Ok(Data) = serde_json::from_str::<Workspace_Config_Data>(&Content)
            {
                if !Data.Directories.is_empty()
                {
                    return Data.Directories;
                }
            }
        }
    }

    vec![r"e:\Typst\projects".to_string()]
}

fn SaveTrackedDirectories(Dirs: &[String]) -> Result<(), String>
{
    let ConfigPath = FindWorkspaceConfigFile();
    let Data = Workspace_Config_Data
    {
        Directories: Dirs.to_vec(),
    };
    let Json = serde_json::to_string_pretty(&Data).map_err
    (
        |Error| format!("Serialize error: {}", Error)
    )?;
    std::fs::write(&ConfigPath, Json).map_err
    (
        |Error| format!("Write config error: {}", Error)
    )?;
    Ok(())
}

fn ScanDirectoryRecursive
(
    BaseDir: &std::path::Path,
    CurrentDir: &std::path::Path,
    Files: &mut Vec<Workspace_File>,
    Folders: &mut Vec<Workspace_Folder>,
)
{
    let Entries = match std::fs::read_dir(CurrentDir)
    {
        Ok(E) => E,
        Err(_) => return,
    };

    let CurrentStr = CurrentDir.to_string_lossy().to_string();
    let FolderName = CurrentDir.file_name().map( |N| N.to_string_lossy().to_string()).unwrap_or_default();

    if CurrentDir != BaseDir
    {
        Folders.push
        (
            Workspace_Folder
            {
                Name: FolderName,
                Path: CurrentStr.clone(),
                FileCount: 0,
            }
        );
    }

    for Entry in Entries.flatten()
    {
        let Path = Entry.path();
        let Name = Entry.file_name().to_string_lossy().to_string();

        if Name.starts_with('.') || Name == "node_modules" || Name == "target" || Name == ".temp"
        {
            continue;
        }

        if Path.is_dir()
        {
            ScanDirectoryRecursive(BaseDir, &Path, Files, Folders);
        }
        else if Path.is_file() && Name.ends_with(".typ")
        {
            let Meta = Entry.metadata().ok();
            let Size = Meta.as_ref().map( |M| M.len()).unwrap_or(0);
            let Modified = Meta
                .and_then( |M| M.modified().ok())
                .and_then( |T| T.duration_since(std::time::UNIX_EPOCH).ok())
                .map( |D| D.as_millis() as u64)
                .unwrap_or(0);

            let Rel = Path
                .strip_prefix(BaseDir)
                .map( |P| P.to_string_lossy().to_string())
                .unwrap_or_else( |_| Name.clone());

            let ParentDir = Path.parent().map( |P| P.to_string_lossy().to_string()).unwrap_or_default();

            Files.push
            (
                Workspace_File
                {
                    Name: Name,
                    Path: Path.to_string_lossy().to_string(),
                    RelativePath: Rel,
                    Directory: ParentDir,
                    Size: Size,
                    Modified: Modified,
                }
            );
        }
    }
}

#[tauri::command]
fn GetWorkspaceInfo() -> Result<Workspace_Info_Response, String>
{
    let Dirs = GetTrackedDirectories();
    let mut AllFiles = Vec::new();
    let mut AllFolders = Vec::new();

    for DirStr in &Dirs
    {
        let Base = std::path::Path::new(DirStr);
        if Base.exists() && Base.is_dir()
        {
            ScanDirectoryRecursive(Base, Base, &mut AllFiles, &mut AllFolders);
        }
    }

    let mut SeenFiles = std::collections::HashSet::new();
    let mut UniqueFiles = Vec::new();
    for File in AllFiles
    {
        let Key = File.Path.to_lowercase();
        if !SeenFiles.contains(&Key)
        {
            SeenFiles.insert(Key);
            UniqueFiles.push(File);
        }
    }

    let mut SeenFolders = std::collections::HashSet::new();
    let mut UniqueFolders = Vec::new();
    for mut Folder in AllFolders
    {
        let Key = Folder.Path.to_lowercase();
        if !SeenFolders.contains(&Key)
        {
            SeenFolders.insert(Key.clone());
            let FolderPrefix = format!("{}\\", Key);
            let FolderPrefixAlt = format!("{}/", Key);
            Folder.FileCount = UniqueFiles
                .iter()
                .filter
                (
                    |F|
                    {
                        let FDir = F.Directory.to_lowercase();
                        FDir == Key || FDir.starts_with(&FolderPrefix) || FDir.starts_with(&FolderPrefixAlt)
                    }
                )
                .count();
            UniqueFolders.push(Folder);
        }
    }

    UniqueFiles.sort_by( |A, B| B.Modified.cmp(&A.Modified));

    Ok
    (
        Workspace_Info_Response
        {
            Success: true,
            Directories: Dirs,
            Files: UniqueFiles,
            Folders: UniqueFolders,
        }
    )
}

#[tauri::command]
fn CreateWorkspaceFile
(
    Directory: Option<String>,
    FileName: String,
    Content: Option<String>,
) -> Result<String, String>
{
    let Dirs = GetTrackedDirectories();
    let TargetDir = Directory
        .filter( |D| !D.trim().is_empty())
        .or_else( || Dirs.first().cloned())
        .unwrap_or_else( || ".".to_string());

    let mut CleanName = std::path::Path::new(&FileName)
        .file_name()
        .map( |N| N.to_string_lossy().to_string())
        .unwrap_or_else( || "Untitled.typ".to_string());

    if !CleanName.ends_with(".typ")
    {
        CleanName.push_str(".typ");
    }

    let FullPath = std::path::Path::new(&TargetDir).join(&CleanName);
    if let Some(Parent) = FullPath.parent()
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

    std::fs::write(&FullPath, InitialContent).map_err
    (
        |Error| format!("Failed to create file: {}", Error)
    )?;
    Ok(FullPath.to_string_lossy().to_string())
}

#[tauri::command]
fn DeleteWorkspaceFile(PathStr: String) -> Result<(), String>
{
    let P = std::path::Path::new(&PathStr);
    if P.exists()
    {
        std::fs::remove_file(P).map_err
        (
            |Error| format!("Failed to delete file: {}", Error)
        )?;
    }
    Ok(())
}

#[tauri::command]
fn AddWorkspaceDirectory(PathStr: String) -> Result<(), String>
{
    let P = std::path::Path::new(&PathStr);
    if !P.exists()
    {
        let _ = std::fs::create_dir_all(P);
    }

    let mut Dirs = GetTrackedDirectories();
    let Canonical = P.to_string_lossy().to_string();
    if !Dirs.iter().any( |D| D.eq_ignore_ascii_case(&Canonical))
    {
        Dirs.push(Canonical);
        SaveTrackedDirectories(&Dirs)?;
    }
    Ok(())
}

#[tauri::command]
fn RemoveWorkspaceDirectory(PathStr: String) -> Result<(), String>
{
    let mut Dirs = GetTrackedDirectories();
    Dirs.retain( |D| !D.eq_ignore_ascii_case(&PathStr));
    SaveTrackedDirectories(&Dirs)?;
    Ok(())
}

#[tauri::command]
fn UploadAsset
(
    Directory: Option<String>,
    FileName: String,
    Base64Data: String,
) -> Result<String, String>
{
    let Dirs = GetTrackedDirectories();
    let TargetDir = Directory
        .filter( |D| !D.trim().is_empty())
        .or_else( || Dirs.first().cloned())
        .unwrap_or_else( || ".".to_string());

    let CleanName = std::path::Path::new(&FileName)
        .file_name()
        .map( |N| N.to_string_lossy().to_string())
        .unwrap_or_else( || "asset.png".to_string());

    let OutPath = std::path::Path::new(&TargetDir).join(&CleanName);
    if let Some(Parent) = OutPath.parent()
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
        .map_err
        (
            |Error| format!("Base64 decode error: {}", Error)
        )?;

    std::fs::write(&OutPath, Decoded).map_err
    (
        |Error| format!("Failed to write asset: {}", Error)
    )?;
    Ok(OutPath.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run()
{
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
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
                AddWorkspaceDirectory,
                RemoveWorkspaceDirectory,
                UploadAsset
            ]
        )
        .setup
        (
            |app|
            {
                if cfg!(debug_assertions)
                {
                    app.handle().plugin
                    (
                        tauri_plugin_log::Builder::default()
                            .level(log::LevelFilter::Info)
                            .build(),
                    )?;
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
    use super::*;

    #[test]
    fn TestCompileTypst()
    {
        let Source = "= Hello Typst\nTesting Tauri command.".to_string();
        let Resp = CompileTypst(Source, None).expect("CompileTypst should succeed");
        assert!(Resp.success);
        assert_eq!(Resp.page_count, 1);
        assert!(!Resp.pages.is_empty());
    }

    #[test]
    fn TestExportPdf()
    {
        let Source = "= Test Document\nTesting PDF export.".to_string();
        let PdfData = ExportPdf(Source, None).expect("ExportPdf should succeed");
        assert!(!PdfData.is_empty());
        assert!(PdfData.starts_with(b"%PDF"));
    }

    #[test]
    fn TestExportPngZip()
    {
        let Source = "= Page 1\n#pagebreak()\n= Page 2".to_string();
        let ZipData = ExportPng(Source, None, "test_doc".to_string(), false, false).expect("ExportPng should succeed");
        assert!(!ZipData.is_empty());
        let Reader = std::io::Cursor::new(ZipData);
        let mut Archive = zip::ZipArchive::new(Reader).expect("Valid ZIP archive");
        assert_eq!(Archive.len(), 2);
        assert_eq!(Archive.by_index(0).unwrap().name().unwrap(), "test_doc_page_1.png");
        assert_eq!(Archive.by_index(1).unwrap().name().unwrap(), "test_doc_page_2.png");
    }

    #[test]
    fn TestExportSvgZip()
    {
        let Source = "= Vector Page 1\n#pagebreak()\n= Vector Page 2".to_string();
        let ZipData = ExportSvg(Source, None, "vector_doc".to_string(), true, true).expect("ExportSvg should succeed");
        assert!(!ZipData.is_empty());
        let Reader = std::io::Cursor::new(ZipData);
        let mut Archive = zip::ZipArchive::new(Reader).expect("Valid ZIP archive");
        assert_eq!(Archive.len(), 2);
        assert_eq!(Archive.by_index(0).unwrap().name().unwrap(), "vector_doc_page_1.svg");
        assert_eq!(Archive.by_index(1).unwrap().name().unwrap(), "vector_doc_page_2.svg");
    }

    #[test]
    fn TestWorkspaceFileOperations()
    {
        let TempDir = std::env::temp_dir().join(format!("test_ws_{}", std::process::id()));
        let _ = std::fs::create_dir_all(&TempDir);
        let TempDirStr = TempDir.to_string_lossy().to_string();

        let CreatedPath = CreateWorkspaceFile
        (
            Some(TempDirStr.clone()),
            "MyTestDoc.typ".to_string(),
            Some("= Test Content".to_string()),
        )
        .expect("CreateWorkspaceFile should succeed");

        assert!(std::path::Path::new(&CreatedPath).exists());

        let ReadContent = ReadWorkspaceFile(CreatedPath.clone()).expect("ReadWorkspaceFile should succeed");
        assert_eq!(ReadContent, "= Test Content");

        SaveWorkspaceFile(CreatedPath.clone(), "= Updated Content".to_string()).expect("SaveWorkspaceFile should succeed");
        let UpdatedContent = ReadWorkspaceFile(CreatedPath.clone()).expect("ReadWorkspaceFile should succeed");
        assert_eq!(UpdatedContent, "= Updated Content");

        DeleteWorkspaceFile(CreatedPath.clone()).expect("DeleteWorkspaceFile should succeed");
        assert!(!std::path::Path::new(&CreatedPath).exists());

        let _ = std::fs::remove_dir_all(&TempDir);
    }

    #[test]
    fn TestGetWorkspaceInfo()
    {
        let Info = GetWorkspaceInfo().expect("GetWorkspaceInfo should succeed");
        assert!(Info.Success);
        assert!(!Info.Directories.is_empty());
    }
}

# Build Release Executable / Installers for Typst Studio Desktop (Tauri v2)
# Automatically bundles the latest LAFS Formatter release (from B:\Language-Agnostic Formatting Style)
# GitHub Repository: https://github.com/Winstead-Inc/Language-Agnostic-Formatting-Style
Set-Location -Path $PSScriptRoot

$LafsSourcePaths = @(
    "B:\Language-Agnostic Formatting Style\LAFS.exe",
    "B:\Language-Agnostic Formatting Style\target\release\Language-Agnostic-Formatting-Style.exe",
    "..\LAFS.exe"
)

$LafsBundled = $false
foreach ($Path in $LafsSourcePaths)
{
    if (Test-Path -Path $Path)
    {
        Write-Host "Bundling latest LAFS formatter release from: $Path" -ForegroundColor Cyan
        Copy-Item -Path $Path -Destination "bin\lafs.exe" -Force
        $LafsBundled = $true
        break
    }
}

if (-not $LafsBundled)
{
    Write-Warning "LAFS formatter binary not found on source paths. Proceeding with existing bin\lafs.exe if present."
}

# Ensure release typst compiler binary is bundled if built
$TypstSource = "..\target\release\typst.exe"
if (Test-Path -Path $TypstSource)
{
    Write-Host "Bundling latest Typst compiler binary from: $TypstSource" -ForegroundColor Cyan
    Copy-Item -Path $TypstSource -Destination "bin\typst.exe" -Force
}

Write-Host "Building Typst Studio Release Executable..." -ForegroundColor Magenta
cargo build --release --manifest-path "src-tauri/Cargo.toml"
if ($LASTEXITCODE -eq 0)
{
    Write-Host "Typst Studio Release Executable ready at: src-tauri/target/release/typst-studio.exe" -ForegroundColor Green
}


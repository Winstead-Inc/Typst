# Build Release Executable / Installers for Typst Studio Desktop (Tauri v2)
Set-Location -Path $PSScriptRoot
Write-Host "Building Typst Studio Release Executable..." -ForegroundColor Magenta
cargo build --release --manifest-path "src-tauri/Cargo.toml"
if ($LASTEXITCODE -eq 0)
{
    Write-Host "Typst Studio Release Executable ready at: src-tauri/target/release/typst-studio.exe" -ForegroundColor Green
}


# Build Release Executable / Installers for Typst Studio Desktop (Tauri v2)
Set-Location -Path $PSScriptRoot
Write-Host "Building Typst Studio Release Executables..." -ForegroundColor Magenta
npx @tauri-apps/cli build


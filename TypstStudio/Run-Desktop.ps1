# Run Typst Studio Native Desktop Application (Tauri v2)
Set-Location -Path $PSScriptRoot
Write-Host "Launching Typst Studio Desktop..." -ForegroundColor Magenta
npx @tauri-apps/cli dev

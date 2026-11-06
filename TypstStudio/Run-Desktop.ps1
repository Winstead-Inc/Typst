# Run Typst Studio Native Desktop Application (Tauri v2)
Set-Location -Path $PSScriptRoot

$ReleaseExe = Join-Path $PSScriptRoot "src-tauri\target\release\typst-studio.exe"
if (Test-Path $ReleaseExe)
{
    Write-Host "Launching Typst Studio Release Executable..." -ForegroundColor Green
    Start-Process -FilePath $ReleaseExe
}
else
{
    Write-Host "Launching Typst Studio Desktop Dev Mode..." -ForegroundColor Magenta
    npx @tauri-apps/cli dev
}

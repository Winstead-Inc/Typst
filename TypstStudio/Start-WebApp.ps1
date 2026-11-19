$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "Starting Typst Studio Web Application..." -ForegroundColor Purple
Write-Host "Server URL: http://localhost:3000" -ForegroundColor Violet

Start-Process "http://localhost:3000"
node Server.js


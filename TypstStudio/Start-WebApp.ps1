$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $ScriptDir

Write-Host "Starting Typst Studio Web Application..." -ForegroundColor Cyan
Write-Host "Server URL: http://localhost:3000" -ForegroundColor Green

Start-Process "http://localhost:3000"
node Server.js


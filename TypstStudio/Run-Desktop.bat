@echo off
cd /d "%~dp0"
if exist "src-tauri\target\release\typst-studio.exe"
( echo Launching Typst Studio Release Executable...
    start "" "src-tauri\target\release\typst-studio.exe") else (  echo Starting Typst Studio Desktop Dev Mode...
    npx @tauri-apps/cli dev )


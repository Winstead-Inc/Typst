@echo off
cd /d "%~dp0"
echo Starting Typst Studio Web Application...
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
node Server.js
pause


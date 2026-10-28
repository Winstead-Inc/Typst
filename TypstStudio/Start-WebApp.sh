#!/usr/bin/env bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting Typst Studio Desktop Web Application..."
echo "Server URL: http://localhost:3000"

# Open browser on macOS or Linux
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000" &
elif command -v xdg-open > /dev/null 2>&1; then
    xdg-open "http://localhost:3000" &
fi

exec node Server.js


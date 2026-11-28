#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

BIN_PATH="src-tauri/target/release/typst-studio"
if [ -x "$BIN_PATH" ]; then
    echo "Launching Typst Studio Release Executable..."
    exec "$BIN_PATH"
elif [ -d "src-tauri/target/release/bundle/macos/TypstStudio.app" ]; then
    echo "Launching Typst Studio macOS App Bundle..."
    open "src-tauri/target/release/bundle/macos/TypstStudio.app"
else
    echo "Launching Typst Studio Desktop Dev Mode..."
    exec npx @tauri-apps/cli dev
fi

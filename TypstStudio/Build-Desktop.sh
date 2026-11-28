#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$SCRIPT_DIR"

mkdir -p "$SCRIPT_DIR/bin"

TYPST_SRC="$ROOT_DIR/target/release/typst"
if [ -f "$TYPST_SRC" ]; then
    echo "Bundling latest Typst compiler binary from: $TYPST_SRC"
    cp "$TYPST_SRC" "$SCRIPT_DIR/bin/typst"
    chmod +x "$SCRIPT_DIR/bin/typst"
fi

LAFS_CANDIDATES=(
    "$ROOT_DIR/target/release/lafs"
    "$SCRIPT_DIR/bin/lafs"
)
for CANDIDATE in "${LAFS_CANDIDATES[@]}"; do
    if [ -f "$CANDIDATE" ]; then
        chmod +x "$CANDIDATE"
        break
    fi
done

echo "Building Typst Studio Release Executable..."
cargo build --release --manifest-path "src-tauri/Cargo.toml"
echo "Typst Studio Release Executable ready at: src-tauri/target/release/typst-studio"

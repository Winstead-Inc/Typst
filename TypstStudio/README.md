# Typst Studio

Typst Studio is a high-performance desktop development environment for the Typst typesetting system, built on Tauri and Monaco Editor with native vector rendering, bi-directional SyncTeX synchronization, and full support for the Language-Agnostic Formatting Style (LAFS).

## Architecture & Features

- **Bidirectional SyncTeX Engine:** Instant bidirectional synchronization between Monaco editor source code positions and rendered vector SVG page sheets.
- **True SVG Glyph Bounds Calculation:** Live query of rendered SVG `<use>` and `<path>` glyph nodes with screen coordinate transformation matrices (`Svg.getScreenCTM().inverse()`) to compute exact visual union bounds with symmetric horizontal and vertical padding (4px X, 2px Y), eliminating right-edge clipping on justified paragraphs, titles, and table cells.
- **Strict Math Delimiter & Expression Clamping:** Mathematical expressions inside `$ ... $` blocks are strictly bounded to their containing math intervals. Delimiter matching for matrices (`mat(...)`), column vectors (`vec(...)`), and piecewise expressions (`cases(...)`) accurately resolves matching parentheses without bleeding into prose or subsequent equations.
- **Math Atom & Row Grouping:** Automatic grouping of contiguous mathematical atoms (such as `f(x)`) and row terms (such as `cos theta, -sin theta, 0;`), merging contiguous same-row elements into unified highlight geometries without splitting terms across overlapping borders.
- **TOC / Outline Disambiguation:** Distinction between `#outline` table-of-contents link references on Page 1 and target document body headings/cells across subsequent pages, preventing false jumps to Page 1 when navigating body content.
- **Table Cell Scoping & Border Stroke Exclusion:** Structural scoping for `table.cell [...]` blocks to resolve highlights directly to the targeted cell without escalating to parent tables, while filtering full-table grid and border strokes to prevent highlight bleeding across section boundaries.
- **CSP-Hardened Dashboard & Project Manager:** Resilient DOM event delegation architecture across workspace projects, tracked directories, editor tabs, and document dropdowns, strictly eliminating inline event handler attributes (`onclick`) to ensure full compliance with modern W3C Content Security Policies (CSP) in desktop WebViews.

## Keyboard Shortcuts & Navigation

| Action | Shortcut | Description |
| :--- | :--- | :--- |
| **Forward Sync** | `Ctrl+Click` / Cursor Movement | Highlights corresponding rendered SVG elements in the preview pane |
| **Reverse Sync** | `Ctrl+Click` on Preview SVG | Jumps editor cursor to the exact source code line and column |
| **Toggle Fullscreen** | `F11` | Toggles maximized fullscreen viewport per application security standards |
| **Recompile Document** | `Ctrl+S` / Auto-Compile | Triggers incremental Typst compilation pipeline with sub-millisecond updates |
| **Fit Page / Fit Width** | Preview Toolbar | Automatically scales SVG preview zoom to fit document width or full page |

## Building & Running

To run Typst Studio in local development mode:

```bash
cd TypstStudio
cargo tauri dev
```

To compile a production release binary:

```PowerShell
cd TypstStudio
.\Build-Desktop.ps1
```

Or invoke Cargo directly:

```PowerShell
cargo build --release --manifest-path "src-tauri/Cargo.toml"
```

The optimized executable is produced at `src-tauri/target/release/typst-studio.exe`.

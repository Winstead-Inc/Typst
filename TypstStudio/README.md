# Typst Studio

Typst Studio is a high-performance desktop development environment for the Typst typesetting system, built on Tauri and Monaco Editor with native vector rendering, bi-directional SyncTeX synchronization, and full support for the Language-Agnostic Formatting Style (LAFS). Official Repository: [Winstead-Inc/Typst](https://github.com/Winstead-Inc/Typst).

## Architecture & Features

- **Two-Group Dashboard Architecture (Standalone Projects & Projects):** Comprehensive redesign dividing the Steve Jobs homepage into two dedicated, prioritized groups: **Standalone Projects (1 file)** positioned at the top, and **Projects** below it. Users can quickly access standalone documents or multi-file project repositories at a glance in both Grid View and List View.
- **Nested Directory Hierarchy in Dashboard Project Boxes:** Inside each added project box (e.g. `docs/` and multi-folder repositories), files are structured and displayed by their nested directory hierarchy (`content/tutorial`, `components`, `assets`, etc.) instead of an undifferentiated flat list. Each directory group features dedicated folder headers, breadcrumbs, file count badges, collapsible container cards with persistent localStorage state, and direct `Open Folder` buttons.
- **Accurate Project Grouping by Added Workspace Directories:** Project grouping directly maps workspace files to their matching added project roots (such as `E:\Typst\docs\`), ensuring that subfolders remain unified inside their respective project container rather than fragmenting into multiple project boxes.
- **Expandable & Collapsible Project Boxes:** Every added project directory is rendered as an interactive, collapsible container box displaying directory name, file count, active state badge, and 1st page previews of all `.typ` files in that folder. Users can expand and collapse individual project boxes with persistent state retained in localStorage across sessions.
- **Seamless Working Directory & Sidebar Treeview Switching:** Clicking a project or any document inside it automatically switches the active working directory and sidebar treeview (`ExplorerCurrentRoot`), while clicking inside the currently active project avoids redundant reloads. Opening a nested folder from the dashboard automatically expands all intermediate parent directories in `ExplorerExpandedFolders` and highlights the active file.
- **Integrated `stdx` Documentation Engine & HTML Features:** Fully integrates the native `stdx` module into the Typst compiler's `SystemWorld` and activates `--features html` across all compilation and export pipelines (`CompileTypstSync`, `ExportPdfSync`, `ExportPngSync`, `ExportSvgSync`), enabling seamless compilation and live vector previews of official Typst documentation packages, tutorials, and components without `unknown variable stdx` or `cannot access variable html` errors.
- **Standalone Projects Mode (1 Single File):** Allows opening, creating, and editing individual `.typ` files without requiring an enclosing project directory. In standalone mode, the sidebar treeview isolates and displays only that single file as the project, streamlining quick drafting and independent file editing.
- **Hero & Secondary Toolbar Actions:** Direct `+ Open standalone file` buttons across hero cards and toolbars for single-file authoring, alongside `+ Add project` for project management.
- **Dynamic Sandbox Root & Relative Import Resolution:** Multi-stage root resolution and shadow file preparation preserve relative imports like `../../components/index.typ` within project sandboxes without triggering root escape errors.
- **Syntax Parser Detached Content Blocks:** Full parser support for detached content blocks on new lines after function calls (`table.cell \n [...]` and `text(...) \n [...]`).
- **Steve Jobs Homepage & Document Gallery:** Default launch landing page featuring a minimalist, high-contrast dark aesthetic with authentic first-page vector SVG thumbnails of all workspace documents. Every document is presented as a physical paper sheet with realistic A4 aspect ratio, tactile depth shadows, and interactive hover lift. The preview 1st page automatically renders using the exact default page color mode configured by the user (`Light`, `Optimized Pitch Black`, or `Pure Black OLED`).
- **Unified AppHeader across Editor and Dashboard Mode:** The top navigation header is unified between Editor and Projects/Dashboard mode. In Dashboard mode, editor-specific controls (`#ModeSwitcherNav`, `#ExportGroupWrapper`, `#ShortcutsHelpBtn`, `#LayoutSwitcherNav`, `#ToggleExplorerBtn`, `#CompilationErrorIndicator`) are cleanly hidden, while preserving the full brand identity, quick view navigation between Projects and Editor, fullscreen toggle, and preferences settings. Extraneous cloud navigation bars and "Upgrade to Typst Pro" banners are completely eliminated.
- **Streamlined Full-Width Dashboard & Brand Parity:** Clean, unencumbered full-width layout maximizing horizontal canvas real estate for project discovery and document previews, eliminating cluttered side rails and promotional feed blocks. All product branding across the homepage, headers, navigation bars, tooltips, and documentation links is rigorously standardized to "Typst Studio".
- **Redesigned List View & Document Management Table:** Sleek, high-contrast document management table accessible via the `[=]` view toggle. Displays documents in clean tabular layout with `Project` (with document icon and title), `Created`, and interactive `Last modified ▾` sort headers, coupled with integrated inline action buttons for each document:
  - `[▶]` Run / Open in Editor
  - `[⬇]` Direct PDF Vector Export
  - `[⚙]` Rename / Document Configuration with atomic on-disk renaming
  - `[🗑]` Permanent Delete with tab closure and recent history cleanup
- **Persistent View & Multi-Parameter Sorting:** Seamless switching between Grid View (`[::]`) and List View (`[=]`), persisted in `localStorage.typst_homepage_view_mode`, with multi-parameter sorting (`last modified`, `name (A-Z)`, `created`, `file size`).
- **Monaco Line Height Mathematical Lock:** Deterministic mathematical synchronization of line height (`lineHeight = Math.round(fontSize * CurrentEditorLineHeight)`) on any editor font size change, Monaco built-in `mouseWheelZoom`, UI font preset selection, and display scaling. Enforces strict bounds `[10, 28]` on font size and `[1.1, 2.0]` on line height multiplier, permanently eliminating line-height runaway, visual decoupling, and massive vertical row voids.
- **Dual-Mode Asynchronous SVG Preview Pipeline:** High-performance background compile pipeline that reads workspace files and compiles page 1 to vector SVG on demand across both native Tauri desktop IPC (`CompileDocumentPageSvg`) and browser Web mode (`/api/workspace/file` + `/api/compile`), caching rendered sheets in memory and persistent storage for instant startup display, with graceful serif typographic paper mockups during pending fetches. Dark mode SVG color conversion (`ConvertSvgToDarkMode`) is automatically applied to both cached thumbnails and live background compilations, synchronizing the `.PaperSheetOuter`, `.PaperSheetInner`, and `.PaperMockup` elements with the user's active theme.
- **Instant Hero Actions & Template Chooser:** Top-level quick action cards for bootstrapping new documents with zero friction (`+ Empty project / Start from scratch` and `Start from template / Configure a template to get going`). The template chooser provides pre-configured templates for scientific papers, books & novels, executive reports, modern resumes, and showcase documents.
- **Bidirectional SyncTeX Engine:** Instant bidirectional synchronization between Monaco editor source code positions and rendered vector SVG page sheets.
- **True SVG Glyph Bounds Calculation:** Live query of rendered SVG `<use>` and `<path>` glyph nodes with screen coordinate transformation matrices (`Svg.getScreenCTM().inverse()`) to compute exact visual union bounds with symmetric horizontal and vertical padding (4px X, 2px Y), eliminating right-edge clipping on justified paragraphs, titles, and table cells.
- **Strict Math Delimiter & Expression Clamping:** Mathematical expressions inside `$ ... $` blocks are strictly bounded to their containing math intervals. Delimiter matching for matrices (`mat(...)`), column vectors (`vec(...)`), and piecewise expressions (`cases(...)`) accurately resolves matching parentheses without bleeding into prose or subsequent equations.
- **Math Atom & Row Grouping:** Automatic grouping of contiguous mathematical atoms (such as `f(x)`) and row terms (such as `cos theta, -sin theta, 0;`), merging contiguous same-row elements into unified highlight geometries without splitting terms across overlapping borders.
- **TOC / Outline Disambiguation:** Distinction between `#outline` table-of-contents link references on Page 1 and target document body headings/cells across subsequent pages, preventing false jumps to Page 1 when navigating body content.
- **Table Cell Scoping & Structural Span Isolation:** Structured table-aware cell resolution engine that isolates individual cells via their unique AST spans and bracket bounds (`[...]`), completely preventing row-level clustering and inter-row vertical merging across columns. Wrapped multi-line cell content (e.g. `Real-Time Browser DOM Streaming`) is automatically unified into a single coherent bounding box with zero stray fragments.
- **Table Declaration & Continuation Header De-duplication:** Placing the cursor on a `#table` declaration cleanly highlights the full table bounding box on the target page rather than overflowing into adjacent paragraphs. When selecting multi-row tables that span page boundaries, repeated continuation headers on subsequent pages are automatically de-duplicated so only authentic table body rows are highlighted.
- **Non-Blocking K&R Diagnostic Feedback & Unhindered Editing Freedom:** Real-time keystroke interception, deletion blocking, and forced editor mutations are completely disabled, guaranteeing users complete, unhindered editing freedom when using Backspace, Delete, Cut, Paste, and Replace. Structural K&R formatting issues are surfaced non-invasively as informative Monaco editor diagnostic markers without disrupting typing, live compilation pipelines, or rendered SVG page sheets. Whenever the user triggers a save via `Ctrl+S`, the editor automatically and silently runs the LAFS formatter if K&R formatting is detected, synchronizing clean Allman-style container geometry to disk before saving.
- **Multi-Line Equality Binding & Lenient Closure Grammar:** Official Typst syntax parser enhancement permitting the equals sign (`=`) in `#let` bindings and function signatures to be placed on its own line across line breaks, attached to the tail of parameter lists, or omitted when followed directly by a block body `{ ... }`, completely eliminating `expected equals sign` errors when authoring multi-line or Allman-style signatures.
- **Automatic Semicolon Insertion (ASI) Engine:** Enhanced Typst syntax engine implementing automatic semicolon insertion (ASI) across contiguous code-mode expressions within curly code blocks (e.g. `{ [Requires the] raw(info.feature)[feature] }` and contiguous AST calls `{ link(...) html.span(...) }`), cleanly separating independent statements on the same line and permanently eliminating `expected semicolon or line break` errors.
- **Reprogrammed LAFS Formatter with Parameter-Attached Equals:** Upgraded `FormatTypstLAFS` across both client and server pipelines that automatically normalizes `#let` function declarations, attaching the equals operator to the closing parenthesis of parameter lists (e.g. `(func, params, ...) =` followed by `{` on the next line). Standalone `=` tokens on their own line are merged into the preceding parameter line, and missing equals signs on `#let` closure definitions preceding `{` are automatically populated.
- **Recent Document Persistence & 1st Page Previews:** Real-time persistence and discovery of opened, created, and edited Typst files stored in `localStorage.TypstStudio_RecentDocuments`. The Steve Jobs homepage dynamically discovers, aggregates, and displays authentic first-page vector SVG paper previews for all active, workspace, and recent documents, seamlessly compiling vector thumbnails in the background with zero UI blocking.
- **Content Literal Syntax Preservation & Bracket Decoupling:** Full support for Typst content-mode literal delimiters, such as standalone opening and closing parentheses `[(]` and `[)]`, braces `[{]` and `[}]`, and punctuation blocks (`[,]`, `[.]`, `[..]`). The Monarch tokenizer classifies content literal brackets as `markup.content.literal` rather than structural code delimiters, preventing Monaco bracket pair colorization from raising false unexpected closing or unclosed bracket errors. Simultaneously, the LAFS AST validator and formatter decouple content-mode literal parentheses from container symmetry checking, guaranteeing zero false-positive K&R slop warnings and zero syntax deformation.
- **CSP-Hardened Dashboard & Project Manager:** Resilient DOM event delegation architecture across workspace projects, added project directories, editor tabs, and document dropdowns, strictly eliminating inline event handler attributes (`onclick`) to ensure full compliance with modern W3C Content Security Policies (CSP) in desktop WebViews.
- **Fluid Animated Explorer Sidebar:** Smooth in-and-out sliding animation powered by cubic-bezier physics curves (`cubic-bezier(0.16, 1, 0.3, 1)`) with real-time continuous Monaco editor layout resizing, seamless collapse to 0px, tactile button feedback, and global keyboard shortcut binding (`Ctrl+B`).

## Keyboard Shortcuts & Navigation

| Action | Shortcut | Description |
| :--- | :--- | :--- |
| **Navigate to Homepage** | Top Header `Home` / `Alt+D` | Switches view to the Steve Jobs homepage and document gallery |
| **Return to Editor** | Top Header `Editor` / Card Click | Transitions into the split-view editor and loads the selected document |
| **Toggle Explorer Sidebar** | `Ctrl+B` / Sidebar Button | Smoothly toggles the project file and outline sidebar with fluid animations |
| **Forward Sync** | `Ctrl+Click` / Cursor Movement | Highlights corresponding rendered SVG elements in the preview pane |
| **Reverse Sync** | `Ctrl+Click` on Preview SVG | Jumps editor cursor to the exact source code line and column |
| **Toggle Fullscreen** | `F11` | Toggles maximized fullscreen viewport per application security standards |
| **Recompile Document** | `Ctrl+S` / Auto-Compile | Triggers incremental Typst compilation pipeline with sub-millisecond updates |
| **Fit Page / Fit Width** | Preview Toolbar | Automatically scales SVG preview zoom to fit document width or full page |

## Building & Running

### Automated Release Bundling (LAFS Formatter & Typst CLI)

Typst Studio packages runtime helper binaries within its desktop application bundle via Tauri's resource packaging pipeline (`"resources": ["../bin/*", "../public/fonts/*"]` in `src-tauri/tauri.conf.json`). On every release build, the build pipeline automatically inspects and copies the latest release of the Language-Agnostic Formatting Style (LAFS) formatter binary and the optimized Typst compiler CLI into the application distribution bundle:

- **LAFS Formatter Source Repository:** [Winstead-Inc/Language-Agnostic-Formatting-Style](https://github.com/Winstead-Inc/Language-Agnostic-Formatting-Style)
- **Source Paths Checked on Release:** `B:\Language-Agnostic Formatting Style\LAFS.exe`, `B:\Language-Agnostic Formatting Style\target\release\Language-Agnostic-Formatting-Style.exe`, or repository root `LAFS.exe`.
- **Bundled Target Path:** `TypstStudio/bin/lafs.exe` (embedded into `typst-studio.exe` application resources).
- **Typst Compiler Source Path:** `target/release/typst.exe` copied directly into `TypstStudio/bin/typst.exe`.

To build the complete production release with all binaries synchronized:

```PowerShell
cd TypstStudio
.\Build-Desktop.ps1
```

The script automatically verifies and synchronizes the latest `LAFS.exe` and `typst.exe` binaries into `TypstStudio/bin/`, then compiles the optimized desktop executable at `src-tauri/target/release/typst-studio.exe`.

### Development Mode

To run Typst Studio in local development mode with hot-reloading:

```bash
cd TypstStudio
cargo tauri dev
```

Or invoke Cargo directly for manual builds:

```PowerShell
cargo build --release --manifest-path "src-tauri/Cargo.toml"
```

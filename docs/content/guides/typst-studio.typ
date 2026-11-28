#import "../../components/index.typ": docs-chapter, example, kbd, short-or-long

#show: docs-chapter.with
(
    title: "Typst Studio Guide",
    route: "/guides/typst-studio",
    description: "Comprehensive guide to Typst Studio: the high-performance desktop environment featuring Steve Jobs aesthetic dashboard, physical paper dark mode, pixel-perfect SVG bounds, and native LAFS formatting.",
)

Typst Studio is a high-performance desktop application engineered for technical writing, publication design, and mathematical document synthesis.Built on Tauri and modern web technologies with a native Rust compiler core, Typst Studio provides instant incremental document compilation, bidirectional SyncTeX navigation, and strict typographical alignment.

= Steve Jobs Dashboard <dashboard>

The Typst Studio dashboard greets you with an intentional, clutter-free workspace that prioritizes clarity and immediate focus.

- * Project Gallery: * Projects can be browsed in either Grid View or List View with flexible sorting options(by alphabetical title, last modified timestamp, or creation date in newest-first or oldest-first order).
- * Fullscreen Viewport Fidelity: * The homepage preview renders the first page of your document matching the exact physical page background color configured in your document or settings.
- * Template & Workspace Inception: * Create blank projects from scratch with a single click or instantiate ready-to-use publication templates tailored for papers, theses, resumes, books, and presentations.
- * Workspace Directory Tracking: * Add, organize, and manage folders directly within your active workspace without leaving the desktop environment.

= Editor & Typography Architecture <editor>

The editor in Typst Studio is tailored specifically for high-density document authoring, offering visual comfort and typography precision:

== True SVG Glyph Bounds & Optical Baseline Alignment <svg-glyph-bounds>
Typst Studio renders text glyphs using native SVG paths and precise boundary calculations.Unlike standard bitmap rendering, every symbol, fraction bar, and ligature is crisp at any display magnification, preserving mathematical precision across 4 K and Retina displays.

== Physical Paper Dark Mode <physical-paper-dark-mode>
Typst Studio ' s Physical Paper Dark Mode does not merely invert colors.It computes an optically balanced contrast curve that preserves paper realism, maintaining text contrast without blinding bright flashes, ensuring comfortable long-form writing sessions under low-light ambient conditions.

== Monaco Line Height Lock <monaco-line-height-lock>
To eliminate ocular jitter during rapid editing, Monaco line heights, gutter line numbers, and active cursor line indicators are locked to an integer baseline grid.Every line in the editor maps directly to discrete vertical increments.

== Bidirectional SyncTeX Navigation <synctex-navigation>
Typst Studio features instant two-way synchronization between your code and the compiled preview:
- * Forward Search: * Click or press#kbd("Ctrl") + #kbd("Click") inside the editor to immediately spotlight and center the corresponding element on the rendered document page.
- * Inverse Search: * #kbd("Ctrl") + #kbd("Click") any word, equation, or figure in the rendered preview to jump the editor cursor directly to the originating line and column in your `.typ` source file.

= Language-Agnostic Formatting Style(LAFS) <lafs-formatting>

Typst Studio includes native integration with the Language-Agnostic Formatting Style(LAFS) formatter.LAFS prioritizes visual symmetry, column alignment, and load-bearing delimiter geometry over unprincipled horizontal compression.

== Formatter Capabilities <formatter-capabilities>
- * Silent Format on Save: * Whenever you press#kbd("Ctrl") + #kbd("S"), the document is automatically formatted according to LAFS rules without interrupting your flow or blocking your typing.
- * Monolith Optimization: * Short expressions, imports, and parameters that fit comfortably within the configured canvas tier(160 columns by default) are formatted cleanly as single-line vectors.
- * Compound Delimiter Symmetry: * Nested closures and structured arrays combine opening and closing boundaries into alloyed delimiters `[{(` and `)}]` sharing identical horizontal coordinates.
- * Strict Vertical Load Paths: * Delimiters and structural tokens align along vertical baselines, enabling rapid ocular scanning across large files.

= Keyboard Shortcuts Reference <shortcuts>

Typst Studio provides a comprehensive set of keyboard shortcuts designed to maximize keyboard-driven efficiency:

#table
(
    columns: (1fr, 2fr),
    stroke: 0.5pt + rgb("4D4C5B"),
    fill: (_, y) => if calc.odd(y) { rgb("F4F4F6") },
    table.header([ * Shortcut *], [ * Action *]),
    [#kbd("Ctrl") + #kbd("S")],
    [Save document and trigger LAFS formatter],
    [#kbd("Ctrl") + #kbd("Enter")],
    [Manually trigger document recompilation],
    [#kbd("Ctrl") + #kbd("P")],
    [Open quick project search palette],
    [#kbd("Ctrl") + #kbd("Shift") + #kbd("F")],
    [Global project search & replace],
    [#kbd("Ctrl") + #kbd("B")],
    [Toggle sidebar and file navigation tree],
    [#kbd("Ctrl") + #kbd("Click") in Preview],
    [SyncTeX inverse search: jump to editor source position],
    [#kbd("Ctrl") + #kbd("Click") in Editor],
    [SyncTeX forward search: highlight element in preview],
    [#kbd("Ctrl") + #kbd("Z")],
    [Undo last edit],
    [#kbd("Ctrl") + #kbd("Y")],
    [Redo last edit],
    [#kbd("Ctrl") + #kbd("/")],
    [Toggle line comment (`//` ) on current selection],
)

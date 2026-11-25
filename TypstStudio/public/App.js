const TEMPLATES =
{
    novel: `#set page
(
  paper: "us-trade", // Standard 6" x 9" book size
  margin:
  (
    inside: 0.85in,  // Gutter for binding
    outside: 0.625in,
    top: 0.75in,
    bottom: 0.75in,
  ),
  header: context
  {
    let page_num = counter(page).get().first()
    if page_num > 2
    {
      if calc.even(page_num)
      {
        align(left, text(8.5pt)[INTERCEPTION])
      }
      else
      {
        align(right, text(8.5pt)[BOOK 0: GENESIS OF THE VANGUARD])
      }
    }
  },
  footer: context
  {
    let page_num = counter(page).get().first()
    if page_num > 2
    {
      align(center, text(9pt)[#page_num])
    }
  }
)

#set text
(
  font: ("EB Garamond", "Linux Libertine", "Times New Roman", "Georgia"),
  size: 10.5pt,
  lang: "en"
)

#set par
(
  justify: true,
  leading: 0.74em,      // Line spacing
  first-line-indent: 0.25in
)

// --- TITLE PAGE ---
#align(center + horizon)
[
  #text(size: 24pt, weight: "bold")[INTERCEPTION]\\
  #v(1em)
  #text(size: 14pt, style: "italic")[Book 0: Genesis of the Vanguard]\\
  #v(3em)
  #text(size: 12pt, weight: "medium")[BY MR. NOBODY]
]

#pagebreak()

// --- PROLOGUE ---
#align(center)
[
  #v(2in)
  #text(size: 16pt, weight: "bold")[PROLOGUE]\\
  #v(0.5in)
]

In the quiet corridors between starlight and shadow, the Vanguard stood silent.
The telemetry screens flickered with low hums of encrypted signals, each frequency
singing of worlds long forgotten by the central councils.

No transmission had reached the outer perimeter in forty-seven solar cycles.
Yet tonight, the resonance scanners registered an impossible anomaly: an interception
waveform cutting directly through the quantum barrier, structured not by noise,
but by deliberate intent.

#pagebreak()

// --- CHAPTER ONE ---
#align(center)
[
  #v(1.5in)
  #text(size: 16pt, weight: "bold")[CHAPTER ONE]\\
  #text(size: 12pt, style: "italic")[The Quantum Threshold]\\
  #v(0.5in)
]

Commander Vane adjusted the optical display, his cybernetic retinas tracing
the harmonics of the incoming signal. The signature was unmistakable—an archaic
carrier protocol dating back to the earliest colony ships.

"Confirm telemetry," he commanded, his voice steady against the rising
crescendo of proximity alarms. The console before him lit up in azure hues,
drawing vectors across the navigation coordinate grid.

"Signal confirmed, Commander," replied the synthesis core. "The vector originates
from within the accretion boundary. Decryption has begun."
`,

    paper: `#set page
(
  paper: "a4",
  margin: (x: 2cm, y: 2.5cm)
)

#set text
(
  font: ("STIX Two Text", "Linux Libertine", "Times New Roman"),
  size: 10pt
)

#set par(justify: true)

#align(center)
[
  #text(18pt, weight: "bold")[Syntactic Symmetry in Document Compilation]\\
  #v(0.5em)
  #text(11pt, style: "italic")[Antigravity Research Labs]\\
  #v(1em)
]

#columns(2)
[
  == Abstract
  This paper demonstrates the seamless integration of Language-Agnostic Formatting
  Style (LAFS) and Allman brace geometry within the Typst typesetting compiler. By
  decoupling structural tokens from control-flow statements, code symmetry and ocular
  scanning speeds are significantly improved without sacrificing compiler throughput.

  == 1. Introduction
  Traditional markup formats frequently compress syntax boundaries to minimize vertical
  line usage. However, on high-resolution widescreen monitors, horizontal vector asymmetry
  creates ocular fatigue.

  == 2. Delimiter Architecture
  Detached opening delimiters create invariant vertical alignment vectors:
  $
    integral_0^infinity e^(-x^2) dif x = sqrt(pi) / 2
  $

  == 3. Conclusion
  The real-time compiler maintains sub-50ms latency across multi-page technical documents.
]
`,

    resume: `#set page
(
  paper: "us-letter",
  margin: (x: 1.5cm, y: 1.5cm)
)

#set text
(
  font: ("Inter", "Segoe UI", "Arial"),
  size: 10pt
)

#align(center)
[
  #text(20pt, weight: "bold")[ALEXANDER VANE]\\
  #text(10pt)[Systems Architect | Quantum Computing & Compiler Engineering]\\
  #text(9pt, fill: rgb("777777"))[alexander.vane\\@domain.com • +1 (555) 019-2834 • github.com/vane]
]

#v(1em)
#line(length: 100%, stroke: 0.5pt + rgb("444444"))

== Core Competencies
- *Systems Programming*: Rust, C++, WebAssembly, LLVM, Compiler Optimization
- *Document Architecture*: Typst, LaTeX, PostScript, Vector Layout Systems
- *Distributed Engineering*: High-Throughput Microservices, Real-Time WebSockets

== Experience

*Lead Compiler Architect* -- Vanguard Systems \\
_2022 -- Present_
- Engineered real-time incremental syntax parsers for typesetting engines.
- Reduced multi-page document compilation latency by 74%.

*Senior Systems Engineer* -- Horizon Quantum \\
_2019 -- 2022_
- Developed AST transforms for hardware-accelerated matrix multiplication.
`,

    slides: `#set page
(
  paper: "presentation-16-9",
  margin: (x: 2cm, y: 1.5cm),
  fill: rgb("050505")
)

#set text
(
  font: ("Segoe UI", "Arial"),
  size: 22pt,
  fill: rgb("ffffff")
)

#align(center + horizon)
[
  #text(36pt, weight: "bold", fill: rgb("ffffff"))[TYPST LAFS STUDIO]\\
  #v(1em)
  #text(20pt, style: "italic", fill: rgb("888888"))[Next-Generation Real-Time Typesetting]\\
  #v(2em)
  #text(14pt, fill: rgb("aaaaaa"))[Prepared for Technical Architecture Review]
]

#pagebreak()

== Architectural Highlights

#v(1em)
- *Allman Syntax Compatibility*: Full support for detached bracket geometry.
- *Real-Time Incremental Compilation*: Sub-50ms vector rendering.
- *OLED Obsidian Interface*: Pure monochrome architectural authoring experience.
- *Native PDF Export*: Complete print-ready production outputs.
`,

    blank: `// Start writing in Typst with LAFS syntax!

#set text(size: 14pt)

Hello World!
`,

    showcase: `#set page
(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  header: context
  {
    let PageNum = counter(page).get().first()
    if PageNum > 1
    {
      text(8.5pt, fill: rgb("666666"))
      [
        *Typst Comprehensive Typesetting Suite*
        #h(1fr)
        _Section: #counter(heading).display()_
      ]
      v(0.3em)
      line(length: 100%, stroke: 0.4pt + rgb("CCCCCC"))
    }
  },
  footer: context
  {
    let PageNum = counter(page).get().first()
    if PageNum > 1
    {
      line(length: 100%, stroke: 0.4pt + rgb("CCCCCC"))
      v(0.3em)
      text(8.5pt, fill: rgb("666666"))
      [
        Typst Studio LAFS Edition
        #h(1fr)
        Page #PageNum of #counter(page).final().first()
      ]
    }
  }
)

#set text
(
  font: ("Times New Roman", "XITS Math"),
  size: 10.5pt,
  lang: "en"
)

#show math.equation: set text(font: ("XITS Math", "Times New Roman"))

#set par
(
  justify: true,
  leading: 0.75em
)

#set heading(numbering: "1.1")
#set math.equation(numbering: "(1)")

// --- TITLE BANNER ---
#align(center)
[
  #text(24pt, weight: "bold")[Comprehensive Typst Showcase]\\
  #v(0.5em)
  #text(12pt, style: "italic", fill: rgb("555555"))[Demonstrating Modern Vector Typesetting, Scripting, Tables & Math]\\
  #v(0.8em)
  #text(10pt)[By Dr. NullVoid #footnote[Advanced Coding Research Group] • Published: #datetime.today().display()]\\
  #v(1em)
]

#line(length: 100%, stroke: 1pt + rgb("333333"))
#v(1em)

// --- TABLE OF CONTENTS ---
#outline(title: "Document Index", indent: 1.5em)

#v(1.5em)

= Introduction & Document Geometry <sec:intro>

Typst is a next-generation document compiler designed for speed, visual beauty, and computational expressiveness. As established in @sec:intro, this document showcases Typst typesetting primitives formatted under the *Language-Agnostic Formatting Style (LAFS)*.

#columns(2)
[
  == Typography & Micro-Layout
  Typst features sub-millisecond line breaking, optical kerning, and automated justification.

  Inline formatting supports *bold emphasis*, _italic styling_, and \`inline monospaced code\`. Footnotes can be inserted inline #footnote[Footnotes automatically position at page bottoms with dynamic separator lines.] and cross-referenced dynamically.

  == Color Palettes & Vector Graphics
  Vector primitives integrate directly within documents:

  #align(center)
  [
    #rect(width: 80pt, height: 24pt, radius: 4pt, fill: rgb("4338CA"), stroke: 0.5pt + rgb("6366F1"))
    [
      #align(center + horizon)[#text(8pt, fill: rgb("FFFFFF"), weight: "bold")[Indigo Vector]]
    ]
  ]
]

= Mathematics & Equations <sec:math>

Typst features a native math engine with complete typesetting parity. All 12 mathematical categories are showcased below in both inline and coordinate-aligned display forms.

== Linear Transformations & Matrix Algebra
Matrices and vectors express linear mappings. Inline forms like $mat(1, 2; 3, 4)$ and $vec(x_1, x_2)$ integrate smoothly into text flows.

Display matrix affine rotation:
$
  mat
  (
    cos theta, -sin theta, 0;
    sin theta,  cos theta, 0;
    0,          0,         1
  )
  vec(x, y, 1)
  =
  vec(x cos theta - y sin theta, x sin theta + y cos theta, 1)
$ <eq:rotation>

Display 3D cylindrical coordinate vector:
$
  vec
  (
    r cos phi,
    r sin phi,
    z
  )
$

== Piecewise Functions & Cases
Piecewise conditions can be expressed inline via $cases(1 "if" x > 0, 0 "otherwise")$ or expanded into display equations:
$
  f(x)
  =
  cases
  (
    x^2 "if" x in QQ,
    0 "if" x in RR backslash QQ
  )
$

== Rational Expressions & Fractions
Fractions format cleanly inline like $(a + b) / (c + d)$ and expand horizontally or vertically in display mode:
$
  (x^3 - y^3)
  /
  (x - y)
  =
  x^2 + x y + y^2
$

== Radicals, Roots & Binomial Coefficients
Radicals format inline as $sqrt(x^2 + 1)$ and $root(3, 8)$, and binomial coefficients format inline as $binom(n, k)$.

Display radical of high-order forms:
$
  root
  (
    3,
    x^3 + y^3 + z^3
  )
$

Display binomial expansion theorem:
$
  sum_(k=0)^n
  binom
  (
    n,
    k
  )
  a^(n - k) b^k
  =
  (a + b)^n
$

== Calculus, Integrals & Differential Forms
Integrals support standard and contour formulations. Inline forms like $integral_0^1 x^2 dif x = 1/3$ integrate directly into prose.

Display Gaussian probability integral:
$
  integral_(-infinity)^infinity
  e^(-x^2)
  dif x
  =
  sqrt(pi)
$ <eq:gaussian>

Display Cauchy residue contour integral:
$
  integral.cont_gamma
  f(z)
  dif z
  =
  2 pi i sum op("Res")(f, z_k)
$

== Summations, Infinite Products & Limits
Summations and infinite products format inline as $sum_(i=1)^n i = (n (n+1))/2$ and $product_(i=1)^n i = n!$.

Display Basel problem summation:
$
  sum_(n=1)^infinity
  1 / n^2
  =
  pi^2 / 6
$

Display Euler product formula:
$
  product_(n=1)^infinity
  (1 - 1 / (4 n^2))
  =
  2 / pi
$

Display exponential limit definition with inline counterpart $lim_(x -> 0) (sin x) / x = 1$:
$
  lim_(n -> infinity)
  (1 + 1/n)^n
  =
  e
$

== Vector Calculus, Accents, Primes & Norms
Diacritics and prime notation are fully supported inline: $arrow(v), hat(x), tilde(y), dot(x), dot.double(x), macron(z), f'(x)$, with norms $abs(x) < epsilon$ and $norm(arrow(v)) = 1$.

Display Newton second law in vector differential form:
$
  arrow(F)
  =
  m dot.double(arrow(r))
$

Display Euclidean vector norm expansion:
$
  norm
  (
    arrow(v)
  )
  =
  sqrt(v_1^2 + v_2^2 + v_3^2)
$

Display Maxwell electrodynamic field equations (multiline aligned system):
$
  nabla times arrow(E) &= - (partial arrow(B)) / (partial t) \\
  nabla times arrow(B) &= mu_0 arrow(J) + mu_0 epsilon_0 (partial arrow(E)) / (partial t)
$

= Data Tables & Figures <sec:tables>

Typst features high-performance tables supporting custom fills, alternating strokes, cell spanning, and nested hierarchical sub-tables.

== Advanced Merged Cells (Colspan & Rowspan)
The table below illustrates multi-column headers (\`colspan\`) and multi-row categorical spans (\`rowspan\`) with coordinate alignment:

#table
(
  columns: (1.5fr, 1fr, 1.2fr, 2fr),
  stroke: 0.5pt + rgb("CCCCCC"),
  table.header
  (
    table.cell(colspan: 4, fill: rgb("E4E9F0"))[*Executive Cluster Architecture & Performance*]
  ),
  table.cell(rowspan: 2, fill: rgb("FAFAFA"))[*Core Engine*],
  [Parser], [4.2 ms], [Incremental Allman AST],
  [Compiler], [18.7 ms], [Vector Layout Engine],
  table.cell(rowspan: 2, fill: rgb("FAFAFA"))[*Export Pipeline*],
  [PDF Producer], [12.1 ms], [Tagged PDF/UA Production],
  [Vector Renderer], [8.4 ms], [Real-Time Browser DOM Streaming],
  table.cell(colspan: 2, fill: rgb("F1F3F6"))[*Total Latency*],
  table.cell(colspan: 2, fill: rgb("F1F3F6"))[*43.4 ms (Real-Time Synchronous)*]
)

== Hierarchical Nested Tables
Sub-tables can be embedded directly within container cells to display complex component structures:

#table
(
  columns: (1fr, 1.5fr),
  stroke: 0.5pt + rgb("BBBBBB"),
  table.header
  (
    table.cell(colspan: 2, fill: rgb("E4E9F0"))[*System Modularity & Nested Subsystem Matrix*]
  ),
  [*Subsystem ID*], [*Subsystem Component Hierarchy*],
  [Cluster Alpha],
  table.cell
  [
    #table
    (
      columns: (1fr, 1fr),
      stroke: 0.3pt + rgb("DDDDDD"),
      fill: (col, row) => if calc.even(row) { rgb("F9FAFB") } else { none },
      [*Component*], [*Status*],
      [Lexer], [Online],
      [Parser], [Synchronized]
    )
  ],
  [Cluster Beta],
  table.cell
  [
    #table
    (
      columns: (1.2fr, 1fr),
      stroke: 0.3pt + rgb("DDDDDD"),
      fill: (col, row) => if calc.even(row) { rgb("F9FAFB") } else { none },
      [*Sub-Module*], [*Memory Allocated*],
      [Font Rasterizer], [14.2 MB],
      [Vector Cache], [6.8 MB]
    )
  ]
)

= Computational Scripting & Programmatic Generation

Typst features a built-in Turing-complete functional scripting language:

#let MetricBadge(Name, Score) =
{
  rect(width: 100%, stroke: 0.5pt + rgb("DDDDDD"), radius: 4pt, fill: rgb("F1F3F6"))
  [
    #box(inset: 6pt)
    [
      *#Name*: #h(1fr) #text(weight: "bold", fill: if Score > 90 { rgb("16A34A") } else { rgb("2563EB") })[#Score / 100]
    ]
  ]
}

#grid
(
  columns: (1fr, 1fr, 1fr),
  gutter: 10pt,
  MetricBadge("Throughput", 98),
  MetricBadge("Memory Efficiency", 94),
  MetricBadge("Syntax Clarity", 100)
)

== Loop Iteration Demonstration

#for Step in (1, 2, 3)
{
  [ - *Phase #Step*: Initialized execution cycle with computed parameter #calc.pow(Step, 2).\\ ]
}
`
};

let MonacoInstance = null;
let CompileTimeoutID = null;
let CurrentZoomLevel = parseFloat(localStorage.getItem("TypstStudio_PreviewZoom") || "1.0");
if (isNaN(CurrentZoomLevel) || CurrentZoomLevel < 0.25 || CurrentZoomLevel > 5.0)
{
    CurrentZoomLevel = 1.0;
}
let IsCompiling = false;
let HasPendingCompile = false;
let CompileGeneration = 0;
let ActiveCompileGeneration = 0;
let ActiveDocumentCanonicalPath = "";
let CurrentPageCount = 1;
let CurrentActivePage = 1;
let LastCompiledPages = [];
let LastCompiledDocumentPath = "";

function CanonicalizeDocKey(PathStr)
{
    if (!PathStr || typeof PathStr !== "string")
    {
        return "";
    }
    return PathStr.trim().replace(/\\/g, "/").toLowerCase();
}
let CurrentPaperColorMode = ( () =>
{
    const Saved = localStorage.getItem("typst_paper_color_mode");
    if (Saved === "light" || Saved === "optimized" || Saved === "pure_black")
    {
        return Saved;
    }
    const LegacyBlack = localStorage.getItem("typst_black_page_mode");
    if (LegacyBlack === "true")
    {
        return "optimized";
    }
    return "light";
})();
let IsBlackPageMode = CurrentPaperColorMode !== "light";
const IsTauriDesktop = Boolean(typeof window !== "undefined" && (window.__TAURI_INTERNALS__ || window.__TAURI__));
let ActiveAbortController = null;
let RenderToken = 0;
let SessionAuthToken = window.__TYPST_STUDIO_AUTH_TOKEN__ || "";
let IsSyncTexEnabled = localStorage.getItem("typst_synctex_enabled") !== "false";
let ActiveSpanMap = {};
let ActiveSyncMap = [];
let ActiveSyncMapByLine = new Map();
let ActiveOutlineLine = -1;
let MonotonicSyncAnchors = [];
let RepeatedSyncLines = new Set();
let RepeatedSyncSpans = new Set();
let FirstDocumentBodyLine = 1;
let ActiveHighlightLayers = new Set();
let LastTypingTimestamp = 0;
let ActiveHighlightSpan = null;
let ActiveHighlightBox = null;
let ActiveHighlightBoxes = [];
let SuppressForwardSync = false;
let SyncLineDecorations = null;
let ForwardSyncDebounceTimer = null;
let PendingClickAutoScroll = false;
let CurrentEditorFontSize = parseInt(localStorage.getItem("TypstStudio_EditorFontSize") || "14", 10);
if (isNaN(CurrentEditorFontSize) || CurrentEditorFontSize < 10 || CurrentEditorFontSize > 28)
{
    CurrentEditorFontSize = 14;
}
let IsAppFullscreen = false;
let PendingInitialFileContent = null;
let CurrentEditorFont = localStorage.getItem("TypstStudio_EditorFont") || "iA Writer Duo";
let CurrentFocusEditorFont = localStorage.getItem("TypstStudio_FocusEditorFont") || "iA Writer Duo";
let UseDifferentFocusFont = localStorage.getItem("TypstStudio_UseDifferentFocusFont") === "true";
let CurrentEditorLineHeight = parseFloat(localStorage.getItem("TypstStudio_EditorLineHeight") || "1.55");
if (isNaN(CurrentEditorLineHeight) || CurrentEditorLineHeight < 1.1 || CurrentEditorLineHeight > 2.0)
{
    CurrentEditorLineHeight = 1.55;
}
let CurrentEditorLigatures = localStorage.getItem("TypstStudio_EditorLigatures") !== "false";
let IsSmartQuotesEnabled = localStorage.getItem("TypstStudio_SmartQuotes") !== "false";
let IsOpticalMarginsEnabled = localStorage.getItem("TypstStudio_OpticalMargins") !== "false";
let IsTypewriterScrollEnabled = localStorage.getItem("TypstStudio_TypewriterScroll") === "true";
let IsHemingwayFocusEnabled = localStorage.getItem("TypstStudio_HemingwayFocus") === "true";
let HemingwayDecorations = null;
let CachedHemingwayStart = -1;
let CachedHemingwayEnd = -1;
let IsEditorWheelScrolling = false;
let EditorWheelScrollTimer = null;
let TimelineSnapshots = [];
let ActiveTimelineSnapshotIndex = -1;
let TimelineAutoCaptureTimer = null;
let LastSnapshotWordCount = 0;
let ActiveSnapshotCachedContent = "";
let IsKeynoteStageMode = false;
let CurrentStageSlideIndex = 0;
let IsStageNotesVisible = false;
let IsStageBlackout = false;
let StagePresentationStartTime = 0;
let StageTimerInterval = null;
let StageHeaderHideTimer = null;
let IsSpreadMode = localStorage.getItem("TypstStudio_SpreadMode") === "true";

const DEFAULT_KEYBINDINGS =
{
    "save_document": "Ctrl+S",
    "compile_document": "Ctrl+Enter",
    "format_lafs": "Shift+Alt+F",
    "export_pdf": "Ctrl+P",
    "print_document": "Ctrl+Shift+P",
    "layout_split": "Alt+1",
    "layout_editor": "Alt+2",
    "layout_preview": "Alt+3",
    "toggle_outline": "Alt+O",
    "toggle_fullscreen": "F11",
    "toggle_devtools": "F12",
    "open_shortcuts": "Ctrl+/",
    "editor_font_zoom_in": "Ctrl+=",
    "editor_font_zoom_out": "Ctrl+-",
    "editor_font_zoom_reset": "Ctrl+0",
    "preview_zoom_in": "Ctrl+Alt+=",
    "preview_zoom_out": "Ctrl+Alt+-",
    "preview_zoom_fit_width": "Alt+W",
    "preview_zoom_fit_page": "Alt+P",
    "toggle_dark_page": "Alt+D",
    "toggle_ui_mode": "Ctrl+Shift+M",
    "toggle_spread_mode": "Alt+S",
    "toggle_ligatures": "Alt+L",
    "toggle_typewriter_scroll": "Alt+T",
    "toggle_hemingway_focus": "Alt+H",
    "open_time_machine": "Ctrl+Shift+H",
    "enter_stage_mode": "F5",
    "open_command_palette": "Ctrl+K",
    "open_settings": "Ctrl+,",
    "open_export_sheet": "Ctrl+E",
    "toggle_explorer": "Ctrl+B"
};

const APPLICATION_COMMANDS_META =
[
    { Id: "save_document", Label: "Save Document", Category: "Document & Compilation", Source: "App" },
    { Id: "compile_document", Label: "Compile & Refresh Preview", Category: "Document & Compilation", Source: "App" },
    { Id: "format_lafs", Label: "Format Code to LAFS Standard", Category: "Document & Compilation", Source: "App" },
    { Id: "export_pdf", Label: "Export Document to PDF", Category: "Document & Compilation", Source: "App" },
    { Id: "print_document", Label: "Print Document", Category: "Document & Compilation", Source: "App" },
    { Id: "open_export_sheet", Label: "Open Visual Export Sheet", Category: "Document & Compilation", Source: "App" },
    { Id: "layout_split", Label: "Split View (50/50)", Category: "Views & Navigation", Source: "App" },
    { Id: "layout_editor", Label: "Editor Only (Focus Code)", Category: "Views & Navigation", Source: "App" },
    { Id: "layout_preview", Label: "Preview Only (Focus Output)", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_ui_mode", Label: "Toggle Focus vs. Studio Mode", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_spread_mode", Label: "Toggle Facing Two-Page Spread", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_ligatures", Label: "Toggle Typographic Ligatures", Category: "Typography", Source: "App" },
    { Id: "typographic_polish", Label: "Polish Typography: Convert Quotes & Dashes to Smart Glyphs", Category: "Typography", Source: "App" },
    { Id: "toggle_optical_margins", Label: "Toggle Optical Margin Alignment (Hanging Punctuation)", Category: "Typography", Source: "App" },
    { Id: "toggle_smart_quotes", Label: "Toggle Smart Quotes & Typographic Auto-Substitution", Category: "Typography", Source: "App" },
    { Id: "inspect_ligatures", Label: "Inspect Font Ligatures & Glyphs", Category: "Typography", Source: "App" },
    { Id: "toggle_typewriter_scroll", Label: "Toggle Typewriter Center Scroll", Category: "Writing & Focus", Source: "App" },
    { Id: "toggle_hemingway_focus", Label: "Toggle Hemingway Focus Light", Category: "Writing & Focus", Source: "App" },
    { Id: "open_time_machine", Label: "Time Machine for Words (History & Scrubbing)", Category: "Writing & Focus", Source: "App" },
    { Id: "enter_stage_mode", Label: "Keynote Stage Mode (Present Slides)", Category: "Views & Navigation", Source: "App" },
    { Id: "open_command_palette", Label: "Open Command Palette", Category: "Views & Navigation", Source: "App" },
    { Id: "open_settings", Label: "Preferences & Settings", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_explorer", Label: "Toggle Explorer Sidebar", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_outline", Label: "Toggle Document Outline", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_fullscreen", Label: "Toggle Fullscreen Mode", Category: "Views & Navigation", Source: "App" },
    { Id: "toggle_devtools", Label: "Toggle Developer Tools", Category: "Views & Navigation", Source: "App" },
    { Id: "open_shortcuts", Label: "Open Shortcuts / Keybindings Dialog", Category: "Views & Navigation", Source: "App" },
    { Id: "editor_font_zoom_in", Label: "Editor Font Zoom In", Category: "Editor", Source: "App" },
    { Id: "editor_font_zoom_out", Label: "Editor Font Zoom Out", Category: "Editor", Source: "App" },
    { Id: "editor_font_zoom_reset", Label: "Editor Font Zoom Reset", Category: "Editor", Source: "App" },
    { Id: "preview_zoom_in", Label: "Preview Zoom In", Category: "Preview", Source: "App" },
    { Id: "preview_zoom_out", Label: "Preview Zoom Out", Category: "Preview", Source: "App" },
    { Id: "preview_zoom_fit_width", Label: "Preview Fit Width", Category: "Preview", Source: "App" },
    { Id: "preview_zoom_fit_page", Label: "Preview Fit Page", Category: "Preview", Source: "App" },
    { Id: "toggle_dark_page", Label: "Toggle Inverted Dark Paper Mode", Category: "Preview", Source: "App" }
];

let CustomKeybindings = {};
try
{
    const StoredKeybindings = localStorage.getItem("TypstStudio_CustomKeybindings");
    if (StoredKeybindings)
    {
        CustomKeybindings = JSON.parse(StoredKeybindings) || {};
    }
}
catch (Err)
{
    CustomKeybindings = {};
}

let ActiveRecordingCommandId = null;
let RecordingCooldownUntil = 0;

function UpdateFontSizeUI()
{
    const Display = document.getElementById("EditorFontSizeDisplay");
    if (Display)
    {
        Display.textContent = `${CurrentEditorFontSize}px`;
    }
}

function SetEditorFontSize(NewSize)
{
    NewSize = Math.max(9, Math.min(36, Math.round(NewSize)));
    CurrentEditorFontSize = NewSize;
    localStorage.setItem("TypstStudio_EditorFontSize", String(NewSize));
    if (MonacoInstance)
    {
        const NewLineHeight = Math.round(NewSize * CurrentEditorLineHeight);
        MonacoInstance.updateOptions
        ({
            fontSize: NewSize,
            lineHeight: NewLineHeight
        });
    }
    UpdateFontSizeUI();
}

function IncreaseEditorFontSize()
{
    SetEditorFontSize(CurrentEditorFontSize + 1);
}

function DecreaseEditorFontSize()
{
    SetEditorFontSize(CurrentEditorFontSize - 1);
}

function ResetEditorFontSize()
{
    SetEditorFontSize(14);
}

async function ToggleFullscreen()
{
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            const NewFs = await window.__TAURI__.core.invoke("ToggleFullscreen");
            IsAppFullscreen = Boolean(NewFs);
            UpdateFullscreenUI(IsAppFullscreen);
            return ;
        }
        catch (Err)
        {
            console.warn("Tauri ToggleFullscreen invoke error, falling back to Web API:", Err);
        }
    }

    if (!document.fullscreenElement)
    {
        try
        {
            await document.documentElement.requestFullscreen();
            IsAppFullscreen = true;
        }
        catch (Err)
        {
            console.error("Fullscreen request failed:", Err);
        }
    }
    else
    {
        try
        {
            await document.exitFullscreen();
            IsAppFullscreen = false;
        }
        catch (Err)
        {
            console.error("Exit fullscreen failed:", Err);
        }
    }
    UpdateFullscreenUI(IsAppFullscreen);
}

function UpdateFullscreenUI(IsFs)
{
    const EnterIcon = document.getElementById("FullscreenIconEnter");
    const ExitIcon = document.getElementById("FullscreenIconExit");
    const Btn = document.getElementById("FullscreenToggleBtn");
    if (EnterIcon && ExitIcon)
    {
        EnterIcon.style.display = IsFs ? "none": "block";
        ExitIcon.style.display = IsFs ? "block": "none";
    }
    if (Btn)
    {
        Btn.title = IsFs ? "Exit Fullscreen (F11 or Esc)": "Toggle Fullscreen (F11)";
    }
}

async function ToggleDevTools()
{
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            await window.__TAURI__.core.invoke("ToggleDevTools");
            return ;
        }
        catch (Err)
        {
            console.warn("Tauri ToggleDevTools invoke error:", Err);
        }
    }
    console.log("ToggleDevTools requested (in browser environment use DevTools via F12 or Inspect)");
}

window.ToggleDevTools = ToggleDevTools;

const PREDEFINED_MATH_OPERATORS = new Set
([
    "arccos", "arcsin", "arctan", "arg", "cos", "cosh", "cot", "coth",
    "csc", "csch", "ctg", "deg", "det", "dim", "exp", "gcd", "lcm",
    "hom", "id", "im", "inf", "ker", "lg", "lim", "liminf", "limsup",
    "ln", "log", "max", "min", "mod", "Pr", "sec", "sech", "sin",
    "sinc", "sinh", "sup", "tan", "tanh", "tg", "tr", "dif", "Dif"
]);

function GetMathIntervals(Source)
{
    const Intervals = [];
    const Regex = /(?<!\\)\$(?:[^$]|\\\$)*\$/g;
    let Match;

    while
    (
        (Match = Regex.exec(Source)) !== null
    )
    {
        Intervals.push
        ({
            Start: Match.index, End: Match.index + Match[0].length
        });
    }

    return Intervals;
}

function EnrichMathSyncMap(SyncMap, Source, SvgPages)
{
    if (!SyncMap || !Source)
    {
        return SyncMap || [];
    }

    const Enriched = [...SyncMap];
    const Lines = Source.split(/\r?\n/);
    const MathIntervals = GetMathIntervals(Source);
    let ByteOffset = 0;
    const ClaimedGroups = new Map();

    const LineMap = new Map();
    for (const E of Enriched)
    {
        if (!LineMap.has(E.line))
        {
            LineMap.set(E.line, []);
        }
        LineMap.get(E.line).push(E);
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineText = Lines[LineIdx];
        const LineNum = LineIdx + 1;

        const Regex = /\b([a-zA-Z_]+)\b/g;
        let Match;

        while
        (
            (Match = Regex.exec(LineText)) !== null
        )
        {
            const Ident = Match[1];
            if (!PREDEFINED_MATH_OPERATORS.has(Ident))
            {
                continue;
            }

            const Col = Match.index + 1;
            const EndCol = Col + Ident.length;
            const Start = ByteOffset + Match.index;
            const End = Start + Ident.length;

            const InsideMath = MathIntervals.some((Int) => Start >= Int.Start && End <= Int.End);
            if (!InsideMath)
            {
                continue;
            }

            const LineElems = LineMap.get(LineNum) || [];
            const Exists = LineElems.some
            (
                (E) => Math.abs(E.col - Col) <= 1 && Math.abs(E.end_col - EndCol) <= 1
            );

            if (Exists)
            {
                continue;
            }

            LineElems.sort((A, B) => A.col - B.col);

            let PageNum = 1;
            let EstY = null;
            let EstH = 11.0;
            let EstX = null;
            let EstW = Ident.length * 5.3;

            const NextElem = LineElems.find((E) => E.col >= EndCol);
            const PrevElem = [...LineElems].reverse().find((E) => E.end_col <= Col);

            if (NextElem)
            {
                PageNum = NextElem.page || 1;
                EstY = NextElem.y;
                EstH = NextElem.height;
                EstX = NextElem.x - EstW - 1.0;
            }
            else if (PrevElem)
            {
                PageNum = PrevElem.page || 1;
                EstY = PrevElem.y;
                EstH = PrevElem.height;
                EstX = PrevElem.x + PrevElem.width + 1.0;
            }
            else
            {
                const EqElems = Enriched.filter((E) => LineNum >= E.line && LineNum <= E.end_line);
                if (EqElems.length > 0)
                {
                    PageNum = EqElems[0].page || 1;
                    EstY = EqElems[0].y;
                    EstH = EqElems[0].height;
                }
            }

            if (SvgPages && SvgPages[PageNum - 1])
            {
                const Svg = SvgPages[PageNum - 1];
                if (!ClaimedGroups.has(PageNum))
                {
                    ClaimedGroups.set(PageNum, new Set());
                }
                const Claimed = ClaimedGroups.get(PageNum);

                const GroupRegex = /<g transform="matrix\(1 0 0 -1 ([^ ]+) ([^)]+)\)">([\s\S]*?)<\/g>/g;
                let GMatch;
                let BestGroup = null;
                let BestDist = Infinity;
                let BestMatchIndex = - 1;

                while
                (
                    (GMatch = GroupRegex.exec(Svg)) !== null
                )
                {
                    const GroupIndex = GMatch.index;
                    if (Claimed.has(GroupIndex))
                    {
                        continue;
                    }

                    const Tx = parseFloat(GMatch[1]);
                    const Ty = parseFloat(GMatch[2]);
                    const Uses = [...GMatch[3].matchAll(/<use[^>]*x="([^"]*)"/g)].map
                    (
                        (U) => parseFloat(U[1])
                    );

                    if (Uses.length === Ident.length)
                    {
                        const GroupY = Ty - EstH;
                        const YDist = EstY !== null ? Math.abs(GroupY - EstY): 0;
                        const XDist = EstX !== null ? Math.abs(Tx - EstX): 0;
                        const TotalDist = (YDist * 10) + XDist;

                        if (YDist < 4.0 && TotalDist < BestDist)
                        {
                            BestDist = TotalDist;
                            const MinUseX = Math.min(...Uses);
                            const MaxUseX = Math.max(...Uses);
                            BestGroup =
                            {
                                X: Tx + MinUseX,
                                Y: GroupY,
                                Width: (MaxUseX - MinUseX) + 5.5,
                                Height: EstH
                            };
                            BestMatchIndex = GroupIndex;
                        }
                    }
                }

                if (BestGroup)
                {
                    Claimed.add(BestMatchIndex);
                    EstX = BestGroup.X;
                    EstY = BestGroup.Y;
                    EstW = BestGroup.Width;
                    EstH = BestGroup.Height;
                }
            }

            if (EstX !== null && EstY !== null)
            {
                Enriched.push
                ({
                    page: PageNum,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    x: EstX,
                    y: EstY,
                    width: EstW,
                    height: EstH,
                    span: `synth_math_${LineNum}_${Col}`
                });
            }
        }

        ByteOffset += LineText.length + 1;
    }

    return Enriched;
}

function EnrichFunctionCalls(SyncMap, SourceCode)
{
    if (!SyncMap || !SourceCode)
    {
        return SyncMap || [];
    }

    const Enriched = [...SyncMap];
    const Lines = SourceCode.split(/\r?\n/);

    const DefRegex = /#let\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*=/g;
    let DefMatch;
    const Definitions = [];

    while
    (
        (DefMatch = DefRegex.exec(SourceCode)) !== null
    )
    {
        const FuncName = DefMatch[1];
        const Params = DefMatch[2].split(",").map((P) => P.trim());
        const DefOffset = DefMatch.index;

        let DefLine = 1;
        let CurrOff = 0;
        for (let I = 0; I < Lines.length; I ++)
        {
            if (CurrOff + Lines[I].length + 1 > DefOffset)
            {
                DefLine = I + 1;
                break;
            }
            CurrOff += Lines[I].length + 1;
        }

        let OpenChar = "";
        let CloseChar = "";
        let BodyStart = - 1;
        for (let I = DefMatch.index + DefMatch[0].length; I < SourceCode.length; I ++)
        {
            if (SourceCode[I] === "{" || SourceCode[I] === "(")
            {
                OpenChar = SourceCode[I];
                CloseChar = OpenChar === "{" ? "}": ")";
                BodyStart = I;
                break;
            }
        }
        if (BodyStart === - 1)
        {
            continue;
        }

        let Depth = 1;
        let BodyEnd = - 1;
        for (let I = BodyStart + 1; I < SourceCode.length; I ++)
        {
            if (SourceCode[I] === OpenChar)
            {
                Depth ++;
            }
            else if (SourceCode[I] === CloseChar)
            {
                Depth --;
                if (Depth === 0)
                {
                    BodyEnd = I;
                    break;
                }
            }
        }
        if (BodyEnd === - 1)
        {
            continue;
        }

        let EndLine = 1;
        CurrOff = 0;
        for (let I = 0; I < Lines.length; I ++)
        {
            if (CurrOff + Lines[I].length + 1 > BodyEnd)
            {
                EndLine = I + 1;
                break;
            }
            CurrOff += Lines[I].length + 1;
        }

        Definitions.push
        ({
            Name: FuncName,
            Params: Params,
            DefOffset: DefOffset,
            DefEndOffset: BodyEnd,
            DefLineStart: DefLine,
            DefLineEnd: EndLine
        });
    }

    for (const Def of Definitions)
    {
        const BodyElems = SyncMap.filter((E) => E.line >= Def.DefLineStart && E.end_line <= Def.DefLineEnd);
        const RawRects = BodyElems.filter((E) => E.width > 50 && E.height > 20);
        const UniqueRects = [];

        for (const R of RawRects)
        {
            const Exists = UniqueRects.some
            (
                (U) => (U.page || 1) === (R.page || 1) && Math.abs(U.x - R.x) < 2 && Math.abs(U.y - R.y) < 2
            );
            if (!Exists)
            {
                UniqueRects.push(R);
            }
        }

        UniqueRects.sort
        (
            (A, B) => ((A.page || 1) - (B.page || 1)) || (A.y - B.y) || (A.x - B.x)
        );

        const CallRegex = new RegExp("\\b" + Def.Name + "\\s*\\(([^)]*)\\)", "g");
        let CallMatch;
        let InstanceIndex = 0;

        while
        (
            (CallMatch = CallRegex.exec(SourceCode)) !== null
        )
        {
            if (CallMatch.index < Def.DefEndOffset)
            {
                continue;
            }

            const CallStart = CallMatch.index;
            const CallEnd = CallStart + CallMatch[0].length;
            const ArgsText = CallMatch[1];

            let CallLine = 1;
            let LineStartOff = 0;
            for (let I = 0; I < Lines.length; I ++)
            {
                if (LineStartOff + Lines[I].length + 1 > CallStart)
                {
                    CallLine = I + 1;
                    break;
                }
                LineStartOff += Lines[I].length + 1;
            }
            const CallCol = CallStart - LineStartOff + 1;
            const CallEndCol = CallCol + CallMatch[0].length;

            if (InstanceIndex < UniqueRects.length)
            {
                const InstanceRect = UniqueRects[InstanceIndex];
                const PageNum = InstanceRect.page || 1;

                const InstElems = BodyElems.filter
                (
                    (E) => (E.page || 1) === PageNum &&
                    E.x >= InstanceRect.x - 2 && (E.x + E.width) <= (InstanceRect.x + InstanceRect.width + 2) &&
                    E.y >= InstanceRect.y - 2 && (E.y + E.height) <= (InstanceRect.y + InstanceRect.height + 2)
                );

                Enriched.push
                ({
                    page: PageNum,
                    line: CallLine,
                    col: CallCol,
                    end_line: CallLine,
                    end_col: CallEndCol,
                    start: CallStart,
                    end: CallEnd,
                    x: InstanceRect.x,
                    y: InstanceRect.y,
                    width: InstanceRect.width,
                    height: InstanceRect.height,
                    span: "call_box_" + CallLine + "_" + CallCol
                });

                const ArgRegex = /"([^"]*)"|(\b\d+\b)/g;
                let ArgMatch;

                while
                (
                    (ArgMatch = ArgRegex.exec(ArgsText)) !== null
                )
                {
                    const ArgOffsetInCall = CallMatch[0].indexOf(ArgMatch[0]);
                    const ArgStart = CallStart + ArgOffsetInCall;
                    const ArgEnd = ArgStart + ArgMatch[0].length;
                    const ArgCol = CallCol + ArgOffsetInCall;
                    const ArgEndCol = ArgCol + ArgMatch[0].length;

                    if (ArgMatch[1] !== undefined)
                    {
                        const TextElem = InstElems.find
                        (
                            (E) => E.line === Def.DefLineStart + 6 ||
                            (
                                E.height < 15 && E.width > 20 && E.x < InstanceRect.x + InstanceRect.width * 0.5
                            )
                        );
                        if (TextElem)
                        {
                            Enriched.push
                            ({
                                page: PageNum,
                                line: CallLine,
                                col: ArgCol,
                                end_line: CallLine,
                                end_col: ArgEndCol,
                                start: ArgStart,
                                end: ArgEnd,
                                x: TextElem.x,
                                y: TextElem.y,
                                width: TextElem.width,
                                height: TextElem.height,
                                span: "call_arg_" + CallLine + "_" + ArgCol
                            });
                        }
                    }
                    else if (ArgMatch[2] !== undefined)
                    {
                        const ScoreElems = InstElems.filter((E) => E.x > InstanceRect.x + InstanceRect.width * 0.5 && E.height < 15);
                        if (ScoreElems.length > 0)
                        {
                            const MinX = Math.min(...ScoreElems.map((E) => E.x));
                            const MaxX = Math.max(...ScoreElems.map((E) => E.x + E.width));
                            const MinY = Math.min(...ScoreElems.map((E) => E.y));
                            const MaxY = Math.max(...ScoreElems.map((E) => E.y + E.height));

                            Enriched.push
                            ({
                                page: PageNum,
                                line: CallLine,
                                col: ArgCol,
                                end_line: CallLine,
                                end_col: ArgEndCol,
                                start: ArgStart,
                                end: ArgEnd,
                                x: MinX,
                                y: MinY,
                                width: MaxX - MinX,
                                height: MaxY - MinY,
                                span: "call_arg_" + CallLine + "_" + ArgCol
                            });
                        }
                    }
                }
            }

            InstanceIndex ++;
        }
    }

    return Enriched;
}

function EnrichReferences(SyncMap, SourceCode)
{
    if (!SyncMap || !SourceCode)
    {
        return SyncMap || [];
    }

    const Enriched = [...SyncMap];
    const Lines = SourceCode.split(/\r?\n/);
    let ByteOffset = 0;

    const LineMap = new Map();
    for (const E of Enriched)
    {
        if (!LineMap.has(E.line))
        {
            LineMap.set(E.line, []);
        }
        LineMap.get(E.line).push(E);
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineText = Lines[LineIdx];
        const LineNum = LineIdx + 1;
        const RefRegex = /@([a-zA-Z0-9_\-:]+)/g;
        let Match;

        while
        (
            (Match = RefRegex.exec(LineText)) !== null
        )
        {
            const Label = Match[1];
            const Col = Match.index + 1;
            const EndCol = Col + Match[0].length;
            const Start = ByteOffset + Match.index;
            const End = Start + Match[0].length;

            const LineElems = LineMap.get(LineNum) || [];
            const Before = LineElems.filter((E) => E.start <= Start + 2).sort((A, B) => B.start - A.start)[0];
            const After = LineElems.filter((E) => E.start >= End - 1).sort((A, B) => A.start - B.start)[0];

            if (Before && After && (Before.page || 1) === (After.page || 1) && Math.abs(Before.y - After.y) < 3.0)
            {
                const GapX = Before.x + Before.width;
                const GapW = Math.max(12.0, After.x - GapX);
                Enriched.push
                ({
                    page: Before.page || 1,
                    x: GapX,
                    y: Before.y,
                    width: GapW,
                    height: Before.height,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    span: `ref_${Label}`
                });
            }
            else if (Before)
            {
                Enriched.push
                ({
                    page: Before.page || 1,
                    x: Before.x + Before.width,
                    y: Before.y,
                    width: 35.0,
                    height: Before.height,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    span: `ref_${Label}`
                });
            }
        }

        ByteOffset += LineText.length + 1;
    }

    return Enriched;
}

function RebuildSyncMapIndex(SyncMap)
{
    ActiveSyncMapByLine = new Map();
    RepeatedSyncLines = new Set();
    RepeatedSyncSpans = new Set();
    FirstDocumentBodyLine = 1;

    if (!SyncMap || !Array.isArray(SyncMap))
    {
        MonotonicSyncAnchors = [];
        return ;
    }

    ActiveOutlineLine = -1;
    if (MonacoInstance)
    {
        const Model = MonacoInstance.getModel();
        if (Model)
        {
            const LineCount = Model.getLineCount();
            for (let L = 1; L <= LineCount; L ++)
            {
                const LineContent = Model.getLineContent(L) || "";
                if (/^\s*#outline\b/.test(LineContent))
                {
                    ActiveOutlineLine = L;
                    break;
                }
            }
        }
    }

    const LinePages = new Map();
    const SpanPages = new Map();

    for (let I = 0; I < SyncMap.length; I ++)
    {
        const Elem = SyncMap[I];
        const StartLine = Elem.line || 1;
        const EndLine = Elem.end_line || StartLine;
        const PageNum = Elem.page || 1;

        const IsOutlineTOC = (PageNum === 1 && ActiveOutlineLine > 0 && StartLine > ActiveOutlineLine && ((Elem.y >= 180 && Elem.y <= 455) || StartLine >= 95));
        if (IsOutlineTOC)
        {
            Elem.is_outline = true;
            let OutlineList = ActiveSyncMapByLine.get(ActiveOutlineLine);
            if (!OutlineList)
            {
                OutlineList = [];
                ActiveSyncMapByLine.set(ActiveOutlineLine, OutlineList);
            }
            OutlineList.push(Elem);
            continue;
        }

        for (let L = StartLine; L <= EndLine; L ++)
        {
            let LineList = ActiveSyncMapByLine.get(L);
            if (!LineList)
            {
                LineList = [];
                ActiveSyncMapByLine.set(L, LineList);
            }
            LineList.push(Elem);

            if (!LinePages.has(L))
            {
                LinePages.set(L, new Set());
            }
            LinePages.get(L).add(PageNum);
        }

        if (Elem.span)
        {
            if (!SpanPages.has(Elem.span))
            {
                SpanPages.set(Elem.span, new Set());
            }
            SpanPages.get(Elem.span).add(PageNum);
        }
    }

    // Layer A: Detect all lines and spans that repeat across more than 1 distinct page.
    // Only template headers/preambles (L <= 2) should be treated as repeated chrome.
    for (const [L, Pages] of LinePages.entries())
    {
        if (Pages.size > 1 && L <= 2)
        {
            RepeatedSyncLines.add(L);
        }
    }

    for (const [S, Pages] of SpanPages.entries())
    {
        if (Pages.size > 1)
        {
            RepeatedSyncSpans.add(S);
        }
    }

    // Layer B: Detect FirstDocumentBodyLine (minimum source line on Page 1 not in repeated template chrome)
    let MinBodyLine = Infinity;
    for (let I = 0; I < SyncMap.length; I ++)
    {
        const Elem = SyncMap[I];
        const PageNum = Elem.page || 1;
        const LineNum = Elem.line || 1;
        if (PageNum === 1 && !RepeatedSyncLines.has(LineNum) && !Elem.is_outline)
        {
            if (LineNum < MinBodyLine)
            {
                MinBodyLine = LineNum;
            }
        }
    }
    FirstDocumentBodyLine = (MinBodyLine !== Infinity) ? MinBodyLine : 1;
}

async function EnsureSessionAuthToken()
{
    if (IsTauriDesktop)
    {
        SessionAuthToken = "desktop-tauri-token";
        return SessionAuthToken;
    }

    if (SessionAuthToken)
    {
        return SessionAuthToken;
    }

    if (typeof window !== "undefined" && window.__TYPST_STUDIO_AUTH_TOKEN__)
    {
        SessionAuthToken = window.__TYPST_STUDIO_AUTH_TOKEN__;
        return SessionAuthToken;
    }

    try
    {
        const Response = await fetch("/api/auth/token");
        const Data = await Response.json();
        if (Data.Success && Data.Token)
        {
            SessionAuthToken = Data.Token;
            window.__TYPST_STUDIO_AUTH_TOKEN__ = Data.Token;
            return SessionAuthToken;
        }
    }
    catch (Err)
    {
        console.error("Failed to acquire session auth token:", Err);
    }

    return SessionAuthToken;
}

async function AuthenticatedFetch(Url, Options = {})
{
    const Token = await EnsureSessionAuthToken();
    const Headers = Options.headers ? { ...Options.headers }
    : {};

    if (Token)
    {
        Headers["x-typst-auth-token"] = Token;
    }

    return fetch(Url, { ...Options, headers: Headers });
}
let LastSavedContent = "";
let LastSavedVersionId = - 1;
let IsDocumentDirty = false;
let PrimaryErrorLocation = null;
let IsExportMenuOpen = false;

function ShowToast(Message, Type = "info", DurationMs = 3000)
{
    const Container = document.getElementById("ToastContainer");
    if (!Container) { return; }

    const Toast = document.createElement("div");
    const NormalizedType = Type.charAt(0).toUpperCase() + Type.slice(1).toLowerCase();
    Toast.className = `Toast Toast${NormalizedType}`;

    let IconSvg = "";
    if (Type === "success")
    {
        IconSvg = `<svg Class = "ToastIcon" Width = "16" Height = "16" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2"><polyline Points = "20 6 9 17 4 12" /></svg>`;
    }
    else if (Type === "error")
    {
        IconSvg = `<svg Class = "ToastIcon" Width = "16" Height = "16" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2"><circle Cx = "12" Cy = "12" R = "10" /><line X1 = "15" Y1 = "9" X2 = "9" Y2 = "15" /><line X1 = "9" Y1 = "9" X2 = "15" Y2 = "15" /></svg>`;
    }
    else
    {
        IconSvg = `<svg Class = "ToastIcon" Width = "16" Height = "16" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2"><circle Cx = "12" Cy = "12" R = "10" /><line X1 = "12" Y1 = "16" X2 = "12" Y2 = "12" /><line X1 = "12" Y1 = "8" X2 = "12.01" Y2 = "8" /></svg>`;
    }

    Toast.innerHTML = `${IconSvg}<span Class = "ToastMessage">${EscapeHtml(Message)}</span>`;
    Container.appendChild(Toast);

    requestAnimationFrame
    (
        () =>
        {
            Toast.classList.add("Visible");
        }
    );

    setTimeout
    (
        () =>
        {
            Toast.classList.remove("Visible");
            setTimeout
            (
                () =>
                {
                    if (Toast.parentNode)
                    {
                        Toast.parentNode.removeChild(Toast);
                    }
                },
                300
            );
        },
        DurationMs
    );
}

function MarkDocumentClean(Content)
{
    const Model = MonacoInstance ? MonacoInstance.getModel(): null;
    LastSavedVersionId = Model ? Model.getAlternativeVersionId(): - 1;
    LastSavedContent = typeof Content === "string" ? Content: (MonacoInstance ? MonacoInstance.getValue(): "");
    IsDocumentDirty = false;
    UpdateDirtyStateUI();
}

function CheckDocumentDirty()
{
    if (!MonacoInstance)
    {
        return ;
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return ;
    }

    const CurrentVersion = Model.getAlternativeVersionId();
    const WasDirty = IsDocumentDirty;
    IsDocumentDirty = (CurrentVersion !== LastSavedVersionId);
    if (WasDirty !== IsDocumentDirty)
    {
        UpdateDirtyStateUI();
    }
}

function UpdateDirtyStateUI()
{
    const Dot = document.getElementById("UnsavedDirtyDot");
    const TitleInput = document.getElementById("DocumentTitleInput");
    const ActiveName = TitleInput ? TitleInput.value.trim(): (CurrentFilePath ? CurrentFilePath.split(/[\/\\]/).pop(): "main.typ");

    if (Dot)
    {
        Dot.style.display = IsDocumentDirty ? "inline-block": "none";
    }

    if (IsDocumentDirty)
    {
        document.title = `● Typst Studio — ${ActiveName}*`;
    }
    else
    {
        document.title = `Typst Studio — ${ActiveName}`;
    }
}

async function JumpToEditorLocation(Line, Col, TargetFile)
{
    if (TargetFile)
    {
        const CleanTarget = TargetFile.replace(/\\/g, "/");
        const CurrentClean = (ActiveDocumentCanonicalPath || CurrentFilePath || "").replace(/\\/g, "/");
        if (CurrentClean && !CurrentClean.toLowerCase().endsWith(CleanTarget.toLowerCase()) && !CleanTarget.toLowerCase().endsWith(CurrentClean.toLowerCase()))
        {
            if (typeof OpenFileFromWorkspace === "function")
            {
                await OpenFileFromWorkspace(TargetFile);
            }
        }
    }
    if (!MonacoInstance) { return; }
    MonacoInstance.revealPositionInCenter( { lineNumber: Line, column: Col });
    MonacoInstance.setPosition( { lineNumber: Line, column: Col });
    MonacoInstance.focus();
}
// Appearance & UI Settings
const UI_SETTINGS_STORAGE_KEY = "TypstStudio_UISettings";

const DEFAULT_UI_SETTINGS =
{
    Scale: 100, // 100% = Normal / Default (before user prompted to change it)
    Font: "TT Lakes Neue",
    CustomFont: ""
};

let CurrentUISettings = { ...DEFAULT_UI_SETTINGS };

const UI_FONT_PRESETS =
{
    "TT Lakes Neue":
    {
        Family: '"TT Lakes Neue", "TT Lakes Neue Trial Condensed Medium", "TT Lakes Neue Trl Cnd", "TTLakesNeueTrial", "TT Lakes Neue Trl Cnd Md", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        Weight: "500",
        LetterSpacing: "0.2px"
    },
    "Inter":
    {
        Family: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        Weight: "400",
        LetterSpacing: "0px"
    },
    "Segoe UI":
    {
        Family: '"Segoe UI", -apple-system, BlinkMacSystemFont, sans-serif',
        Weight: "400",
        LetterSpacing: "0px"
    },
    "Roboto":
    {
        Family: '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        Weight: "400",
        LetterSpacing: "0px"
    },
    "Outfit":
    {
        Family: '"Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        Weight: "400",
        LetterSpacing: "0.2px"
    },
    "JetBrains Mono":
    {
        Family: '"JetBrains Mono", Consolas, monospace',
        Weight: "400",
        LetterSpacing: "0px"
    },
    "iA Writer Duo":
    {
        Family: '"iA Writer Duo", "iA Writer Duo S", monospace',
        Weight: "400",
        LetterSpacing: "0px"
    },
    "System UI":
    {
        Family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        Weight: "400",
        LetterSpacing: "0px"
    }
};

const UI_DIMENSION_CALIBRATION =
{
    "--ui-font-body":[16, 19],
    "--ui-font-ctrl":[12, 17],
    "--ui-font-header-logo":[16, 18],
    "--ui-font-brand":[18, 21],
    "--ui-font-engine-tag":[11, 12],
    "--ui-font-doc-input":[13, 14],
    "--ui-width-doc-input":[180, 210],
    "--ui-width-doc-menu":[320, 350],
    "--ui-font-menu-title":[11, 16],
    "--ui-font-menu-item":[12, 17],
    "--ui-font-menu-path":[10, 13],
    "--ui-font-menu-footer":[11, 16],
    "--ui-font-status":[11, 16],
    "--ui-font-status-text":[11, 17],
    "--ui-font-duration":[11, 13],
    "--ui-font-toggle":[12, 16],
    "--ui-font-select":[12, 16],
    "--ui-font-btn":[12, 18],
    "--ui-font-icon-btn":[12, 17],
    "--ui-font-nav-tab":[12, 17],
    "--ui-font-statusbar":[11, 15],
    "--ui-font-preview-btn":[11, 16],
    "--ui-font-preview-indicator":[12, 14],
    "--ui-font-error-title":[12, 16],
    "--ui-font-error-content":[13, 14],
    "--ui-font-dash-title":[22, 34],
    "--ui-font-dash-sub":[13, 19],
    "--ui-font-stat-label":[14, 16],
    "--ui-font-stat-val":[32, 42],
    "--ui-font-stat-doc":[14, 19],
    "--ui-font-panel-title":[15, 22],
    "--ui-font-panel-hint":[12, 16],
    "--ui-font-dash-input":[13, 14],
    "--ui-font-dir-path":[13, 14],
    "--ui-font-dir-badge":[13, 16],
    "--ui-font-filter-banner":[15, 18],
    "--ui-font-filter-btn":[13, 15],
    "--ui-font-dash-search":[12, 16],
    "--ui-font-card-name":[13, 19],
    "--ui-font-card-dir":[11, 13],
    "--ui-font-card-details":[11, 14],
    "--ui-font-card-size":[11, 12],
    "--ui-font-card-btn":[11, 16],
    "--ui-font-empty":[12, 17],
    "--ui-height-header":[48, 52],
    "--ui-height-statusbar":[24, 28],
    "--ui-height-toolbar":[36, 40]
};

function CalculateDimensionValue(ScalePercent, NormalVal, LargeVal)
{
    if (ScalePercent === 100)
    {
        return NormalVal;
    }
    if (ScalePercent === 125)
    {
        return LargeVal;
    }
    const Interpolation = (ScalePercent - 100) / 25.0;
    return Math.max
    (
        9, Math.round(NormalVal + (LargeVal - NormalVal) * Interpolation)
    );
}

function SaveUISettings()
{
    try
    {
        localStorage.setItem(UI_SETTINGS_STORAGE_KEY, JSON.stringify(CurrentUISettings));
    }
    catch (Err)
    {
        console.warn("Unable to save UI settings:", Err);
    }
}

function LoadUISettings()
{
    try
    {
        const Saved = localStorage.getItem(UI_SETTINGS_STORAGE_KEY);
        if (Saved)
        {
            const Parsed = JSON.parse(Saved);
            if (typeof Parsed.Scale === "number" && Parsed.Scale >= 70 && Parsed.Scale <= 200)
            {
                CurrentUISettings.Scale = Parsed.Scale;
            }
            if (typeof Parsed.Font === "string")
            {
                if (Parsed.Font === "Teko")
                {
                    CurrentUISettings.Font = "TT Lakes Neue";
                }
                else
                {
                    CurrentUISettings.Font = Parsed.Font;
                }
            }
            if (typeof Parsed.CustomFont === "string")
            {
                CurrentUISettings.CustomFont = Parsed.CustomFont;
            }
        }
    }
    catch (Err)
    {
        console.warn("Unable to load UI settings:", Err);
    }
}

function ApplyUISettings()
{
    const RootStyle = document.documentElement.style;
    const Scale = CurrentUISettings.Scale;
    // Apply Dimensions
    for
    (
        const [PropName,[NormalVal, LargeVal]] of Object.entries(UI_DIMENSION_CALIBRATION)
    )
    {
        const Calculated = CalculateDimensionValue(Scale, NormalVal, LargeVal);
        RootStyle.setProperty(PropName, `${Calculated}px`);
    }
    // Apply Padding & Interactive Dimension Adjustments
    if (Scale >= 120)
    {
        RootStyle.setProperty("--ui-pad-status", "4px 10px");
        RootStyle.setProperty("--ui-pad-btn", "5px 14px");
        RootStyle.setProperty("--ui-pad-icon-btn", "5px 12px");
        RootStyle.setProperty("--ui-pad-nav-tab", "4px 12px");
        RootStyle.setProperty("--ui-pad-stat-box", "18px 22px");
        RootStyle.setProperty("--ui-pad-card", "16px");
        RootStyle.setProperty("--ui-pad-card-btn", "6px 12px");
        RootStyle.setProperty("--ui-dot-size", "8px");
        RootStyle.setProperty("--ui-slider-width", "30px");
        RootStyle.setProperty("--ui-slider-height", "17px");
        RootStyle.setProperty("--ui-slider-knob", "11px");
        RootStyle.setProperty("--ui-slider-translate", "13px");
    }
    else
    {
        RootStyle.setProperty("--ui-pad-status", "3px 8px");
        RootStyle.setProperty("--ui-pad-btn", "5px 12px");
        RootStyle.setProperty("--ui-pad-icon-btn", "5px 10px");
        RootStyle.setProperty("--ui-pad-nav-tab", "4px 10px");
        RootStyle.setProperty("--ui-pad-stat-box", "16px 20px");
        RootStyle.setProperty("--ui-pad-card", "14px");
        RootStyle.setProperty("--ui-pad-card-btn", "5px 10px");
        RootStyle.setProperty("--ui-dot-size", "7px");
        RootStyle.setProperty("--ui-slider-width", "28px");
        RootStyle.setProperty("--ui-slider-height", "16px");
        RootStyle.setProperty("--ui-slider-knob", "10px");
        RootStyle.setProperty("--ui-slider-translate", "12px");
    }
    // Apply Font Configuration
    let FontConfig = UI_FONT_PRESETS[CurrentUISettings.Font];
    if (!FontConfig)
    {
        const CustomName = CurrentUISettings.CustomFont ? CurrentUISettings.CustomFont.trim(): "sans-serif";
        FontConfig =
        {
            Family: `"${CustomName}", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
            Weight: "400",
            LetterSpacing: "0px"
        };
    }
    RootStyle.setProperty("--ui-font-family", FontConfig.Family);
    RootStyle.setProperty("--ui-font-weight", FontConfig.Weight);
    RootStyle.setProperty("--ui-letter-spacing", FontConfig.LetterSpacing);
    // Apply Monaco Editor scaling
    const EditorFontSize = Math.round(13 + (Scale - 100) * (1 / 25.0));
    if (MonacoInstance)
    {
        const ClampedFs = Math.max(10, Math.min(28, EditorFontSize));
        MonacoInstance.updateOptions
        ({
            fontSize: ClampedFs,
            lineHeight: Math.round(ClampedFs * CurrentEditorLineHeight)
        });
    }

    UpdateSettingsPanelUI();
    SaveUISettings();
}

function UpdateSettingsPanelUI()
{
    const ScaleBadge = document.getElementById("UIScaleValueBadge");
    const ScaleSlider = document.getElementById("UIScaleSlider");
    const FontSelect = document.getElementById("UIFontSelect");
    const CustomFontGroup = document.getElementById("CustomFontInputGroup");
    const CustomFontInput = document.getElementById("CustomFontInput");

    if (ScaleBadge && document.activeElement !== ScaleBadge)
    {
        let Label = `${CurrentUISettings.Scale}%`;
        if (CurrentUISettings.Scale === 100)
        {
            Label += " (Default)";
        }
        else if (CurrentUISettings.Scale === 125)
        {
            Label += " (Large)";
        }
        ScaleBadge.textContent = Label;
    }

    if (ScaleSlider)
    {
        ScaleSlider.value = CurrentUISettings.Scale;
    }

    const PresetButtons = document.querySelectorAll(".ScalePresetBtn");
    PresetButtons.forEach
    (
        (Btn) =>
        {
            const BtnScale = parseInt(Btn.getAttribute("DataScale"), 10);
            if (BtnScale === CurrentUISettings.Scale)
            {
                Btn.classList.add("Active");
            }
            else
            {
                Btn.classList.remove("Active");
            }
        }
    );

    if (FontSelect)
    {
        FontSelect.value = CurrentUISettings.Font;
    }

    if (CustomFontGroup && CustomFontInput)
    {
        if (CurrentUISettings.Font === "Custom")
        {
            CustomFontGroup.style.display = "flex";
            CustomFontInput.value = CurrentUISettings.CustomFont || "";
        }
        else
        {
            CustomFontGroup.style.display = "none";
        }
    }

    UpdateEditorTypographyUI();
}

function GetEditorFontStack(FontName)
{
    switch (FontName)
    {
        case "iA Writer Duo":
            return "'iA Writer Duo', 'iA Writer Duo S', 'JetBrains Mono', Consolas, monospace";
        case "JetBrains Mono":
            return "'JetBrains Mono', 'Cascadia Code', Consolas, monospace";
        case "Cascadia Code":
            return "'Cascadia Code', 'JetBrains Mono', Consolas, monospace";
        case "Fira Code":
            return "'Fira Code', 'JetBrains Mono', Consolas, monospace";
        case "Consolas":
            return "Consolas, 'Courier New', monospace";
        default:
            return `'${FontName}', 'iA Writer Duo', monospace`;
    }
}

function ApplyEditorTypography()
{
    const EffectiveFont = (CurrentUIMode === "focus" && UseDifferentFocusFont)
        ? CurrentFocusEditorFont
        : CurrentEditorFont;

    const FontStack = GetEditorFontStack(EffectiveFont);

    if (MonacoInstance)
    {
        MonacoInstance.updateOptions
        ({
            fontFamily: FontStack,
            fontSize: CurrentEditorFontSize,
            lineHeight: Math.round(CurrentEditorFontSize * CurrentEditorLineHeight),
            fontLigatures: CurrentEditorLigatures ? "'calt', 'liga', 'dlig', 'hlig'": false
        });
    }

    const EditorHost = document.querySelector(".EditorHost");
    if (EditorHost)
    {
        EditorHost.style.fontFamily = FontStack;
    }

    UpdateEditorTypographyUI();
}

function UpdateEditorTypographyUI()
{
    const EditorFontSelect = document.getElementById("EditorFontSelect");
    const EditorFontBadge = document.getElementById("EditorFontBadge");
    const CustomGroup = document.getElementById("CustomEditorFontInputGroup");
    const CustomInput = document.getElementById("CustomEditorFontInput");
    const FocusCheckbox = document.getElementById("UseDifferentFocusFontCheckbox");
    const FocusWrapper = document.getElementById("FocusFontSelectorWrapper");
    const FocusSelect = document.getElementById("FocusFontSelect");
    const LineHeightBadge = document.getElementById("EditorLineHeightBadge");

    if (EditorFontSelect)
    {
        if (["iA Writer Duo", "JetBrains Mono", "Cascadia Code", "Fira Code", "Consolas"].includes(CurrentEditorFont))
        {
            EditorFontSelect.value = CurrentEditorFont;
            if (CustomGroup)
            {
                CustomGroup.style.display = "none";
            }
        }
        else
        {
            EditorFontSelect.value = "Custom";
            if (CustomGroup)
            {
                CustomGroup.style.display = "flex";
            }
            if (CustomInput)
            {
                CustomInput.value = CurrentEditorFont;
            }
        }
    }

    if (EditorFontBadge)
    {
        EditorFontBadge.textContent = CurrentEditorFont;
    }

    if (FocusCheckbox)
    {
        FocusCheckbox.checked = UseDifferentFocusFont;
    }

    if (FocusWrapper)
    {
        FocusWrapper.style.display = UseDifferentFocusFont ? "block" : "none";
    }

    if (FocusSelect)
    {
        FocusSelect.value = CurrentFocusEditorFont;
    }

    if (LineHeightBadge)
    {
        const Descriptor = CurrentEditorLineHeight === 1.55 ? "Comfortable" : CurrentEditorLineHeight < 1.5 ? "Compact" : "Relaxed";
        LineHeightBadge.textContent = `${CurrentEditorLineHeight.toFixed(2)} (${Descriptor})`;
    }

    document.querySelectorAll(".LineHeightPresetBtn").forEach
    (
        (Btn) =>
        {
            const Val = parseFloat(Btn.getAttribute("DataLineHeight"));
            Btn.classList.toggle("Active", Math.abs(Val - CurrentEditorLineHeight) < 0.05);
        }
    );

    document.querySelectorAll(".LigaturePresetBtn").forEach
    (
        (Btn) =>
        {
            const Val = Btn.getAttribute("DataLigatures") === "true";
            Btn.classList.toggle("Active", Val === CurrentEditorLigatures);
        }
    );

    const LigaturesBtn = document.getElementById("StatusBarLigaturesBtn");
    const LigaturesText = document.getElementById("StatusBarLigaturesText");
    if (LigaturesBtn)
    {
        LigaturesBtn.classList.toggle("Active", CurrentEditorLigatures);
    }
    if (LigaturesText)
    {
        LigaturesText.textContent = `Ligatures: ${CurrentEditorLigatures ? "ON": "OFF"}`;
    }
}

function SetupAppearanceEventListeners()
{
    // Editable UI Scale Badge
    const ScaleBadge = document.getElementById("UIScaleValueBadge");
    if (ScaleBadge)
    {
        ScaleBadge.addEventListener
        (
            "focus",
            () =>
            {
                ScaleBadge.textContent = `${CurrentUISettings.Scale}%`;
                const Range = document.createRange();
                Range.selectNodeContents(ScaleBadge);
                const Selection = window.getSelection();
                if (Selection)
                {
                    Selection.removeAllRanges();
                    Selection.addRange(Range);
                }
            }
        );
        ScaleBadge.addEventListener
        (
            "keydown",
            (Event) =>
            {
                if (Event.key === "Enter")
                {
                    Event.preventDefault();
                    ScaleBadge.blur();
                }
                else if (Event.key === "Escape")
                {
                    Event.preventDefault();
                    UpdateSettingsPanelUI();
                    ScaleBadge.blur();
                }
            }
        );
        ScaleBadge.addEventListener
        (
            "blur",
            () =>
            {
                const RawText = ScaleBadge.textContent.replace(/[^0-9.]/g, "").trim();
                const Parsed = parseFloat(RawText);
                if (!isNaN(Parsed))
                {
                    let TargetScale = Parsed;
                    if (TargetScale > 0 && TargetScale <= 2.5)
                    {
                        TargetScale = TargetScale * 100;
                    }
                    TargetScale = Math.round(TargetScale);
                    if (TargetScale >= 50 && TargetScale <= 250)
                    {
                        CurrentUISettings.Scale = TargetScale;
                        ApplyUISettings();
                        return;
                    }
                }
                UpdateSettingsPanelUI();
            }
        );
    }

    // Preset Buttons
    const PresetButtons = document.querySelectorAll(".ScalePresetBtn");
    PresetButtons.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener
            (
                "click", () =>
                {
                    const TargetScale = parseInt(Btn.getAttribute("DataScale"), 10);
                    if (!isNaN(TargetScale))
                    {
                        CurrentUISettings.Scale = TargetScale;
                        ApplyUISettings();
                    }
                }
            );
        }
    );
    // Range Slider
    const ScaleSlider = document.getElementById("UIScaleSlider");
    if (ScaleSlider)
    {
        ScaleSlider.addEventListener
        (
            "input", (E) =>
            {
                const Val = parseInt(E.target.value, 10);
                if (!isNaN(Val))
                {
                    CurrentUISettings.Scale = Val;
                    ApplyUISettings();
                }
            }
        );
    }
    // Font Dropdown
    const FontSelect = document.getElementById("UIFontSelect");
    if (FontSelect)
    {
        FontSelect.addEventListener
        (
            "change", (E) =>
            {
                const Chosen = E.target.value;
                CurrentUISettings.Font = Chosen;
                if (Chosen === "Custom")
                {
                    const CustomGroup = document.getElementById("CustomFontInputGroup");
                    const CustomInput = document.getElementById("CustomFontInput");
                    if (CustomGroup)
                    {
                        CustomGroup.style.display = "flex";
                    }
                    if (CustomInput)
                    {
                        CustomInput.focus();
                    }
                }
                else
                {
                    const CustomGroup = document.getElementById("CustomFontInputGroup");
                    if (CustomGroup)
                    {
                        CustomGroup.style.display = "none";
                    }
                    ApplyUISettings();
                }
            }
        );
    }
    // Custom Font Apply Button & Enter Key
    const ApplyCustomBtn = document.getElementById("ApplyCustomFontBtn");
    const CustomInput = document.getElementById("CustomFontInput");

    function CommitCustomFont()
    {
        if (CustomInput)
        {
            CurrentUISettings.CustomFont = CustomInput.value.trim();
            CurrentUISettings.Font = "Custom";
            ApplyUISettings();
        }
    }

    if (ApplyCustomBtn)
    {
        ApplyCustomBtn.addEventListener("click", CommitCustomFont);
    }
    if (CustomInput)
    {
        CustomInput.addEventListener
        (
            "keydown", (E) =>
            {
                if (E.key === "Enter")
                {
                    CommitCustomFont();
                }
            }
        );
    }

    // --- Editor Typography Controls ---
    const EditorFontSelect = document.getElementById("EditorFontSelect");
    const CustomEditorFontGroup = document.getElementById("CustomEditorFontInputGroup");
    const CustomEditorFontInput = document.getElementById("CustomEditorFontInput");

    if (EditorFontSelect)
    {
        EditorFontSelect.addEventListener
        (
            "change",
            (E) =>
            {
                const Chosen = E.target.value;
                if (Chosen === "Custom")
                {
                    if (CustomEditorFontGroup)
                    {
                        CustomEditorFontGroup.style.display = "flex";
                    }
                    if (CustomEditorFontInput)
                    {
                        CustomEditorFontInput.focus();
                    }
                }
                else
                {
                    if (CustomEditorFontGroup)
                    {
                        CustomEditorFontGroup.style.display = "none";
                    }
                    CurrentEditorFont = Chosen;
                    localStorage.setItem("TypstStudio_EditorFont", CurrentEditorFont);
                    ApplyEditorTypography();
                }
            }
        );
    }

    if (CustomEditorFontInput)
    {
        const CommitCustomEditorFont = () =>
        {
            const Val = CustomEditorFontInput.value.trim();
            if (Val)
            {
                CurrentEditorFont = Val;
                localStorage.setItem("TypstStudio_EditorFont", CurrentEditorFont);
                ApplyEditorTypography();
            }
        };

        CustomEditorFontInput.addEventListener("blur", CommitCustomEditorFont);
        CustomEditorFontInput.addEventListener
        (
            "keydown",
            (E) =>
            {
                if (E.key === "Enter")
                {
                    CommitCustomEditorFont();
                }
            }
        );
    }

    const FocusCheckbox = document.getElementById("UseDifferentFocusFontCheckbox");
    const FocusWrapper = document.getElementById("FocusFontSelectorWrapper");
    const FocusSelect = document.getElementById("FocusFontSelect");

    if (FocusCheckbox)
    {
        FocusCheckbox.addEventListener
        (
            "change",
            () =>
            {
                UseDifferentFocusFont = FocusCheckbox.checked;
                localStorage.setItem("TypstStudio_UseDifferentFocusFont", String(UseDifferentFocusFont));
                if (FocusWrapper)
                {
                    FocusWrapper.style.display = UseDifferentFocusFont ? "block" : "none";
                }
                ApplyEditorTypography();
            }
        );
    }

    if (FocusSelect)
    {
        FocusSelect.addEventListener
        (
            "change",
            (E) =>
            {
                CurrentFocusEditorFont = E.target.value;
                localStorage.setItem("TypstStudio_FocusEditorFont", CurrentFocusEditorFont);
                ApplyEditorTypography();
            }
        );
    }

    const LineHeightBtns = document.querySelectorAll(".LineHeightPresetBtn");
    LineHeightBtns.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener
            (
                "click",
                () =>
                {
                    const Val = parseFloat(Btn.getAttribute("DataLineHeight"));
                    if (!isNaN(Val))
                    {
                        CurrentEditorLineHeight = Val;
                        localStorage.setItem("TypstStudio_EditorLineHeight", String(Val));
                        ApplyEditorTypography();
                    }
                }
            );
        }
    );

    const LigatureBtns = document.querySelectorAll(".LigaturePresetBtn");
    LigatureBtns.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener
            (
                "click",
                () =>
                {
                    CurrentEditorLigatures = Btn.getAttribute("DataLigatures") === "true";
                    localStorage.setItem("TypstStudio_EditorLigatures", String(CurrentEditorLigatures));
                    ApplyEditorTypography();
                }
            );
        }
    );

    // Reset Button
    const ResetBtn = document.getElementById("ResetAppearanceBtn");
    if (ResetBtn)
    {
        ResetBtn.addEventListener
        (
            "click", () =>
            {
                CurrentUISettings.Scale = DEFAULT_UI_SETTINGS.Scale;
                CurrentUISettings.Font = DEFAULT_UI_SETTINGS.Font;
                CurrentUISettings.CustomFont = DEFAULT_UI_SETTINGS.CustomFont;
                ApplyUISettings();

                CurrentEditorFont = "iA Writer Duo";
                CurrentFocusEditorFont = "iA Writer Duo";
                UseDifferentFocusFont = false;
                CurrentEditorLineHeight = 1.55;
                CurrentEditorLigatures = true;
                localStorage.setItem("TypstStudio_EditorFont", "iA Writer Duo");
                localStorage.setItem("TypstStudio_FocusEditorFont", "iA Writer Duo");
                localStorage.setItem("TypstStudio_UseDifferentFocusFont", "false");
                localStorage.setItem("TypstStudio_EditorLineHeight", "1.55");
                localStorage.setItem("TypstStudio_EditorLigatures", "true");
                SetEditorFontSize(14);
                ApplyEditorTypography();
                ShowToast("Restored all interface and typography settings to defaults", "info");
            }
        );
    }

    UpdateEditorTypographyUI();
}

function DetectKnrSlop(Source, FileName = "main.typ")
{
    const Lines = (Source || "").split(/\r?\n/);
    const Errors = [];
    // Stack holds active openers: { Delim, Line, Col, LineText }
    const Stack = [];

    let InString = false;
    let InRawBlock = false;
    let InRawInline = false;
    let BlockCommentDepth = 0;
    const MaskCache = new Map();

    function IsEscaped(Str, Idx)
    {
        let SlashCount = 0;
        for (let I = Idx - 1; I >= 0 && Str[I] === "\\"; I --)
        {
            SlashCount ++;
        }
        return SlashCount % 2 === 1;
    }

    // Helper to get clean line text with strings/comments masked
    function GetMaskedLine(LineText)
    {
        const Cached = MaskCache.get(LineText);
        if (Cached !== undefined)
        {
            return Cached;
        }

        let Masked = "";
        let InStr = false;
        for (let I = 0; I < LineText.length; I ++)
        {
            const C = LineText[I];
            const NextC = I + 1 < LineText.length ? LineText[I + 1]: "";
            if (C === '"' && !IsEscaped(LineText, I))
            {
                InStr = ! InStr;
                Masked += " ";
                continue;
            }
            if (InStr)
            {
                Masked += " ";
                continue;
            }
            if (C === "/" && NextC === "/" && !IsEscaped(LineText, I))
            {
                Masked += " ".repeat(LineText.length - I);
                break;
            }
            Masked += C;
        }
        MaskCache.set(LineText, Masked);
        return Masked;
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineNum = LineIdx + 1;
        const LineText = Lines[LineIdx];
        let InLineComment = false;

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx ++)
        {
            const ColNum = ColIdx + 1;
            const Char = LineText[ColIdx];
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1]: "";
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1]: "";

            if (InLineComment) { break; }

            // Escaped characters in Typst: \(, \), \[, \], \{, \}, \$, \", \`
            if (IsEscaped(LineText, ColIdx))
            {
                continue;
            }

            // Raw blocks ```
            if (!InString && BlockCommentDepth === 0 && Char === "`")
            {
                if (LineText.substring(ColIdx, ColIdx + 3) === "```")
                {
                    InRawBlock = ! InRawBlock;
                    ColIdx += 2;
                    continue;
                }
                else if (!InRawBlock)
                {
                    InRawInline = ! InRawInline;
                    continue;
                }
            }
            if (InRawBlock || InRawInline) { continue; }
            // Block comments /* */
            if (!InString && Char === "/" && NextChar === "*")
            {
                BlockCommentDepth ++;
                ColIdx ++;
                continue;
            }
            if (!InString && BlockCommentDepth > 0 && Char === "*" && NextChar === "/")
            {
                BlockCommentDepth --;
                ColIdx ++;
                continue;
            }
            if (BlockCommentDepth > 0) { continue; }
            // Line comments //
            if (!InString && Char === "/" && NextChar === "/")
            {
                InLineComment = true;
                break;
            }
            // String literals "..."
            if (Char === '"' && PrevChar !== "\\")
            {
                InString = ! InString;
                continue;
            }
            if (InString) { continue; }
            // Multiline display math container: $
            if (Char === "$" && PrevChar !== "\\")
            {
                if (Stack.length > 0 && Stack[Stack.length - 1].Delim === "$")
                {
                    // Closer for $
                    const Opener = Stack.pop();
                    if (LineNum > Opener.Line)
                    {
                        // Multiline math container: evaluate Vector 1 and Vector 2
                        const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                        const MaskedCloserLine = GetMaskedLine(LineText);

                        const OpenerPrefixSemantic = MaskedOpenerLine.substring(0, Opener.Col - 1).replace(/[\(\[\{\$]/g, "").trim();
                        const OpenerSuffixSemantic = MaskedOpenerLine.substring(Opener.Col).replace(/[\(\[\{\$]/g, "").trim();

                        if (OpenerPrefixSemantic.length > 0)
                        {
                            const Anchor = OpenerPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Subtype: "PRECEDING",
                                Delim: "$",
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: Anchor,
                                Reason: "Preceding Semantic Content on Unpaired Opening Container"
                            });
                        }
                        else if (OpenerSuffixSemantic.length > 0)
                        {
                            const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 1,
                                Subtype: "PROCEEDING",
                                Delim: "$",
                                Line: Opener.Line,
                                Col: Opener.Col,
                                LineText: Lines[Opener.Line - 1],
                                Anchor: Anchor,
                                Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                            });
                        }

                        const CloserPrefixSemantic = MaskedCloserLine.substring(0, ColNum - 1).replace(/[\)\]\}\$]/g, "").trim();
                        const CloserSuffixSemantic = MaskedCloserLine.substring(ColNum).replace(/[\)\]\}\$]/g, "").trim();

                        if (CloserPrefixSemantic.length > 0)
                        {
                            const Anchor = CloserPrefixSemantic.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Subtype: "PRECEDING",
                                Delim: "$",
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: Anchor,
                                Reason: "Preceding Semantic Content on Unpaired Closing Container"
                            });
                        }
                        else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                        {
                            const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                            Errors.push
                            ({
                                Type: "KNR_SLOP",
                                Vector: 2,
                                Subtype: "PROCEEDING",
                                Delim: "$",
                                Line: LineNum,
                                Col: ColNum,
                                LineText: LineText,
                                Anchor: Anchor,
                                Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                            });
                        }
                    }
                }
                else
                {
                    // Opener for $
                    Stack.push
                    ({
                        Delim: "$",
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText
                    });
                }
                continue;
            }
            // Ignore Typst content literal parentheses, braces, and delimiters inside [...], e.g. [(], [)], [{], [}]
            if (Char === "(" || Char === ")" || Char === "{" || Char === "}" || Char === "$")
            {
                const OpenBracketIdx = LineText.lastIndexOf("[", ColIdx);
                const CloseBracketIdx = LineText.indexOf("]", ColIdx);
                if (OpenBracketIdx !== -1 && CloseBracketIdx !== -1 && OpenBracketIdx < ColIdx && CloseBracketIdx > ColIdx)
                {
                    const Between = LineText.substring(OpenBracketIdx + 1, CloseBracketIdx).trim();
                    if (Between === "(" || Between === ")" || Between === "{" || Between === "}" || Between === "$" || Between === "[" || Between === "]")
                    {
                        continue;
                    }
                }
            }

            // Standard containers: (, [, {
            if (Char === "(" || Char === "{" || Char === "[")
            {
                Stack.push
                ({
                    Delim: Char,
                    Line: LineNum,
                    Col: ColNum,
                    LineText: LineText
                });
            }
            else if (Char === ")" || Char === "}" || Char === "]")
            {
                const MatchDelim = Char === ")" ? "(": (Char === "}" ? "{": "[");

                // Check if closing delimiter matches top of stack
                if (Stack.length > 0 && Stack[Stack.length - 1].Delim === MatchDelim)
                {
                    const Opener = Stack.pop();
                    if (LineNum === Opener.Line)
                    {
                        continue;
                    }

                    const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                    const MaskedCloserLine = GetMaskedLine(LineText);

                    const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
                    const OpenerSuffix = MaskedOpenerLine.substring(Opener.Col).trim();
                    const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
                    const OpenerSuffixSemantic = OpenerSuffix.replace(/[\(\[\{\$]/g, "").trim();

                    if (OpenerPrefixSemantic.length > 0)
                    {
                        const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                        Errors.push
                        ({
                            Type: "KNR_SLOP",
                            Vector: 1,
                            Subtype: "PRECEDING",
                            Delim: Opener.Delim,
                            Line: Opener.Line,
                            Col: Opener.Col,
                            LineText: Lines[Opener.Line - 1],
                            Anchor: Anchor,
                            Reason: "Preceding Semantic Content on Unpaired Opening Container"
                        });
                    }
                    else if (OpenerSuffixSemantic.length > 0)
                    {
                        const Anchor = OpenerSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || OpenerSuffixSemantic;
                        Errors.push
                        ({
                            Type: "KNR_SLOP",
                            Vector: 1,
                            Subtype: "PROCEEDING",
                            Delim: Opener.Delim,
                            Line: Opener.Line,
                            Col: Opener.Col,
                            LineText: Lines[Opener.Line - 1],
                            Anchor: Anchor,
                            Reason: "Proceeding Semantic Content on Unpaired Opening Container"
                        });
                    }

                    const CloserPrefix = MaskedCloserLine.substring(0, ColNum - 1).trim();
                    const CloserSuffix = MaskedCloserLine.substring(ColNum).trim();
                    const CloserPrefixSemantic = CloserPrefix.replace(/[\)\]\}\$]/g, "").trim();
                    const CloserSuffixSemantic = CloserSuffix.replace(/[\)\]\}\$]/g, "").trim();

                    if (CloserPrefixSemantic.length > 0)
                    {
                        const Anchor = CloserPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || CloserPrefix;
                        Errors.push
                        ({
                            Type: "KNR_SLOP",
                            Vector: 2,
                            Subtype: "PRECEDING",
                            Delim: Char,
                            Line: LineNum,
                            Col: ColNum,
                            LineText: LineText,
                            Anchor: Anchor,
                            Reason: "Preceding Semantic Content on Unpaired Closing Container"
                        });
                    }
                    // Allow legal suffix glue: commas, semicolons, labels, method chaining (.filter(...)), assignment (=, = context), concatenation (+), or import aliases (as)
                    else if (CloserSuffixSemantic.length > 0 && !/^(,|;|\.|=|\+|as\b|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
                    {
                        const Anchor = CloserSuffixSemantic.match(/^([#a-zA-Z0-9_\-\.]+)/)?.[1] || CloserSuffixSemantic;
                        Errors.push
                        ({
                            Type: "KNR_SLOP",
                            Vector: 2,
                            Subtype: "PROCEEDING",
                            Delim: Char,
                            Line: LineNum,
                            Col: ColNum,
                            LineText: LineText,
                            Anchor: Anchor,
                            Reason: "Proceeding Semantic Content on Unpaired Closing Container"
                        });
                    }
                }
                else
                {
                    // Typst-aware content mode delimiter recovery:
                    // 1. If ']' closes an enclosing '[', discard any content-mode '(' or '{' inside that '['
                    if (Char === "]")
                    {
                        let BracketIdx = -1;
                        for (let SIdx = Stack.length - 1; SIdx >= 0; SIdx --)
                        {
                            if (Stack[SIdx].Delim === "[")
                            {
                                BracketIdx = SIdx;
                                break;
                            }
                        }
                        if (BracketIdx !== -1)
                        {
                            while (Stack.length > BracketIdx + 1)
                            {
                                Stack.pop();
                            }
                            const Opener = Stack.pop();
                            if (LineNum === Opener.Line)
                            {
                                continue;
                            }
                            const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                            const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
                            const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
                            if (OpenerPrefixSemantic.length > 0)
                            {
                                const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                                Errors.push
                                ({
                                    Type: "KNR_SLOP",
                                    Vector: 1,
                                    Subtype: "PRECEDING",
                                    Delim: "[",
                                    Line: Opener.Line,
                                    Col: Opener.Col,
                                    LineText: Lines[Opener.Line - 1],
                                    Anchor: Anchor,
                                    Reason: "Preceding Semantic Content on Unpaired Opening Container"
                                });
                            }
                            continue;
                        }
                    }

                    // 2. If ')' or '}' is encountered inside a content block '[' where no matching '(' or '{' was opened inside that block,
                    // in Typst markup mode it is literal text (e.g. '[)]', '[:)]', '[1) point]')
                    let InsideContentBlock = false;
                    for (let SIdx = Stack.length - 1; SIdx >= 0; SIdx --)
                    {
                        if (Stack[SIdx].Delim === "[")
                        {
                            InsideContentBlock = true;
                            break;
                        }
                    }
                    if (InsideContentBlock && (Char === ")" || Char === "}"))
                    {
                        // Literal punctuation in content block - not a syntax container error
                        continue;
                    }

                    Errors.push
                    ({
                        Type: "KNR_SLOP",
                        Vector: 2,
                        Subtype: "MISMATCH",
                        Delim: Char,
                        Line: LineNum,
                        Col: ColNum,
                        LineText: LineText,
                        Anchor: Char,
                        Reason: "Mismatched Closing Container not mirrored in the Opening Run"
                    });
                }
            }
        }
    }
    // Remaining unclosed openers that span beyond end of file
    for (const Opener of Stack)
    {
        if (Lines.length > Opener.Line)
        {
            const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
            const OpenerPrefix = MaskedOpenerLine.substring(0, Opener.Col - 1).trim();
            const OpenerPrefixSemantic = OpenerPrefix.replace(/[\(\[\{\$]/g, "").trim();
            if (OpenerPrefixSemantic.length > 0)
            {
                const Anchor = OpenerPrefix.match(/([#a-zA-Z0-9_\-\.]+)\s*$/)?.[1] || OpenerPrefix;
                Errors.push
                ({
                    Type: "KNR_SLOP",
                    Vector: 1,
                    Subtype: "PRECEDING",
                    Delim: Opener.Delim,
                    Line: Opener.Line,
                    Col: Opener.Col,
                    LineText: Lines[Opener.Line - 1],
                    Anchor: Anchor,
                    Reason: "Preceding Semantic Content on Unpaired Opening Container"
                });
            }
        }
    }
    // Deduplicate errors by Line + Col + Vector + Subtype
    const UniqueErrors = [];
    const SeenKeys = new Set();
    for (const Err of Errors)
    {
        const Key = `${Err.Line}:${Err.Col}:${Err.Vector}:${Err.Subtype}`;
        if (!SeenKeys.has(Key))
        {
            SeenKeys.add(Key);
            UniqueErrors.push(Err);
        }
    }

    if (UniqueErrors.length === 0)
    {
        return { HasError: false, Errors:[] };
    }

    const First = UniqueErrors[0];
    const LineStr = String(First.Line);
    const Margin = " ".repeat(Math.max(2, LineStr.length));
    const FormattedLineNum = LineStr.padStart(Margin.length, " ");
    const PointerIndent = " ".repeat(Math.max(0, First.Col - 1));
    const AnchorTarget = First.Anchor ? `'${First.Anchor}'`: "the statement";

    let ActionHint = "";
    if (First.Vector === 1)
    {
        if (First.Subtype === "PRECEDING")
        {
            ActionHint = `Move opening container '${First.Delim}' to a new line aligned with ${AnchorTarget} and indent it properly if needed`;
        }
        else
        {
            ActionHint = `Move semantic content proceeding '${First.Delim}' to a new line indented within the container`;
        }
    }
    else if (First.Vector === 2)
    {
        if (First.Subtype === "PRECEDING")
        {
            ActionHint = `Move closing container '${First.Delim}' to a new line aligned with the opening container`;
        }
        else if (First.Subtype === "PROCEEDING")
        {
            ActionHint = `Move semantic content proceeding '${First.Delim}' to a new line`;
        }
        else if (First.Subtype === "MISMATCH")
        {
            ActionHint = `Closing container '${First.Delim}' does not mirror the opening container run in reverse sequence`;
        }
        else
        {
            ActionHint = `Format closing container '${First.Delim}' onto its own coordinate-aligned line`;
        }
    }
    else
    {
        ActionHint = `Move container '${First.Delim}' to a new line aligned with ${AnchorTarget} and indent it properly if needed`;
    }

    const FormattedMessage =
    `error: Severe Critical Fatal Error & Structural Failure: Defecated (Deprecated | Outdated | Legacy) Structural Failure of 1978 K&R Slop detected: Headless multiline container: Container Asymmetry & Ugly Formatting are strictly Forbidden.
${Margin}┌─ ${FileName}:${First.Line}:${First.Col}
${Margin}│
${FormattedLineNum}│ ${First.LineText}
${Margin}│${PointerIndent}^ ${ActionHint}
${Margin}│
Hint: Click the button "Format LAFS" to fix it.`;

    return {
        HasError: true,
        Errors: UniqueErrors,
        PrimaryError: First,
        FormattedMessage: FormattedMessage
    };
}

let LastValidatedVersionId = - 1;
let LastValidatedResult = { HasError: false, Errors:[] };

function ValidateEditorLAFS()
{
    if (!MonacoInstance)
    {
        return { HasError: false, Errors:[] };
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return { HasError: false, Errors:[] };
    }

    const CurrentVersion = Model.getAlternativeVersionId();
    if (CurrentVersion === LastValidatedVersionId && LastValidatedResult)
    {
        return LastValidatedResult;
    }

    const Source = Model.getValue();
    const ActiveFileName = CurrentFilePath ? CurrentFilePath.split(/[\/\\]/).pop(): "main.typ";
    const KnrResult = DetectKnrSlop(Source, ActiveFileName);

    LastValidatedVersionId = CurrentVersion;
    LastValidatedResult = KnrResult;

    if (KnrResult.HasError)
    {
        const Markers = KnrResult.Errors.map
        (
            (Err) =>
            ({
                severity: monaco.MarkerSeverity.Error,
                message: `Defecated (Deprecated | Outdated | Legacy) Structural Failure of 1978 K&R Slop detected (Vector ${Err.Vector || 1}): ${Err.Reason}. Hint: Click 'Format LAFS' to fix it.`,
                startLineNumber: Err.Line,
                startColumn: Err.Col,
                endLineNumber: Err.Line,
                endColumn: Err.Col + 1
            })
        );
        monaco.editor.setModelMarkers(Model, "lafs-validator", Markers);
    }
    else
    {
        monaco.editor.setModelMarkers(Model, "lafs-validator",[]);
        const ErrorContent = document.getElementById("ErrorContent");
        if (ErrorContent && ErrorContent.textContent.includes("1978 K&R Slop"))
        {
            const ErrorDrawer = document.getElementById("ErrorDrawer");
            if (ErrorDrawer)
            {
                ErrorDrawer.classList.remove("Visible");
            }
        }
    }

    return KnrResult;
}

function InProcessFormatSnippetLAFS(Code)
{
    const Lines = (Code || "").split(/\r?\n/);
    const Out = [];
    for (let Line of Lines)
    {
        const Trimmed = Line.trim();
        const Match = Trimmed.match(/^(.*?)\s*\{$/);
        if (Match && !Trimmed.startsWith("{"))
        {
            const Indent = Line.match(/^\s*/)[0];
            Out.push(`${Indent}${Match[1]}`);
            Out.push(`${Indent}{`);
            continue;
        }
        Out.push(Line);
    }
    return Out.join("\n");
}

function FormatTypstLAFS(Source)
{
    const Lines = Source.split(/\r?\n/);
    const ResultLines = [];
    let InRawBlock = false;
    let CurrentRawLines = [];
    let InBlockComment = false;

    for (let I = 0; I < Lines.length; I ++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            if (!InRawBlock)
            {
                InRawBlock = true;
                CurrentRawLines = [];
                ResultLines.push(Line);
            }
            else
            {
                InRawBlock = false;
                const RawCode = CurrentRawLines.join("\n");
                if (RawCode.trim().length > 0)
                {
                    ResultLines.push(InProcessFormatSnippetLAFS(RawCode));
                }
                else
                {
                    ResultLines.push(...CurrentRawLines);
                }
                ResultLines.push(Line);
            }
            continue;
        }

        if (InRawBlock)
        {
            CurrentRawLines.push(Line);
            continue;
        }

        if (Trimmed.startsWith("/*") && !Trimmed.includes("*/"))
        {
            InBlockComment = true;
            ResultLines.push(Line);
            continue;
        }

        if (InBlockComment)
        {
            if (Trimmed.includes("*/")) { InBlockComment = false; }
            ResultLines.push(Line);
            continue;
        }

        if (Trimmed === "" || Trimmed.startsWith("//"))
        {
            ResultLines.push(Line);
            continue;
        }

        // Standalone equals sign on its own line: '='
        // Attach '=' to the end of the previous parameter run or closure signature
        if (Trimmed === "=")
        {
            let Attached = false;
            for (let PrevIdx = ResultLines.length - 1; PrevIdx >= 0; PrevIdx--)
            {
                const PrevTrim = ResultLines[PrevIdx].trim();
                if (PrevTrim === "" || PrevTrim.startsWith("//") || PrevTrim.startsWith("/*"))
                {
                    continue;
                }
                if (PrevTrim.endsWith(")") || PrevTrim.endsWith("]"))
                {
                    ResultLines[PrevIdx] = ResultLines[PrevIdx] + " =";
                    Attached = true;
                }
                break;
            }
            if (Attached)
            {
                continue;
            }
        }

        // If this line is an opening '{' (or starts with '{')
        // Ensure let bindings have '=' attached before '{'
        if (Trimmed === "{" || Trimmed.startsWith("{\n") || Trimmed.startsWith("{ "))
        {
            for (let PrevIdx = ResultLines.length - 1; PrevIdx >= 0; PrevIdx--)
            {
                const PrevTrim = ResultLines[PrevIdx].trim();
                if (PrevTrim === "" || PrevTrim.startsWith("//") || PrevTrim.startsWith("/*"))
                {
                    continue;
                }
                if (PrevTrim.endsWith(")") && !PrevTrim.endsWith("=") && !PrevTrim.endsWith("=>"))
                {
                    let IsLet = false;
                    for (let ScanIdx = PrevIdx; ScanIdx >= 0 && ScanIdx >= PrevIdx - 20; ScanIdx--)
                    {
                        const ScanTrim = ResultLines[ScanIdx].trim();
                        if (ScanTrim.startsWith("#let ") || ScanTrim.startsWith("let "))
                        {
                            IsLet = true;
                            break;
                        }
                        if (ScanTrim.endsWith("}") || ScanTrim.endsWith(";"))
                        {
                            break;
                        }
                    }
                    if (IsLet)
                    {
                        ResultLines[PrevIdx] = ResultLines[PrevIdx] + " =";
                    }
                }
                break;
            }
        }

        // Already pure opening delimiter or compound delimiter run on its own line: '({', '([', '{', '(', '['
        if (/^[\(\[\{]+$/.test(Trimmed))
        {
            ResultLines.push(Line);
            continue;
        }

        // Already pure closing delimiter or compound delimiter run: '})', '])', '}', ')', ']', optionally with trailing punctuation
        if (/^[\)\]\}]+[;,]?$/.test(Trimmed))
        {
            ResultLines.push(Line);
            continue;
        }

        // Typst content literals on their own line: '[(]', '[)]', '[,]', '[.]', '[..]'
        if (/^\s*\[\s*[\(\)\,\.\;\:\-\+\*\/\`]+\s*\][;,]?$/.test(Line))
        {
            ResultLines.push(Line);
            continue;
        }

        // Check if inside string literal or single-line raw block
        if ((Trimmed.startsWith("`") && Trimmed.endsWith("`") && Trimmed.length >= 2) ||
            (Trimmed.startsWith('"') && Trimmed.endsWith('"') && Trimmed.length >= 2))
        {
            ResultLines.push(Line);
            continue;
        }

        // Handle '} else if (...) {' or '} else {'
        const ElseIfMatch = Trimmed.match(/^(\})\s*(else\s+if\s+.*?)(\s*\{)?$/);
        if (ElseIfMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}}`);
            ResultLines.push(`${Indent}${ElseIfMatch[2]}`);
            if (ElseIfMatch[3] || Trimmed.endsWith("{")) { ResultLines.push(`${Indent}{`); }
            continue;
        }

        const ElseMatch = Trimmed.match(/^(\})\s*(else)(\s*\{)?$/);
        if (ElseMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}}`);
            ResultLines.push(`${Indent}else`);
            if (ElseMatch[3] || Trimmed.endsWith("{")) { ResultLines.push(`${Indent}{`); }
            continue;
        }

        // Handle trailing single or compound opening delimiters '{', '(', '({', '([', '[{' on multiline constructs
        const EndsWithDelimiter = Trimmed.match(/^(.*?)(\s*)([\{\(\[]+)\s*$/);
        if (EndsWithDelimiter)
        {
            const Prefix = EndsWithDelimiter[1].trim();
            const Delims = EndsWithDelimiter[3];
            const Indent = Line.match(/^\s*/)[0];

            if (Prefix !== "" && !Prefix.includes("//"))
            {
                // Ensure prefix does not end with backtick or unclosed quote
                const Backticks = (Prefix.match(/`/g) || []).length;
                const Quotes = (Prefix.match(/"/g) || []).length;
                if (Backticks % 2 === 0 && Quotes % 2 === 0)
                {
                    ResultLines.push(`${Indent}${Prefix}`);
                    ResultLines.push(`${Indent}${Delims}`);
                    continue;
                }
            }
        }

        // Handle control flow statements like 'if ... {' or 'while ... {' or 'for ... {'
        const ControlMatch = Trimmed.match(/^(if\s+.*?|while\s+.*?|for\s+.*?|context)\s*\{$/);
        if (ControlMatch)
        {
            const Indent = Line.match(/^\s*/)[0];
            ResultLines.push(`${Indent}${ControlMatch[1]}`);
            ResultLines.push(`${Indent}{`);
            continue;
        }

        ResultLines.push(Line);
    }

    return ResultLines.join("\n");
}

async function ApplyFormattingToEditor()
{
    if (!MonacoInstance) { return; }
    CaptureTimelineSnapshot("Before LAFS Format");
    const CurrentValue = MonacoInstance.getValue();
    let FormattedValue = null;

    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            const Resp = await window.__TAURI__.core.invoke("FormatTypst", { source: CurrentValue, Source: CurrentValue });
            if (Resp && Resp.Success && Resp.Formatted)
            {
                FormattedValue = Resp.Formatted;
            }
        }
        catch (Err)
        {
            console.warn("Tauri FormatTypst fallback:", Err);
        }
    }

    if (!FormattedValue && typeof fetch === "function")
    {
        try
        {
            await EnsureSessionAuthToken();
            const Resp = await fetch
            (
                "/api/format",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "X-Typst-Auth-Token": SessionAuthToken || ""
                    },
                    body: JSON.stringify( { Source: CurrentValue })
                }
            );
            if (Resp.ok)
            {
                const Json = await Resp.json();
                if (Json.Success && Json.Formatted)
                {
                    FormattedValue = Json.Formatted;
                }
            }
        }
        catch (Err)
        {
            // Fallback to client-side
        }
    }

    if (!FormattedValue)
    {
        FormattedValue = FormatTypstLAFS(CurrentValue);
    }

    if (CurrentValue !== FormattedValue)
    {
        const FullRange = MonacoInstance.getModel().getFullModelRange();
        MonacoInstance.executeEdits
        (
            "format-lafs",[ { range: FullRange, text: FormattedValue }]
        );
        MonacoInstance.pushUndoStop();
        TriggerCompileNow();
        ShowToast("Formatted to LAFS standard", "info");
    }
}

function InitializeMonaco()
{
    return new Promise
    (
        async (Resolve) =>
        {
            if (MonacoInstance)
            {
                Resolve(MonacoInstance);
                return ;
            }

            await EnsureSessionAuthToken();

            let Attempts = 0;
            const MaxAttempts = 100;

            const CheckAndInit = () =>
            {
                Attempts ++;
                if (typeof window.require !== "undefined" && typeof window.require.config === "function")
                {
                    const RootBaseUrl = new URL(".", window.location.href).href;
                    const WorkerMainUrl = new URL("vs/base/worker/workerMain.js", window.location.href).href;
                    window.MonacoEnvironment =
                    {
                        baseUrl: RootBaseUrl,
                        getWorkerUrl: function(WorkerId, Label)
                        {
                            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                                self.MonacoEnvironment = {
                                    baseUrl: '${RootBaseUrl}'
                                };
                                try
                                {
                                    importScripts('${WorkerMainUrl}');
                                }
                                catch (IgnoredWorkerErr)
                                {
                                    importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/base/worker/workerMain.js');
                                }
                            `)}`;
                        }
                    };

                    try
                    {
                        window.require.config
                        ({
                            paths: { vs: "vs" }
                        });
                    }
                    catch (ConfigErr)
                    {
                        console.warn("Monaco local path config error:", ConfigErr);
                    }

                    window.require
                    (
                        ["vs/editor/editor.main"],
                        () =>
        {
            monaco.languages.register( { id: "typst" });

            monaco.languages.setLanguageConfiguration
            (
                "typst",
                {
                    comments:
                    {
                        lineComment: "//",
                        blockComment:["/*", "*/"]
                    },
                    brackets:
                    [
                        ["{", "}"],["[", "]"],["(", ")"]
                    ],
                    autoClosingPairs:
                    [
                        { open: "{", close: "}" },
                        { open: "[", close: "]" },
                        { open: "(", close: ")" },
                        { open: '"', close: '"' },
                        { open: "$", close: "$" }
                    ],
                    surroundingPairs:
                    [
                        { open: "{", close: "}" },
                        { open: "[", close: "]" },
                        { open: "(", close: ")" },
                        { open: '"', close: '"' },
                        { open: "$", close: "$" }
                    ]
                }
            );

            monaco.languages.setMonarchTokensProvider
            (
                "typst",
                {
                    keywords:
                    [
                        "let", "set", "show", "context", "if", "else", "while",
                        "for", "in", "return", "import", "include", "as"
                    ],
                    constants:
                    [
                        "none", "auto", "true", "false"
                    ],
                    builtins:
                    [
                        "align", "text", "par", "page", "v", "h", "grid", "table",
                        "image", "heading", "list", "enum", "rect", "circle",
                        "calc", "counter", "line", "pagebreak", "columns",
                        "box", "block", "stack", "place", "move", "rotate", "scale", "hide", "repeat",
                        "path", "polygon", "curve", "link", "outline", "bibliography", "cite",
                        "figure", "caption", "footnote", "quote", "raw", "state", "query", "locate",
                        "measure", "layout", "datetime", "regex", "bytes", "duration", "version",
                        "type", "repr", "str", "int", "float", "array", "dictionary", "arguments",
                        "rgb", "cmyk", "luma", "color", "gradient", "pattern", "stroke", "vec", "mat"
                    ],
                    tokenizer:
                    {
                        root:
                        [
                            [/\/\/.*$/, "comment"],[/\/\*/, "comment", "@comment"],[/```/, "markup.raw.block", "@rawblock"],[/`[^`\n]*`/, "markup.raw.inline"],
                            [
                                /"([^"\\]|\\.)*"/, "string"
                            ],
                            [/\$[^$\n]*\$/, "string.math"],[/^(\s*=+)(.*)$/,["keyword.heading", "markup.heading.text"]],
                            [
                                /<[a-zA-Z0-9_\-:]+>/, "entity.name.label"
                            ],
                            [/@[a-zA-Z0-9_\-:]+/, "entity.name.reference"],[/\*([^*]+)\*/, "markup.bold"],[/_([^_]+)_/, "markup.italic"],
                            [
                                /\\([#$*_\-\\@[\]{}])/, "constant.character.escape"
                            ],
                            [/\\$/, "constant.character.escape"],[/^\s*[-+]\s+/, "punctuation.list"],[/([a-zA-Z_]\w*)\s*(?=:)/, "variable.parameter"],
                            [
                                /#([a-zA-Z_]\w*)/, "keyword"
                            ],
                            [
                                /[a-zA-Z_]\w*/,
                                {
                                    cases:
                                    {
                                        "@keywords": "keyword",
                                        "@constants": "constant.language",
                                        "@builtins": "type.identifier",
                                        "@default": "identifier"
                                    }
                                }
                            ],
                            // Typst content literals like [(], [)], [{], [}], [,], [.], [..]
                            [/\[\s*[\(\)\{\}\[\]\.,:;\\` ]+\s*\]/, "markup.content.literal"],
                            [/[{}()\[\]]/, "@brackets"],[/\d+(\.\d+)?(pt|in|cm|mm|em|fr|%|deg|rad)?/, "number"],[/[=+\-*/<>!&|~]/, "operator"]
                        ],
                        comment:
                        [
                            [/[^\/*]+/, "comment"],[/\*\//, "comment", "@pop"],[/[\/*]/, "comment"]
                        ],
                        rawblock:
                        [
                            [/[^`]+/, "markup.raw.block"],[/```/, "markup.raw.block", "@pop"],[/`/, "markup.raw.block"]
                        ]
                    }
                }
            );
            // Rich Vibrant Syntax Highlighting against Monochrome Canvas
            monaco.editor.defineTheme
            (
                "typst-vibrant",
                {
                    base: "vs-dark",
                    inherit: true,
                    rules:
                    [
                        { token: "keyword", foreground: "bc8cff", fontStyle: "bold" },
                        { token: "keyword.heading", foreground: "f472b6", fontStyle: "bold" },
                        { token: "markup.heading.text", foreground: "38bdf8", fontStyle: "bold" },
                        { token: "type.identifier", foreground: "79c0ff", fontStyle: "bold" },
                        { token: "variable.parameter", foreground: "93c5fd" },
                        { token: "entity.name.label", foreground: "38bdf8", fontStyle: "bold" },
                        { token: "entity.name.reference", foreground: "38bdf8", fontStyle: "italic" },
                        { token: "constant.language", foreground: "f472b6", fontStyle: "bold" },
                        { token: "constant.character.escape", foreground: "f472b6", fontStyle: "bold" },
                        { token: "markup.raw.inline", foreground: "4ade80" },
                        { token: "markup.raw.block", foreground: "86efac" },
                        { token: "markup.bold", foreground: "ffffff", fontStyle: "bold" },
                        { token: "markup.italic", foreground: "e0e7ff", fontStyle: "italic" },
                        { token: "punctuation.list", foreground: "bc8cff", fontStyle: "bold" },
                        { token: "identifier", foreground: "f0f6fc" },
                        { token: "comment", foreground: "8b949e", fontStyle: "italic" },
                        { token: "string", foreground: "a5d6ff" },
                        { token: "string.math", foreground: "e0aaff" },
                        { token: "number", foreground: "34d399" },
                        { token: "operator", foreground: "d2a8ff" }
                    ],
                    colors:
                    {
                        "editor.background": "#0A0A0A",
                        "editor.foreground": "#F0F6FC",
                        "editor.lineHighlightBackground": "#141414",
                        "editorLineNumber.foreground": "#444444",
                        "editorLineNumber.activeForeground": "#FFFFFF",
                        "editorCursor.foreground": "#FFFFFF",
                        "editorWhitespace.foreground": "#202020",
                        "editor.selectionBackground": "#7100FF77",
                        "editor.inactiveSelectionBackground": "#7100FF44",
                        "editor.selectionHighlightBackground": "#7100FF33",
                        "editor.selectionHighlightBorder": "#7100FF66",
                        "editor.wordHighlightBackground": "#00000000",
                        "editor.wordHighlightStrongBackground": "#00000000",
                        "editor.wordHighlightTextBackground": "#00000000",
                        "editor.wordHighlightBorder": "#00000000",
                        "editor.wordHighlightStrongBorder": "#00000000",
                        "editor.wordHighlightTextBorder": "#00000000", // Rainbow Brackets Palette (Depth levels 1 to 6 - Pure Neon & Pastel Spectrum)
                        "editorBracketHighlight.foreground1": "#7100FFFF",
                        "editorBracketHighlight.foreground2": "#F472B6",
                        "editorBracketHighlight.foreground3": "#A855F7",
                        "editorBracketHighlight.foreground4": "#4ADE80",
                        "editorBracketHighlight.foreground5": "#FB7185",
                        "editorBracketHighlight.foreground6": "#818CF8",
                        "editorBracketHighlight.unexpectedBracket.foreground": "#FF5555", // Matching Bracket Pair Connecting Guide Lines
                        "editorBracketPairGuide.activeBackground1": "#7100FFFF",
                        "editorBracketPairGuide.activeBackground2": "#F472B6",
                        "editorBracketPairGuide.activeBackground3": "#A855F7",
                        "editorBracketPairGuide.activeBackground4": "#4ADE80",
                        "editorBracketPairGuide.activeBackground5": "#FB7185",
                        "editorBracketPairGuide.activeBackground6": "#818CF8",
                        "editorBracketPairGuide.background1": "#7100FF55",
                        "editorBracketPairGuide.background2": "#F472B655",
                        "editorBracketPairGuide.background3": "#A855F755",
                        "editorBracketPairGuide.background4": "#4ADE8055",
                        "editorBracketPairGuide.background5": "#FB718555",
                        "editorBracketPairGuide.background6": "#818CF855", // Matching Indentation Guides Palette (Depth levels 1 to 6)
                        "editorIndentGuide.background1": "#7100FF55",
                        "editorIndentGuide.background2": "#F472B655",
                        "editorIndentGuide.background3": "#A855F755",
                        "editorIndentGuide.background4": "#4ADE8055",
                        "editorIndentGuide.background5": "#FB718555",
                        "editorIndentGuide.background6": "#818CF855",
                        "editorIndentGuide.activeBackground1": "#7100FFFF",
                        "editorIndentGuide.activeBackground2": "#F472B6",
                        "editorIndentGuide.activeBackground3": "#A855F7",
                        "editorIndentGuide.activeBackground4": "#4ADE80",
                        "editorIndentGuide.activeBackground5": "#FB7185",
                        "editorIndentGuide.activeBackground6": "#818CF8"
                    }
                }
            );
            // Typst IntelliSense & LAFS Snippets Provider (Priority 1)
            monaco.languages.registerCompletionItemProvider
            (
                "typst",
                {
                    triggerCharacters:["#", "$", "@", "<", ".", " ", ":", "/", "\\"],
                    provideCompletionItems: (Model, Position) =>
                    {
                        const Word = Model.getWordUntilPosition(Position);
                        const Range =
                        {
                            startLineNumber: Position.lineNumber,
                            endLineNumber: Position.lineNumber,
                            startColumn: Word.startColumn,
                            endColumn: Word.endColumn
                        };

                        const Suggestions = [];
                        // 1. LAFS Snippets with Allman detached delimiters
                        const Snippets =
                        [
                            {
                                label: "mat (LAFS Matrix)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "mat\n(\n\t${1:1}, ${2:2};\n\t${3:3}, ${4:4}\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "2D Matrix with LAFS Allman detached delimiters",
                                detail: "LAFS Matrix"
                            },
                            {
                                label: "vec (LAFS Vector)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "vec\n(\n\t${1:x},\n\t${2:y}\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Vector with LAFS Allman detached delimiters",
                                detail: "LAFS Vector"
                            },
                            {
                                label: "cases (LAFS Cases)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "cases\n(\n\t${1:1} \"if\" ${2:x > 0},\n\t${3:0} \"otherwise\"\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Piecewise cases with LAFS Allman detached delimiters",
                                detail: "LAFS Cases"
                            },
                            {
                                label: "table (LAFS Table)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#table\n(\n\tcolumns: (${1:1fr, 1fr}),\n\tstroke: 0.5pt + rgb(\"CCCCCC\"),\n\ttable.header([*${2:Header 1}*], [*${3:Header 2}*]),\n\t[${4:Item 1}], [${5:Value 1}]\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Table with LAFS Allman detached delimiters and headers",
                                detail: "LAFS Table"
                            },
                            {
                                label: "table-merged (LAFS Merged Cells)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#table\n(\n\tcolumns: (${1:1.5fr, 1fr, 1.2fr, 2fr}),\n\tstroke: 0.5pt + rgb(\"CCCCCC\"),\n\ttable.header\n\t(\n\t\ttable.cell(colspan: 4, fill: rgb(\"E4E9F0\"))[*${2:Full Title}*]\n\t),\n\ttable.cell(rowspan: 2, fill: rgb(\"FAFAFA\"))[*${3:Group}*],\n\t[${4:Sub 1}], [${5:4.2 ms}], [${6:Incremental Allman AST}],\n\t[${7:Sub 2}], [${8:18.7 ms}], [${9:Vector Layout Engine}]\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Table with merged cells (colspan & rowspan) in LAFS",
                                detail: "LAFS Merged Table"
                            },
                            {
                                label: "setpage (LAFS Page Setup)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#set page\n(\n\tpaper: \"${1:a4}\",\n\tmargin: ${2:2.5cm}\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Configure page paper size and margins in LAFS",
                                detail: "LAFS Page Setup"
                            },
                            {
                                label: "settext (LAFS Typography Setup)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#set text\n(\n\tfont: \"${1:Times New Roman}\",\n\tsize: ${2:11pt}\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Configure font family and size in LAFS",
                                detail: "LAFS Typography Setup"
                            },
                            {
                                label: "setpar (LAFS Paragraph Setup)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#set par\n(\n\tjustify: ${1:true},\n\tleading: ${2:0.75em}\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Configure paragraph justification and leading in LAFS",
                                detail: "LAFS Paragraph Setup"
                            },
                            {
                                label: "figure (LAFS Figure)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#figure\n(\n\t${1:content},\n\tcaption: [${2:Caption description}]\n) <${3:fig:label}>",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Numbered figure with caption and label in LAFS",
                                detail: "LAFS Figure"
                            },
                            {
                                label: "grid (LAFS Grid)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#grid\n(\n\tcolumns: (${1:1fr, 1fr}),\n\tgutter: ${2:10pt},\n\t[${3:Left}],\n\t[${4:Right}]\n)",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Multi-column grid in LAFS",
                                detail: "LAFS Grid"
                            },
                            {
                                label: "let-func (LAFS Function)",
                                kind: monaco.languages.CompletionItemKind.Snippet,
                                insertText: "#let ${1:FunctionName}(${2:Param1, Param2}) =\n{\n\t${3:[Result content]}\n}",
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                documentation: "Turing-complete functional helper in LAFS",
                                detail: "LAFS Function"
                            }
                        ];
                        for (const S of Snippets)
                        {
                            Suggestions.push( { ...S, range: Range });
                        }
                        // 2. Builtin Functions & Primitives
                        const Builtins =
                        [
                            { label: "align", detail: "align(alignment)[body]", insertText: "align(${1:center})[\n\t${2:body}\n]" },
                            { label: "text", detail: "text(size, fill)[content]", insertText: "text(${1:11pt})[${2:content}]" },
                            { label: "par", detail: "par(justify: true)[...]", insertText: "par(justify: ${1:true})[\n\t${2:content}\n]" },
                            { label: "image", detail: "image(path, width: ...)", insertText: "image(\"${1:path.png}\", width: ${2:100%})" },
                            {
                                label: "rect", detail: "rect(width, height, fill)", insertText: "rect(width: ${1:100%}, height: ${2:30pt}, fill: rgb(\"${3:4338CA}\"))"
                            },
                            { label: "circle", detail: "circle(radius, fill)", insertText: "circle(radius: ${1:15pt}, fill: rgb(\"${2:6366F1}\"))" },
                            { label: "columns", detail: "columns(n)[body]", insertText: "columns(${1:2})[\n\t${2:body}\n]" },
                            { label: "line", detail: "line(length, stroke)", insertText: "line(length: ${1:100%}, stroke: ${2:0.5pt + rgb(\"CCCCCC\")})" },
                            { label: "v", detail: "v(spacing)", insertText: "v(${1:1em})" },
                            { label: "h", detail: "h(spacing)", insertText: "h(${1:1fr})" },
                            { label: "box", detail: "box(inset: ...)[...]", insertText: "box(inset: ${1:4pt})[${2:content}]" },
                            {
                                label: "block", detail: "block(fill: ...)[...]", insertText: "block(fill: rgb(\"${1:F1F3F6}\"), inset: ${2:8pt})[\n\t${3:content}\n]"
                            },
                            { label: "outline", detail: "outline(title: ...)", insertText: "outline(title: \"${1:Document Index}\", indent: ${2:1.5em})" },
                            { label: "footnote", detail: "footnote[text]", insertText: "footnote[${1:Footnote text}]" },
                            { label: "bibliography", detail: "bibliography(path)", insertText: "bibliography(\"${1:works.bib}\")" },
                            { label: "cite", detail: "@key citation", insertText: "@${1:key}" }
                        ];
                        for (const B of Builtins)
                        {
                            Suggestions.push
                            ({
                                label: B.label,
                                kind: monaco.languages.CompletionItemKind.Function,
                                insertText: B.insertText,
                                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                                detail: B.detail,
                                range: Range
                            });
                        }
                        // 3. Keywords
                        const Keywords = ["let", "set", "show", "context", "if", "else", "while", "for", "in", "return", "import", "include"];
                        for (const Kw of Keywords)
                        {
                            Suggestions.push
                            ({
                                label: Kw,
                                kind: monaco.languages.CompletionItemKind.Keyword,
                                insertText: Kw,
                                range: Range
                            });
                        }
                        // 4. Math symbols & Greek
                        const MathSymbols =
                        [
                            "alpha", "beta", "gamma", "delta", "epsilon", "zeta", "eta", "theta",
                            "iota", "kappa", "lambda", "mu", "nu", "xi", "pi", "rho", "sigma",
                            "tau", "upsilon", "phi", "chi", "psi", "omega", "infinity", "nabla",
                            "partial", "dif", "times", "integral", "sum", "product", "lim",
                            "sqrt", "root", "binom", "abs", "norm", "arrow", "hat", "tilde",
                            "dot", "dot.double", "macron"
                        ];
                        for (const Sym of MathSymbols)
                        {
                            Suggestions.push
                            ({
                                label: Sym,
                                kind: monaco.languages.CompletionItemKind.Variable,
                                insertText: Sym,
                                detail: "Math Symbol",
                                range: Range
                            });
                        }

                        if (CachedAvailableFonts && CachedAvailableFonts.length > 0)
                        {
                            for (const FontName of CachedAvailableFonts)
                            {
                                Suggestions.push
                                ({
                                    label: FontName,
                                    kind: monaco.languages.CompletionItemKind.Color,
                                    insertText: `"${FontName}"`,
                                    detail: "Available Font Family",
                                    range: Range
                                });
                            }
                        }

                        return { suggestions: Suggestions };
                    }
                }
            );

            const Container = document.getElementById("MonacoContainer");
            MonacoInstance = monaco.editor.create
            (
                Container,
                {
                    value: TEMPLATES.showcase,
                    language: "typst",
                    theme: "typst-vibrant",
                    automaticLayout: true,
                    fontSize: CurrentEditorFontSize,
                    lineHeight: Math.round(CurrentEditorFontSize * CurrentEditorLineHeight),
                    mouseWheelZoom: true,
                    fontFamily: GetEditorFontStack(CurrentUIMode === "focus" && UseDifferentFocusFont ? CurrentFocusEditorFont : CurrentEditorFont),
                    fontWeight: "400",
                    fontLigatures: CurrentEditorLigatures ? "'calt', 'liga', 'dlig', 'hlig'": false,
                    minimap:
                    {
                        enabled: true,
                        renderCharacters: false,
                        maxColumn: 60
                    },
                    bracketPairColorization:
                    {
                        enabled: true,
                        independentColorPoolPerBracketType: false
                    },
                    guides:
                    {
                        bracketPairs: true,
                        bracketPairsHorizontal: "active",
                        highlightActiveBracketPair: true,
                        indentation: true,
                        highlightActiveIndentation: "always"
                    },
                    wordWrap: "on",
                    wrappingStrategy: "simple",
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    // Extreme performance flags for ultra-smooth 60/120 FPS scrolling through large text
                    maxTokenizationLineLength: 20000,
                    stopRenderingLineAfter: 4000,
                    largeFileOptimizations: true,
                    disableMonospaceOptimizations: false,
                    unicodeHighlight: { ambiguousCharacters: false },
                    smoothScrolling: true,
                    fastScrollSensitivity: 7,
                    renderLineHighlight: "none",
                    occurrencesHighlight: "off",
                    overviewRulerLanes: 0,
                    links: false,
                    renderWhitespace: "none",
                    scrollbar:
                    {
                        vertical: "visible",
                        horizontal: "auto",
                        useShadows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                    }
                }
            );

            window.MonacoInstance = MonacoInstance;

            if (PendingInitialFileContent && PendingInitialFileContent.Content !== undefined)
            {
                MonacoInstance.setValue(PendingInitialFileContent.Content);
                MarkDocumentClean(PendingInitialFileContent.Content);
                PendingInitialFileContent = null;
            }

            SyncLineDecorations = MonacoInstance.createDecorationsCollection([]);

            MonacoInstance.onDidChangeConfiguration
            (
                (Event) =>
                {
                    if (Event.hasChanged(monaco.editor.EditorOption.fontSize))
                    {
                        const RawSize = MonacoInstance.getOption(monaco.editor.EditorOption.fontSize);
                        const ClampedSize = Math.max(10, Math.min(28, RawSize || 14));
                        if (ClampedSize !== RawSize)
                        {
                            MonacoInstance.updateOptions({ fontSize: ClampedSize });
                        }
                        if (ClampedSize && ClampedSize !== CurrentEditorFontSize)
                        {
                            CurrentEditorFontSize = ClampedSize;
                            localStorage.setItem("TypstStudio_EditorFontSize", String(ClampedSize));
                            UpdateFontSizeUI();
                            const ComputedLineHeight = Math.round(ClampedSize * CurrentEditorLineHeight);
                            MonacoInstance.updateOptions
                            ({
                                lineHeight: ComputedLineHeight
                            });
                        }
                    }
                    if (Event.hasChanged(monaco.editor.EditorOption.lineHeight))
                    {
                        const CurrentOptLineHeight = MonacoInstance.getOption(monaco.editor.EditorOption.lineHeight);
                        const ExpectedLineHeight = Math.round(CurrentEditorFontSize * CurrentEditorLineHeight);
                        if (Math.abs(CurrentOptLineHeight - ExpectedLineHeight) > 3)
                        {
                            MonacoInstance.updateOptions
                            ({
                                lineHeight: ExpectedLineHeight
                            });
                        }
                    }
                }
            );

            // Register Editor Font Size Commands in Monaco
            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal,
                () => { IncreaseEditorFontSize(); }
            );
            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus,
                () => { DecreaseEditorFontSize(); }
            );
            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Digit0,
                () => { ResetEditorFontSize(); }
            );

            MonacoInstance.onMouseDown
            (
                (Event) =>
                {
                    if (!IsSyncTexEnabled || SuppressForwardSync)
                    {
                        return ;
                    }
                    if (Event && Event.target && Event.target.position)
                    {
                        const ClickPos = Event.target.position;
                        PendingClickAutoScroll = true;
                        clearTimeout(ForwardSyncDebounceTimer);
                        ForwardSyncDebounceTimer = setTimeout
                        (
                            () =>
                            {
                                const ShouldAutoScroll = PendingClickAutoScroll;
                                PendingClickAutoScroll = false;
                                PerformForwardSync(ClickPos.lineNumber, ClickPos.column, ShouldAutoScroll);
                            },
                            60
                        );
                    }
                }
            );

            MonacoInstance.onDidChangeCursorPosition
            (
                (Event) =>
                {
                    const Pos = Event.position;
                    const CursorPosEl = document.getElementById("CursorPosition");
                    if (CursorPosEl)
                    {
                        CursorPosEl.textContent = `Ln ${Pos.lineNumber}, Col ${Pos.column}`;
                    }

                    if (Pos)
                    {
                        const IsTyping = (Date.now() - LastTypingTimestamp) < 350;
                        if (IsTyping)
                        {
                            ApplyTypewriterScroll(Pos.lineNumber);
                        }
                        UpdateHemingwayFocus(Pos.lineNumber);
                    }

                    if (Pos.lineNumber !== LastBracketCursorLine)
                    {
                        LastBracketCursorLine = Pos.lineNumber;
                        ScheduleMathBracketHighlighting();
                    }

                    if (!IsSyncTexEnabled || SuppressForwardSync)
                    {
                        return ;
                    }

                    clearTimeout(ForwardSyncDebounceTimer);
                    const IsTyping = (Date.now() - LastTypingTimestamp) < 500;
                    const DebounceMs = IsTyping ? 400: 120;
                    ForwardSyncDebounceTimer = setTimeout
                    (
                        () =>
                        {
                            const ShouldAutoScroll = PendingClickAutoScroll;
                            PendingClickAutoScroll = false;
                            PerformForwardSync(Event.position.lineNumber, Event.position.column, ShouldAutoScroll);
                        },
                        DebounceMs
                    );
                }
            );

            MonacoInstance.onDidChangeCursorSelection
            (
                () =>
                {
                    if (IsHemingwayFocusEnabled)
                    {
                        const CurrentPos = MonacoInstance.getPosition();
                        UpdateHemingwayFocus(CurrentPos ? CurrentPos.lineNumber: 1);
                    }

                    if (!IsSyncTexEnabled || SuppressForwardSync)
                    {
                        return ;
                    }

                    clearTimeout(ForwardSyncDebounceTimer);
                    const IsTyping = (Date.now() - LastTypingTimestamp) < 500;
                    const DebounceMs = IsTyping ? 400: 120;
                    ForwardSyncDebounceTimer = setTimeout
                    (
                        () =>
                        {
                            const Pos = MonacoInstance.getPosition();
                            if (Pos)
                            {
                                const ShouldAutoScroll = PendingClickAutoScroll;
                                PendingClickAutoScroll = false;
                                PerformForwardSync(Pos.lineNumber, Pos.column, ShouldAutoScroll);
                            }
                        },
                        DebounceMs
                    );
                }
            );

            SetupSmartTypographyKeydownListener();
            SetupStructuralContainerDispatchHook();
            SetupZeroDialogClipboardPasting();

            let MathBracketDecorations = MonacoInstance.createDecorationsCollection([]);

            let LastCachedSpaceWidth = null;
            let MathBracketHighlightTimer = null;
            let LAFSValidationTimer = null;
            let LastBracketCursorLine = - 1;

            function ScheduleMathBracketHighlighting()
            {
                if (MathBracketHighlightTimer)
                {
                    clearTimeout(MathBracketHighlightTimer);
                }
                const SettleMs = (Date.now() - LastTypingTimestamp < 500) ? 600: 250;
                MathBracketHighlightTimer = setTimeout
                (
                    () => { UpdateMathBracketHighlighting(); },
                    SettleMs
                );
            }

            function ScheduleLAFSValidation()
            {
                if (LAFSValidationTimer)
                {
                    clearTimeout(LAFSValidationTimer);
                }
                LAFSValidationTimer = setTimeout
                (
                    () => { ValidateEditorLAFS(); },
                    900
                );
            }

            function UpdateMathBracketHighlighting()
            {
                if (!MonacoInstance)
                {
                    return ;
                }

                const Model = MonacoInstance.getModel();
                if (!Model)
                {
                    MathBracketDecorations.clear();
                    return ;
                }

                const Position = MonacoInstance.getPosition();
                const CursorLine = Position ? Position.lineNumber: 0;
                const CursorCol = Position ? Position.column: 0;

                try
                {
                    const FontInfo = MonacoInstance.getOption(monaco.editor.EditorOption.fontInfo);
                    if (FontInfo && FontInfo.spaceWidth && FontInfo.spaceWidth !== LastCachedSpaceWidth)
                    {
                        LastCachedSpaceWidth = FontInfo.spaceWidth;
                        Container.style.setProperty("--math-col-space-width", `${FontInfo.spaceWidth}px`);
                    }
                }
                catch (Err)
                {
                }

                const TotalLines = Model.getLineCount();
                const Decorations = [];
                let NestingDepth = 0;
                let CurrentOpen = null;

                let StartL = 1;
                let EndL = TotalLines;
                if (TotalLines > 300)
                {
                    const VisibleRanges = MonacoInstance.getVisibleRanges ? MonacoInstance.getVisibleRanges():[];
                    if (VisibleRanges && VisibleRanges.length > 0)
                    {
                        const VStart = VisibleRanges[0].startLineNumber;
                        const VEnd = VisibleRanges[VisibleRanges.length - 1].endLineNumber;
                        StartL = Math.max(1, Math.min(CursorLine - 40, VStart - 80));
                        EndL = Math.min(TotalLines, Math.max(CursorLine + 40, VEnd + 80));
                    }
                }

                for (let L = StartL; L <= EndL; L ++)
                {
                    const LineContent = Model.getLineContent(L);

                    for (let ColIdx = 0; ColIdx < LineContent.length; ColIdx ++)
                    {
                        const Char = LineContent[ColIdx];
                        const PrevChar = ColIdx > 0 ? LineContent[ColIdx - 1]: "";

                        if (Char === "(" || Char === "[" || Char === "{")
                        {
                            NestingDepth ++;
                        }
                        else if (Char === ")" || Char === "]" || Char === "}")
                        {
                            NestingDepth = Math.max(0, NestingDepth - 1);
                        }
                        else if (Char === "$" && PrevChar !== "\\")
                        {
                            const ColNumber = ColIdx + 1;

                            if (CurrentOpen === null)
                            {
                                CurrentOpen =
                                {
                                    StartLine: L,
                                    StartCol: ColNumber,
                                    Level: NestingDepth % 6
                                };
                            }
                            else
                            {
                                const StartLine = CurrentOpen.StartLine;
                                const StartCol = CurrentOpen.StartCol;
                                const EndLine = L;
                                const EndCol = ColNumber;
                                const Level = CurrentOpen.Level;
                                const IsMultiline = StartLine !== EndLine;

                                let IsActive = false;
                                if (IsMultiline)
                                {
                                    if (CursorLine > StartLine && CursorLine < EndLine)
                                    {
                                        IsActive = true;
                                    }
                                    else if (CursorLine === StartLine)
                                    {
                                        IsActive = CursorCol >= StartCol;
                                    }
                                    else if (CursorLine === EndLine)
                                    {
                                        IsActive = CursorCol <= EndCol + 1;
                                    }
                                }
                                else
                                {
                                    IsActive = CursorLine === StartLine && CursorCol >= StartCol && CursorCol <= EndCol + 1;
                                }

                                const ActiveSuffix = IsActive ? " indent-active": "";
                                // Decorate opening $
                                Decorations.push
                                ({
                                    range: new monaco.Range(StartLine, StartCol, StartLine, StartCol + 1),
                                    options: { inlineClassName: `typst-math-delimiter lvl-${Level}${ActiveSuffix}` }
                                });
                                // Decorate closing $
                                Decorations.push
                                ({
                                    range: new monaco.Range(EndLine, EndCol, EndLine, EndCol + 1),
                                    options: { inlineClassName: `typst-math-delimiter lvl-${Level}${ActiveSuffix}` }
                                });

                                CurrentOpen = null;
                            }
                        }
                    }
                }

                MathBracketDecorations.set(Decorations);
            }
            // Fast, non-blocking status bar update using O(1) getValueLength()
            MonacoInstance.onDidChangeModelContent
            (
                (Event) =>
                {
                    LastTypingTimestamp = Date.now();
                    CheckDocumentDirty();
                    UpdateDocumentOutlineThrottled();
                    UpdateStatusBar();
                    ScheduleMathBracketHighlighting();
                    ScheduleLAFSValidation();
                    ScheduleTimelineSnapshot(20000);

                    const AutoCompile = document.getElementById("AutoCompileToggle").checked;
                    if (AutoCompile)
                    {
                        const Model = MonacoInstance.getModel();
                        const DocLen = Model ? Model.getValueLength(): 0;
                        const IsLargeChange = Event.changes.some( (C) => C.text.length > 500);

                        let Delay = 500;
                        if (DocLen > 50000)
                        {
                            Delay = 1400;
                        }
                        else if (DocLen > 20000)
                        {
                            Delay = 1100;
                        }
                        else if (DocLen > 8000)
                        {
                            Delay = 850;
                        }
                        else if (DocLen > 3000)
                        {
                            Delay = 650;
                        }

                        if (IsLargeChange)
                        {
                            Delay = Math.max(Delay, 1200);
                        }

                        ScheduleCompile(Delay);
                    }
                }
            );
            // Smooth paste listener: prevents intermediate compilation freezes while pasting
            MonacoInstance.onDidPaste
            (
                () =>
                {
                    LastTypingTimestamp = Date.now();
                    UpdateStatusBar();
                    ScheduleMathBracketHighlighting();
                    ScheduleLAFSValidation();
                    ScheduleTimelineSnapshot(20000);
                    const AutoCompile = document.getElementById("AutoCompileToggle").checked;
                    if (AutoCompile)
                    {
                        ScheduleCompile(1200);
                    }
                }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => { TriggerCompileNow(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () =>
                {
                    SaveCurrentFile();
                    TriggerCompileNow();
                }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => { ExportPdf(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => { ApplyFormattingToEditor(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit1, () => { SetViewportLayout("split"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit2, () => { SetViewportLayout("editor"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit3, () => { SetViewportLayout("preview"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.KeyO, () => { ToggleDocumentOutline(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP, () => { TriggerDocumentPrint(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyCode.F12, () => { ToggleDevTools(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => { ToggleDevTools(); }
            );

            MonacoInstance.addAction
            ({
                id: "toggle_devtools",
                label: "Developer: Toggle Developer Tools",
                keybindings: [monaco.KeyCode.F12, monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI],
                run: () => { ToggleDevTools(); }
            });

            MonacoInstance.addAction
            ({
                id: "synctex_jump_to_preview",
                label: "SyncTeX: Jump to Preview Location",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ, monaco.KeyMod.Alt | monaco.KeyCode.KeyJ],
                run: () =>
                {
                    const Pos = MonacoInstance.getPosition();
                    if (Pos)
                    {
                        PerformForwardSync(Pos.lineNumber, Pos.column, true);
                    }
                }
            });

            UpdateStatusBar();
            TriggerCompileNow();
            MarkDocumentClean(MonacoInstance ? MonacoInstance.getValue(): "");
            UpdateDocumentOutline();
            SetupBidirectionalScrollSync();
            Resolve(MonacoInstance);
        },
        (RequireErr) =>
        {
            console.error("Local Monaco loader error, trying CDN fallback:", RequireErr);
            try
            {
                window.require.config
                ({
                    paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs" }
                });
                window.require
                (
                    ["vs/editor/editor.main"],
                    () =>
                    {
                        Resolve(MonacoInstance);
                    },
                    (CdnErr) =>
                    {
                        console.error("Monaco CDN loader error:", CdnErr);
                        Resolve(null);
                    }
                );
            }
            catch (CdnConfigErr)
            {
                Resolve(null);
            }
        }
    );
    }
    else if (Attempts < MaxAttempts)
    {
        setTimeout(CheckAndInit, 50);
    }
    else
    {
        console.error("Monaco loader failed to load after 5 seconds");
        Resolve(null);
    }
};

CheckAndInit();
}
);
}

let ActiveScrollOwner = null;
let ScrollOwnerClearTimer = null;
let IsProgrammaticScrollSync = false;
let ProgrammaticScrollIgnoreUntilMs = 0;
let ScrollSyncRafId = null;

function SetScrollOwner(Owner)
{
    ActiveScrollOwner = Owner;
    if (ScrollOwnerClearTimer)
    {
        clearTimeout(ScrollOwnerClearTimer);
    }
    ScrollOwnerClearTimer = setTimeout
    (
        () =>
        {
            ActiveScrollOwner = null;
            ScrollOwnerClearTimer = null;
        },
        280
    );
}

function RebuildMonotonicSyncAnchors()
{
    const Viewport = document.getElementById("PreviewViewport");
    if (!Viewport || !ActiveSyncMap || ActiveSyncMap.length === 0)
    {
        MonotonicSyncAnchors = [];
        return ;
    }

    const PageSheets = document.querySelectorAll(".PageSheet");
    if (!PageSheets || PageSheets.length === 0)
    {
        MonotonicSyncAnchors = [];
        return ;
    }

    const PageMetrics = [];
    for (let I = 0; I < PageSheets.length; I ++)
    {
        const Sheet = PageSheets[I];
        const BaseHeight = parseFloat(Sheet.dataset.baseHeight) || 864;
        const TopInContent = Sheet.offsetTop;
        const ScaleY = BaseHeight > 0 ? (Sheet.offsetHeight / BaseHeight): 1;

        PageMetrics.push
        ({
            PageNum: I + 1,
            Top: TopInContent,
            Height: Sheet.offsetHeight,
            BaseHeight: BaseHeight,
            ScaleY: ScaleY
        });
    }

    const RawCandidates = [];

    for (let I = 0; I < ActiveSyncMap.length; I ++)
    {
        const E = ActiveSyncMap[I];
        const P = E.page || 1;
        const L = E.line || 1;

        // Layer A: Exclude repeated lines and repeated spans (running headers, footers, page numbers)
        if (RepeatedSyncLines.has(L))
        {
            continue;
        }
        if (E.span && RepeatedSyncSpans.has(E.span))
        {
            continue;
        }

        // Layer B: Spatial margin guard: on pages >= 2, any line <= FirstDocumentBodyLine is preamble chrome
        if (P >= 2 && L <= FirstDocumentBodyLine)
        {
            continue;
        }

        const Metric = PageMetrics[P - 1];
        if (!Metric)
        {
            continue;
        }

        // Running header / footer zone guard: top 10% or bottom 10% margins with outlier lines
        const IsTopMargin = E.y < (Metric.BaseHeight * 0.10);
        const IsBottomMargin = E.y > (Metric.BaseHeight * 0.90);
        if ((IsTopMargin || IsBottomMargin) && P >= 2 && L <= FirstDocumentBodyLine + 5)
        {
            continue;
        }

        const PreviewY = Metric.Top + (E.y * Metric.ScaleY);
        RawCandidates.push
        ({
            previewY: PreviewY,
            line: L
        });
    }

    if (RawCandidates.length === 0)
    {
        MonotonicSyncAnchors = [];
        return ;
    }

    RawCandidates.sort( (A, B) => A.previewY - B.previewY);

    const TotalDocLines = (MonacoInstance && MonacoInstance.getModel()) ? MonacoInstance.getModel().getLineCount(): 1000;
    const MaxPreviewY = Math.max(Viewport.scrollHeight, 1);

    const Anchors = [];
    Anchors.push
    ({
        previewY: 0,
        line: 1
    });

    let LastLine = 1;
    let LastY = 0;

    for (let I = 0; I < RawCandidates.length; I ++)
    {
        const Cand = RawCandidates[I];

        // Guard against isolated forward spikes (e.g. forward citations, macro defs)
        if (Cand.line > LastLine + 25)
        {
            const Next1 = RawCandidates[I + 1];
            const Next2 = RawCandidates[I + 2];
            const IsForwardOutlier = (Next1 && Next1.line < Cand.line - 15) || (Next2 && Next2.line < Cand.line - 15);
            if (IsForwardOutlier)
            {
                continue;
            }
        }

        // Handle backward fluctuations
        if (Cand.line < LastLine)
        {
            const Diff = LastLine - Cand.line;
            if (Diff <= 12)
            {
                // Minor fluctuation (table cells, math blocks): clamp to LastLine to preserve strict monotonicity
                Cand.line = LastLine;
            }
            else
            {
                // Check if subsequent candidates confirm a real progression reset (e.g. multi-column or chapter structure)
                const Next1 = RawCandidates[I + 1];
                const Next2 = RawCandidates[I + 2];
                const IsConsistentTrack = (Next1 && Math.abs(Next1.line - Cand.line) <= 15) || (Next2 && Math.abs(Next2.line - Cand.line) <= 15);
                if (IsConsistentTrack)
                {
                    LastLine = Cand.line;
                }
                else
                {
                    // Isolated backward citation or footnote span
                    continue;
                }
            }
        }

        if (Math.abs(Cand.previewY - LastY) < 3 && Cand.line === LastLine)
        {
            continue;
        }

        Anchors.push
        ({
            previewY: Cand.previewY,
            line: Cand.line
        });

        LastLine = Cand.line;
        LastY = Cand.previewY;
    }

    if (Anchors[Anchors.length - 1].previewY < MaxPreviewY)
    {
        Anchors.push
        ({
            previewY: MaxPreviewY,
            line: TotalDocLines
        });
    }

    MonotonicSyncAnchors = Anchors;
}

function ExecutePreviewToEditorSync()
{
    // Continuous passive scroll-sync completely removed.
    // Editor and Preview panes scroll independently at native 60 FPS.
}

function ExecuteEditorToPreviewSync()
{
    // Continuous passive scroll-sync completely removed.
    // Editor and Preview panes scroll independently at native 60 FPS.
}

function SetupBidirectionalScrollSync()
{
    // Continuous passive onScroll-coupled synchronization completely removed.
    // Zero timer locks, zero scroll relays, zero rebound/snap-to-Page-1.
    // Explicit Click-to-Jump SyncTeX handles navigation on demand.
}

let StatusBarWordCountTimer = null;
function UpdateStatusBar()
{
    if (!MonacoInstance) { return ; }
    const Model = MonacoInstance.getModel();
    if (!Model) { return ; }
    const Length = Model.getValueLength();
    const CharCountEl = document.getElementById("CharacterCount");
    if (CharCountEl)
    {
        CharCountEl.textContent = `${Length.toLocaleString()} chars`;
    }

    const WordCountEl = document.getElementById("WordCountDisplay");
    if (WordCountEl)
    {
        if (StatusBarWordCountTimer)
        {
            clearTimeout(StatusBarWordCountTimer);
        }
        StatusBarWordCountTimer = setTimeout
        (
            () =>
            {
                if (!MonacoInstance) { return ; }
                const CurrentModel = MonacoInstance.getModel();
                if (!CurrentModel) { return ; }
                const Source = CurrentModel.getValue();
                const WordMatches = Source ? Source.match(/\b[\w'-]+\b/g) : null;
                const WordCount = WordMatches ? WordMatches.length : 0;
                WordCountEl.textContent = `${WordCount.toLocaleString()} words`;
            },
            350
        );
    }
}

function ScheduleCompile(DelayMs)
{
    if (CompileTimeoutID) { clearTimeout(CompileTimeoutID); }
    const TimeSinceTyping = Date.now() - LastTypingTimestamp;
    const EffectiveDelay = (TimeSinceTyping < 400) ? Math.max(DelayMs, 650) : DelayMs;
    CompileTimeoutID = setTimeout
    (
        () => { TriggerCompileNow(); },
        EffectiveDelay
    );
}

async function TriggerCompileNow()
{
    if (!MonacoInstance) { return; }
    if (IsCompiling)
    {
        HasPendingCompile = true;
        return ;
    }
    IsCompiling = true;
    const ThisCompileGen = ++ CompileGeneration;
    ActiveCompileGeneration = ThisCompileGen;
    const RequestDocPath = ActiveDocumentCanonicalPath || CurrentFilePath || "";

    // Cancel any in-flight compilation request to avoid network and backend queue collisions
    if (ActiveAbortController)
    {
        ActiveAbortController.abort();
        ActiveAbortController = null;
    }

    const Controller = new AbortController();
    ActiveAbortController = Controller;

    const Source = MonacoInstance.getValue();
    const StatusDot = document.getElementById("StatusDot");
    const StatusText = document.getElementById("StatusText");
    const DurationText = document.getElementById("DurationText");
    const ErrorDrawer = document.getElementById("ErrorDrawer");

    // Run LAFS validation so errors are shown as Monaco markers without blocking the render
    ValidateEditorLAFS();

    StatusDot.className = "StatusDot Compiling";
    StatusText.textContent = "Compiling...";
    SetStatusPill("Compiling", "Compiling...", undefined);

    try
    {
        let Result;
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const RustResp = await window.__TAURI__.core.invoke
            (
                "CompileTypst",
                {
                    source: Source,
                    Source: Source,
                    filePath: CurrentFilePath || null,
                    FilePath: CurrentFilePath || null
                }
            );

            if (ThisCompileGen !== CompileGeneration || RequestDocPath !== (ActiveDocumentCanonicalPath || CurrentFilePath || ""))
            {
                return ;
            }

            Result =
            {
                Success: RustResp.success,
                Pages: RustResp.pages || [],
                PageCount: RustResp.page_count || 0,
                SyncMap: RustResp.sync_map || [],
                SpanMap: {},
                DurationMs: RustResp.duration_ms || 0,
                Error: RustResp.error
            };
            if (Result.SyncMap && Array.isArray(Result.SyncMap))
            {
                for (const Elem of Result.SyncMap)
                {
                    if (Elem.span && !Result.SpanMap[Elem.span])
                    {
                        Result.SpanMap[Elem.span] = Elem;
                    }
                }
            }
        }
        else
        {
            const Response = await AuthenticatedFetch
            (
                "/api/compile",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify
                    ({
                        Source: Source,
                        source: Source,
                        FilePath: CurrentFilePath || null,
                        filePath: CurrentFilePath || null,
                        IsBackground: false
                    }),
                    signal: Controller.signal
                }
            );

            Result = await Response.json();

            if (ThisCompileGen !== CompileGeneration || RequestDocPath !== (ActiveDocumentCanonicalPath || CurrentFilePath || ""))
            {
                return ;
            }
        }

        if (Result.Aborted)
        {
            // Superseded by a newer compile request
            return ;
        }

        if (Result.Success)
        {
            const IsModuleFile = (!Result.Pages || Result.Pages.length === 0) ||
                (Result.Pages.length === 1 && IsSvgPageBlank(Result.Pages[0]));

            if (IsModuleFile)
            {
                if (StatusDot) { StatusDot.className = "StatusDot Module"; }
                if (StatusText) { StatusText.textContent = "Module"; }
                if (DurationText) { DurationText.textContent = `${Result.DurationMs}ms`; }
                SetStatusPill("Module", "Module (No content)", Result.DurationMs);
                CurrentPageCount = 0;
            }
            else
            {
                if (StatusDot) { StatusDot.className = "StatusDot"; }
                if (StatusText) { StatusText.textContent = "Ready"; }
                if (DurationText) { DurationText.textContent = `${Result.DurationMs}ms`; }
                SetStatusPill("", "Ready", Result.DurationMs);
                CurrentPageCount = Result.PageCount || (Result.Pages ? Result.Pages.length : 0);
            }
            ErrorDrawer.classList.remove("Visible");
            const ErrorIndicator = document.getElementById("CompilationErrorIndicator");
            if (ErrorIndicator) { ErrorIndicator.style.display = "none"; }

            if (MonacoInstance && window.monaco && window.monaco.editor)
            {
                const Model = MonacoInstance.getModel();
                if (Model)
                {
                    window.monaco.editor.setModelMarkers(Model, "typst-compiler", []);
                }
            }

            LastCompiledPages = Result.Pages || [];
            LastCompiledDocumentPath = CanonicalizeDocKey(RequestDocPath);

            if (!IsModuleFile && Result.Pages && Result.Pages[0] && CurrentFilePath)
            {
                const NormKey = CanonicalizeDocKey(CurrentFilePath);
                if (!window.DocPreviewSvgCache) { window.DocPreviewSvgCache = {}; }
                window.DocPreviewSvgCache[NormKey] = Result.Pages[0];
                try
                {
                    localStorage.setItem("typst_preview_cache_" + btoa(NormKey), Result.Pages[0]);
                }
                catch (Ignored) {}
            }
            ActiveSpanMap = Result.SpanMap || {};
            let RawSyncMap = Result.SyncMap || [];
            RawSyncMap = EnrichMathSyncMap(RawSyncMap, Source, Result.Pages || []);
            RawSyncMap = EnrichFunctionCalls(RawSyncMap, Source);
            RawSyncMap = EnrichReferences(RawSyncMap, Source);
            ActiveSyncMap = RawSyncMap;
            RebuildSyncMapIndex(ActiveSyncMap);
            RenderPages(Result.Pages || []);
            RebuildMonotonicSyncAnchors();
            UpdatePagination();
            SchedulePalladinoDiagnostics(600);
            if (ActiveHighlightBoxes && ActiveHighlightBoxes.length > 0)
            {
                setTimeout
                (
                    () =>
                    {
                        HighlightSvgRects(ActiveHighlightBoxes, false);
                    },
                    50
                );
            }
        }
        else
        {
            const Splash = document.getElementById("LoadingSplash");
            if (Splash)
            {
                Splash.remove();
            }

            StatusDot.className = "StatusDot Error";
            StatusText.textContent = "Error";
            DurationText.textContent = `${Result.DurationMs}ms`;
            SetStatusPill("Error", "Error", Result.DurationMs);

            const PagesContainer = document.getElementById("PagesContainer");
            if (PagesContainer)
            {
                PagesContainer.innerHTML = "";
            }
            ClearSyncHighlights();
            LastCompiledPages = [];
            LastCompiledDocumentPath = "";
            CurrentPageCount = 0;
            UpdatePagination();

            ShowCompilationError(Result.Error);
        }
    }
    catch (Exception)
    {
        if (Exception && Exception.name === "AbortError")
        {
            // Fetch aborted cleanly by a newer compile trigger
            return ;
        }
        StatusDot.className = "StatusDot Error";
        StatusText.textContent = "Offline";
        SetStatusPill("Error", "Offline", 0);
        const ErrMsg = (Exception && Exception.message) ? Exception.message : String(Exception || "Compilation failed.");
        ShowCompilationError(ErrMsg);
        const Splash = document.getElementById("LoadingSplash");
        if (Splash)
        {
            Splash.remove();
        }
    }
    finally
    {
        IsCompiling = false;
        if (ActiveAbortController === Controller)
        {
            ActiveAbortController = null;
        }
        if (HasPendingCompile)
        {
            HasPendingCompile = false;
            setTimeout
            (
                () => { TriggerCompileNow(); },
                60
            );
        }
    }
}

function FastHash(Str)
{
    if (!Str)
    {
        return "0";
    }

    let Hash = 2166136261;
    const Len = Str.length;
    const PrefixLen = Math.min(Len, 128);
    for (let I = 0; I < PrefixLen; I ++)
    {
        Hash ^= Str.charCodeAt(I);
        Hash = Math.imul(Hash, 16777619);
    }
    const Step = Math.max(1, Math.floor(Len / 300));
    for (let I = PrefixLen; I < Len - 128; I += Step)
    {
        Hash ^= Str.charCodeAt(I);
        Hash = Math.imul(Hash, 16777619);
    }
    const SuffixStart = Math.max(0, Len - 128);
    for (let I = SuffixStart; I < Len; I ++)
    {
        Hash ^= Str.charCodeAt(I);
        Hash = Math.imul(Hash, 16777619);
    }

    return (Hash >>> 0).toString(36) + "_" + Len;
}

const InvertShapeColorCache = new Map();
const InvertGlyphColorCache = new Map();
const SvgDarkModeCache = new Map();

function InvertShapeColor(ColorStr)
{
    if (!ColorStr)
    {
        return ColorStr;
    }

    const Cached = InvertShapeColorCache.get(ColorStr);
    if (Cached !== undefined)
    {
        return Cached;
    }

    const Trimmed = ColorStr.trim();
    if
    (
        Trimmed.startsWith("url(") || ["none", "transparent", "currentcolor", "inherit"].includes(Trimmed.toLowerCase())
    )
    {
        InvertShapeColorCache.set(ColorStr, ColorStr);
        return ColorStr;
    }

    let Red = 0;
    let Green = 0;
    let Blue = 0;
    let Alpha = "";
    const Lower = Trimmed.toLowerCase();

    if (Lower === "white")
    {
        Red = 255;
        Green = 255;
        Blue = 255;
    }
    else if (Lower === "black")
    {
        Red = 0;
        Green = 0;
        Blue = 0;
    }
    else if (Lower === "gray" || Lower === "grey")
    {
        Red = 128;
        Green = 128;
        Blue = 128;
    }
    else if (Trimmed.startsWith("#"))
    {
        const Hex = Trimmed.slice(1);
        if (Hex.length === 3)
        {
            Red = parseInt(Hex[0] + Hex[0], 16);
            Green = parseInt(Hex[1] + Hex[1], 16);
            Blue = parseInt(Hex[2] + Hex[2], 16);
        }
        else if (Hex.length === 4)
        {
            Red = parseInt(Hex[0] + Hex[0], 16);
            Green = parseInt(Hex[1] + Hex[1], 16);
            Blue = parseInt(Hex[2] + Hex[2], 16);
            Alpha = Hex[3] + Hex[3];
        }
        else if (Hex.length === 6)
        {
            Red = parseInt(Hex.slice(0, 2), 16);
            Green = parseInt(Hex.slice(2, 4), 16);
            Blue = parseInt(Hex.slice(4, 6), 16);
        }
        else if (Hex.length === 8)
        {
            Red = parseInt(Hex.slice(0, 2), 16);
            Green = parseInt(Hex.slice(2, 4), 16);
            Blue = parseInt(Hex.slice(4, 6), 16);
            Alpha = Hex.slice(6, 8);
        }
        else
        {
            InvertShapeColorCache.set(ColorStr, ColorStr);
            return ColorStr;
        }
    }
    else
    {
        const RgbMatch = Trimmed.match(/^rgba?\s*\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i);
        if (RgbMatch)
        {
            Red = Math.round(parseFloat(RgbMatch[1]));
            Green = Math.round(parseFloat(RgbMatch[2]));
            Blue = Math.round(parseFloat(RgbMatch[3]));
            if (RgbMatch[4] !== undefined)
            {
                const AlphaVal = parseFloat(RgbMatch[4]);
                Alpha = Math.round(AlphaVal * 255).toString(16).padStart(2, "0");
            }
        }
        else
        {
            InvertShapeColorCache.set(ColorStr, ColorStr);
            return ColorStr;
        }
    }

    if (isNaN(Red) || isNaN(Green) || isNaN(Blue))
    {
        InvertShapeColorCache.set(ColorStr, ColorStr);
        return ColorStr;
    }

    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 22)
    {
        InvertShapeColorCache.set(ColorStr, ColorStr);
        return ColorStr;
    }

    if (Lower === "rgb(12, 12, 12)" || Lower === "#0c0c0c" || Lower === "#0C0C0C")
    {
        const DarkPageColor = Trimmed.startsWith("#") ? "#000000": "rgb(0, 0, 0)";
        InvertShapeColorCache.set(ColorStr, DarkPageColor);
        return DarkPageColor;
    }

    const Avg = (Red + Green + Blue) / 3;
    const MapComp = (L) =>
    {
        const D = 255 - L;
        if (D <= 3) { return 24; }
        if (D <= 8) { return Math.round(30 + D * 0.8); }
        if (D <= 18) { return Math.round(46 + (D - 8) * 1.2); }
        if (D <= 32) { return Math.round(68 + (D - 18) * 1.2); }
        if (D <= 55) { return Math.round(86 + (D - 32) * 0.6); }
        if (L <= 30) { return 68; }
        return Math.round(255 - L);
    };

    const BaseDark = MapComp(Avg);
    const InvertedR = Math.max(0, Math.min(255, Math.round(BaseDark + (Red - Avg))));
    const InvertedG = Math.max(0, Math.min(255, Math.round(BaseDark + (Green - Avg))));
    const InvertedB = Math.max(0, Math.min(255, Math.round(BaseDark + (Blue - Avg))));

    if (Trimmed.toLowerCase().startsWith("rgb"))
    {
        const FinalColor = Alpha !== ""
            ? `rgba(${InvertedR}, ${InvertedG}, ${InvertedB}, ${(parseInt(Alpha, 16) / 255).toFixed(3).replace(/\.?0+$/, "")})`
            : `rgb(${InvertedR}, ${InvertedG}, ${InvertedB})`;
        InvertShapeColorCache.set(ColorStr, FinalColor);
        return FinalColor;
    }

    const HexR = InvertedR.toString(16).padStart(2, "0").toUpperCase();
    const HexG = InvertedG.toString(16).padStart(2, "0").toUpperCase();
    const HexB = InvertedB.toString(16).padStart(2, "0").toUpperCase();

    const FinalColor = `#${HexR}${HexG}${HexB}${Alpha.toUpperCase()}`;
    InvertShapeColorCache.set(ColorStr, FinalColor);
    return FinalColor;
}

function InvertGlyphColor(ColorStr, Mode = CurrentPaperColorMode)
{
    if (!ColorStr)
    {
        return ColorStr;
    }

    const CacheKey = ColorStr + "_" + Mode;
    const Cached = InvertGlyphColorCache.get(CacheKey);
    if (Cached !== undefined)
    {
        return Cached;
    }

    const Trimmed = ColorStr.trim();
    if (["none", "transparent", "currentcolor", "inherit"].includes(Trimmed.toLowerCase()))
    {
        InvertGlyphColorCache.set(CacheKey, ColorStr);
        return ColorStr;
    }

    const TargetLightText = (Mode === "pure_black") ? "#FFFFFF": "#D6D3CD";

    let Red = 0;
    let Green = 0;
    let Blue = 0;
    const Lower = Trimmed.toLowerCase();

    if (Lower === "white" || Lower === "#ffffff" || Lower === "#fff")
    {
        InvertGlyphColorCache.set(CacheKey, TargetLightText);
        return TargetLightText;
    }

    if (Trimmed.startsWith("#"))
    {
        const Hex = Trimmed.slice(1);
        if (Hex.length === 3)
        {
            Red = parseInt(Hex[0] + Hex[0], 16);
            Green = parseInt(Hex[1] + Hex[1], 16);
            Blue = parseInt(Hex[2] + Hex[2], 16);
        }
        else if (Hex.length >= 6)
        {
            Red = parseInt(Hex.slice(0, 2), 16);
            Green = parseInt(Hex.slice(2, 4), 16);
            Blue = parseInt(Hex.slice(4, 6), 16);
        }
    }
    else
    {
        const RgbMatch = Trimmed.match(/^rgba?\s*\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)/i);
        if (RgbMatch)
        {
            Red = Math.round(parseFloat(RgbMatch[1]));
            Green = Math.round(parseFloat(RgbMatch[2]));
            Blue = Math.round(parseFloat(RgbMatch[3]));
        }
        else
        {
            InvertGlyphColorCache.set(CacheKey, ColorStr);
            return ColorStr;
        }
    }

    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 22)
    {
        InvertGlyphColorCache.set(CacheKey, ColorStr);
        return ColorStr;
    }

    const Avg = (Red + Green + Blue) / 3;
    if (Avg >= 240 || Avg <= 50)
    {
        InvertGlyphColorCache.set(CacheKey, TargetLightText);
        return TargetLightText;
    }

    if (Mode === "pure_black")
    {
        const Inv = Math.min(255, Math.max(0, Math.round(255 - Avg)));
        const H = Inv.toString(16).padStart(2, "0").toUpperCase();
        const FinalColor = `#${H}${H}${H}`;
        InvertGlyphColorCache.set(CacheKey, FinalColor);
        return FinalColor;
    }
    else
    {
        const Inv = Math.min(220, Math.max(40, Math.round((255 - Avg) * 0.88)));
        const H = Inv.toString(16).padStart(2, "0").toUpperCase();
        const FinalColor = `#${H}${H}${H}`;
        InvertGlyphColorCache.set(CacheKey, FinalColor);
        return FinalColor;
    }
}

function InvertMonochromeColor(ColorStr)
{
    return InvertShapeColor(ColorStr);
}

function ConvertSvgToTransparent(Svg)
{
    if (!Svg)
    {
        return Svg;
    }

    let Result = Svg.replace
    (
        /<path\b([^>]*\bd=["']\s*M\s*0\s*0[vhVH\s][^"']*(?:Z|z)?\s*["'][^>]*)>/i,
        (Match) => Match.replace(/\bfill=["'][^"']*["']/i, 'fill="none"')
    );
    Result = Result.replace
    (
        /<rect\b([^>]*\b(?:x=["']0["']\s+y=["']0["']|y=["']0["']\s+x=["']0["']|width=["']100%["'])[^>]*)>/i,
        (Match) => Match.replace(/\bfill=["'][^"']*["']/i, 'fill="none"')
    );
    return Result;
}

function ConvertSvgToDarkMode(Svg, Transparent = false, Mode = CurrentPaperColorMode)
{
    if (!Svg)
    {
        return Svg;
    }

    const DocPrefix = ActiveDocumentCanonicalPath || CurrentFilePath || "doc";
    const SvgKey = `${DocPrefix}::${FastHash(Svg)}_${Mode}${Transparent ? "_trans": "_solid"}`;
    const Cached = SvgDarkModeCache.get(SvgKey);
    if (Cached)
    {
        return Cached;
    }

    let Result = Svg;

    // 1. Mark canvas background with sentinel
    let CanvasFound = false;
    Result = Result.replace
    (
        /<path\b([^>]*\bd=["']\s*M\s*0\s*0[vhVH\s][^"']*(?:Z|z)?\s*["'][^>]*)>/i,
        (Match) =>
        {
            CanvasFound = true;
            return Match.replace(/\bfill=["'][^"']*["']/i, 'fill="__CANVAS_BLACK_SENTINEL__"');
        }
    );

    if (!CanvasFound)
    {
        Result = Result.replace
        (
            /<rect\b([^>]*\b(?:x=["']0["']\s+y=["']0["']|y=["']0["']\s+x=["']0["']|width=["']100%["'])[^>]*)>/i,
            (Match) =>
            {
                CanvasFound = true;
                return Match.replace(/\bfill=["'][^"']*["']/i, 'fill="__CANVAS_BLACK_SENTINEL__"');
            }
        );
    }

    if (!CanvasFound)
    {
        Result = Result.replace('fill="#ffffff" fill-rule="nonzero" d="M 0 0v', 'fill="__CANVAS_BLACK_SENTINEL__" fill-rule="nonzero" d="M 0 0v');
        Result = Result.replace('fill="#FFFFFF" fill-rule="nonzero" d="M 0 0v', 'fill="__CANVAS_BLACK_SENTINEL__" fill-rule="nonzero" d="M 0 0v');
    }

    // 2. Invert <use> text glyph fills
    Result = Result.replace
    (
        /<use\b([^>]*)>/gi, (Match, Attrs) =>
        {
            const UpdatedAttrs = Attrs.replace
            (
                /\bfill\s*=\s*(["'])([^"']+)\1/gi, (FillMatch, Quote, Color) =>
                {
                    const Inverted = InvertGlyphColor(Color, Mode);
                    return `fill=${Quote}${Inverted}${Quote}`;
                }
            );
            return `<use${UpdatedAttrs}>`;
        }
    );

    // 3. Invert shapes (<path>, <rect>, <polygon>, <circle>, <ellipse>, <line>) fills and strokes
    Result = Result.replace
    (
        /<(path|rect|polygon|circle|ellipse|line)\b([^>]*)>/gi, (Match, Tag, Attrs) =>
        {
            let Updated = Attrs.replace
            (
                /\bfill\s*=\s*(["'])([^"']+)\1/gi, (FillMatch, Quote, Color) =>
                {
                    if (Color === "__CANVAS_BLACK_SENTINEL__")
                    {
                        return FillMatch;
                    }
                    const Inverted = InvertShapeColor(Color, Mode);
                    return `fill=${Quote}${Inverted}${Quote}`;
                }
            );
            Updated = Updated.replace
            (
                /\bstroke\s*=\s*(["'])([^"']+)\1/gi, (StrokeMatch, Quote, Color) =>
                {
                    const Inverted = InvertShapeColor(Color, Mode);
                    return `stroke=${Quote}${Inverted}${Quote}`;
                }
            );
            return `<${Tag}${Updated}>`;
        }
    );

    // 4. Resolve the canvas sentinel to pure black #000000 or optimized #0D0D0F or none
    const CanvasColor = (Mode === "pure_black") ? "#000000": "#0D0D0F";
    const CanvasFill = Transparent ? 'fill="none"': `fill="${CanvasColor}"`;
    Result = Result.replaceAll('fill="__CANVAS_BLACK_SENTINEL__"', CanvasFill);

    // 5. Handle custom inline styles
    if (Result.includes('style="') || Result.includes("style='"))
    {
        Result = Result.replace
        (
            /\bstyle\s*=\s*(["'][^"']*["'])/gi,
            (Match, QuotedVal) =>
            {
                const Quote = QuotedVal[0];
                const StyleContent = QuotedVal.slice(1, - 1);
                const Transformed = StyleContent.replace
                (
                    /\b(fill|stroke|color)\s*:\s*([^;"]+)/gi,
                    (PropMatch, Prop, Color) =>
                    {
                        const Inverted = InvertShapeColor(Color.trim(), Mode);
                        return `${Prop}: ${Inverted}`;
                    }
                );
                return `style=${Quote}${Transformed}${Quote}`;
            }
        );
    }

    if (SvgDarkModeCache.size > 300)
    {
        SvgDarkModeCache.clear();
    }
    SvgDarkModeCache.set(SvgKey, Result);
    return Result;
}

function IsSvgPageBlank(SvgStr)
{
    if (!SvgStr || typeof SvgStr !== "string")
    {
        return true;
    }
    if (/<(?:use|text|tspan|image)\b/i.test(SvgStr))
    {
        return false;
    }
    const Stripped = SvgStr
        .replace(/<path\b[^>]*\bd=["']\s*M\s*0\s*0[vhVH\s][^"']*(?:Z|z)?\s*["'][^>]*>/gi, "")
        .replace(/<rect\b[^>]*(?:width=["']100%["']|x=["']0["']\s+y=["']0["'])[^>]*>/gi, "");
    if (/<(?:path|rect|polygon|polyline|circle|ellipse|line)\b/i.test(Stripped))
    {
        return false;
    }
    return true;
}

function RenderPages(Pages)
{
    const Splash = document.getElementById("LoadingSplash");
    if (Splash)
    {
        Splash.remove();
    }

    const Viewport = document.getElementById("PreviewViewport");
    const PrevScrollTop = Viewport ? Viewport.scrollTop: 0;
    const PrevScrollLeft = Viewport ? Viewport.scrollLeft: 0;
    const PagesContainer = document.getElementById("PagesContainer");

    if (!Pages || Pages.length === 0 || (Pages.length === 1 && IsSvgPageBlank(Pages[0])))
    {
        PagesContainer.innerHTML = `
            <div class = "ModulePlaceholderCard">
                <div class = "ModulePlaceholderIcon">
                    <svg width = "40" height = "40" viewBox = "0 0 24 24" fill = "none" stroke = "currentColor" stroke-width = "1.8" stroke-linecap = "round" stroke-linejoin = "round">
                        <path d = "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points = "3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1 = "12" y1 = "22.08" x2 = "12" y2 = "12"></line>
                    </svg>
                </div>
                <div class = "ModulePlaceholderTitle">Module / Library File</div>
                <div class = "ModulePlaceholderSubtitle">Compiled successfully with 0 display pages. This file defines functions, variables, or rules without generating visual content.</div>
            </div>
        `;
        return ;
    }

    const CurrentToken = ++ RenderToken;

    function NormalizeSvg(RawSvg)
    {
        if (!RawSvg || typeof RawSvg !== "string")
        {
            return "";
        }

        // 1. Strip script tags
        let Sanitized = RawSvg
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
            .replace(/<script\b[^>]*\/>/gi, "");

        // 2. Strip foreignObject tags
        Sanitized = Sanitized
            .replace(/<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi, "")
            .replace(/<foreignObject\b[^>]*\/>/gi, "");

        // 3. Strip inline event handlers (onload, onerror, onclick, etc.)
        Sanitized = Sanitized.replace(/\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

        // 4. Strip javascript: and data: URIs in href and xlink:href
        Sanitized = Sanitized.replace(/\s+(?:xlink:)?href\s*=\s*['"]\s*(?:javascript:|data:text\/html)[\s\S]*?['"]/gi, "");

        // 5. Adjust width & height for container rendering
        return Sanitized.replace
        (
            /<svg\b([^>]*)>/i,
            (Match, Attrs) =>
            {
                const CleanedAttrs = Attrs
                    .replace(/\bwidth="[^"]*"/gi, "")
                    .replace(/\bheight="[^"]*"/gi, "");
                return `<svg ${CleanedAttrs} width="100%" height="100%" style="display: block; width: 100%; height: 100%;">`;
            }
        );
    }

    function UpdateOrCreatePageElement(SvgContent, Index)
    {
        const PageId = `PageSheet_${Index + 1}`;
        let PageDiv = document.getElementById(PageId);
        const ContentHash = FastHash(SvgContent);
        const ModeKey = CurrentPaperColorMode;
        const CurrentDocKey = ActiveDocumentCanonicalPath || CurrentFilePath || "";
        const CurrentGenKey = String(ActiveCompileGeneration || CompileGeneration);

        if (PageDiv)
        {
            if (
                PageDiv.dataset.docPath === CurrentDocKey &&
                PageDiv.dataset.svgHash === ContentHash &&
                PageDiv.dataset.svgMode === ModeKey
            )
            {
                // Unchanged page! Skip DOM recreation completely
                return PageDiv;
            }
            PageDiv.innerHTML = "";
        }
        else
        {
            PageDiv = document.createElement("div");
            PageDiv.className = "PageSheet";
            PageDiv.id = PageId;
            PagesContainer.appendChild(PageDiv);
        }

        PageDiv.dataset.docPath = CurrentDocKey;
        PageDiv.dataset.compileGen = CurrentGenKey;
        PageDiv.dataset.svgHash = ContentHash;
        PageDiv.dataset.svgMode = ModeKey;

        const VbMatch = SvgContent.match(/viewBox\s*=\s*["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i);
        let BaseWidthPx = 576;
        let BaseHeightPx = 864;

        if (VbMatch)
        {
            const WidthPt = parseFloat(VbMatch[3]);
            const HeightPt = parseFloat(VbMatch[4]);
            BaseWidthPx = WidthPt * (96 / 72);
            BaseHeightPx = HeightPt * (96 / 72);
        }

        PageDiv.dataset.baseWidth = BaseWidthPx;
        PageDiv.dataset.baseHeight = BaseHeightPx;

        const ScaledWidth = Math.round(BaseWidthPx * CurrentZoomLevel);
        const ScaledHeight = Math.round(BaseHeightPx * CurrentZoomLevel);

        PageDiv.style.width = `${ScaledWidth}px`;
        PageDiv.style.height = `${ScaledHeight}px`;

        const SvgToRender = (CurrentPaperColorMode !== "light") ? ConvertSvgToDarkMode(SvgContent, false, CurrentPaperColorMode): SvgContent;
        const ActiveLayer = document.createElement("div");
        ActiveLayer.className = (CurrentPaperColorMode !== "light") ? "SvgLayer DarkSvgLayer": "SvgLayer LightSvgLayer";
        ActiveLayer.innerHTML = NormalizeSvg(SvgToRender);
        PageDiv.appendChild(ActiveLayer);

        return PageDiv;
    }
    // Prune excess pages if document page count decreased
    while (PagesContainer.children.length > Pages.length)
    {
        PagesContainer.removeChild(PagesContainer.lastChild);
    }

    // Ensure layout container shells for ALL pages exist immediately with explicit dimensions
    // This prevents scrollHeight collapse, keeps scroll offsets valid, and avoids blank viewport flashing
    for (let I = 0; I < Pages.length; I ++)
    {
        const PageId = `PageSheet_${I + 1}`;
        let PageDiv = document.getElementById(PageId);
        if (!PageDiv)
        {
            PageDiv = document.createElement("div");
            PageDiv.className = "PageSheet";
            PageDiv.id = PageId;
            PagesContainer.appendChild(PageDiv);
        }

        const SvgContent = Pages[I];
        const VbMatch = SvgContent.match(/viewBox\s*=\s*["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i);
        let BaseWidthPx = 576;
        let BaseHeightPx = 864;

        if (VbMatch)
        {
            const WidthPt = parseFloat(VbMatch[3]);
            const HeightPt = parseFloat(VbMatch[4]);
            BaseWidthPx = WidthPt * (96 / 72);
            BaseHeightPx = HeightPt * (96 / 72);
        }

        PageDiv.dataset.baseWidth = BaseWidthPx;
        PageDiv.dataset.baseHeight = BaseHeightPx;

        const ScaledWidth = Math.round(BaseWidthPx * CurrentZoomLevel);
        const ScaledHeight = Math.round(BaseHeightPx * CurrentZoomLevel);

        PageDiv.style.width = `${ScaledWidth}px`;
        PageDiv.style.height = `${ScaledHeight}px`;
    }

    // Render pages in the active viewport and overscan zones immediately
    const ApproxPageH = (864 * CurrentZoomLevel) + 24;
    const CurrentPageEst = Math.max(0, Math.floor(PrevScrollTop / ApproxPageH));
    const ImmediateStart = Math.max(0, CurrentPageEst - 1);
    const ImmediateEnd = Math.min(Pages.length, CurrentPageEst + 3);

    for (let I = ImmediateStart; I < ImmediateEnd; I ++)
    {
        UpdateOrCreatePageElement(Pages[I], I);
    }

    if (ImmediateStart > 0)
    {
        UpdateOrCreatePageElement(Pages[0], 0);
    }

    if (Viewport && (PrevScrollTop > 0 || PrevScrollLeft > 0))
    {
        Viewport.scrollTop = PrevScrollTop;
        Viewport.scrollLeft = PrevScrollLeft;
    }

    // If more unpopulated pages exist, stream them progressively via requestAnimationFrame
    let NextStreamIndex = 0;
    function RenderRemainingPages()
    {
        if (CurrentToken !== RenderToken)
        {
            return ;
            // Newer render has started
        }
        let ProcessedCount = 0;
        while (NextStreamIndex < Pages.length && ProcessedCount < 3)
        {
            const PageDiv = document.getElementById(`PageSheet_${NextStreamIndex + 1}`);
            const CurrentDocKey = ActiveDocumentCanonicalPath || CurrentFilePath || "";
            const NeedsRender = !PageDiv ||
                PageDiv.children.length === 0 ||
                PageDiv.dataset.docPath !== CurrentDocKey;

            if (NeedsRender)
            {
                UpdateOrCreatePageElement(Pages[NextStreamIndex], NextStreamIndex);
                ProcessedCount ++;
            }
            NextStreamIndex ++;
        }

        if (NextStreamIndex < Pages.length)
        {
            requestAnimationFrame(RenderRemainingPages);
        }
        else
        {
            RebuildMonotonicSyncAnchors();
        }
    }
    requestAnimationFrame(RenderRemainingPages);

    UpdateBlackPageMode();
    RebuildMonotonicSyncAnchors();
}

function ParseCompilerDiagnostics(RawErrorText)
{
    if (!RawErrorText)
    {
        return [];
    }

    const Markers = [];
    const Lines = RawErrorText.split(/\r?\n/);
    let CurrentMsg = "Compilation error";
    let CurrentSeverity = 8; // MarkerSeverity.Error

    if (window.monaco && window.monaco.MarkerSeverity)
    {
        CurrentSeverity = window.monaco.MarkerSeverity.Error;
    }

    for (let I = 0; I < Lines.length; I ++)
    {
        const Line = Lines[I];
        const ErrorHead = Line.match(/^(?:error|warning|hint):\s*(.+)$/i);
        if (ErrorHead)
        {
            CurrentMsg = ErrorHead[1].trim();
            if (Line.toLowerCase().startsWith("warning"))
            {
                CurrentSeverity = (window.monaco && window.monaco.MarkerSeverity) ? window.monaco.MarkerSeverity.Warning : 4;
            }
            else
            {
                CurrentSeverity = (window.monaco && window.monaco.MarkerSeverity) ? window.monaco.MarkerSeverity.Error : 8;
            }
        }

        const LocMatch = Line.match(/(?:┌─\s*|-->\s*|\b)((?:[a-zA-Z]:[\\/][^:\r\n]+|[\w.\-/\\]+\.typ)):(\d+):(\d+)/i);
        if (LocMatch)
        {
            const File = LocMatch[1].replace(/\\/g, "/");
            const LineNum = parseInt(LocMatch[2], 10);
            const ColNum = parseInt(LocMatch[3], 10);

            const ActivePath = (ActiveDocumentCanonicalPath || CurrentFilePath || "").replace(/\\/g, "/");
            const IsCurrentDoc = !ActivePath ||
                File.toLowerCase() === ActivePath.toLowerCase() ||
                File.toLowerCase().endsWith("/" + ActivePath.split("/").pop().toLowerCase()) ||
                ActivePath.toLowerCase().endsWith("/" + File.split("/").pop().toLowerCase());

            if (IsCurrentDoc && LineNum > 0)
            {
                let EndCol = ColNum + 1;
                if (MonacoInstance)
                {
                    const Model = MonacoInstance.getModel();
                    if (Model && LineNum <= Model.getLineCount())
                    {
                        EndCol = Math.max(EndCol, Model.getLineMaxColumn(LineNum));
                    }
                }
                Markers.push
                ({
                    severity: CurrentSeverity,
                    message: CurrentMsg,
                    startLineNumber: LineNum,
                    startColumn: ColNum,
                    endLineNumber: LineNum,
                    endColumn: EndCol,
                    source: "typst-compiler"
                });
            }
        }
    }

    return Markers;
}

function ShowCompilationError(ErrorMessage)
{
    const ErrorDrawer = document.getElementById("ErrorDrawer");
    const ErrorContent = document.getElementById("ErrorContent");
    const Cleaned = ErrorErrorMessageClean(ErrorMessage);
    // Escape HTML entities to prevent injection
    const Escaped = Cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

    // Populate Monaco editor markers with structured compiler diagnostics
    if (MonacoInstance && window.monaco && window.monaco.editor)
    {
        const Model = MonacoInstance.getModel();
        if (Model)
        {
            const Markers = ParseCompilerDiagnostics(Cleaned);
            window.monaco.editor.setModelMarkers(Model, "typst-compiler", Markers);
        }
    }

    // Detect primary error line and column for direct jump
    PrimaryErrorLocation = null;
    const LocMatch = Cleaned.match(/(?:┌─\s*|-->\s*|\b)((?:[a-zA-Z]:[\\/][^:\r\n]+|[\w.\-/\\]+\.typ)):(\d+):(\d+)/i);
    const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
    if (LocMatch)
    {
        PrimaryErrorLocation =
        {
            File: LocMatch[1].replace(/\\/g, "/"),
            Line: parseInt(LocMatch[2], 10),
            Col: parseInt(LocMatch[3], 10)
        };
        if (JumpBtn)
        {
            JumpBtn.style.display = "inline-flex";
            JumpBtn.textContent = `Jump to L${LocMatch[2]}:${LocMatch[3]}`;
        }
    }
    else if (JumpBtn)
    {
        JumpBtn.style.display = "none";
    }
    // Highlight error keywords with prominent red highlight class
    let Highlighted = Escaped.replace
    (
        /\b(error|Error|ERROR|Severe Critical Fatal Error)\b/g, (Token) => `<span class = "ErrorKeywordHighlight">${Token}</span>`
    );
    // Convert file location references into clickable links
    Highlighted = Highlighted.replace
    (
        /(┌─\s*|-->\s*|\b)((?:[a-zA-Z]:[\\/][^:\r\n]+|[\w.\-/\\]+\.typ)):(\d+):(\d+)/gi,
        (Full, Prefix, File, Line, Col) =>
        {
            const CleanFile = File.replace(/\\/g, "/");
            const ShortName = CleanFile.split("/").pop();
            return `${Prefix}<span Class = "ErrorLocationLink" Data-File = "${CleanFile}" Data-Line = "${Line}" Data-Col = "${Col}" Title = "Click to jump to ${CleanFile}:${Line}:${Col}">${ShortName}:${Line}:${Col} ↗</span>`;
        }
    );

    ErrorContent.innerHTML = Highlighted;
    ErrorDrawer.classList.add("Visible");
}

function ErrorErrorMessageClean(RawMessage)
{
    if (!RawMessage)
    {
        return "Unknown error occurred during compilation.";
    }
    return RawMessage.replace(/\\\\\?\\/g, "").replace(/.*[/\\]document\.typ/g, "document.typ");
}

function UpdatePagination()
{
    const PageIndicator = document.getElementById("PageIndicator");
    if (PageIndicator)
    {
        PageIndicator.innerHTML = `<span class="PageLabel">Page </span>${CurrentActivePage} / ${CurrentPageCount}`;
    }
}

function ApplyZoom()
{
    const PageSheets = document.querySelectorAll(".PageSheet");
    PageSheets.forEach
    (
        (Sheet) =>
        {
            const BaseW = parseFloat(Sheet.dataset.baseWidth) || 576;
            const BaseH = parseFloat(Sheet.dataset.baseHeight) || 864;
            Sheet.style.width = `${Math.round(BaseW * CurrentZoomLevel)}px`;
            Sheet.style.height = `${Math.round(BaseH * CurrentZoomLevel)}px`;
        }
    );
    document.getElementById("ZoomDisplay").textContent = `${Math.round(CurrentZoomLevel * 100)}%`;
    RebuildMonotonicSyncAnchors();
}

function RecalculateScale()
{
    ApplyZoom();
}

function SetZoom(NewZoom)
{
    CurrentZoomLevel = Math.max(0.25, Math.min(5.0, Math.round(NewZoom * 100) / 100));
    try
    {
        localStorage.setItem("TypstStudio_PreviewZoom", String(CurrentZoomLevel));
    }
    catch (Ignored) {}
    ApplyZoom();
}

function SetupZoomControls()
{
    const ZoomDisplay = document.getElementById("ZoomDisplay");
    let IsMouseOverZoomArea = false;

    if (ZoomDisplay)
    {
        ZoomDisplay.textContent = `${Math.round(CurrentZoomLevel * 100)}%`;

        ZoomDisplay.addEventListener
        (
            "keydown",
            (Event) =>
            {
                if (Event.key === "ArrowUp")
                {
                    Event.preventDefault();
                    Event.stopPropagation();
                    SetZoom(CurrentZoomLevel + 0.01);
                    ZoomDisplay.textContent = `${Math.round(CurrentZoomLevel * 100)}%`;
                    const Sel = window.getSelection();
                    if (Sel)
                    {
                        Sel.selectAllChildren(ZoomDisplay);
                    }
                }
                else if (Event.key === "ArrowDown")
                {
                    Event.preventDefault();
                    Event.stopPropagation();
                    SetZoom(CurrentZoomLevel - 0.01);
                    ZoomDisplay.textContent = `${Math.round(CurrentZoomLevel * 100)}%`;
                    const Sel = window.getSelection();
                    if (Sel)
                    {
                        Sel.selectAllChildren(ZoomDisplay);
                    }
                }
                else if (Event.key === "Enter")
                {
                    Event.preventDefault();
                    Event.stopPropagation();
                    ZoomDisplay.blur();
                }
                else if (Event.key === "Escape")
                {
                    Event.preventDefault();
                    Event.stopPropagation();
                    ZoomDisplay.textContent = `${Math.round(CurrentZoomLevel * 100)}%`;
                    ZoomDisplay.blur();
                }
            }
        );

        ZoomDisplay.addEventListener
        (
            "blur",
            () =>
            {
                const RawText = ZoomDisplay.textContent.trim().replace("%", "");
                const Parsed = parseFloat(RawText);
                if (!isNaN(Parsed) && Parsed > 0)
                {
                    const Level = Parsed > 10 ? (Parsed / 100): Parsed;
                    SetZoom(Level);
                }
                else
                {
                    ZoomDisplay.textContent = `${Math.round(CurrentZoomLevel * 100)}%`;
                }
            }
        );
    }

    const ZoomControls = document.querySelector(".ZoomControls");
    if (ZoomControls)
    {
        ZoomControls.addEventListener("mouseenter", () => { IsMouseOverZoomArea = true; });
        ZoomControls.addEventListener("mouseleave", () => { IsMouseOverZoomArea = false; });
    }

    const Viewport = document.getElementById("PreviewViewport");
    let IsMouseOverViewport = false;
    if (Viewport)
    {
        Viewport.tabIndex = 0;
        Viewport.addEventListener("mouseenter", () => { IsMouseOverViewport = true; });
        Viewport.addEventListener("mouseleave", () => { IsMouseOverViewport = false; });

        Viewport.addEventListener
        (
            "keydown",
            (Event) =>
            {
                if (Event.key === "ArrowUp")
                {
                    Event.preventDefault();
                    SetZoom(CurrentZoomLevel + 0.01);
                }
                else if (Event.key === "ArrowDown")
                {
                    Event.preventDefault();
                    SetZoom(CurrentZoomLevel - 0.01);
                }
            }
        );

        Viewport.addEventListener
        (
            "wheel",
            (Event) =>
            {
                if (Event.ctrlKey || Event.metaKey)
                {
                    Event.preventDefault();
                    const Delta = Event.deltaY < 0 ? 0.08: - 0.08;
                    SetZoom(CurrentZoomLevel + Delta);
                }
            },
            { passive: false }
        );
    }

    window.addEventListener
    (
        "keydown",
        (Event) =>
        {
            const Active = document.activeElement;
            if (Active === ZoomDisplay || Active === Viewport)
            {
                return ;
            }

            const IsInEditor = Active && (Active.classList.contains("monaco-mouse-cursor-text") || Active.closest(".monaco-editor") || Active.tagName === "TEXTAREA" || Active.tagName === "INPUT");

            if (Event.key === "ArrowUp" || Event.key === "ArrowDown")
            {
                const ShouldHandle = (IsMouseOverZoomArea) ||
                                     (IsMouseOverViewport && (Event.ctrlKey || Event.metaKey || !IsInEditor)) ||
                                     ((Event.ctrlKey || Event.metaKey) && (Event.altKey || IsMouseOverViewport));

                if (ShouldHandle)
                {
                    Event.preventDefault();
                    const Step = (Event.key === "ArrowUp") ? 0.01 : -0.01;
                    SetZoom(CurrentZoomLevel + Step);
                }
            }
        },
        true
    );
}

function FitWidth()
{
    const Viewport = document.getElementById("PreviewViewport");
    const FirstPage = document.querySelector(".PageSheet");
    if (!FirstPage || !Viewport)
    {
        return ;
    }
    const BaseW = parseFloat(FirstPage.dataset.baseWidth) || 576;
    const TargetWidth = IsSpreadMode ? (BaseW * 2 + 48) : BaseW;
    const AvailableWidth = Math.max(300, Viewport.clientWidth - 80);
    SetZoom(AvailableWidth / TargetWidth);
}

function FitPage()
{
    const Viewport = document.getElementById("PreviewViewport");
    const FirstPage = document.querySelector(".PageSheet");
    if (!FirstPage || !Viewport)
    {
        return ;
    }
    const BaseH = parseFloat(FirstPage.dataset.baseHeight) || 864;
    const BaseW = parseFloat(FirstPage.dataset.baseWidth) || 576;
    const AvailableHeight = Math.max(300, Viewport.clientHeight - 80);
    const AvailableWidth = Math.max(300, Viewport.clientWidth - 80);
    const TargetWidth = IsSpreadMode ? (BaseW * 2 + 48) : BaseW;
    const ScaleH = AvailableHeight / BaseH;
    const ScaleW = AvailableWidth / TargetWidth;
    SetZoom(Math.min(ScaleH, ScaleW));
}

function SetPaperColorMode(NewMode)
{
    if (!["light", "optimized", "pure_black"].includes(NewMode))
    {
        NewMode = "light";
    }
    CurrentPaperColorMode = NewMode;
    IsBlackPageMode = CurrentPaperColorMode !== "light";
    localStorage.setItem("typst_paper_color_mode", CurrentPaperColorMode);
    localStorage.setItem("typst_black_page_mode", IsBlackPageMode ? "true": "false");

    SvgDarkModeCache.clear();
    InvertGlyphColorCache.clear();
    InvertShapeColorCache.clear();

    UpdateBlackPageMode();

    if (LastCompiledPages && LastCompiledPages.length > 0)
    {
        RenderPages(LastCompiledPages);
    }

    if (typeof RenderHomepage === "function")
    {
        RenderHomepage();
    }
}

function UpdateBlackPageMode()
{
    const Container = document.getElementById("PagesContainer");
    const Viewport = document.getElementById("PreviewViewport");
    const Icon = document.getElementById("BlackPageIcon");
    const Label = document.getElementById("BlackPageLabel");
    const Button = document.getElementById("BlackPageToggle");

    if (Container)
    {
        Container.classList.remove("PaperMode_Light", "PaperMode_Optimized", "PaperMode_PureBlack", "BlackPageMode");
    }
    if (Viewport)
    {
        Viewport.classList.remove("PaperMode_Light", "PaperMode_Optimized", "PaperMode_PureBlack", "BlackPageMode");
    }

    if (CurrentPaperColorMode === "pure_black")
    {
        if (Container) { Container.classList.add("BlackPageMode", "PaperMode_PureBlack"); }
        if (Viewport) { Viewport.classList.add("BlackPageMode", "PaperMode_PureBlack"); }
        if (Icon) { Icon.textContent = "●"; }
        if (Label) { Label.textContent = "Pure Black"; }
        if (Button) { Button.classList.add("Active"); }
    }
    else if (CurrentPaperColorMode === "optimized")
    {
        if (Container) { Container.classList.add("BlackPageMode", "PaperMode_Optimized"); }
        if (Viewport) { Viewport.classList.add("BlackPageMode", "PaperMode_Optimized"); }
        if (Icon) { Icon.textContent = "◐"; }
        if (Label) { Label.textContent = "Night (Soft)"; }
        if (Button) { Button.classList.add("Active"); }
    }
    else
    {
        if (Container) { Container.classList.add("PaperMode_Light"); }
        if (Viewport) { Viewport.classList.add("PaperMode_Light"); }
        if (Icon) { Icon.textContent = "☀️"; }
        if (Label) { Label.textContent = "Light Page"; }
        if (Button) { Button.classList.remove("Active"); }
    }

    // Sync button pills in selector
    const Btns = document.querySelectorAll(".PaperModeBtn");
    for (const Btn of Btns)
    {
        if (Btn.dataset.mode === CurrentPaperColorMode)
        {
            Btn.classList.add("Active");
        }
        else
        {
            Btn.classList.remove("Active");
        }
    }

    // Sync Dashboard Appearance dropdown
    const ExportPaperSelect = document.getElementById("ExportPaperModeSelect");
    const ExportPaperBadge = document.getElementById("ExportPaperModeBadge");
    if (ExportPaperSelect)
    {
        ExportPaperSelect.value = CurrentPaperColorMode;
    }
    if (ExportPaperBadge)
    {
        if (CurrentPaperColorMode === "pure_black")
        {
            ExportPaperBadge.textContent = "Pure Black (OLED)";
        }
        else if (CurrentPaperColorMode === "optimized")
        {
            ExportPaperBadge.textContent = "Optimized Pitch Black";
        }
        else
        {
            ExportPaperBadge.textContent = "Light Mode (Normal)";
        }
    }
}

function ToggleBlackPageMode()
{
    if (CurrentPaperColorMode === "light")
    {
        SetPaperColorMode("optimized");
    }
    else if (CurrentPaperColorMode === "optimized")
    {
        SetPaperColorMode("pure_black");
    }
    else
    {
        SetPaperColorMode("light");
    }
}

let CurrentUIMode = localStorage.getItem("typst_ui_experience_mode") || "focus";
let CurrentExportFormat = "pdf";
let CurrentExportSwatch = "light";
let CurrentExportDpi = "2x";
let CurrentExportScope = "all";
let PreviewHUDTimer = null;

function SetUIMode(NewMode)
{
    if (NewMode !== "focus" && NewMode !== "studio")
    {
        NewMode = "focus";
    }

    CurrentUIMode = NewMode;
    try
    {
        localStorage.setItem("typst_ui_experience_mode", NewMode);
    }
    catch (Ignored) {}

    document.body.classList.remove("UIMode_Focus", "UIMode_Studio");
    document.body.classList.add(NewMode === "focus" ? "UIMode_Focus" : "UIMode_Studio");

    const FocusBtn = document.getElementById("ModeFocusBtn");
    const StudioBtn = document.getElementById("ModeStudioBtn");
    if (FocusBtn)
    {
        FocusBtn.classList.toggle("Active", NewMode === "focus");
    }
    if (StudioBtn)
    {
        StudioBtn.classList.toggle("Active", NewMode === "studio");
    }

    if (MonacoInstance)
    {
        MonacoInstance.updateOptions
        ({
            minimap: { enabled: (NewMode === "studio") }
        });
    }

    ApplyEditorTypography();

    const PreviewToolbar = document.querySelector(".PreviewToolbar");
    if (PreviewToolbar)
    {
        PreviewToolbar.classList.remove("HUD_Idle");
    }
}

function SetStatusPill(State, Text, Duration)
{
    const Dot = document.getElementById("StatusBarDot");
    const StatusTxt = document.getElementById("StatusBarCompileText");
    const DurTxt = document.getElementById("StatusBarDuration");
    if (Dot)
    {
        Dot.className = `StatusDot ${State || ""}`.trim();
    }
    if (StatusTxt)
    {
        StatusTxt.textContent = Text || "Ready";
    }
    if (DurTxt && Duration !== undefined)
    {
        DurTxt.textContent = `${Duration}ms`;
    }
}

function OpenExportSheet()
{
    const Modal = document.getElementById("ExportSheetModal");
    if (!Modal) { return ; }

    const TitleInput = document.getElementById("DocumentTitleInput");
    const DocTitle = TitleInput ? TitleInput.value.trim() : "document";
    const DocTitleEl = document.getElementById("ExportSheetDocTitleText");
    if (DocTitleEl)
    {
        DocTitleEl.textContent = DocTitle;
    }

    const PageCountEl = document.getElementById("ExportSheetPageCountText");
    if (PageCountEl)
    {
        PageCountEl.textContent = `Page 1 of ${CurrentPageCount || 1}`;
    }

    const MiniContent = document.getElementById("MiniPreviewContent");
    if (MiniContent && LastCompiledPages && LastCompiledPages.length > 0)
    {
        MiniContent.innerHTML = LastCompiledPages[0];
    }

    if (CurrentPaperColorMode === "optimized" || CurrentPaperColorMode === "pure_black")
    {
        SetExportSwatch("dark");
    }
    else
    {
        SetExportSwatch("light");
    }

    UpdateExportModalUI();
    Modal.style.display = "flex";
}

function CloseExportSheet()
{
    const Modal = document.getElementById("ExportSheetModal");
    if (Modal)
    {
        Modal.style.display = "none";
    }
}

function SetExportFormat(Format)
{
    CurrentExportFormat = Format;
    const SectionDpi = document.getElementById("ExportPngResolutionSection");
    if (SectionDpi)
    {
        SectionDpi.style.display = (Format === "png") ? "flex" : "none";
    }

    const FormatBtns = document.querySelectorAll(".FormatTabBtn");
    FormatBtns.forEach
    (
        (Btn) =>
        {
            Btn.classList.toggle("Active", Btn.getAttribute("Data-Format") === Format);
        }
    );

    UpdateExportModalUI();
}

function SetExportSwatch(Swatch)
{
    CurrentExportSwatch = Swatch;
    const SwatchBtns = document.querySelectorAll(".ExportSwatchCard");
    SwatchBtns.forEach
    (
        (Card) =>
        {
            Card.classList.toggle("Active", Card.getAttribute("Data-Swatch") === Swatch);
        }
    );

    const MiniPaper = document.getElementById("MiniPreviewPaper");
    if (MiniPaper)
    {
        MiniPaper.className = "MiniPreviewPaper";
        if (Swatch === "dark")
        {
            MiniPaper.classList.add("Paper_Dark");
        }
        else if (Swatch === "clear_dark" || Swatch === "clear_light")
        {
            MiniPaper.classList.add("Paper_Clear");
        }
    }
}

function SetExportDpi(Dpi)
{
    CurrentExportDpi = Dpi;
    const DpiBtns = document.querySelectorAll(".DpiTabBtn");
    DpiBtns.forEach
    (
        (Btn) =>
        {
            Btn.classList.toggle("Active", Btn.getAttribute("Data-Dpi") === Dpi);
        }
    );
}

function SetExportScope(Scope)
{
    CurrentExportScope = Scope;
    const ScopeBtns = document.querySelectorAll(".ScopeTabBtn");
    ScopeBtns.forEach
    (
        (Btn) =>
        {
            Btn.classList.toggle("Active", Btn.getAttribute("Data-Scope") === Scope);
        }
    );

    const RangeInput = document.getElementById("ExportCustomRangeInput");
    if (RangeInput)
    {
        RangeInput.style.display = (Scope === "custom") ? "block" : "none";
        if (Scope === "custom")
        {
            RangeInput.focus();
        }
    }

    UpdateExportModalUI();
}

function UpdateExportModalUI()
{
    const PrimaryLabel = document.getElementById("ExportSheetPrimaryLabel");
    if (!PrimaryLabel) { return ; }

    const FormatUpper = CurrentExportFormat.toUpperCase();
    if (CurrentExportScope === "all" && CurrentPageCount > 1 && CurrentExportFormat !== "pdf")
    {
        PrimaryLabel.textContent = `Export ${CurrentPageCount} ${FormatUpper}s (.zip)`;
    }
    else
    {
        PrimaryLabel.textContent = `Export ${FormatUpper}`;
    }
}

async function ExecuteExportSheet()
{
    const BlackMode = (CurrentExportSwatch === "dark" || CurrentExportSwatch === "clear_light");
    const Transparent = (CurrentExportSwatch === "clear_dark" || CurrentExportSwatch === "clear_light");

    const BlackCheckbox = document.getElementById("ExportBlackModeCheckbox");
    const TransCheckbox = document.getElementById("ExportTransparentCheckbox");
    if (BlackCheckbox) { BlackCheckbox.checked = BlackMode; }
    if (TransCheckbox) { TransCheckbox.checked = Transparent; }

    CloseExportSheet();

    if (CurrentExportFormat === "pdf")
    {
        await ExportPdf();
    }
    else if (CurrentExportFormat === "png")
    {
        await ExportPng();
    }
    else if (CurrentExportFormat === "svg")
    {
        await ExportSvg();
    }
}

async function CopyExportToClipboard()
{
    if (!LastCompiledPages || LastCompiledPages.length === 0)
    {
        ShowToast("No compiled document to copy", "warning");
        return ;
    }

    try
    {
        let SvgData = LastCompiledPages[0];
        if (CurrentExportSwatch === "dark" || CurrentExportSwatch === "clear_light")
        {
            SvgData = ConvertSvgToDarkMode(SvgData, CurrentExportSwatch === "clear_light", CurrentPaperColorMode);
        }

        if (navigator.clipboard && navigator.clipboard.writeText)
        {
            await navigator.clipboard.writeText(SvgData);
            ShowToast("Page SVG copied to clipboard!", "success");
            CloseExportSheet();
        }
        else
        {
            ShowToast("Clipboard access not supported", "warning");
        }
    }
    catch (Err)
    {
        ShowToast(`Failed to copy to clipboard: ${Err.message}`, "error");
    }
}

function OpenSettingsModal(TabName)
{
    const Modal = document.getElementById("SettingsModal");
    if (!Modal) { return ; }

    SwitchSettingsTab(TabName || "appearance");
    Modal.style.display = "flex";
}

function CloseSettingsModal()
{
    const Modal = document.getElementById("SettingsModal");
    if (Modal)
    {
        Modal.style.display = "none";
    }
}

function OpenExternalURL(TargetURL)
{
    if (IsTauriDesktop && window.__TAURI_INTERNALS__ && window.__TAURI_INTERNALS__.invoke)
    {
        try
        {
            window.__TAURI_INTERNALS__.invoke("OpenExternalUrl", { Url: TargetURL });
            return ;
        }
        catch (Ignored) {}
    }
    window.open(TargetURL, "_blank");
}

function SwitchSettingsTab(TabKey)
{
    const TabIds =
    {
        appearance: "SettingsViewAppearance",
        paper: "SettingsViewPaper",
        directories: "SettingsViewDirectories",
        lafs: "SettingsViewLafs"
    };

    const BtnIds =
    {
        appearance: "SettingsTabAppearance",
        paper: "SettingsTabPaper",
        directories: "SettingsTabDirectories",
        lafs: "SettingsTabLafs"
    };

    Object.keys(TabIds).forEach
    (
        (Key) =>
        {
            const View = document.getElementById(TabIds[Key]);
            if (View)
            {
                View.style.display = (Key === TabKey) ? "flex" : "none";
            }
            const Btn = document.getElementById(BtnIds[Key]);
            if (Btn)
            {
                Btn.classList.toggle("Active", Key === TabKey);
            }
        }
    );
}

function SetSpreadMode(Enabled)
{
    IsSpreadMode = ! ! Enabled;
    try
    {
        localStorage.setItem("TypstStudio_SpreadMode", String(IsSpreadMode));
    }
    catch (Ignored) {}

    const PagesContainer = document.getElementById("PagesContainer");
    const Viewport = document.getElementById("PreviewViewport");
    const SpreadBtn = document.getElementById("SpreadModeToggleBtn");

    if (PagesContainer)
    {
        PagesContainer.classList.toggle("SpreadMode", IsSpreadMode);
    }
    if (Viewport)
    {
        Viewport.classList.toggle("SpreadMode", IsSpreadMode);
    }
    if (SpreadBtn)
    {
        SpreadBtn.classList.toggle("Active", IsSpreadMode);
    }

    if (IsSpreadMode)
    {
        FitWidth();
    }
}

function ToggleSpreadMode()
{
    SetSpreadMode(!IsSpreadMode);
    ShowToast(IsSpreadMode ? "Facing Two-Page Spread: Enabled" : "Facing Two-Page Spread: Disabled", "info");
}

function LoadTemplateDirect(TemplateKey)
{
    if (TEMPLATES[TemplateKey] && MonacoInstance)
    {
        MonacoInstance.setValue(TEMPLATES[TemplateKey]);
        TriggerCompileNow();
        ShowToast(`Loaded ${TemplateKey} template`, "info");
    }
}

let CommandPaletteSelectedIndex = 0;
let FilteredPaletteActions = [];

const COMMAND_PALETTE_ACTIONS =
[
    {
        Title: "Switch to Focus Mode",
        Category: "Experience Mode",
        Icon: "✦",
        Shortcut: "Ctrl+Shift+M",
        Action: () => { SetUIMode("focus"); }
    },
    {
        Title: "Switch to Studio Mode",
        Category: "Experience Mode",
        Icon: "⊞",
        Shortcut: "Ctrl+Shift+M",
        Action: () => { SetUIMode("studio"); }
    },
    {
        Title: "Paper: Light Mode (Natural Paper)",
        Category: "Paper & Rendering",
        Icon: "☀️",
        Shortcut: "",
        Action: () => { SetPaperColorMode("light"); }
    },
    {
        Title: "Paper: Optimized Pitch Black (Anti-Halation Night)",
        Category: "Paper & Rendering",
        Icon: "◐",
        Shortcut: "",
        Action: () => { SetPaperColorMode("optimized"); }
    },
    {
        Title: "Paper: Pure Black (OLED True Black)",
        Category: "Paper & Rendering",
        Icon: "●",
        Shortcut: "",
        Action: () => { SetPaperColorMode("pure_black"); }
    },
    {
        Title: "Toggle Facing Two-Page Book Spread",
        Category: "View & Layout",
        Icon: "📖",
        Shortcut: "Alt+S",
        Action: () => { ToggleSpreadMode(); }
    },
    {
        Title: "Typographic Polish: Convert Quotes & Dashes to Smart Glyphs",
        Category: "Typography",
        Icon: "✒️",
        Shortcut: "",
        Action: () => { PolishTypographyInDocument(); }
    },
    {
        Title: "Toggle Typographic Font Ligatures (calt, dlig, fi, fl)",
        Category: "Typography",
        Icon: "æ",
        Shortcut: "Alt+L",
        Action: () => { ToggleLigatures(); }
    },
    {
        Title: "Inspect Font Ligatures & Glyphs",
        Category: "Typography",
        Icon: "🔍",
        Shortcut: "",
        Action: () => { OpenLigaturesInspector(); }
    },
    {
        Title: "Toggle Optical Margin Alignment (Hanging Punctuation)",
        Category: "Typography",
        Icon: "📐",
        Shortcut: "",
        Action: () => { ToggleOpticalMargins(); }
    },
    {
        Title: "Toggle Smart Quotes & Typographic Auto-Substitution",
        Category: "Typography",
        Icon: "“",
        Shortcut: "",
        Action: () => { ToggleSmartQuotes(); }
    },
    {
        Title: "Toggle Typewriter Center Scroll (40% Golden Ratio)",
        Category: "Writing & Focus",
        Icon: "⌖",
        Shortcut: "Alt+T",
        Action: () => { ToggleTypewriterScroll(); }
    },
    {
        Title: "Toggle Hemingway Focus Light (Paragraph Spotlight)",
        Category: "Writing & Focus",
        Icon: "✦",
        Shortcut: "Alt+H",
        Action: () => { ToggleHemingwayFocus(); }
    },
    {
        Title: "Time Machine for Words (Revision History & Scrubbing)",
        Category: "Writing & Focus",
        Icon: "⏳",
        Shortcut: "Ctrl+Shift+H",
        Action: () => { OpenTimeMachine(); }
    },
    {
        Title: "Keynote Stage Mode (Present Slides)",
        Category: "Views & Navigation",
        Icon: "📽️",
        Shortcut: "F5",
        Action: () => { EnterKeynoteStageMode(); }
    },
    {
        Title: "Layout: Split View (Editor & Preview)",
        Category: "View & Layout",
        Icon: "▥",
        Shortcut: "Alt+1",
        Action: () => { SetViewportLayout("split"); }
    },
    {
        Title: "Layout: Code Editor Only",
        Category: "View & Layout",
        Icon: "📄",
        Shortcut: "Alt+2",
        Action: () => { SetViewportLayout("editor"); }
    },
    {
        Title: "Layout: Document Preview Only",
        Category: "View & Layout",
        Icon: "👁️",
        Shortcut: "Alt+3",
        Action: () => { SetViewportLayout("preview"); }
    },
    {
        Title: "Toggle Document Outline",
        Category: "View & Layout",
        Icon: "📋",
        Shortcut: "Alt+O",
        Action: () => { ToggleDocumentOutline(); }
    },
    {
        Title: "Toggle File Explorer",
        Category: "View & Layout",
        Icon: "📁",
        Shortcut: "Ctrl+B",
        Action: () => { ToggleExplorerSidebar(); }
    },
    {
        Title: "Open Visual Export Sheet",
        Category: "Export & Sharing",
        Icon: "📤",
        Shortcut: "Ctrl+E",
        Action: () => { OpenExportSheet(); }
    },
    {
        Title: "Export Document to PDF",
        Category: "Export & Sharing",
        Icon: "📕",
        Shortcut: "Ctrl+P",
        Action: () => { ExportPdf(); }
    },
    {
        Title: "Export Document to PNG",
        Category: "Export & Sharing",
        Icon: "🖼️",
        Shortcut: "",
        Action: () => { ExportPng(); }
    },
    {
        Title: "Export Document to SVG",
        Category: "Export & Sharing",
        Icon: "📐",
        Shortcut: "",
        Action: () => { ExportSvg(); }
    },
    {
        Title: "Editor Font: iA Writer Duo (Default)",
        Category: "Typography",
        Icon: "✍️",
        Shortcut: "",
        Action: () =>
        {
            CurrentEditorFont = "iA Writer Duo";
            localStorage.setItem("TypstStudio_EditorFont", CurrentEditorFont);
            ApplyEditorTypography();
        }
    },
    {
        Title: "Editor Font: JetBrains Mono",
        Category: "Typography",
        Icon: "💻",
        Shortcut: "",
        Action: () =>
        {
            CurrentEditorFont = "JetBrains Mono";
            localStorage.setItem("TypstStudio_EditorFont", CurrentEditorFont);
            ApplyEditorTypography();
        }
    },
    {
        Title: "Editor Font: Cascadia Code",
        Category: "Typography",
        Icon: "💻",
        Shortcut: "",
        Action: () =>
        {
            CurrentEditorFont = "Cascadia Code";
            localStorage.setItem("TypstStudio_EditorFont", CurrentEditorFont);
            ApplyEditorTypography();
        }
    },
    {
        Title: "Editor Font: Fira Code",
        Category: "Typography",
        Icon: "💻",
        Shortcut: "",
        Action: () =>
        {
            CurrentEditorFont = "Fira Code";
            localStorage.setItem("TypstStudio_EditorFont", CurrentEditorFont);
            ApplyEditorTypography();
        }
    },
    {
        Title: "Open Preferences & Settings",
        Category: "Settings",
        Icon: "⚙️",
        Shortcut: "Ctrl+,",
        Action: () => { OpenSettingsModal("appearance"); }
    },
    {
        Title: "Template: Scientific Research Paper (STIX Two)",
        Category: "Templates",
        Icon: "🔬",
        Shortcut: "",
        Action: () => { LoadTemplateDirect("paper"); }
    },
    {
        Title: "Template: Book / Novel Spread (EB Garamond)",
        Category: "Templates",
        Icon: "📚",
        Shortcut: "",
        Action: () => { LoadTemplateDirect("novel"); }
    },
    {
        Title: "Template: Professional Resume (Inter)",
        Category: "Templates",
        Icon: "👔",
        Shortcut: "",
        Action: () => { LoadTemplateDirect("resume"); }
    }
];

function OpenCommandPalette()
{
    const Modal = document.getElementById("CommandPaletteModal");
    const Input = document.getElementById("CommandPaletteInput");
    if (!Modal)
    {
        return ;
    }

    Modal.style.display = "flex";
    if (Input)
    {
        Input.value = "";
        Input.focus();
    }
    CommandPaletteSelectedIndex = 0;
    RenderCommandPaletteItems("");
}

function CloseCommandPalette()
{
    const Modal = document.getElementById("CommandPaletteModal");
    if (Modal)
    {
        Modal.style.display = "none";
    }
}

function RenderCommandPaletteItems(Query)
{
    const List = document.getElementById("CommandPaletteList");
    if (!List)
    {
        return ;
    }

    const Q = (Query || "").trim().toLowerCase();
    FilteredPaletteActions = COMMAND_PALETTE_ACTIONS.filter
    (
        (Item) =>
        {
            if (!Q)
            {
                return true;
            }
            return Item.Title.toLowerCase().includes(Q) ||
                   Item.Category.toLowerCase().includes(Q) ||
                   (Item.Shortcut && Item.Shortcut.toLowerCase().includes(Q));
        }
    );

    if (CommandPaletteSelectedIndex >= FilteredPaletteActions.length)
    {
        CommandPaletteSelectedIndex = Math.max(0, FilteredPaletteActions.length - 1);
    }

    if (FilteredPaletteActions.length === 0)
    {
        List.innerHTML = `<div Class = "CommandPaletteEmpty">No commands found matching "${EscapeHtml(Query)}"</div>`;
        return ;
    }

    List.innerHTML = "";
    let LastCategory = "";

    FilteredPaletteActions.forEach
    (
        (Item, Index) =>
        {
            if (Item.Category !== LastCategory)
            {
                LastCategory = Item.Category;
                const CatHeader = document.createElement("div");
                CatHeader.className = "CommandCategoryHeader";
                CatHeader.textContent = LastCategory;
                List.appendChild(CatHeader);
            }

            const ItemEl = document.createElement("div");
            ItemEl.className = `CommandPaletteItem ${Index === CommandPaletteSelectedIndex ? "Selected" : ""}`;
            ItemEl.innerHTML = `
                <div Class = "CommandItemLeft">
                    <span Class = "CommandItemIcon">${Item.Icon}</span>
                    <span Class = "CommandItemTitle">${Item.Title}</span>
                </div>
                ${Item.Shortcut ? `<span Class = "CommandItemShortcut">${Item.Shortcut}</span>` : ""}
            `;

            ItemEl.addEventListener
            (
                "click", () =>
                {
                    CloseCommandPalette();
                    Item.Action();
                }
            );

            ItemEl.addEventListener
            (
                "mouseenter", () =>
                {
                    CommandPaletteSelectedIndex = Index;
                    document.querySelectorAll(".CommandPaletteItem").forEach
                    (
                        (El, I) => El.classList.toggle("Selected", I === Index)
                    );
                }
            );

            List.appendChild(ItemEl);
        }
    );

    const SelectedEl = List.querySelectorAll(".CommandPaletteItem")[CommandPaletteSelectedIndex];
    if (SelectedEl)
    {
        SelectedEl.scrollIntoView({ block: "nearest" });
    }
}

// --- THE PALLADINO TYPOGRAPHIC ENGINE (PHASE 7.1) ---

function ToggleLigatures(ForceState)
{
    CurrentEditorLigatures = (typeof ForceState === "boolean") ? ForceState: !CurrentEditorLigatures;
    localStorage.setItem("TypstStudio_EditorLigatures", String(CurrentEditorLigatures));

    if (MonacoInstance)
    {
        MonacoInstance.updateOptions
        ({
            fontLigatures: CurrentEditorLigatures ? "'calt', 'liga', 'dlig', 'hlig'": false
        });
    }

    const LigaturesBtn = document.getElementById("StatusBarLigaturesBtn");
    const LigaturesText = document.getElementById("StatusBarLigaturesText");
    if (LigaturesBtn)
    {
        LigaturesBtn.classList.toggle("Active", CurrentEditorLigatures);
    }
    if (LigaturesText)
    {
        LigaturesText.textContent = `Ligatures: ${CurrentEditorLigatures ? "ON": "OFF"}`;
    }

    document.querySelectorAll(".LigaturePresetBtn").forEach
    (
        (Btn) =>
        {
            const Val = Btn.getAttribute("DataLigatures") === "true";
            Btn.classList.toggle("Active", Val === CurrentEditorLigatures);
        }
    );

    const ModalToggleBtn = document.getElementById("ToggleLigaturesModalBtn");
    if (ModalToggleBtn)
    {
        ModalToggleBtn.textContent = CurrentEditorLigatures ? "Disable Ligatures": "Enable Ligatures";
    }

    ShowToast(`Typographic Ligatures: ${CurrentEditorLigatures ? "Enabled (calt, dlig, hlig)": "Disabled"}`, "info", 1500);
}

function OpenLigaturesInspector()
{
    const Modal = document.getElementById("LigaturesModal");
    const ActiveFontEl = document.getElementById("InspectorActiveFontName");
    const TestInput = document.getElementById("LigatureTestInput");
    if (!Modal)
    {
        return ;
    }

    const ActiveFont = (CurrentUIMode === "focus" && UseDifferentFocusFont) ? CurrentFocusEditorFont: CurrentEditorFont;
    if (ActiveFontEl)
    {
        ActiveFontEl.textContent = ActiveFont;
    }
    const Stack = GetEditorFontStack(ActiveFont);
    if (TestInput)
    {
        TestInput.style.fontFamily = Stack;
    }

    document.querySelectorAll(".LigatureSample").forEach
    (
        (El) =>
        {
            El.style.fontFamily = Stack;
        }
    );

    const ToggleBtn = document.getElementById("ToggleLigaturesModalBtn");
    if (ToggleBtn)
    {
        ToggleBtn.textContent = CurrentEditorLigatures ? "Disable Ligatures": "Enable Ligatures";
    }

    SwitchPalladinoTab("diagnostics");
    RunPalladinoDiagnostics();
    Modal.style.display = "flex";
}

function CloseLigaturesInspector()
{
    const Modal = document.getElementById("LigaturesModal");
    if (Modal)
    {
        Modal.style.display = "none";
    }
}

let PalladinoDebounceTimer = null;

function SchedulePalladinoDiagnostics(DelayMs = 600)
{
    if (PalladinoDebounceTimer)
    {
        clearTimeout(PalladinoDebounceTimer);
    }
    PalladinoDebounceTimer = setTimeout
    (
        () =>
        {
            RunPalladinoDiagnostics();
        },
        DelayMs
    );
}

function SwitchPalladinoTab(TabName)
{
    const DiagTabBtn = document.getElementById("PalladinoTabDiagnostics");
    const LigTabBtn = document.getElementById("PalladinoTabLigatures");
    const DiagView = document.getElementById("PalladinoDiagnosticsView");
    const LigView = document.getElementById("PalladinoLigaturesView");

    if (TabName === "ligatures")
    {
        if (DiagTabBtn)
        {
            DiagTabBtn.classList.remove("Active");
        }
        if (LigTabBtn)
        {
            LigTabBtn.classList.add("Active");
        }
        if (DiagView)
        {
            DiagView.style.display = "none";
        }
        if (LigView)
        {
            LigView.style.display = "flex";
        }
    }
    else
    {
        if (DiagTabBtn)
        {
            DiagTabBtn.classList.add("Active");
        }
        if (LigTabBtn)
        {
            LigTabBtn.classList.remove("Active");
        }
        if (DiagView)
        {
            DiagView.style.display = "flex";
        }
        if (LigView)
        {
            LigView.style.display = "none";
        }
        RunPalladinoDiagnostics();
    }
}

function RunPalladinoDiagnostics()
{
    if (!MonacoInstance)
    {
        return ;
    }
    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return ;
    }

    const FullText = Model.getValue();
    const Lines = FullText.split("\n");

    const ProseLengths = [];
    const Issues = [];
    let InCodeBlock = false;
    let InMathBlock = false;

    for (let Index = 0; Index < Lines.length; Index ++)
    {
        const LineNum = Index + 1;
        const Line = Lines[Index];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = !InCodeBlock;
            continue ;
        }
        if (InCodeBlock)
        {
            continue ;
        }

        if (Trimmed.startsWith("$") && Trimmed.endsWith("$") && Trimmed.length > 2)
        {
            continue ;
        }
        if (Trimmed === "$")
        {
            InMathBlock = !InMathBlock;
            continue ;
        }
        if (InMathBlock)
        {
            continue ;
        }

        if (Trimmed.startsWith("//") || Trimmed.startsWith("/*") || Trimmed.startsWith("#set") || Trimmed.startsWith("#import") || Trimmed.startsWith("#include") || Trimmed.startsWith("#show") || Trimmed.startsWith("#let") || Trimmed === "")
        {
            continue ;
        }

        ProseLengths.push(Trimmed.length);

        // 1. Leading contraction apostrophe mistakes: 'cause, 'em, '90s, '80s, '70s, 'til, 'round
        const ContractionRegex = /(?:^|[\s\(\[\{])(['‘](?:cause|em|90s|80s|70s|60s|til|round))\b/gi;
        let Match;
        while ((Match = ContractionRegex.exec(Line)) !== null)
        {
            Issues.push
            (
                {
                    Line: LineNum,
                    Col: Match.index + 1,
                    Type: "Quote",
                    Snippet: Match[1],
                    Message: "Leading contraction apostrophe should be right apostrophe (’) instead of open tick/quote."
                }
            );
        }

        // 2. Typewriter double/triple hyphens in prose
        if (Trimmed !== "-" && Trimmed !== "--" && !Trimmed.startsWith("---"))
        {
            const DashRegex = /(?:[A-Za-z0-9\.,;!\?])\s*(--|---)\s*(?:[A-Za-z0-9])/g;
            while ((Match = DashRegex.exec(Line)) !== null)
            {
                Issues.push
                (
                    {
                        Line: LineNum,
                        Col: Match.index + 1,
                        Type: "Dash",
                        Snippet: Match[1],
                        Message: `Typewriter dash '${Match[1]}' should be true em-dash ('—') or en-dash ('–').`
                    }
                );
            }
        }

        // 3. Typewriter ellipses
        const EllipsisRegex = /(?:[A-Za-z0-9\.,;!\?]|[\s])(\.\.\.)(?:[\sA-Za-z0-9]|$)/g;
        while ((Match = EllipsisRegex.exec(Line)) !== null)
        {
            Issues.push
            (
                {
                    Line: LineNum,
                    Col: Match.index + 1,
                    Type: "Dash",
                    Snippet: "...",
                    Message: "Typewriter triple-dots ('...') should be true typographic ellipsis ('…')."
                }
            );
        }

        // 4. Double sentence spaces
        const SpaceRegex = /([\.?!])\s{2,}([A-Z“‘"'])/g;
        while ((Match = SpaceRegex.exec(Line)) !== null)
        {
            Issues.push
            (
                {
                    Line: LineNum,
                    Col: Match.index + 1,
                    Type: "Space",
                    Snippet: `${Match[1]}  ${Match[2]}`,
                    Message: "Double sentence space detected (legacy typewriter spacing)."
                }
            );
        }
    }

    const MeasureValEl = document.getElementById("PalladinoMeasureValue");
    const MeasureSubEl = document.getElementById("PalladinoMeasureStatus");
    const QuoteStatusEl = document.getElementById("PalladinoQuoteStatus");
    const QuoteSubEl = document.getElementById("PalladinoQuoteSub");
    const DashStatusEl = document.getElementById("PalladinoDashStatus");
    const DashSubEl = document.getElementById("PalladinoDashSub");
    const BadgeEl = document.getElementById("PalladinoHealthBadge");
    const IssuesListEl = document.getElementById("PalladinoIssuesList");

    let AvgLineLength = 0;
    if (ProseLengths.length > 0)
    {
        AvgLineLength = Math.round(ProseLengths.reduce((Acc, Val) => Acc + Val, 0) / ProseLengths.length);
    }

    if (MeasureValEl && MeasureSubEl)
    {
        if (ProseLengths.length === 0)
        {
            MeasureValEl.textContent = "— chars/line";
            MeasureValEl.style.color = "#8B949E";
            MeasureSubEl.textContent = "No body prose detected";
        }
        else if (AvgLineLength >= 50 && AvgLineLength <= 72)
        {
            MeasureValEl.textContent = `${AvgLineLength} chars/line`;
            MeasureValEl.style.color = "#00E676";
            MeasureSubEl.textContent = "Ideal Book Sweet Spot (50–72)";
        }
        else if (AvgLineLength > 72)
        {
            MeasureValEl.textContent = `${AvgLineLength} chars/line`;
            MeasureValEl.style.color = "#FC6A03";
            MeasureSubEl.textContent = "Line measure may be wide for comfortable reading (>72)";
        }
        else
        {
            MeasureValEl.textContent = `${AvgLineLength} chars/line`;
            MeasureValEl.style.color = "#FC6A03";
            MeasureSubEl.textContent = "Line measure narrow (<50)";
        }
    }

    const QuoteIssues = Issues.filter((Issue) => Issue.Type === "Quote");
    const DashAndSpaceIssues = Issues.filter((Issue) => Issue.Type === "Dash" || Issue.Type === "Space");

    if (QuoteStatusEl && QuoteSubEl)
    {
        if (QuoteIssues.length === 0)
        {
            QuoteStatusEl.textContent = "Clean";
            QuoteStatusEl.style.color = "#00E676";
            QuoteSubEl.textContent = "No straight quote or apostrophe traps";
        }
        else
        {
            QuoteStatusEl.textContent = `${QuoteIssues.length} ${QuoteIssues.length === 1 ? "Notice" : "Notices"}`;
            QuoteStatusEl.style.color = "#FC6A03";
            QuoteSubEl.textContent = "Contraction apostrophe or quote needs review";
        }
    }

    if (DashStatusEl && DashSubEl)
    {
        if (DashAndSpaceIssues.length === 0)
        {
            DashStatusEl.textContent = "Master-Press";
            DashStatusEl.style.color = "#00E676";
            DashSubEl.textContent = "True dashes, ellipses & single spaces";
        }
        else
        {
            DashStatusEl.textContent = `${DashAndSpaceIssues.length} ${DashAndSpaceIssues.length === 1 ? "Notice" : "Notices"}`;
            DashStatusEl.style.color = "#FC6A03";
            DashSubEl.textContent = "Typewriter dashes or double spaces found";
        }
    }

    let Score = 100;
    Score -= QuoteIssues.length * 5;
    Score -= DashAndSpaceIssues.length * 4;
    if (ProseLengths.length > 0 && (AvgLineLength > 85 || AvgLineLength < 35))
    {
        Score -= 10;
    }
    Score = Math.max(40, Math.min(100, Score));

    if (BadgeEl)
    {
        BadgeEl.textContent = `Craft Score: ${Score}%`;
        BadgeEl.style.color = Score >= 90 ? "#00E676" : "#FC6A03";
    }

    if (IssuesListEl)
    {
        if (Issues.length === 0)
        {
            IssuesListEl.innerHTML = `
                <div Class = "PalladinoIssueRow Clean">
                    <span Class = "IssueBadge Healthy">✓</span>
                    <span Class = "IssueText">Document typography is pristine. No typographic flaws detected.</span>
                </div>
            `;
        }
        else
        {
            IssuesListEl.innerHTML = "";
            Issues.forEach
            (
                (Issue) =>
                {
                    const Row = document.createElement("div");
                    Row.className = "PalladinoIssueRow";
                    Row.setAttribute("DataLine", String(Issue.Line));
                    Row.innerHTML = `
                        <div Class = "PalladinoIssueLeft">
                            <span Class = "IssueBadge ${Issue.Type === "Quote" ? "Warning" : "Healthy"}">Line ${Issue.Line}</span>
                            <span Class = "IssueText">${Issue.Message} <code style = "opacity: 0.8; font-size: 11px;">"${EscapeHtml(Issue.Snippet)}"</code></span>
                        </div>
                        <span Class = "IssueJumpAction">Jump →</span>
                    `;
                    Row.addEventListener
                    (
                        "click",
                        () =>
                        {
                            if (MonacoInstance)
                            {
                                MonacoInstance.revealLineInCenter(Issue.Line);
                                MonacoInstance.setPosition({ lineNumber: Issue.Line, column: Issue.Col });
                                MonacoInstance.focus();
                            }
                        }
                    );
                    IssuesListEl.appendChild(Row);
                }
            );
        }
    }
}

function FixLeadingApostrophes()
{
    if (!MonacoInstance)
    {
        return ;
    }
    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return ;
    }

    const FullText = Model.getValue();
    const Lines = FullText.split("\n");
    let InCodeBlock = false;
    let ReplacedCount = 0;

    for (let Index = 0; Index < Lines.length; Index ++)
    {
        const Line = Lines[Index];
        const Trimmed = Line.trim();
        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = !InCodeBlock;
            continue ;
        }
        if (InCodeBlock)
        {
            continue ;
        }
        if (Trimmed.startsWith("//") || Trimmed.startsWith("#set") || Trimmed.startsWith("#import"))
        {
            continue ;
        }

        const NewLine = Line.replace
        (
            /(^|[\s\(\[\{])['‘](cause|em|90s|80s|70s|60s|til|round)\b/gi,
            (Match, P1, P2) =>
            {
                ReplacedCount ++;
                return `${P1}’${P2}`;
            }
        );
        Lines[Index] = NewLine;
    }

    if (ReplacedCount > 0)
    {
        const NewFullText = Lines.join("\n");
        MonacoInstance.executeEdits
        (
            "palladino-fix-apostrophes",
            [
                {
                    range: Model.getFullModelRange(),
                    text: NewFullText,
                    forceMoveMarkers: true
                }
            ]
        );
        ShowToast(`Palladino: Converted ${ReplacedCount} leading contraction apostrophe(s) to true right apostrophes (’)`, "success");
        RunPalladinoDiagnostics();
        TriggerCompileNow();
    }
    else
    {
        ShowToast("All leading apostrophes are already correct.", "info", 1500);
    }
}

function FixTypewriterDashes()
{
    if (!MonacoInstance)
    {
        return ;
    }
    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return ;
    }

    const FullText = Model.getValue();
    const Lines = FullText.split("\n");
    let InCodeBlock = false;
    let InMathBlock = false;
    let ReplacedCount = 0;

    for (let Index = 0; Index < Lines.length; Index ++)
    {
        const Line = Lines[Index];
        const Trimmed = Line.trim();
        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = !InCodeBlock;
            continue ;
        }
        if (InCodeBlock)
        {
            continue ;
        }
        if (Trimmed === "$")
        {
            InMathBlock = !InMathBlock;
            continue ;
        }
        if (InMathBlock)
        {
            continue ;
        }
        if (Trimmed.startsWith("//") || Trimmed.startsWith("#set") || Trimmed.startsWith("#import") || Trimmed.startsWith("#include"))
        {
            continue ;
        }

        let NewLine = Line;
        NewLine = NewLine.replace
        (
            /---/g,
            () =>
            {
                ReplacedCount ++;
                return "—";
            }
        );
        NewLine = NewLine.replace
        (
            /([A-Za-z0-9\.,;!\?])\s*--\s*([A-Za-z0-9])/g,
            (Match, P1, P2) =>
            {
                ReplacedCount ++;
                return `${P1} – ${P2}`;
            }
        );
        NewLine = NewLine.replace
        (
            /\.\.\./g,
            () =>
            {
                ReplacedCount ++;
                return "…";
            }
        );

        Lines[Index] = NewLine;
    }

    if (ReplacedCount > 0)
    {
        const NewFullText = Lines.join("\n");
        MonacoInstance.executeEdits
        (
            "palladino-fix-dashes",
            [
                {
                    range: Model.getFullModelRange(),
                    text: NewFullText,
                    forceMoveMarkers: true
                }
            ]
        );
        ShowToast(`Palladino: Converted ${ReplacedCount} typewriter dash(es) & ellipses to typographic glyphs`, "success");
        RunPalladinoDiagnostics();
        TriggerCompileNow();
    }
    else
    {
        ShowToast("No typewriter dashes or triple-dots found to convert.", "info", 1500);
    }
}

function NormalizeSentenceSpaces()
{
    if (!MonacoInstance)
    {
        return ;
    }
    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return ;
    }

    const FullText = Model.getValue();
    const Lines = FullText.split("\n");
    let InCodeBlock = false;
    let ReplacedCount = 0;

    for (let Index = 0; Index < Lines.length; Index ++)
    {
        const Line = Lines[Index];
        const Trimmed = Line.trim();
        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = !InCodeBlock;
            continue ;
        }
        if (InCodeBlock)
        {
            continue ;
        }
        if (Trimmed.startsWith("//") || Trimmed.startsWith("#set") || Trimmed.startsWith("#import"))
        {
            continue ;
        }

        const NewLine = Line.replace
        (
            /([\.?!])\s{2,}([A-Z“‘"'])/g,
            (Match, P1, P2) =>
            {
                ReplacedCount ++;
                return `${P1} ${P2}`;
            }
        );
        Lines[Index] = NewLine;
    }

    if (ReplacedCount > 0)
    {
        const NewFullText = Lines.join("\n");
        MonacoInstance.executeEdits
        (
            "palladino-fix-spaces",
            [
                {
                    range: Model.getFullModelRange(),
                    text: NewFullText,
                    forceMoveMarkers: true
                }
            ]
        );
        ShowToast(`Palladino: Normalized ${ReplacedCount} sentence double-space(s) to single spaces`, "success");
        RunPalladinoDiagnostics();
        TriggerCompileNow();
    }
    else
    {
        ShowToast("All sentence spacing is already normalized.", "info", 1500);
    }
}

function SetOpticalMargins(Enabled)
{
    IsOpticalMarginsEnabled = Boolean(Enabled);
    localStorage.setItem("TypstStudio_OpticalMargins", String(IsOpticalMarginsEnabled));
    document.body.classList.toggle("OpticalMarginAlignment", IsOpticalMarginsEnabled);

    const Checkbox = document.getElementById("OpticalMarginsCheckbox");
    if (Checkbox)
    {
        Checkbox.checked = IsOpticalMarginsEnabled;
    }
}

function ToggleOpticalMargins()
{
    SetOpticalMargins(!IsOpticalMarginsEnabled);
    ShowToast(`Optical Margins: ${IsOpticalMarginsEnabled ? "Enabled": "Disabled"}`, "info", 1500);
}

function ToggleSmartQuotes(ForceState)
{
    IsSmartQuotesEnabled = (typeof ForceState === "boolean") ? ForceState: !IsSmartQuotesEnabled;
    localStorage.setItem("TypstStudio_SmartQuotes", String(IsSmartQuotesEnabled));

    const Checkbox = document.getElementById("SmartQuotesCheckbox");
    if (Checkbox)
    {
        Checkbox.checked = IsSmartQuotesEnabled;
    }
    ShowToast(`Smart Quotes: ${IsSmartQuotesEnabled ? "Enabled": "Disabled"}`, "info", 1500);
}

function PolishTypographyInDocument()
{
    if (!MonacoInstance)
    {
        return ;
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return ;
    }

    const Selection = MonacoInstance.getSelection();
    const HasSelection = Selection && !Selection.isEmpty();
    const TargetRange = HasSelection ? Selection: Model.getFullModelRange();
    const RawText = Model.getValueInRange(TargetRange);

    const Lines = RawText.split("\n");
    let InCodeBlock = false;

    for (let I = 0; I < Lines.length; I ++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = !InCodeBlock;
            continue;
        }

        if (InCodeBlock)
        {
            continue;
        }

        if (Trimmed.startsWith("#set ") || Trimmed.startsWith("#import ") || Trimmed.startsWith("#include "))
        {
            continue;
        }

        let Polished = Line;

        // 1. Em-dash (---) and En-dash (--)
        Polished = Polished.replace(/---/g, "—");
        Polished = Polished.replace(/--/g, "–");

        // 2. Ellipsis (...)
        Polished = Polished.replace(/\.\.\./g, "…");

        // 3. Double quotes
        Polished = Polished.replace(/(^|[\s\(\[\{<‘“])"/g, "$1“");
        Polished = Polished.replace(/"/g, "”");

        // 4. Single quotes
        Polished = Polished.replace(/(^|[\s\(\[\{<“])'/g, "$1‘");
        Polished = Polished.replace(/'/g, "’");

        Lines[I] = Polished;
    }

    const PolishedFullText = Lines.join("\n");
    MonacoInstance.executeEdits
    (
        "typographic-polish",
        [{
            range: TargetRange,
            text: PolishedFullText,
            forceMoveMarkers: true
        }]
    );

    ShowToast("Typographic Polish: converted quotes and dashes to smart glyphs", "success");
    TriggerCompileNow();
}

function SetupSmartTypographyKeydownListener()
{
    if (!MonacoInstance)
    {
        return ;
    }

    MonacoInstance.onKeyDown
    (
        (Event) =>
        {
            if (!IsSmartQuotesEnabled)
            {
                return ;
            }

            const BrowserEvent = Event.browserEvent;
            const Key = BrowserEvent.key;

            if (Key !== '"' && Key !== "'" && Key !== " ")
            {
                return ;
            }

            const Selection = MonacoInstance.getSelection();
            if (!Selection || !Selection.isEmpty())
            {
                return ;
            }

            const Model = MonacoInstance.getModel();
            if (!Model)
            {
                return ;
            }

            const Line = Selection.positionLineNumber;
            const Col = Selection.positionColumn;
            const LineContent = Model.getLineContent(Line);
            const PreText = LineContent.substring(0, Col - 1);

            const Trimmed = LineContent.trim();
            const IsCodeLine = Trimmed.startsWith("#set ") ||
                               Trimmed.startsWith("#import ") ||
                               Trimmed.startsWith("#include ") ||
                               Trimmed.startsWith("#let ") ||
                               Trimmed.startsWith("#show ");

            if (IsCodeLine)
            {
                return ;
            }

            const BacktickCount = (PreText.match(/`/g) || []).length;
            if (BacktickCount % 2 === 1)
            {
                return ;
            }

            if (Key === '"')
            {
                BrowserEvent.preventDefault();
                Event.stopPropagation();

                const PrevChar = PreText.slice(-1);
                const IsOpen = PreText.length === 0 || /\s|[\(\[\{<‘“]/.test(PrevChar);
                const SmartQuote = IsOpen ? "“": "”";

                MonacoInstance.executeEdits
                (
                    "smart-quotes",
                    [{
                        range: new monaco.Range(Line, Col, Line, Col),
                        text: SmartQuote,
                        forceMoveMarkers: true
                    }]
                );
                return ;
            }

            if (Key === "'")
            {
                BrowserEvent.preventDefault();
                Event.stopPropagation();

                const PrevChar = PreText.slice(-1);
                const IsOpen = PreText.length === 0 || /\s|[\(\[\{<“]/.test(PrevChar);
                const SmartQuote = IsOpen ? "‘": "’";

                MonacoInstance.executeEdits
                (
                    "smart-quotes",
                    [{
                        range: new monaco.Range(Line, Col, Line, Col),
                        text: SmartQuote,
                        forceMoveMarkers: true
                    }]
                );
                return ;
            }

            if (Key === " ")
            {
                if (PreText.endsWith("---"))
                {
                    BrowserEvent.preventDefault();
                    Event.stopPropagation();

                    MonacoInstance.executeEdits
                    (
                        "smart-dash",
                        [{
                            range: new monaco.Range(Line, Col - 3, Line, Col),
                            text: "— ",
                            forceMoveMarkers: true
                        }]
                    );
                    return ;
                }
                else if (PreText.endsWith("--"))
                {
                    BrowserEvent.preventDefault();
                    Event.stopPropagation();

                    MonacoInstance.executeEdits
                    (
                        "smart-dash",
                        [{
                            range: new monaco.Range(Line, Col - 2, Line, Col),
                            text: "– ",
                            forceMoveMarkers: true
                        }]
                    );
                    return ;
                }
            }
        }
    );
}

// --- STRUCTURAL CONTAINER DISPATCH HOOK (UNHINDERED USER EDITING) ---

function SetupStructuralContainerDispatchHook()
{
    // Real-time keystroke interception and modification blocking disabled.
    // Users retain full, unhindered freedom to use Backspace, Delete, Cut, Paste, and Replace.
    return ;
}

// --- TYPEWRITER & HEMINGWAY FOCUS LIGHT (PHASE 7.2) ---

function ApplyTypewriterScroll(CursorLine)
{
    if (!IsTypewriterScrollEnabled || !MonacoInstance || IsEditorWheelScrolling || (Date.now() - LastTypingTimestamp) >= 350)
    {
        return ;
    }

    const LayoutInfo = MonacoInstance.getLayoutInfo();
    if (!LayoutInfo || LayoutInfo.height <= 0)
    {
        return ;
    }

    const TopForLine = MonacoInstance.getTopForLineNumber(CursorLine);
    const GoldenRatioOffset = Math.round(LayoutInfo.height * 0.40);
    const TargetScrollTop = Math.max(0, TopForLine - GoldenRatioOffset);

    if (Math.abs(MonacoInstance.getScrollTop() - TargetScrollTop) > 4)
    {
        requestAnimationFrame
        (
            () =>
            {
                if (IsTypewriterScrollEnabled && MonacoInstance && !IsEditorWheelScrolling)
                {
                    MonacoInstance.setScrollTop(TargetScrollTop);
                }
            }
        );
    }
}

function ToggleTypewriterScroll(ForceState)
{
    IsTypewriterScrollEnabled = (typeof ForceState === "boolean") ? ForceState: !IsTypewriterScrollEnabled;
    localStorage.setItem("TypstStudio_TypewriterScroll", String(IsTypewriterScrollEnabled));

    const Checkbox = document.getElementById("TypewriterScrollCheckbox");
    if (Checkbox)
    {
        Checkbox.checked = IsTypewriterScrollEnabled;
    }

    const Pill = document.getElementById("StatusBarTypewriterBtn");
    if (Pill)
    {
        Pill.classList.toggle("Active", IsTypewriterScrollEnabled);
        const Txt = document.getElementById("StatusBarTypewriterText");
        if (Txt)
        {
            Txt.textContent = `Typewriter: ${IsTypewriterScrollEnabled ? "ON": "OFF"}`;
        }
    }

    if (IsTypewriterScrollEnabled && MonacoInstance)
    {
        const Pos = MonacoInstance.getPosition();
        if (Pos)
        {
            ApplyTypewriterScroll(Pos.lineNumber);
        }
    }

    ShowToast(`Typewriter Center Scroll: ${IsTypewriterScrollEnabled ? "Enabled (40% Golden Ratio)": "Disabled"}`, "info", 1500);
}

function UpdateHemingwayFocus(CursorLine)
{
    if (!MonacoInstance)
    {
        return ;
    }

    if (!HemingwayDecorations)
    {
        HemingwayDecorations = MonacoInstance.createDecorationsCollection([]);
    }

    if (!IsHemingwayFocusEnabled)
    {
        if (CachedHemingwayStart !== -1)
        {
            HemingwayDecorations.clear();
            CachedHemingwayStart = -1;
            CachedHemingwayEnd = -1;
        }
        return ;
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        HemingwayDecorations.clear();
        return ;
    }

    // Automatically disable dimming when text is selected across multiple paragraphs/lines
    const ActiveSelection = MonacoInstance.getSelection();
    if (ActiveSelection && !ActiveSelection.isEmpty() && ActiveSelection.startLineNumber !== ActiveSelection.endLineNumber)
    {
        if (CachedHemingwayStart !== -1)
        {
            HemingwayDecorations.clear();
            CachedHemingwayStart = -1;
            CachedHemingwayEnd = -1;
        }
        return ;
    }

    const TotalLines = Model.getLineCount();
    if (TotalLines <= 1)
    {
        HemingwayDecorations.clear();
        return ;
    }

    const CurrentLineText = Model.getLineContent(CursorLine).trim();
    let ParaStart = CursorLine;
    let ParaEnd = CursorLine;

    if (CurrentLineText !== "")
    {
        // Scan upward to find paragraph start (first line after an empty line or line 1)
        while (ParaStart > 1 && Model.getLineContent(ParaStart - 1).trim() !== "")
        {
            ParaStart --;
        }

        // Scan downward to find paragraph end (last line before an empty line or TotalLines)
        while (ParaEnd < TotalLines && Model.getLineContent(ParaEnd + 1).trim() !== "")
        {
            ParaEnd ++;
        }
    }

    // Fast-path cache check: if cursor remains within the same active paragraph, no decoration update needed
    if (ParaStart === CachedHemingwayStart && ParaEnd === CachedHemingwayEnd)
    {
        return ;
    }

    CachedHemingwayStart = ParaStart;
    CachedHemingwayEnd = ParaEnd;

    const NewDecorations = [];

    // Preceding dimmed block
    if (ParaStart > 1)
    {
        NewDecorations.push
        ({
            range: new monaco.Range(1, 1, ParaStart - 1, Model.getLineMaxColumn(ParaStart - 1)),
            options:
            {
                isWholeLine: true,
                className: "typst-hemingway-dimmed"
            }
        });
    }

    // Following dimmed block
    if (ParaEnd < TotalLines)
    {
        NewDecorations.push
        ({
            range: new monaco.Range(ParaEnd + 1, 1, TotalLines, Model.getLineMaxColumn(TotalLines)),
            options:
            {
                isWholeLine: true,
                className: "typst-hemingway-dimmed"
            }
        });
    }

    HemingwayDecorations.set(NewDecorations);
}

function ToggleHemingwayFocus(ForceState)
{
    IsHemingwayFocusEnabled = (typeof ForceState === "boolean") ? ForceState: !IsHemingwayFocusEnabled;
    localStorage.setItem("TypstStudio_HemingwayFocus", String(IsHemingwayFocusEnabled));

    const Checkbox = document.getElementById("HemingwayFocusCheckbox");
    if (Checkbox)
    {
        Checkbox.checked = IsHemingwayFocusEnabled;
    }

    const Pill = document.getElementById("StatusBarHemingwayBtn");
    if (Pill)
    {
        Pill.classList.toggle("Active", IsHemingwayFocusEnabled);
        const Txt = document.getElementById("StatusBarHemingwayText");
        if (Txt)
        {
            Txt.textContent = `Focus Light: ${IsHemingwayFocusEnabled ? "ON": "OFF"}`;
        }
    }

    CachedHemingwayStart = -1;
    CachedHemingwayEnd = -1;

    if (MonacoInstance)
    {
        const Pos = MonacoInstance.getPosition();
        UpdateHemingwayFocus(Pos ? Pos.lineNumber: 1);
    }

    ShowToast(`Hemingway Focus Light: ${IsHemingwayFocusEnabled ? "Enabled (Paragraph Spotlight)": "Disabled"}`, "info", 1500);
}

// --- ZERO-DIALOG IMAGE PASTING (PHASE 7.3) ---

function InsertImageMarkdownIntoEditor(RelativePath)
{
    if (!MonacoInstance)
    {
        return ;
    }

    const Selection = MonacoInstance.getSelection();
    if (!Selection)
    {
        return ;
    }

    const Model = MonacoInstance.getModel();
    const LineContent = Model ? Model.getLineContent(Selection.startLineNumber): "";
    const IndentMatch = LineContent.match(/^\s*/);
    const Indent = IndentMatch ? IndentMatch[0]: "";

    const NeedsNewLine = LineContent.trim().length > 0 && Selection.startColumn > 1;
    const ImageTag = `#image("${RelativePath}")`;
    const FormattedText = NeedsNewLine ? `\n${Indent}${ImageTag}`: `${ImageTag}`;

    MonacoInstance.executeEdits
    (
        "zero-dialog-image-paste",
        [
            {
                range: Selection,
                text: FormattedText,
                forceMoveMarkers: true
            }
        ]
    );

    MonacoInstance.focus();
    TriggerCompileNow();
}

async function HandlePastedImageFile(File)
{
    if (!File)
    {
        return ;
    }

    try
    {
        const Reader = new FileReader();
        Reader.onload = async (Event) =>
        {
            const DataUrl = Event.target.result;
            if (!DataUrl)
            {
                return ;
            }

            if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
            {
                try
                {
                    const Result = await window.__TAURI__.core.invoke
                    (
                        "SavePastedFileAsset",
                        {
                            docPath: CurrentFilePath || null,
                            DocPath: CurrentFilePath || null,
                            fileName: File.name || "paste.png",
                            FileName: File.name || "paste.png",
                            base64Data: DataUrl,
                            Base64Data: DataUrl
                        }
                    );

                    if (Result && Result.Success)
                    {
                        InsertImageMarkdownIntoEditor(Result.RelativePath);
                        const Msg = Result.IsDuplicate ? `Reused ${Result.RelativePath}`: `Saved ${Result.RelativePath}`;
                        ShowToast(Msg, "success", 2000);
                        return ;
                    }
                }
                catch (TauriErr)
                {
                    console.warn("Tauri SavePastedFileAsset error:", TauriErr);
                }
            }

            try
            {
                const UploadResp = await fetch
                (
                    "/api/assets/upload",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify
                        ({
                            FileName: File.name || "paste.png",
                            Base64Data: DataUrl,
                            DocPath: CurrentFilePath || ""
                        })
                    }
                );

                if (UploadResp.ok)
                {
                    const Data = await UploadResp.json();
                    if (Data.RelativePath)
                    {
                        InsertImageMarkdownIntoEditor(Data.RelativePath);
                        ShowToast(`Saved ${Data.RelativePath}`, "success", 2000);
                        return ;
                    }
                }
            }
            catch (Ignored) {}

            InsertImageMarkdownIntoEditor(`assets/${File.name || "paste.png"}`);
            ShowToast(`Inserted reference to assets/${File.name || "paste.png"}`, "info", 2000);
        };

        Reader.readAsDataURL(File);
    }
    catch (Err)
    {
        console.error("HandlePastedImageFile error:", Err);
        ShowToast("Failed to process pasted image", "error", 2500);
    }
}

async function HandlePastedClipboardImageRust()
{
    if (!window.__TAURI__ || !window.__TAURI__.core || typeof window.__TAURI__.core.invoke !== "function")
    {
        return false;
    }

    try
    {
        const Result = await window.__TAURI__.core.invoke
        (
            "PasteClipboardImage",
            {
                docPath: CurrentFilePath || null,
                DocPath: CurrentFilePath || null
            }
        );

        if (Result && Result.Success)
        {
            InsertImageMarkdownIntoEditor(Result.RelativePath);
            const Msg = Result.IsDuplicate ? `Reused ${Result.RelativePath}`: `Saved ${Result.RelativePath}`;
            ShowToast(Msg, "success", 2000);
            return true;
        }
        else if (Result && Result.ErrorMessage)
        {
            console.debug("PasteClipboardImage result:", Result.ErrorMessage);
        }
    }
    catch (Err)
    {
        console.debug("PasteClipboardImage invoke error:", Err);
    }
    return false;
}

function SetupZeroDialogClipboardPasting()
{
    if (!MonacoInstance)
    {
        return ;
    }

    const EditorDomNode = MonacoInstance.getDomNode();
    if (!EditorDomNode)
    {
        return ;
    }

    EditorDomNode.addEventListener
    (
        "paste",
        async (E) =>
        {
            const ClipboardData = E.clipboardData || window.clipboardData;
            if (!ClipboardData)
            {
                return ;
            }

            const Files = ClipboardData.files;
            if (Files && Files.length > 0)
            {
                for (let I = 0; I < Files.length; I++)
                {
                    const File = Files[I];
                    if (File.type.startsWith("image/") || File.name.toLowerCase().endsWith(".svg") || File.name.toLowerCase().endsWith(".png") || File.name.toLowerCase().endsWith(".jpg") || File.name.toLowerCase().endsWith(".jpeg") || File.name.toLowerCase().endsWith(".webp"))
                    {
                        E.preventDefault();
                        E.stopPropagation();
                        await HandlePastedImageFile(File);
                        return ;
                    }
                }
            }

            let HasImageItem = false;
            let ImageItem = null;
            if (ClipboardData.items && ClipboardData.items.length > 0)
            {
                for (let I = 0; I < ClipboardData.items.length; I++)
                {
                    if (ClipboardData.items[I].type.startsWith("image/"))
                    {
                        HasImageItem = true;
                        ImageItem = ClipboardData.items[I];
                        break;
                    }
                }
            }

            const PlainText = ClipboardData.getData("text/plain");
            if (!HasImageItem && PlainText && PlainText.length > 0)
            {
                return ;
            }

            if (ImageItem)
            {
                const BlobFile = ImageItem.getAsFile();
                if (BlobFile)
                {
                    E.preventDefault();
                    E.stopPropagation();
                    await HandlePastedImageFile(BlobFile);
                    return ;
                }
            }

            if (window.__TAURI__ && (!PlainText || PlainText.trim() === ""))
            {
                const Handled = await HandlePastedClipboardImageRust();
                if (Handled)
                {
                    E.preventDefault();
                    E.stopPropagation();
                }
            }
        },
        true
    );
}

// --- TIME MACHINE FOR WORDS (PHASE 7.5) ---

function ComputeSimpleDiff(OldText, NewText)
{
    const OldLines = OldText ? OldText.split("\n"): [];
    const NewLines = NewText ? NewText.split("\n"): [];
    const DiffResult = [];

    let OldIdx = 0;
    let NewIdx = 0;
    let AddedCount = 0;
    let RemovedCount = 0;

    while (OldIdx < OldLines.length || NewIdx < NewLines.length)
    {
        if (OldIdx < OldLines.length && NewIdx < NewLines.length)
        {
            if (OldLines[OldIdx] === NewLines[NewIdx])
            {
                DiffResult.push
                ({
                    Type: "unchanged",
                    Text: OldLines[OldIdx],
                    OldLine: OldIdx + 1,
                    NewLine: NewIdx + 1
                });
                OldIdx ++;
                NewIdx ++;
            }
            else
            {
                let FoundInNew = -1;
                let FoundInOld = -1;
                for (let Look = 1; Look < 5; Look++)
                {
                    if (NewIdx + Look < NewLines.length && OldLines[OldIdx] === NewLines[NewIdx + Look] && FoundInNew === -1)
                    {
                        FoundInNew = Look;
                    }
                    if (OldIdx + Look < OldLines.length && OldLines[OldIdx + Look] === NewLines[NewIdx] && FoundInOld === -1)
                    {
                        FoundInOld = Look;
                    }
                }

                if (FoundInNew !== -1 && (FoundInOld === -1 || FoundInNew <= FoundInOld))
                {
                    for (let K = 0; K < FoundInNew; K++)
                    {
                        DiffResult.push
                        ({
                            Type: "added",
                            Text: NewLines[NewIdx],
                            OldLine: null,
                            NewLine: NewIdx + 1
                        });
                        NewIdx ++;
                        AddedCount ++;
                    }
                }
                else if (FoundInOld !== -1)
                {
                    for (let K = 0; K < FoundInOld; K++)
                    {
                        DiffResult.push
                        ({
                            Type: "removed",
                            Text: OldLines[OldIdx],
                            OldLine: OldIdx + 1,
                            NewLine: null
                        });
                        OldIdx ++;
                        RemovedCount ++;
                    }
                }
                else
                {
                    DiffResult.push
                    ({
                        Type: "removed",
                        Text: OldLines[OldIdx],
                        OldLine: OldIdx + 1,
                        NewLine: null
                    });
                    OldIdx ++;
                    RemovedCount ++;

                    DiffResult.push
                    ({
                        Type: "added",
                        Text: NewLines[NewIdx],
                        OldLine: null,
                        NewLine: NewIdx + 1
                    });
                    NewIdx ++;
                    AddedCount ++;
                }
            }
        }
        else if (NewIdx < NewLines.length)
        {
            DiffResult.push
            ({
                Type: "added",
                Text: NewLines[NewIdx],
                OldLine: null,
                NewLine: NewIdx + 1
            });
            NewIdx ++;
            AddedCount ++;
        }
        else
        {
            DiffResult.push
            ({
                Type: "removed",
                Text: OldLines[OldIdx],
                OldLine: OldIdx + 1,
                NewLine: null
            });
            OldIdx ++;
            RemovedCount ++;
        }
    }

    return { Lines: DiffResult, Added: AddedCount, Removed: RemovedCount };
}

async function CaptureTimelineSnapshot(Label)
{
    if (!MonacoInstance)
    {
        return null;
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return null;
    }

    const Content = Model.getValue();
    const Words = Content.trim() ? Content.trim().split(/\s+/).length: 0;

    if (!Label && Math.abs(Words - LastSnapshotWordCount) < 5 && LastSnapshotWordCount > 0)
    {
        return null;
    }

    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            const Snapshot = await window.__TAURI__.core.invoke
            (
                "SaveTimelineSnapshot",
                {
                    docPath: CurrentFilePath || null,
                    DocPath: CurrentFilePath || null,
                    content: Content,
                    Content: Content,
                    label: Label || null,
                    Label: Label || null
                }
            );

            LastSnapshotWordCount = Words;
            return Snapshot;
        }
        catch (Err)
        {
            console.warn("Tauri SaveTimelineSnapshot error:", Err);
        }
    }

    const Secs = Math.floor(Date.now() / 1000);
    const FallbackSnapshot =
    {
        Id: `web_${Secs}`,
        Timestamp: Secs,
        FormattedTime: new Date().toLocaleTimeString(),
        Label: Label || "Automatic Checkpoint",
        WordCount: Words,
        CharacterCount: Content.length,
        ContentHash: String(Content.length),
        Content: Content
    };

    TimelineSnapshots.push(FallbackSnapshot);
    LastSnapshotWordCount = Words;
    return FallbackSnapshot;
}

function ScheduleTimelineSnapshot(DelayMs, Label)
{
    if (TimelineAutoCaptureTimer)
    {
        clearTimeout(TimelineAutoCaptureTimer);
    }

    if (MonacoInstance)
    {
        const Model = MonacoInstance.getModel();
        if (Model)
        {
            const Content = Model.getValue();
            const Words = Content.trim() ? Content.trim().split(/\s+/).length: 0;
            if (Math.abs(Words - LastSnapshotWordCount) >= 50)
            {
                CaptureTimelineSnapshot(Label || "Word Count Milestone (+50w)");
                return ;
            }
        }
    }

    TimelineAutoCaptureTimer = setTimeout
    (
        () =>
        {
            CaptureTimelineSnapshot(Label);
        },
        DelayMs || 20000
    );
}

async function OpenTimeMachine()
{
    const Modal = document.getElementById("TimeMachineModal");
    if (!Modal)
    {
        return ;
    }

    Modal.classList.add("Active");
    Modal.style.display = "flex";

    let Snapshots = [];
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            Snapshots = await window.__TAURI__.core.invoke
            (
                "GetTimelineSnapshots",
                {
                    DocPath: CurrentFilePath || null
                }
            );
        }
        catch (Err)
        {
            console.warn("Tauri GetTimelineSnapshots error:", Err);
        }
    }

    if (!Snapshots || Snapshots.length === 0)
    {
        const Initial = await CaptureTimelineSnapshot("Initial Milestone");
        if (Initial)
        {
            Snapshots = [Initial];
        }
    }

    TimelineSnapshots = Snapshots || [];
    const Slider = document.getElementById("TimeMachineSlider");
    if (Slider)
    {
        Slider.min = "0";
        Slider.max = String(Math.max(0, TimelineSnapshots.length - 1));
        Slider.value = String(Math.max(0, TimelineSnapshots.length - 1));
    }

    if (TimelineSnapshots.length > 0)
    {
        await SelectTimelineSnapshot(TimelineSnapshots.length - 1);
    }
    else
    {
        const DiffContent = document.getElementById("TimeMachineDiffContent");
        if (DiffContent)
        {
            DiffContent.innerHTML = `<div Class = "TimeMachineEmptyState">No milestones recorded yet. Keep typing to capture automatic local history!</div>`;
        }
    }
}

function CloseTimeMachine()
{
    const Modal = document.getElementById("TimeMachineModal");
    if (Modal)
    {
        Modal.classList.remove("Active");
        Modal.style.display = "none";
    }
}
window.CloseTimeMachine = CloseTimeMachine;
window.OpenTimeMachine = OpenTimeMachine;

async function SelectTimelineSnapshot(Index)
{
    if (!TimelineSnapshots || Index < 0 || Index >= TimelineSnapshots.length)
    {
        return ;
    }

    ActiveTimelineSnapshotIndex = Index;
    const Snapshot = TimelineSnapshots[Index];

    const Badge = document.getElementById("TimeMachineMilestoneBadge");
    if (Badge)
    {
        Badge.textContent = `Milestone ${Index + 1} of ${TimelineSnapshots.length}`;
    }

    const TimeEl = document.getElementById("TimeMachineSnapshotTime");
    if (TimeEl)
    {
        TimeEl.textContent = Snapshot.FormattedTime || "—";
    }

    const WordsEl = document.getElementById("TimeMachineSnapshotWords");
    if (WordsEl)
    {
        WordsEl.textContent = `${Snapshot.WordCount || 0} words`;
    }

    const LabelEl = document.getElementById("TimeMachineSnapshotLabel");
    if (LabelEl)
    {
        LabelEl.textContent = Snapshot.Label || "Automatic Checkpoint";
    }

    let SnapshotContent = Snapshot.Content;
    if (typeof SnapshotContent !== "string")
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            try
            {
                SnapshotContent = await window.__TAURI__.core.invoke
                (
                    "GetTimelineSnapshotContent",
                    {
                        DocPath: CurrentFilePath || null,
                        SnapshotId: Snapshot.Id
                    }
                );
            }
            catch (Err)
            {
                console.warn("GetTimelineSnapshotContent error:", Err);
                SnapshotContent = "";
            }
        }
        else
        {
            SnapshotContent = "";
        }
    }

    ActiveSnapshotCachedContent = SnapshotContent || "";

    const CurrentContent = MonacoInstance ? MonacoInstance.getValue(): "";
    const CurrentWords = CurrentContent.trim() ? CurrentContent.trim().split(/\s+/).length: 0;
    const SnapshotWords = Snapshot.WordCount || 0;
    const Delta = CurrentWords - SnapshotWords;

    const DeltaBadge = document.getElementById("TimeMachineWordDeltaBadge");
    if (DeltaBadge)
    {
        if (Delta > 0)
        {
            DeltaBadge.textContent = `+${Delta} words vs Live`;
            DeltaBadge.style.color = "#00E676";
            DeltaBadge.style.background = "rgba(0, 230, 118, 0.14)";
        }
        else if (Delta < 0)
        {
            DeltaBadge.textContent = `${Delta} words vs Live`;
            DeltaBadge.style.color = "#FF1744";
            DeltaBadge.style.background = "rgba(255, 23, 68, 0.14)";
        }
        else
        {
            DeltaBadge.textContent = "Identical to Live";
            DeltaBadge.style.color = "#D6D3CD";
            DeltaBadge.style.background = "rgba(255, 255, 255, 0.08)";
        }
    }

    const DiffResult = ComputeSimpleDiff(ActiveSnapshotCachedContent, CurrentContent);

    const DiffStats = document.getElementById("TimeMachineDiffStats");
    if (DiffStats)
    {
        DiffStats.textContent = `+${DiffResult.Added} / -${DiffResult.Removed} changes`;
    }

    const DiffContainer = document.getElementById("TimeMachineDiffContent");
    if (DiffContainer)
    {
        if (DiffResult.Lines.length === 0)
        {
            DiffContainer.innerHTML = `<div Class = "TimeMachineEmptyState">Document is identical at this milestone.</div>`;
        }
        else
        {
            let Html = "";
            for (let I = 0; I < DiffResult.Lines.length; I++)
            {
                const Line = DiffResult.Lines[I];
                const ClassName = Line.Type === "added" ? "Added": (Line.Type === "removed" ? "Removed": "Unchanged");
                const Sign = Line.Type === "added" ? "+": (Line.Type === "removed" ? "-": " ");
                const LineNum = Line.NewLine || Line.OldLine || "";
                const EscapedText = Line.Text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

                Html += `<div Class = "TimeMachineDiffLine ${ClassName}"><span Class = "LineNum">${LineNum}</span><span Class = "LineSign">${Sign}</span><span Class = "LineText">${EscapedText || "&nbsp;"}</span></div>`;
            }
            DiffContainer.innerHTML = Html;
        }
    }
}

async function RestoreActiveTimelineSnapshot()
{
    if (!MonacoInstance || ActiveTimelineSnapshotIndex < 0 || !ActiveSnapshotCachedContent)
    {
        return ;
    }

    const Snapshot = TimelineSnapshots[ActiveTimelineSnapshotIndex];
    if (!Snapshot)
    {
        return ;
    }

    // Safety guarantee: checkpoint current state before restoring
    await CaptureTimelineSnapshot("Before Restore");

    const Model = MonacoInstance.getModel();
    if (Model)
    {
        const FullRange = Model.getFullModelRange();
        MonacoInstance.executeEdits
        (
            "time-machine-restore",
            [
                {
                    range: FullRange,
                    text: ActiveSnapshotCachedContent,
                    forceMoveMarkers: true
                }
            ]
        );

        TriggerCompileNow();
        CloseTimeMachine();
        ShowToast(`Restored version from ${Snapshot.FormattedTime}`, "success", 2500);
    }
}

function CopyActiveTimelineSnapshot()
{
    if (!ActiveSnapshotCachedContent)
    {
        ShowToast("No snapshot content available to copy", "warning", 2000);
        return ;
    }

    if (navigator.clipboard && navigator.clipboard.writeText)
    {
        navigator.clipboard.writeText(ActiveSnapshotCachedContent);
        ShowToast("Copied snapshot text to clipboard", "success", 1800);
    }
}

// --- KEYNOTE STAGE MODE (PHASE 7.4) ---

function ExtractPresenterNotes(Source, SlideIndex)
{
    if (!Source)
    {
        return "No presenter notes for this slide.\n(Add notes in code with `// NOTE: Your talking points`)";
    }

    const SlideChunks = Source.split(/(?:#pagebreak\(\)|#slide\s*\[)/);
    const TargetChunk = SlideChunks[SlideIndex] || "";

    const NoteMatches = [];
    const Lines = TargetChunk.split("\n");
    for (const Line of Lines)
    {
        const NoteMatch = Line.match(/\/\/\s*(?:NOTE|SPEAKER|PRESENTER):\s*(.*)/i);
        if (NoteMatch)
        {
            NoteMatches.push(NoteMatch[1].trim());
        }
    }

    if (NoteMatches.length > 0)
    {
        return NoteMatches.join("\n\n");
    }

    return "No presenter notes for this slide.\n(Add notes in code with `// NOTE: Your talking points`)";
}

function RenderStageSlide()
{
    if (!LastCompiledPages || LastCompiledPages.length === 0)
    {
        return ;
    }

    CurrentStageSlideIndex = Math.max(0, Math.min(CurrentStageSlideIndex, LastCompiledPages.length - 1));

    let SlideSvg = LastCompiledPages[CurrentStageSlideIndex];
    if (CurrentPaperColorMode === "optimized" || CurrentPaperColorMode === "pure_black")
    {
        SlideSvg = ConvertSvgToDarkMode(SlideSvg, false, CurrentPaperColorMode);
    }

    const Container = document.getElementById("KeynoteSlideContainer");
    if (Container)
    {
        Container.innerHTML = SlideSvg;
    }

    const Counter = document.getElementById("KeynoteSlideCounter");
    if (Counter)
    {
        Counter.textContent = `Slide ${CurrentStageSlideIndex + 1} / ${LastCompiledPages.length}`;
    }

    const NotesContent = document.getElementById("KeynoteNotesContent");
    if (NotesContent && MonacoInstance)
    {
        const Source = MonacoInstance.getValue();
        NotesContent.textContent = ExtractPresenterNotes(Source, CurrentStageSlideIndex);
    }

    // Pre-cache next slide SVG
    if (CurrentStageSlideIndex + 1 < LastCompiledPages.length)
    {
        const NextSvg = LastCompiledPages[CurrentStageSlideIndex + 1];
        if (NextSvg && (CurrentPaperColorMode === "optimized" || CurrentPaperColorMode === "pure_black"))
        {
            ConvertSvgToDarkMode(NextSvg, false, CurrentPaperColorMode);
        }
    }
}

function NextStageSlide()
{
    if (!LastCompiledPages || LastCompiledPages.length === 0)
    {
        return ;
    }

    if (CurrentStageSlideIndex < LastCompiledPages.length - 1)
    {
        CurrentStageSlideIndex ++;
        RenderStageSlide();
    }
}

function PrevStageSlide()
{
    if (CurrentStageSlideIndex > 0)
    {
        CurrentStageSlideIndex --;
        RenderStageSlide();
    }
}

function ToggleStageNotes()
{
    IsStageNotesVisible = !IsStageNotesVisible;
    const Drawer = document.getElementById("KeynoteNotesDrawer");
    if (Drawer)
    {
        Drawer.classList.toggle("Active", IsStageNotesVisible);
    }
}

function ToggleStageBlackout()
{
    IsStageBlackout = !IsStageBlackout;
    const Overlay = document.getElementById("KeynoteStageOverlay");
    if (Overlay)
    {
        Overlay.classList.toggle("Blackout", IsStageBlackout);
    }
}

function HandleStageModeKeydown(E)
{
    if (!IsKeynoteStageMode)
    {
        return ;
    }

    if (E.key === "Escape")
    {
        E.preventDefault();
        E.stopPropagation();
        ExitKeynoteStageMode();
        return ;
    }

    if (E.key === "ArrowRight" || E.key === "PageDown" || E.key === " " || E.key === "Enter")
    {
        E.preventDefault();
        E.stopPropagation();
        NextStageSlide();
        return ;
    }

    if (E.key === "ArrowLeft" || E.key === "PageUp" || E.key === "Backspace")
    {
        E.preventDefault();
        E.stopPropagation();
        PrevStageSlide();
        return ;
    }

    if (E.key === "Home")
    {
        E.preventDefault();
        E.stopPropagation();
        CurrentStageSlideIndex = 0;
        RenderStageSlide();
        return ;
    }

    if (E.key === "End")
    {
        E.preventDefault();
        E.stopPropagation();
        CurrentStageSlideIndex = (LastCompiledPages ? LastCompiledPages.length - 1: 0);
        RenderStageSlide();
        return ;
    }

    if (E.key === "n" || E.key === "N")
    {
        E.preventDefault();
        E.stopPropagation();
        ToggleStageNotes();
        return ;
    }

    if (E.key === "b" || E.key === "B")
    {
        E.preventDefault();
        E.stopPropagation();
        ToggleStageBlackout();
        return ;
    }

    if (E.key === "F5" || ((E.ctrlKey || E.metaKey) && (E.key === "r" || E.key === "R" || E.key === "p" || E.key === "P")))
    {
        E.preventDefault();
        E.stopPropagation();
    }
}

async function EnterKeynoteStageMode(StartingPageIndex)
{
    if (!LastCompiledPages || LastCompiledPages.length === 0)
    {
        ShowToast("Compile your document or slide deck first to present", "warning", 2500);
        return ;
    }

    IsKeynoteStageMode = true;
    CurrentStageSlideIndex = (typeof StartingPageIndex === "number" && StartingPageIndex >= 0) ? StartingPageIndex: 0;
    IsStageBlackout = false;

    const Overlay = document.getElementById("KeynoteStageOverlay");
    if (!Overlay)
    {
        return ;
    }

    Overlay.classList.remove("Blackout");
    Overlay.classList.add("Active");

    RenderStageSlide();

    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            await window.__TAURI__.core.invoke("SetFullscreen", { Fullscreen: true });
        }
        catch (Err)
        {
            console.warn("SetFullscreen invoke error:", Err);
        }
    }
    else if (document.documentElement.requestFullscreen)
    {
        try
        {
            await document.documentElement.requestFullscreen();
        }
        catch (Ignored) {}
    }

    StagePresentationStartTime = Date.now();
    const TimerEl = document.getElementById("KeynoteTimer");
    if (TimerEl)
    {
        TimerEl.textContent = "00:00";
    }

    if (StageTimerInterval)
    {
        clearInterval(StageTimerInterval);
    }
    StageTimerInterval = setInterval
    (
        () =>
        {
            const ElapsedSecs = Math.floor((Date.now() - StagePresentationStartTime) / 1000);
            const Mins = Math.floor(ElapsedSecs / 60);
            const Secs = ElapsedSecs % 60;
            const Formatted = `${String(Mins).padStart(2, "0")}:${String(Secs).padStart(2, "0")}`;
            const TEl = document.getElementById("KeynoteTimer");
            if (TEl)
            {
                TEl.textContent = Formatted;
            }
        },
        1000
    );

    window.addEventListener("keydown", HandleStageModeKeydown, true);
}

async function ExitKeynoteStageMode()
{
    IsKeynoteStageMode = false;
    window.removeEventListener("keydown", HandleStageModeKeydown, true);

    if (StageTimerInterval)
    {
        clearInterval(StageTimerInterval);
        StageTimerInterval = null;
    }

    const Overlay = document.getElementById("KeynoteStageOverlay");
    if (Overlay)
    {
        Overlay.classList.remove("Active");
        Overlay.classList.remove("Blackout");
    }

    const Drawer = document.getElementById("KeynoteNotesDrawer");
    if (Drawer)
    {
        Drawer.classList.remove("Active");
    }
    IsStageNotesVisible = false;

    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            await window.__TAURI__.core.invoke("SetFullscreen", { Fullscreen: false });
        }
        catch (Err)
        {
            console.warn("Restore fullscreen error:", Err);
        }
    }
    else if (document.fullscreenElement && document.exitFullscreen)
    {
        try
        {
            await document.exitFullscreen();
        }
        catch (Ignored) {}
    }
}

function SetupDualModeAndExportEventListeners()
{
    const FocusBtn = document.getElementById("ModeFocusBtn");
    const StudioBtn = document.getElementById("ModeStudioBtn");
    if (FocusBtn)
    {
        FocusBtn.addEventListener("click", () => { SetUIMode("focus"); });
    }
    if (StudioBtn)
    {
        StudioBtn.addEventListener("click", () => { SetUIMode("studio"); });
    }

    const HeaderSettingsBtn = document.getElementById("HeaderSettingsBtn");
    const DashboardSettingsBtn = document.getElementById("DashboardSettingsBtn");
    const CloseSettingsBtn = document.getElementById("CloseSettingsModalBtn");
    if (HeaderSettingsBtn)
    {
        HeaderSettingsBtn.addEventListener("click", () => { OpenSettingsModal("appearance"); });
    }
    if (DashboardSettingsBtn)
    {
        DashboardSettingsBtn.addEventListener("click", () => { OpenSettingsModal("appearance"); });
    }
    if (CloseSettingsBtn)
    {
        CloseSettingsBtn.addEventListener("click", () => { CloseSettingsModal(); });
    }

    const SettingsTabs =
    [
        { id: "SettingsTabAppearance", key: "appearance" },
        { id: "SettingsTabPaper", key: "paper" },
        { id: "SettingsTabDirectories", key: "directories" },
        { id: "SettingsTabLafs", key: "lafs" }
    ];
    SettingsTabs.forEach
    (
        (Tab) =>
        {
            const El = document.getElementById(Tab.id);
            if (El)
            {
                El.addEventListener("click", () => { SwitchSettingsTab(Tab.key); });
            }
        }
    );

    document.querySelectorAll(".SettingLinkBadge").forEach
    (
        (LinkBadge) =>
        {
            LinkBadge.addEventListener
            (
                "click",
                (Event) =>
                {
                    const TargetURL = LinkBadge.getAttribute("href");
                    if (TargetURL)
                    {
                        Event.preventDefault();
                        OpenExternalURL(TargetURL);
                    }
                }
            );
        }
    );

    const CloseExportBtn = document.getElementById("CloseExportSheetBtn");
    const ExportSubmitBtn = document.getElementById("ExportSheetPrimaryBtn");
    const ExportCopyBtn = document.getElementById("ExportCopyClipboardBtn");
    if (CloseExportBtn)
    {
        CloseExportBtn.addEventListener("click", () => { CloseExportSheet(); });
    }
    if (ExportSubmitBtn)
    {
        ExportSubmitBtn.addEventListener("click", () => { ExecuteExportSheet(); });
    }
    if (ExportCopyBtn)
    {
        ExportCopyBtn.addEventListener("click", () => { CopyExportToClipboard(); });
    }

    const FormatBtns = document.querySelectorAll(".FormatTabBtn");
    FormatBtns.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener("click", () => { SetExportFormat(Btn.getAttribute("Data-Format")); });
        }
    );

    const SwatchBtns = document.querySelectorAll(".ExportSwatchCard");
    SwatchBtns.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener("click", () => { SetExportSwatch(Btn.getAttribute("Data-Swatch")); });
        }
    );

    const DpiBtns = document.querySelectorAll(".DpiTabBtn");
    DpiBtns.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener("click", () => { SetExportDpi(Btn.getAttribute("Data-Dpi")); });
        }
    );

    const ScopeBtns = document.querySelectorAll(".ScopeTabBtn");
    ScopeBtns.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener("click", () => { SetExportScope(Btn.getAttribute("Data-Scope")); });
        }
    );

    // Bottom Status Bar buttons
    const CompilePillBtn = document.getElementById("StatusBarCompileBtn");
    const RealTimePillBtn = document.getElementById("StatusBarRealTimeBtn");
    const SyncTexPillBtn = document.getElementById("StatusBarSyncTexBtn");
    const LafsPillBtn = document.getElementById("StatusBarLafsBtn");

    if (CompilePillBtn)
    {
        CompilePillBtn.addEventListener
        (
            "click",
            () =>
            {
                const Drawer = document.getElementById("ErrorDrawer");
                const StatusTxt = document.getElementById("StatusBarCompileText");
                if (StatusTxt && StatusTxt.textContent === "Error")
                {
                    if (Drawer) { Drawer.classList.toggle("Visible"); }
                }
                else
                {
                    TriggerCompileNow();
                }
            }
        );
    }

    if (RealTimePillBtn)
    {
        RealTimePillBtn.addEventListener
        (
            "click",
            () =>
            {
                const Checkbox = document.getElementById("AutoCompileToggle");
                if (Checkbox)
                {
                    Checkbox.checked = ! Checkbox.checked;
                    RealTimePillBtn.classList.toggle("Active", Checkbox.checked);
                    ShowToast(`Real-Time Compilation: ${Checkbox.checked ? "Enabled" : "Disabled"}`, "info");
                }
            }
        );
    }

    if (SyncTexPillBtn)
    {
        SyncTexPillBtn.addEventListener
        (
            "click",
            () =>
            {
                const Checkbox = document.getElementById("SyncTexToggle");
                if (Checkbox)
                {
                    Checkbox.checked = ! Checkbox.checked;
                    IsSyncTexEnabled = Checkbox.checked;
                    SyncTexPillBtn.classList.toggle("Active", IsSyncTexEnabled);
                    ShowToast(`SyncTeX: ${IsSyncTexEnabled ? "Enabled" : "Disabled"}`, "info");
                }
            }
        );
    }

    if (LafsPillBtn)
    {
        LafsPillBtn.addEventListener
        (
            "click",
            () =>
            {
                const FormatBtn = document.getElementById("FormatLafsButton");
                if (FormatBtn) { FormatBtn.click(); }
            }
        );
    }

    // Palladino Typographic Engine Event Listeners (Phase 7.1)
    const LigaturesPillBtn = document.getElementById("StatusBarLigaturesBtn");
    if (LigaturesPillBtn)
    {
        LigaturesPillBtn.addEventListener("click", () => { ToggleLigatures(); });
        LigaturesPillBtn.classList.toggle("Active", CurrentEditorLigatures);
        const LigaturesText = document.getElementById("StatusBarLigaturesText");
        if (LigaturesText)
        {
            LigaturesText.textContent = `Ligatures: ${CurrentEditorLigatures ? "ON": "OFF"}`;
        }
    }

    const OpenLigaturesBtn = document.getElementById("OpenLigaturesInspectorBtn");
    const CloseLigaturesBtn = document.getElementById("CloseLigaturesModalBtn");
    const ToggleLigaturesBtn = document.getElementById("ToggleLigaturesModalBtn");
    const LigaturesModalEl = document.getElementById("LigaturesModal");
    const PalladinoTabDiagBtn = document.getElementById("PalladinoTabDiagnostics");
    const PalladinoTabLigBtn = document.getElementById("PalladinoTabLigatures");
    const FixQuotesBtn = document.getElementById("PalladinoFixQuotesBtn");
    const FixDashesBtn = document.getElementById("PalladinoFixDashesBtn");
    const FixSpacesBtn = document.getElementById("PalladinoFixSpacesBtn");

    if (OpenLigaturesBtn)
    {
        OpenLigaturesBtn.addEventListener("click", () => { OpenLigaturesInspector(); });
    }
    if (CloseLigaturesBtn)
    {
        CloseLigaturesBtn.addEventListener("click", () => { CloseLigaturesInspector(); });
    }
    if (ToggleLigaturesBtn)
    {
        ToggleLigaturesBtn.addEventListener("click", () => { ToggleLigatures(); });
    }
    if (PalladinoTabDiagBtn)
    {
        PalladinoTabDiagBtn.addEventListener("click", () => { SwitchPalladinoTab("diagnostics"); });
    }
    if (PalladinoTabLigBtn)
    {
        PalladinoTabLigBtn.addEventListener("click", () => { SwitchPalladinoTab("ligatures"); });
    }
    if (FixQuotesBtn)
    {
        FixQuotesBtn.addEventListener("click", () => { FixLeadingApostrophes(); });
    }
    if (FixDashesBtn)
    {
        FixDashesBtn.addEventListener("click", () => { FixTypewriterDashes(); });
    }
    if (FixSpacesBtn)
    {
        FixSpacesBtn.addEventListener("click", () => { NormalizeSentenceSpaces(); });
    }
    if (LigaturesModalEl)
    {
        LigaturesModalEl.addEventListener
        (
            "click",
            (Event) =>
            {
                if (Event.target === LigaturesModalEl)
                {
                    CloseLigaturesInspector();
                }
            }
        );
    }

    const SmartQuotesCb = document.getElementById("SmartQuotesCheckbox");
    if (SmartQuotesCb)
    {
        SmartQuotesCb.checked = IsSmartQuotesEnabled;
        SmartQuotesCb.addEventListener
        (
            "change",
            (E) =>
            {
                ToggleSmartQuotes(E.target.checked);
            }
        );
    }

    const OpticalMarginsCb = document.getElementById("OpticalMarginsCheckbox");
    if (OpticalMarginsCb)
    {
        OpticalMarginsCb.checked = IsOpticalMarginsEnabled;
        OpticalMarginsCb.addEventListener
        (
            "change",
            (E) =>
            {
                SetOpticalMargins(E.target.checked);
            }
        );
    }
    SetOpticalMargins(IsOpticalMarginsEnabled);

    // Phase 7.2 Event Listeners: Typewriter & Hemingway Focus Light
    const TypewriterPillBtn = document.getElementById("StatusBarTypewriterBtn");
    if (TypewriterPillBtn)
    {
        TypewriterPillBtn.addEventListener("click", () => { ToggleTypewriterScroll(); });
        TypewriterPillBtn.classList.toggle("Active", IsTypewriterScrollEnabled);
        const TypewriterTxt = document.getElementById("StatusBarTypewriterText");
        if (TypewriterTxt)
        {
            TypewriterTxt.textContent = `Typewriter: ${IsTypewriterScrollEnabled ? "ON": "OFF"}`;
        }
    }

    const HemingwayPillBtn = document.getElementById("StatusBarHemingwayBtn");
    if (HemingwayPillBtn)
    {
        HemingwayPillBtn.addEventListener("click", () => { ToggleHemingwayFocus(); });
        HemingwayPillBtn.classList.toggle("Active", IsHemingwayFocusEnabled);
        const HemingwayTxt = document.getElementById("StatusBarHemingwayText");
        if (HemingwayTxt)
        {
            HemingwayTxt.textContent = `Focus Light: ${IsHemingwayFocusEnabled ? "ON": "OFF"}`;
        }
    }

    const TypewriterCb = document.getElementById("TypewriterScrollCheckbox");
    if (TypewriterCb)
    {
        TypewriterCb.checked = IsTypewriterScrollEnabled;
        TypewriterCb.addEventListener
        (
            "change",
            (E) =>
            {
                ToggleTypewriterScroll(E.target.checked);
            }
        );
    }

    const HemingwayCb = document.getElementById("HemingwayFocusCheckbox");
    if (HemingwayCb)
    {
        HemingwayCb.checked = IsHemingwayFocusEnabled;
        HemingwayCb.addEventListener
        (
            "change",
            (E) =>
            {
                ToggleHemingwayFocus(E.target.checked);
            }
        );
    }

    // Phase 7.5 Event Listeners: Time Machine for Words
    const TimeMachinePillBtn = document.getElementById("StatusBarTimeMachineBtn");
    if (TimeMachinePillBtn)
    {
        TimeMachinePillBtn.addEventListener("click", () => { OpenTimeMachine(); });
    }

    const CloseTimeMachineBtn = document.getElementById("CloseTimeMachineModalBtn");
    if (CloseTimeMachineBtn)
    {
        CloseTimeMachineBtn.addEventListener("click", () => { CloseTimeMachine(); });
    }

    const CancelTimeMachineBtn = document.getElementById("CancelTimeMachineBtn");
    if (CancelTimeMachineBtn)
    {
        CancelTimeMachineBtn.addEventListener("click", () => { CloseTimeMachine(); });
    }

    const TimeMachineModalEl = document.getElementById("TimeMachineModal");
    if (TimeMachineModalEl)
    {
        TimeMachineModalEl.addEventListener
        (
            "click",
            (E) =>
            {
                if (E.target === TimeMachineModalEl)
                {
                    CloseTimeMachine();
                }
            }
        );
    }

    const TimeMachineSlider = document.getElementById("TimeMachineSlider");
    if (TimeMachineSlider)
    {
        TimeMachineSlider.addEventListener
        (
            "input",
            (E) =>
            {
                const Val = parseInt(E.target.value, 10);
                if (!isNaN(Val))
                {
                    SelectTimelineSnapshot(Val);
                }
            }
        );
    }

    const RestoreTimeMachineBtn = document.getElementById("RestoreTimeMachineSnapshotBtn");
    if (RestoreTimeMachineBtn)
    {
        RestoreTimeMachineBtn.addEventListener("click", () => { RestoreActiveTimelineSnapshot(); });
    }

    const CopyTimeMachineBtn = document.getElementById("CopyTimeMachineSnapshotBtn");
    if (CopyTimeMachineBtn)
    {
        CopyTimeMachineBtn.addEventListener("click", () => { CopyActiveTimelineSnapshot(); });
    }

    // Phase 7.4 Event Listeners: Keynote Stage Mode
    const KeynoteNotesBtn = document.getElementById("KeynoteNotesToggleBtn");
    if (KeynoteNotesBtn)
    {
        KeynoteNotesBtn.addEventListener("click", () => { ToggleStageNotes(); });
    }

    const KeynoteCloseNotesBtn = document.getElementById("KeynoteCloseNotesBtn");
    if (KeynoteCloseNotesBtn)
    {
        KeynoteCloseNotesBtn.addEventListener("click", () => { ToggleStageNotes(); });
    }

    const KeynotePrevBtn = document.getElementById("KeynotePrevBtn");
    if (KeynotePrevBtn)
    {
        KeynotePrevBtn.addEventListener("click", () => { PrevStageSlide(); });
    }

    const KeynoteNextBtn = document.getElementById("KeynoteNextBtn");
    if (KeynoteNextBtn)
    {
        KeynoteNextBtn.addEventListener("click", () => { NextStageSlide(); });
    }

    const KeynoteExitBtn = document.getElementById("KeynoteExitBtn");
    if (KeynoteExitBtn)
    {
        KeynoteExitBtn.addEventListener("click", () => { ExitKeynoteStageMode(); });
    }

    const KeynoteOverlayEl = document.getElementById("KeynoteStageOverlay");
    const KeynoteHeaderEl = document.getElementById("KeynoteStageHeader");
    if (KeynoteOverlayEl && KeynoteHeaderEl)
    {
        KeynoteOverlayEl.addEventListener
        (
            "mousemove",
            () =>
            {
                KeynoteHeaderEl.classList.add("Visible");
                if (StageHeaderHideTimer)
                {
                    clearTimeout(StageHeaderHideTimer);
                }
                StageHeaderHideTimer = setTimeout
                (
                    () =>
                    {
                        KeynoteHeaderEl.classList.remove("Visible");
                    },
                    2500
                );
            }
        );
    }

    // Floating Preview HUD Auto-Fade on idle (Focus Mode)
    const PreviewPane = document.getElementById("PreviewPane");
    const PreviewToolbar = document.querySelector(".PreviewToolbar");
    if (PreviewPane && PreviewToolbar)
    {
        PreviewPane.addEventListener
        (
            "mousemove",
            () =>
            {
                if (CurrentUIMode !== "focus") { return ; }
                PreviewToolbar.classList.remove("HUD_Idle");
                if (PreviewHUDTimer)
                {
                    clearTimeout(PreviewHUDTimer);
                }
                PreviewHUDTimer = setTimeout
                (
                    () =>
                    {
                        if (CurrentUIMode === "focus")
                        {
                            PreviewToolbar.classList.add("HUD_Idle");
                        }
                    },
                    2000
                );
            },
            { passive: true }
        );
    }

    // Spread Mode Toggle Button
    const SpreadBtn = document.getElementById("SpreadModeToggleBtn");
    if (SpreadBtn)
    {
        SpreadBtn.addEventListener
        (
            "click", () =>
            {
                ToggleSpreadMode();
            }
        );
    }

    // Command Palette Modal & Input
    const PaletteModal = document.getElementById("CommandPaletteModal");
    const PaletteInput = document.getElementById("CommandPaletteInput");
    if (PaletteModal)
    {
        PaletteModal.addEventListener
        (
            "click",
            (E) =>
            {
                if (E.target === PaletteModal)
                {
                    CloseCommandPalette();
                }
            }
        );
    }
    if (PaletteInput)
    {
        PaletteInput.addEventListener
        (
            "input",
            (E) =>
            {
                CommandPaletteSelectedIndex = 0;
                RenderCommandPaletteItems(E.target.value);
            }
        );
        PaletteInput.addEventListener
        (
            "keydown",
            (E) =>
            {
                if (E.key === "ArrowDown")
                {
                    E.preventDefault();
                    if (FilteredPaletteActions.length > 0)
                    {
                        CommandPaletteSelectedIndex = (CommandPaletteSelectedIndex + 1) % FilteredPaletteActions.length;
                        RenderCommandPaletteItems(PaletteInput.value);
                    }
                }
                else if (E.key === "ArrowUp")
                {
                    E.preventDefault();
                    if (FilteredPaletteActions.length > 0)
                    {
                        CommandPaletteSelectedIndex = (CommandPaletteSelectedIndex - 1 + FilteredPaletteActions.length) % FilteredPaletteActions.length;
                        RenderCommandPaletteItems(PaletteInput.value);
                    }
                }
                else if (E.key === "Enter")
                {
                    E.preventDefault();
                    if (FilteredPaletteActions.length > 0 && FilteredPaletteActions[CommandPaletteSelectedIndex])
                    {
                        const ActionItem = FilteredPaletteActions[CommandPaletteSelectedIndex];
                        CloseCommandPalette();
                        ActionItem.Action();
                    }
                }
                else if (E.key === "Escape")
                {
                    E.preventDefault();
                    CloseCommandPalette();
                }
            }
        );
    }

    // Initialize Active Spread Mode and Typography
    SetSpreadMode(IsSpreadMode);
    ApplyEditorTypography();
}

function GetCurrentDocumentTitle()
{
    const TitleInput = document.getElementById("DocumentTitleInput");
    if (TitleInput && TitleInput.value.trim().length > 0)
    {
        return TitleInput.value.trim();
    }
    if (CurrentFilePath)
    {
        const Name = CurrentFilePath.split(/[\/\\]/).pop();
        return Name.replace(/\.typ$/i, "") || "document";
    }
    return "document";
}

async function ExportPdf()
{
    if (!MonacoInstance)
    {
        return ;
    }

    const Source = MonacoInstance.getValue();
    const DocTitle = GetCurrentDocumentTitle();
    const StatusDot = document.getElementById("StatusDot");
    const StatusText = document.getElementById("StatusText");

    StatusDot.className = "StatusDot Compiling";
    StatusText.textContent = "Generating PDF...";

    try
    {
        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked: false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked: false;

        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const PdfBytes = await window.__TAURI__.core.invoke
            (
                "ExportPdf",
                {
                    source: Source,
                    Source: Source,
                    filePath: CurrentFilePath || null,
                    FilePath: CurrentFilePath || null,
                    blackMode: BlackMode,
                    BlackMode: BlackMode,
                    transparent: Transparent,
                    Transparent: Transparent
                }
            );
            const Blob = new Blob([new Uint8Array(PdfBytes)], { type: "application/pdf" });
            const DownloadUrl = URL.createObjectURL(Blob);
            const Anchor = document.createElement("a");
            Anchor.href = DownloadUrl;
            Anchor.download = DocTitle.endsWith(".pdf") ? DocTitle: `${DocTitle}.pdf`;
            document.body.appendChild(Anchor);
            Anchor.click();
            document.body.removeChild(Anchor);
            URL.revokeObjectURL(DownloadUrl);

            StatusDot.className = "StatusDot";
            StatusText.textContent = "PDF Exported";
            ShowToast("PDF exported successfully", "success");
            return ;
        }

        const Response = await AuthenticatedFetch
        (
            "/api/export/pdf",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify
                ({
                    Source: Source,
                    FileName: DocTitle,
                    BlackMode: BlackMode,
                    Transparent: Transparent
                })
            }
        );

        if (!Response.ok)
        {
            const ErrData = await Response.json();
            throw new Error(ErrData.Error || "Failed to generate PDF");
        }

        const Blob = await Response.blob();
        const DownloadUrl = URL.createObjectURL(Blob);
        const Anchor = document.createElement("a");
        Anchor.href = DownloadUrl;
        Anchor.download = DocTitle.endsWith(".pdf") ? DocTitle: `${DocTitle}.pdf`;
        document.body.appendChild(Anchor);
        Anchor.click();
        document.body.removeChild(Anchor);
        URL.revokeObjectURL(DownloadUrl);

        StatusDot.className = "StatusDot";
        StatusText.textContent = "PDF Exported";
        ShowToast("PDF exported successfully", "success");
    }
    catch (Err)
    {
        StatusDot.className = "StatusDot Error";
        StatusText.textContent = "Export Failed";
        ShowCompilationError(Err.message);
    }
}

async function ExportSvg()
{
    if (!MonacoInstance)
    {
        return ;
    }

    const Source = MonacoInstance.getValue();
    const DocTitle = GetCurrentDocumentTitle();
    const BaseDocName = DocTitle.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const StatusDot = document.getElementById("StatusDot");
    const StatusText = document.getElementById("StatusText");

    if (StatusDot) { StatusDot.className = "StatusDot Compiling"; }
    if (StatusText) { StatusText.textContent = "Generating SVG ZIP..."; }
    ShowToast("Generating SVG vector archive...", "info");

    try
    {
        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked: false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked: false;

        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const ZipBytes = await window.__TAURI__.core.invoke
            (
                "ExportSvg",
                {
                    source: Source,
                    Source: Source,
                    filePath: CurrentFilePath || null,
                    FilePath: CurrentFilePath || null,
                    baseDocName: BaseDocName,
                    BaseDocName: BaseDocName,
                    blackMode: BlackMode,
                    BlackMode: BlackMode,
                    transparent: Transparent,
                    Transparent: Transparent
                }
            );
            const Blob = new Blob([new Uint8Array(ZipBytes)], { type: "application/zip" });
            const DownloadUrl = URL.createObjectURL(Blob);
            const Anchor = document.createElement("a");
            Anchor.href = DownloadUrl;
            Anchor.download = `${BaseDocName}_svg.zip`;
            document.body.appendChild(Anchor);
            Anchor.click();
            document.body.removeChild(Anchor);
            URL.revokeObjectURL(DownloadUrl);

            if (StatusDot) { StatusDot.className = "StatusDot"; }
            if (StatusText) { StatusText.textContent = "SVG Exported"; }
            ShowToast("SVG ZIP exported successfully", "success");
            return ;
        }

        const Response = await AuthenticatedFetch
        (
            "/api/export/svg",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify
                ({
                    Source: Source,
                    FileName: BaseDocName,
                    BlackMode: BlackMode,
                    Transparent: Transparent
                })
            }
        );

        if (!Response.ok)
        {
            const ErrData = await Response.json();
            throw new Error(ErrData.Error || "Failed to export SVG archive");
        }

        const Blob = await Response.blob();
        const DownloadUrl = URL.createObjectURL(Blob);
        const Anchor = document.createElement("a");
        Anchor.href = DownloadUrl;
        Anchor.download = `${BaseDocName}_svg.zip`;
        document.body.appendChild(Anchor);
        Anchor.click();
        document.body.removeChild(Anchor);
        URL.revokeObjectURL(DownloadUrl);

        if (StatusDot) { StatusDot.className = "StatusDot"; }
        if (StatusText) { StatusText.textContent = "SVG Exported"; }
        ShowToast("SVG ZIP exported successfully", "success");
    }
    catch (Err)
    {
        // Client-side fallback using in-memory LastCompiledPages and JSZip if server endpoint fails
        if (typeof JSZip !== "undefined" && LastCompiledPages && LastCompiledPages.length > 0)
        {
            try
            {
                const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
                const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
                const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked: false;
                const Transparent = TransparentCheckbox ? TransparentCheckbox.checked: false;

                const Zip = new JSZip();
                for (let Index = 0; Index < LastCompiledPages.length; Index ++)
                {
                    let PageSvg = LastCompiledPages[Index];
                    if (BlackMode)
                    {
                        PageSvg = ConvertSvgToDarkMode(PageSvg);
                    }
                    if (Transparent)
                    {
                        PageSvg = PageSvg.replace
                        (
                            /<path\s+[^>]*\bfill\s*=\s*["']#(?:ffffff|000000|0c0c0c)["'][^>]*d\s*=\s*["']M\s*0\s+0v[^"']*Z\s*["'][^>]*\/?>/gi,
                            ""
                        );
                        PageSvg = PageSvg.replace
                        (
                            /<path\s+[^>]*d\s*=\s*["']M\s*0\s+0v[^"']*Z\s*["'][^>]*\bfill\s*=\s*["']#(?:ffffff|000000|0c0c0c)["'][^>]*\/?>/gi,
                            ""
                        );
                    }
                    Zip.file(`${BaseDocName}_page_${Index + 1}.svg`, PageSvg);
                }

                const ZipBlob = await Zip.generateAsync( { type: "blob" });
                const DownloadUrl = URL.createObjectURL(ZipBlob);
                const Anchor = document.createElement("a");
                Anchor.href = DownloadUrl;
                Anchor.download = `${BaseDocName}_svg.zip`;
                document.body.appendChild(Anchor);
                Anchor.click();
                document.body.removeChild(Anchor);
                URL.revokeObjectURL(DownloadUrl);

                if (StatusDot) { StatusDot.className = "StatusDot"; }
                if (StatusText) { StatusText.textContent = "SVG Exported"; }
                ShowToast("SVG ZIP exported successfully", "success");
                return ;
            }
            catch (FallbackErr)
            {
                // Fall through to error toast below
            }
        }

        if (StatusDot) { StatusDot.className = "StatusDot Error"; }
        if (StatusText) { StatusText.textContent = "Export Failed"; }
        ShowToast(`SVG export failed: ${Err.message}`, "error");
    }
}

async function ExportPng()
{
    if (!MonacoInstance)
    {
        return ;
    }

    const Source = MonacoInstance.getValue();
    const DocTitle = GetCurrentDocumentTitle();
    const BaseDocName = DocTitle.replace(/[^a-zA-Z0-9_\-]/g, "_");
    const StatusDot = document.getElementById("StatusDot");
    const StatusText = document.getElementById("StatusText");

    if (StatusDot) { StatusDot.className = "StatusDot Compiling"; }
    if (StatusText) { StatusText.textContent = "Generating PNG ZIP..."; }
    ShowToast("Generating PNG archive (300 PPI)...", "info");

    try
    {
        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked: false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked: false;

        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const ZipBytes = await window.__TAURI__.core.invoke
            (
                "ExportPng",
                {
                    source: Source,
                    Source: Source,
                    filePath: CurrentFilePath || null,
                    FilePath: CurrentFilePath || null,
                    baseDocName: BaseDocName,
                    BaseDocName: BaseDocName,
                    blackMode: BlackMode,
                    BlackMode: BlackMode,
                    transparent: Transparent,
                    Transparent: Transparent
                }
            );
            const Blob = new Blob([new Uint8Array(ZipBytes)], { type: "application/zip" });
            const DownloadUrl = URL.createObjectURL(Blob);
            const Anchor = document.createElement("a");
            Anchor.href = DownloadUrl;
            Anchor.download = `${BaseDocName}_png.zip`;
            document.body.appendChild(Anchor);
            Anchor.click();
            document.body.removeChild(Anchor);
            URL.revokeObjectURL(DownloadUrl);

            if (StatusDot) { StatusDot.className = "StatusDot"; }
            if (StatusText) { StatusText.textContent = "PNG Exported"; }
            ShowToast("PNG ZIP exported successfully", "success");
            return ;
        }

        const Response = await AuthenticatedFetch
        (
            "/api/export/png",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify
                ({
                    Source: Source,
                    FileName: BaseDocName,
                    BlackMode: BlackMode,
                    Transparent: Transparent
                })
            }
        );

        if (!Response.ok)
        {
            const ErrData = await Response.json();
            throw new Error(ErrData.Error || "Failed to export PNG archive");
        }

        const Blob = await Response.blob();
        const DownloadUrl = URL.createObjectURL(Blob);
        const Anchor = document.createElement("a");
        Anchor.href = DownloadUrl;
        Anchor.download = `${BaseDocName}_png.zip`;
        document.body.appendChild(Anchor);
        Anchor.click();
        document.body.removeChild(Anchor);
        URL.revokeObjectURL(DownloadUrl);

        if (StatusDot) { StatusDot.className = "StatusDot"; }
        if (StatusText) { StatusText.textContent = "PNG Exported"; }
        ShowToast("PNG ZIP exported successfully", "success");
    }
    catch (Err)
    {
        if (StatusDot) { StatusDot.className = "StatusDot Error"; }
        if (StatusText) { StatusText.textContent = "Export Failed"; }
        ShowToast(`PNG export failed: ${Err.message}`, "error");
    }
}

function CopySource()
{
    if (!MonacoInstance)
    {
        return ;
    }
    const Source = MonacoInstance.getValue();
    navigator.clipboard.writeText(Source).then
    (
        () =>
        {
            const CopyBtn = document.getElementById("CopyCodeButton");
            const OriginalHTML = CopyBtn.innerHTML;
            CopyBtn.innerHTML = "<span>Copied!</span>";
            setTimeout( () => { CopyBtn.innerHTML = OriginalHTML; }, 1500);
            ShowToast("Typst source copied to clipboard", "success");
        }
    );
}

function SetupSplitResizer()
{
    const Resizer = document.getElementById("SplitResizer");
    const EditorPane = document.getElementById("EditorPane");
    const PreviewPane = document.getElementById("PreviewPane");
    if (!Resizer || !EditorPane)
    {
        return ;
    }

    let IsDragging = false;
    let StartX = 0;
    let StartEditorWidth = 0;
    let TotalAvailableWidth = 0;

    // Restore saved split pane width on startup
    const SavedWidth = localStorage.getItem("TypstStudio_SplitWidth");
    if (SavedWidth)
    {
        EditorPane.style.flex = `0 0 ${SavedWidth}`;
        EditorPane.style.width = SavedWidth;
    }

    Resizer.addEventListener
    (
        "pointerdown",
        (E) =>
        {
            if (E.button !== 0)
            {
                return ;
            }
            IsDragging = true;
            StartX = E.clientX;
            StartEditorWidth = EditorPane.getBoundingClientRect().width;
            const StartPreviewWidth = PreviewPane ? PreviewPane.getBoundingClientRect().width: (document.querySelector(".MainSplitArea") ? document.querySelector(".MainSplitArea").clientWidth - StartEditorWidth: 800);
            TotalAvailableWidth = StartEditorWidth + StartPreviewWidth;

            Resizer.classList.add("Dragging");
            document.body.classList.add("Dragging");
            try
            {
                Resizer.setPointerCapture(E.pointerId);
            }
            catch (Ignored) {}
        }
    );

    Resizer.addEventListener
    (
        "pointermove",
        (E) =>
        {
            if (!IsDragging || TotalAvailableWidth <= 0)
            {
                return ;
            }
            const DeltaX = E.clientX - StartX;
            const MIN_EDITOR_PX = 260;
            const MIN_PREVIEW_PX = 260;
            const ClampedWidth = Math.max(MIN_EDITOR_PX, Math.min(TotalAvailableWidth - MIN_PREVIEW_PX, StartEditorWidth + DeltaX));
            const WidthPercent = ((ClampedWidth / TotalAvailableWidth) * 100).toFixed(3) + "%";

            EditorPane.style.flex = `0 0 ${WidthPercent}`;
            EditorPane.style.width = WidthPercent;

            if (MonacoInstance)
            {
                MonacoInstance.layout();
            }
        }
    );

    const HandlePointerUp = (E) =>
    {
        if (!IsDragging)
        {
            return ;
        }
        IsDragging = false;
        Resizer.classList.remove("Dragging");
        document.body.classList.remove("Dragging");
        try
        {
            if (Resizer.hasPointerCapture(E.pointerId))
            {
                Resizer.releasePointerCapture(E.pointerId);
            }
        }
        catch (Ignored) {}

        if (EditorPane && EditorPane.style.width)
        {
            try
            {
                localStorage.setItem("TypstStudio_SplitWidth", EditorPane.style.width);
            }
            catch (Ignored) {}
        }

        if (MonacoInstance)
        {
            MonacoInstance.layout();
        }
        RebuildMonotonicSyncAnchors();
    };

    Resizer.addEventListener("pointerup", HandlePointerUp);
    Resizer.addEventListener("pointercancel", HandlePointerUp);

    let SplitResizeDebounceTimer = null;
    window.addEventListener
    (
        "resize",
        () =>
        {
            if (SplitResizeDebounceTimer)
            {
                clearTimeout(SplitResizeDebounceTimer);
            }
            SplitResizeDebounceTimer = setTimeout
            (
                () =>
                {
                    RebuildMonotonicSyncAnchors();
                    if (MonacoInstance)
                    {
                        MonacoInstance.layout();
                    }
                },
                150
            );
        }
    );
}
// --- VIEWPORT SEGMENTED CONTROL ARCHITECTURE (PRIORITY 2) ---

let CurrentViewportLayout = "split";
// 'split', 'editor', 'preview'

function SetViewportLayout(Layout)
{
    CurrentViewportLayout = Layout;
    const MainArea = document.getElementById("EditorMainView");
    const SplitBtn = document.getElementById("LayoutSplitBtn");
    const EditorBtn = document.getElementById("LayoutEditorBtn");
    const PreviewBtn = document.getElementById("LayoutPreviewBtn");

    if (MainArea)
    {
        MainArea.classList.remove("LayoutSplit", "LayoutEditorOnly", "LayoutPreviewOnly");
        if (Layout === "editor")
        {
            MainArea.classList.add("LayoutEditorOnly");
        }
        else if (Layout === "preview")
        {
            MainArea.classList.add("LayoutPreviewOnly");
        }
        else
        {
            MainArea.classList.add("LayoutSplit");
        }
    }

    if (SplitBtn) { SplitBtn.classList.toggle("Active", Layout === "split"); }
    if (EditorBtn) { EditorBtn.classList.toggle("Active", Layout === "editor"); }
    if (PreviewBtn) { PreviewBtn.classList.toggle("Active", Layout === "preview"); }

    try
    {
        localStorage.setItem("TypstStudio_Layout", Layout);
    }
    catch (Ignored) {}

    if (MonacoInstance && (Layout === "split" || Layout === "editor"))
    {
        requestAnimationFrame
        (
            () =>
            {
                MonacoInstance.layout();
            }
        );
    }

    if (Layout === "split" || Layout === "preview")
    {
        requestAnimationFrame
        (
            () =>
            {
                ApplyZoom();
            }
        );
    }
}
// --- DOCUMENT OUTLINE (TOC) ARCHITECTURE (PRIORITY 2) ---

let IsOutlineVisible = false;
let OutlineHeadingsList = [];
let OutlineThrottleTimer = null;

function SwitchSidebarTab(TabName)
{
    const FilesTab = document.getElementById("SidebarTabFiles");
    const OutlineTab = document.getElementById("SidebarTabOutline");
    const FilesContent = document.getElementById("SidebarContentFiles");
    const OutlineContent = document.getElementById("SidebarContentOutline");
    const NewFileBtn = document.getElementById("ExplorerNewFileBtn");
    const RefreshBtn = document.getElementById("ExplorerRefreshBtn");
    const CollapseBtn = document.getElementById("ExplorerCollapseAllBtn");

    if (TabName === "outline")
    {
        if (FilesTab) { FilesTab.classList.remove("Active"); }
        if (OutlineTab) { OutlineTab.classList.add("Active"); }
        if (FilesContent) { FilesContent.style.display = "none"; FilesContent.classList.remove("Active"); }
        if (OutlineContent) { OutlineContent.style.display = "flex"; OutlineContent.classList.add("Active"); }
        if (NewFileBtn) { NewFileBtn.style.display = "none"; }
        if (RefreshBtn) { RefreshBtn.style.display = "none"; }
        if (CollapseBtn) { CollapseBtn.style.display = "none"; }
        IsOutlineVisible = true;
        UpdateDocumentOutline();
    }
    else
    {
        if (FilesTab) { FilesTab.classList.add("Active"); }
        if (OutlineTab) { OutlineTab.classList.remove("Active"); }
        if (FilesContent) { FilesContent.style.display = "flex"; FilesContent.classList.add("Active"); }
        if (OutlineContent) { OutlineContent.style.display = "none"; OutlineContent.classList.remove("Active"); }
        if (NewFileBtn) { NewFileBtn.style.display = ""; }
        if (RefreshBtn) { RefreshBtn.style.display = ""; }
        if (CollapseBtn) { CollapseBtn.style.display = ""; }
        IsOutlineVisible = false;
    }
}

function ToggleDocumentOutline(ForceState)
{
    const Explorer = document.getElementById("ExplorerSidebar");
    if (!Explorer)
    {
        return ;
    }

    const OutlineTab = document.getElementById("SidebarTabOutline");
    const IsOutlineTabActive = OutlineTab && OutlineTab.classList.contains("Active");
    const IsExplorerOpen = !Explorer.classList.contains("Hidden") && !Explorer.classList.contains("Collapsed") && Explorer.style.display !== "none";

    let ShouldOpenOutline = false;
    if (typeof ForceState === "boolean")
    {
        ShouldOpenOutline = ForceState;
    }
    else
    {
        if (IsExplorerOpen && IsOutlineTabActive)
        {
            ShouldOpenOutline = false;
        }
        else
        {
            ShouldOpenOutline = true;
        }
    }

    if (ShouldOpenOutline)
    {
        Explorer.classList.remove("Hidden", "Collapsed");
        Explorer.style.display = "flex";
        SwitchSidebarTab("outline");
    }
    else
    {
        if (IsOutlineTabActive)
        {
            SwitchSidebarTab("files");
        }
        else
        {
            Explorer.classList.add("Collapsed");
        }
    }

    try
    {
        localStorage.setItem("TypstStudio_OutlineVisible", ShouldOpenOutline ? "true": "false");
    }
    catch (Ignored) {}

    if (MonacoInstance)
    {
        requestAnimationFrame
        (
            () =>
            {
                MonacoInstance.layout();
            }
        );
    }
}

function UpdateDocumentOutlineThrottled()
{
    const OutlineTab = document.getElementById("SidebarTabOutline");
    const IsOutlineTabActive = OutlineTab && OutlineTab.classList.contains("Active");
    const Explorer = document.getElementById("ExplorerSidebar");
    const IsExplorerOpen = Explorer && !Explorer.classList.contains("Hidden") && !Explorer.classList.contains("Collapsed") && Explorer.style.display !== "none";
    if (!IsExplorerOpen || !IsOutlineTabActive)
    {
        return ;
    }

    if (OutlineThrottleTimer)
    {
        clearTimeout(OutlineThrottleTimer);
    }

    const Model = MonacoInstance ? MonacoInstance.getModel(): null;
    const DocLines = Model ? Model.getLineCount(): 0;
    const ThrottleMs = DocLines > 2000 ? 1200: 600;

    OutlineThrottleTimer = setTimeout
    (
        () =>
        {
            UpdateDocumentOutline();
        },
        ThrottleMs
    );
}

function UpdateDocumentOutline()
{
    const ListContainer = document.getElementById("OutlineList");
    const Badge = document.getElementById("OutlineCountBadge");
    const StatusBadge = document.getElementById("StatusOutlineCount");
    if (!MonacoInstance || !ListContainer) { return; }

    const Model = MonacoInstance.getModel();
    if (!Model) { return; }

    const TotalLines = Model.getLineCount();
    OutlineHeadingsList = [];

    let InCodeBlock = false;
    for (let LineNum = 1; LineNum <= TotalLines; LineNum ++)
    {
        const LineText = Model.getLineContent(LineNum);
        const Trimmed = LineText.trim();

        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = ! InCodeBlock;
            continue;
        }
        if (InCodeBlock) { continue; }

        if (Trimmed.startsWith("="))
        {
            const HeadingMatch = LineText.match(/^(=+)\s+(.+)$/);
            if (HeadingMatch)
            {
                const Level = HeadingMatch[1].length;
                const CleanTitle = HeadingMatch[2].replace(/<[a-zA-Z0-9_\-:]+>\s*$/, "").trim();
                OutlineHeadingsList.push
                ({
                    Level: Math.min(Level, 4),
                    Title: CleanTitle,
                    Line: LineNum
                });
            }
        }
    }

    const Count = OutlineHeadingsList.length;
    if (Badge) { Badge.textContent = Count; }
    if (StatusBadge) { StatusBadge.textContent = Count; }

    RenderOutlineItems(OutlineHeadingsList);
}

function RenderOutlineItems(Headings)
{
    const ListContainer = document.getElementById("OutlineList");
    if (!ListContainer) { return; }

    const SearchInput = document.getElementById("OutlineSearchInput");
    const Filter = SearchInput ? SearchInput.value.toLowerCase().trim(): "";

    const Filtered = Filter
    ? Headings.filter( (H) => H.Title.toLowerCase().includes(Filter))
    : Headings;

    if (Filtered.length === 0)
    {
        ListContainer.innerHTML = Filter
        ? `<div Class = "OutlineEmptyState">No sections match "${EscapeHtml(Filter)}"</div>`
        : `<div Class = "OutlineEmptyState">No headings in document.<br><span style="color:#71717A; font-size:10.5px;">Add '= Section Name' to generate an outline.</span></div>`;
        return ;
    }

    let Html = "";
    for (const Item of Filtered)
    {
        Html += `<div Class = "OutlineItem Level${Item.Level}" Data-Line = "${Item.Line}" Title = "Jump to line ${Item.Line}">
            <span Class = "OutlineItemText">${EscapeHtml(Item.Title)}</span>
            <span Class = "OutlineItemLine">L${Item.Line}</span>
        </div>`;
    }

    ListContainer.innerHTML = Html;
}
// --- ASSET DRAG & DROP ARCHITECTURE (PRIORITY 3) ---

function SetupAssetDragAndDrop()
{
    const Overlay = document.getElementById("AssetDropOverlay");
    if (!Overlay) { return; }

    let DragCounter = 0;

    window.addEventListener
    (
        "dragenter", (Event) =>
        {
            if (Event.dataTransfer && Event.dataTransfer.types.includes("Files"))
            {
                DragCounter ++;
                Overlay.classList.add("Active");
            }
        }
    );

    window.addEventListener
    (
        "dragleave", (Event) =>
        {
            DragCounter --;
            if (DragCounter <= 0)
            {
                DragCounter = 0;
                Overlay.classList.remove("Active");
            }
        }
    );

    window.addEventListener
    (
        "dragover", (Event) =>
        {
            Event.preventDefault();
        }
    );

    window.addEventListener
    (
        "drop",
        async (Event) =>
        {
            Event.preventDefault();
            DragCounter = 0;
            Overlay.classList.remove("Active");

            const Files = Event.dataTransfer ? Event.dataTransfer.files: null;
            if (!Files || Files.length === 0) { return; }

            for (let I = 0; I < Files.length; I ++)
            {
                await HandleDroppedAssetFile(Files[I]);
            }
        }
    );
}

async function HandleDroppedAssetFile(File)
{
    const ValidExtensions = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".pdf"];
    const Ext = ("." + File.name.split(".").pop()).toLowerCase();
    if (!ValidExtensions.includes(Ext))
    {
        ShowToast(`Unsupported file type: ${File.name}`, "error");
        return ;
    }

    const Reader = new FileReader();
    Reader.onload = async () =>
    {
        const Base64Data = Reader.result.split(",")[1];
        try
        {
            let CleanFileName;
            if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
            {
                let TargetDir = null;
                if (CurrentFilePath)
                {
                    const LastSep = Math.max(CurrentFilePath.lastIndexOf("/"), CurrentFilePath.lastIndexOf("\\"));
                    if (LastSep > 0)
                    {
                        TargetDir = CurrentFilePath.substring(0, LastSep);
                    }
                }
                const SavedPath = await window.__TAURI__.core.invoke
                (
                    "UploadAsset",
                    {
                        directory: TargetDir,
                        Directory: TargetDir,
                        fileName: File.name,
                        FileName: File.name,
                        base64Data: Base64Data,
                        Base64Data: Base64Data
                    }
                );
                CleanFileName = SavedPath.split(/[\\/]/).pop();
            }
            else
            {
                const Response = await AuthenticatedFetch
                (
                    "/api/workspace/upload",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify
                        ({
                            FileName: File.name,
                            Base64Data: Base64Data,
                            ActiveFilePath: CurrentFilePath
                        })
                    }
                );

                const Data = await Response.json();
                if (Data.Success)
                {
                    CleanFileName = Data.FileName;
                }
                else
                {
                    ShowToast(`Upload failed: ${Data.Error || "Server error"}`, "error");
                    return ;
                }
            }

            if (CleanFileName && MonacoInstance)
            {
                const CleanFileName = Data.FileName;
                const Snippet = `\n#image\n(\n\t"${CleanFileName}",\n\twidth: 80%\n)\n`;

                const Position = MonacoInstance.getPosition();
                MonacoInstance.executeEdits
                (
                    "asset-drop",
                    [{
                        range: new monaco.Range(Position.lineNumber, Position.column, Position.lineNumber, Position.column),
                        text: Snippet
                    }]
                );

                ShowToast(`Uploaded ${CleanFileName} and inserted #image`, "success");
                TriggerCompileNow();
            }
            else
            {
                ShowToast(`Upload failed: ${Data.Error || "Server error"}`, "error");
            }
        }
        catch (Err)
        {
            ShowToast(`Upload failed: ${Err.message}`, "error");
        }
    };
    Reader.readAsDataURL(File);
}
// --- KEYBOARD SHORTCUTS & PRINT ARCHITECTURE (PRIORITY 4) ---

function GetEffectiveKeybinding(CommandId)
{
    if (CustomKeybindings.hasOwnProperty(CommandId))
    {
        return CustomKeybindings[CommandId];
    }
    if (DEFAULT_KEYBINDINGS.hasOwnProperty(CommandId))
    {
        return DEFAULT_KEYBINDINGS[CommandId];
    }
    return "";
}

function FormatKeyComboHtml(Combo)
{
    if (!Combo || Combo.trim() === "")
    {
        return `<span Class = "KeybindingUnset">Unassigned</span>`;
    }
    const Tokens = Combo.split("+");
    return Tokens.map( (T) => `<kbd>${T}</kbd>`).join(" + ");
}

function GetAllManageableCommands()
{
    const All = [...APPLICATION_COMMANDS_META];
    if (MonacoInstance && typeof MonacoInstance.getActions === "function")
    {
        const Actions = MonacoInstance.getActions();
        for (const Act of Actions)
        {
            if (!Act.id || Act.id.startsWith("_")) { continue; }
            if (!Act.label || Act.label.trim() === "") { continue; }
            All.push
            ({
                Id: Act.id,
                Label: Act.label,
                Category: "Monaco Editor",
                Source: "Monaco"
            });
        }
    }
    return All;
}

function RenderKeybindingsList(SearchQuery = "")
{
    const Container = document.getElementById("KeybindingsList");
    if (!Container) { return; }

    const Filter = (SearchQuery || "").toLowerCase().trim();
    const Commands = GetAllManageableCommands();

    const Filtered = Commands.filter
    (
        (Cmd) =>
        {
            if (!Filter) { return true; }
            const Key = GetEffectiveKeybinding(Cmd.Id).toLowerCase();
            return Cmd.Label.toLowerCase().includes(Filter) ||
                   Cmd.Id.toLowerCase().includes(Filter) ||
                   Cmd.Category.toLowerCase().includes(Filter) ||
                   Key.includes(Filter);
        }
    );

    if (Filtered.length === 0)
    {
        Container.innerHTML = `<p style="padding: 24px; color: #71717A; text-align: center; font-size: 12px;">No matching commands found.</p>`;
        return ;
    }

    let Html = "";
    for (const Cmd of Filtered)
    {
        const EffectiveKey = GetEffectiveKeybinding(Cmd.Id);
        const IsCustom = CustomKeybindings.hasOwnProperty(Cmd.Id);
        const IsRecording = ActiveRecordingCommandId === Cmd.Id;
        const ItemClasses = `KeybindingItem ${IsRecording ? "Recording": ""}`;
        const PillClasses = `KeybindingPill ${IsCustom ? "Custom": ""}`;

        Html += `
        <div Class = "${ItemClasses}" Data-Command-Id = "${Cmd.Id}">
            <div Class = "KeybindingInfo">
                <span Class = "KeybindingLabel">${Cmd.Label}</span>
                <span Class = "KeybindingSource">${Cmd.Category} · <code style="font-size: 9.5px; opacity: 0.6;">${Cmd.Id}</code></span>
            </div>
            <div Class = "KeybindingActions">
                <span Class = "${PillClasses}">
                    ${IsRecording ? '<span style="color: #C084FC; font-weight: 600; font-size: 11px;">Press keys...</span>': FormatKeyComboHtml(EffectiveKey)}
                </span>
                <button Type = "button" Class = "RecordKeyBtn ${IsRecording ? "Active": ""}" Data-Record-Id = "${Cmd.Id}">
                    ${IsRecording ? "Cancel": (EffectiveKey ? "Edit": "Assign")}
                </button>
                ${IsCustom ? `<button Type = "button" Class = "ResetKeyBtn" Data-Reset-Id = "${Cmd.Id}" Title = "Reset to default">↺</button>`: ""}
            </div>
        </div>`;
    }

    Container.innerHTML = Html;

    Container.querySelectorAll(".RecordKeyBtn").forEach
    (
        (Btn) =>
        {
            Btn.addEventListener
            (
                "click",
                (E) =>
                {
                    E.stopPropagation();
                    const CmdId = Btn.dataset.recordId;
                    if (ActiveRecordingCommandId === CmdId)
                    {
                        CancelRecordingKeybinding();
                    }
                    else
                    {
                        StartRecordingKeybinding(CmdId);
                    }
                }
            );
        }
    );

    Container.querySelectorAll(".ResetKeyBtn").forEach
    (
        (Btn) =>
        {
            Btn.addEventListener
            (
                "click",
                (E) =>
                {
                    E.stopPropagation();
                    ResetKeybinding(Btn.dataset.resetId);
                }
            );
        }
    );
}

function StartRecordingKeybinding(CommandId)
{
    ActiveRecordingCommandId = CommandId;
    const Banner = document.getElementById("KeybindingsRecordingBanner");
    const Label = document.getElementById("KeybindingsRecordingLabel");
    const All = GetAllManageableCommands();
    const Found = All.find( (C) => C.Id === CommandId);
    const Name = Found ? Found.Label: CommandId;

    if (Banner && Label)
    {
        Label.textContent = `Recording shortcut for "${Name}"... Press key combination on keyboard (Escape to cancel, Backspace to clear).`;
        Banner.style.display = "flex";
    }

    const SearchInput = document.getElementById("KeybindingsSearchInput");
    RenderKeybindingsList(SearchInput ? SearchInput.value: "");
}

function CancelRecordingKeybinding()
{
    ActiveRecordingCommandId = null;
    RecordingCooldownUntil = Date.now() + 350;
    const Banner = document.getElementById("KeybindingsRecordingBanner");
    if (Banner)
    {
        Banner.style.display = "none";
    }
    const SearchInput = document.getElementById("KeybindingsSearchInput");
    RenderKeybindingsList(SearchInput ? SearchInput.value: "");
}

function SaveKeybinding(CommandId, KeyCombo)
{
    CustomKeybindings[CommandId] = KeyCombo;
    try
    {
        localStorage.setItem("TypstStudio_CustomKeybindings", JSON.stringify(CustomKeybindings));
    }
    catch (Ignored) {}
    CancelRecordingKeybinding();
    UpdateCheatSheetBadges();
    ShowToast(`Updated shortcut for ${CommandId}: ${KeyCombo}`, "info", 1800);
}

function ResetKeybinding(CommandId)
{
    delete CustomKeybindings[CommandId];
    try
    {
        localStorage.setItem("TypstStudio_CustomKeybindings", JSON.stringify(CustomKeybindings));
    }
    catch (Ignored) {}
    CancelRecordingKeybinding();
    UpdateCheatSheetBadges();
    ShowToast(`Reset shortcut for ${CommandId} to default`, "info", 1800);
}

function ResetAllKeybindings()
{
    CustomKeybindings = {};
    try
    {
        localStorage.removeItem("TypstStudio_CustomKeybindings");
    }
    catch (Ignored) {}
    CancelRecordingKeybinding();
    UpdateCheatSheetBadges();
    ShowToast("All shortcuts reset to defaults", "info", 1800);
}

function UpdateCheatSheetBadges()
{
    document.querySelectorAll("#ShortcutsCheatSheetView .ShortcutKeys[Data-Command]").forEach
    (
        (El) =>
        {
            const CmdId = El.getAttribute("Data-Command");
            if (CmdId)
            {
                const EffectiveKey = GetEffectiveKeybinding(CmdId);
                if (EffectiveKey)
                {
                    El.innerHTML = FormatKeyComboHtml(EffectiveKey);
                }
            }
        }
    );
}

function NormalizeKeyboardEvent(Event)
{
    const Parts = [];
    if (Event.ctrlKey || Event.metaKey)
    {
        Parts.push("Ctrl");
    }
    if (Event.altKey)
    {
        Parts.push("Alt");
    }
    if (Event.shiftKey)
    {
        Parts.push("Shift");
    }

    let Key = Event.key;
    if (Key === "Control" || Key === "Alt" || Key === "Shift" || Key === "Meta")
    {
        return null;
    }

    if (Key === " ") { Key = "Space"; }
    else if (Key === "+") { Key = "="; }
    else if (Key.length === 1) { Key = Key.toUpperCase(); }

    Parts.push(Key);
    return Parts.join("+");
}

function FindCommandByBinding(PressedCombo)
{
    if (!PressedCombo) { return null; }
    const NormalizedPressed = PressedCombo.toLowerCase();

    for (const [CmdId, Key] of Object.entries(CustomKeybindings))
    {
        if (Key && Key.toLowerCase() === NormalizedPressed)
        {
            return CmdId;
        }
    }

    for (const [CmdId, Key] of Object.entries(DEFAULT_KEYBINDINGS))
    {
        if (CustomKeybindings.hasOwnProperty(CmdId)) { continue; }
        if (Key && Key.toLowerCase() === NormalizedPressed)
        {
            return CmdId;
        }
    }

    return null;
}

function ExecuteStudioCommand(CommandId)
{
    switch (CommandId)
    {
        case "save_document":
            SaveCurrentFile();
            TriggerCompileNow();
            break;
        case "compile_document":
            TriggerCompileNow();
            break;
        case "format_lafs":
            ApplyFormattingToEditor();
            break;
        case "export_pdf":
            ExportPdf();
            break;
        case "print_document":
            TriggerDocumentPrint();
            break;
        case "layout_split":
            SetViewportLayout("split");
            break;
        case "layout_editor":
            SetViewportLayout("editor");
            break;
        case "layout_preview":
            SetViewportLayout("preview");
            break;
        case "toggle_explorer":
            ToggleExplorerSidebar();
            break;
        case "toggle_outline":
            ToggleDocumentOutline();
            break;
        case "toggle_fullscreen":
            ToggleFullscreen();
            break;
        case "toggle_devtools":
            ToggleDevTools();
            break;
        case "open_shortcuts":
            ToggleShortcutsModal();
            break;
        case "editor_font_zoom_in":
            IncreaseEditorFontSize();
            break;
        case "editor_font_zoom_out":
            DecreaseEditorFontSize();
            break;
        case "editor_font_zoom_reset":
            ResetEditorFontSize();
            break;
        case "preview_zoom_in":
            SetZoom(CurrentZoomLevel + 0.1);
            break;
        case "preview_zoom_out":
            SetZoom(CurrentZoomLevel - 0.1);
            break;
        case "preview_zoom_fit_width":
            FitWidth();
            break;
        case "preview_zoom_fit_page":
            FitPage();
            break;
        case "toggle_dark_page":
            ToggleBlackPageMode();
            break;
        case "toggle_ui_mode":
            SetUIMode(CurrentUIMode === "focus" ? "studio" : "focus");
            break;
        case "toggle_spread_mode":
            ToggleSpreadMode();
            break;
        case "toggle_ligatures":
            ToggleLigatures();
            break;
        case "typographic_polish":
            PolishTypographyInDocument();
            break;
        case "toggle_optical_margins":
            ToggleOpticalMargins();
            break;
        case "toggle_smart_quotes":
            ToggleSmartQuotes();
            break;
        case "inspect_ligatures":
            OpenLigaturesInspector();
            break;
        case "toggle_typewriter_scroll":
            ToggleTypewriterScroll();
            break;
        case "toggle_hemingway_focus":
            ToggleHemingwayFocus();
            break;
        case "open_time_machine":
            OpenTimeMachine();
            break;
        case "enter_stage_mode":
            EnterKeynoteStageMode();
            break;
        case "open_command_palette":
            OpenCommandPalette();
            break;
        case "open_settings":
            OpenSettingsModal("appearance");
            break;
        case "open_export_sheet":
            OpenExportSheet();
            break;
        default:
            if (MonacoInstance)
            {
                const Action = MonacoInstance.getAction(CommandId);
                if (Action && typeof Action.run === "function")
                {
                    Action.run();
                }
                else
                {
                    MonacoInstance.trigger("keyboard", CommandId);
                }
            }
            break;
    }
}

function ToggleShortcutsModal(ForceOpen)
{
    const Modal = document.getElementById("ShortcutsModal");
    if (!Modal) { return; }

    const IsOpen = Modal.style.display === "flex";
    const ShouldOpen = (typeof ForceOpen === "boolean") ? ForceOpen: ! IsOpen;
    Modal.style.display = ShouldOpen ? "flex": "none";
    if (ShouldOpen)
    {
        UpdateCheatSheetBadges();
    }
    else
    {
        CancelRecordingKeybinding();
    }
}

function TriggerDocumentPrint()
{
    ShowToast("Preparing document for print...", "info", 1500);
    setTimeout
    (
        () => { window.print(); },
        200
    );
}
// --- UNIFIED EXPORT MENU ARCHITECTURE ---

function ToggleExportMenu(ForceState)
{
    const Menu = document.getElementById("ExportMenuDropdown");
    if (!Menu) { return; }

    IsExportMenuOpen = (typeof ForceState === "boolean") ? ForceState: ! IsExportMenuOpen;
    Menu.style.display = IsExportMenuOpen ? "flex": "none";
}

function SetupEventListeners()
{
    // Sidebar Explorer Toggle Controls (Synchronous Early Binding)
    const ToggleBtn = document.getElementById("ToggleExplorerBtn");
    if (ToggleBtn)
    {
        ToggleBtn.addEventListener("click", () => { ToggleExplorerSidebar(); });
    }
    const TabsToggleBtn = document.getElementById("TabsToggleExplorerBtn");
    if (TabsToggleBtn)
    {
        TabsToggleBtn.addEventListener("click", () => { ToggleExplorerSidebar(); });
    }
    const CloseBtn = document.getElementById("CloseExplorerBtn");
    if (CloseBtn)
    {
        CloseBtn.addEventListener("click", () => { ToggleExplorerSidebar(false); });
    }

    // Priority 2: Viewport Layout Controls
    const SplitBtn = document.getElementById("LayoutSplitBtn");
    const EditorBtn = document.getElementById("LayoutEditorBtn");
    const PreviewBtn = document.getElementById("LayoutPreviewBtn");
    if (SplitBtn)
    {
        SplitBtn.addEventListener
        (
            "click", () => { SetViewportLayout("split"); }
        );
    }
    if (EditorBtn)
    {
        EditorBtn.addEventListener
        (
            "click", () => { SetViewportLayout("editor"); }
        );
    }
    if (PreviewBtn)
    {
        PreviewBtn.addEventListener
        (
            "click", () => { SetViewportLayout("preview"); }
        );
    }
    // Fullscreen Toggle Control
    const FullscreenBtn = document.getElementById("FullscreenToggleBtn");
    if (FullscreenBtn)
    {
        FullscreenBtn.addEventListener
        (
            "click", () => { ToggleFullscreen(); }
        );
    }
    document.addEventListener
    (
        "fullscreenchange",
        () =>
        {
            IsAppFullscreen = Boolean(document.fullscreenElement);
            UpdateFullscreenUI(IsAppFullscreen);
        }
    );

    // Editor Font Size Controls
    const DecreaseFontBtn = document.getElementById("DecreaseFontSizeBtn");
    const IncreaseFontBtn = document.getElementById("IncreaseFontSizeBtn");
    const FontSizeDisplay = document.getElementById("EditorFontSizeDisplay");
    if (DecreaseFontBtn)
    {
        DecreaseFontBtn.addEventListener
        (
            "click", () => { DecreaseEditorFontSize(); }
        );
    }
    if (IncreaseFontBtn)
    {
        IncreaseFontBtn.addEventListener
        (
            "click", () => { IncreaseEditorFontSize(); }
        );
    }
    if (FontSizeDisplay)
    {
        FontSizeDisplay.addEventListener
        (
            "click", () => { ResetEditorFontSize(); }
        );
    }

    // Priority 2: Document Outline & Left Sidebar Tabs Controls
    const TabFiles = document.getElementById("SidebarTabFiles");
    if (TabFiles)
    {
        TabFiles.addEventListener("click", () => { SwitchSidebarTab("files"); });
    }
    const TabOutline = document.getElementById("SidebarTabOutline");
    if (TabOutline)
    {
        TabOutline.addEventListener("click", () => { SwitchSidebarTab("outline"); });
    }

    const OutlineToggle = document.getElementById("StatusOutlineToggle");
    const OutlineClose = document.getElementById("CloseOutlineBtn");
    const OutlineSearch = document.getElementById("OutlineSearchInput");
    const OutlineList = document.getElementById("OutlineList");
    if (OutlineToggle)
    {
        OutlineToggle.addEventListener
        (
            "click", () => { ToggleDocumentOutline(); }
        );
    }
    if (OutlineClose)
    {
        OutlineClose.addEventListener
        (
            "click", () => { ToggleDocumentOutline(false); }
        );
    }
    if (OutlineSearch)
    {
        OutlineSearch.addEventListener
        (
            "input", () => { RenderOutlineItems(OutlineHeadingsList); }
        );
    }
    if (OutlineList)
    {
        OutlineList.addEventListener
        (
            "click", (E) =>
            {
                const Item = E.target.closest(".OutlineItem");
                if (Item)
                {
                    const Line = parseInt(Item.getAttribute("Data-Line"), 10);
                    if (!isNaN(Line)) { JumpToEditorLocation(Line, 1); }
                }
            }
        );
    }
    // Unified Export Menu Toggle & Actions
    const ExportToggle = document.getElementById("ExportMenuToggleBtn");
    const ExportPdfMenu = document.getElementById("ExportPdfMenuOption");
    const OpenSettingsExport = document.getElementById("OpenSettingsFromExportBtn");
    if (ExportToggle)
    {
        ExportToggle.addEventListener
        (
            "click", (E) =>
            {
                E.stopPropagation();
                ToggleExportMenu();
            }
        );
    }
    if (ExportPdfMenu)
    {
        ExportPdfMenu.addEventListener
        (
            "click", () =>
            {
                ToggleExportMenu(false);
                ExportPdf();
            }
        );
    }
    if (OpenSettingsExport)
    {
        OpenSettingsExport.addEventListener
        (
            "click", () =>
            {
                ToggleExportMenu(false);
                SwitchToDashboard();
            }
        );
    }
    // Close export menu when clicking anywhere outside
    document.addEventListener
    (
        "click", (E) =>
        {
            if (IsExportMenuOpen && !E.target.closest("#ExportGroupWrapper"))
            {
                ToggleExportMenu(false);
            }
        }
    );
    // Priority 4: Print Document
    const PrintBtn = document.getElementById("PrintDocButton");
    if (PrintBtn)
    {
        PrintBtn.addEventListener
        (
            "click", () =>
            {
                ToggleExportMenu(false);
                TriggerDocumentPrint();
            }
        );
    }
    // Priority 4: Keyboard Shortcuts Modal
    const HelpBtn = document.getElementById("ShortcutsHelpBtn");
    const CloseModalBtn = document.getElementById("CloseShortcutsModalBtn");
    const ShortcutsModal = document.getElementById("ShortcutsModal");
    if (HelpBtn)
    {
        HelpBtn.addEventListener
        (
            "click", () => { ToggleShortcutsModal(true); }
        );
    }
    if (CloseModalBtn)
    {
        CloseModalBtn.addEventListener
        (
            "click", () => { ToggleShortcutsModal(false); }
        );
    }
    if (ShortcutsModal)
    {
        ShortcutsModal.addEventListener
        (
            "click", (E) =>
            {
                if (E.target.id === "ShortcutsModal") { ToggleShortcutsModal(false); }
            }
        );
    }
    const TabCheatSheet = document.getElementById("ShortcutsTabCheatSheet");
    const TabKeybindings = document.getElementById("ShortcutsTabKeybindings");
    const CheatSheetView = document.getElementById("ShortcutsCheatSheetView");
    const KeybindingsView = document.getElementById("KeybindingsManagerView");
    if (TabCheatSheet && TabKeybindings && CheatSheetView && KeybindingsView)
    {
        TabCheatSheet.addEventListener
        (
            "click",
            () =>
            {
                TabCheatSheet.classList.add("Active");
                TabKeybindings.classList.remove("Active");
                CheatSheetView.style.display = "grid";
                KeybindingsView.style.display = "none";
                CancelRecordingKeybinding();
            }
        );
        TabKeybindings.addEventListener
        (
            "click",
            () =>
            {
                TabKeybindings.classList.add("Active");
                TabCheatSheet.classList.remove("Active");
                CheatSheetView.style.display = "none";
                KeybindingsView.style.display = "flex";
                RenderKeybindingsList();
            }
        );
    }
    const KeybindingsSearch = document.getElementById("KeybindingsSearchInput");
    if (KeybindingsSearch)
    {
        KeybindingsSearch.addEventListener
        (
            "input",
            (E) => { RenderKeybindingsList(E.target.value); }
        );
    }
    const ResetAllBtn = document.getElementById("ResetAllKeybindingsBtn");
    if (ResetAllBtn)
    {
        ResetAllBtn.addEventListener
        (
            "click",
            () => { ResetAllKeybindings(); }
        );
    }
    // Export Options Sync & Persistence
    const ExportBlackCb = document.getElementById("ExportBlackModeCheckbox");
    const ExportTransCb = document.getElementById("ExportTransparentCheckbox");
    const ExportPaperSelect = document.getElementById("ExportPaperModeSelect");
    const ExportPaperBadge = document.getElementById("ExportPaperModeBadge");
    const DefaultBgSelect = document.getElementById("DefaultExportBgSelect");
    // Load initial states from localStorage
    const InitialBlack = localStorage.getItem("typst_black_mode_export") === "true";
    const InitialTrans = localStorage.getItem("typst_transparent_export") === "true";
    if (ExportBlackCb) { ExportBlackCb.checked = InitialBlack; }
    if (ExportTransCb) { ExportTransCb.checked = InitialTrans; }
    if (ExportPaperSelect) { ExportPaperSelect.value = CurrentPaperColorMode; }
    if (ExportPaperBadge)
    {
        ExportPaperBadge.textContent = (CurrentPaperColorMode === "pure_black") ? "Pure Black (OLED)": (CurrentPaperColorMode === "optimized") ? "Optimized Pitch Black": "Light Mode (Normal)";
    }
    if (DefaultBgSelect) { DefaultBgSelect.value = InitialTrans ? "transparent": "normal"; }

    if (ExportBlackCb)
    {
        ExportBlackCb.addEventListener
        (
            "change", (E) =>
            {
                const IsBlack = E.target.checked;
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true": "false");
                if (IsBlack && CurrentPaperColorMode === "light")
                {
                    SetPaperColorMode("optimized");
                }
                else if (!IsBlack && CurrentPaperColorMode !== "light")
                {
                    SetPaperColorMode("light");
                }
                ShowToast(`Export in Black mode: ${IsBlack ? "Enabled" : "Disabled"}`, "info");
            }
        );
    }

    if (ExportTransCb)
    {
        ExportTransCb.addEventListener
        (
            "change", (E) =>
            {
                const IsTrans = E.target.checked;
                localStorage.setItem("typst_transparent_export", IsTrans ? "true": "false");
                if (DefaultBgSelect) { DefaultBgSelect.value = IsTrans ? "transparent": "normal"; }
                ShowToast(`Transparent background: ${IsTrans ? "Enabled" : "Disabled"}`, "info");
            }
        );
    }

    if (ExportPaperSelect)
    {
        ExportPaperSelect.addEventListener
        (
            "change", (E) =>
            {
                const SelectedMode = E.target.value;
                SetPaperColorMode(SelectedMode);
                if (ExportBlackCb) { ExportBlackCb.checked = (SelectedMode !== "light"); }
                localStorage.setItem("typst_black_mode_export", (SelectedMode !== "light") ? "true": "false");
                ShowToast(`Paper color mode set to ${SelectedMode === "pure_black" ? "Pure Black (OLED)" : SelectedMode === "optimized" ? "Optimized Pitch Black" : "Light Mode"}`, "info");
            }
        );
    }

    if (DefaultBgSelect)
    {
        DefaultBgSelect.addEventListener
        (
            "change", (E) =>
            {
                const IsTrans = E.target.value === "transparent";
                localStorage.setItem("typst_transparent_export", IsTrans ? "true": "false");
                if (ExportTransCb) { ExportTransCb.checked = IsTrans; }
                ShowToast(`Default export background set to ${IsTrans ? "Transparent" : "Solid"}`, "info");
            }
        );
    }
    // Priority 1: Jump to Primary Error button
    const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
    if (JumpBtn)
    {
        JumpBtn.addEventListener
        (
            "click", () =>
            {
                if (PrimaryErrorLocation)
                {
                    JumpToEditorLocation(PrimaryErrorLocation.Line, PrimaryErrorLocation.Col, PrimaryErrorLocation.File);
                }
            }
        );
    }
    // Interactive clickable error location links in ErrorDrawer
    const ErrorContent = document.getElementById("ErrorContent");
    if (ErrorContent)
    {
        ErrorContent.addEventListener
        (
            "click", (Event) =>
            {
                const Link = Event.target.closest(".ErrorLocationLink");
                if (Link)
                {
                    const File = Link.getAttribute("Data-File");
                    const Line = parseInt(Link.getAttribute("Data-Line"), 10);
                    const Col = parseInt(Link.getAttribute("Data-Col"), 10) || 1;
                    if (!isNaN(Line))
                    {
                        JumpToEditorLocation(Line, Col, File);
                    }
                }
            }
        );
    }
    // Unsaved dirty state warning before closing/reloading window
    window.addEventListener
    (
        "beforeunload", (Event) =>
        {
            if (IsDocumentDirty)
            {
                Event.preventDefault();
                Event.returnValue = "";
            }
        }
    );

    document.getElementById("ManualCompileButton").addEventListener
    (
        "click", () => { TriggerCompileNow(); }
    );
    document.getElementById("FormatLafsButton").addEventListener
    (
        "click", () => { ApplyFormattingToEditor(); }
    );
    document.getElementById("ExportPdfButton").addEventListener
    (
        "click", () => { OpenExportSheet(); }
    );
    document.getElementById("ExportSvgButton").addEventListener
    (
        "click", () =>
        {
            ToggleExportMenu(false);
            ExportSvg();
        }
    );
    document.getElementById("ExportPngButton").addEventListener
    (
        "click", () =>
        {
            ToggleExportMenu(false);
            ExportPng();
        }
    );
    document.getElementById("CopyCodeButton").addEventListener
    (
        "click", () => { CopySource(); }
    );
    document.getElementById("BlackPageToggle").addEventListener
    (
        "click", () => { ToggleBlackPageMode(); }
    );

    const PaperModeButtons = document.querySelectorAll(".PaperModeBtn");
    for (const Btn of PaperModeButtons)
    {
        Btn.addEventListener
        (
            "click", () =>
            {
                const Mode = Btn.dataset.mode;
                if (Mode)
                {
                    SetPaperColorMode(Mode);
                    ShowToast(`Paper mode: ${Mode === "pure_black" ? "Pure Black (OLED)" : Mode === "optimized" ? "Optimized Night Mode" : "Light Mode"}`, "info");
                }
            }
        );
    }

    const ErrorIndicator = document.getElementById("CompilationErrorIndicator");
    if (ErrorIndicator)
    {
        ErrorIndicator.addEventListener
        (
            "click", () =>
            {
                const Drawer = document.getElementById("ErrorDrawer");
                if (Drawer)
                {
                    Drawer.classList.toggle("Visible");
                }
                const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
                if (JumpBtn && JumpBtn.style.display === "inline-flex")
                {
                    JumpBtn.click();
                }
            }
        );
    }
    document.getElementById("CloseErrorButton").addEventListener
    (
        "click", () =>
        {
            document.getElementById("ErrorDrawer").classList.remove("Visible");
        }
    );

    document.getElementById("TemplateSelector").addEventListener
    (
        "change", (E) =>
        {
            const Selected = E.target.value;
            if (TEMPLATES[Selected] && MonacoInstance)
            {
                MonacoInstance.setValue(TEMPLATES[Selected]);
                TriggerCompileNow();
            }
        }
    );

    document.getElementById("ZoomInButton").addEventListener
    (
        "click", () => { SetZoom(CurrentZoomLevel + 0.1); }
    );
    document.getElementById("ZoomOutButton").addEventListener
    (
        "click", () => { SetZoom(CurrentZoomLevel - 0.1); }
    );
    document.getElementById("ZoomDisplay").addEventListener
    (
        "dblclick", () => { SetZoom(1.0); }
    );
    document.getElementById("ZoomFitWidthButton").addEventListener
    (
        "click", () => { FitWidth(); }
    );
    document.getElementById("ZoomFitPageButton").addEventListener
    (
        "click", () => { FitPage(); }
    );

    document.getElementById("PrevPageButton").addEventListener
    (
        "click", () =>
        {
            if (CurrentActivePage > 1)
            {
                CurrentActivePage --;
                UpdatePagination();
                const Target = document.getElementById(`PageSheet_${CurrentActivePage}`);
                if (Target)
                {
                    Target.scrollIntoView( { behavior: "smooth", block: "start" });
                }
            }
        }
    );

    document.getElementById("NextPageButton").addEventListener
    (
        "click", () =>
        {
            if (CurrentActivePage < CurrentPageCount)
            {
                CurrentActivePage ++;
                UpdatePagination();
                const Target = document.getElementById(`PageSheet_${CurrentActivePage}`);
                if (Target)
                {
                    Target.scrollIntoView( { behavior: "smooth", block: "start" });
                }
            }
        }
    );

    SetupSplitResizer();

    // Document Title Dropdown (legacy / fallback guarded)
    const DocDropdownToggle = document.getElementById("DocDropdownToggle");
    if (DocDropdownToggle)
    {
        DocDropdownToggle.addEventListener
        (
            "click", (E) =>
            {
                E.stopPropagation();
                ToggleDocDropdown();
            }
        );
    }

    const DocDropdownSearch = document.getElementById("DocDropdownSearch");
    if (DocDropdownSearch)
    {
        DocDropdownSearch.addEventListener
        (
            "input", (E) =>
            {
                RenderDocDropdownList(E.target.value);
            }
        );
    }

    const QuickNewDocBtn = document.getElementById("QuickNewDocBtn");
    if (QuickNewDocBtn)
    {
        QuickNewDocBtn.addEventListener
        (
            "click", () =>
            {
                CloseDocDropdown();
                ShowNewDocumentModal();
            }
        );
    }

    const OpenDashboardFromDropdownBtn = document.getElementById("OpenDashboardFromDropdownBtn");
    if (OpenDashboardFromDropdownBtn)
    {
        OpenDashboardFromDropdownBtn.addEventListener
        (
            "click", () =>
            {
                CloseDocDropdown();
                SwitchView("dashboard");
            }
        );
    }

    document.addEventListener
    (
        "click", (E) =>
        {
            const Group = document.getElementById("DocDropdownGroup");
            if (Group && !Group.contains(E.target))
            {
                CloseDocDropdown();
            }
        }
    );

    // Save File Button
    const SaveFileButton = document.getElementById("SaveFileButton");
    if (SaveFileButton)
    {
        SaveFileButton.addEventListener
        (
            "click", () =>
            {
                SaveCurrentFile();
            }
        );
    }

    // View Navigation Tabs
    const NavEditorBtn = document.getElementById("NavEditorBtn");
    if (NavEditorBtn)
    {
        NavEditorBtn.addEventListener
        (
            "click", () =>
            {
                SwitchView("editor");
            }
        );
    }

    const NavDashboardBtn = document.getElementById("NavDashboardBtn");
    if (NavDashboardBtn)
    {
        NavDashboardBtn.addEventListener
        (
            "click", () =>
            {
                SwitchView("dashboard");
            }
        );
    }

    const BackToEditor = document.getElementById("DashboardBackToEditorBtn");
    if (BackToEditor)
    {
        BackToEditor.addEventListener
        (
            "click", () =>
            {
                SwitchView("editor");
            }
        );
    }

    const StatResumeBtn = document.getElementById("StatResumeBtn");
    if (StatResumeBtn)
    {
        StatResumeBtn.addEventListener
        (
            "click", () =>
            {
                SwitchView("editor");
            }
        );
    }
    // Dashboard Actions
    const DashboardRefresh = document.getElementById("DashboardRefreshBtn");
    if (DashboardRefresh)
    {
        DashboardRefresh.addEventListener
        (
            "click", () =>
            {
                LoadWorkspaceInfo();
                ShowToast("Workspace refreshed", "info");
            }
        );
    }

    const DashboardNewFile = document.getElementById("DashboardNewFileBtn");
    if (DashboardNewFile)
    {
        DashboardNewFile.addEventListener
        (
            "click", () =>
            {
                ShowNewDocumentModal();
            }
        );
    }

    const ExplorerNewFile = document.getElementById("ExplorerNewFileBtn");
    if (ExplorerNewFile)
    {
        ExplorerNewFile.addEventListener
        (
            "click", () =>
            {
                ShowNewDocumentModal(ExplorerCurrentRoot);
            }
        );
    }

    const CloseNewDocBtn = document.getElementById("CloseNewDocModalBtn");
    if (CloseNewDocBtn)
    {
        CloseNewDocBtn.addEventListener("click", CloseNewDocumentModal);
    }

    const CancelNewDocBtn = document.getElementById("NewDocModalCancelBtn");
    if (CancelNewDocBtn)
    {
        CancelNewDocBtn.addEventListener("click", CloseNewDocumentModal);
    }

    const CreateNewDocBtn = document.getElementById("NewDocModalCreateBtn");
    if (CreateNewDocBtn)
    {
        CreateNewDocBtn.addEventListener("click", ConfirmCreateNewDocument);
    }

    const BrowseDirBtn = document.getElementById("NewDocModalBrowseDirBtn");
    if (BrowseDirBtn)
    {
        BrowseDirBtn.addEventListener
        (
            "click", async () =>
            {
                await PickFolderFromDisk();
                const DirSelect = document.getElementById("NewDocModalProjectDirSelect");
                if (DirSelect && WorkspaceDirectories && WorkspaceDirectories.length > 0)
                {
                    DirSelect.innerHTML = WorkspaceDirectories.map((D) => `<option value="${EscapeHtml(D)}">${EscapeHtml(D)}</option>`).join("");
                    DirSelect.value = WorkspaceDirectories[WorkspaceDirectories.length - 1];
                }
            }
        );
    }

    const NewDocInput = document.getElementById("NewDocModalInput");
    if (NewDocInput)
    {
        NewDocInput.addEventListener
        (
            "keydown", (E) =>
            {
                if (E.key === "Enter")
                {
                    E.preventDefault();
                    ConfirmCreateNewDocument();
                }
                else if (E.key === "Escape")
                {
                    E.preventDefault();
                    CloseNewDocumentModal();
                }
            }
        );
    }

    const PickFolder = document.getElementById("PickFolderBtn");
    if (PickFolder)
    {
        PickFolder.addEventListener
        (
            "click", () =>
            {
                PickFolderFromDisk();
            }
        );
    }

    const AddDirBtn = document.getElementById("AddDirectorySubmitBtn");
    if (AddDirBtn)
    {
        AddDirBtn.addEventListener
        (
            "click", () =>
            {
                AddWorkspaceDirectory();
            }
        );
    }

    const NewDirInput = document.getElementById("NewDirectoryInput");
    if (NewDirInput)
    {
        NewDirInput.addEventListener
        (
            "keydown", (E) =>
            {
                if (E.key === "Enter")
                {
                    AddWorkspaceDirectory();
                }
            }
        );
    }

    const DashboardSearch = document.getElementById("DashboardProjectSearch") || document.getElementById("DashboardFileSearch");
    if (DashboardSearch)
    {
        DashboardSearch.addEventListener
        (
            "input", (E) =>
            {
                RenderHomepage(E.target.value);
            }
        );
    }

    // Steve Jobs Homepage Hero Actions
    const HeroEmptyBtn = document.getElementById("HeroEmptyProjectBtn");
    if (HeroEmptyBtn)
    {
        HeroEmptyBtn.addEventListener
        (
            "click", () =>
            {
                ShowNewDocumentModal();
            }
        );
    }

    const HeroTemplateBtn = document.getElementById("HeroTemplateProjectBtn");
    if (HeroTemplateBtn)
    {
        HeroTemplateBtn.addEventListener
        (
            "click", () =>
            {
                ShowTemplateChooserModal();
            }
        );
    }

    const HomepageFolderBtn = document.getElementById("HomepageNewFolderBtn");
    if (HomepageFolderBtn)
    {
        HomepageFolderBtn.addEventListener
        (
            "click", () =>
            {
                PickFolderFromDisk();
            }
        );
    }

    const HeroStandaloneBtn = document.getElementById("HeroStandaloneProjectBtn");
    if (HeroStandaloneBtn)
    {
        HeroStandaloneBtn.addEventListener
        (
            "click", () =>
            {
                PickStandaloneFileFromDisk();
            }
        );
    }

    const HomepageOpenStandaloneBtn = document.getElementById("HomepageOpenStandaloneBtn");
    if (HomepageOpenStandaloneBtn)
    {
        HomepageOpenStandaloneBtn.addEventListener
        (
            "click", () =>
            {
                PickStandaloneFileFromDisk();
            }
        );
    }

    const HomepageSortSelect = document.getElementById("HomepageSortSelect");
    if (HomepageSortSelect)
    {
        HomepageSortSelect.addEventListener
        (
            "change", (E) =>
            {
                CurrentHomepageSort = E.target.value;
                const SearchVal = DashboardSearch ? DashboardSearch.value: "";
                RenderHomepage(SearchVal);
            }
        );
    }

    const ViewGridBtn = document.getElementById("ViewModeGridBtn");
    const ViewListBtn = document.getElementById("ViewModeListBtn");
    CurrentHomepageViewMode = localStorage.getItem("typst_homepage_view_mode") || "grid";
    if (ViewGridBtn && ViewListBtn)
    {
        if (CurrentHomepageViewMode === "list")
        {
            ViewListBtn.classList.add("Active");
            ViewGridBtn.classList.remove("Active");
        }
        else
        {
            ViewGridBtn.classList.add("Active");
            ViewListBtn.classList.remove("Active");
        }

        ViewGridBtn.addEventListener
        (
            "click", () =>
            {
                CurrentHomepageViewMode = "grid";
                localStorage.setItem("typst_homepage_view_mode", "grid");
                ViewGridBtn.classList.add("Active");
                ViewListBtn.classList.remove("Active");
                const SearchVal = DashboardProjectSearch ? DashboardProjectSearch.value: "";
                RenderHomepage(SearchVal);
            }
        );

        ViewListBtn.addEventListener
        (
            "click", () =>
            {
                CurrentHomepageViewMode = "list";
                localStorage.setItem("typst_homepage_view_mode", "list");
                ViewListBtn.classList.add("Active");
                ViewGridBtn.classList.remove("Active");
                const SearchVal = DashboardProjectSearch ? DashboardProjectSearch.value: "";
                RenderHomepage(SearchVal);
            }
        );
    }

    const CloseTemplateBtn = document.getElementById("CloseTemplateModalBtn");
    if (CloseTemplateBtn)
    {
        CloseTemplateBtn.addEventListener
        (
            "click", () =>
            {
                CloseTemplateChooserModal();
            }
        );
    }

    const TemplateModal = document.getElementById("TemplateChooserModal");
    if (TemplateModal)
    {
        TemplateModal.addEventListener
        (
            "click", (Event) =>
            {
                const Card = Event.target.closest(".TemplateOptionCard");
                if (Card && Card.dataset.template)
                {
                    ApplyDocumentTemplate(Card.dataset.template);
                }
            }
        );
    }

    // Delegated click on Resource Links
    const HomepageRightCol = document.querySelector(".HomepageRightColumn");
    if (HomepageRightCol)
    {
        HomepageRightCol.addEventListener
        (
            "click", (Event) =>
            {
                const LinkCard = Event.target.closest(".ResourceLinkCard");
                if (LinkCard && LinkCard.dataset.link)
                {
                    Event.preventDefault();
                    const TargetUrl = LinkCard.dataset.link;
                    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
                    {
                        window.__TAURI__.core.invoke("OpenExternalUrl", { url: TargetUrl, Url: TargetUrl }).catch((Err) => { console.warn("Open external URL:", Err); });
                    }
                    else
                    {
                        window.open(TargetUrl, "_blank");
                    }
                }
            }
        );
    }

    const ProjectsGridContainer = document.getElementById("DashboardProjectsGrid");
    if (ProjectsGridContainer)
    {
        ProjectsGridContainer.addEventListener
        (
            "click", (Event) =>
            {
                // 1. Toggle Project Box Collapse
                const ToggleHeader = Event.target.closest("[data-action='toggle-project-box']");
                if (ToggleHeader && !Event.target.closest("button") && !Event.target.closest(".ProjectBoxActionBtn"))
                {
                    const ProjPath = ToggleHeader.dataset.projectPath;
                    const Box = ToggleHeader.closest(".DashboardProjectBox");
                    if (Box && ProjPath)
                    {
                        const NowCollapsed = !Box.classList.contains("Collapsed");
                        Box.classList.toggle("Collapsed", NowCollapsed);
                        if (NowCollapsed)
                        {
                            CollapsedProjectBoxes.add(ProjPath);
                        }
                        else
                        {
                            CollapsedProjectBoxes.delete(ProjPath);
                        }
                        try
                        {
                            localStorage.setItem("TypstStudio_CollapsedProjects", JSON.stringify(Array.from(CollapsedProjectBoxes)));
                        }
                        catch (Ignored)
                        {
                        }
                        return ;
                    }
                }

                // 1b. Toggle Project Subfolder Collapse
                const SubfolderToggle = Event.target.closest("[data-action='toggle-project-subfolder']");
                if (SubfolderToggle && !Event.target.closest("button") && !Event.target.closest(".ProjectSubfolderActionBtn"))
                {
                    const FolderKey = SubfolderToggle.dataset.folderKey;
                    const SubGroup = SubfolderToggle.closest(".ProjectSubfolderGroup");
                    if (SubGroup && FolderKey)
                    {
                        const NowCollapsed = !SubGroup.classList.contains("Collapsed");
                        SubGroup.classList.toggle("Collapsed", NowCollapsed);
                        if (NowCollapsed)
                        {
                            CollapsedSubfolders.add(FolderKey);
                        }
                        else
                        {
                            CollapsedSubfolders.delete(FolderKey);
                        }
                        try
                        {
                            localStorage.setItem("TypstStudio_CollapsedSubfolders", JSON.stringify(Array.from(CollapsedSubfolders)));
                        }
                        catch (Ignored)
                        {
                        }
                        return ;
                    }
                }

                // 1c. Open Project Folder in Explorer / Editor
                const OpenFolderBtn = Event.target.closest("[data-action='open-project-folder']");
                if (OpenFolderBtn && OpenFolderBtn.dataset.folderPath)
                {
                    const TargetFolderPath = OpenFolderBtn.dataset.folderPath;
                    const TargetProjPath = OpenFolderBtn.dataset.projectPath || TargetFolderPath;
                    OpenProjectFolderInExplorer(TargetProjPath, TargetFolderPath);
                    return ;
                }

                // 1d. New File in Project Subfolder
                const NewSubfolderDocBtn = Event.target.closest("[data-action='new-subfolder-doc']");
                if (NewSubfolderDocBtn && NewSubfolderDocBtn.dataset.folderPath)
                {
                    ShowNewDocumentModal(NewSubfolderDocBtn.dataset.folderPath);
                    return ;
                }

                // 2. Open Project in Explorer / Editor
                const OpenProjBtn = Event.target.closest("[data-action='open-project']");
                if (OpenProjBtn && OpenProjBtn.dataset.projectPath)
                {
                    OpenProjectInExplorer(OpenProjBtn.dataset.projectPath);
                    return ;
                }

                // 3. New File in Project
                const NewProjDocBtn = Event.target.closest("[data-action='new-project-doc']");
                if (NewProjDocBtn && NewProjDocBtn.dataset.projectPath)
                {
                    ShowNewDocumentModal(NewProjDocBtn.dataset.projectPath);
                    return ;
                }

                // 4. Remove Project Directory
                const RemoveProjDirBtn = Event.target.closest("[data-action='remove-project-dir']");
                if (RemoveProjDirBtn && RemoveProjDirBtn.dataset.projectPath)
                {
                    RemoveWorkspaceDirectory(RemoveProjDirBtn.dataset.projectPath);
                    return ;
                }

                // 5. Open Project File (sets Explorer root to this project directory)
                const ProjFileCard = Event.target.closest("[data-action='open-project-file']");
                if (ProjFileCard && ProjFileCard.dataset.filePath)
                {
                    const TargetFilePath = ProjFileCard.dataset.filePath;
                    const TargetProjPath = ProjFileCard.dataset.projectPath;
                    OpenProjectInExplorer(TargetProjPath, TargetFilePath);
                    return ;
                }

                // 6. Open Standalone Document (isolates treeview to single file)
                const StandaloneCard = Event.target.closest("[data-action='open-standalone-doc']");
                if (StandaloneCard && StandaloneCard.dataset.filePath)
                {
                    const TargetFilePath = StandaloneCard.dataset.filePath;
                    const TargetFileName = StandaloneCard.dataset.fileName;
                    OpenStandaloneDocument(TargetFilePath, TargetFileName);
                    return ;
                }

                // 7. Pick Standalone File
                const PickStandaloneBtn = Event.target.closest("[data-action='pick-standalone-file']");
                if (PickStandaloneBtn)
                {
                    PickStandaloneFileFromDisk();
                    return ;
                }

                // 8. Add Project Directory
                const AddProjDirBtn = Event.target.closest("[data-action='add-project-dir']");
                if (AddProjDirBtn)
                {
                    PickFolderFromDisk();
                    return ;
                }

                // Action Buttons inside List View or Cards
                const ActionBtn = Event.target.closest("[data-action]");
                if (ActionBtn)
                {
                    const Action = ActionBtn.dataset.action;
                    const Row = ActionBtn.closest("[data-file-path]");
                    const TargetFilePath = Row ? Row.dataset.filePath : ActionBtn.dataset.filePath;
                    const TargetFileName = Row ? (Row.dataset.fileName || TargetFilePath.split(/[\\/]/).pop()) : (TargetFilePath ? TargetFilePath.split(/[\\/]/).pop() : "");

                    if (!TargetFilePath) { return ; }

                    if (Action === "open-doc" || Action === "open-homepage-doc")
                    {
                        OpenDocumentInTab(TargetFilePath, TargetFileName).then(() => { SwitchView("editor"); });
                        return ;
                    }
                    else if (Action === "export-doc")
                    {
                        OpenDocumentInTab(TargetFilePath, TargetFileName).then
                        (
                            () =>
                            {
                                SwitchView("editor");
                                setTimeout(() => { ExportDocument("pdf"); }, 300);
                            }
                        );
                        return ;
                    }
                    else if (Action === "rename-doc")
                    {
                        RenameWorkspaceDocument(TargetFilePath, TargetFileName);
                        return ;
                    }
                    else if (Action === "delete-doc")
                    {
                        DeleteWorkspaceFile(TargetFilePath, TargetFileName);
                        return ;
                    }
                }

                // Table Sortable Headers
                const SortHeader = Event.target.closest("th.SortableHeader");
                if (SortHeader && SortHeader.dataset.sortKey)
                {
                    CurrentHomepageSort = SortHeader.dataset.sortKey;
                    const Select = document.getElementById("HomepageSortSelect");
                    if (Select) { Select.value = CurrentHomepageSort; }
                    const SearchInput = document.getElementById("DashboardProjectSearch");
                    RenderHomepage(SearchInput ? SearchInput.value : "");
                    return ;
                }

                // Click on List View Table Row
                const ListRow = Event.target.closest(".HomepageListRow");
                if (ListRow && ListRow.dataset.filePath)
                {
                    OpenDocumentInTab(ListRow.dataset.filePath, ListRow.dataset.fileName || ListRow.dataset.filePath.split(/[\\/]/).pop()).then
                    (
                        () =>
                        {
                            SwitchView("editor");
                        }
                    );
                    return ;
                }

                // Click on photorealistic paper card
                const PaperCard = Event.target.closest(".HomepagePaperCard");
                if (PaperCard && PaperCard.dataset.filePath)
                {
                    const FilePath = PaperCard.dataset.filePath;
                    OpenDocumentInTab(FilePath).then
                    (
                        () =>
                        {
                            SwitchView("editor");
                        }
                    );
                    return ;
                }

                const ClearFilterBtn = Event.target.closest("[data-action='clear-dir-filter']");
                if (ClearFilterBtn)
                {
                    SelectDashboardDirectory(null);
                    return ;
                }

                const OpenProjectExplorerBtn = Event.target.closest("[data-action='open-project-explorer']");
                if (OpenProjectExplorerBtn && OpenProjectExplorerBtn.dataset.projectPath)
                {
                    OpenProjectInExplorer(OpenProjectExplorerBtn.dataset.projectPath);
                    return ;
                }

                const CreateProjectFileBtn = Event.target.closest("[data-action='create-project-file']");
                if (CreateProjectFileBtn && CreateProjectFileBtn.dataset.projectPath)
                {
                    CreateFileInProject(CreateProjectFileBtn.dataset.projectPath);
                    return ;
                }

                const OpenDocTarget = Event.target.closest("[data-action='open-document']");
                if (OpenDocTarget && OpenDocTarget.dataset.filePath)
                {
                    OpenDocumentInTab(OpenDocTarget.dataset.filePath).then
                    (
                        () =>
                        {
                            SwitchView("editor");
                        }
                    );
                    return ;
                }
            }
        );
    }

    const DirListContainer = document.getElementById("TrackedDirectoryList");
    if (DirListContainer)
    {
        DirListContainer.addEventListener
        (
            "click", (Event) =>
            {
                const DeleteBtn = Event.target.closest("[data-action='delete-dir']");
                if (DeleteBtn && DeleteBtn.dataset.dirPath)
                {
                    Event.stopPropagation();
                    RemoveWorkspaceDirectory(DeleteBtn.dataset.dirPath);
                    return ;
                }

                const SelectAllItem = Event.target.closest("[data-action='select-all-dirs']");
                if (SelectAllItem)
                {
                    SelectDashboardDirectory(null);
                    return ;
                }

                const SelectDirItem = Event.target.closest("[data-action='select-dir']");
                if (SelectDirItem && SelectDirItem.dataset.dirPath)
                {
                    SelectDashboardDirectory(SelectDirItem.dataset.dirPath);
                    return ;
                }
            }
        );
    }

    const EditorTabsList = document.getElementById("EditorTabsList");
    if (EditorTabsList)
    {
        EditorTabsList.addEventListener
        (
            "click", (Event) =>
            {
                const CloseBtn = Event.target.closest("[data-action='close-tab']");
                if (CloseBtn && CloseBtn.dataset.tabPath)
                {
                    Event.stopPropagation();
                    CloseTab(CloseBtn.dataset.tabPath);
                    return ;
                }

                const TabItem = Event.target.closest("[data-action='switch-tab']");
                if (TabItem && TabItem.dataset.tabPath)
                {
                    SwitchToTab(TabItem.dataset.tabPath);
                    return ;
                }
            }
        );
    }

    const DocDropdownList = document.getElementById("DocDropdownList");
    if (DocDropdownList)
    {
        DocDropdownList.addEventListener
        (
            "click", (Event) =>
            {
                const DropdownItem = Event.target.closest("[data-action='open-workspace-file']");
                if (DropdownItem && DropdownItem.dataset.filePath)
                {
                    OpenFileFromWorkspace(DropdownItem.dataset.filePath);
                    return ;
                }
            }
        );
    }
    // Global Keydown Handler with Dynamic Keybinding Support & Recording Mode
    window.addEventListener
    (
        "keydown", (E) =>
        {
            if (ActiveRecordingCommandId)
            {
                E.preventDefault();
                E.stopPropagation();
                if (typeof E.stopImmediatePropagation === "function")
                {
                    E.stopImmediatePropagation();
                }
                if (E.key === "Escape")
                {
                    CancelRecordingKeybinding();
                    return ;
                }
                if (E.key === "Backspace" || E.key === "Delete")
                {
                    SaveKeybinding(ActiveRecordingCommandId, "");
                    return ;
                }
                const Combo = NormalizeKeyboardEvent(E);
                if (Combo)
                {
                    SaveKeybinding(ActiveRecordingCommandId, Combo);
                }
                return ;
            }

            if (Date.now() < RecordingCooldownUntil)
            {
                E.preventDefault();
                E.stopPropagation();
                return ;
            }

            if (E.key === "Escape")
            {
                ToggleShortcutsModal(false);
                ToggleExportMenu(false);
                CloseExportSheet();
                CloseSettingsModal();
                CloseCommandPalette();
                const Drawer = document.getElementById("ErrorDrawer");
                if (Drawer) { Drawer.classList.remove("Visible"); }
                return ;
            }

            const PressedCombo = NormalizeKeyboardEvent(E);
            if (PressedCombo)
            {
                const MatchedCmdId = FindCommandByBinding(PressedCombo);
                if (MatchedCmdId)
                {
                    const ActiveEl = document.activeElement;
                    const IsTextInput = ActiveEl && (ActiveEl.tagName === "INPUT" || ActiveEl.tagName === "TEXTAREA" || ActiveEl.isContentEditable);
                    if (IsTextInput && !E.ctrlKey && !E.altKey && !E.metaKey && !E.key.startsWith("F"))
                    {
                        return ;
                    }
                    E.preventDefault();
                    ExecuteStudioCommand(MatchedCmdId);
                    return ;
                }
            }

            // Fallback for native default shortcuts
            if (E.key === "F5" || ((E.ctrlKey || E.metaKey) && E.shiftKey && E.key === "Enter"))
            {
                E.preventDefault();
                EnterKeynoteStageMode();
            }
            else if (E.key === "F11")
            {
                E.preventDefault();
                ToggleFullscreen();
            }
            else if ((E.ctrlKey || E.metaKey) && (E.key === "b" || E.key === "B"))
            {
                E.preventDefault();
                ToggleExplorerSidebar();
            }
            else if (E.key === "F12" || ( (E.ctrlKey || E.metaKey) && E.shiftKey && (E.key === "I" || E.key === "i")))
            {
                E.preventDefault();
                ToggleDevTools();
            }
            else if ( (E.ctrlKey || E.metaKey) && (E.key === "=" || E.key === "+"))
            {
                E.preventDefault();
                IncreaseEditorFontSize();
            }
            else if ( (E.ctrlKey || E.metaKey) && (E.key === "-" || E.key === "_"))
            {
                E.preventDefault();
                DecreaseEditorFontSize();
            }
            else if ( (E.ctrlKey || E.metaKey) && E.key === "0")
            {
                E.preventDefault();
                ResetEditorFontSize();
            }
            else if (E.altKey && E.key === "1")
            {
                E.preventDefault();
                SetViewportLayout("split");
            }
            else if (E.altKey && E.key === "2")
            {
                E.preventDefault();
                SetViewportLayout("editor");
            }
            else if (E.altKey && E.key === "3")
            {
                E.preventDefault();
                SetViewportLayout("preview");
            }
            else if (E.altKey && (E.key === "o" || E.key === "O"))
            {
                E.preventDefault();
                ToggleDocumentOutline();
            }
            else if ( (E.ctrlKey || E.metaKey) && E.shiftKey && (E.key === "P" || E.key === "p"))
            {
                E.preventDefault();
                TriggerDocumentPrint();
            }
            else if ( (E.ctrlKey || E.metaKey) && E.key === "/")
            {
                E.preventDefault();
                ToggleShortcutsModal();
            }
            else if (E.key === "?" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
            {
                E.preventDefault();
                ToggleShortcutsModal();
            }
            else if ( (E.ctrlKey || E.metaKey) && (E.key === "s" || E.key === "S"))
            {
                E.preventDefault();
                SaveCurrentFile();
                TriggerCompileNow();
            }
            else if ( (E.ctrlKey || E.metaKey) && E.shiftKey && (E.key === "M" || E.key === "m"))
            {
                E.preventDefault();
                SetUIMode(CurrentUIMode === "focus" ? "studio" : "focus");
                ShowToast(`Switched to ${CurrentUIMode === "focus" ? "✦ Focus Mode" : "⊞ Studio Mode"}`, "info");
            }
            else if ( (E.ctrlKey || E.metaKey) && E.key === ",")
            {
                E.preventDefault();
                OpenSettingsModal();
            }
            else if ( (E.ctrlKey || E.metaKey) && (E.key === "e" || E.key === "E"))
            {
                E.preventDefault();
                OpenExportSheet();
            }
            else if ( (E.ctrlKey || E.metaKey) && (E.key === "k" || E.key === "K"))
            {
                E.preventDefault();
                OpenCommandPalette();
            }
            else if (E.altKey && (E.key === "s" || E.key === "S"))
            {
                E.preventDefault();
                ToggleSpreadMode();
            }
            else if (E.altKey && (E.key === "l" || E.key === "L"))
            {
                E.preventDefault();
                ToggleLigatures();
            }
            else if (E.altKey && (E.key === "t" || E.key === "T"))
            {
                E.preventDefault();
                ToggleTypewriterScroll();
            }
            else if (E.altKey && (E.key === "h" || E.key === "H"))
            {
                E.preventDefault();
                ToggleHemingwayFocus();
            }
            else if ( (E.ctrlKey || E.metaKey) && E.shiftKey && (E.key === "H" || E.key === "h"))
            {
                E.preventDefault();
                OpenTimeMachine();
            }
            else if (E.key === "Escape")
            {
                const TimeMachineModalEl = document.getElementById("TimeMachineModal");
                if (TimeMachineModalEl && (TimeMachineModalEl.classList.contains("Active") || TimeMachineModalEl.style.display === "flex" || getComputedStyle(TimeMachineModalEl).display !== "none"))
                {
                    E.preventDefault();
                    CloseTimeMachine();
                }
            }
        },
        { capture: true }
    );

    SetupDualModeAndExportEventListeners();
}
// --- WORKSPACE & DASHBOARD ARCHITECTURE ---

let WorkspaceDirectories = [];
let WorkspaceFiles = [];
let CurrentFilePath = "";
let ActiveSelectedDirectory = null;
let IsDropdownOpen = false;

function SelectDashboardDirectory(Dir)
{
    ActiveSelectedDirectory = Dir;
    const SearchInput = document.getElementById("DashboardProjectSearch") || document.getElementById("DashboardFileSearch");
    RenderDashboard(SearchInput ? SearchInput.value: "");
}

async function PickFolderFromDisk()
{
    const PickBtn = document.getElementById("PickFolderBtn");
    const DirInput = document.getElementById("NewDirectoryInput");
    const OriginalHtml = PickBtn ? PickBtn.innerHTML: "";

    if (PickBtn)
    {
        PickBtn.disabled = true;
        PickBtn.innerHTML = `
            <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2" Class = "Spinning">
                <circle Cx = "12" Cy = "12" R = "10" Stroke-Dasharray = "32" Stroke-Dashoffset = "12" />
            </svg>
            <span>Picking...</span>
        `;
    }

    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const SelectedPath = await window.__TAURI__.core.invoke("PickFolder");
            if (SelectedPath)
            {
                if (DirInput) { DirInput.value = SelectedPath; }
                await window.__TAURI__.core.invoke("AddWorkspaceDirectory", { pathStr: SelectedPath, PathStr: SelectedPath });
                await LoadWorkspaceInfo();
                ShowToast(`Added folder: ${SelectedPath}`, "success");
                return ;
            }
        }
        else if (window.__TAURI__ && window.__TAURI__.dialog && typeof window.__TAURI__.dialog.open === "function")
        {
            const SelectedPath = await window.__TAURI__.dialog.open
            ({
                directory: true,
                multiple: false,
                title: "Select Typst Project Folder"
            });
            if (SelectedPath && DirInput)
            {
                DirInput.value = SelectedPath;
                DirInput.focus();
                return ;
            }
        }

        const Response = await AuthenticatedFetch("/api/workspace/pick-folder", { method: "POST" });
        if (Response.ok)
        {
            const Data = await Response.json();
            if (Data.Success && Data.Path)
            {
                if (DirInput)
                {
                    DirInput.value = Data.Path;
                    DirInput.focus();
                }
            }
        }
    }
    catch (Err)
    {
        console.error("Folder picker error:", Err);
    }
    finally
    {
        if (PickBtn)
        {
            PickBtn.disabled = false;
            PickBtn.innerHTML = OriginalHtml;
        }
    }
}

function FormatFileSize(Bytes)
{
    if (Bytes < 1024)
    {
        return `${Bytes} B`;
    }
    if (Bytes < 1024 * 1024)
    {
        return `${(Bytes / 1024).toFixed(1)} KB`;
    }
    return `${(Bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FormatDate(IsoString)
{
    if (!IsoString)
    {
        return "";
    }
    const DateObj = new Date(IsoString);
    return DateObj.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function EscapeHtml(Str)
{
    if (!Str)
    {
        return "";
    }
    return String(Str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

let CachedAvailableFonts = [];

async function LoadAvailableFonts()
{
    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const Resp = await window.__TAURI__.core.invoke("GetAvailableFonts");
            if (Resp && Resp.Success && Array.isArray(Resp.Fonts))
            {
                CachedAvailableFonts = Resp.Fonts;
            }
        }
        else
        {
            const Resp = await fetch("/api/fonts");
            const Data = await Resp.json();
            if (Data && Data.Success && Array.isArray(Data.Fonts))
            {
                CachedAvailableFonts = Data.Fonts;
            }
        }
    }
    catch (Ignored)
    {
    }
}

async function LoadWorkspaceInfo()
{
    try
    {
        let Data;
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            Data = await window.__TAURI__.core.invoke("GetWorkspaceInfo");
        }
        else
        {
            const Response = await AuthenticatedFetch("/api/workspace/info");
            Data = await Response.json();
        }

        if (Data && Data.Success)
        {
            WorkspaceDirectories = Data.Directories || [];
            WorkspaceFiles = Data.Files || [];
            if (!CurrentFilePath && WorkspaceFiles.length > 0)
            {
                CurrentFilePath = WorkspaceFiles[0].Path;
                const TitleInput = document.getElementById("DocumentTitleInput");
                if (TitleInput)
                {
                    TitleInput.value = WorkspaceFiles[0].Name.split(/[\\/]/).pop();
                }
            }
            RenderDocDropdownList();
            RenderDashboard();
        }
    }
    catch (Err)
    {
        console.error("Workspace info error:", Err);
    }
}

function ToggleDocDropdown()
{
    IsDropdownOpen = ! IsDropdownOpen;
    const DropdownMenu = document.getElementById("DocDropdownMenu");
    if (!DropdownMenu)
    {
        return ;
    }
    if (IsDropdownOpen)
    {
        DropdownMenu.style.display = "flex";
        const SearchEl = document.getElementById("DocDropdownSearch");
        if (SearchEl)
        {
            SearchEl.focus();
        }
    }
    else
    {
        DropdownMenu.style.display = "none";
    }
}

function CloseDocDropdown()
{
    IsDropdownOpen = false;
    const DropdownMenu = document.getElementById("DocDropdownMenu");
    if (DropdownMenu)
    {
        DropdownMenu.style.display = "none";
    }
}

function RenderDocDropdownList(FilterQuery = "")
{
    const ListContainer = document.getElementById("DropdownFileList");
    const CountBadge = document.getElementById("DocDropdownCount");
    if (!ListContainer)
    {
        return ;
    }

    const Query = FilterQuery.toLowerCase().trim();
    const FilteredFiles = WorkspaceFiles.filter
    (
        (F) =>
        {
            return F.Name.toLowerCase().includes(Query) || F.Path.toLowerCase().includes(Query);
        }
    );

    if (CountBadge)
    {
        CountBadge.textContent = WorkspaceFiles.length;
    }

    if (FilteredFiles.length === 0)
    {
        ListContainer.innerHTML = `<div Class = "DocDropdownEmpty">No matching .typ files</div>`;
        return ;
    }

    let Html = "";
    for (const File of FilteredFiles)
    {
        const IsActive = CurrentFilePath && (File.Path.toLowerCase() === CurrentFilePath.toLowerCase());
        const ActiveClass = IsActive ? "Active": "";
        const SafeParam = encodeURIComponent(File.Path);

        Html += `
            <div Class = "DocDropdownItem ${ActiveClass}" data-action = "open-workspace-file" data-file-path = "${EscapeHtml(File.Path)}">
                <div Class = "DocDropdownItemIcon">
                    <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                        <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline Points = "14 2 14 8 20 8" />
                    </svg>
                </div>
                <div Class = "DocDropdownItemInfo">
                    <div Class = "DocDropdownItemName">${EscapeHtml(File.Name)}</div>
                    <div Class = "DocDropdownItemPath">${EscapeHtml(File.Directory)}</div>
                </div>
                <div Class = "DocDropdownItemSize">${FormatFileSize(File.Size)}</div>
            </div>
        `;
    }
    ListContainer.innerHTML = Html;
}

async function OpenFileFromWorkspace(FilePath)
{
    if (!FilePath)
    {
        return ;
    }

    try
    {
        let Content;
        let ErrorMessage = null;

        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            try
            {
                Content = await window.__TAURI__.core.invoke("ReadWorkspaceFile", { pathStr: FilePath, PathStr: FilePath });
            }
            catch (TauriErr)
            {
                ErrorMessage = String(TauriErr);
            }
        }

        if (Content === undefined)
        {
            try
            {
                const Response = await AuthenticatedFetch(`/api/workspace/file?path=${encodeURIComponent(FilePath)}`);
                const ResData = await Response.json();
                if (ResData && ResData.Success)
                {
                    Content = ResData.Content;
                }
                else if (!ErrorMessage)
                {
                    ErrorMessage = ResData ? ResData.Message: "Could not read file from server";
                }
            }
            catch (FetchErr)
            {
                if (!ErrorMessage)
                {
                    ErrorMessage = FetchErr.message || String(FetchErr);
                }
            }
        }

        if (Content !== undefined)
        {
            CurrentFilePath = FilePath;
            ActiveDocumentCanonicalPath = FilePath;
            LastCompiledPages = [];
            LastCompiledDocumentPath = "";
            const PagesContainer = document.getElementById("PagesContainer");
            if (PagesContainer)
            {
                PagesContainer.innerHTML = "";
            }
            ClearSyncHighlights();
            if (MonacoInstance && window.monaco && window.monaco.editor)
            {
                const Model = MonacoInstance.getModel();
                if (Model)
                {
                    window.monaco.editor.setModelMarkers(Model, "typst-compiler", []);
                }
            }
            const FileName = FilePath.split(/[\\/]/).pop();
            const TitleInput = document.getElementById("DocumentTitleInput");
            if (TitleInput)
            {
                TitleInput.value = FileName;
            }
            const ActiveDocStat = document.getElementById("StatActiveDoc");
            if (ActiveDocStat)
            {
                ActiveDocStat.textContent = FileName;
            }

            if (MonacoInstance)
            {
                MonacoInstance.setValue(Content);
                MarkDocumentClean(Content);
            }
            else
            {
                PendingInitialFileContent = { Path: FilePath, Content: Content };
            }

            ShowToast(`Loaded ${FileName}`, "info");
            CloseDocDropdown();
            TrackRecentDocument(FilePath, FileName);
            SwitchView("editor");
            TriggerCompileNow();
            RenderDocDropdownList();
            RenderDashboard();

            if (typeof OpenDocumentInTab === "function")
            {
                const ExistingTab = OpenTabs.find( (T) => T.Path.toLowerCase() === FilePath.toLowerCase());
                if (!ExistingTab)
                {
                    OpenTabs.push
                    ({
                        Path: FilePath,
                        Name: FileName,
                        Dirty: false
                    });
                    try
                    {
                        localStorage.setItem("TypstStudio_OpenTabs", JSON.stringify(OpenTabs));
                    }
                    catch (Ignored)
                    {
                    }
                }
                ActiveTabPath = FilePath;
                try
                {
                    localStorage.setItem("TypstStudio_ActiveTab", FilePath);
                }
                catch (Ignored)
                {
                }
                RenderEditorTabs();
                HighlightActiveTreeFile(FilePath);
            }
        }
        else
        {
            ShowToast("Could not load file: " + (ErrorMessage || "File not found"), "error");
            const Splash = document.getElementById("LoadingSplash");
            if (Splash)
            {
                Splash.remove();
            }
        }
    }
    catch (Err)
    {
        console.error("Open file error:", Err);
        ShowToast("Failed to read file from disk: " + (Err.message || Err), "error");
        const Splash = document.getElementById("LoadingSplash");
        if (Splash)
        {
            Splash.remove();
        }
    }
}

async function SaveCurrentFile()
{
    if (!MonacoInstance)
    {
        return ;
    }

    // Silently run the formatter when K&R slop is detected on Ctrl+S / Save
    const ActiveFileName = CurrentFilePath ? CurrentFilePath.split(/[\/\\]/).pop(): "main.typ";
    const KnrCheck = DetectKnrSlop(MonacoInstance.getValue(), ActiveFileName);
    if (KnrCheck.HasError)
    {
        await ApplyFormattingToEditor();
    }

    const Content = MonacoInstance.getValue();
    let TargetPath = CurrentFilePath;

    if (!TargetPath)
    {
        const DocName = GetCurrentDocumentTitle();
        const CleanDocName = DocName.endsWith(".typ") ? DocName: `${DocName}.typ`;
        const DefaultDir = WorkspaceDirectories[0] || "";
        if (DefaultDir)
        {
            const Separator = DefaultDir.includes("/") ? "/": "\\";
            TargetPath = `${DefaultDir}${Separator}${CleanDocName}`;
        }
        else
        {
            TargetPath = CleanDocName;
        }
        CurrentFilePath = TargetPath;
    }

    const SaveBtn = document.getElementById("SaveFileButton");
    const Label = document.getElementById("SaveButtonLabel");

    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            await window.__TAURI__.core.invoke("SaveWorkspaceFile", { pathStr: TargetPath, PathStr: TargetPath, content: Content, Content: Content });
            MarkDocumentClean(Content);
            TrackRecentDocument(TargetPath, TargetPath.split(/[\/\\]/).pop());
            ShowToast("Saved to disk", "success");
            if (SaveBtn && Label)
            {
                SaveBtn.classList.add("SavedSuccess");
                Label.textContent = "Saved!";
                setTimeout
                (
                    () =>
                    {
                        SaveBtn.classList.remove("SavedSuccess");
                        Label.textContent = "Save";
                    },
                    1500
                );
            }
            LoadWorkspaceInfo();
            return ;
        }

        const Response = await AuthenticatedFetch
        (
            "/api/workspace/file",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { Path: TargetPath, Content: Content })
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
            TrackRecentDocument(TargetPath, TargetPath.split(/[\/\\]/).pop());
            if (SaveBtn && Label)
            {
                SaveBtn.classList.add("SavedSuccess");
                Label.textContent = "Saved!";
                setTimeout
                (
                    () =>
                    {
                        SaveBtn.classList.remove("SavedSuccess");
                        Label.textContent = "Save";
                    },
                    1500
                );
            }
            LoadWorkspaceInfo();
        }
        else
        {
            ShowToast("Save failed: " + (Data ? Data.Message: "Unknown error"), "error");
        }
    }
    catch (Err)
    {
        console.error("Save error:", Err);
        ShowToast("Network error while saving file", "error");
    }
}

async function CreateNewWorkspaceFile()
{
    let TargetDir = ActiveSelectedDirectory;
    if (!TargetDir && CurrentFilePath)
    {
        const LastSep = Math.max(CurrentFilePath.lastIndexOf("/"), CurrentFilePath.lastIndexOf("\\"));
        if (LastSep > 0)
        {
            TargetDir = CurrentFilePath.substring(0, LastSep);
        }
    }
    if (!TargetDir)
    {
        TargetDir = WorkspaceDirectories[0] || "";
    }

    ShowNewDocumentModal(TargetDir);
}

async function AddWorkspaceDirectory()
{
    const Input = document.getElementById("NewDirectoryInput");
    const DirPath = Input.value.trim();
    if (!DirPath)
    {
        return ;
    }

    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            await window.__TAURI__.core.invoke("AddWorkspaceDirectory", { pathStr: DirPath, PathStr: DirPath });
            Input.value = "";
            await LoadWorkspaceInfo();
            return ;
        }

        const Response = await AuthenticatedFetch
        (
            "/api/workspace/directory",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { Path: DirPath })
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
            TrackRecentDocument(TargetPath, TargetPath.split(/[\/\\]/).pop());
            Input.value = "";
            await LoadWorkspaceInfo();
        }
        else
        {
            ShowToast("Failed to add directory: " + (Data ? Data.Message: "Directory not found or inaccessible"), "error");
        }
    }
    catch (Err)
    {
        console.error("Add directory error:", Err);
    }
}

async function RemoveWorkspaceDirectory(DirPath)
{
    if (!confirm(`Remove directory from added workspace projects?\n\n${DirPath}`))
    {
        return ;
    }

    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            await window.__TAURI__.core.invoke("RemoveWorkspaceDirectory", { pathStr: DirPath, PathStr: DirPath });
            await LoadWorkspaceInfo();
            return ;
        }

        const Response = await AuthenticatedFetch
        (
            "/api/workspace/directory",
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { Path: DirPath })
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
            TrackRecentDocument(TargetPath, TargetPath.split(/[\/\\]/).pop());
            await LoadWorkspaceInfo();
        }
        else
        {
            ShowToast("Failed to remove directory: " + (Data ? Data.Message: "Error"), "error");
        }
    }
    catch (Err)
    {
        console.error("Remove directory error:", Err);
    }
}

function RemoveRecentDocument(FilePath)
{
    if (!FilePath) { return ; }
    try
    {
        let Recent = JSON.parse(localStorage.getItem("TypstStudio_RecentDocuments") || "[]");
        const Norm = FilePath.toLowerCase();
        Recent = Recent.filter((R) => R && R.Path && R.Path.toLowerCase() !== Norm);
        localStorage.setItem("TypstStudio_RecentDocuments", JSON.stringify(Recent));
    }
    catch (Ignored) {}
}

async function DeleteWorkspaceFile(FilePath, FileName)
{
    const CleanName = FileName || (FilePath ? FilePath.split(/[\\/]/).pop() : "document");
    if (!confirm(`Are you sure you want to permanently delete:\n\n${CleanName}\n(${FilePath})`))
    {
        return ;
    }

    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            await window.__TAURI__.core.invoke("DeleteWorkspaceFile", { pathStr: FilePath, PathStr: FilePath });
        }
        else
        {
            const Response = await AuthenticatedFetch
            (
                `/api/workspace/file?path=${encodeURIComponent(FilePath)}`,
                {
                    method: "DELETE"
                }
            );
            const Data = await Response.json();
            if (!Data || !Data.Success)
            {
                ShowToast("Delete failed: " + (Data ? Data.Message: "Error"), "error");
                return ;
            }
        }

        RemoveRecentDocument(FilePath);

        // Close tab if open
        if (Array.isArray(OpenTabs))
        {
            const TabIdx = OpenTabs.findIndex((T) => T && T.Path && T.Path.toLowerCase() === FilePath.toLowerCase());
            if (TabIdx !== -1)
            {
                CloseTab(TabIdx);
            }
        }

        await LoadWorkspaceInfo();
        if (typeof RenderHomepage === "function")
        {
            RenderHomepage();
        }

        if (CurrentFilePath && CurrentFilePath.toLowerCase() === FilePath.toLowerCase())
        {
            if (WorkspaceFiles.length > 0)
            {
                OpenFileFromWorkspace(WorkspaceFiles[0].Path);
            }
        }

        ShowToast(`Deleted ${CleanName}`, "info");
    }
    catch (Err)
    {
        console.error("Delete file error:", Err);
        ShowToast("Delete failed: " + Err.message, "error");
    }
}

async function RenameWorkspaceDocument(FilePath, CurrentName)
{
    const CleanName = (CurrentName || FilePath.split(/[\\/]/).pop()).replace(/\.typ$/i, "");
    const NewBase = prompt("Enter new document name:", CleanName);
    if (!NewBase || !NewBase.trim() || NewBase.trim() === CleanName)
    {
        return ;
    }
    const ValidatedNewName = NewBase.trim().endsWith(".typ") ? NewBase.trim() : `${NewBase.trim()}.typ`;

    try
    {
        let NewPath = "";
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            NewPath = await window.__TAURI__.core.invoke("RenameWorkspaceFile", { oldPathStr: FilePath, newNameStr: ValidatedNewName, OldPathStr: FilePath, NewNameStr: ValidatedNewName });
        }
        else
        {
            const Resp = await AuthenticatedFetch
            (
                "/api/workspace/rename",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ oldPath: FilePath, newName: ValidatedNewName })
                }
            );
            const Data = await Resp.json();
            if (Data && Data.Success)
            {
                NewPath = Data.NewPath;
            }
            else
            {
                ShowToast("Rename failed: " + (Data ? Data.Message : "Error"), "error");
                return ;
            }
        }

        if (NewPath)
        {
            // Update open tabs if this file is open
            if (Array.isArray(OpenTabs))
            {
                const Tab = OpenTabs.find((T) => T && T.Path && T.Path.toLowerCase() === FilePath.toLowerCase());
                if (Tab)
                {
                    Tab.Path = NewPath;
                    Tab.Name = ValidatedNewName;
                    RenderEditorTabs();
                }
            }

            if (CurrentFilePath && CurrentFilePath.toLowerCase() === FilePath.toLowerCase())
            {
                CurrentFilePath = NewPath;
                ActiveDocumentCanonicalPath = NewPath;
            }

            RemoveRecentDocument(FilePath);
            TrackRecentDocument(NewPath, ValidatedNewName);
            await LoadWorkspaceInfo();
            if (typeof RenderHomepage === "function")
            {
                RenderHomepage();
            }
            ShowToast(`Renamed to ${ValidatedNewName}`, "success");
        }
    }
    catch (Err)
    {
        console.error("Rename document error:", Err);
        ShowToast("Rename failed: " + Err.message, "error");
    }
}

// --- EXPLORER SIDEBAR & EDITOR TABS ARCHITECTURE ---

let OpenTabs = [];
let ActiveTabPath = "";
let ExplorerCurrentRoot = "";
let ExplorerIsStandalone = false;
const ExplorerExpandedFolders = new Set();
let ExplorerTreeCache = new Map();
const CollapsedProjectBoxes = new Set();
try
{
    const SavedCollapsed = JSON.parse(localStorage.getItem("TypstStudio_CollapsedProjects") || "[]");
    if (Array.isArray(SavedCollapsed))
    {
        for (const P of SavedCollapsed)
        {
            CollapsedProjectBoxes.add(P);
        }
    }
}
catch (Ignored)
{
}

const CollapsedSubfolders = new Set();
try
{
    const SavedSubCollapsed = JSON.parse(localStorage.getItem("TypstStudio_CollapsedSubfolders") || "[]");
    if (Array.isArray(SavedSubCollapsed))
    {
        for (const S of SavedSubCollapsed)
        {
            CollapsedSubfolders.add(S);
        }
    }
}
catch (Ignored)
{
}

function GetFileIconSvg(FileName)
{
    const Lower = (FileName || "").toLowerCase();
    if (Lower.endsWith(".typ"))
    {
        return `<svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#A855F7" Stroke-Width = "2">
            <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline Points = "14 2 14 8 20 8" />
            <line X1 = "16" Y1 = "13" X2 = "8" Y2 = "13" />
            <line X1 = "16" Y1 = "17" X2 = "8" Y2 = "17" />
        </svg>`;
    }
    if (Lower.endsWith(".pdf"))
    {
        return `<svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#EF4444" Stroke-Width = "2">
            <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline Points = "14 2 14 8 20 8" />
            <path D = "M9 15h6" />
        </svg>`;
    }
    if (Lower.endsWith(".png") || Lower.endsWith(".jpg") || Lower.endsWith(".jpeg") || Lower.endsWith(".svg") || Lower.endsWith(".webp"))
    {
        return `<svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#C084FC" Stroke-Width = "2">
            <rect X = "3" Y = "3" Width = "18" Height = "18" Rx = "2" Ry = "2" />
            <circle Cx = "8.5" Cy = "8.5" R = "1.5" />
            <polyline Points = "21 15 16 10 5 21" />
        </svg>`;
    }
    if (Lower.endsWith(".js") || Lower.endsWith(".ts"))
    {
        return `<svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#FBBF24" Stroke-Width = "2">
            <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline Points = "14 2 14 8 20 8" />
        </svg>`;
    }
    if (Lower.endsWith(".html") || Lower.endsWith(".css"))
    {
        return `<svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#FB923C" Stroke-Width = "2">
            <polyline Points = "16 18 22 12 16 6" />
            <polyline Points = "8 6 2 12 8 18" />
        </svg>`;
    }
    return `<svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#9CA3AF" Stroke-Width = "2">
        <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline Points = "14 2 14 8 20 8" />
    </svg>`;
}

async function ListFilesForTree(DirPath)
{
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        try
        {
            const Results = await window.__TAURI__.core.invoke("ListWorkspaceFiles", { dirPath: DirPath, DirPath: DirPath });
            return Results || [];
        }
        catch (Err)
        {
            console.warn("Failed to list files via Tauri:", Err);
            return [];
        }
    }
    else
    {
        try
        {
            const Token = await EnsureSessionAuthToken();
            const Res = await AuthenticatedFetch(`/api/workspace/list?dir=${encodeURIComponent(DirPath || "")}`);
            const Data = await Res.json();
            return Data.Files || [];
        }
        catch (Err)
        {
            console.warn("Failed to list files via HTTP:", Err);
            return [];
        }
    }
}

async function InitEditorTabs()
{
    try
    {
        const Saved = localStorage.getItem("TypstStudio_OpenTabs");
        if (Saved)
        {
            OpenTabs = JSON.parse(Saved) || [];
        }
    }
    catch (Ignored)
    {
        OpenTabs = [];
    }

    if (!Array.isArray(OpenTabs))
    {
        OpenTabs = [];
    }

    const SavedActive = localStorage.getItem("TypstStudio_ActiveTab");
    let TargetPath = null;
    if (SavedActive && OpenTabs.some( (T) => T.Path.toLowerCase() === SavedActive.toLowerCase()))
    {
        TargetPath = SavedActive;
    }
    else if (OpenTabs.length > 0)
    {
        TargetPath = OpenTabs[0].Path;
    }
    else if (CurrentFilePath)
    {
        TargetPath = CurrentFilePath;
    }
    else if (WorkspaceFiles.length > 0)
    {
        TargetPath = WorkspaceFiles[0].Path;
    }

    if (TargetPath)
    {
        ActiveTabPath = TargetPath;
        if (!OpenTabs.some( (T) => T.Path.toLowerCase() === TargetPath.toLowerCase()))
        {
            OpenTabs.push
            ({
                Path: TargetPath,
                Name: TargetPath.split(/[\\/]/).pop(),
                Dirty: false
            });
        }
        RenderEditorTabs();
        await OpenFileFromWorkspace(TargetPath);
    }
    else
    {
        RenderEditorTabs();
        TriggerCompileNow();
    }

    const NewBtn = document.getElementById("TabsNewFileBtn");
    if (NewBtn)
    {
        NewBtn.onclick = () => { CreateNewWorkspaceFile(); };
    }
    const CloseAllBtn = document.getElementById("TabsCloseAllBtn");
    if (CloseAllBtn)
    {
        CloseAllBtn.onclick = () => { CloseAllTabs(); };
    }
}

function RenderEditorTabs()
{
    const ListEl = document.getElementById("EditorTabsList");
    if (!ListEl)
    {
        return ;
    }

    if (OpenTabs.length === 0)
    {
        ListEl.innerHTML = `<span style = "color: #71717A; font-size: 11.5px; padding: 0 10px; display: inline-flex; align-items: center;">No open documents</span>`;
        return ;
    }

    let Html = "";
    for (const Tab of OpenTabs)
    {
        const IsActive = Tab.Path && (Tab.Path.toLowerCase() === (ActiveTabPath || "").toLowerCase());
        const ActiveClass = IsActive ? "Active": "";
        const SafeTabPathParam = encodeURIComponent(Tab.Path);

        Html += `
            <div Class = "EditorTab ${ActiveClass}" data-action = "switch-tab" data-tab-path = "${EscapeHtml(Tab.Path)}" Title = "${EscapeHtml(Tab.Path)}">
                <span Class = "TabIcon">${GetFileIconSvg(Tab.Name)}</span>
                <span Class = "TabTitle">${EscapeHtml(Tab.Name)}</span>
                <span Class = "TabDirtyDot ${Tab.Dirty ? "Visible" : ""}" Title = "Unsaved changes"></span>
                <button Type = "button" Class = "TabCloseBtn" Title = "Close (Ctrl+W)" data-action = "close-tab" data-tab-path = "${EscapeHtml(Tab.Path)}">×</button>
            </div>
        `;
    }

    ListEl.innerHTML = Html;
}

function OpenDocumentInTab(FilePath, FileName = null)
{
    if (!FilePath)
    {
        return ;
    }

    const Normalized = FilePath.trim();
    const Name = FileName || Normalized.split(/[\\/]/).pop();
    const CleanPath = Normalized.replace(/\\/g, "/");
    const BaseFileName = CleanPath.split("/").pop().toLowerCase();

    const Existing = OpenTabs.find
    (
        (T) =>
        {
            const TClean = (T.Path || "").trim().replace(/\\/g, "/");
            return TClean.toLowerCase() === CleanPath.toLowerCase() ||
                   (TClean.split("/").pop().toLowerCase() === BaseFileName &&
                    (TClean.endsWith("/" + CleanPath) || CleanPath.endsWith("/" + TClean)));
        }
    );

    if (!Existing)
    {
        OpenTabs.push
        ({
            Path: Normalized,
            Name: Name,
            Dirty: false
        });
        try
        {
            localStorage.setItem("TypstStudio_OpenTabs", JSON.stringify(OpenTabs));
        }
        catch (Ignored)
        {
        }
        SwitchToTab(Normalized);
    }
    else
    {
        SwitchToTab(Existing.Path);
    }
}

function SwitchToTab(FilePath)
{
    if (!FilePath)
    {
        return ;
    }

    const PreviousPath = CurrentFilePath;
    const Normalized = FilePath.trim();
    ActiveTabPath = Normalized;
    ActiveDocumentCanonicalPath = Normalized;
    CurrentFilePath = Normalized;
    ActiveCompileGeneration ++;
    CompileGeneration ++;
    RenderToken ++;

    localStorage.setItem("TypstStudio_ActiveTab", Normalized);
    RenderEditorTabs();
    HighlightActiveTreeFile(Normalized);

    const CurrentContent = MonacoInstance ? MonacoInstance.getValue(): "";
    if (PreviousPath && PreviousPath.toLowerCase() === Normalized.toLowerCase() && CurrentContent.length > 0)
    {
        SwitchView("editor");
        return ;
    }

    // Teardown stale document preview state to prevent cross-document contamination
    const PagesContainer = document.getElementById("PagesContainer");
    if (PagesContainer)
    {
        PagesContainer.innerHTML = "";
    }
    LastCompiledPages = [];
    LastCompiledDocumentPath = "";
    ActiveSyncMap = [];
    ActiveSpanMap = {};
    ActiveSyncMapByLine = new Map();
    MonotonicSyncAnchors = [];
    ClearSyncHighlights();
    if (MonacoInstance && window.monaco && window.monaco.editor)
    {
        const Model = MonacoInstance.getModel();
        if (Model)
        {
            window.monaco.editor.setModelMarkers(Model, "typst-compiler", []);
        }
    }

    SwitchView("editor");
    OpenFileFromWorkspace(Normalized);
}

function CloseTab(FilePath)
{
    const Index = OpenTabs.findIndex( (T) => T.Path.toLowerCase() === FilePath.toLowerCase());
    if (Index === - 1)
    {
        return ;
    }

    const WasActive = ActiveTabPath && (ActiveTabPath.toLowerCase() === FilePath.toLowerCase());
    OpenTabs.splice(Index, 1);
    try
    {
        localStorage.setItem("TypstStudio_OpenTabs", JSON.stringify(OpenTabs));
    }
    catch (Ignored)
    {
    }

    if (OpenTabs.length === 0)
    {
        ActiveTabPath = "";
        CurrentFilePath = "";
        RenderEditorTabs();
        HighlightActiveTreeFile("");
        if (MonacoInstance)
        {
            MonacoInstance.setValue("// Start a new Typst document\n#set page(paper: \"a4\")\n#set text(font: (\"Times New Roman\", \"XITS Math\"), size: 11pt)\n\n= Welcome to Typst Studio\n");
            TriggerCompileNow();
        }
        return ;
    }

    if (WasActive)
    {
        const NewIndex = Math.max(0, Index - 1);
        SwitchToTab(OpenTabs[NewIndex].Path);
    }
    else
    {
        RenderEditorTabs();
    }
}

function CloseAllTabs()
{
    OpenTabs = [];
    ActiveTabPath = "";
    CurrentFilePath = "";
    try
    {
        localStorage.removeItem("TypstStudio_OpenTabs");
        localStorage.removeItem("TypstStudio_ActiveTab");
    }
    catch (Ignored)
    {
    }
    RenderEditorTabs();
    HighlightActiveTreeFile("");
}

function SetTabDirty(FilePath, IsDirty)
{
    if (!FilePath)
    {
        return ;
    }
    const Tab = OpenTabs.find( (T) => T.Path.toLowerCase() === FilePath.toLowerCase());
    if (Tab && Tab.Dirty !== IsDirty)
    {
        Tab.Dirty = IsDirty;
        RenderEditorTabs();
    }
}

function AnimateMonacoLayout(DurationMs = 260)
{
    if (!MonacoInstance)
    {
        return ;
    }

    const StartTime = performance.now();
    function Step()
    {
        if (MonacoInstance)
        {
            MonacoInstance.layout();
        }
        if (performance.now() - StartTime < DurationMs)
        {
            requestAnimationFrame(Step);
        }
        else if (MonacoInstance)
        {
            MonacoInstance.layout();
        }
    }
    requestAnimationFrame(Step);
}

function ToggleExplorerSidebar(ForceState = null)
{
    const Sidebar = document.getElementById("ExplorerSidebar");
    const Btn = document.getElementById("ToggleExplorerBtn");
    const TabsBtn = document.getElementById("TabsToggleExplorerBtn");
    if (!Sidebar)
    {
        return ;
    }

    const ShouldCollapse = (ForceState !== null) ? ! ForceState: ! Sidebar.classList.contains("Collapsed");
    if (ShouldCollapse)
    {
        Sidebar.classList.add("Collapsed");
        if (Btn)
        {
            Btn.classList.remove("Active");
        }
        if (TabsBtn)
        {
            TabsBtn.classList.remove("Active");
        }
        localStorage.setItem("TypstStudio_ExplorerVisible", "false");
    }
    else
    {
        Sidebar.classList.remove("Collapsed");
        if (Btn)
        {
            Btn.classList.add("Active");
        }
        if (TabsBtn)
        {
            TabsBtn.classList.add("Active");
        }
        localStorage.setItem("TypstStudio_ExplorerVisible", "true");
        RenderExplorerTree();
    }

    AnimateMonacoLayout(260);
}

async function InitExplorer()
{
    const Sidebar = document.getElementById("ExplorerSidebar");
    if (Sidebar)
    {
        Sidebar.addEventListener
        (
            "transitionend", (E) =>
            {
                if (E.propertyName === "width" && MonacoInstance)
                {
                    MonacoInstance.layout();
                }
            }
        );
    }

    const RefreshBtn = document.getElementById("ExplorerRefreshBtn");
    if (RefreshBtn)
    {
        RefreshBtn.addEventListener("click", () => { ExplorerTreeCache.clear(); RenderExplorerTree(); });
    }
    const CollapseAllBtn = document.getElementById("ExplorerCollapseAllBtn");
    if (CollapseAllBtn)
    {
        CollapseAllBtn.addEventListener
        (
            "click", () =>
            {
                ExplorerExpandedFolders.clear();
                if (ExplorerCurrentRoot)
                {
                    ExplorerExpandedFolders.add(ExplorerCurrentRoot);
                }
                RenderExplorerTree();
            }
        );
    }
    const NewFileBtn = document.getElementById("ExplorerNewFileBtn");
    if (NewFileBtn)
    {
        NewFileBtn.addEventListener("click", () => { CreateNewWorkspaceFile(); });
    }

    // Sidebar Resizing Support
    const SavedWidth = localStorage.getItem("TypstStudio_ExplorerWidth");
    if (SavedWidth)
    {
        const W = parseInt(SavedWidth, 10);
        if (!isNaN(W) && W >= 160 && W <= 600)
        {
            const Sidebar = document.getElementById("ExplorerSidebar");
            if (Sidebar)
            {
                Sidebar.style.width = `${W}px`;
            }
        }
    }

    const ResizeHandle = document.getElementById("SidebarResizeHandle");
    if (ResizeHandle)
    {
        let IsDragging = false;
        let StartX = 0;
        let StartWidth = 250;

        ResizeHandle.onmousedown = (E) =>
        {
            E.preventDefault();
            IsDragging = true;
            StartX = E.clientX;
            const Sidebar = document.getElementById("ExplorerSidebar");
            if (Sidebar)
            {
                Sidebar.classList.add("Resizing");
            }
            StartWidth = Sidebar ? Sidebar.getBoundingClientRect().width: 250;
            ResizeHandle.classList.add("Dragging");
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
        };

        window.addEventListener
        (
            "mousemove",
            (E) =>
            {
                if (!IsDragging)
                {
                    return ;
                }
                const Delta = E.clientX - StartX;
                const NewWidth = Math.min(600, Math.max(160, StartWidth + Delta));
                const Sidebar = document.getElementById("ExplorerSidebar");
                if (Sidebar)
                {
                    Sidebar.style.width = `${NewWidth}px`;
                }
            }
        );

        window.addEventListener
        (
            "mouseup",
            () =>
            {
                if (IsDragging)
                {
                    IsDragging = false;
                    ResizeHandle.classList.remove("Dragging");
                    document.body.style.cursor = "";
                    document.body.style.userSelect = "";
                    const Sidebar = document.getElementById("ExplorerSidebar");
                    if (Sidebar)
                    {
                        Sidebar.classList.remove("Resizing");
                        const FinalWidth = Math.round(Sidebar.getBoundingClientRect().width);
                        localStorage.setItem("TypstStudio_ExplorerWidth", String(FinalWidth));
                    }
                    if (MonacoInstance)
                    {
                        MonacoInstance.layout();
                    }
                }
            }
        );

        ResizeHandle.ondblclick = () =>
        {
            const Sidebar = document.getElementById("ExplorerSidebar");
            if (Sidebar)
            {
                Sidebar.style.width = "250px";
                localStorage.setItem("TypstStudio_ExplorerWidth", "250");
                if (MonacoInstance)
                {
                    MonacoInstance.layout();
                }
            }
        };
    }

    const SavedVisible = localStorage.getItem("TypstStudio_ExplorerVisible");
    if (SavedVisible === "false")
    {
        ToggleExplorerSidebar(false);
    }
    else
    {
        await RenderExplorerTree();
    }
}

function SwitchExplorerRootPrompt()
{
    const Projects = GroupWorkspaceIntoProjects();
    if (Projects.length <= 1 && ! WorkspaceDirectories.includes("e:\\Typst"))
    {
        ExplorerTreeCache.clear();
        RenderExplorerTree();
        return ;
    }

    if (ExplorerCurrentRoot && ExplorerCurrentRoot.toLowerCase().includes("projects") && WorkspaceDirectories.length > 0)
    {
        ExplorerCurrentRoot = "e:\\Typst";
    }
    else if (Projects.length > 0)
    {
        ExplorerCurrentRoot = Projects[0].Path;
    }
    ExplorerTreeCache.clear();
    RenderExplorerTree();
}

async function RenderExplorerTree()
{
    const RootEl = document.getElementById("ExplorerTreeRoot");
    const NameEl = document.getElementById("ExplorerProjectName");
    if (!RootEl)
    {
        return ;
    }

    if (ExplorerIsStandalone || (ExplorerCurrentRoot && ExplorerCurrentRoot.toLowerCase().endsWith(".typ")))
    {
        const FileName = ExplorerCurrentRoot.split(/[\\/]/).filter(Boolean).pop() || ExplorerCurrentRoot;
        if (NameEl)
        {
            NameEl.textContent = `[Standalone] ${FileName}`;
            NameEl.title = ExplorerCurrentRoot;
        }

        RootEl.innerHTML = "";
        const StandaloneFiles = [
            {
                name: FileName,
                path: ExplorerCurrentRoot,
                is_dir: false
            }
        ];
        await RenderTreeLevel(StandaloneFiles, RootEl, 0);
        HighlightActiveTreeFile(ActiveTabPath || CurrentFilePath || ExplorerCurrentRoot);
        return ;
    }

    if (!ExplorerCurrentRoot)
    {
        ExplorerCurrentRoot = (WorkspaceDirectories && WorkspaceDirectories[0]) ? WorkspaceDirectories[0]: "e:\\Typst";
    }

    const RootName = ExplorerCurrentRoot.split(/[\\/]/).filter(Boolean).pop() || ExplorerCurrentRoot;
    if (NameEl)
    {
        NameEl.textContent = RootName;
        NameEl.title = ExplorerCurrentRoot;
    }

    ExplorerExpandedFolders.add(ExplorerCurrentRoot);

    RootEl.innerHTML = `<div style = "padding: 8px 12px; color: #71717A; font-size: 11.5px;">Loading tree...</div>`;
    const Files = await ListFilesForTree(ExplorerCurrentRoot);
    RootEl.innerHTML = "";
    await RenderTreeLevel(Files, RootEl, 0);
    HighlightActiveTreeFile(ActiveTabPath || CurrentFilePath);
}

async function RenderTreeLevel(Files, ContainerEl, Depth = 0)
{
    if (!Files || Files.length === 0)
    {
        const EmptyEl = document.createElement("div");
        EmptyEl.style.padding = `4px 12px 4px ${16 + Depth * 14}px`;
        EmptyEl.style.color = "#71717A";
        EmptyEl.style.fontSize = "11.5px";
        EmptyEl.textContent = "(Empty folder)";
        ContainerEl.appendChild(EmptyEl);
        return ;
    }

    for (const File of Files)
    {
        const NodeEl = document.createElement("div");
        NodeEl.className = "TreeNode";

        const RowEl = document.createElement("div");
        RowEl.className = "TreeNodeRow";
        RowEl.style.paddingLeft = `${8 + Depth * 14}px`;
        RowEl.dataset.path = File.path;

        if (File.is_dir)
        {
            const IsExpanded = ExplorerExpandedFolders.has(File.path);
            const ChevronEl = document.createElement("span");
            ChevronEl.className = `TreeNodeChevron ${IsExpanded ? "Expanded" : ""}`;
            ChevronEl.textContent = "›";

            const IconEl = document.createElement("span");
            IconEl.className = "TreeNodeIcon";
            IconEl.innerHTML = IsExpanded ? `📂`: `📁`;

            const LabelEl = document.createElement("span");
            LabelEl.className = "TreeNodeLabel";
            LabelEl.textContent = File.name;
            LabelEl.title = File.path;

            RowEl.appendChild(ChevronEl);
            RowEl.appendChild(IconEl);
            RowEl.appendChild(LabelEl);
            NodeEl.appendChild(RowEl);

            const ChildrenContainer = document.createElement("div");
            ChildrenContainer.className = `TreeNodeChildren ${IsExpanded ? "" : "Collapsed"}`;
            NodeEl.appendChild(ChildrenContainer);

            if (IsExpanded)
            {
                let SubFiles = ExplorerTreeCache.get(File.path);
                if (!SubFiles)
                {
                    SubFiles = await ListFilesForTree(File.path);
                    ExplorerTreeCache.set(File.path, SubFiles);
                }
                await RenderTreeLevel(SubFiles, ChildrenContainer, Depth + 1);
            }

            RowEl.onclick = async (E) =>
            {
                E.stopPropagation();
                const NowExpanded = ! ExplorerExpandedFolders.has(File.path);
                if (NowExpanded)
                {
                    ExplorerExpandedFolders.add(File.path);
                    ChevronEl.classList.add("Expanded");
                    IconEl.innerHTML = `📂`;
                    ChildrenContainer.classList.remove("Collapsed");
                    if (ChildrenContainer.children.length === 0)
                    {
                        let Sub = ExplorerTreeCache.get(File.path);
                        if (!Sub)
                        {
                            Sub = await ListFilesForTree(File.path);
                            ExplorerTreeCache.set(File.path, Sub);
                        }
                        await RenderTreeLevel(Sub, ChildrenContainer, Depth + 1);
                    }
                }
                else
                {
                    ExplorerExpandedFolders.delete(File.path);
                    ChevronEl.classList.remove("Expanded");
                    IconEl.innerHTML = `📁`;
                    ChildrenContainer.classList.add("Collapsed");
                }
            };
        }
        else
        {
            const SpacerEl = document.createElement("span");
            SpacerEl.className = "TreeNodeChevron";
            SpacerEl.innerHTML = "";

            const IconEl = document.createElement("span");
            IconEl.className = "TreeNodeIcon";
            IconEl.innerHTML = GetFileIconSvg(File.name);

            const LabelEl = document.createElement("span");
            LabelEl.className = "TreeNodeLabel";
            LabelEl.textContent = File.name;
            LabelEl.title = `${File.name} (${FormatFileSize(File.size)})`;

            RowEl.appendChild(SpacerEl);
            RowEl.appendChild(IconEl);
            RowEl.appendChild(LabelEl);
            NodeEl.appendChild(RowEl);

            RowEl.onclick = () =>
            {
                const Ext = (File.name || "").toLowerCase().split(".").pop();
                const NonTextExtensions = ["pdf", "png", "jpg", "jpeg", "webp", "gif", "ico", "exe", "zip", "tar", "gz", "otf", "ttf", "woff", "woff2"];
                if (NonTextExtensions.includes(Ext))
                {
                    ShowToast(`Binary preview not supported for .${Ext} files`, "info", 2000);
                    return ;
                }
                OpenDocumentInTab(File.path, File.name);
            };
        }

        ContainerEl.appendChild(NodeEl);
    }
}

function HighlightActiveTreeFile(FilePath)
{
    if (!FilePath)
    {
        return ;
    }
    const Norm = FilePath.toLowerCase();
    document.querySelectorAll(".TreeNodeRow").forEach
    (
        (Row) =>
        {
            if (Row.dataset.path && Row.dataset.path.toLowerCase() === Norm)
            {
                Row.classList.add("Active");
            }
            else
            {
                Row.classList.remove("Active");
            }
        }
    );
}

function GroupWorkspaceIntoProjects()
{
    const ProjectMap = new Map();

    for (const Dir of (WorkspaceDirectories || []))
    {
        const CleanDir = Dir.replace(/[\\/]+$/, "");
        const DirName = CleanDir.split(/[\\/]/).filter(Boolean).pop() || CleanDir;
        ProjectMap.set
        (
            CleanDir,
            {
                Name: DirName,
                Path: Dir,
                Files: [],
                TotalSize: 0,
                LatestModified: 0
            }
        );
    }

    for (const File of WorkspaceFiles)
    {
        const FilePath = (File.Path || "").replace(/\\/g, "/");
        const FilePathLower = FilePath.toLowerCase();

        let BestMatchKey = null;
        let BestMatchLen = -1;

        for (const [Key, Proj] of ProjectMap.entries())
        {
            const NormProjPath = (Proj.Path || "").replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
            if (FilePathLower.startsWith(NormProjPath + "/"))
            {
                if (NormProjPath.length > BestMatchLen)
                {
                    BestMatchLen = NormProjPath.length;
                    BestMatchKey = Key;
                }
            }
        }

        let TargetProj = null;
        if (BestMatchKey)
        {
            TargetProj = ProjectMap.get(BestMatchKey);
        }
        else
        {
            const FallbackDir = (File.Directory || "Workspace").replace(/[\\/]+$/, "");
            if (!ProjectMap.has(FallbackDir))
            {
                const DirName = FallbackDir.split(/[\\/]/).filter(Boolean).pop() || FallbackDir;
                ProjectMap.set
                (
                    FallbackDir,
                    {
                        Name: DirName,
                        Path: File.Directory || FallbackDir,
                        Files: [],
                        TotalSize: 0,
                        LatestModified: 0
                    }
                );
            }
            TargetProj = ProjectMap.get(FallbackDir);
        }

        if (TargetProj)
        {
            TargetProj.Files.push(File);
            TargetProj.TotalSize += (File.Size || 0);
            if ((File.Modified || 0) > TargetProj.LatestModified)
            {
                TargetProj.LatestModified = File.Modified;
            }
        }
    }

    for (const Proj of ProjectMap.values())
    {
        Proj.Files.sort((A, B) => (B.Modified || 0) - (A.Modified || 0));
    }

    return Array.from(ProjectMap.values());
}

function OpenProjectInExplorer(ProjectPath, FileToOpen = null)
{
    const NormalizedNew = (ProjectPath || "").replace(/\\/g, "/").toLowerCase();
    const NormalizedCur = (ExplorerCurrentRoot || "").replace(/\\/g, "/").toLowerCase();
    const NeedsRootSwitch = ExplorerIsStandalone || (NormalizedNew !== NormalizedCur);

    ExplorerIsStandalone = false;
    ExplorerCurrentRoot = ProjectPath;

    if (NeedsRootSwitch)
    {
        ExplorerExpandedFolders.clear();
        ExplorerExpandedFolders.add(ProjectPath);
        ExplorerTreeCache.clear();
    }

    if (FileToOpen)
    {
        const NormProj = (ProjectPath || "").replace(/\\/g, "/").replace(/\/+$/, "");
        const NormFile = (FileToOpen || "").replace(/\\/g, "/");
        if (NormFile.toLowerCase().startsWith(NormProj.toLowerCase() + "/"))
        {
            const Rel = NormFile.substring(NormProj.length + 1);
            const Parts = Rel.split("/").filter(Boolean);
            let Acc = NormProj;
            for (let i = 0; i < Parts.length - 1; i++)
            {
                Acc += "/" + Parts[i];
                ExplorerExpandedFolders.add(Acc);
            }
        }
        const FileName = FileToOpen.split(/[\\/]/).filter(Boolean).pop() || FileToOpen;
        OpenDocumentInTab(FileToOpen, FileName);
    }
    else
    {
        const Projects = GroupWorkspaceIntoProjects();
        const NormTarget = (ProjectPath || "").replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
        const TargetProj = Projects.find((P) => (P.Path || "").replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase() === NormTarget);
        if (TargetProj && TargetProj.Files.length > 0)
        {
            OpenDocumentInTab(TargetProj.Files[0].Path, TargetProj.Files[0].Name);
        }
    }

    SwitchView("editor");
    ToggleExplorerSidebar(true);
    if (NeedsRootSwitch)
    {
        RenderExplorerTree();
    }
    else
    {
        HighlightActiveTreeFile(ActiveTabPath || CurrentFilePath);
    }
}

function OpenProjectFolderInExplorer(ProjectPath, FolderPath)
{
    const NormalizedNew = (ProjectPath || "").replace(/\\/g, "/").toLowerCase();
    const NormalizedCur = (ExplorerCurrentRoot || "").replace(/\\/g, "/").toLowerCase();
    const NeedsRootSwitch = ExplorerIsStandalone || (NormalizedNew !== NormalizedCur);

    ExplorerIsStandalone = false;
    ExplorerCurrentRoot = ProjectPath;

    if (NeedsRootSwitch)
    {
        ExplorerExpandedFolders.clear();
        ExplorerExpandedFolders.add(ProjectPath);
        ExplorerTreeCache.clear();
    }

    if (FolderPath)
    {
        const NormProj = (ProjectPath || "").replace(/\\/g, "/").replace(/\/+$/, "");
        const NormFolder = (FolderPath || "").replace(/\\/g, "/").replace(/\/+$/, "");
        if (NormFolder.toLowerCase().startsWith(NormProj.toLowerCase() + "/"))
        {
            const Rel = NormFolder.substring(NormProj.length + 1);
            const Parts = Rel.split("/").filter(Boolean);
            let Acc = NormProj;
            for (const Part of Parts)
            {
                Acc += "/" + Part;
                ExplorerExpandedFolders.add(Acc);
            }
        }
        else
        {
            ExplorerExpandedFolders.add(FolderPath);
        }

        const NormalizedTarget = FolderPath.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
        const MatchingDoc = WorkspaceFiles.find
        (
            (F) =>
            {
                const FDir = (F.Directory || "").replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
                return FDir === NormalizedTarget;
            }
        );
        if (MatchingDoc)
        {
            OpenDocumentInTab(MatchingDoc.Path, MatchingDoc.Name);
        }
    }

    SwitchView("editor");
    ToggleExplorerSidebar(true);
    if (NeedsRootSwitch)
    {
        RenderExplorerTree();
    }
    else
    {
        HighlightActiveTreeFile(ActiveTabPath || CurrentFilePath);
    }
}

function OpenStandaloneDocument(FilePath, FileName = null)
{
    if (!FilePath)
    {
        return ;
    }
    ExplorerIsStandalone = true;
    ExplorerCurrentRoot = FilePath;
    ExplorerExpandedFolders.clear();
    ExplorerTreeCache.clear();

    const Name = FileName || FilePath.split(/[\\/]/).filter(Boolean).pop() || FilePath;
    TrackStandaloneDocument(FilePath);
    OpenDocumentInTab(FilePath, Name);

    SwitchView("editor");
    ToggleExplorerSidebar(true);
    RenderExplorerTree();
}

function TrackStandaloneDocument(FilePath)
{
    try
    {
        const Raw = localStorage.getItem("TypstStudio_StandaloneProjects");
        let List = Raw ? JSON.parse(Raw) : [];
        if (!Array.isArray(List))
        {
            List = [];
        }
        const Norm = FilePath.replace(/\\/g, "/").toLowerCase();
        List = List.filter((Item) => (typeof Item === "string" ? Item : Item.Path).replace(/\\/g, "/").toLowerCase() !== Norm);
        List.unshift
        (
            {
                Path: FilePath,
                Name: FilePath.split(/[\\/]/).filter(Boolean).pop() || FilePath,
                LastOpened: Date.now()
            }
        );
        if (List.length > 50)
        {
            List = List.slice(0, 50);
        }
        localStorage.setItem("TypstStudio_StandaloneProjects", JSON.stringify(List));
    }
    catch (Err)
    {
        console.warn("Failed to save standalone document:", Err);
    }
}

async function PickStandaloneFileFromDisk()
{
    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const Selected = await window.__TAURI__.core.invoke
            (
                "PickFile",
                {
                    extensions: ["typ"],
                    Extensions: ["typ"]
                }
            );
            if (Selected)
            {
                OpenStandaloneDocument(Selected);
            }
        }
        else
        {
            const Prompted = prompt("Enter full path to standalone .typ file:", "E:\\Typst\\document.typ");
            if (Prompted && Prompted.trim())
            {
                OpenStandaloneDocument(Prompted.trim());
            }
        }
    }
    catch (Err)
    {
        console.error("Failed to pick standalone file:", Err);
        ShowToast("Failed to open standalone file: " + Err, "error");
    }
}

let TargetNewDocProjectPath = null;

function ShowNewDocumentModal(ProjectPath = null)
{
    TargetNewDocProjectPath = ProjectPath || (WorkspaceDirectories && WorkspaceDirectories[0]) || "e:\\Typst";
    const Modal = document.getElementById("NewDocumentModal");
    const Input = document.getElementById("NewDocModalInput");
    const SubfolderInput = document.getElementById("NewDocModalSubfolderInput");
    const DirSelect = document.getElementById("NewDocModalProjectDirSelect");
    const ErrorEl = document.getElementById("NewDocModalError");
    if (!Modal || !Input)
    {
        return ;
    }

    if (DirSelect)
    {
        const Dirs = (WorkspaceDirectories && WorkspaceDirectories.length > 0) ? WorkspaceDirectories : [TargetNewDocProjectPath];
        DirSelect.innerHTML = Dirs.map((D) => `<option value="${EscapeHtml(D)}">${EscapeHtml(D)}</option>`).join("");
        if (TargetNewDocProjectPath && Dirs.includes(TargetNewDocProjectPath))
        {
            DirSelect.value = TargetNewDocProjectPath;
        }
        else if (Dirs.length > 0)
        {
            DirSelect.value = Dirs[0];
        }
    }

    if (SubfolderInput)
    {
        SubfolderInput.value = "";
    }

    Input.value = "Document.typ";
    if (ErrorEl)
    {
        ErrorEl.style.display = "none";
        ErrorEl.textContent = "";
    }
    Modal.style.display = "flex";
    setTimeout
    (
        () =>
        {
            Input.focus();
            Input.select();
        },
        50
    );
}

function CloseNewDocumentModal()
{
    const Modal = document.getElementById("NewDocumentModal");
    if (Modal)
    {
        Modal.style.display = "none";
    }
    TargetNewDocProjectPath = null;
}

async function SaveWorkspaceFile(FilePath, Content)
{
    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        return await window.__TAURI__.core.invoke("SaveWorkspaceFile", { pathStr: FilePath, PathStr: FilePath, content: Content, Content: Content });
    }
    const Response = await AuthenticatedFetch
    (
        "/api/workspace/file",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { Path: FilePath, Content: Content })
        }
    );
    return await Response.json();
}

function ConfirmCreateNewDocument()
{
    const Input = document.getElementById("NewDocModalInput");
    const SubfolderInput = document.getElementById("NewDocModalSubfolderInput");
    const DirSelect = document.getElementById("NewDocModalProjectDirSelect");
    const ErrorEl = document.getElementById("NewDocModalError");
    if (!Input)
    {
        return ;
    }

    let RawName = Input.value.trim();
    if (!RawName)
    {
        if (ErrorEl)
        {
            ErrorEl.textContent = "Please enter a valid document name.";
            ErrorEl.style.display = "block";
        }
        return ;
    }
    const CleanName = RawName.endsWith(".typ") ? RawName : `${RawName}.typ`;
    const BaseDir = (DirSelect && DirSelect.value) ? DirSelect.value : (TargetNewDocProjectPath || (WorkspaceDirectories && WorkspaceDirectories[0]) || "e:\\Typst");
    const Subfolder = (SubfolderInput && SubfolderInput.value.trim()) ? SubfolderInput.value.trim() : "";
    let TargetDir = BaseDir;
    if (Subfolder)
    {
        TargetDir = `${BaseDir}\\${Subfolder}`;
    }
    const FullPath = `${TargetDir}\\${CleanName}`;

    CloseNewDocumentModal();

    SaveWorkspaceFile(FullPath, `= ${CleanName.replace(".typ", "")}\n\n// Start writing your Typst document here.\n`).then
    (
        () =>
        {
            LoadWorkspaceInfo().then
            (
                () =>
                {
                    OpenProjectInExplorer(TargetDir, FullPath);
                    ShowToast(`Created ${CleanName}`, "success");
                }
            );
        }
    );
}

function CreateFileInProject(ProjectPath)
{
    ShowNewDocumentModal(ProjectPath);
}

function SwitchView(ViewName)
{
    const EditorView = document.getElementById("EditorMainView");
    const DashboardView = document.getElementById("DashboardView");
    const NavEditor = document.getElementById("NavEditorBtn");
    const NavDashboard = document.getElementById("NavDashboardBtn");
    const LayoutSwitcherNav = document.getElementById("LayoutSwitcherNav");
    const ModeSwitcherNav = document.getElementById("ModeSwitcherNav");
    const ToggleExplorerBtn = document.getElementById("ToggleExplorerBtn");
    const ExportGroupWrapper = document.getElementById("ExportGroupWrapper");
    const ShortcutsHelpBtn = document.getElementById("ShortcutsHelpBtn");
    const AppHeader = document.querySelector(".AppHeader");

    if (ViewName === "editor")
    {
        EditorView.style.display = "flex";
        DashboardView.style.display = "none";
        if (AppHeader) { AppHeader.classList.remove("DashboardMode"); }
        if (NavEditor) { NavEditor.classList.add("Active"); }
        if (NavDashboard) { NavDashboard.classList.remove("Active"); }
        if (LayoutSwitcherNav) { LayoutSwitcherNav.style.display = ""; }
        if (ModeSwitcherNav) { ModeSwitcherNav.style.display = ""; }
        if (ToggleExplorerBtn) { ToggleExplorerBtn.style.display = ""; }
        if (ExportGroupWrapper) { ExportGroupWrapper.style.display = ""; }
        if (ShortcutsHelpBtn) { ShortcutsHelpBtn.style.display = ""; }
        if (MonacoInstance)
        {
            setTimeout(() => { MonacoInstance.layout(); }, 50);
        }
    }
    else if (ViewName === "dashboard" || ViewName === "home")
    {
        EditorView.style.display = "none";
        DashboardView.style.display = "block";
        if (AppHeader) { AppHeader.classList.add("DashboardMode"); }
        if (NavEditor) { NavEditor.classList.remove("Active"); }
        if (NavDashboard) { NavDashboard.classList.add("Active"); }
        if (LayoutSwitcherNav) { LayoutSwitcherNav.style.display = "none"; }
        if (ModeSwitcherNav) { ModeSwitcherNav.style.display = "none"; }
        if (ToggleExplorerBtn) { ToggleExplorerBtn.style.display = "none"; }
        if (ExportGroupWrapper) { ExportGroupWrapper.style.display = "none"; }
        if (ShortcutsHelpBtn) { ShortcutsHelpBtn.style.display = "none"; }
        RenderHomepage();
    }
}

// Global SVG Thumbnail & Preview Cache
window.DocPreviewSvgCache = window.DocPreviewSvgCache || {};
let CurrentHomepageSort = "modified";
let CurrentHomepageViewMode = "grid";

function HashCode(Str)
{
    let Hash = 0;
    if (!Str || Str.length === 0) { return Hash; }
    for (let I = 0; I < Str.length; I++)
    {
        const Char = Str.charCodeAt(I);
        Hash = ((Hash << 5) - Hash) + Char;
        Hash |= 0;
    }
    return Hash;
}

function FormatDocTimeAgo(Timestamp)
{
    if (!Timestamp) { return "Recently edited"; }
    const Now = Date.now();
    const DiffMs = Now - Timestamp;
    const DiffSec = Math.floor(DiffMs / 1000);
    const DiffMin = Math.floor(DiffSec / 60);
    const DiffHours = Math.floor(DiffMin / 60);
    const DiffDays = Math.floor(DiffHours / 24);

    if (DiffMin < 2) { return "Just now"; }
    if (DiffMin < 60) { return `${DiffMin} minutes ago`; }
    if (DiffHours < 24) { return `${DiffHours} hours ago`; }
    if (DiffDays === 1) { return "Yesterday"; }
    if (DiffDays < 7) { return `${DiffDays} days ago`; }

    const D = new Date(Timestamp);
    return D.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function FormatTableDate(Timestamp)
{
    if (!Timestamp) { return "—"; }
    const D = new Date(Timestamp);
    if (isNaN(D.getTime())) { return "—"; }
    return `${D.getMonth() + 1}/${D.getDate()}/${D.getFullYear()}`;
}

function GetCachedPreviewOrMockup(FilePath, DisplayTitle)
{
    const NormKey = CanonicalizeDocKey(FilePath);
    let Svg = null;
    if (window.DocPreviewSvgCache[NormKey])
    {
        Svg = window.DocPreviewSvgCache[NormKey];
    }
    else
    {
        try
        {
            const Saved = localStorage.getItem("typst_preview_cache_" + btoa(NormKey));
            if (Saved && Saved.includes("<svg"))
            {
                window.DocPreviewSvgCache[NormKey] = Saved;
                Svg = Saved;
            }
        }
        catch (Ignored) {}
    }

    if (!Svg && LastCompiledDocumentPath && LastCompiledDocumentPath === NormKey && LastCompiledPages && LastCompiledPages[0])
    {
        Svg = LastCompiledPages[0];
        window.DocPreviewSvgCache[NormKey] = Svg;
    }

    if (Svg)
    {
        if (CurrentPaperColorMode !== "light")
        {
            return ConvertSvgToDarkMode(Svg, false, CurrentPaperColorMode);
        }
        return Svg;
    }

    const MockupClass = (CurrentPaperColorMode === "pure_black")
        ? "PaperMockup PaperMode_PureBlack"
        : (CurrentPaperColorMode === "optimized")
            ? "PaperMockup PaperMode_Optimized"
            : "PaperMockup PaperMode_Light";

    return `
        <div Class = "${MockupClass}">
            <div Class = "PaperMockupTitle">${EscapeHtml(DisplayTitle)}</div>
            <div Class = "PaperMockupSubtitle">Typst Studio Document</div>
            <div Class = "PaperMockupDivider"></div>
            <div Class = "PaperMockupLine"></div>
            <div Class = "PaperMockupLine Medium"></div>
            <div Class = "PaperMockupLine Short"></div>
            <div Class = "PaperMockupLine"></div>
            <div Class = "PaperMockupLine Medium"></div>
        </div>
    `;
}

async function QueueDocumentSvgPreview(FilePath, ElementId)
{
    if (!FilePath) { return ; }
    const NormKey = CanonicalizeDocKey(FilePath);
    if (window.DocPreviewSvgCache[NormKey])
    {
        const Elem = document.getElementById(ElementId);
        if (Elem)
        {
            let DisplaySvg = window.DocPreviewSvgCache[NormKey];
            if (CurrentPaperColorMode !== "light")
            {
                DisplaySvg = ConvertSvgToDarkMode(DisplaySvg, false, CurrentPaperColorMode);
            }
            Elem.innerHTML = DisplaySvg;
        }
        return ;
    }

    try
    {
        let RawSvg = null;
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            const Content = await window.__TAURI__.core.invoke("ReadWorkspaceFile", { pathStr: FilePath, PathStr: FilePath });
            if (Content)
            {
                const Res = await window.__TAURI__.core.invoke
                (
                    "GenerateThumbnailSvg",
                    {
                        source: Content,
                        Source: Content,
                        filePath: FilePath,
                        FilePath: FilePath
                    }
                );
                if (Res && (Res.Pages || Res.pages))
                {
                    const PagesArr = Res.Pages || Res.pages;
                    if (PagesArr && PagesArr[0])
                    {
                        RawSvg = PagesArr[0];
                    }
                }
            }
        }
        else
        {
            const FileResp = await AuthenticatedFetch("/api/workspace/file?path=" + encodeURIComponent(FilePath));
            if (FileResp.ok)
            {
                const FileData = await FileResp.json();
                if (FileData && FileData.Success && FileData.Content)
                {
                    const CompileResp = await AuthenticatedFetch
                    (
                        "/api/compile",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify
                            ({
                                Source: FileData.Content,
                                source: FileData.Content,
                                FilePath: FilePath,
                                filePath: FilePath,
                                IsBackground: true
                            })
                        }
                    );
                    if (CompileResp.ok)
                    {
                        const Res = await CompileResp.json();
                        if (Res && (Res.Pages || Res.pages))
                        {
                            const PagesArr = Res.Pages || Res.pages;
                            if (PagesArr && PagesArr[0])
                            {
                                RawSvg = PagesArr[0];
                            }
                        }
                    }
                }
            }
        }

        if (RawSvg)
        {
            window.DocPreviewSvgCache[NormKey] = RawSvg;
            try
            {
                localStorage.setItem("typst_preview_cache_" + btoa(NormKey), RawSvg);
            }
            catch (Ignored) {}

            const TargetElem = document.getElementById(ElementId);
            if (TargetElem)
            {
                let OutputSvg = RawSvg;
                if (CurrentPaperColorMode !== "light")
                {
                    OutputSvg = ConvertSvgToDarkMode(OutputSvg, false, CurrentPaperColorMode);
                }
                TargetElem.innerHTML = OutputSvg;
            }
        }
    }
    catch (Err)
    {
        console.warn("QueueDocumentSvgPreview non-fatal background compile:", Err);
    }
}

function TrackRecentDocument(FilePath, Name)
{
    if (!FilePath) { return ; }
    try
    {
        const CleanName = Name || FilePath.split(/[\/\\]/).pop();
        let Recent = [];
        try
        {
            Recent = JSON.parse(localStorage.getItem("TypstStudio_RecentDocuments") || "[]");
        }
        catch (Err)
        {
            Recent = [];
        }
        const Norm = FilePath.toLowerCase();
        const Existing = Recent.find((R) => R && R.Path && R.Path.toLowerCase() === Norm);
        Recent = Recent.filter((R) => R && R.Path && R.Path.toLowerCase() !== Norm);
        Recent.unshift
        ({
            Path: FilePath,
            Name: CleanName,
            Created: (Existing && Existing.Created) ? Existing.Created : Date.now(),
            Modified: Date.now()
        });
        if (Recent.length > 50) { Recent = Recent.slice(0, 50); }
        localStorage.setItem("TypstStudio_RecentDocuments", JSON.stringify(Recent));
    }
    catch (Ignored) {}
}

function RenderHomepage(FilterQuery = "")
{
    const GridContainer = document.getElementById("DashboardProjectsGrid");
    if (!GridContainer)
    {
        return ;
    }

    const Query = (FilterQuery || "").toLowerCase().trim();

    // 1. Group 1: Added Project Directories
    const Projects = GroupWorkspaceIntoProjects();

    // 2. Group 2: Standalone Projects
    let StandaloneList = [];
    try
    {
        const Raw = localStorage.getItem("TypstStudio_StandaloneProjects");
        if (Raw)
        {
            const Parsed = JSON.parse(Raw);
            if (Array.isArray(Parsed))
            {
                StandaloneList = Parsed;
            }
        }
    }
    catch (Ignored)
    {
    }

    // Also include any standalone files from RecentDocuments that do not belong to any added project directory
    try
    {
        const Recent = JSON.parse(localStorage.getItem("TypstStudio_RecentDocuments") || "[]");
        if (Array.isArray(Recent))
        {
            for (const R of Recent)
            {
                if (R && R.Path && R.Path.toLowerCase().endsWith(".typ"))
                {
                    const NormR = R.Path.replace(/\\/g, "/").toLowerCase();
                    const InProject = (WorkspaceDirectories || []).some
                    (
                        (Dir) =>
                        {
                            const NormDir = Dir.replace(/\\/g, "/").toLowerCase();
                            return NormR.startsWith(NormDir.endsWith("/") ? NormDir : NormDir + "/");
                        }
                    );
                    if (!InProject)
                    {
                        const Exists = StandaloneList.some
                        (
                            (S) => (typeof S === "string" ? S : S.Path).replace(/\\/g, "/").toLowerCase() === NormR
                        );
                        if (!Exists)
                        {
                            StandaloneList.push
                            (
                                {
                                    Path: R.Path,
                                    Name: R.Name || R.Path.split(/[\\/]/).pop(),
                                    Modified: R.Modified || Date.now()
                                }
                            );
                        }
                    }
                }
            }
        }
    }
    catch (Ignored)
    {
    }

    const PaperModeClass = (CurrentPaperColorMode === "pure_black")
        ? "PaperMode_PureBlack"
        : (CurrentPaperColorMode === "optimized")
            ? "PaperMode_Optimized"
            : "PaperMode_Light";

    const FetchQueue = [];
    let TotalProjectFiles = 0;

    // Filter projects if query provided
    let FilteredProjects = Projects;
    if (Query)
    {
        FilteredProjects = Projects.filter
        (
            (P) =>
            {
                const NameMatch = (P.Name || "").toLowerCase().includes(Query);
                const PathMatch = (P.Path || "").toLowerCase().includes(Query);
                const FileMatch = (P.Files || []).some((F) => (F.Name || "").toLowerCase().includes(Query));
                return NameMatch || PathMatch || FileMatch;
            }
        );
    }

    let FilteredStandalone = StandaloneList;
    if (Query)
    {
        FilteredStandalone = StandaloneList.filter
        (
            (S) =>
            {
                const SPath = typeof S === "string" ? S : S.Path;
                const SName = typeof S === "string" ? S.split(/[\\/]/).pop() : (S.Name || S.Path.split(/[\\/]/).pop());
                return (SName || "").toLowerCase().includes(Query) || (SPath || "").toLowerCase().includes(Query);
            }
        );
    }

    // If list view mode is selected, render list view
    if (CurrentHomepageViewMode === "list")
    {
        let TableRowsHtml = "";
        const AllFlatDocs = [];
        for (const P of FilteredProjects)
        {
            for (const F of (P.Files || []))
            {
                AllFlatDocs.push
                (
                    {
                        ...F,
                        ProjectName: P.Name,
                        IsStandalone: false
                    }
                );
            }
        }
        for (const S of FilteredStandalone)
        {
            const SPath = typeof S === "string" ? S : S.Path;
            const SName = typeof S === "string" ? S.split(/[\\/]/).pop() : (S.Name || S.Path.split(/[\\/]/).pop());
            AllFlatDocs.push
            (
                {
                    Path: SPath,
                    Name: SName,
                    ProjectName: "[Standalone]",
                    Modified: typeof S === "object" ? S.Modified : Date.now(),
                    IsStandalone: true
                }
            );
        }

        if (CurrentHomepageSort === "name")
        {
            AllFlatDocs.sort((A, B) => (A.Name || "").localeCompare(B.Name || ""));
        }
        else if (CurrentHomepageSort === "created")
        {
            AllFlatDocs.sort((A, B) => (B.Created || B.Modified || 0) - (A.Created || A.Modified || 0));
        }
        else
        {
            AllFlatDocs.sort((A, B) => (B.Modified || 0) - (A.Modified || 0));
        }

        for (const Doc of AllFlatDocs)
        {
            const DisplayTitle = (Doc.Name || "Untitled").replace(/\.typ$/i, "");
            const ModifiedDate = FormatTableDate(Doc.Modified);
            const CreatedDate = FormatTableDate(Doc.Created || Doc.Modified);

            TableRowsHtml += `
                <tr Class = "HomepageListRow" data-file-path = "${EscapeHtml(Doc.Path)}" data-file-name = "${EscapeHtml(Doc.Name)}" data-is-standalone = "${Doc.IsStandalone ? "true" : "false"}">
                    <td>
                        <div Class = "ListColProject" data-action = "${Doc.IsStandalone ? "open-standalone-doc" : "open-doc"}" Title = "Open ${EscapeHtml(Doc.Name)} in Editor">
                            <span Class = "ListDocIcon">
                                <svg Width = "15" Height = "15" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "1.8">
                                    <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline Points = "14 2 14 8 20 8" />
                                </svg>
                            </span>
                            <span>${EscapeHtml(DisplayTitle)}</span>
                            <span style = "font-size: 11px; color: #71717A; margin-left: 8px;">(${EscapeHtml(Doc.ProjectName)})</span>
                        </div>
                    </td>
                    <td Class = "ListColCreated">${CreatedDate}</td>
                    <td Class = "ListColModified">${ModifiedDate}</td>
                    <td Class = "ListColActions">
                        <div Class = "ListActionsWrapper">
                            <button Type = "button" Class = "ListActionBtn" Title = "Open in Editor" data-action = "${Doc.IsStandalone ? "open-standalone-doc" : "open-doc"}">
                                <svg Width = "12" Height = "12" ViewBox = "0 24 24" Fill = "currentColor">
                                    <polygon Points = "5 3 19 12 5 21 5 3" />
                                </svg>
                            </button>
                            <button Type = "button" Class = "ListActionBtn" Title = "Export PDF" data-action = "export-doc">
                                <svg Width = "12" Height = "12" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                    <path D = "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline Points = "7 10 12 15 17 10" />
                                    <line X1 = "12" Y1 = "15" X2 = "12" Y2 = "3" />
                                </svg>
                            </button>
                            <button Type = "button" Class = "ListActionBtn DeleteBtn" Title = "Delete / Remove" data-action = "delete-doc">
                                <svg Width = "12" Height = "12" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                    <polyline Points = "3 6 5 6 21 6" />
                                    <path D = "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }

        const ModifiedSortIndicator = (CurrentHomepageSort === "modified") ? " ▾" : "";
        GridContainer.classList.add("ListView");
        GridContainer.innerHTML = `
            <div Class = "HomepageListViewContainer">
                <table Class = "HomepageListTable">
                    <thead>
                        <tr>
                            <th Class = "SortableHeader" data-sort-key = "name">Project / Document</th>
                            <th Class = "SortableHeader" data-sort-key = "created">Created</th>
                            <th Class = "SortableHeader" data-sort-key = "modified">Last modified${ModifiedSortIndicator}</th>
                            <th Style = "text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${TableRowsHtml || `<tr><td colspan="4" style="text-align:center; padding: 32px; color: #71717A;">No documents found.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;
        return ;
    }

    GridContainer.classList.remove("ListView");

    // Grid View: Two Individual Groups
    let Html = "";

    // --- GROUP 1: STANDALONE PROJECTS (1 FILE) ---
    let StandaloneCardsHtml = "";
    for (let SIdx = 0; SIdx < FilteredStandalone.length; SIdx++)
    {
        const SItem = FilteredStandalone[SIdx];
        const SPath = typeof SItem === "string" ? SItem : SItem.Path;
        const SName = typeof SItem === "string" ? SItem.split(/[\\/]/).pop() : (SItem.Name || SPath.split(/[\\/]/).pop());
        const SModified = (typeof SItem === "object" && SItem.Modified) ? SItem.Modified : Date.now();
        const SafeId = `StandaloneCard_${SIdx}_${Math.abs(HashCode(SPath || `std_${SIdx}`))}`;
        const DisplayTitle = (SName || "Untitled").replace(/\.typ$/i, "");
        const TimeAgo = FormatDocTimeAgo(SModified);
        const InnerHtml = GetCachedPreviewOrMockup(SPath, DisplayTitle);
        const IsActiveStandalone = ExplorerIsStandalone && (ExplorerCurrentRoot && ExplorerCurrentRoot.toLowerCase() === SPath.toLowerCase());

        StandaloneCardsHtml += `
            <div Class = "HomepagePaperCard ${IsActiveStandalone ? "ActiveProject" : ""}" data-action = "open-standalone-doc" data-file-path = "${EscapeHtml(SPath)}" data-file-name = "${EscapeHtml(SName)}" Title = "Open standalone file: ${EscapeHtml(SPath)}">
                <div Class = "PaperSheetOuter ${PaperModeClass}">
                    <div Class = "PaperSheetInner ${PaperModeClass}" Id = "${SafeId}">
                        ${InnerHtml}
                    </div>
                </div>
                <div Class = "PaperDocMeta">
                    <div Class = "PaperDocTitle" Title = "${EscapeHtml(SName)}">${EscapeHtml(DisplayTitle)}</div>
                    <div Class = "PaperDocSub">${TimeAgo} ${IsActiveStandalone ? "• Active" : ""}</div>
                </div>
            </div>
        `;

        const NormKey = (SPath || "").toLowerCase();
        if (!window.DocPreviewSvgCache[NormKey])
        {
            FetchQueue.push({ Path: SPath, ElementId: SafeId });
        }
    }

    if (FilteredStandalone.length === 0)
    {
        StandaloneCardsHtml = `
            <div Class = "ProjectBoxEmpty" Style = "grid-column: 1 / -1; padding: 28px 16px;">
                <div Class = "ProjectBoxEmptyTitle">No standalone files opened yet</div>
                <div Style = "font-size: 12px; color: #71717A; margin-top: 4px; margin-bottom: 12px;">Work on 1 single .typ file directly without an enclosing project directory.</div>
                <button Type = "button" Class = "DashboardGroupBtn" data-action = "pick-standalone-file">
                    <span>+ Open Standalone File</span>
                </button>
            </div>
        `;
    }

    Html += `
        <div Class = "DashboardGroupSection">
            <div Class = "DashboardGroupHeader">
                <div Class = "DashboardGroupTitleWrapper">
                    <span Class = "DashboardGroupTitleIcon">📄</span>
                    <span Class = "DashboardGroupTitle">Standalone Projects (1 File)</span>
                    <span Class = "DashboardGroupBadge">${FilteredStandalone.length}</span>
                </div>
                <div Class = "DashboardGroupActions">
                    <button Type = "button" Class = "DashboardGroupBtn" data-action = "pick-standalone-file" Title = "Open a standalone .typ file">
                        <svg Width = "12" Height = "12" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <line X1 = "12" Y1 = "5" X2 = "12" Y2 = "19" />
                            <line X1 = "5" Y1 = "12" X2 = "19" Y2 = "12" />
                        </svg>
                        <span>Open standalone file</span>
                    </button>
                </div>
            </div>
            <div Class = "ProjectBoxFilesGrid">
                ${StandaloneCardsHtml}
            </div>
        </div>
    `;

    // --- GROUP 2: PROJECTS ---
    let ProjectBoxesHtml = "";
    for (let PIdx = 0; PIdx < FilteredProjects.length; PIdx++)
    {
        const Proj = FilteredProjects[PIdx];
        const ProjPath = Proj.Path || "";
        const ProjFiles = Proj.Files || [];
        TotalProjectFiles += ProjFiles.length;
        const IsCollapsed = CollapsedProjectBoxes.has(ProjPath);
        const NormalizedProj = ProjPath.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
        const NormalizedActive = (ExplorerCurrentRoot || "").replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
        const IsActiveProject = !ExplorerIsStandalone && (NormalizedProj === NormalizedActive);

        // Group files by relative subdirectory
        const DirGroupsMap = new Map();
        for (let FIdx = 0; FIdx < ProjFiles.length; FIdx++)
        {
            const Doc = ProjFiles[FIdx];
            const DocDirNorm = (Doc.Directory || "").replace(/\\/g, "/").replace(/\/+$/, "");
            let RelDir = "";
            if (DocDirNorm.toLowerCase().startsWith(NormalizedProj + "/"))
            {
                RelDir = DocDirNorm.substring(NormalizedProj.length + 1);
            }
            else if (DocDirNorm.toLowerCase() === NormalizedProj)
            {
                RelDir = "";
            }
            else
            {
                const DocPathNorm = (Doc.Path || "").replace(/\\/g, "/");
                if (DocPathNorm.toLowerCase().startsWith(NormalizedProj + "/"))
                {
                    const DocRel = DocPathNorm.substring(NormalizedProj.length + 1);
                    const LastSlash = DocRel.lastIndexOf("/");
                    RelDir = LastSlash > 0 ? DocRel.substring(0, LastSlash) : "";
                }
            }

            if (!DirGroupsMap.has(RelDir))
            {
                const FullFolder = RelDir ? `${ProjPath.replace(/[\\/]+$/, "")}/${RelDir}` : ProjPath;
                DirGroupsMap.set
                (
                    RelDir,
                    {
                        RelDir: RelDir,
                        FullFolder: FullFolder,
                        DisplayName: RelDir ? RelDir : "Root Directory",
                        Files: []
                    }
                );
            }
            DirGroupsMap.get(RelDir).Files.push({ Doc: Doc, FIdx: FIdx });
        }

        const SortedGroups = Array.from(DirGroupsMap.values()).sort
        (
            (A, B) =>
            {
                if (A.RelDir === "" && B.RelDir !== "")
                {
                    return -1;
                }
                if (A.RelDir !== "" && B.RelDir === "")
                {
                    return 1;
                }
                return A.RelDir.localeCompare(B.RelDir);
            }
        );

        function GenerateFileCardsHtml(FileItems)
        {
            let CardsHtml = "";
            for (let ItemIdx = 0; ItemIdx < FileItems.length; ItemIdx++)
            {
                const Item = FileItems[ItemIdx];
                const Doc = Item.Doc;
                const FIdx = Item.FIdx;
                const SafeId = `ProjCard_${PIdx}_${FIdx}_${Math.abs(HashCode(Doc.Path || `pfile_${FIdx}`))}`;
                const DisplayTitle = (Doc.Name || "Untitled").replace(/\.typ$/i, "");
                const TimeAgo = FormatDocTimeAgo(Doc.Modified);
                const InnerHtml = GetCachedPreviewOrMockup(Doc.Path, DisplayTitle);

                CardsHtml += `
                    <div Class = "HomepagePaperCard" data-action = "open-project-file" data-file-path = "${EscapeHtml(Doc.Path)}" data-project-path = "${EscapeHtml(ProjPath)}" Title = "Open ${EscapeHtml(Doc.Name)} in ${EscapeHtml(Proj.Name)}">
                        <div Class = "PaperSheetOuter ${PaperModeClass}">
                            <div Class = "PaperSheetInner ${PaperModeClass}" Id = "${SafeId}">
                                ${InnerHtml}
                            </div>
                        </div>
                        <div Class = "PaperDocMeta">
                            <div Class = "PaperDocTitle" Title = "${EscapeHtml(Doc.Name)}">${EscapeHtml(DisplayTitle)}</div>
                            <div Class = "PaperDocSub">${TimeAgo}</div>
                        </div>
                    </div>
                `;

                const NormKey = (Doc.Path || "").toLowerCase();
                if (!window.DocPreviewSvgCache[NormKey])
                {
                    FetchQueue.push({ Path: Doc.Path, ElementId: SafeId });
                }
            }
            return CardsHtml;
        }

        let ProjectBodyHtml = "";
        if (ProjFiles.length === 0)
        {
            ProjectBodyHtml = `
                <div Class = "ProjectBoxEmpty" Style = "grid-column: 1 / -1;">
                    <div Class = "ProjectBoxEmptyTitle">No .typ documents in this project yet</div>
                    <button Type = "button" Class = "DashboardGroupBtn" data-action = "new-project-doc" data-project-path = "${EscapeHtml(ProjPath)}" Style = "margin-top: 10px;">
                        <span>+ Create File in Project</span>
                    </button>
                </div>
            `;
        }
        else if (SortedGroups.length === 1 && SortedGroups[0].RelDir === "")
        {
            ProjectBodyHtml = `
                <div Class = "ProjectBoxFilesGrid">
                    ${GenerateFileCardsHtml(SortedGroups[0].Files)}
                </div>
            `;
        }
        else
        {
            for (let GIdx = 0; GIdx < SortedGroups.length; GIdx++)
            {
                const Group = SortedGroups[GIdx];
                const SubfolderKey = `${ProjPath}::${Group.RelDir}`;
                const IsSubCollapsed = CollapsedSubfolders.has(SubfolderKey);
                const IsRootDir = (Group.RelDir === "");
                const CardsHtml = GenerateFileCardsHtml(Group.Files);

                ProjectBodyHtml += `
                    <div Class = "ProjectSubfolderGroup ${IsSubCollapsed ? "Collapsed" : ""}" data-folder-key = "${EscapeHtml(SubfolderKey)}">
                        <div Class = "ProjectSubfolderHeader" data-action = "toggle-project-subfolder" data-folder-key = "${EscapeHtml(SubfolderKey)}">
                            <div Class = "ProjectSubfolderHeaderLeft">
                                <span Class = "ProjectSubfolderChevron">▾</span>
                                <span Class = "ProjectSubfolderIcon">${IsRootDir ? "📦" : "📁"}</span>
                                <span Class = "ProjectSubfolderTitle" Title = "${EscapeHtml(Group.FullFolder)}">${EscapeHtml(Group.DisplayName)}</span>
                                <span Class = "ProjectSubfolderBadge">${Group.Files.length} file${Group.Files.length === 1 ? "" : "s"}</span>
                            </div>
                            <div Class = "ProjectSubfolderHeaderRight">
                                <button Type = "button" Class = "ProjectSubfolderActionBtn" data-action = "open-project-folder" data-project-path = "${EscapeHtml(ProjPath)}" data-folder-path = "${EscapeHtml(Group.FullFolder)}" Title = "Open ${EscapeHtml(Group.DisplayName)} folder in Explorer">
                                    <span>Open Folder</span>
                                </button>
                                <button Type = "button" Class = "ProjectSubfolderActionBtn" data-action = "new-subfolder-doc" data-project-path = "${EscapeHtml(ProjPath)}" data-folder-path = "${EscapeHtml(Group.FullFolder)}" Title = "Add new file in ${EscapeHtml(Group.DisplayName)}">
                                    <span>+ File</span>
                                </button>
                            </div>
                        </div>
                        <div Class = "ProjectSubfolderBody">
                            <div Class = "ProjectBoxFilesGrid">
                                ${CardsHtml}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        const FolderCountInfo = SortedGroups.length > 1 ? ` • ${SortedGroups.length} folders` : "";

        ProjectBoxesHtml += `
            <div Class = "DashboardProjectBox ${IsCollapsed ? "Collapsed" : ""} ${IsActiveProject ? "ActiveProject" : ""}" data-project-path = "${EscapeHtml(ProjPath)}">
                <div Class = "ProjectBoxHeader" data-action = "toggle-project-box" data-project-path = "${EscapeHtml(ProjPath)}">
                    <div Class = "ProjectBoxHeaderLeft">
                        <span Class = "ProjectBoxChevron">▾</span>
                        <span Class = "ProjectBoxFolderIcon">📁</span>
                        <span Class = "ProjectBoxTitle">${EscapeHtml(Proj.Name)}</span>
                        <span Class = "ProjectBoxPath" Title = "${EscapeHtml(ProjPath)}">${EscapeHtml(ProjPath)}</span>
                        <span Class = "ProjectBoxPill ${IsActiveProject ? "ActivePill" : ""}">${IsActiveProject ? "Active • " : ""}${ProjFiles.length} file${ProjFiles.length === 1 ? "" : "s"}${FolderCountInfo}</span>
                    </div>
                    <div Class = "ProjectBoxHeaderRight">
                        <button Type = "button" Class = "ProjectBoxActionBtn Primary" data-action = "open-project" data-project-path = "${EscapeHtml(ProjPath)}" Title = "Switch Editor & Explorer to this project">
                            <span>Open Project</span>
                        </button>
                        <button Type = "button" Class = "ProjectBoxActionBtn" data-action = "new-project-doc" data-project-path = "${EscapeHtml(ProjPath)}" Title = "Add new file to this project">
                            <span>+ File</span>
                        </button>
                        <button Type = "button" Class = "ProjectBoxActionBtn Delete" data-action = "remove-project-dir" data-project-path = "${EscapeHtml(ProjPath)}" Title = "Remove project from workspace">
                            <span>×</span>
                        </button>
                    </div>
                </div>
                <div Class = "ProjectBoxBody">
                    ${ProjectBodyHtml}
                </div>
            </div>
        `;
    }

    if (FilteredProjects.length === 0)
    {
        ProjectBoxesHtml = `
            <div Class = "ProjectBoxEmpty" Style = "padding: 36px 16px;">
                <div Class = "ProjectBoxEmptyTitle" Style = "font-size: 14px; margin-bottom: 6px;">No added projects found</div>
                <div Style = "font-size: 12px; color: #71717A; margin-bottom: 12px;">Add an existing folder or click "Add project" to manage projects.</div>
                <button Type = "button" Class = "DashboardGroupBtn" data-action = "add-project-dir">
                    <span>+ Add Project</span>
                </button>
            </div>
        `;
    }

    Html += `
        <div Class = "DashboardGroupSection" Style = "margin-top: 24px;">
            <div Class = "DashboardGroupHeader">
                <div Class = "DashboardGroupTitleWrapper">
                    <span Class = "DashboardGroupTitleIcon">📁</span>
                    <span Class = "DashboardGroupTitle">Projects</span>
                    <span Class = "DashboardGroupBadge">${FilteredProjects.length}</span>
                </div>
                <div Class = "DashboardGroupActions">
                    <button Type = "button" Class = "DashboardGroupBtn" data-action = "add-project-dir" Title = "Add project to workspace">
                        <svg Width = "12" Height = "12" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                            <line X1 = "12" Y1 = "5" X2 = "12" Y2 = "19" />
                            <line X1 = "5" Y1 = "12" X2 = "19" Y2 = "12" />
                        </svg>
                        <span>Add project</span>
                    </button>
                </div>
            </div>
            ${ProjectBoxesHtml}
        </div>
    `;

    GridContainer.innerHTML = Html;

    for (const Item of FetchQueue)
    {
        QueueDocumentSvgPreview(Item.Path, Item.ElementId);
    }
}

function RenderDashboard(FilterQuery = "")
{
    RenderHomepage(FilterQuery);
}

// Template Chooser Handlers
function ShowTemplateChooserModal()
{
    const Modal = document.getElementById("TemplateChooserModal");
    if (Modal)
    {
        Modal.style.display = "flex";
    }
}

function CloseTemplateChooserModal()
{
    const Modal = document.getElementById("TemplateChooserModal");
    if (Modal)
    {
        Modal.style.display = "none";
    }
}

const TypstTemplates =
{
    showcase: `// Typst Studio Showcase Template
#set page(paper: "a4", margin: (x: 2cm, y: 2.5cm))
#set text(font: "Liberation Serif", size: 10.5pt)

#align(center)[
  #text(18pt, weight: "bold")[Comprehensive Typst Showcase] \\
  #v(2pt)
  #text(11pt, fill: rgb("7100FF"))[High-Performance Vector Typesetting & Document Architecture]
]

#v(10pt)
== 1 Document Overview
Typst is an innovative typesetting engine combining intuitive lightweight syntax with deterministic vector rendering.

== 2 Mathematical Formulation
Inline math integrates seamlessly, such as $E = m c^2$ or matrix mapping:
$ mat(cos theta, -sin theta; sin theta, cos theta) vec(x, y) = vec(x', y') $
`,
    paper: `// Scientific Paper Template
#set page(paper: "a4", columns: 2, margin: (x: 2cm, y: 2.5cm))
#set text(font: "Linux Libertine", size: 10pt)

#place(top + center, scope: "parent", float: true)[
  #align(center)[
    #text(16pt, weight: "bold")[Deterministic Architecture for High-Throughput Document Rendering] \\
    #v(4pt)
    #text(10pt, style: "italic")[Typst Research Group]
  ]
  #v(12pt)
]

== Abstract
We evaluate latency optimizations in modern incremental typesetting engines.

== 1 Introduction
Modern desktop authoring environments require continuous sub-second rendering.
`,
    novel: `// Book & Novel Template
#set page(paper: "a5", margin: (x: 2.2cm, y: 2.8cm))
#set text(font: "Georgia", size: 10.5pt)
#set par(justify: true, first-line-indent: 1.5em)

#v(40pt)
#align(center)[
  #text(22pt, weight: "bold")[THE CHRONICLES OF HORIZON] \\
  #v(10pt)
  #text(11pt, style: "italic")[A Tale of Two Worlds]
]

#pagebreak()

= Chapter 1: The Gathering Storm

The midnight bell tolled across the obsidian towers of Valoria as the autumn rain began to fall.
`,
    report: `// Executive Report Template
#set page(paper: "a4", margin: (x: 2cm, y: 2.5cm), header: align(right)[#text(8pt, fill: luma(120))[*Quarterly Technical Briefing*]])
#set text(font: "Inter", size: 10pt)

#align(left)[
  #text(20pt, weight: "bold")[Executive Performance Report] \\
  #text(11pt, fill: rgb("00D26A"))[System Architecture & Latency Audit]
]

#v(12pt)
== Executive Summary
All primary subsystems demonstrated 100% adherence to synchronous SLA thresholds.
`,
    resume: `// Modern CV / Resume Template
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.8cm))
#set text(font: "Inter", size: 9.5pt)

#align(center)[
  #text(18pt, weight: "bold")[Alex Mercer] \\
  #text(10pt)[Staff Software Engineer | alex@mercer.dev | San Francisco, CA]
]

#v(10pt)
== Technical Skills
- *Languages:* Rust, TypeScript, C++, Python, Go, Typst
- *Platforms:* Tauri, Chromium, WebAssembly, Linux, macOS
`,
    blank: `// Clean Typst Canvas
#set page(paper: "a4", margin: (x: 2.5cm, y: 2.5cm))
#set text(font: "Liberation Sans", size: 11pt)

= Untitled Document

Start writing your Typst document here...
`
};

async function ApplyDocumentTemplate(TemplateKey)
{
    CloseTemplateChooserModal();
    const Source = TypstTemplates[TemplateKey] || TypstTemplates.blank;
    const BaseName = TemplateKey.charAt(0).toUpperCase() + TemplateKey.slice(1);
    const FileName = `${BaseName}Document.typ`;
    const TargetDir = (WorkspaceDirectories && WorkspaceDirectories[0]) || "e:\\Typst";
    const FullPath = `${TargetDir}\\${FileName}`;

    await SaveWorkspaceFile(FullPath, Source);
    await LoadWorkspaceInfo();
    await OpenDocumentInTab(FullPath, FileName);
    SwitchView("editor");
    ShowToast(`Created ${FileName} from template`, "success");
}
// =============================================================================
// SyncTeX Bidirectional Synchronization Engine
// =============================================================================

function InitializeSyncTex()
{
    const SyncTexCheckbox = document.getElementById("SyncTexToggle");
    if (SyncTexCheckbox)
    {
        SyncTexCheckbox.checked = IsSyncTexEnabled;
        SyncTexCheckbox.addEventListener
        (
            "change", () =>
            {
                IsSyncTexEnabled = SyncTexCheckbox.checked;
                localStorage.setItem("typst_synctex_enabled", IsSyncTexEnabled ? "true": "false");
                if (!IsSyncTexEnabled)
                {
                    ClearSyncHighlights();
                }
                else if (MonacoInstance)
                {
                    const Pos = MonacoInstance.getPosition();
                    if (Pos)
                    {
                        PerformForwardSync(Pos.lineNumber, Pos.column);
                    }
                }
            }
        );
    }

    const PagesContainer = document.getElementById("PagesContainer");
    if (PagesContainer)
    {
        PagesContainer.addEventListener("click", HandlePreviewClick);
    }

    window.addEventListener
    (
        "keydown", (Event) =>
        {
            if (!IsSyncTexEnabled)
            {
                return ;
            }
            const IsMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || (navigator.userAgentData && navigator.userAgentData.platform === "macOS");
            const IsInspectKey = IsMac ? Event.metaKey: Event.ctrlKey;
            if (IsInspectKey)
            {
                const Viewport = document.getElementById("PreviewViewport");
                if (Viewport && !Viewport.classList.contains("SyncInspectMode"))
                {
                    Viewport.classList.add("SyncInspectMode");
                }
            }
        }
    );

    window.addEventListener
    (
        "keyup", () =>
        {
            const Viewport = document.getElementById("PreviewViewport");
            if (Viewport && Viewport.classList.contains("SyncInspectMode"))
            {
                Viewport.classList.remove("SyncInspectMode");
            }
        }
    );

    window.addEventListener
    (
        "blur", () =>
        {
            const Viewport = document.getElementById("PreviewViewport");
            if (Viewport)
            {
                Viewport.classList.remove("SyncInspectMode");
            }
        }
    );
}

function ClearSyncHighlights()
{
    if (ActiveHighlightLayers.size > 0)
    {
        for (const Layer of ActiveHighlightLayers)
        {
            if (Layer && Layer.parentNode)
            {
                Layer.innerHTML = "";
            }
        }
        ActiveHighlightLayers.clear();
    }
    else
    {
        document.querySelectorAll(".SyncHighlightLayer").forEach
        (
            (Layer) => { Layer.innerHTML = ""; }
        );
    }

    if (SyncLineDecorations)
    {
        SyncLineDecorations.clear();
    }
    ActiveHighlightSpan = null;
    ActiveHighlightBox = null;
    ActiveHighlightBoxes = [];
}

function HandlePreviewClick(Event)
{
    if (!IsSyncTexEnabled)
    {
        return ;
    }

    // Ignore clicks if user was selecting/dragging text in the preview
    if (window.getSelection && window.getSelection().toString().trim().length > 0)
    {
        return ;
    }

    const IsMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || (navigator.userAgentData && navigator.userAgentData.platform === "macOS");
    const IsInspectKey = IsMac ? (Event.metaKey && !Event.ctrlKey): (Event.ctrlKey && !Event.metaKey);

    const PageSheet = Event.target.closest(".PageSheet");
    if (!PageSheet)
    {
        return ;
    }

    const Svgs = PageSheet.querySelectorAll("svg");
    let ActiveSvg = null;
    for (const Candidate of Svgs)
    {
        const Rect = Candidate.getBoundingClientRect();
        if (Rect.width > 0 && Rect.height > 0)
        {
            ActiveSvg = Candidate;
            break;
        }
    }
    if (!ActiveSvg && Svgs.length > 0)
    {
        ActiveSvg = Svgs[0];
    }
    if (!ActiveSvg)
    {
        return ;
    }

    const SvgRect = ActiveSvg.getBoundingClientRect();
    if (SvgRect.width <= 0 || SvgRect.height <= 0)
    {
        return ;
    }

    Event.preventDefault();
    Event.stopPropagation();

    const PageIdMatch = PageSheet.id.match(/\d+/);
    const PageNum = PageIdMatch ? parseInt(PageIdMatch[0], 10): 1;

    const Vb = ActiveSvg.viewBox && ActiveSvg.viewBox.baseVal && ActiveSvg.viewBox.baseVal.width > 0
    ? ActiveSvg.viewBox.baseVal
    : { x: 0, y: 0, width: parseFloat(PageSheet.dataset.baseWidth) || 576, height: parseFloat(PageSheet.dataset.baseHeight) || 864 };

    const ClickPtX = Vb.x + (Event.clientX - SvgRect.left) * (Vb.width / SvgRect.width);
    const ClickPtY = Vb.y + (Event.clientY - SvgRect.top) * (Vb.height / SvgRect.height);

    if (isNaN(ClickPtX) || isNaN(ClickPtY) || !isFinite(ClickPtX) || !isFinite(ClickPtY))
    {
        return ;
    }

    let BestElem = null;
    let MinDist = Infinity;

    for (const Elem of ActiveSyncMap)
    {
        if (Elem.page !== PageNum)
        {
            continue;
        }

        const InX = ClickPtX >= Elem.x && ClickPtX <= (Elem.x + Elem.width);
        const InY = ClickPtY >= (Elem.y - 3.0) && ClickPtY <= (Elem.y + Elem.height + (Elem.height * 0.35) + 3.0);

        if (InX && InY)
        {
            BestElem = Elem;
            MinDist = 0;
            break;
        }

        const CenterX = Elem.x + (Elem.width / 2);
        const CenterY = Elem.y + (Elem.height / 2);
        const Dx = ClickPtX - CenterX;
        const Dy = (ClickPtY - CenterY) * 2.5;
        const DistSq = (Dx * Dx) + (Dy * Dy);

        if (DistSq < MinDist)
        {
            MinDist = DistSq;
            BestElem = Elem;
        }
    }

    // If not holding Ctrl/Cmd, only trigger if user clicked directly on or very near a rendered element
    if (!IsInspectKey && (!BestElem || Math.sqrt(MinDist) > 35.0))
    {
        return ;
    }

    if (BestElem)
    {
        let Related = ActiveSyncMap.filter
        (
            (Elem) => (Elem.page === BestElem.page) && (Elem.span === BestElem.span || (Elem.line === BestElem.line && Elem.end_line === BestElem.end_line && Math.abs(Elem.y - BestElem.y) < 90.0))
        );
        if (BestElem.line === BestElem.end_line)
        {
            const SameLineElems = ActiveSyncMap.filter
            (
                (Elem) => (Elem.page === BestElem.page) && (Elem.line === BestElem.line && Elem.end_line === BestElem.end_line && Math.abs(Elem.y - BestElem.y) < 90.0)
            );
            if (SameLineElems.length > Related.length)
            {
                Related = SameLineElems;
            }
        }
        else if (BestElem.end_line - BestElem.line >= 2)
        {
            const BlockElems = ActiveSyncMap.filter
            (
                (Elem) =>
                {
                    const Inside = Elem.start >= BestElem.start && Elem.end <= BestElem.end;
                    const IsNumbering = (Elem.end_line - Elem.line) >= 2 && Elem.width < 50 && Elem.x > 450;
                    return Inside && ! IsNumbering;
                }
            );
            if (BlockElems.length > 0)
            {
                Related = BlockElems;
            }
        }

        const GroupedBoxes = GroupElementsIntoVisualBoxes(Related);
        HighlightSvgRects(GroupedBoxes, false);
        SuppressForwardSync = true;
        setTimeout( () => { SuppressForwardSync = false; }, 300);
        JumpMonacoToLocation(BestElem.line, BestElem.col);
        return ;
    }

    if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
    {
        window.__TAURI__.core.invoke("SyncClick", { page: PageNum, Page: PageNum, x: ClickPtX, X: ClickPtX, y: ClickPtY, Y: ClickPtY })
            .then
            (
                (Result) =>
                {
                    if (Result && Result.Success && Result.Line)
                    {
                        SuppressForwardSync = true;
                        setTimeout( () => { SuppressForwardSync = false; }, 300);
                        JumpMonacoToLocation(Result.Line, Result.Column);
                    }
                }
            )
            .catch ( () => {});
        return ;
    }

    AuthenticatedFetch
    (
        "/api/sync/click",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify( { Page: PageNum, X: ClickPtX, Y: ClickPtY })
        }
    )
    .then( (Res) => Res.json())
    .then
    (
        (Result) =>
        {
            if (Result.Success)
            {
                SuppressForwardSync = true;
                setTimeout( () => { SuppressForwardSync = false; }, 300);
                JumpMonacoToLocation(Result.Line, Result.Column);
            }
        }
    )
    .catch ( () => {});
}

function JumpMonacoToLocation(Line, Column)
{
    if (!MonacoInstance)
    {
        return ;
    }

    MonacoInstance.revealPositionInCenter( { lineNumber: Line, column: Column });
    MonacoInstance.setPosition( { lineNumber: Line, column: Column });
    MonacoInstance.focus();
    FlashMonacoLine(Line);
}

function FlashMonacoLine(LineNumber)
{
    if (!MonacoInstance)
    {
        return ;
    }

    if (!SyncLineDecorations)
    {
        SyncLineDecorations = MonacoInstance.createDecorationsCollection([]);
    }

    SyncLineDecorations.set
    ([{
        range: new monaco.Range(LineNumber, 1, LineNumber, 1),
        options:
        {
            isWholeLine: true,
            className: "SyncMonacoLineHighlight",
            marginClassName: "SyncMonacoLineHighlight"
        }
    }]);

    setTimeout
    (
        () =>
        {
            if (SyncLineDecorations)
            {
                SyncLineDecorations.clear();
            }
        },
        1600
    );
}

function MergeOverlappingBoxes(Boxes)
{
    if (!Boxes || Boxes.length <= 1)
    {
        return Boxes || [];
    }

    const PageGroups = new Map();
    for (const Box of Boxes)
    {
        const PageNum = Box.page || 1;
        if (!PageGroups.has(PageNum))
        {
            PageGroups.set(PageNum,[]);
        }
        PageGroups.get(PageNum).push( { ...Box });
    }

    const Result = [];

    for (const[PageNum, PageBoxes] of PageGroups.entries())
    {
        let Changed = true;
        let Current = [...PageBoxes];

        while (Changed)
        {
            Changed = false;
            const Next = [];
            const MergedIndices = new Set();

            for (let I = 0; I < Current.length; I ++)
            {
                if (MergedIndices.has(I))
                {
                    continue;
                }
                let BoxA = Current[I];

                for (let J = I + 1; J < Current.length; J ++)
                {
                    if (MergedIndices.has(J))
                    {
                        continue;
                    }
                    const BoxB = Current[J];
                    // Full 2D containment: eliminate inner redundant box
                    const BInsideA = (BoxB.x >= BoxA.x - 2.5) && ( (BoxB.x + BoxB.width) <= (BoxA.x + BoxA.width + 2.5)) && (BoxB.y >= BoxA.y - 2.5) &&
                    (
                        (BoxB.y + BoxB.height) <= (BoxA.y + BoxA.height + 2.5)
                    );

                    const AInsideB = (BoxA.x >= BoxB.x - 2.5) && ( (BoxA.x + BoxA.width) <= (BoxB.x + BoxB.width + 2.5)) && (BoxA.y >= BoxB.y - 2.5) &&
                    (
                        (BoxA.y + BoxA.height) <= (BoxB.y + BoxB.height + 2.5)
                    );

                    if (BInsideA)
                    {
                        MergedIndices.add(J);
                        Changed = true;
                        continue;
                    }
                    if (AInsideB)
                    {
                        BoxA = { ...BoxB };
                        MergedIndices.add(J);
                        Changed = true;
                        continue;
                    }

                    const CenterY_A = BoxA.y + (BoxA.height / 2);
                    const CenterY_B = BoxB.y + (BoxB.height / 2);
                    const DistY = Math.abs(CenterY_A - CenterY_B);

                    const OverlapX = (Math.min(BoxA.x + BoxA.width, BoxB.x + BoxB.width) - Math.max(BoxA.x, BoxB.x)) >= - 1.0;
                    const OverlapY = (Math.min(BoxA.y + BoxA.height, BoxB.y + BoxB.height) - Math.max(BoxA.y, BoxB.y));

                    const MinHeight = Math.min(BoxA.height, BoxB.height);
                    const SameLine = DistY < 7.5 || (OverlapY > MinHeight * 0.45);
                    const SameSpanOrSameNode = !BoxA.span || !BoxB.span || BoxA.span === BoxB.span;
                    const SameLineNumber = (BoxA.line && BoxB.line) ? (BoxA.line === BoxB.line) : true;
                    const IsTableCell = Boolean(BoxA.is_table_cell || BoxB.is_table_cell);
                    const VerticallyAdjacent = !IsTableCell && SameSpanOrSameNode && SameLineNumber && OverlapX && (OverlapY >= - 14.0) && (Math.abs(BoxA.x - BoxB.x) < 25.0);

                    if (OverlapX && (SameLine || OverlapY >= - 1.0 || VerticallyAdjacent))
                    {
                        const MinX = Math.min(BoxA.x, BoxB.x);
                        const MaxX = Math.max(BoxA.x + BoxA.width, BoxB.x + BoxB.width);
                        const MinY = Math.min(BoxA.y, BoxB.y);
                        const MaxY = Math.max(BoxA.y + BoxA.height, BoxB.y + BoxB.height);
                        const FirstH = (BoxA.y <= BoxB.y) ? (BoxA.firstLineHeight || BoxA.height || 10.5): (BoxB.firstLineHeight || BoxB.height || 10.5);
                        const LastH = ((BoxA.y + BoxA.height) >= (BoxB.y + BoxB.height)) ? (BoxA.lastLineHeight || BoxA.height || 10.5): (BoxB.lastLineHeight || BoxB.height || 10.5);

                        BoxA =
                        {
                            page: PageNum,
                            x: MinX,
                            y: MinY,
                            width: MaxX - MinX,
                            height: MaxY - MinY,
                            firstLineHeight: FirstH,
                            lastLineHeight: LastH
                        };

                        MergedIndices.add(J);
                        Changed = true;
                    }
                }

                Next.push(BoxA);
            }

            Current = Next;
        }

        Result.push(...Current);
    }

    return Result;
}

function IsFullTableShape(Elem)
{
    if (!Elem)
    {
        return false;
    }
    if (Elem.kind !== "shape")
    {
        return false;
    }
    const LineSpan = (Elem.end_line || Elem.line || 0) - (Elem.line || 0);
    return LineSpan >= 2 || Elem.width === 0 || Elem.height === 0 || (Elem.width > 400 && Elem.height > 50);
}

function GetTrueGlyphBounds(Svg, Box)
{
    if (!Svg || !Box)
    {
        return null;
    }
    const Ctm = Svg.getScreenCTM();
    if (!Ctm)
    {
        return null;
    }
    const InvCtm = Ctm.inverse();

    let MinX = Infinity;
    let MaxX = -Infinity;
    let MinY = Infinity;
    let MaxY = -Infinity;
    let Matched = 0;

    const Nodes = Svg.querySelectorAll("use, path:not(.SyncHighlightRect)");
    for (const U of Nodes)
    {
        const R = U.getBoundingClientRect();
        if (R.width === 0 || R.height === 0)
        {
            continue;
        }

        if (U.tagName.toLowerCase() === "path")
        {
            if (R.width > 200 || (R.width > 50 && R.height < 2.0) || (R.height > 50 && R.width < 2.0))
            {
                continue;
            }
        }

        const Pt1 = Svg.createSVGPoint();
        Pt1.x = R.left;
        Pt1.y = R.top;
        const S1 = Pt1.matrixTransform(InvCtm);

        const Pt2 = Svg.createSVGPoint();
        Pt2.x = R.right;
        Pt2.y = R.bottom;
        const S2 = Pt2.matrixTransform(InvCtm);

        const Ux1 = Math.min(S1.x, S2.x);
        const Ux2 = Math.max(S1.x, S2.x);
        const Uy1 = Math.min(S1.y, S2.y);
        const Uy2 = Math.max(S1.y, S2.y);

        const GlyphCenterY = (Uy1 + Uy2) * 0.5;
        const OverlapX = (Math.min(Ux2, Box.x + Box.width + 1.5) - Math.max(Ux1, Box.x - 1.5)) > 0;
        const InsideY = GlyphCenterY >= (Box.y - 1.5) && GlyphCenterY <= (Box.y + Box.height + 3.5);

        if (OverlapX && InsideY)
        {
            MinX = Math.min(MinX, Ux1);
            MaxX = Math.max(MaxX, Ux2);
            MinY = Math.min(MinY, Uy1);
            MaxY = Math.max(MaxY, Uy2);
            Matched ++;
        }
    }

    if (Matched > 0 && isFinite(MinX) && isFinite(MaxX) && isFinite(MinY) && isFinite(MaxY))
    {
        return {
            x: MinX,
            y: MinY,
            width: MaxX - MinX,
            height: MaxY - MinY,
            matched: Matched
        };
    }
    return null;
}

function GroupSelectedElementsIntoLineBoxes(Elements)
{
    if (!Elements || Elements.length === 0)
    {
        return [];
    }

    const PageGroups = new Map();
    for (const Elem of Elements)
    {
        if (IsFullTableShape(Elem))
        {
            continue;
        }
        const PageNum = Elem.page || 1;
        if (!PageGroups.has(PageNum))
        {
            PageGroups.set(PageNum, []);
        }
        PageGroups.get(PageNum).push({ ...Elem });
    }

    const FinalBoxes = [];

    for (const [PageNum, PageElements] of PageGroups.entries())
    {
        PageElements.sort
        (
            (A, B) => ((A.y + A.height / 2) - (B.y + B.height / 2)) || (A.x - B.x)
        );

        const LineClusters = [];
        for (const Box of PageElements)
        {
            const CenterY = Box.y + (Box.height / 2);
            let Cluster = LineClusters.find((C) => Math.abs(C.CenterY - CenterY) < 4.5);
            if (!Cluster)
            {
                LineClusters.push
                ({
                    CenterY: CenterY,
                    Boxes: [Box]
                });
            }
            else
            {
                Cluster.Boxes.push(Box);
                Cluster.CenterY = Cluster.Boxes.reduce((Sum, B) => Sum + B.y + B.height / 2, 0) / Cluster.Boxes.length;
            }
        }

        for (const Cluster of LineClusters)
        {
            const CBoxes = [...Cluster.Boxes].sort((A, B) => A.x - B.x);
            const Segments = [];
            for (const Box of CBoxes)
            {
                const ShouldSplit = Segments.length > 0 && (() =>
                {
                    const LastSeg = Segments[Segments.length - 1];
                    const PrevBox = LastSeg[LastSeg.length - 1];
                    const Gap = Box.x - (PrevBox.x + PrevBox.width);
                    const BoxSpan = String(Box.span || "");
                    const PrevSpan = String(PrevBox.span || "");
                    const DiffCall = (BoxSpan.startsWith("call_box_") || PrevSpan.startsWith("call_box_")) && BoxSpan !== PrevSpan;
                    const DiffSpan = BoxSpan !== PrevSpan && (Gap > 12.0 || Box.line !== PrevBox.line || Box.is_table_cell || PrevBox.is_table_cell);
                    const DiffLine = Box.line !== PrevBox.line && Gap > 25.0;
                    return DiffCall || DiffSpan || DiffLine;
                })();

                if (ShouldSplit || Segments.length === 0)
                {
                    Segments.push([Box]);
                }
                else
                {
                    Segments[Segments.length - 1].push(Box);
                }
            }

            for (const Seg of Segments)
            {
                const MinX = Math.min(...Seg.map((B) => B.x));
                const MaxX = Math.max(...Seg.map((B) => B.x + B.width));
                const MinY = Math.min(...Seg.map((B) => B.y));
                const MaxY = Math.max(...Seg.map((B) => B.y + B.height));
                const TopH = Seg.reduce((MinH, B) => Math.min(MinH, B.height || 10.5), Infinity);
                const BottomH = Seg.reduce((MaxH, B) => Math.max(MaxH, B.height || 10.5), 0);

                FinalBoxes.push
                ({
                    page: PageNum,
                    x: MinX,
                    y: MinY,
                    width: Math.max(2.0, MaxX - MinX),
                    height: Math.max(2.0, MaxY - MinY),
                    firstLineHeight: TopH === Infinity ? 10.5 : TopH,
                    lastLineHeight: BottomH === 0 ? 10.5 : BottomH,
                    line: Seg[0].line,
                    span: Seg[0].span
                });
            }
        }
    }

    const UnifiedBoxes = [];
    const SpanMap = new Map();
    for (const Box of FinalBoxes)
    {
        if (Box.span)
        {
            const Key = `${Box.page || 1}_${Box.span}`;
            if (!SpanMap.has(Key))
            {
                SpanMap.set(Key, []);
            }
            SpanMap.get(Key).push(Box);
        }
        else
        {
            UnifiedBoxes.push(Box);
        }
    }

    for (const [Key, List] of SpanMap.entries())
    {
        if (List.length === 1)
        {
            UnifiedBoxes.push(List[0]);
        }
        else
        {
            const MinX = Math.min(...List.map((B) => B.x));
            const MaxX = Math.max(...List.map((B) => B.x + B.width));
            const MinY = Math.min(...List.map((B) => B.y));
            const MaxY = Math.max(...List.map((B) => B.y + B.height));
            UnifiedBoxes.push
            ({
                page: List[0].page,
                x: MinX,
                y: MinY,
                width: MaxX - MinX,
                height: MaxY - MinY,
                firstLineHeight: List[0].firstLineHeight || 10.5,
                lastLineHeight: List[List.length - 1].lastLineHeight || 10.5,
                line: List[0].line,
                span: List[0].span
            });
        }
    }

    return UnifiedBoxes;
}

function GroupElementsIntoVisualBoxes(Elements)
{
    if (!Elements || Elements.length === 0)
    {
        return [];
    }

    const PageGroups = new Map();
    for (const Elem of Elements)
    {
        if (IsFullTableShape(Elem))
        {
            continue;
        }
        const PageNum = Elem.page || 1;
        if (!PageGroups.has(PageNum))
        {
            PageGroups.set(PageNum, []);
        }
        PageGroups.get(PageNum).push({ ...Elem });
    }

    const FinalBoxes = [];

    for (const [PageNum, PageElements] of PageGroups.entries())
    {
        const LineClusters = [];
        PageElements.sort
        (
            (A, B) => ((A.y + A.height / 2) - (B.y + B.height / 2)) || (A.x - B.x)
        );

        for (const Box of PageElements)
        {
            const CenterY = Box.y + (Box.height / 2);
            let Cluster = LineClusters.find((C) => Math.abs(C.CenterY - CenterY) < 10.0);
            if (!Cluster)
            {
                LineClusters.push
                ({
                    CenterY: CenterY,
                    Boxes: [Box]
                });
            }
            else
            {
                Cluster.Boxes.push(Box);
                Cluster.CenterY = Cluster.Boxes.reduce((Sum, B) => Sum + B.y + B.height / 2, 0) / Cluster.Boxes.length;
            }
        }

        for (const Cluster of LineClusters)
        {
            const CBoxes = Cluster.Boxes;
            const MinX = Math.min
            (
                ...CBoxes.map((B) => B.x)
            );
            const MaxX = Math.max
            (
                ...CBoxes.map((B) => B.x + B.width)
            );
            const MinY = Math.min
            (
                ...CBoxes.map((B) => B.y)
            );
            const MaxY = Math.max
            (
                ...CBoxes.map((B) => B.y + B.height)
            );
            const TopH = CBoxes.reduce((MinH, B) => Math.min(MinH, B.height || 10.5), Infinity);
            const BottomH = CBoxes.reduce((MaxH, B) => Math.max(MaxH, B.height || 10.5), 0);

            FinalBoxes.push
            ({
                page: PageNum,
                x: MinX,
                y: MinY,
                width: MaxX - MinX,
                height: MaxY - MinY,
                firstLineHeight: TopH === Infinity ? 10.5 : TopH,
                lastLineHeight: BottomH === 0 ? 10.5 : BottomH
            });
        }
    }

    return MergeOverlappingBoxes(FinalBoxes);
}

function HighlightSvgRects(Boxes, AutoScroll = true)
{
    if (!IsSyncTexEnabled || !Boxes || Boxes.length === 0)
    {
        ClearSyncHighlights();
        return ;
    }

    ActiveHighlightBoxes = Boxes;
    ActiveHighlightBox = Boxes[0] || null;

    if (ActiveHighlightLayers.size > 0)
    {
        for (const Layer of ActiveHighlightLayers)
        {
            if (Layer && Layer.parentNode)
            {
                Layer.innerHTML = "";
            }
        }
        ActiveHighlightLayers.clear();
    }
    else
    {
        document.querySelectorAll(".SyncHighlightLayer").forEach
        (
            (Layer) => { Layer.innerHTML = ""; }
        );
    }

    const PageBoxesMap = new Map();
    for (const Box of Boxes)
    {
        const PageNum = Box.page || 1;
        if (!PageBoxesMap.has(PageNum))
        {
            PageBoxesMap.set(PageNum,[]);
        }
        PageBoxesMap.get(PageNum).push(Box);
    }

    const ScrollTargetPage = Boxes[0].page || 1;
    const FirstBoxLine = Boxes[0].line || 0;
    const IsPreambleOrRepeated = FirstBoxLine === 1 || (FirstBoxLine > 0 && RepeatedSyncLines.has(FirstBoxLine) && (Boxes[0].page || 1) === 1);
    const EffectiveTargetPage = IsPreambleOrRepeated ? 1: ScrollTargetPage;
    let PrimaryPageSheet = document.getElementById(`PageSheet_${EffectiveTargetPage}`) || document.querySelectorAll(".PageSheet")[EffectiveTargetPage - 1];
    let PrimaryTopY = Infinity;
    let PrimaryBottomY = -Infinity;

    for (const[PageNum, PageBoxes] of PageBoxesMap.entries())
    {
        const TargetPageSheet = document.getElementById(`PageSheet_${PageNum}`) || document.querySelectorAll(".PageSheet")[PageNum - 1];
        if (!TargetPageSheet)
        {
            continue;
        }

        const Svgs = TargetPageSheet.querySelectorAll("svg");
        if (!Svgs || Svgs.length === 0)
        {
            continue;
        }

        Svgs.forEach
        (
            (Svg) =>
            {
                let HighlightLayer = Svg.querySelector(".SyncHighlightLayer");
                if (!HighlightLayer)
                {
                    HighlightLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    HighlightLayer.setAttribute("class", "SyncHighlightLayer");
                    Svg.appendChild(HighlightLayer);
                }
                HighlightLayer.innerHTML = "";
                ActiveHighlightLayers.add(HighlightLayer);

                const CleanBoxes = [];
                for (let I = 0; I < PageBoxes.length; I ++)
                {
                    const B1 = PageBoxes[I];
                    let Contained = false;
                    for (let J = 0; J < PageBoxes.length; J ++)
                    {
                        if (I === J)
                        {
                            continue;
                        }
                        const B2 = PageBoxes[J];
                        const XContained = (B1.x >= B2.x - 2.5) && ( (B1.x + B1.width) <= (B2.x + B2.width + 2.5));
                        const YContained = (B1.y >= B2.y - 2.5) && ( (B1.y + B1.height) <= (B2.y + B2.height + 2.5));
                        if (XContained && YContained)
                        {
                            Contained = true;
                            break;
                        }
                    }
                    if (!Contained)
                    {
                        CleanBoxes.push(B1);
                    }
                }

                for (const Box of CleanBoxes)
                {
                    const Rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    Rect.setAttribute("class", "SyncHighlightRect");

                    const TrueBounds = GetTrueGlyphBounds(Svg, Box);
                    const PadX = 4.0;
                    const PadY = 2.0;
                    let RectX;
                    let RectY;
                    let RectW;
                    let RectH;

                    if (TrueBounds && TrueBounds.matched > 0)
                    {
                        RectX = TrueBounds.x - PadX;
                        RectW = Math.max(6.0, TrueBounds.width + (PadX * 2.0));
                        RectY = TrueBounds.y - PadY;
                        RectH = Math.max(6.0, TrueBounds.height + (PadY * 2.0));
                    }
                    else
                    {
                        const FirstH = Box.firstLineHeight || Box.height || 10;
                        const LastH = Box.lastLineHeight || Box.height || 10;

                        const TopBaseline = Box.y + FirstH;
                        const InkedTop = TopBaseline - (FirstH * 0.78);
                        const BottomBaseline = Box.y + Box.height;
                        const InkedBottom = BottomBaseline + (LastH * 0.32);

                        RectX = Box.x - PadX;
                        RectW = Math.max(6.0, Box.width + (PadX * 2.0));
                        RectY = Math.round((InkedTop - PadY) * 100) / 100;
                        RectH = Math.max(6.0, Math.round(((InkedBottom + PadY) - RectY) * 100) / 100);
                    }

                    const BoxLine = Box.line || 0;
                    if (BoxLine > 0 && MonacoInstance)
                    {
                        const M = MonacoInstance.getModel();
                        if (M && BoxLine <= M.getLineCount())
                        {
                            const LineContent = M.getLineContent(BoxLine) || "";
                            if (/^\s*(?:[-+*•]|(?:\d+|[a-zA-Z])\.|(?:\(\d+\)))\s+/.test(LineContent) || /^\s*\[\s*(?:[-+*•]|(?:\d+|[a-zA-Z])\.|(?:\(\d+\)))\s+/.test(LineContent))
                            {
                                const BulletIndent = 12.0;
                                RectX = Math.max(65.0, RectX - BulletIndent);
                                RectW += BulletIndent;
                            }
                        }
                    }

                    Rect.setAttribute("x", RectX.toFixed(2));
                    Rect.setAttribute("y", RectY.toFixed(2));
                    Rect.setAttribute("width", RectW.toFixed(2));
                    Rect.setAttribute("height", RectH.toFixed(2));
                    Rect.setAttribute("rx", "3.0");
                    Rect.setAttribute("ry", "3.0");

                    HighlightLayer.appendChild(Rect);

                    if (PageNum === ScrollTargetPage)
                    {
                        if (RectY < PrimaryTopY)
                        {
                            PrimaryTopY = RectY;
                        }
                        if ((RectY + RectH) > PrimaryBottomY)
                        {
                            PrimaryBottomY = RectY + RectH;
                        }
                    }
                }
            }
        );
    }

    if (AutoScroll && PrimaryPageSheet && PrimaryTopY !== Infinity && PrimaryBottomY !== -Infinity)
    {
        const Viewport = document.getElementById("PreviewViewport");
        if (Viewport)
        {
            const ViewportRect = Viewport.getBoundingClientRect();
            const PageRect = PrimaryPageSheet.getBoundingClientRect();
            const VbH = parseFloat(PrimaryPageSheet.dataset.baseHeight) || 864;
            const ScaleY = PageRect.height / VbH;

            const ArtifactTopInViewport = PageRect.top + (PrimaryTopY * ScaleY);
            const ArtifactBottomInViewport = PageRect.top + (PrimaryBottomY * ScaleY);
            const IsArtifactVisible =
                (ArtifactTopInViewport >= ViewportRect.top && ArtifactBottomInViewport <= ViewportRect.bottom) ||
                (ArtifactTopInViewport <= ViewportRect.top && ArtifactBottomInViewport >= ViewportRect.bottom);

            if (!IsArtifactVisible)
            {
                // Invariant Sheet top relative to scroll container content
                const SheetTopInContent = (PageRect.top - ViewportRect.top) + Viewport.scrollTop;
                const ArtifactCenterContentY = SheetTopInContent + (((PrimaryTopY + PrimaryBottomY) * 0.5) * ScaleY);
                let TargetScrollTop = Math.max(0, ArtifactCenterContentY - (Viewport.clientHeight / 2));
                if (FirstBoxLine === 1)
                {
                    TargetScrollTop = 0;
                }
                else
                {
                    const MaxScroll = Math.max(0, Viewport.scrollHeight - Viewport.clientHeight);
                    TargetScrollTop = Math.max(0, Math.min(TargetScrollTop, MaxScroll));
                }

                const CurrentDiff = Math.abs(Viewport.scrollTop - TargetScrollTop);
                if (CurrentDiff > 4)
                {
                    const ScrollBehavior = (Date.now() - LastTypingTimestamp < 800) ? "auto": "smooth";
                    Viewport.scrollTo
                    ({
                        top: TargetScrollTop,
                        behavior: ScrollBehavior
                    });
                }
            }
        }
    }
}

function HighlightSvgRect(PageNum, X, Y, Width, Height, AutoScroll = true)
{
    HighlightSvgRects
    (
        [ { page: PageNum, x: X, y: Y, width: Width, height: Height }], AutoScroll
    );
}

function HighlightSvgSpan(SpanId, AutoScroll = true)
{
    if (!IsSyncTexEnabled || !SpanId)
    {
        return ;
    }

    const Elem = ActiveSyncMap.find( (E) => E.span === SpanId) || (ActiveSpanMap && ActiveSpanMap[SpanId]);
    if (Elem && typeof Elem.x === "number")
    {
        HighlightSvgRect(Elem.page || 1, Elem.x, Elem.y, Elem.width, Elem.height, AutoScroll);
    }
}

const MATH_DEFINITION_FUNCTIONS = new Set
([
    "mat", "vec", "cases", "binom", "root", "round", "abs", "norm",
    "floor", "ceil", "lr"
]);

function FindEnclosingMathDefinitionBlock(SourceCode, CursorLine, CursorCol)
{
    if (!SourceCode)
    {
        return null;
    }

    const Lines = SourceCode.split(/\r?\n/);
    let CursorOffset = 0;
    for (let I = 0; I < CursorLine - 1 && I < Lines.length; I ++)
    {
        CursorOffset += Lines[I].length + 1;
    }
    CursorOffset += Math.max(0, CursorCol - 1);

    const DefRegex = /\b([a-zA-Z_][a-zA-Z0-9_.]*)\s*\(/g;
    let Match;
    const Blocks = [];

    while
    (
        (Match = DefRegex.exec(SourceCode)) !== null
    )
    {
        const Ident = Match[1];
        if (!MATH_DEFINITION_FUNCTIONS.has(Ident))
        {
            continue;
        }

        const StartOffset = Match.index;
        const OpenParenOffset = SourceCode.indexOf("(", StartOffset);
        if (OpenParenOffset === - 1)
        {
            continue;
        }

        let Depth = 1;
        let InStr = false;
        let CloseOffset = - 1;

        for (let I = OpenParenOffset + 1; I < SourceCode.length; I ++)
        {
            const Ch = SourceCode[I];
            const Prev = I > 0 ? SourceCode[I - 1]: "";

            if (Ch === '"' && Prev !== "\\")
            {
                InStr = ! InStr;
            }
            else if (!InStr)
            {
                if (Ch === "(")
                {
                    Depth ++;
                }
                else if (Ch === ")")
                {
                    Depth --;
                    if (Depth === 0)
                    {
                        CloseOffset = I;
                        break;
                    }
                }
            }
        }

        if (CloseOffset !== - 1)
        {
            if (CursorOffset > OpenParenOffset && CursorOffset <= CloseOffset)
            {
                Blocks.push
                ({
                    Name: Ident,
                    StartOffset: StartOffset,
                    OpenOffset: OpenParenOffset,
                    CloseOffset: CloseOffset,
                    Length: CloseOffset - StartOffset
                });
            }
        }
    }

    if (Blocks.length === 0)
    {
        return null;
    }

    Blocks.sort( (A, B) => A.Length - B.Length);
    return Blocks[0];
}

function FindTableCellBlock(SourceCode, CursorLine, CursorCol)
{
    if (!SourceCode)
    {
        return null;
    }

    const Lines = SourceCode.split(/\r?\n/);
    let CursorOffset = 0;
    for (let I = 0; I < CursorLine - 1 && I < Lines.length; I ++)
    {
        CursorOffset += Lines[I].length + 1;
    }
    CursorOffset += Math.max(0, CursorCol - 1);

    const CellRegex = /\btable\.cell(?:\s*\([^)]*\))?\s*\[/g;
    let Match;
    const Cells = [];

    while
    (
        (Match = CellRegex.exec(SourceCode)) !== null
    )
    {
        const StartOffset = Match.index;
        const OpenBracketOffset = SourceCode.indexOf("[", StartOffset);
        if (OpenBracketOffset === - 1)
        {
            continue;
        }

        let Depth = 1;
        let CloseOffset = - 1;
        for (let I = OpenBracketOffset + 1; I < SourceCode.length; I ++)
        {
            const Ch = SourceCode[I];
            const Prev = I > 0 ? SourceCode[I - 1]: "";
            if (Ch === "[" && Prev !== "\\")
            {
                Depth ++;
            }
            else if (Ch === "]" && Prev !== "\\")
            {
                Depth --;
                if (Depth === 0)
                {
                    CloseOffset = I;
                    break;
                }
            }
        }

        if (CloseOffset !== - 1)
        {
            if (CursorOffset >= StartOffset && CursorOffset <= CloseOffset + 1)
            {
                Cells.push
                ({
                    StartOffset: StartOffset,
                    OpenOffset: OpenBracketOffset,
                    CloseOffset: CloseOffset,
                    Length: CloseOffset - StartOffset
                });
            }
        }
    }

    if (Cells.length === 0)
    {
        return null;
    }

    Cells.sort( (A, B) => A.Length - B.Length);
    return Cells[0];
}

function FindAllMathEquationBlocks(SourceCode)
{
    if (!SourceCode)
    {
        return [];
    }

    const Lines = SourceCode.split(/\r?\n/);
    let InBlockComment = false;
    let InRaw = false;
    let InMath = false;
    let MathStart = - 1;
    let MathStartLine = 1;
    let MathStartCol = 1;
    let ByteOffset = 0;
    const Equations = [];

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx ++)
    {
        const LineText = Lines[LineIdx];
        const LineNum = LineIdx + 1;

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx ++)
        {
            const Ch = LineText[ColIdx];
            const Prev = ColIdx > 0 ? LineText[ColIdx - 1]: "";
            const Next = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1]: "";

            if (!InMath && Ch === "/" && Next === "*")
            {
                InBlockComment = true;
            }
            if (InBlockComment && Ch === "*" && Next === "/")
            {
                InBlockComment = false;
            }
            if (InBlockComment)
            {
                continue;
            }

            if (Ch === "`")
            {
                InRaw = ! InRaw;
                continue;
            }
            if (InRaw)
            {
                continue;
            }

            if (Ch === "$" && Prev !== "\\")
            {
                const Offset = ByteOffset + ColIdx;
                if (!InMath)
                {
                    InMath = true;
                    MathStart = Offset;
                    MathStartLine = LineNum;
                    MathStartCol = ColIdx + 1;
                }
                else
                {
                    const MathEnd = Offset + 1;
                    const MathEndLine = LineNum;
                    const MathEndCol = ColIdx + 1;

                    let LabelEnd = MathEnd;
                    const Remainder = LineText.substring(ColIdx + 1);
                    const LabelMatch = Remainder.match(/^\s*<[a-zA-Z0-9_\-:]+>/);
                    if (LabelMatch)
                    {
                        LabelEnd += LabelMatch[0].length;
                    }

                    Equations.push
                    ({
                        StartOffset: MathStart,
                        EndOffset: LabelEnd,
                        StartLine: MathStartLine,
                        StartCol: MathStartCol,
                        EndLine: MathEndLine,
                        EndCol: MathEndCol,
                        IsDisplay: (MathEndLine > MathStartLine)
                    });
                    InMath = false;
                }
            }
        }

        ByteOffset += LineText.length + 1;
    }

    return Equations;
}

function FindEnclosingMathEquation(SourceCode, CursorLine, CursorCol)
{
    if (!SourceCode)
    {
        return null;
    }

    const Lines = SourceCode.split(/\r?\n/);
    let CursorOffset = 0;
    for (let I = 0; I < CursorLine - 1 && I < Lines.length; I ++)
    {
        CursorOffset += Lines[I].length + 1;
    }
    CursorOffset += Math.max(0, CursorCol - 1);

    const Equations = FindAllMathEquationBlocks(SourceCode);
    const Matches = Equations.filter( (Eq) => CursorOffset >= Eq.StartOffset && CursorOffset <= Eq.EndOffset);
    if (Matches.length === 0)
    {
        return null;
    }

    Matches.sort( (A, B) => (A.EndOffset - A.StartOffset) - (B.EndOffset - B.StartOffset));
    return Matches[0];
}

function ScrollPreviewToNearestLine(TargetLine)
{
    if (!ActiveSyncMapByLine || ActiveSyncMapByLine.size === 0)
    {
        return ;
    }

    const Viewport = document.getElementById("PreviewViewport");
    if (!Viewport)
    {
        return ;
    }

    // Preamble guard: if target line is 1, anchor cleanly to Page 1 top
    if (TargetLine === 1)
    {
        if (Viewport.scrollTop > 10)
        {
            const ScrollBehavior = (Date.now() - LastTypingTimestamp < 800) ? "auto": "smooth";
            Viewport.scrollTo
            ({
                top: 0,
                behavior: ScrollBehavior
            });
        }
        return ;
    }

    let BestLine = null;
    let BestDist = Infinity;

    // Scan nearby lines only (within 6 lines max) to avoid jumping to document head
    for (let Offset = 1; Offset <= 6; Offset ++)
    {
        const CheckLines = [TargetLine + Offset, TargetLine - Offset];
        for (const CL of CheckLines)
        {
            if (CL >= 1 && ActiveSyncMapByLine.has(CL) && CL > FirstDocumentBodyLine && !RepeatedSyncLines.has(CL))
            {
                const Candidates = ActiveSyncMapByLine.get(CL);
                if (Candidates && Candidates.length > 0)
                {
                    BestLine = CL;
                    BestDist = Offset;
                    break;
                }
            }
        }
        if (BestLine !== null)
        {
            break;
        }
    }

    if (BestLine === null)
    {
        return ;
    }

    const LineElems = ActiveSyncMapByLine.get(BestLine);
    if (!LineElems || LineElems.length === 0)
    {
        return ;
    }

    const FirstElem = LineElems[0];
    const PageNum = FirstElem.page || 1;
    const TargetPageSheet = document.getElementById(`PageSheet_${PageNum}`) || document.querySelectorAll(".PageSheet")[PageNum - 1];
    if (!TargetPageSheet)
    {
        return ;
    }

    const ViewportRect = Viewport.getBoundingClientRect();
    const PageRect = TargetPageSheet.getBoundingClientRect();
    const VbH = parseFloat(TargetPageSheet.dataset.baseHeight) || 864;
    const ScaleY = PageRect.height / VbH;

    const ElemHeight = FirstElem.height || 12;
    const ElemTopInViewport = PageRect.top + (FirstElem.y * ScaleY);
    const ElemBottomInViewport = PageRect.top + ((FirstElem.y + ElemHeight) * ScaleY);
    const IsElemVisible =
        (ElemTopInViewport >= ViewportRect.top && ElemBottomInViewport <= ViewportRect.bottom) ||
        (ElemTopInViewport <= ViewportRect.top && ElemBottomInViewport >= ViewportRect.bottom);

    if (IsElemVisible)
    {
        return ;
    }

    // Invariant Sheet top relative to scroll container content
    const SheetTopInContent = (PageRect.top - ViewportRect.top) + Viewport.scrollTop;
    const TargetContentY = SheetTopInContent + ((FirstElem.y + (ElemHeight * 0.5)) * ScaleY);
    const MaxScroll = Math.max(0, Viewport.scrollHeight - Viewport.clientHeight);
    const TargetScrollTop = Math.max(0, Math.min(TargetContentY - (Viewport.clientHeight / 2), MaxScroll));

    if (Math.abs(Viewport.scrollTop - TargetScrollTop) > 4)
    {
        const ScrollBehavior = (Date.now() - LastTypingTimestamp < 800) ? "auto": "smooth";
        Viewport.scrollTo
        ({
            top: TargetScrollTop,
            behavior: ScrollBehavior
        });
    }
}

function PerformForwardSync(Line, Col, ForceAutoScroll = true)
{
    if (!IsSyncTexEnabled || !ActiveSyncMap || ActiveSyncMap.length === 0)
    {
        ClearSyncHighlights();
        return ;
    }

    if (Line === 1 && RepeatedSyncLines.has(Line))
    {
        ClearSyncHighlights();
        if (ForceAutoScroll)
        {
            const Viewport = document.getElementById("PreviewViewport");
            if (Viewport && Viewport.scrollTop > 10)
            {
                const ScrollBehavior = (Date.now() - LastTypingTimestamp < 800) ? "auto": "smooth";
                Viewport.scrollTo
                ({
                    top: 0,
                    behavior: ScrollBehavior
                });
            }
        }
        return ;
    }

    const Model = MonacoInstance ? MonacoInstance.getModel(): null;
    if (!Model)
    {
        return ;
    }

    const LineText = Model.getLineContent(Line) || "";
    // 1. Text Selection in Monaco (Tier 1: Character-to-Character Precision)
    if (MonacoInstance)
    {
        const Selection = MonacoInstance.getSelection();
        if (Selection && !Selection.isEmpty())
        {
            const SelStartLine = Selection.startLineNumber;
            const SelStartCol = Selection.startColumn;
            const SelEndLine = Selection.endLineNumber;
            const SelEndCol = Selection.endColumn;

            const StartOffsetUtf16 = Model.getOffsetAt({ lineNumber: SelStartLine, column: SelStartCol });
            const EndOffsetUtf16 = Model.getOffsetAt({ lineNumber: SelEndLine, column: SelEndCol });
            const SourceText = Model.getValue();
            const StartByte = new TextEncoder().encode(SourceText.slice(0, StartOffsetUtf16)).length;
            const EndByte = new TextEncoder().encode(SourceText.slice(0, EndOffsetUtf16)).length;

            if (StartByte < EndByte)
            {
                // Filter to ONLY elements whose source byte falls inside [StartByte, EndByte)
                const Matched = ActiveSyncMap.filter
                (
                    (Elem) =>
                    {
                        const IsMultiLine = (Elem.end_line - Elem.line) >= 2;
                        const IsNumbering = IsMultiLine && Elem.width < 50 && Elem.x > 450;
                        if (IsNumbering)
                        {
                            return false;
                        }
                        return Elem.start < EndByte && Elem.end > StartByte;
                    }
                );

                if (Matched.length > 0)
                {
                    const LineBoxes = GroupSelectedElementsIntoLineBoxes(Matched);
                    if (LineBoxes.length > 0)
                    {
                        HighlightSvgRects(LineBoxes, ForceAutoScroll);
                        return ;
                    }
                }

                ClearSyncHighlights();
                return ;
            }
        }
    }
    // 2. Line Content Elements & Syntax Tree Context
    const TrimmedLine = LineText.trim();
    const CursorOffset = Model.getOffsetAt({ lineNumber: Line, column: Col });
    const SourceText = Model.getValue();
    const AllMathIntervals = GetMathIntervals(SourceText);
    const ActiveMathInterval = AllMathIntervals.find((Int) => CursorOffset >= Int.Start && CursorOffset <= Int.End);

    const MathSpans = [];
    const MathRegex = /(?<!\\)\$(?:[^$]|\\\$)*\$/g;
    let MMatch;
    while ((MMatch = MathRegex.exec(LineText)) !== null)
    {
        MathSpans.push
        ({
            StartCol: MMatch.index + 1,
            EndCol: MMatch.index + MMatch[0].length
        });
    }
    const ActiveMathSpan = MathSpans.find((M) => Col >= M.StartCol && Col <= M.EndCol);

    const SameLineRaw = ActiveSyncMapByLine.get(Line) || (ActiveSyncMap.length < 500 ? ActiveSyncMap : []);
    let SameLineCandidates = SameLineRaw.filter
    (
        (Elem) => (Elem.line === Line && Elem.end_line === Line) && !Elem.is_outline && !IsFullTableShape(Elem)
    );
    if (RepeatedSyncLines.has(Line))
    {
        SameLineCandidates = SameLineCandidates.filter((Elem) => (Elem.page || 1) === 1);
    }

    if (ActiveMathInterval)
    {
        // Cursor is INSIDE a math container (inline or multiline display equation)
        const MathStartPos = Model.getPositionAt(ActiveMathInterval.Start);
        const MathEndPos = Model.getPositionAt(ActiveMathInterval.End);
        const MathStartLine = MathStartPos.lineNumber;
        const MathEndLine = MathEndPos.lineNumber;

        // Check if cursor is on a math container/delimiter line (e.g. mat(, vec(, cases(, or "(")
        const IsMathDelimLine = TrimmedLine === "(" || TrimmedLine === ")" || TrimmedLine === "mat" || TrimmedLine === "vec" || TrimmedLine === "cases" || /^(mat|vec|cases)\s*\(/.test(TrimmedLine);
        if (IsMathDelimLine)
        {
            let DelimStartLine = Line;
            if (Line > MathStartLine)
            {
                const PrevLineText = (Model.getLineContent(Line - 1) || "").trim();
                if (/^(mat|vec|cases)$/.test(PrevLineText))
                {
                    DelimStartLine = Line - 1;
                }
            }

            let DelimEndLine = Line;
            let ParenDepth = 0;
            let FoundOpen = false;
            for (let L = DelimStartLine; L <= MathEndLine; L++)
            {
                const CurLText = Model.getLineContent(L) || "";
                for (let CharIdx = 0; CharIdx < CurLText.length; CharIdx++)
                {
                    if (CurLText[CharIdx] === "(")
                    {
                        ParenDepth++;
                        FoundOpen = true;
                    }
                    else if (CurLText[CharIdx] === ")")
                    {
                        ParenDepth--;
                        if (FoundOpen && ParenDepth === 0)
                        {
                            DelimEndLine = L;
                            break;
                        }
                    }
                }
                if (FoundOpen && ParenDepth === 0)
                {
                    break;
                }
            }

            const MathDelimElems = ActiveSyncMap.filter
            (
                (Elem) => Elem.line >= DelimStartLine && Elem.line <= DelimEndLine && !Elem.is_outline && !IsFullTableShape(Elem) && !(Elem.width < 50 && Elem.x > 450)
            );
            if (MathDelimElems.length > 0)
            {
                const FormulaBoxes = GroupElementsIntoVisualBoxes(MathDelimElems);
                for (const Box of FormulaBoxes)
                {
                    Box.x -= 8.5;
                    Box.width += 13.5;
                }
                HighlightSvgRects(FormulaBoxes, ForceAutoScroll);
                return ;
            }
        }

        let MathCandidates = SameLineCandidates.filter((Elem) => !(Elem.width < 50 && Elem.x > 450));
        if (ActiveMathSpan)
        {
            MathCandidates = MathCandidates.filter
            (
                (Elem) => Elem.col >= ActiveMathSpan.StartCol && Elem.end_col <= (ActiveMathSpan.EndCol + 1)
            );
        }

        if (MathCandidates.length > 0)
        {
            const ColIdx = Col - 1;
            let TokenStart = ColIdx;
            while (TokenStart > 0 && /[a-zA-Z0-9_]/.test(LineText[TokenStart - 1])) { TokenStart--; }
            let TokenEnd = ColIdx;
            while (TokenEnd < LineText.length && /[a-zA-Z0-9_]/.test(LineText[TokenEnd])) { TokenEnd++; }

            // Check if cursor is on a function call atom e.g. f(x)
            let AtomEnd = TokenEnd;
            if (TokenEnd < LineText.length && LineText[TokenEnd] === "(")
            {
                let Depth = 1;
                let Pos = TokenEnd + 1;
                while (Pos < LineText.length && Depth > 0)
                {
                    if (LineText[Pos] === "(") { Depth++; }
                    else if (LineText[Pos] === ")") { Depth--; }
                    Pos++;
                }
                if (Depth === 0)
                {
                    AtomEnd = Pos;
                }
            }

            if (AtomEnd > TokenEnd)
            {
                const AtomStartCol = TokenStart + 1;
                const AtomEndCol = AtomEnd;
                const AtomElems = MathCandidates.filter
                (
                    (Elem) => Elem.col >= AtomStartCol && Elem.col <= (AtomEndCol + 1)
                );
                if (AtomElems.length > 0)
                {
                    const AtomBoxes = GroupElementsIntoVisualBoxes(AtomElems);
                    HighlightSvgRects(AtomBoxes, ForceAutoScroll);
                    return ;
                }
            }

            const TokenStartCol = TokenStart + 1;
            const TokenEndCol = Math.max(TokenStartCol, TokenEnd);
            let BestSubElem = MathCandidates.find((Elem) => Elem.col >= TokenStartCol && Elem.col <= TokenEndCol);
            if (!BestSubElem)
            {
                BestSubElem = MathCandidates.find((Elem) => Col >= Elem.col && Col <= Elem.end_col);
            }
            if (!BestSubElem)
            {
                let MinDist = Infinity;
                for (const Elem of MathCandidates)
                {
                    const Mid = (Elem.col + Elem.end_col) / 2;
                    const Dist = Math.abs(Col - Mid);
                    if (Dist < MinDist && Dist <= 4.0)
                    {
                        MinDist = Dist;
                        BestSubElem = Elem;
                    }
                }
            }

            if (BestSubElem)
            {
                HighlightSvgRects([BestSubElem], ForceAutoScroll);
                return ;
            }

            const FormulaBoxes = GroupElementsIntoVisualBoxes(MathCandidates);
            HighlightSvgRects(FormulaBoxes, ForceAutoScroll);
            return ;
        }
    }

    // Check if cursor is on table.cell [ or [ of a table.cell
    const IsTableCellBracket = TrimmedLine === "[" && (Line > 1 && (Model.getLineContent(Line - 1) || "").includes("table.cell"));
    const IsTableCellHeader = /^\s*table\.cell\b/.test(LineText);
    if (IsTableCellBracket || IsTableCellHeader)
    {
        const BracketStartLine = IsTableCellBracket ? Line : Line;
        let BracketDepth = 0;
        let CellEndLine = Line;
        let FoundOpen = false;
        const MaxScan = Math.min(Model.getLineCount(), Line + 35);

        for (let L = BracketStartLine; L <= MaxScan; L++)
        {
            const CurLText = Model.getLineContent(L) || "";
            for (let CharIdx = 0; CharIdx < CurLText.length; CharIdx++)
            {
                if (CurLText[CharIdx] === "[")
                {
                    BracketDepth++;
                    FoundOpen = true;
                }
                else if (CurLText[CharIdx] === "]")
                {
                    BracketDepth--;
                    if (FoundOpen && BracketDepth === 0)
                    {
                        CellEndLine = L;
                        break;
                    }
                }
            }
            if (FoundOpen && BracketDepth === 0)
            {
                break;
            }
        }

        const CellElems = ActiveSyncMap.filter
        (
            (Elem) => Elem.line >= Line && Elem.line <= CellEndLine && !Elem.is_outline && !IsFullTableShape(Elem)
        );
        if (CellElems.length > 0)
        {
            const GroupedBoxes = GroupElementsIntoVisualBoxes(CellElems);
            HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
            return ;
        }
    }

    if (SameLineCandidates.length === 0)
    {
        // Container header or block boundary: check if cursor is on a container declaration
        if (/^\s*(#table|table\.cell|table\.header|#grid|#block|#rect|#box)\b/.test(LineText) || TrimmedLine === "[" || TrimmedLine === "]" || TrimmedLine === "(" || TrimmedLine === ")")
        {
            const ContainerElems = ActiveSyncMap.filter((E) => E.line > Line && E.line <= (Line + 25) && Math.abs(E.line - Line) <= 15 && !E.is_outline && !IsFullTableShape(E));
            if (ContainerElems.length > 0)
            {
                const ValidElems = (ActiveOutlineLine > 0 && Line > ActiveOutlineLine) ? ContainerElems.filter((E) => (E.page || 1) !== 1) : ContainerElems;
                const TargetList = ValidElems.length > 0 ? ValidElems : ContainerElems;
                const FirstTargetPage = TargetList[0].page || 1;
                const PageElems = TargetList.filter((E) => (E.page || 1) === FirstTargetPage);
                if (PageElems.length > 0)
                {
                    const GroupedBoxes = GroupElementsIntoVisualBoxes(PageElems);
                    HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
                    return ;
                }
            }
        }

        ClearSyncHighlights();
        if (ForceAutoScroll)
        {
            ScrollPreviewToNearestLine(Line);
        }
        return ;
    }
    else if (MathSpans.length > 0)
    {
        // Cursor is OUTSIDE $ ... $: filter out all math elements so ONLY prose is highlighted!
        SameLineCandidates = SameLineCandidates.filter
        (
            (Elem) => !MathSpans.some((M) => Elem.col >= M.StartCol && Elem.end_col <= (M.EndCol + 1))
        );
        if (SameLineCandidates.length === 0)
        {
            ClearSyncHighlights();
            return ;
        }
    }

    // 3. Table Cells on this line (support nested brackets)
    const LineCells = [];
    let BracketDepth = 0;
    let CellStart = -1;
    for (let I = 0; I < LineText.length; I++)
    {
        const Ch = LineText[I];
        if (Ch === "[")
        {
            if (BracketDepth === 0) { CellStart = I + 1; }
            BracketDepth++;
        }
        else if (Ch === "]")
        {
            BracketDepth--;
            if (BracketDepth === 0 && CellStart !== -1)
            {
                LineCells.push({ StartCol: CellStart, EndCol: I + 1 });
                CellStart = -1;
            }
        }
    }

    if (LineCells.length > 1)
    {
        const InsideCell = LineCells.find((C) => Col >= C.StartCol && Col <= C.EndCol);
        if (InsideCell)
        {
            const MatchingCellElems = SameLineCandidates.filter
            (
                (Elem) => Elem.col >= InsideCell.StartCol && Elem.end_col <= (InsideCell.EndCol + 1)
            );
            if (MatchingCellElems.length > 0)
            {
                const GroupedBoxes = GroupElementsIntoVisualBoxes(MatchingCellElems);
                HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
                return ;
            }
        }
        else
        {
            const GroupedBoxes = GroupElementsIntoVisualBoxes(SameLineCandidates);
            HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
            return ;
        }
    }
        // Check for function call arguments on this line (e.g. MetricBadge("Throughput", 98))
        const CallBoxElem = SameLineCandidates.find( (E) => String(E.span).startsWith("call_box_"));
        const CallArgElems = SameLineCandidates.filter( (E) => String(E.span).startsWith("call_arg_"));

        if (CallBoxElem && CallArgElems.length > 0)
        {
            const InsideArg = CallArgElems.find( (E) => Col >= E.col && Col <= E.end_col);
            if (InsideArg)
            {
                const GroupedBoxes = GroupElementsIntoVisualBoxes([InsideArg]);
                HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
                return ;
            }
            else if (Col >= CallBoxElem.col && Col <= CallBoxElem.end_col)
            {
                const GroupedBoxes = GroupElementsIntoVisualBoxes([CallBoxElem]);
                HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
                return ;
            }
        }

        // Check for footnote calls on this line: #footnote[...] or #footnote(...)
        const FootnoteRegex = /#footnote(?:\s*\[|\s*\()/g;
        let FnMatch;
        const FootnoteRanges = [];
        while ((FnMatch = FootnoteRegex.exec(LineText)) !== null)
        {
            const StartIdx = FnMatch.index + 1;
            const OpenBracket = LineText[FnMatch.index + FnMatch[0].length - 1];
            const CloseBracket = OpenBracket === "[" ? "]" : ")";
            let Depth = 1;
            let EndIdx = FnMatch.index + FnMatch[0].length;
            while (EndIdx < LineText.length && Depth > 0)
            {
                if (LineText[EndIdx] === OpenBracket) Depth++;
                else if (LineText[EndIdx] === CloseBracket) Depth--;
                EndIdx++;
            }
            FootnoteRanges.push({ StartCol: StartIdx, EndCol: EndIdx });
        }

        if (FootnoteRanges.length > 0)
        {
            const ActiveFootnote = FootnoteRanges.find( (R) => Col >= R.StartCol && Col <= R.EndCol);
            if (ActiveFootnote)
            {
                // Cursor is inside footnote: highlight only the footnote element(s)
                const FootnoteElems = SameLineCandidates.filter
                (
                    (Elem) => (Elem.col >= ActiveFootnote.StartCol && Elem.end_col <= ActiveFootnote.EndCol + 2) || (Elem.y > 650 && Elem.line === Line)
                );
                if (FootnoteElems.length > 0)
                {
                    const GroupedBoxes = GroupElementsIntoVisualBoxes(FootnoteElems);
                    HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
                    return ;
                }
            }
            else
            {
                // Cursor is outside footnote: filter out footnote elements from line candidates
                SameLineCandidates = SameLineCandidates.filter
                (
                    (Elem) =>
                    {
                        const InsideFn = FootnoteRanges.some( (R) => Elem.col >= R.StartCol && Elem.end_col <= R.EndCol + 2);
                        return !InsideFn && Elem.y < 700;
                    }
                );
            }
        }

        // Vertical proximity filtering: ensure highlighted elements belong to the same visual vertical band as target element
        if (SameLineCandidates.length > 1)
        {
            let PivotElem = SameLineCandidates[0];
            let BestDist = Infinity;
            for (const Elem of SameLineCandidates)
            {
                if (Col >= Elem.col && Col <= Elem.end_col)
                {
                    PivotElem = Elem;
                    break;
                }
                const Mid = (Elem.col + Elem.end_col) / 2;
                const Dist = Math.abs(Col - Mid);
                if (Dist < BestDist)
                {
                    BestDist = Dist;
                    PivotElem = Elem;
                }
            }

            const PivotPage = PivotElem.page || 1;
            SameLineCandidates = SameLineCandidates.filter
            (
                (Elem) => (Elem.page || 1) === PivotPage && Math.abs(Elem.y - PivotElem.y) < 90.0
            );
        }

        // Highlight everything on this line in that same hierarchy
        const GroupedBoxes = GroupElementsIntoVisualBoxes(SameLineCandidates);
        // If line contains a math vector/matrix, expand to frame outer delimiters
        if
        (
            TrimmedLine.includes("vec(") ||
            TrimmedLine.includes("mat(") ||
            TrimmedLine.includes("cases(")
        )
        {
            for (const Box of GroupedBoxes)
            {
                Box.x -= 8.5;
                Box.width += 13.5;
            }
        }
        // Never highlight a lone character/glyph unless selected in editor
        if
        (
            GroupedBoxes.length === 1 &&
            GroupedBoxes[0].width < 12.0 &&
            GroupedBoxes[0].height < 15.0 &&
            TrimmedLine.length <= 2
        )
        {
            ClearSyncHighlights();
            return ;
        }

        HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
    }
// Make functions accessible from onclick handlers
window.OpenFileFromWorkspace = OpenFileFromWorkspace;
window.RemoveWorkspaceDirectory = RemoveWorkspaceDirectory;
window.DeleteWorkspaceFile = DeleteWorkspaceFile;
window.SelectDashboardDirectory = SelectDashboardDirectory;
window.PickFolderFromDisk = PickFolderFromDisk;
window.SetEditorFontSize = SetEditorFontSize;
window.IncreaseEditorFontSize = IncreaseEditorFontSize;
window.DecreaseEditorFontSize = DecreaseEditorFontSize;
window.ResetEditorFontSize = ResetEditorFontSize;
window.ToggleFullscreen = ToggleFullscreen;
window.SetZoom = SetZoom;
window.FitWidth = FitWidth;
window.FitPage = FitPage;
window.ToggleShortcutsModal = ToggleShortcutsModal;
window.OpenDocumentInTab = OpenDocumentInTab;
window.SwitchToTab = SwitchToTab;
window.CloseTab = CloseTab;
window.OpenProjectInExplorer = OpenProjectInExplorer;
window.OpenStandaloneDocument = OpenStandaloneDocument;
window.PickStandaloneFileFromDisk = PickStandaloneFileFromDisk;
window.TrackStandaloneDocument = TrackStandaloneDocument;
window.SwitchView = SwitchView;
window.RenderDashboard = RenderDashboard;
window.RenderHomepage = RenderHomepage;
window.CreateFileInProject = CreateFileInProject;
window.ShowNewDocumentModal = ShowNewDocumentModal;
window.CloseNewDocumentModal = CloseNewDocumentModal;
window.ConfirmCreateNewDocument = ConfirmCreateNewDocument;
window.ToggleSettingsModal = (Show) =>
{
    if (Show)
    {
        OpenSettingsModal("appearance");
    }
    else
    {
        CloseSettingsModal();
    }
};
window.OpenSettingsModal = OpenSettingsModal;
window.CloseSettingsModal = CloseSettingsModal;
window.RenameWorkspaceDocument = RenameWorkspaceDocument;
window.RemoveRecentDocument = RemoveRecentDocument;

window.addEventListener
(
    "DOMContentLoaded",
    async () =>
    {
        await EnsureSessionAuthToken();
        LoadUISettings();
        ApplyUISettings();
        SetupEventListeners();
        SetupAppearanceEventListeners();
        UpdateBlackPageMode();
        SetUIMode(CurrentUIMode);
        UpdateFontSizeUI();
        if (window.__TAURI__ && window.__TAURI__.window && typeof window.__TAURI__.window.getCurrentWindow === "function")
        {
            window.__TAURI__.window.getCurrentWindow().isFullscreen()
                .then((IsFs) =>
                {
                    IsAppFullscreen = Boolean(IsFs);
                    UpdateFullscreenUI(IsAppFullscreen);
                })
                .catch(() => { UpdateFullscreenUI(false); });
        }
        else
        {
            UpdateFullscreenUI(false);
        }
        SetupZoomControls();
        try
        {
            localStorage.removeItem("TypstStudio_PageZoom");
            document.body.style.zoom = "";
        }
        catch (Ignored) {}
        UpdateCheatSheetBadges();

        // 1. Initialize Monaco and wait for complete readiness
        await InitializeMonaco();
        InitializeSyncTex();

        // 2. Load added project directories and workspace files
        await LoadWorkspaceInfo();

        // 3. Initialize Explorer sidebar, resizing, and project view
        await InitExplorer();

        // 4. Initialize Tabs and open the active / target document
        await InitEditorTabs();

        LoadAvailableFonts();
        SetupAssetDragAndDrop();
        SetViewportLayout(localStorage.getItem("TypstStudio_Layout") || "split");
        if (localStorage.getItem("TypstStudio_OutlineVisible") === "true")
        {
            ToggleDocumentOutline(true);
        }

        // Steve Jobs Homepage: The starting page when the app runs
        SwitchView("dashboard");

        // Safety fallback: ensure splash is never permanently stuck
        setTimeout
        (
            () =>
            {
                const Splash = document.getElementById("LoadingSplash");
                if (Splash)
                {
                    Splash.remove();
                }
            },
            6000
        );
    }
);
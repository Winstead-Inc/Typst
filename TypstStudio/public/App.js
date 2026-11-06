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
  font: ("Linux Libertine", "Times New Roman", "Georgia"),
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
  font: ("Times New Roman", "Segoe UI"),
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
  font: ("Segoe UI", "Arial"),
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
  font: ("Times New Roman", "TT Lakes Neue Trial Condensed Medium"),
  size: 10.5pt,
  lang: "en"
)

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
  #text(10pt)[By Dr. Antigravity #footnote[Advanced Agentic Coding Research Group] • Published: #datetime.today().display()]\\
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
  mat(
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
  vec(
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
  cases(
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
  root(
    3,
    x^3 + y^3 + z^3
  )
$

Display binomial expansion theorem:
$
  sum_(k=0)^n
  binom(
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
let CurrentZoomLevel = 1.0;
let CurrentPageCount = 1;
let CurrentActivePage = 1;
let LastCompiledPages = [];
let IsBlackPageMode = localStorage.getItem("typst_black_page_mode") === "true";
let ActiveAbortController = null;
let RenderToken = 0;
let SessionAuthToken = window.__TYPST_STUDIO_AUTH_TOKEN__ || "";
let IsSyncTexEnabled = localStorage.getItem("typst_synctex_enabled") !== "false";
let ActiveSpanMap = {};
let ActiveSyncMap = [];
let ActiveHighlightSpan = null;
let ActiveHighlightBox = null;
let ActiveHighlightBoxes = [];
let SuppressForwardSync = false;
let SyncLineDecorations = null;
let ForwardSyncDebounceTimer = null;

async function EnsureSessionAuthToken()
{
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
    const Headers = Options.headers ? { ...Options.headers } : {};

    if (Token)
    {
        Headers["x-typst-auth-token"] = Token;
    }

    return fetch(Url, { ...Options, headers: Headers });
}
let LastSavedContent = "";
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

    Toast.innerHTML = `${IconSvg}<span Class = "ToastMessage">${Message}</span>`;
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
    LastSavedContent = typeof Content === "string" ? Content : (MonacoInstance ? MonacoInstance.getValue() : "");
    IsDocumentDirty = false;
    UpdateDirtyStateUI();
}

function CheckDocumentDirty()
{
    if (!MonacoInstance) { return; }
    const Current = MonacoInstance.getValue();
    const WasDirty = IsDocumentDirty;
    IsDocumentDirty = (Current !== LastSavedContent);
    if (WasDirty !== IsDocumentDirty)
    {
        UpdateDirtyStateUI();
    }
}

function UpdateDirtyStateUI()
{
    const Dot = document.getElementById("UnsavedDirtyDot");
    const TitleInput = document.getElementById("DocumentTitleInput");
    const ActiveName = TitleInput ? TitleInput.value.trim() : (CurrentFilePath ? CurrentFilePath.split(/[\/\\]/).pop() : "main.typ");

    if (Dot)
    {
        Dot.style.display = IsDocumentDirty ? "inline-block" : "none";
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

function JumpToEditorLocation(Line, Col)
{
    if (!MonacoInstance) { return; }
    MonacoInstance.revealPositionInCenter({ lineNumber: Line, column: Col });
    MonacoInstance.setPosition({ lineNumber: Line, column: Col });
    MonacoInstance.focus();
}

// Appearance & UI Settings
const UI_SETTINGS_STORAGE_KEY = "TypstStudio_UISettings";

const DEFAULT_UI_SETTINGS =
{
    Scale: 100, // 100% = Normal / Default (before user prompted to change it)
    Font: "Teko",
    CustomFont: ""
};

let CurrentUISettings = { ...DEFAULT_UI_SETTINGS };

const UI_FONT_PRESETS =
{
    "Teko":
    {
        Family: '"Teko", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        Weight: "300",
        LetterSpacing: "0.8px"
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
    "System UI":
    {
        Family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        Weight: "400",
        LetterSpacing: "0px"
    }
};

const UI_DIMENSION_CALIBRATION =
{
    "--ui-font-body": [16, 19],
    "--ui-font-ctrl": [12, 17],
    "--ui-font-header-logo": [16, 18],
    "--ui-font-brand": [18, 21],
    "--ui-font-engine-tag": [11, 12],
    "--ui-font-doc-input": [13, 14],
    "--ui-width-doc-input": [180, 210],
    "--ui-width-doc-menu": [320, 350],
    "--ui-font-menu-title": [11, 16],
    "--ui-font-menu-item": [12, 17],
    "--ui-font-menu-path": [10, 13],
    "--ui-font-menu-footer": [11, 16],
    "--ui-font-status": [11, 16],
    "--ui-font-status-text": [11, 17],
    "--ui-font-duration": [11, 13],
    "--ui-font-toggle": [12, 16],
    "--ui-font-select": [12, 16],
    "--ui-font-btn": [12, 18],
    "--ui-font-icon-btn": [12, 17],
    "--ui-font-nav-tab": [12, 17],
    "--ui-font-statusbar": [11, 15],
    "--ui-font-preview-btn": [11, 16],
    "--ui-font-preview-indicator": [12, 14],
    "--ui-font-error-title": [12, 16],
    "--ui-font-error-content": [13, 14],
    "--ui-font-dash-title": [22, 34],
    "--ui-font-dash-sub": [13, 19],
    "--ui-font-stat-label": [14, 16],
    "--ui-font-stat-val": [32, 42],
    "--ui-font-stat-doc": [14, 19],
    "--ui-font-panel-title": [15, 22],
    "--ui-font-panel-hint": [12, 16],
    "--ui-font-dash-input": [13, 14],
    "--ui-font-dir-path": [13, 14],
    "--ui-font-dir-badge": [13, 16],
    "--ui-font-filter-banner": [15, 18],
    "--ui-font-filter-btn": [13, 15],
    "--ui-font-dash-search": [12, 16],
    "--ui-font-card-name": [13, 19],
    "--ui-font-card-dir": [11, 13],
    "--ui-font-card-details": [11, 14],
    "--ui-font-card-size": [11, 12],
    "--ui-font-card-btn": [11, 16],
    "--ui-font-empty": [12, 17],
    "--ui-height-header": [48, 52],
    "--ui-height-statusbar": [24, 28],
    "--ui-height-toolbar": [36, 40]
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
    return Math.max(9, Math.round(NormalVal + (LargeVal - NormalVal) * Interpolation));
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
                CurrentUISettings.Font = Parsed.Font;
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
    for (const [PropName, [NormalVal, LargeVal]] of Object.entries(UI_DIMENSION_CALIBRATION))
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
        const CustomName = CurrentUISettings.CustomFont ? CurrentUISettings.CustomFont.trim() : "sans-serif";
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
        MonacoInstance.updateOptions({ fontSize: Math.max(12, EditorFontSize) });
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

    if (ScaleBadge)
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
}

function SetupAppearanceEventListeners()
{
    // Preset Buttons
    const PresetButtons = document.querySelectorAll(".ScalePresetBtn");
    PresetButtons.forEach
    (
        (Btn) =>
        {
            Btn.addEventListener
            (
                "click",
                () =>
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
            "input",
            (E) =>
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
            "change",
            (E) =>
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
            "keydown",
            (E) =>
            {
                if (E.key === "Enter")
                {
                    CommitCustomFont();
                }
            }
        );
    }

    // Reset Button
    const ResetBtn = document.getElementById("ResetAppearanceBtn");
    if (ResetBtn)
    {
        ResetBtn.addEventListener
        (
            "click",
            () =>
            {
                CurrentUISettings.Scale = DEFAULT_UI_SETTINGS.Scale;
                CurrentUISettings.Font = DEFAULT_UI_SETTINGS.Font;
                CurrentUISettings.CustomFont = DEFAULT_UI_SETTINGS.CustomFont;
                ApplyUISettings();
            }
        );
    }
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

    // Helper to get clean line text with strings/comments masked
    function GetMaskedLine(LineText)
    {
        let Masked = "";
        let InStr = false;
        for (let I = 0; I < LineText.length; I++)
        {
            const C = LineText[I];
            const NextC = I + 1 < LineText.length ? LineText[I + 1] : "";
            const PrevC = I > 0 ? LineText[I - 1] : "";
            if (C === '"' && PrevC !== "\\")
            {
                InStr = !InStr;
                Masked += " ";
                continue;
            }
            if (InStr)
            {
                Masked += " ";
                continue;
            }
            if (C === "/" && NextC === "/")
            {
                Masked += " ".repeat(LineText.length - I);
                break;
            }
            Masked += C;
        }
        return Masked;
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx++)
    {
        const LineNum = LineIdx + 1;
        const LineText = Lines[LineIdx];
        let InLineComment = false;

        for (let ColIdx = 0; ColIdx < LineText.length; ColIdx++)
        {
            const ColNum = ColIdx + 1;
            const Char = LineText[ColIdx];
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1] : "";
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1] : "";

            if (InLineComment) { break; }

            // Raw blocks ```
            if (!InString && BlockCommentDepth === 0 && Char === "`")
            {
                if (LineText.substring(ColIdx, ColIdx + 3) === "```")
                {
                    InRawBlock = !InRawBlock;
                    ColIdx += 2;
                    continue;
                }
                else if (!InRawBlock)
                {
                    InRawInline = !InRawInline;
                    continue;
                }
            }
            if (InRawBlock || InRawInline) { continue; }

            // Block comments /* */
            if (!InString && Char === "/" && NextChar === "*")
            {
                BlockCommentDepth++;
                ColIdx++;
                continue;
            }
            if (!InString && BlockCommentDepth > 0 && Char === "*" && NextChar === "/")
            {
                BlockCommentDepth--;
                ColIdx++;
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
                InString = !InString;
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
                const MatchDelim = Char === ")" ? "(" : (Char === "}" ? "{" : "[");

                if (Stack.length === 0 || Stack[Stack.length - 1].Delim !== MatchDelim)
                {
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
                    continue;
                }

                const Opener = Stack.pop();

                // Monolith Check: Same line openers and closers are valid Monoliths
                if (LineNum === Opener.Line)
                {
                    continue;
                }

                // Multiline container: Evaluate Vector 1 (Opener line) and Vector 2 (Closer line)
                const MaskedOpenerLine = GetMaskedLine(Lines[Opener.Line - 1]);
                const MaskedCloserLine = GetMaskedLine(LineText);

                // --- VECTOR 1 EVALUATION (Opening Container Line) ---
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

                // --- VECTOR 2 EVALUATION (Closing Container Line) ---
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
                else if (CloserSuffixSemantic.length > 0 && !/^(,|;|<[a-zA-Z0-9_\-:]+>)/.test(CloserSuffixSemantic))
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
        return { HasError: false, Errors: [] };
    }

    const First = UniqueErrors[0];
    const LineStr = String(First.Line);
    const Margin = " ".repeat(Math.max(2, LineStr.length));
    const FormattedLineNum = LineStr.padStart(Margin.length, " ");
    const PointerIndent = " ".repeat(Math.max(0, First.Col - 1));
    const AnchorTarget = First.Anchor ? `'${First.Anchor}'` : "the statement";

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

function ValidateEditorLAFS()
{
    if (!MonacoInstance)
    {
        return { HasError: false, Errors: [] };
    }

    const Model = MonacoInstance.getModel();
    if (!Model)
    {
        return { HasError: false, Errors: [] };
    }

    const Source = Model.getValue();
    const ActiveFileName = CurrentFilePath ? CurrentFilePath.split(/[\/\\]/).pop() : "main.typ";
    const KnrResult = DetectKnrSlop(Source, ActiveFileName);

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
        monaco.editor.setModelMarkers(Model, "lafs-validator", []);
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

function FormatTypstLAFS(Source)
{
    const Lines = Source.split(/\r?\n/);
    const ResultLines = [];
    let InRawBlock = false;
    let InBlockComment = false;

    for (let I = 0; I < Lines.length; I++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            InRawBlock = !InRawBlock;
            ResultLines.push(Line);
            continue;
        }

        if (InRawBlock)
        {
            ResultLines.push(Line);
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

        // Handle trailing delimiters '{', '(', '[' on multiline constructs
        const EndsWithDelimiter = Trimmed.match(/^(.*?)(\s*)([\{\(\[])\s*$/);
        if (EndsWithDelimiter)
        {
            const Prefix = EndsWithDelimiter[1].trim();
            const Delim = EndsWithDelimiter[3];
            const Indent = Line.match(/^\s*/)[0];

            if (Prefix === "") { ResultLines.push(Line); continue; }

            if (Prefix.includes("//")) { ResultLines.push(Line); continue; }

            ResultLines.push(`${Indent}${Prefix}`);
            ResultLines.push(`${Indent}${Delim}`);
            continue;
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

function ApplyFormattingToEditor()
{
    if (!MonacoInstance) { return; }
    const CurrentValue = MonacoInstance.getValue();
    const FormattedValue = FormatTypstLAFS(CurrentValue);
    if (CurrentValue !== FormattedValue)
    {
        const FullRange = MonacoInstance.getModel().getFullModelRange();
        MonacoInstance.executeEdits("format-lafs", [{ range: FullRange, text: FormattedValue }]);
        MonacoInstance.pushUndoStop();
        TriggerCompileNow();
        ShowToast("Formatted to LAFS standard", "info");
    }
}

async function InitializeMonaco()
{
    await EnsureSessionAuthToken();
    window.require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs" } });

    window.require
    (
        ["vs/editor/editor.main"],
        () =>
        {
            monaco.languages.register({ id: "typst" });

            monaco.languages.setLanguageConfiguration
            (
                "typst",
                {
                    comments:
                    {
                        lineComment: "//",
                        blockComment: ["/*", "*/"]
                    },
                    brackets:
                    [
                        ["{", "}"],
                        ["[", "]"],
                        ["(", ")"]
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
                            [/\/\/.*$/, "comment"],
                            [/\/\*/, "comment", "@comment"],
                            [/```/, "markup.raw.block", "@rawblock"],
                            [/`[^`\n]*`/, "markup.raw.inline"],
                            [/"([^"\\]|\\.)*"/, "string"],
                            [/\$[^$\n]*\$/, "string.math"],
                            [/^(\s*=+)(.*)$/, ["keyword.heading", "markup.heading.text"]],
                            [/<[a-zA-Z0-9_\-:]+>/, "entity.name.label"],
                            [/@[a-zA-Z0-9_\-:]+/, "entity.name.reference"],
                            [/\*([^*]+)\*/, "markup.bold"],
                            [/_([^_]+)_/, "markup.italic"],
                            [/\\([#$*_\-\\@[\]{}])/, "constant.character.escape"],
                            [/\\$/, "constant.character.escape"],
                            [/^\s*[-+]\s+/, "punctuation.list"],
                            [/([a-zA-Z_]\w*)\s*(?=:)/, "variable.parameter"],
                            [/#([a-zA-Z_]\w*)/, "keyword"],
                            [/[a-zA-Z_]\w*/,{
                                                cases:
                                                {
                                                    "@keywords": "keyword",
                                                    "@constants": "constant.language",
                                                    "@builtins": "type.identifier",
                                                    "@default": "identifier"
                                                }
                                            }
                            ],
                            [/[{}()\[\]]/, "@brackets"],
                            [/\d+(\.\d+)?(pt|in|cm|mm|em|fr|%|deg|rad)?/, "number"],
                            [/[=+\-*/<>!&|~]/, "operator"]
                        ],
                        comment:
                        [
                            [/[^\/*]+/, "comment"],
                            [/\*\//, "comment", "@pop"],
                            [/[\/*]/, "comment"]
                        ],
                        rawblock:
                        [
                            [/[^`]+/, "markup.raw.block"],
                            [/```/, "markup.raw.block", "@pop"],
                            [/`/, "markup.raw.block"]
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
                        "editor.background": "#0a0a0a",
                        "editor.foreground": "#f0f6fc",
                        "editor.lineHighlightBackground": "#141414",
                        "editorLineNumber.foreground": "#444444",
                        "editorLineNumber.activeForeground": "#ffffff",
                        "editorCursor.foreground": "#ffffff",
                        "editorWhitespace.foreground": "#202020",
                        "editor.selectionBackground": "#282828",
                        // Rainbow Brackets Palette (Depth levels 1 to 6 - Pure Neon & Pastel Spectrum)
                        "editorBracketHighlight.foreground1": "#7100FFFF",
                        "editorBracketHighlight.foreground2": "#F472B6",
                        "editorBracketHighlight.foreground3": "#A855F7",
                        "editorBracketHighlight.foreground4": "#4ADE80",
                        "editorBracketHighlight.foreground5": "#FB7185",
                        "editorBracketHighlight.foreground6": "#818CF8",
                        "editorBracketHighlight.unexpectedBracket.foreground": "#FF5555",
                        // Matching Bracket Pair Connecting Guide Lines
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
                        "editorBracketPairGuide.background6": "#818CF855",
                        // Matching Indentation Guides Palette (Depth levels 1 to 6)
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
                    triggerCharacters: ["#", "$", "@", "<", ".", " ", ":", "/", "\\"],
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
                            Suggestions.push({ ...S, range: Range });
                        }

                        // 2. Builtin Functions & Primitives
                        const Builtins =
                        [
                            { label: "align", detail: "align(alignment)[body]", insertText: "align(${1:center})[\n\t${2:body}\n]" },
                            { label: "text", detail: "text(size, fill)[content]", insertText: "text(${1:11pt})[${2:content}]" },
                            { label: "par", detail: "par(justify: true)[...]", insertText: "par(justify: ${1:true})[\n\t${2:content}\n]" },
                            { label: "image", detail: "image(path, width: ...)", insertText: "image(\"${1:path.png}\", width: ${2:100%})" },
                            { label: "rect", detail: "rect(width, height, fill)", insertText: "rect(width: ${1:100%}, height: ${2:30pt}, fill: rgb(\"${3:4338CA}\"))" },
                            { label: "circle", detail: "circle(radius, fill)", insertText: "circle(radius: ${1:15pt}, fill: rgb(\"${2:6366F1}\"))" },
                            { label: "columns", detail: "columns(n)[body]", insertText: "columns(${1:2})[\n\t${2:body}\n]" },
                            { label: "line", detail: "line(length, stroke)", insertText: "line(length: ${1:100%}, stroke: ${2:0.5pt + rgb(\"CCCCCC\")})" },
                            { label: "v", detail: "v(spacing)", insertText: "v(${1:1em})" },
                            { label: "h", detail: "h(spacing)", insertText: "h(${1:1fr})" },
                            { label: "box", detail: "box(inset: ...)[...]", insertText: "box(inset: ${1:4pt})[${2:content}]" },
                            { label: "block", detail: "block(fill: ...)[...]", insertText: "block(fill: rgb(\"${1:F1F3F6}\"), inset: ${2:8pt})[\n\t${3:content}\n]" },
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
                    fontSize: 14,
                    lineHeight: 22,
                    fontFamily: "'JetBrains Mono', 'Cascadia Code', Consolas, monospace",
                    fontWeight: "400",
                    fontLigatures: true,
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

            SyncLineDecorations = MonacoInstance.createDecorationsCollection([]);

            MonacoInstance.onDidChangeCursorPosition
            (
                (Event) =>
                {
                    if (!IsSyncTexEnabled || SuppressForwardSync)
                    {
                        return;
                    }

                    clearTimeout(ForwardSyncDebounceTimer);
                    ForwardSyncDebounceTimer = setTimeout
                    (
                        () =>
                        {
                            PerformForwardSync(Event.position.lineNumber, Event.position.column);
                        },
                        40
                    );
                }
            );

            MonacoInstance.onDidChangeCursorSelection
            (
                () =>
                {
                    if (!IsSyncTexEnabled || SuppressForwardSync)
                    {
                        return;
                    }

                    clearTimeout(ForwardSyncDebounceTimer);
                    ForwardSyncDebounceTimer = setTimeout
                    (
                        () =>
                        {
                            const Pos = MonacoInstance.getPosition();
                            if (Pos)
                            {
                                PerformForwardSync(Pos.lineNumber, Pos.column);
                            }
                        },
                        40
                    );
                }
            );

            let MathBracketDecorations = MonacoInstance.createDecorationsCollection([]);

            function UpdateMathBracketHighlighting()
            {
                if (!MonacoInstance)
                {
                    return;
                }

                const Model = MonacoInstance.getModel();
                if (!Model)
                {
                    MathBracketDecorations.clear();
                    return;
                }

                const Position = MonacoInstance.getPosition();
                const CursorLine = Position ? Position.lineNumber : 0;
                const CursorCol = Position ? Position.column : 0;

                try
                {
                    const FontInfo = MonacoInstance.getOption(monaco.editor.EditorOption.fontInfo);
                    if (FontInfo && FontInfo.spaceWidth)
                    {
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

                for (let L = 1; L <= TotalLines; L++)
                {
                    const LineContent = Model.getLineContent(L);

                    for (let ColIdx = 0; ColIdx < LineContent.length; ColIdx++)
                    {
                        const Char = LineContent[ColIdx];
                        const PrevChar = ColIdx > 0 ? LineContent[ColIdx - 1] : "";

                        if (Char === "(" || Char === "[" || Char === "{")
                        {
                            NestingDepth++;
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

                                const ActiveSuffix = IsActive ? " indent-active" : "";

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

                                // If multiline, draw vertical indentation guide line
                                if (IsMultiline)
                                {
                                    for (let Line = StartLine; Line <= EndLine; Line++)
                                    {
                                        let Classes = `typst-math-guide-line lvl-${Level} col-${StartCol}`;
                                        if (IsActive)
                                        {
                                            Classes += " indent-active";
                                            if (Line === StartLine)
                                            {
                                                Classes += " horizontal-top";
                                            }
                                            if (Line === EndLine)
                                            {
                                                Classes += " horizontal-bottom";
                                            }
                                        }

                                        Decorations.push
                                        ({
                                            range: new monaco.Range(Line, 1, Line, 1),
                                            options:
                                            {
                                                isWholeLine: true,
                                                className: Classes
                                            }
                                        });
                                    }
                                }

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
                    CheckDocumentDirty();
                    UpdateDocumentOutlineThrottled();
                    UpdateStatusBar();
                    UpdateMathBracketHighlighting();
                    const AutoCompile = document.getElementById("AutoCompileToggle").checked;
                    if (AutoCompile)
                    {
                        // Check if change is large (e.g. paste) -> adaptive debounce
                        const IsLargeChange = Event.changes.some((C) => C.text.length > 500);
                        ScheduleCompile(IsLargeChange ? 450 : 250);
                    }
                }
            );

            // Smooth paste listener: prevents intermediate compilation freezes while pasting
            MonacoInstance.onDidPaste
            (
                () =>
                {
                    UpdateStatusBar();
                    UpdateMathBracketHighlighting();
                    const AutoCompile = document.getElementById("AutoCompileToggle").checked;
                    if (AutoCompile) { ScheduleCompile(450); }
                }
            );

            MonacoInstance.onDidChangeCursorPosition
            (
                (Event) =>
                {
                    const Pos = Event.position;
                    document.getElementById("CursorPosition").textContent = `Ln ${Pos.lineNumber}, Col ${Pos.column}`;
                    UpdateMathBracketHighlighting();
                }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter,
                () => { TriggerCompileNow(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                () =>
                {
                    SaveCurrentFile();
                    TriggerCompileNow();
                }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP,
                () => { ExportPdf(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
                () => { ApplyFormattingToEditor(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit1,
                () => { SetViewportLayout("split"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit2,
                () => { SetViewportLayout("editor"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.Digit3,
                () => { SetViewportLayout("preview"); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.Alt | monaco.KeyCode.KeyO,
                () => { ToggleDocumentOutline(); }
            );

            MonacoInstance.addCommand
            (
                monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyP,
                () => { TriggerDocumentPrint(); }
            );

            UpdateStatusBar();
            TriggerCompileNow();
            MarkDocumentClean(MonacoInstance ? MonacoInstance.getValue() : "");
            UpdateDocumentOutline();
        }
    );
}

function UpdateStatusBar()
{
    if (!MonacoInstance) { return; }
    // High-performance O(1) character count without copying or allocating strings
    const Model = MonacoInstance.getModel();
    const Length = Model ? Model.getValueLength() : 0;
    document.getElementById("CharacterCount").textContent = `${Length} chars`;
}

function ScheduleCompile(DelayMs)
{
    if (CompileTimeoutID) { clearTimeout(CompileTimeoutID); }
    CompileTimeoutID = setTimeout(() => { TriggerCompileNow(); }, DelayMs);
}

async function TriggerCompileNow()
{
    if (!MonacoInstance) { return; }

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

    StatusDot.className = "StatusDot Compiling";
    StatusText.textContent = "Compiling...";

    try
    {
        const Response = await AuthenticatedFetch
        (
            "/api/compile",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Source: Source }),
                signal: Controller.signal
            }
        );

        const Result = await Response.json();

        if (Result.Aborted)
        {
            // Superseded by a newer compile request
            return;
        }

        if (Result.Success)
        {
            StatusDot.className = "StatusDot";
            StatusText.textContent = "Ready";
            DurationText.textContent = `${Result.DurationMs}ms`;
            ErrorDrawer.classList.remove("Visible");

            LastCompiledPages = Result.Pages;
            CurrentPageCount = Result.PageCount;
            ActiveSpanMap = Result.SpanMap || {};
            ActiveSyncMap = Result.SyncMap || [];
            RenderPages(Result.Pages);
            UpdatePagination();
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
            StatusDot.className = "StatusDot Error";
            StatusText.textContent = "Error";
            DurationText.textContent = `${Result.DurationMs}ms`;

            ShowCompilationError(Result.Error);
        }
    }
    catch (Exception)
    {
        if (Exception.name === "AbortError")
        {
            // Fetch aborted cleanly by a newer compile trigger
            return;
        }
        StatusDot.className = "StatusDot Error";
        StatusText.textContent = "Offline";
        ShowCompilationError(Exception.message);
    }
    finally
    {
        if (ActiveAbortController === Controller)
        {
            ActiveAbortController = null;
        }
    }
}

function InvertMonochromeColor(ColorStr)
{
    if (!ColorStr)
    {
        return ColorStr;
    }

    const Trimmed = ColorStr.trim();
    if (Trimmed.startsWith("url(") || ["none", "transparent", "currentcolor", "inherit"].includes(Trimmed.toLowerCase()))
    {
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
            return ColorStr;
        }
    }

    if (isNaN(Red) || isNaN(Green) || isNaN(Blue))
    {
        return ColorStr;
    }

    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 18)
    {
        return ColorStr; // Keep original color!
    }

    const InvertComponent = (Component) => Math.min(255, Math.max(0, Math.round(12 + (255 - Component) * 0.902)));
    const InvertedRed = InvertComponent(Red).toString(16).padStart(2, "0");
    const InvertedGreen = InvertComponent(Green).toString(16).padStart(2, "0");
    const InvertedBlue = InvertComponent(Blue).toString(16).padStart(2, "0");

    return `#${InvertedRed}${InvertedGreen}${InvertedBlue}${Alpha}`;
}

function ConvertSvgToDarkMode(Svg)
{
    if (!Svg)
    {
        return Svg;
    }

    let Result = Svg.replace
    (
        /\b(fill|stroke|stop-color)\s*=\s*(["'][^"']*["'])/gi,
        (Match, Attr, QuotedVal) =>
        {
            const Quote = QuotedVal[0];
            const Color = QuotedVal.slice(1, -1);
            const Inverted = InvertMonochromeColor(Color);
            return `${Attr}=${Quote}${Inverted}${Quote}`;
        }
    );

    Result = Result.replace
    (
        /\bstyle\s*=\s*(["'][^"']*["'])/gi,
        (Match, QuotedVal) =>
        {
            const Quote = QuotedVal[0];
            const StyleContent = QuotedVal.slice(1, -1);
            const Transformed = StyleContent.replace
            (
                /\b(fill|stroke|color|background-color)\s*:\s*([^;"']+)/gi,
                (PropMatch, Prop, Color) =>
                {
                    return `${Prop}: ${InvertMonochromeColor(Color.trim())}`;
                }
            );
            return `style=${Quote}${Transformed}${Quote}`;
        }
    );

    return Result;
}

function RenderPages(Pages)
{
    const Viewport = document.getElementById("PreviewViewport");
    const PrevScrollTop = Viewport ? Viewport.scrollTop : 0;
    const PrevScrollLeft = Viewport ? Viewport.scrollLeft : 0;

    const PagesContainer = document.getElementById("PagesContainer");
    PagesContainer.innerHTML = "";

    if (!Pages || Pages.length === 0)
    {
        PagesContainer.innerHTML = "<p style='color: #666666; padding: 40px;'>No content rendered.</p>";
        return;
    }

    const CurrentToken = ++RenderToken;

    function CreatePageElement(SvgContent, Index)
    {
        const PageDiv = document.createElement("div");
        PageDiv.className = "PageSheet";
        PageDiv.id = `PageSheet_${Index + 1}`;

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

        function NormalizeSvg(RawSvg)
        {
            return RawSvg.replace
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

        const LightLayer = document.createElement("div");
        LightLayer.className = "SvgLayer LightSvgLayer";
        LightLayer.innerHTML = NormalizeSvg(SvgContent);

        const DarkLayer = document.createElement("div");
        DarkLayer.className = "SvgLayer DarkSvgLayer";
        DarkLayer.innerHTML = NormalizeSvg(ConvertSvgToDarkMode(SvgContent));

        PageDiv.appendChild(LightLayer);
        PageDiv.appendChild(DarkLayer);

        return PageDiv;
    }

    // Render the first 2 pages immediately so initial view renders in <5ms
    const InitialBatchCount = Math.min(Pages.length, 2);
    for (let I = 0; I < InitialBatchCount; I++)
    {
        PagesContainer.appendChild(CreatePageElement(Pages[I], I));
    }

    if (Viewport && (PrevScrollTop > 0 || PrevScrollLeft > 0))
    {
        Viewport.scrollTop = PrevScrollTop;
        Viewport.scrollLeft = PrevScrollLeft;
    }

    // If more pages exist, stream them progressively via requestAnimationFrame
    // This completely eliminates browser hanging/freezing on large documents
    if (Pages.length > InitialBatchCount)
    {
        let CurrentIndex = InitialBatchCount;
        function RenderNextBatch()
        {
            if (CurrentToken !== RenderToken)
            {
                return; // Newer render has started
            }
            const ChunkLimit = Math.min(Pages.length, CurrentIndex + 3);
            for (; CurrentIndex < ChunkLimit; CurrentIndex++)
            {
                PagesContainer.appendChild(CreatePageElement(Pages[CurrentIndex], CurrentIndex));
            }
            if (Viewport && (PrevScrollTop > 0 || PrevScrollLeft > 0))
            {
                Viewport.scrollTop = PrevScrollTop;
                Viewport.scrollLeft = PrevScrollLeft;
            }
            if (CurrentIndex < Pages.length)
            {
                requestAnimationFrame(RenderNextBatch);
            }
        }
        requestAnimationFrame(RenderNextBatch);
    }

    UpdateBlackPageMode();
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

    // Detect primary error line and column for direct jump
    PrimaryErrorLocation = null;
    const LocMatch = Cleaned.match(/(?:┌─\s*|-->\s*|\b)([a-zA-Z0-9_\-.]+\.typ):(\d+):(\d+)/);
    const JumpBtn = document.getElementById("JumpToPrimaryErrorBtn");
    if (LocMatch)
    {
        PrimaryErrorLocation =
        {
            File: LocMatch[1],
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
        /\b(error|Error|ERROR|Severe Critical Fatal Error)\b/g,
        (Token) => `<span class = "ErrorKeywordHighlight">${Token}</span>`
    );

    // Convert file location references into clickable links
    Highlighted = Highlighted.replace
    (
        /(┌─\s*|-->\s*|\b)([a-zA-Z0-9_\-.]+\.typ):(\d+):(\d+)/g,
        (Full, Prefix, File, Line, Col) => `${Prefix}<span Class = "ErrorLocationLink" Data-Line = "${Line}" Data-Col = "${Col}" Title = "Click to jump to Line ${Line}, Col ${Col}">${File}:${Line}:${Col} ↗</span>`
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
    return RawMessage.replace(/\\\\\?\\.*[/\\]document\.typ/g, "document.typ");
}

function UpdatePagination()
{
    const PageIndicator = document.getElementById("PageIndicator");
    PageIndicator.textContent = `Page ${CurrentActivePage} / ${CurrentPageCount}`;
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
}

function RecalculateScale()
{
    ApplyZoom();
}

function SetZoom(NewZoom)
{
    CurrentZoomLevel = Math.max(0.25, Math.min(3.0, NewZoom));
    ApplyZoom();
}

function FitWidth()
{
    const Viewport = document.getElementById("PreviewViewport");
    const FirstPage = document.querySelector(".PageSheet");
    if (!FirstPage || !Viewport)
    {
        return;
    }
    const BaseW = parseFloat(FirstPage.dataset.baseWidth) || 576;
    const AvailableWidth = Math.max(300, Viewport.clientWidth - 80);
    SetZoom(AvailableWidth / BaseW);
}

function FitPage()
{
    const Viewport = document.getElementById("PreviewViewport");
    const FirstPage = document.querySelector(".PageSheet");
    if (!FirstPage || !Viewport)
    {
        return;
    }
    const BaseH = parseFloat(FirstPage.dataset.baseHeight) || 864;
    const AvailableHeight = Math.max(300, Viewport.clientHeight - 80);
    SetZoom(AvailableHeight / BaseH);
}

function UpdateBlackPageMode()
{
    const Container = document.getElementById("PagesContainer");
    const Viewport = document.getElementById("PreviewViewport");
    const Icon = document.getElementById("BlackPageIcon");
    const Label = document.getElementById("BlackPageLabel");
    const Button = document.getElementById("BlackPageToggle");

    if (IsBlackPageMode)
    {
        if (Container) { Container.classList.add("BlackPageMode"); }
        if (Viewport) { Viewport.classList.add("BlackPageMode"); }
        if (Icon) { Icon.textContent = "☀️"; }
        if (Label) { Label.textContent = "Light Page"; }
        if (Button) { Button.classList.add("Active"); }
    }
    else
    {
        if (Container) { Container.classList.remove("BlackPageMode"); }
        if (Viewport) { Viewport.classList.remove("BlackPageMode"); }
        if (Icon) { Icon.textContent = "🌙"; }
        if (Label) { Label.textContent = "Dark Page"; }
        if (Button) { Button.classList.remove("Active"); }
    }
}

function ToggleBlackPageMode()
{
    IsBlackPageMode = !IsBlackPageMode;
    localStorage.setItem("typst_black_page_mode", IsBlackPageMode ? "true" : "false");
    UpdateBlackPageMode();
}

async function ExportPdf()
{
    if (!MonacoInstance)
    {
        return;
    }

    const Source = MonacoInstance.getValue();
    const DocTitle = document.getElementById("DocumentTitleInput").value.trim() || "document";
    const StatusDot = document.getElementById("StatusDot");
    const StatusText = document.getElementById("StatusText");

    StatusDot.className = "StatusDot Compiling";
    StatusText.textContent = "Generating PDF...";

    try
    {
        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked : false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked : false;

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
        Anchor.download = DocTitle.endsWith(".pdf") ? DocTitle : `${DocTitle}.pdf`;
        document.body.appendChild(Anchor);
        Anchor.click();
        document.body.removeChild(Anchor);
        URL.revokeObjectURL(DownloadUrl);
        ShowToast("PNG exported successfully", "success");

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

function ExportSvg()
{
    if (!LastCompiledPages || LastCompiledPages.length === 0)
    {
        alert("No compiled pages to export.");
        return;
    }

    const PageIndex = Math.min(CurrentActivePage - 1, LastCompiledPages.length - 1);
    const RawSvg = LastCompiledPages[PageIndex];
    const SvgContent = IsBlackPageMode ? ConvertSvgToDarkMode(RawSvg) : RawSvg;
    const DocTitle = document.getElementById("DocumentTitleInput").value.trim() || "document";

    const Blob = new Blob([SvgContent], { type: "image/svg+xml;charset=utf-8" });
    const DownloadUrl = URL.createObjectURL(Blob);
    const Anchor = document.createElement("a");
    Anchor.href = DownloadUrl;
    Anchor.download = `${DocTitle}_page_${CurrentActivePage}.svg`;
    document.body.appendChild(Anchor);
    Anchor.click();
    document.body.removeChild(Anchor);
    URL.revokeObjectURL(DownloadUrl);
}

async function ExportPng()
{
    if (!MonacoInstance)
    {
        return;
    }

    const Source = MonacoInstance.getValue();
    const DocTitle = document.getElementById("DocumentTitleInput").value.trim() || "document";

    try
    {
        const BlackModeCheckbox = document.getElementById("ExportBlackModeCheckbox");
        const TransparentCheckbox = document.getElementById("ExportTransparentCheckbox");
        const BlackMode = BlackModeCheckbox ? BlackModeCheckbox.checked : false;
        const Transparent = TransparentCheckbox ? TransparentCheckbox.checked : false;

        const Response = await AuthenticatedFetch
        (
            "/api/export/png",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify
                ({
                    Source: Source,
                    FileName: DocTitle,
                    PageNum: CurrentActivePage,
                    BlackMode: BlackMode,
                    Transparent: Transparent
                })
            }
        );

        if (!Response.ok)
        {
            const ErrData = await Response.json();
            throw new Error(ErrData.Error || "Failed to export PNG");
        }

        const Blob = await Response.blob();
        const DownloadUrl = URL.createObjectURL(Blob);
        const Anchor = document.createElement("a");
        Anchor.href = DownloadUrl;
        Anchor.download = `${DocTitle}_page_${CurrentActivePage}.png`;
        document.body.appendChild(Anchor);
        Anchor.click();
        document.body.removeChild(Anchor);
        URL.revokeObjectURL(DownloadUrl);
    }
    catch (Err)
    {
        alert(`PNG export failed: ${Err.message}`);
    }
}

function CopySource()
{
    if (!MonacoInstance)
    {
        return;
    }
    const Source = MonacoInstance.getValue();
    navigator.clipboard.writeText(Source).then
    (
        () =>
        {
            const CopyBtn = document.getElementById("CopyCodeButton");
            const OriginalHTML = CopyBtn.innerHTML;
            CopyBtn.innerHTML = "<span>Copied!</span>";
            setTimeout(() => { CopyBtn.innerHTML = OriginalHTML; }, 1500);
            ShowToast("Typst source copied to clipboard", "success");
        }
    );
}

function SetupSplitResizer()
{
    const Resizer = document.getElementById("SplitResizer");
    const EditorPane = document.getElementById("EditorPane");
    let IsDragging = false;

    Resizer.addEventListener
    (
        "mousedown",
        (E) =>
        {
            IsDragging = true;
            Resizer.classList.add("Dragging");
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
        }
    );

    window.addEventListener
    (
        "mousemove",
        (E) =>
        {
            if (!IsDragging)
            {
                return;
            }
            const ContainerWidth = document.querySelector(".MainSplitArea").clientWidth;
            const NewWidth = Math.max(260, Math.min(ContainerWidth - 260, E.clientX));
            EditorPane.style.width = `${NewWidth}px`;
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
                Resizer.classList.remove("Dragging");
                document.body.style.cursor = "";
                document.body.style.userSelect = "";
            }
        }
    );
}

// --- VIEWPORT SEGMENTED CONTROL ARCHITECTURE (PRIORITY 2) ---

let CurrentViewportLayout = "split"; // 'split', 'editor', 'preview'

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
    catch (Ignored) { }

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

function ToggleDocumentOutline(ForceState)
{
    const Sidebar = document.getElementById("OutlineSidebar");
    if (!Sidebar) { return; }

    IsOutlineVisible = (typeof ForceState === "boolean") ? ForceState : !IsOutlineVisible;
    Sidebar.style.display = IsOutlineVisible ? "flex" : "none";

    if (IsOutlineVisible)
    {
        UpdateDocumentOutline();
    }

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
    if (OutlineThrottleTimer) { clearTimeout(OutlineThrottleTimer); }
    OutlineThrottleTimer = setTimeout
    (
        () =>
        {
            UpdateDocumentOutline();
        },
        300
    );
}

function UpdateDocumentOutline()
{
    const ListContainer = document.getElementById("OutlineList");
    const Badge = document.getElementById("OutlineCountBadge");
    const StatusBadge = document.getElementById("StatusOutlineCount");
    if (!MonacoInstance || !ListContainer) { return; }

    const Source = MonacoInstance.getValue();
    const Lines = Source.split(/\r?\n/);
    OutlineHeadingsList = [];

    let InCodeBlock = false;
    for (let Index = 0; Index < Lines.length; Index++)
    {
        const LineText = Lines[Index];
        const Trimmed = LineText.trim();

        if (Trimmed.startsWith("```"))
        {
            InCodeBlock = !InCodeBlock;
            continue;
        }
        if (InCodeBlock) { continue; }

        const HeadingMatch = LineText.match(/^(=+)\s+(.+)$/);
        if (HeadingMatch)
        {
            const Level = HeadingMatch[1].length;
            const CleanTitle = HeadingMatch[2].replace(/<[a-zA-Z0-9_\-:]+>\s*$/, "").trim();
            OutlineHeadingsList.push
            ({
                Level: Math.min(Level, 4),
                Title: CleanTitle,
                Line: Index + 1
            });
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
    const Filter = SearchInput ? SearchInput.value.toLowerCase().trim() : "";

    const Filtered = Filter
        ? Headings.filter((H) => H.Title.toLowerCase().includes(Filter))
        : Headings;

    if (Filtered.length === 0)
    {
        ListContainer.innerHTML = Filter
            ? `<div Class = "OutlineEmptyState">No sections match "${Filter}"</div>`
            : `<div Class = "OutlineEmptyState">No headings in document.<br><span style="color:#71717A; font-size:10.5px;">Add '= Section Name' to generate an outline.</span></div>`;
        return;
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
        "dragenter",
        (Event) =>
        {
            if (Event.dataTransfer && Event.dataTransfer.types.includes("Files"))
            {
                DragCounter++;
                Overlay.classList.add("Active");
            }
        }
    );

    window.addEventListener
    (
        "dragleave",
        (Event) =>
        {
            DragCounter--;
            if (DragCounter <= 0)
            {
                DragCounter = 0;
                Overlay.classList.remove("Active");
            }
        }
    );

    window.addEventListener
    (
        "dragover",
        (Event) =>
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

            const Files = Event.dataTransfer ? Event.dataTransfer.files : null;
            if (!Files || Files.length === 0) { return; }

            for (let I = 0; I < Files.length; I++)
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
        return;
    }

    const Reader = new FileReader();
    Reader.onload = async () =>
    {
        const Base64Data = Reader.result.split(",")[1];
        try
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
            if (Data.Success && MonacoInstance)
            {
                const CleanFileName = Data.FileName;
                const Snippet = `\n#image\n(\n\t"${CleanFileName}",\n\twidth: 80%\n)\n`;

                const Position = MonacoInstance.getPosition();
                MonacoInstance.executeEdits
                (
                    "asset-drop",
                    [
                        {
                            range: new monaco.Range(Position.lineNumber, Position.column, Position.lineNumber, Position.column),
                            text: Snippet
                        }
                    ]
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

function ToggleShortcutsModal(ForceOpen)
{
    const Modal = document.getElementById("ShortcutsModal");
    if (!Modal) { return; }

    const IsOpen = Modal.style.display !== "none";
    const ShouldOpen = (typeof ForceOpen === "boolean") ? ForceOpen : !IsOpen;
    Modal.style.display = ShouldOpen ? "flex" : "none";
}

function TriggerDocumentPrint()
{
    ShowToast("Preparing document for print...", "info", 1500);
    setTimeout(() => { window.print(); }, 200);
}

// --- UNIFIED EXPORT MENU ARCHITECTURE ---

function ToggleExportMenu(ForceState)
{
    const Menu = document.getElementById("ExportMenuDropdown");
    if (!Menu) { return; }

    IsExportMenuOpen = (typeof ForceState === "boolean") ? ForceState : !IsExportMenuOpen;
    Menu.style.display = IsExportMenuOpen ? "flex" : "none";
}

function SetupEventListeners()
{
        // Priority 2: Viewport Layout Controls
    const SplitBtn = document.getElementById("LayoutSplitBtn");
    const EditorBtn = document.getElementById("LayoutEditorBtn");
    const PreviewBtn = document.getElementById("LayoutPreviewBtn");
    if (SplitBtn) { SplitBtn.addEventListener("click", () => { SetViewportLayout("split"); }); }
    if (EditorBtn) { EditorBtn.addEventListener("click", () => { SetViewportLayout("editor"); }); }
    if (PreviewBtn) { PreviewBtn.addEventListener("click", () => { SetViewportLayout("preview"); }); }

    // Priority 2: Document Outline Controls
    const OutlineToggle = document.getElementById("StatusOutlineToggle");
    const OutlineClose = document.getElementById("CloseOutlineBtn");
    const OutlineSearch = document.getElementById("OutlineSearchInput");
    const OutlineList = document.getElementById("OutlineList");
    if (OutlineToggle) { OutlineToggle.addEventListener("click", () => { ToggleDocumentOutline(); }); }
    if (OutlineClose) { OutlineClose.addEventListener("click", () => { ToggleDocumentOutline(false); }); }
    if (OutlineSearch) { OutlineSearch.addEventListener("input", () => { RenderOutlineItems(OutlineHeadingsList); }); }
    if (OutlineList)
    {
        OutlineList.addEventListener
        (
            "click",
            (E) =>
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
            "click",
            (E) =>
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
            "click",
            () =>
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
            "click",
            () =>
            {
                ToggleExportMenu(false);
                SwitchToDashboard();
            }
        );
    }

    // Close export menu when clicking anywhere outside
    document.addEventListener
    (
        "click",
        (E) =>
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
            "click",
            () =>
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
    if (HelpBtn) { HelpBtn.addEventListener("click", () => { ToggleShortcutsModal(true); }); }
    if (CloseModalBtn) { CloseModalBtn.addEventListener("click", () => { ToggleShortcutsModal(false); }); }
    if (ShortcutsModal)
    {
        ShortcutsModal.addEventListener
        (
            "click",
            (E) =>
            {
                if (E.target.id === "ShortcutsModal") { ToggleShortcutsModal(false); }
            }
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
    if (ExportPaperSelect) { ExportPaperSelect.value = InitialBlack ? "black" : "light"; }
    if (ExportPaperBadge) { ExportPaperBadge.textContent = InitialBlack ? "Black Mode (Inverted)" : "Light Mode (Normal)"; }
    if (DefaultBgSelect) { DefaultBgSelect.value = InitialTrans ? "transparent" : "normal"; }

    if (ExportBlackCb)
    {
        ExportBlackCb.addEventListener
        (
            "change",
            (E) =>
            {
                const IsBlack = E.target.checked;
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true" : "false");
                if (ExportPaperSelect) { ExportPaperSelect.value = IsBlack ? "black" : "light"; }
                if (ExportPaperBadge) { ExportPaperBadge.textContent = IsBlack ? "Black Mode (Inverted)" : "Light Mode (Normal)"; }
                ShowToast(`Export in Black mode: ${IsBlack ? "Enabled" : "Disabled"}`, "info");
            }
        );
    }

    if (ExportTransCb)
    {
        ExportTransCb.addEventListener
        (
            "change",
            (E) =>
            {
                const IsTrans = E.target.checked;
                localStorage.setItem("typst_transparent_export", IsTrans ? "true" : "false");
                if (DefaultBgSelect) { DefaultBgSelect.value = IsTrans ? "transparent" : "normal"; }
                ShowToast(`Transparent background: ${IsTrans ? "Enabled" : "Disabled"}`, "info");
            }
        );
    }

    if (ExportPaperSelect)
    {
        ExportPaperSelect.addEventListener
        (
            "change",
            (E) =>
            {
                const IsBlack = E.target.value === "black";
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true" : "false");
                if (ExportBlackCb) { ExportBlackCb.checked = IsBlack; }
                if (ExportPaperBadge) { ExportPaperBadge.textContent = IsBlack ? "Black Mode (Inverted)" : "Light Mode (Normal)"; }
                ShowToast(`Export paper mode set to ${IsBlack ? "Black" : "Light"}`, "info");
            }
        );
    }

    if (DefaultBgSelect)
    {
        DefaultBgSelect.addEventListener
        (
            "change",
            (E) =>
            {
                const IsTrans = E.target.value === "transparent";
                localStorage.setItem("typst_transparent_export", IsTrans ? "true" : "false");
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
            "click",
            () =>
            {
                if (PrimaryErrorLocation)
                {
                    JumpToEditorLocation(PrimaryErrorLocation.Line, PrimaryErrorLocation.Col);
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
            "click",
            (Event) =>
            {
                const Link = Event.target.closest(".ErrorLocationLink");
                if (Link)
                {
                    const Line = parseInt(Link.getAttribute("Data-Line"), 10);
                    const Col = parseInt(Link.getAttribute("Data-Col"), 10) || 1;
                    if (!isNaN(Line))
                    {
                        JumpToEditorLocation(Line, Col);
                    }
                }
            }
        );
    }

    // Unsaved dirty state warning before closing/reloading window
    window.addEventListener
    (
        "beforeunload",
        (Event) =>
        {
            if (IsDocumentDirty)
            {
                Event.preventDefault();
                Event.returnValue = "";
            }
        }
    );

    document.getElementById("ManualCompileButton").addEventListener("click", () => { TriggerCompileNow(); });
    document.getElementById("FormatLafsButton").addEventListener("click", () => { ApplyFormattingToEditor(); });
    document.getElementById("ExportPdfButton").addEventListener("click", () => { ExportPdf(); });
    document.getElementById("ExportSvgButton").addEventListener("click", () => { ExportSvg(); });
    document.getElementById("ExportPngButton").addEventListener("click", () => { ExportPng(); });
    document.getElementById("CopyCodeButton").addEventListener("click", () => { CopySource(); });
    document.getElementById("BlackPageToggle").addEventListener("click", () => { ToggleBlackPageMode(); });
    document.getElementById("CloseErrorButton").addEventListener("click", () =>
    {
        document.getElementById("ErrorDrawer").classList.remove("Visible");
    });

    document.getElementById("TemplateSelector").addEventListener
    (
        "change",
        (E) =>
        {
            const Selected = E.target.value;
            if (TEMPLATES[Selected] && MonacoInstance)
            {
                MonacoInstance.setValue(TEMPLATES[Selected]);
                TriggerCompileNow();
            }
        }
    );

    document.getElementById("ZoomInButton").addEventListener("click", () => { SetZoom(CurrentZoomLevel + 0.1); });
    document.getElementById("ZoomOutButton").addEventListener("click", () => { SetZoom(CurrentZoomLevel - 0.1); });
    document.getElementById("ZoomDisplay").addEventListener("click", () => { SetZoom(1.0); });
    document.getElementById("ZoomFitWidthButton").addEventListener("click", () => { FitWidth(); });
    document.getElementById("ZoomFitPageButton").addEventListener("click", () => { FitPage(); });

    document.getElementById("PrevPageButton").addEventListener
    (
        "click",
        () =>
        {
            if (CurrentActivePage > 1)
            {
                CurrentActivePage--;
                UpdatePagination();
                const Target = document.getElementById(`PageSheet_${CurrentActivePage}`);
                if (Target)
                {
                    Target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }
    );

    document.getElementById("NextPageButton").addEventListener
    (
        "click",
        () =>
        {
            if (CurrentActivePage < CurrentPageCount)
            {
                CurrentActivePage++;
                UpdatePagination();
                const Target = document.getElementById(`PageSheet_${CurrentActivePage}`);
                if (Target)
                {
                    Target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        }
    );

    SetupSplitResizer();

    // Document Title Dropdown
    document.getElementById("DocDropdownToggle").addEventListener
    (
        "click",
        (E) =>
        {
            E.stopPropagation();
            ToggleDocDropdown();
        }
    );

    document.getElementById("DocDropdownSearch").addEventListener
    (
        "input",
        (E) =>
        {
            RenderDocDropdownList(E.target.value);
        }
    );

    document.getElementById("QuickNewDocBtn").addEventListener
    (
        "click",
        () =>
        {
            CloseDocDropdown();
            CreateNewWorkspaceFile();
        }
    );

    document.getElementById("OpenDashboardFromDropdownBtn").addEventListener
    (
        "click",
        () =>
        {
            CloseDocDropdown();
            SwitchView("dashboard");
        }
    );

    document.addEventListener
    (
        "click",
        (E) =>
        {
            const Group = document.getElementById("DocDropdownGroup");
            if (Group && !Group.contains(E.target))
            {
                CloseDocDropdown();
            }
        }
    );

    // Save File Button
    document.getElementById("SaveFileButton").addEventListener
    (
        "click",
        () =>
        {
            SaveCurrentFile();
        }
    );

    // View Navigation Tabs
    document.getElementById("NavEditorBtn").addEventListener
    (
        "click",
        () =>
        {
            SwitchView("editor");
        }
    );

    document.getElementById("NavDashboardBtn").addEventListener
    (
        "click",
        () =>
        {
            SwitchView("dashboard");
        }
    );

    document.getElementById("StatResumeBtn").addEventListener
    (
        "click",
        () =>
        {
            SwitchView("editor");
        }
    );

    // Dashboard Actions
    document.getElementById("DashboardRefreshBtn").addEventListener
    (
        "click",
        () =>
        {
            LoadWorkspaceInfo();
            MarkDocumentClean(Content);
            ShowToast(`Saved ${TargetPath.split(/[\/\\]/).pop()}`, "success");
        }
    );

    document.getElementById("DashboardNewFileBtn").addEventListener
    (
        "click",
        () =>
        {
            CreateNewWorkspaceFile();
        }
    );

    document.getElementById("PickFolderBtn").addEventListener
    (
        "click",
        () =>
        {
            PickFolderFromDisk();
        }
    );

    document.getElementById("AddDirectorySubmitBtn").addEventListener
    (
        "click",
        () =>
        {
            AddWorkspaceDirectory();
        }
    );

    document.getElementById("NewDirectoryInput").addEventListener
    (
        "keydown",
        (E) =>
        {
            if (E.key === "Enter")
            {
                AddWorkspaceDirectory();
            }
        }
    );

    document.getElementById("DashboardFileSearch").addEventListener
    (
        "input",
        (E) =>
        {
            RenderDashboard(E.target.value);
        }
    );

    // Window level Ctrl+S
    window.addEventListener
    (
        "keydown",
        (E) =>
        {
                        // Priority 2 & 4 Global Shortcuts
            if (E.altKey && E.key === "1")
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
            else if ((E.ctrlKey || E.metaKey) && E.shiftKey && (E.key === "P" || E.key === "p"))
            {
                E.preventDefault();
                TriggerDocumentPrint();
            }
            else if ((E.ctrlKey || E.metaKey) && E.key === "/")
            {
                E.preventDefault();
                ToggleShortcutsModal();
            }
            else if (E.key === "?" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName))
            {
                E.preventDefault();
                ToggleShortcutsModal();
            }
            else if (E.key === "Escape")
            {
                ToggleShortcutsModal(false);
                ToggleExportMenu(false);
                const Drawer = document.getElementById("ErrorDrawer");
                if (Drawer) { Drawer.classList.remove("Visible"); }
            }
            if ((E.ctrlKey || E.metaKey) && E.key === "s")
            {
                E.preventDefault();
                SaveCurrentFile();
                TriggerCompileNow();
            }
        }
    );
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
    const SearchInput = document.getElementById("DashboardFileSearch");
    RenderDashboard(SearchInput ? SearchInput.value : "");
}

async function PickFolderFromDisk()
{
    const PickBtn = document.getElementById("PickFolderBtn");
    const DirInput = document.getElementById("NewDirectoryInput");
    const OriginalHtml = PickBtn ? PickBtn.innerHTML : "";

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
    return Str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function LoadWorkspaceInfo()
{
    try
    {
        const Response = await AuthenticatedFetch("/api/workspace/info");
        const Data = await Response.json();
        if (Data.Success)
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
    IsDropdownOpen = !IsDropdownOpen;
    const DropdownMenu = document.getElementById("DocDropdownMenu");
    if (IsDropdownOpen)
    {
        DropdownMenu.style.display = "flex";
        document.getElementById("DocDropdownSearch").focus();
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
        return;
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
        return;
    }

    let Html = "";
    for (const File of FilteredFiles)
    {
        const IsActive = CurrentFilePath && (File.Path.toLowerCase() === CurrentFilePath.toLowerCase());
        const ActiveClass = IsActive ? "Active" : "";
        const EscapedPath = File.Path.replace(/\\/g, "\\\\").replace(/'/g, "\\'");

        Html += `
            <div Class = "DocDropdownItem ${ActiveClass}" onclick = "OpenFileFromWorkspace('${EscapedPath}')">
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
    try
    {
        const Response = await AuthenticatedFetch(`/api/workspace/file?path=${encodeURIComponent(FilePath)}`);
        const Data = await Response.json();
        if (Data.Success && MonacoInstance)
        {
            CurrentFilePath = FilePath;
            const FileName = FilePath.split(/[\\/]/).pop();
            document.getElementById("DocumentTitleInput").value = FileName;
            const ActiveDocStat = document.getElementById("StatActiveDoc");
            if (ActiveDocStat)
            {
                ActiveDocStat.textContent = FileName;
            }
            MonacoInstance.setValue(Data.Content);
            MarkDocumentClean(Data.Content);
            ShowToast(`Loaded ${FileName}`, "info");
            CloseDocDropdown();
            SwitchView("editor");
            TriggerCompileNow();
            RenderDocDropdownList();
            RenderDashboard();
        }
        else
        {
            alert("Could not load file: " + (Data.Message || "Unknown error"));
        }
    }
    catch (Err)
    {
        console.error("Open file error:", Err);
        alert("Failed to read file from disk.");
    }
}

async function SaveCurrentFile()
{
    if (!MonacoInstance)
    {
        return;
    }

    const Content = MonacoInstance.getValue();
    let TargetPath = CurrentFilePath;

    if (!TargetPath)
    {
        const DocName = document.getElementById("DocumentTitleInput").value.trim() || "Document.typ";
        const CleanDocName = DocName.endsWith(".typ") ? DocName : `${DocName}.typ`;
        const DefaultDir = WorkspaceDirectories[0] || "";
        if (DefaultDir)
        {
            const Separator = DefaultDir.includes("/") ? "/" : "\\";
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
        const Response = await AuthenticatedFetch
        (
            "/api/workspace/file",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Path: TargetPath, Content: Content })
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
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
            alert("Save failed: " + (Data.Message || "Unknown error"));
        }
    }
    catch (Err)
    {
        console.error("Save error:", Err);
        alert("Network error while saving file.");
    }
}

async function CreateNewWorkspaceFile()
{
    const DefaultDir = WorkspaceDirectories[0] || "";
    const FileName = prompt("Enter new Typst file name:", "NewDocument.typ");
    if (!FileName || !FileName.trim())
    {
        return;
    }

    const CleanName = FileName.trim().endsWith(".typ") ? FileName.trim() : `${FileName.trim()}.typ`;
    const InitialContent = `#set page(paper: "a4", margin: 2.5cm)\n#set text(font: "Segoe UI", size: 11pt)\n\n= ${CleanName.replace(".typ", "")}\n\n`;

    try
    {
        const Response = await AuthenticatedFetch
        (
            "/api/workspace/create",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Directory: DefaultDir, FileName: CleanName, Content: InitialContent })
            }
        );
        const Data = await Response.json();
        if (Data.Success && Data.Path)
        {
            await LoadWorkspaceInfo();
            OpenFileFromWorkspace(Data.Path);
        }
        else
        {
            alert("Create failed: " + (Data.Message || "Unknown error"));
        }
    }
    catch (Err)
    {
        console.error("Create file error:", Err);
    }
}

async function AddWorkspaceDirectory()
{
    const Input = document.getElementById("NewDirectoryInput");
    const DirPath = Input.value.trim();
    if (!DirPath)
    {
        return;
    }

    try
    {
        const Response = await AuthenticatedFetch
        (
            "/api/workspace/directory",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Path: DirPath })
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
            Input.value = "";
            await LoadWorkspaceInfo();
        }
        else
        {
            alert("Failed to add directory: " + (Data.Message || "Directory not found or inaccessible"));
        }
    }
    catch (Err)
    {
        console.error("Add directory error:", Err);
    }
}

async function RemoveWorkspaceDirectory(DirPath)
{
    if (!confirm(`Remove directory from tracked workspace?\n\n${DirPath}`))
    {
        return;
    }

    try
    {
        const Response = await AuthenticatedFetch
        (
            "/api/workspace/directory",
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Path: DirPath })
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
            await LoadWorkspaceInfo();
        }
        else
        {
            alert("Failed to remove directory: " + (Data.Message || "Error"));
        }
    }
    catch (Err)
    {
        console.error("Remove directory error:", Err);
    }
}

async function DeleteWorkspaceFile(FilePath, FileName)
{
    if (!confirm(`Are you sure you want to permanently delete:\n\n${FileName}\n(${FilePath})`))
    {
        return;
    }

    try
    {
        const Response = await AuthenticatedFetch
        (
            `/api/workspace/file?path=${encodeURIComponent(FilePath)}`,
            {
                method: "DELETE"
            }
        );
        const Data = await Response.json();
        if (Data.Success)
        {
            await LoadWorkspaceInfo();
            if (CurrentFilePath && CurrentFilePath.toLowerCase() === FilePath.toLowerCase())
            {
                if (WorkspaceFiles.length > 0)
                {
                    OpenFileFromWorkspace(WorkspaceFiles[0].Path);
                }
            }
        }
        else
        {
            alert("Delete failed: " + (Data.Message || "Error"));
        }
    }
    catch (Err)
    {
        console.error("Delete file error:", Err);
    }
}

function SwitchView(ViewName)
{
    const EditorView = document.getElementById("EditorMainView");
    const DashboardView = document.getElementById("DashboardView");
    const NavEditor = document.getElementById("NavEditorBtn");
    const NavDashboard = document.getElementById("NavDashboardBtn");

    if (ViewName === "editor")
    {
        EditorView.style.display = "flex";
        DashboardView.style.display = "none";
        NavEditor.classList.add("Active");
        NavDashboard.classList.remove("Active");
        if (MonacoInstance)
        {
            setTimeout(() => { MonacoInstance.layout(); }, 50);
        }
    }
    else if (ViewName === "dashboard")
    {
        EditorView.style.display = "none";
        DashboardView.style.display = "block";
        NavEditor.classList.remove("Active");
        NavDashboard.classList.add("Active");
        RenderDashboard();
    }
}

function RenderDashboard(FilterQuery = "")
{
    const DirCountElem = document.getElementById("StatDirCount");
    const FileCountElem = document.getElementById("StatFileCount");
    const BadgeElem = document.getElementById("FilesCountBadge");
    const ActiveDocElem = document.getElementById("StatActiveDoc");

    if (DirCountElem)
    {
        DirCountElem.textContent = WorkspaceDirectories.length;
    }
    if (FileCountElem)
    {
        FileCountElem.textContent = WorkspaceFiles.length;
    }
    if (ActiveDocElem)
    {
        ActiveDocElem.textContent = CurrentFilePath ? CurrentFilePath.split(/[\\/]/).pop() : "None";
    }

    // Render Tracked Directories
    const DirListContainer = document.getElementById("TrackedDirectoryList");
    if (DirListContainer)
    {
        let DirHtml = "";

        // All Folders Option
        const IsAllActive = !ActiveSelectedDirectory;
        DirHtml += `
            <div Class = "DirectoryItem ${IsAllActive ? "IsActiveDirectory" : ""}" onclick = "SelectDashboardDirectory(null)" Title = "View files from all tracked folders">
                <div Class = "DirectoryItemInfo">
                    <span Class = "DirectoryPathText" style = "font-weight: 500; display: flex; align-items: center; gap: 6px;">
                        <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "#c084fc" Stroke-Width = "2">
                            <path D = "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>All Tracked Folders</span>
                    </span>
                    <span Class = "DirectoryCountBadge">${WorkspaceFiles.length} Typst files</span>
                </div>
            </div>
        `;

        for (const Dir of WorkspaceDirectories)
        {
            const FilesInDir = WorkspaceFiles.filter
            (
                (F) =>
                {
                    const NormalizedDir = Dir.toLowerCase();
                    return F.Directory.toLowerCase().startsWith(NormalizedDir) || F.Path.toLowerCase().startsWith(NormalizedDir);
                }
            ).length;

            const EscapedDir = Dir.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
            const CanDelete = WorkspaceDirectories.length > 1;
            const IsSelected = ActiveSelectedDirectory && (ActiveSelectedDirectory.toLowerCase() === Dir.toLowerCase());
            const ActiveClass = IsSelected ? "IsActiveDirectory" : "";

            DirHtml += `
                <div Class = "DirectoryItem ${ActiveClass}" onclick = "SelectDashboardDirectory('${EscapedDir}')" Title = "Filter files in this directory">
                    <div Class = "DirectoryItemInfo">
                        <span Class = "DirectoryPathText" Title = "${EscapeHtml(Dir)}">${EscapeHtml(Dir)}</span>
                        <span Class = "DirectoryCountBadge">${FilesInDir} Typst files</span>
                    </div>
                    ${CanDelete ? `
                        <button Type = "button" Class = "DirectoryDeleteBtn" Title = "Remove from workspace" onclick = "event.stopPropagation(); RemoveWorkspaceDirectory('${EscapedDir}')">
                            <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                <line X1 = "18" Y1 = "6" X2 = "6" Y2 = "18" />
                                <line X1 = "6" Y1 = "6" X2 = "18" Y2 = "18" />
                            </svg>
                        </button>
                    ` : ""}
                </div>
            `;
        }
        DirListContainer.innerHTML = DirHtml;
    }

    // Render Files Grid
    const FilesGridContainer = document.getElementById("DashboardFilesGrid");
    if (FilesGridContainer)
    {
        let FilteredFiles = WorkspaceFiles;

        if (ActiveSelectedDirectory)
        {
            const NormDir = ActiveSelectedDirectory.toLowerCase();
            FilteredFiles = FilteredFiles.filter
            (
                (F) =>
                {
                    return F.Directory.toLowerCase().startsWith(NormDir) || F.Path.toLowerCase().startsWith(NormDir);
                }
            );
        }

        const Query = FilterQuery.toLowerCase().trim();
        if (Query)
        {
            FilteredFiles = FilteredFiles.filter
            (
                (F) =>
                {
                    return F.Name.toLowerCase().includes(Query) || F.Path.toLowerCase().includes(Query);
                }
            );
        }

        if (BadgeElem)
        {
            BadgeElem.textContent = FilteredFiles.length;
        }

        let BannerHtml = "";
        if (ActiveSelectedDirectory)
        {
            const DirName = ActiveSelectedDirectory.split(/[\\/]/).filter(Boolean).pop() || ActiveSelectedDirectory;
            BannerHtml = `
                <div Class = "ActiveFolderFilterBanner">
                    <div Class = "ActiveFolderFilterInfo">
                        <span>Viewing folder:</span>
                        <strong Title = "${EscapeHtml(ActiveSelectedDirectory)}">${EscapeHtml(DirName)}</strong>
                        <span Class = "ActiveFolderFilterPath">(${EscapeHtml(ActiveSelectedDirectory)})</span>
                    </div>
                    <button Type = "button" Class = "ClearFilterBtn" onclick = "SelectDashboardDirectory(null)">
                        Show All Folders ✕
                    </button>
                </div>
            `;
        }

        if (FilteredFiles.length === 0)
        {
            FilesGridContainer.innerHTML = BannerHtml + `<div Class = "EmptyNotice">No Typst (.typ) files found in this folder</div>`;
            return;
        }

        let FilesHtml = BannerHtml;
        for (const File of FilteredFiles)
        {
            const IsActive = CurrentFilePath && (File.Path.toLowerCase() === CurrentFilePath.toLowerCase());
            const ActiveClass = IsActive ? "IsActiveCard" : "";
            const EscapedPath = File.Path.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
            const EscapedName = File.Name.replace(/'/g, "\\'");

            FilesHtml += `
                <div Class = "FileCard ${ActiveClass}">
                    <div Class = "FileCardTop">
                        <div Class = "FileCardIcon">
                            <svg Width = "18" Height = "18" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                <path D = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline Points = "14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div Class = "FileCardMeta">
                            <div Class = "FileCardName" Title = "${EscapeHtml(File.Name)}">${EscapeHtml(File.Name)}</div>
                            <div Class = "FileCardDir" Title = "${EscapeHtml(File.Directory)}">${EscapeHtml(File.Directory)}</div>
                        </div>
                    </div>

                    <div Class = "FileCardDetails">
                        <span Class = "FileCardSize">${FormatFileSize(File.Size)}</span>
                        <span Class = "FileCardDate">${FormatDate(File.Modified)}</span>
                    </div>

                    <div Class = "FileCardActions">
                        <button Type = "button" Class = "FileCardOpenBtn" onclick = "OpenFileFromWorkspace('${EscapedPath}')">
                            Open in Editor
                        </button>
                        <button Type = "button" Class = "FileCardTrashBtn" Title = "Delete file" onclick = "DeleteWorkspaceFile('${EscapedPath}', '${EscapedName}')">
                            <svg Width = "14" Height = "14" ViewBox = "0 0 24 24" Fill = "none" Stroke = "currentColor" Stroke-Width = "2">
                                <polyline Points = "3 6 5 6 21 6" />
                                <path D = "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }
        FilesGridContainer.innerHTML = FilesHtml;
    }
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
            "change",
            () =>
            {
                IsSyncTexEnabled = SyncTexCheckbox.checked;
                localStorage.setItem("typst_synctex_enabled", IsSyncTexEnabled ? "true" : "false");
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
        "keydown",
        (Event) =>
        {
            if (!IsSyncTexEnabled)
            {
                return;
            }
            const IsMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || 
                          (navigator.userAgentData && navigator.userAgentData.platform === "macOS");
            const IsInspectKey = IsMac ? Event.metaKey : Event.ctrlKey;
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
        "keyup",
        () =>
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
        "blur",
        () =>
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
    document.querySelectorAll(".SyncHighlightLayer").forEach((Layer) => { Layer.remove(); });
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
        return;
    }

    const IsMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || 
                  (navigator.userAgentData && navigator.userAgentData.platform === "macOS");
    const IsInspectKey = IsMac ? (Event.metaKey && !Event.ctrlKey) : (Event.ctrlKey && !Event.metaKey);

    if (!IsInspectKey)
    {
        return;
    }

    const PageSheet = Event.target.closest(".PageSheet");
    if (!PageSheet)
    {
        return;
    }

    const Svg = PageSheet.querySelector("svg");
    if (!Svg)
    {
        return;
    }

    Event.preventDefault();
    Event.stopPropagation();

    const PageIdMatch = PageSheet.id.match(/\d+/);
    const PageNum = PageIdMatch ? parseInt(PageIdMatch[0], 10) : 1;

    const SvgRect = Svg.getBoundingClientRect();
    const Vb = Svg.viewBox && Svg.viewBox.baseVal && Svg.viewBox.baseVal.width > 0 
        ? Svg.viewBox.baseVal 
        : { x: 0, y: 0, width: parseFloat(PageSheet.dataset.baseWidth) || 576, height: parseFloat(PageSheet.dataset.baseHeight) || 864 };

    const ClickPtX = Vb.x + (Event.clientX - SvgRect.left) * (Vb.width / SvgRect.width);
    const ClickPtY = Vb.y + (Event.clientY - SvgRect.top) * (Vb.height / SvgRect.height);

    let BestElem = null;
    let MinDist = Infinity;

    for (const Elem of ActiveSyncMap)
    {
        if (Elem.page !== PageNum)
        {
            continue;
        }

        const InX = ClickPtX >= Elem.x && ClickPtX <= (Elem.x + Elem.width);
        const InY = ClickPtY >= Elem.y && ClickPtY <= (Elem.y + Elem.height);

        if (InX && InY)
        {
            BestElem = Elem;
            break;
        }

        const CenterX = Elem.x + (Elem.width / 2);
        const CenterY = Elem.y + (Elem.height / 2);
        const Dx = ClickPtX - CenterX;
        const Dy = (ClickPtY - CenterY) * 3;
        const DistSq = (Dx * Dx) + (Dy * Dy);

        if (DistSq < MinDist)
        {
            MinDist = DistSq;
            BestElem = Elem;
        }
    }

    if (BestElem)
    {
        let Related = ActiveSyncMap.filter((Elem) => Elem.page === BestElem.page && Elem.span === BestElem.span);
        if (BestElem.line === BestElem.end_line)
        {
            const SameLineElems = ActiveSyncMap.filter
            (
                (Elem) => Elem.page === BestElem.page && Elem.line === BestElem.line && Elem.end_line === BestElem.end_line
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
                    if (Elem.page !== BestElem.page) { return false; }
                    const Inside = Elem.start >= BestElem.start && Elem.end <= BestElem.end;
                    const IsNumbering = (Elem.end_line - Elem.line) >= 2 && Elem.width < 50 && Elem.x > 450;
                    return Inside && !IsNumbering;
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
        setTimeout(() => { SuppressForwardSync = false; }, 300);
        JumpMonacoToLocation(BestElem.line, BestElem.col);
        return;
    }

    AuthenticatedFetch
    (
        "/api/sync/click",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Page: PageNum, X: ClickPtX, Y: ClickPtY })
        }
    )
    .then((Res) => Res.json())
    .then
    (
        (Result) =>
        {
            if (Result.Success)
            {
                SuppressForwardSync = true;
                setTimeout(() => { SuppressForwardSync = false; }, 300);
                JumpMonacoToLocation(Result.Line, Result.Column);
            }
        }
    )
    .catch(() => {});
}

function JumpMonacoToLocation(Line, Column)
{
    if (!MonacoInstance)
    {
        return;
    }

    MonacoInstance.revealPositionInCenter({ lineNumber: Line, column: Column });
    MonacoInstance.setPosition({ lineNumber: Line, column: Column });
    MonacoInstance.focus();
    FlashMonacoLine(Line);
}

function FlashMonacoLine(LineNumber)
{
    if (!MonacoInstance)
    {
        return;
    }

    if (!SyncLineDecorations)
    {
        SyncLineDecorations = MonacoInstance.createDecorationsCollection([]);
    }

    SyncLineDecorations.set
    ([
        {
            range: new monaco.Range(LineNumber, 1, LineNumber, 1),
            options:
            {
                isWholeLine: true,
                className: "SyncMonacoLineHighlight",
                marginClassName: "SyncMonacoLineHighlight"
            }
        }
    ]);

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

function GroupElementsIntoVisualBoxes(Elements)
{
    if (!Elements || Elements.length === 0)
    {
        return [];
    }

    const Buckets = [];
    for (const Elem of Elements)
    {
        const PageNum = Elem.page || 1;
        let Bucket = Buckets.find((B) => B.page === PageNum && Math.abs(B.y - Elem.y) < 3.5);
        if (!Bucket)
        {
            Bucket =
            {
                page: PageNum,
                y: Elem.y,
                minX: Elem.x,
                maxX: Elem.x + Elem.width,
                height: Elem.height
            };
            Buckets.push(Bucket);
        }
        else
        {
            Bucket.minX = Math.min(Bucket.minX, Elem.x);
            Bucket.maxX = Math.max(Bucket.maxX, Elem.x + Elem.width);
            Bucket.height = Math.max(Bucket.height, Elem.height);
        }
    }

    return Buckets.map
    (
        (B) =>
        ({
            page: B.page,
            x: B.minX,
            y: B.y,
            width: B.maxX - B.minX,
            height: B.height
        })
    );
}

function HighlightSvgRects(Boxes, AutoScroll = false)
{
    if (!IsSyncTexEnabled || !Boxes || Boxes.length === 0)
    {
        ClearSyncHighlights();
        return;
    }

    ActiveHighlightBoxes = Boxes;
    ActiveHighlightBox = Boxes[0] || null;

    document.querySelectorAll(".SyncHighlightLayer").forEach((Layer) => { Layer.remove(); });

    const PageBoxesMap = new Map();
    for (const Box of Boxes)
    {
        const PageNum = Box.page || 1;
        if (!PageBoxesMap.has(PageNum))
        {
            PageBoxesMap.set(PageNum, []);
        }
        PageBoxesMap.get(PageNum).push(Box);
    }

    let PrimaryPageSheet = null;
    let PrimaryTopY = Infinity;

    for (const [PageNum, PageBoxes] of PageBoxesMap.entries())
    {
        const TargetPageSheet = document.getElementById(`PageSheet_${PageNum}`) || document.querySelectorAll(".PageSheet")[PageNum - 1];
        if (!TargetPageSheet)
        {
            continue;
        }

        if (!PrimaryPageSheet)
        {
            PrimaryPageSheet = TargetPageSheet;
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

                for (const Box of PageBoxes)
                {
                    const Rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                    Rect.setAttribute("class", "SyncHighlightRect");
                    Rect.setAttribute("x", (Box.x - 2).toFixed(2));
                    Rect.setAttribute("y", (Box.y - 2).toFixed(2));
                    Rect.setAttribute("width", (Box.width + 4).toFixed(2));
                    Rect.setAttribute("height", (Box.height + 4).toFixed(2));
                    Rect.setAttribute("rx", "3");
                    Rect.setAttribute("ry", "3");

                    HighlightLayer.appendChild(Rect);

                    if (Box.y < PrimaryTopY)
                    {
                        PrimaryTopY = Box.y;
                    }
                }
            }
        );
    }

    if (AutoScroll && PrimaryPageSheet && PrimaryTopY !== Infinity)
    {
        const Viewport = document.getElementById("PreviewViewport");
        if (Viewport)
        {
            const ViewportRect = Viewport.getBoundingClientRect();
            const PageRect = PrimaryPageSheet.getBoundingClientRect();
            const VbH = parseFloat(PrimaryPageSheet.dataset.baseHeight) || 864;
            const ScaleY = PageRect.height / VbH;
            const TargetScreenY = PageRect.top + (PrimaryTopY * ScaleY);

            if (TargetScreenY < ViewportRect.top + 60 || TargetScreenY > ViewportRect.bottom - 60)
            {
                const ScrollOffset = Viewport.scrollTop + (TargetScreenY - ViewportRect.top) - (Viewport.clientHeight / 2);
                Viewport.scrollTo({ top: Math.max(0, ScrollOffset), behavior: "smooth" });
            }
        }
    }
}

function HighlightSvgRect(PageNum, X, Y, Width, Height, AutoScroll = false)
{
    HighlightSvgRects([{ page: PageNum, x: X, y: Y, width: Width, height: Height }], AutoScroll);
}

function HighlightSvgSpan(SpanId, AutoScroll = false)
{
    if (!IsSyncTexEnabled || !SpanId)
    {
        return;
    }

    const Elem = ActiveSyncMap.find((E) => E.span === SpanId) || (ActiveSpanMap && ActiveSpanMap[SpanId]);
    if (Elem && typeof Elem.x === "number")
    {
        HighlightSvgRect(Elem.page || 1, Elem.x, Elem.y, Elem.width, Elem.height, AutoScroll);
    }
}

function PerformForwardSync(Line, Col, ForceAutoScroll = false)
{
    if (!IsSyncTexEnabled || !ActiveSyncMap || ActiveSyncMap.length === 0)
    {
        ClearSyncHighlights();
        return;
    }

    // 1. Text Selection in Monaco
    if (MonacoInstance)
    {
        const Selection = MonacoInstance.getSelection();
        if (Selection && !Selection.isEmpty())
        {
            const SelStartLine = Selection.startLineNumber;
            const SelStartCol = Selection.startColumn;
            const SelEndLine = Selection.endLineNumber;
            const SelEndCol = Selection.endColumn;

            const Intersecting = ActiveSyncMap.filter
            (
                (Elem) =>
                {
                    const StartsBeforeEnd = Elem.line < SelEndLine || (Elem.line === SelEndLine && Elem.col <= SelEndCol);
                    const EndsAfterStart = Elem.end_line > SelStartLine || (Elem.end_line === SelStartLine && Elem.end_col >= SelStartCol);
                    if (!StartsBeforeEnd || !EndsAfterStart)
                    {
                        return false;
                    }
                    const IsMultiLine = (Elem.end_line - Elem.line) >= 2;
                    const IsNumbering = IsMultiLine && Elem.width < 50 && Elem.x > 450;
                    return !IsNumbering;
                }
            );

            if (Intersecting.length > 0)
            {
                const GroupedBoxes = GroupElementsIntoVisualBoxes(Intersecting);
                HighlightSvgRects(GroupedBoxes, false);
                return;
            }
        }
    }

    // 2. Cursor Position
    let Matches = ActiveSyncMap.filter
    (
        (Elem) =>
        {
            const StartsBefore = Elem.line < Line || (Elem.line === Line && Elem.col <= Col);
            const EndsAfter = Elem.end_line > Line || (Elem.end_line === Line && Elem.end_col >= Col);
            return StartsBefore && EndsAfter;
        }
    );

    if (Matches.length === 0)
    {
        Matches = ActiveSyncMap.filter((Elem) => Elem.line === Line || Elem.end_line === Line);
    }

    if (Matches.length === 0)
    {
        ClearSyncHighlights();
        return;
    }

    const ContentMatches = Matches.filter
    (
        (Elem) =>
        {
            const IsMultiLine = (Elem.end_line - Elem.line) >= 2;
            const IsNumbering = IsMultiLine && Elem.width < 50 && Elem.x > 450;
            return !IsNumbering;
        }
    );

    const Candidates = ContentMatches.length > 0 ? ContentMatches : Matches;

    let BestElem = Candidates[0];
    let MinRange = BestElem.end - BestElem.start;
    for (const Elem of Candidates)
    {
        const RangeLen = Elem.end - Elem.start;
        if (RangeLen < MinRange)
        {
            MinRange = RangeLen;
            BestElem = Elem;
        }
    }

    let Related = ActiveSyncMap.filter((Elem) => Elem.page === BestElem.page && Elem.span === BestElem.span);

    if (BestElem.line === BestElem.end_line)
    {
        const SameLineElems = ActiveSyncMap.filter
        (
            (Elem) => Elem.page === BestElem.page && Elem.line === BestElem.line && Elem.end_line === BestElem.end_line
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
                if (Elem.page !== BestElem.page)
                {
                    return false;
                }
                const Inside = Elem.start >= BestElem.start && Elem.end <= BestElem.end;
                const IsNumbering = (Elem.end_line - Elem.line) >= 2 && Elem.width < 50 && Elem.x > 450;
                return Inside && !IsNumbering;
            }
        );
        if (BlockElems.length > 0)
        {
            Related = BlockElems;
        }
    }

    const GroupedBoxes = GroupElementsIntoVisualBoxes(Related);
    HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
}

// Make functions accessible from onclick handlers
window.OpenFileFromWorkspace = OpenFileFromWorkspace;
window.RemoveWorkspaceDirectory = RemoveWorkspaceDirectory;
window.DeleteWorkspaceFile = DeleteWorkspaceFile;
window.SelectDashboardDirectory = SelectDashboardDirectory;
window.PickFolderFromDisk = PickFolderFromDisk;

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
        InitializeMonaco();
        InitializeSyncTex();
        LoadWorkspaceInfo();
        SetupAssetDragAndDrop();
        SetViewportLayout(localStorage.getItem("TypstStudio_Layout") || "split");
    }
);

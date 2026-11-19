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
let CurrentZoomLevel = 1.0;
let CurrentPageCount = 1;
let CurrentActivePage = 1;
let LastCompiledPages = [];
let IsBlackPageMode = localStorage.getItem("typst_black_page_mode") === "true";
const IsTauriDesktop = Boolean(typeof window !== "undefined" && (window.__TAURI_INTERNALS__ || window.__TAURI__));
let ActiveAbortController = null;
let RenderToken = 0;
let SessionAuthToken = window.__TYPST_STUDIO_AUTH_TOKEN__ || "";
let IsSyncTexEnabled = localStorage.getItem("typst_synctex_enabled") !== "false";
let ActiveSpanMap = {};
let ActiveSyncMap = [];
let ActiveSyncMapByLine = new Map();
let ActiveHighlightLayers = new Set();
let LastTypingTimestamp = 0;
let ActiveHighlightSpan = null;
let ActiveHighlightBox = null;
let ActiveHighlightBoxes = [];
let SuppressForwardSync = false;
let SyncLineDecorations = null;
let ForwardSyncDebounceTimer = null;

function RebuildSyncMapIndex(SyncMap)
{
    ActiveSyncMapByLine = new Map();
    if (!SyncMap || !Array.isArray(SyncMap))
    {
        return ;
    }

    for (let I = 0; I < SyncMap.length; I ++)
    {
        const Elem = SyncMap[I];
        const StartLine = Elem.line || 1;
        const EndLine = Elem.end_line || StartLine;
        for (let L = StartLine; L <= EndLine; L ++)
        {
            let LineList = ActiveSyncMapByLine.get(L);
            if (!LineList)
            {
                LineList = [];
                ActiveSyncMapByLine.set(L, LineList);
            }
            LineList.push(Elem);
        }
    }
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

function JumpToEditorLocation(Line, Col)
{
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
        MonacoInstance.updateOptions
        ({
            fontSize: Math.max(12, EditorFontSize)
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
    const MaskCache = new Map();
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
            const PrevC = I > 0 ? LineText[I - 1]: "";
            if (C === '"' && PrevC !== "\\")
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
            if (C === "/" && NextC === "/")
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
            const NextChar = ColIdx + 1 < LineText.length ? LineText[ColIdx + 1]: "";
            const PrevChar = ColIdx > 0 ? LineText[ColIdx - 1]: "";

            if (InLineComment) { break; }
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

        const PagesContainer = document.getElementById("PagesContainer");
        if (PagesContainer)
        {
            PagesContainer.innerHTML = "";
        }
        ClearSyncHighlights();
        LastCompiledPages = [];
        CurrentPageCount = 0;
        UpdatePagination();
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

function FormatTypstLAFS(Source)
{
    const Lines = Source.split(/\r?\n/);
    const ResultLines = [];
    let InRawBlock = false;
    let InBlockComment = false;

    for (let I = 0; I < Lines.length; I ++)
    {
        const Line = Lines[I];
        const Trimmed = Line.trim();

        if (Trimmed.startsWith("```"))
        {
            InRawBlock = ! InRawBlock;
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
        MonacoInstance.executeEdits
        (
            "format-lafs",[ { range: FullRange, text: FormattedValue }]
        );
        MonacoInstance.pushUndoStop();
        TriggerCompileNow();
        ShowToast("Formatted to LAFS standard", "info");
    }
}

async function InitializeMonaco()
{
    await EnsureSessionAuthToken();

    window.MonacoEnvironment =
    {
        getWorkerUrl: function(WorkerId, Label)
        {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/'
                };
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/base/worker/workerMain.js');
            `)}`;
        }
    };

    window.require.config
    ({
        paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs" }
    });

    window.require
    (
        ["vs/editor/editor.main"], () =>
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

            SyncLineDecorations = MonacoInstance.createDecorationsCollection([]);

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
                            PerformForwardSync(Event.position.lineNumber, Event.position.column);
                        },
                        DebounceMs
                    );
                }
            );

            MonacoInstance.onDidChangeCursorSelection
            (
                () =>
                {
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
                                PerformForwardSync(Pos.lineNumber, Pos.column);
                            }
                        },
                        DebounceMs
                    );
                }
            );

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

            UpdateStatusBar();
            TriggerCompileNow();
            MarkDocumentClean(MonacoInstance ? MonacoInstance.getValue(): "");
            UpdateDocumentOutline();
        }
    );
}

function UpdateStatusBar()
{
    if (!MonacoInstance) { return; }
    // High-performance O(1) character count without copying or allocating strings
    const Model = MonacoInstance.getModel();
    const Length = Model ? Model.getValueLength(): 0;
    document.getElementById("CharacterCount").textContent = `${Length} chars`;
}

function ScheduleCompile(DelayMs)
{
    if (CompileTimeoutID) { clearTimeout(CompileTimeoutID); }
    CompileTimeoutID = setTimeout
    (
        () => { TriggerCompileNow(); },
        DelayMs
    );
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

    const LAFSValidation = ValidateEditorLAFS();
    if (LAFSValidation && LAFSValidation.HasError)
    {
        const PagesContainer = document.getElementById("PagesContainer");
        if (PagesContainer)
        {
            PagesContainer.innerHTML = "";
        }
        ClearSyncHighlights();
        LastCompiledPages = [];
        CurrentPageCount = 0;
        UpdatePagination();
        StatusDot.className = "StatusDot Error";
        StatusText.textContent = "Error";
        DurationText.textContent = "0ms";
        ShowCompilationError
        (
            `Defecated (Deprecated | Outdated | Legacy) Structural Failure of 1978 K&R Slop detected: ${LAFSValidation.Errors[0] ? LAFSValidation.Errors[0].Reason : "Violation of LAFS"}`
        );
        return ;
    }

    StatusDot.className = "StatusDot Compiling";
    StatusText.textContent = "Compiling...";

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
                    body: JSON.stringify( { Source: Source }),
                    signal: Controller.signal
                }
            );

            Result = await Response.json();
        }

        if (Result.Aborted)
        {
            // Superseded by a newer compile request
            return ;
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
            RebuildSyncMapIndex(ActiveSyncMap);
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

            if (Result.KnrSlop)
            {
                const PagesContainer = document.getElementById("PagesContainer");
                if (PagesContainer)
                {
                    PagesContainer.innerHTML = "";
                }
                ClearSyncHighlights();
                LastCompiledPages = [];
                CurrentPageCount = 0;
                UpdatePagination();
            }

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
        if (ActiveAbortController === Controller)
        {
            ActiveAbortController = null;
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
    const Step = Math.max(1, Math.floor(Str.length / 500));
    for (let I = 0; I < Str.length; I += Step)
    {
        Hash ^= Str.charCodeAt(I);
        Hash = Math.imul(Hash, 16777619);
    }

    return (Hash >>> 0).toString(36) + "_" + Str.length;
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

function InvertGlyphColor(ColorStr)
{
    if (!ColorStr)
    {
        return ColorStr;
    }

    const Cached = InvertGlyphColorCache.get(ColorStr);
    if (Cached !== undefined)
    {
        return Cached;
    }

    const Trimmed = ColorStr.trim();
    if (["none", "transparent", "currentcolor", "inherit"].includes(Trimmed.toLowerCase()))
    {
        InvertGlyphColorCache.set(ColorStr, ColorStr);
        return ColorStr;
    }

    let Red = 0;
    let Green = 0;
    let Blue = 0;
    const Lower = Trimmed.toLowerCase();

    if (Lower === "white" || Lower === "#ffffff" || Lower === "#fff")
    {
        InvertGlyphColorCache.set(ColorStr, "#FFFFFF");
        return "#FFFFFF";
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
            InvertGlyphColorCache.set(ColorStr, ColorStr);
            return ColorStr;
        }
    }

    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 22)
    {
        InvertGlyphColorCache.set(ColorStr, ColorStr);
        return ColorStr;
    }

    const Avg = (Red + Green + Blue) / 3;
    if (Avg >= 240)
    {
        InvertGlyphColorCache.set(ColorStr, "#FFFFFF");
        return "#FFFFFF";
    }
    if (Avg <= 50)
    {
        InvertGlyphColorCache.set(ColorStr, "#FFFFFF");
        return "#FFFFFF";
    }

    const Inv = Math.min(255, Math.max(0, Math.round(255 - Avg)));
    const H = Inv.toString(16).padStart(2, "0").toUpperCase();
    const FinalColor = `#${H}${H}${H}`;
    InvertGlyphColorCache.set(ColorStr, FinalColor);
    return FinalColor;
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
        /<path\b([^>]*\bd=["']\s*M\s*0\s*0[vh][^"']*Z\s*["'][^>]*)>/i,
        (Match) => Match.replace(/\bfill=["'][^"']*["']/i, 'fill="none"')
    );
    Result = Result.replace('fill="#ffffff" fill-rule="nonzero" d="M 0 0v', 'fill="none" fill-rule="nonzero" d="M 0 0v');
    Result = Result.replace('fill="#FFFFFF" fill-rule="nonzero" d="M 0 0v', 'fill="none" fill-rule="nonzero" d="M 0 0v');
    return Result;
}

function ConvertSvgToDarkMode(Svg, Transparent = false)
{
    if (!Svg)
    {
        return Svg;
    }

    const SvgKey = FastHash(Svg) + (Transparent ? "_trans": "_solid");
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
        /<path\b([^>]*\bd=["']\s*M\s*0\s*0[vh][^"']*Z\s*["'][^>]*)>/i,
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
            /(<svg\b[^>]*>\s*<path\b[^>]*\bfill=)(["'][^"']*["'])/i,
            (Match, Prefix) =>
            {
                CanvasFound = true;
                return `${Prefix}"__CANVAS_BLACK_SENTINEL__"`;
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
                    const Inverted = InvertGlyphColor(Color);
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
                    const Inverted = InvertShapeColor(Color);
                    return `fill=${Quote}${Inverted}${Quote}`;
                }
            );
            Updated = Updated.replace
            (
                /\bstroke\s*=\s*(["'])([^"']+)\1/gi, (StrokeMatch, Quote, Color) =>
                {
                    const Inverted = InvertShapeColor(Color);
                    return `stroke=${Quote}${Inverted}${Quote}`;
                }
            );
            return `<${Tag}${Updated}>`;
        }
    );

    // 4. Resolve the canvas sentinel to pure pitch black #000000 or none
    const CanvasFill = Transparent ? 'fill="none"': 'fill="#000000"';
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
                        const Inverted = InvertShapeColor(Color.trim());
                        return `${Prop}: ${Inverted}`;
                    }
                );
                return `style=${Quote}${Transformed}${Quote}`;
            }
        );
    }

    if (SvgDarkModeCache.size > 200)
    {
        SvgDarkModeCache.clear();
    }
    SvgDarkModeCache.set(SvgKey, Result);
    return Result;
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

    if (!Pages || Pages.length === 0)
    {
        PagesContainer.innerHTML = "<p style='color: #666666; padding: 40px;'>No content rendered.</p>";
        return ;
    }

    const CurrentToken = ++ RenderToken;

    function NormalizeSvg(RawSvg)
    {
        return RawSvg.replace
        (
            /<svg\b([^>]*)>/i, (Match, Attrs) =>
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
        const ModeKey = IsBlackPageMode ? "dark": "light";

        if (PageDiv)
        {
            if (PageDiv.dataset.svgHash === ContentHash && PageDiv.dataset.svgMode === ModeKey)
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

        const SvgToRender = IsBlackPageMode ? ConvertSvgToDarkMode(SvgContent): SvgContent;
        const ActiveLayer = document.createElement("div");
        ActiveLayer.className = IsBlackPageMode ? "SvgLayer DarkSvgLayer": "SvgLayer LightSvgLayer";
        ActiveLayer.innerHTML = NormalizeSvg(SvgToRender);
        PageDiv.appendChild(ActiveLayer);

        return PageDiv;
    }
    // Prune excess pages if document page count decreased
    while (PagesContainer.children.length > Pages.length)
    {
        PagesContainer.removeChild(PagesContainer.lastChild);
    }
    // Render the first 2 pages immediately
    const InitialBatchCount = Math.min(Pages.length, 2);
    for (let I = 0; I < InitialBatchCount; I ++)
    {
        UpdateOrCreatePageElement(Pages[I], I);
    }

    if (Viewport && (PrevScrollTop > 0 || PrevScrollLeft > 0))
    {
        Viewport.scrollTop = PrevScrollTop;
        Viewport.scrollLeft = PrevScrollLeft;
    }
    // If more pages exist, stream them progressively via requestAnimationFrame
    if (Pages.length > InitialBatchCount)
    {
        let CurrentIndex = InitialBatchCount;
        function RenderNextBatch()
        {
            if (CurrentToken !== RenderToken)
            {
                return ;
                // Newer render has started
            }
            const ChunkSize = Pages.length > 20 ? 2: 3;
            const ChunkLimit = Math.min(Pages.length, CurrentIndex + ChunkSize);
            for (; CurrentIndex < ChunkLimit; CurrentIndex ++)
            {
                UpdateOrCreatePageElement(Pages[CurrentIndex], CurrentIndex);
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
        /\b(error|Error|ERROR|Severe Critical Fatal Error)\b/g, (Token) => `<span class = "ErrorKeywordHighlight">${Token}</span>`
    );
    // Convert file location references into clickable links
    Highlighted = Highlighted.replace
    (
        /(┌─\s*|-->\s*|\b)([a-zA-Z0-9_\-.]+\.typ):(\d+):(\d+)/g, (Full, Prefix, File, Line, Col) => `${Prefix}<span Class = "ErrorLocationLink" Data-Line = "${Line}" Data-Col = "${Col}" Title = "Click to jump to Line ${Line}, Col ${Col}">${File}:${Line}:${Col} ↗</span>`
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
        return ;
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
        return ;
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
    IsBlackPageMode = ! IsBlackPageMode;
    localStorage.setItem("typst_black_page_mode", IsBlackPageMode ? "true": "false");
    SvgDarkModeCache.clear();
    UpdateBlackPageMode();
    if (LastCompiledPages && LastCompiledPages.length > 0)
    {
        RenderPages(LastCompiledPages);
    }
}

async function ExportPdf()
{
    if (!MonacoInstance)
    {
        return ;
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
    const DocTitle = document.getElementById("DocumentTitleInput").value.trim() || "document";
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
    const DocTitle = document.getElementById("DocumentTitleInput").value.trim() || "document";
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
    let IsDragging = false;

    Resizer.addEventListener
    (
        "mousedown", (E) =>
        {
            IsDragging = true;
            Resizer.classList.add("Dragging");
            document.body.style.cursor = "col-resize";
            document.body.style.userSelect = "none";
        }
    );

    window.addEventListener
    (
        "mousemove", (E) =>
        {
            if (!IsDragging)
            {
                return ;
            }
            const ContainerWidth = document.querySelector(".MainSplitArea").clientWidth;
            const NewWidth = Math.max(260, Math.min(ContainerWidth - 260, E.clientX));
            EditorPane.style.width = `${NewWidth}px`;
        }
    );

    window.addEventListener
    (
        "mouseup", () =>
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

function ToggleDocumentOutline(ForceState)
{
    const Sidebar = document.getElementById("OutlineSidebar");
    if (!Sidebar) { return; }

    IsOutlineVisible = (typeof ForceState === "boolean") ? ForceState: ! IsOutlineVisible;
    Sidebar.style.display = IsOutlineVisible ? "flex": "none";

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
    if (!IsOutlineVisible)
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
        ? `<div Class = "OutlineEmptyState">No sections match "${Filter}"</div>`
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

function ToggleShortcutsModal(ForceOpen)
{
    const Modal = document.getElementById("ShortcutsModal");
    if (!Modal) { return; }

    const IsOpen = Modal.style.display !== "none";
    const ShouldOpen = (typeof ForceOpen === "boolean") ? ForceOpen: ! IsOpen;
    Modal.style.display = ShouldOpen ? "flex": "none";
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
    // Priority 2: Document Outline Controls
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
    if (ExportPaperSelect) { ExportPaperSelect.value = InitialBlack ? "black": "light"; }
    if (ExportPaperBadge) { ExportPaperBadge.textContent = InitialBlack ? "Black Mode (Inverted)": "Light Mode (Normal)"; }
    if (DefaultBgSelect) { DefaultBgSelect.value = InitialTrans ? "transparent": "normal"; }

    if (ExportBlackCb)
    {
        ExportBlackCb.addEventListener
        (
            "change", (E) =>
            {
                const IsBlack = E.target.checked;
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true": "false");
                if (ExportPaperSelect) { ExportPaperSelect.value = IsBlack ? "black": "light"; }
                if (ExportPaperBadge) { ExportPaperBadge.textContent = IsBlack ? "Black Mode (Inverted)": "Light Mode (Normal)"; }
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
                const IsBlack = E.target.value === "black";
                localStorage.setItem("typst_black_mode_export", IsBlack ? "true": "false");
                if (ExportBlackCb) { ExportBlackCb.checked = IsBlack; }
                if (ExportPaperBadge) { ExportPaperBadge.textContent = IsBlack ? "Black Mode (Inverted)": "Light Mode (Normal)"; }
                ShowToast(`Export paper mode set to ${IsBlack ? "Black" : "Light"}`, "info");
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
            "click", (Event) =>
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
        "click", () => { ExportPdf(); }
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
        "click", () => { SetZoom(1.0); }
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
    // Document Title Dropdown
    document.getElementById("DocDropdownToggle").addEventListener
    (
        "click", (E) =>
        {
            E.stopPropagation();
            ToggleDocDropdown();
        }
    );

    document.getElementById("DocDropdownSearch").addEventListener
    (
        "input", (E) =>
        {
            RenderDocDropdownList(E.target.value);
        }
    );

    document.getElementById("QuickNewDocBtn").addEventListener
    (
        "click", () =>
        {
            CloseDocDropdown();
            CreateNewWorkspaceFile();
        }
    );

    document.getElementById("OpenDashboardFromDropdownBtn").addEventListener
    (
        "click", () =>
        {
            CloseDocDropdown();
            SwitchView("dashboard");
        }
    );

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
    document.getElementById("SaveFileButton").addEventListener
    (
        "click", () =>
        {
            SaveCurrentFile();
        }
    );
    // View Navigation Tabs
    document.getElementById("NavEditorBtn").addEventListener
    (
        "click", () =>
        {
            SwitchView("editor");
        }
    );

    document.getElementById("NavDashboardBtn").addEventListener
    (
        "click", () =>
        {
            SwitchView("dashboard");
        }
    );

    document.getElementById("StatResumeBtn").addEventListener
    (
        "click", () =>
        {
            SwitchView("editor");
        }
    );
    // Dashboard Actions
    document.getElementById("DashboardRefreshBtn").addEventListener
    (
        "click", () =>
        {
            LoadWorkspaceInfo();
            MarkDocumentClean(Content);
            ShowToast(`Saved ${TargetPath.split(/[\/\\]/).pop()}`, "success");
        }
    );

    document.getElementById("DashboardNewFileBtn").addEventListener
    (
        "click", () =>
        {
            CreateNewWorkspaceFile();
        }
    );

    document.getElementById("PickFolderBtn").addEventListener
    (
        "click", () =>
        {
            PickFolderFromDisk();
        }
    );

    document.getElementById("AddDirectorySubmitBtn").addEventListener
    (
        "click", () =>
        {
            AddWorkspaceDirectory();
        }
    );

    document.getElementById("NewDirectoryInput").addEventListener
    (
        "keydown", (E) =>
        {
            if (E.key === "Enter")
            {
                AddWorkspaceDirectory();
            }
        }
    );

    document.getElementById("DashboardFileSearch").addEventListener
    (
        "input", (E) =>
        {
            RenderDashboard(E.target.value);
        }
    );
    // Window level Ctrl+S
    window.addEventListener
    (
        "keydown", (E) =>
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
            else if (E.key === "Escape")
            {
                ToggleShortcutsModal(false);
                ToggleExportMenu(false);
                const Drawer = document.getElementById("ErrorDrawer");
                if (Drawer) { Drawer.classList.remove("Visible"); }
            }
            if ( (E.ctrlKey || E.metaKey) && E.key === "s")
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
            if (SelectedPath && DirInput)
            {
                DirInput.value = SelectedPath;
                DirInput.focus();
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
    return Str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
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
        let Content;
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            Content = await window.__TAURI__.core.invoke("ReadWorkspaceFile", { pathStr: FilePath, PathStr: FilePath });
        }
        else
        {
            const Response = await AuthenticatedFetch(`/api/workspace/file?path=${encodeURIComponent(FilePath)}`);
            const Data = await Response.json();
            if (!Data.Success)
            {
                throw new Error(Data.Message || "Unknown error");
            }
            Content = Data.Content;
        }

        if (Content !== undefined && MonacoInstance)
        {
            CurrentFilePath = FilePath;
            const FileName = FilePath.split(/[\\/]/).pop();
            document.getElementById("DocumentTitleInput").value = FileName;
            const ActiveDocStat = document.getElementById("StatActiveDoc");
            if (ActiveDocStat)
            {
                ActiveDocStat.textContent = FileName;
            }
            MonacoInstance.setValue(Content);
            MarkDocumentClean(Content);
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
        return ;
    }

    const Content = MonacoInstance.getValue();
    let TargetPath = CurrentFilePath;

    if (!TargetPath)
    {
        const DocName = document.getElementById("DocumentTitleInput").value.trim() || "Document.typ";
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

    const FileName = prompt("Enter new Typst file name:", "NewDocument.typ");
    if (!FileName || !FileName.trim())
    {
        return ;
    }

    const CleanName = FileName.trim().endsWith(".typ") ? FileName.trim(): `${FileName.trim()}.typ`;
    const InitialContent = `#set page(paper: "a4", margin: 2.5cm)\n#set text(font: "Segoe UI", size: 11pt)\n\n= ${CleanName.replace(".typ", "")}\n\n`;

    try
    {
        let CreatedPath;
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            CreatedPath = await window.__TAURI__.core.invoke
            (
                "CreateWorkspaceFile",
                {
                    directory: TargetDir || null,
                    Directory: TargetDir || null,
                    fileName: CleanName,
                    FileName: CleanName,
                    content: InitialContent,
                    Content: InitialContent
                }
            );
        }
        else
        {
            const Response = await AuthenticatedFetch
            (
                "/api/workspace/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { Directory: TargetDir, FileName: CleanName, Content: InitialContent })
                }
            );
            const Data = await Response.json();
            if (Data.Success && Data.Path)
            {
                CreatedPath = Data.Path;
            }
            else
            {
                alert("Create failed: " + (Data.Message || "Unknown error"));
                return ;
            }
        }

        if (CreatedPath)
        {
            await LoadWorkspaceInfo();
            OpenFileFromWorkspace(CreatedPath);
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
        return ;
    }

    try
    {
        if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
        {
            await window.__TAURI__.core.invoke("DeleteWorkspaceFile", { pathStr: FilePath, PathStr: FilePath });
            await LoadWorkspaceInfo();
            if (CurrentFilePath && CurrentFilePath.toLowerCase() === FilePath.toLowerCase())
            {
                if (WorkspaceFiles.length > 0)
                {
                    OpenFileFromWorkspace(WorkspaceFiles[0].Path);
                }
            }
            return ;
        }

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
            setTimeout
            (
                () => { MonacoInstance.layout(); },
                50
            );
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
        ActiveDocElem.textContent = CurrentFilePath ? CurrentFilePath.split(/[\\/]/).pop(): "None";
    }
    // Render Tracked Directories
    const DirListContainer = document.getElementById("TrackedDirectoryList");
    if (DirListContainer)
    {
        let DirHtml = "";
        // All Folders Option
        const IsAllActive = ! ActiveSelectedDirectory;
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
            )
            .length;

            const EscapedDir = Dir.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
            const CanDelete = WorkspaceDirectories.length > 1;
            const IsSelected = ActiveSelectedDirectory && (ActiveSelectedDirectory.toLowerCase() === Dir.toLowerCase());
            const ActiveClass = IsSelected ? "IsActiveDirectory": "";

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
            return ;
        }

        let FilesHtml = BannerHtml;
        for (const File of FilteredFiles)
        {
            const IsActive = CurrentFilePath && (File.Path.toLowerCase() === CurrentFilePath.toLowerCase());
            const ActiveClass = IsActive ? "IsActiveCard": "";
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

    const IsMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform) || (navigator.userAgentData && navigator.userAgentData.platform === "macOS");
    const IsInspectKey = IsMac ? (Event.metaKey && !Event.ctrlKey): (Event.ctrlKey && !Event.metaKey);

    if (!IsInspectKey)
    {
        return ;
    }

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
        let Related = ActiveSyncMap.filter
        (
            (Elem) => Elem.span === BestElem.span || (Elem.line === BestElem.line && Elem.end_line === BestElem.end_line)
        );
        if (BestElem.line === BestElem.end_line)
        {
            const SameLineElems = ActiveSyncMap.filter
            (
                (Elem) => Elem.line === BestElem.line && Elem.end_line === BestElem.end_line
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
                    const VerticallyAdjacent = OverlapX && (OverlapY >= - 14.0) && (Math.abs(BoxA.x - BoxB.x) < 25.0);

                    if (OverlapX && (SameLine || OverlapY >= - 1.0 || VerticallyAdjacent))
                    {
                        const MinX = Math.min(BoxA.x, BoxB.x);
                        const MaxX = Math.max(BoxA.x + BoxA.width, BoxB.x + BoxB.width);
                        const MinY = Math.min(BoxA.y, BoxB.y);
                        const MaxY = Math.max(BoxA.y + BoxA.height, BoxB.y + BoxB.height);

                        BoxA =
                        {
                            page: PageNum,
                            x: MinX,
                            y: MinY,
                            width: MaxX - MinX,
                            height: MaxY - MinY
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

function GroupElementsIntoVisualBoxes(Elements)
{
    if (!Elements || Elements.length === 0)
    {
        return [];
    }

    const PageGroups = new Map();
    for (const Elem of Elements)
    {
        const PageNum = Elem.page || 1;
        if (!PageGroups.has(PageNum))
        {
            PageGroups.set(PageNum,[]);
        }
        PageGroups.get(PageNum).push( { ...Elem });
    }

    const FinalBoxes = [];

    for (const[PageNum, PageElements] of PageGroups.entries())
    {
        const LineClusters = [];
        PageElements.sort
        (
            (A, B) => ( (A.y + A.height / 2) - (B.y + B.height / 2)) || (A.x - B.x)
        );

        for (const Box of PageElements)
        {
            const CenterY = Box.y + (Box.height / 2);
            let Cluster = LineClusters.find( (C) => Math.abs(C.CenterY - CenterY) < 10.0);
            if (!Cluster)
            {
                LineClusters.push
                ({
                    CenterY: CenterY, Boxes:[Box]
                });
            }
            else
            {
                Cluster.Boxes.push(Box);
                Cluster.CenterY = Cluster.Boxes.reduce( (Sum, B) => Sum + B.y + B.height / 2, 0) / Cluster.Boxes.length;
            }
        }

        for (const Cluster of LineClusters)
        {
            const CBoxes = Cluster.Boxes;
            const MinX = Math.min
            (
                ...CBoxes.map( (B) => B.x)
            );
            const MaxX = Math.max
            (
                ...CBoxes.map( (B) => B.x + B.width)
            );
            const MinY = Math.min
            (
                ...CBoxes.map( (B) => B.y)
            );
            const MaxY = Math.max
            (
                ...CBoxes.map( (B) => B.y + B.height)
            );

            FinalBoxes.push
            ({
                page: PageNum,
                x: MinX,
                y: MinY,
                width: MaxX - MinX,
                height: MaxY - MinY
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

    let ScrollTargetPage = null;
    for (const PageNum of PageBoxesMap.keys())
    {
        if (PageNum > 1)
        {
            ScrollTargetPage = PageNum;
        }
    }
    if (!ScrollTargetPage)
    {
        ScrollTargetPage = PageBoxesMap.keys().next().value;
    }

    let PrimaryPageSheet = document.getElementById(`PageSheet_${ScrollTargetPage}`) || document.querySelectorAll(".PageSheet")[ScrollTargetPage - 1];
    let PrimaryTopY = Infinity;

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
                    const PadX = 2.0;
                    const TopShift = Math.max(2.8, Box.height * 0.32);
                    const RectHeight = Math.max(8.0, Box.height * 0.90);
                    Rect.setAttribute("x", (Box.x - PadX).toFixed(2));
                    Rect.setAttribute("y", (Box.y + TopShift).toFixed(2));
                    Rect.setAttribute
                    (
                        "width", (Box.width + (PadX * 2.0)).toFixed(2)
                    );
                    Rect.setAttribute
                    (
                        "height", RectHeight.toFixed(2)
                    );
                    Rect.setAttribute("rx", "3");
                    Rect.setAttribute("ry", "3");

                    HighlightLayer.appendChild(Rect);

                    if (PageNum === ScrollTargetPage && (Box.y + TopShift) < PrimaryTopY)
                    {
                        PrimaryTopY = Box.y + TopShift;
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

            // If already within visible viewport bounds, avoid redundant scroll animation
            const IsAlreadyVisible = (TargetScreenY >= ViewportRect.top + 60) &&
                (TargetScreenY <= ViewportRect.bottom - 60);

            if (!IsAlreadyVisible)
            {
                const ScrollOffset = Viewport.scrollTop + (TargetScreenY - ViewportRect.top) - (Viewport.clientHeight / 2);
                const ScrollBehavior = (Date.now() - LastTypingTimestamp < 800) ? "auto": "smooth";
                Viewport.scrollTo
                ({
                    top: Math.max(0, ScrollOffset), behavior: ScrollBehavior
                });
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

function PerformForwardSync(Line, Col, ForceAutoScroll = true)
{
    if (!IsSyncTexEnabled || !ActiveSyncMap || ActiveSyncMap.length === 0)
    {
        ClearSyncHighlights();
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
            const CandidateSet = new Set();
            for (let L = SelStartLine; L <= SelEndLine; L ++)
            {
                const LineList = ActiveSyncMapByLine.get(L);
                if (LineList)
                {
                    for (let I = 0; I < LineList.length; I ++)
                    {
                        CandidateSet.add(LineList[I]);
                    }
                }
            }
            const Candidates = CandidateSet.size > 0 ? Array.from(CandidateSet): ActiveSyncMap;

            // Find overlapping elements using rock-solid Line & Column coordinates (UTF-16 aligned)
            const IntersectingRaw = Candidates.filter
            (
                (Elem) =>
                {
                    const StartsBeforeEnd = Elem.line < SelEndLine || (Elem.line === SelEndLine && Elem.col < SelEndCol);
                    const EndsAfterStart = Elem.end_line > SelStartLine || (Elem.end_line === SelStartLine && Elem.end_col > SelStartCol);

                    if (!StartsBeforeEnd || !EndsAfterStart)
                    {
                        return false;
                    }
                    const IsMultiLine = (Elem.end_line - Elem.line) >= 2;
                    const IsNumbering = IsMultiLine && Elem.width < 50 && Elem.x > 450;
                    return ! IsNumbering;
                }
            );
            // Filter out enclosing multi-line container blocks when leaf text elements exist
            const HasLeaf = IntersectingRaw.some( (E) => E.line === E.end_line);
            const Intersecting = HasLeaf
            ? IntersectingRaw.filter( (E) => E.line === E.end_line)
            : IntersectingRaw;

            if (Intersecting.length > 0)
            {
                const CharacterBoxes = [];
                for (const Elem of Intersecting)
                {
                    const ELen = Math.max(1, Elem.end_col - Elem.col);
                    let SubStartCol = Elem.col;
                    let SubEndCol = Elem.end_col;

                    if (Elem.line === SelStartLine)
                    {
                        SubStartCol = Math.max(SubStartCol, SelStartCol);
                    }
                    if (Elem.end_line === SelEndLine)
                    {
                        SubEndCol = Math.min(SubEndCol, SelEndCol);
                    }

                    if (SubEndCol > SubStartCol)
                    {
                        const FracStart = (SubStartCol - Elem.col) / ELen;
                        const FracEnd = (SubEndCol - Elem.col) / ELen;
                        const SubX = Elem.x + (Elem.width * FracStart);
                        const SubW = Math.max(2.0, Elem.width * (FracEnd - FracStart));

                        CharacterBoxes.push
                        ({
                            page: Elem.page || 1,
                            x: SubX,
                            y: Elem.y,
                            width: SubW,
                            height: Elem.height
                        });
                    }
                }

                const GroupedBoxes = GroupElementsIntoVisualBoxes(CharacterBoxes);
                HighlightSvgRects(GroupedBoxes, ForceAutoScroll);
                return ;
            }

            ClearSyncHighlights();
            return ;
        }
    }
    // 2. Line Content Elements: Highlight Everything in that same Hierarchy
    const TrimmedLine = LineText.trim();
    if
    (
        TrimmedLine.length <= 1 || ["$", "mat", "vec", "(", ")", "[", "]", "{", "}", ";", ",", "="].includes(TrimmedLine)
    )
    {
        ClearSyncHighlights();
        return ;
    }

    const SameLineRaw = ActiveSyncMapByLine.get(Line) || (ActiveSyncMap.length < 500 ? ActiveSyncMap: []);
    const SameLineCandidates = SameLineRaw.filter
    (
        (Elem) => (Elem.line === Line && Elem.end_line === Line) && ! (Elem.width < 50 && Elem.x > 450)
    );

    if (SameLineCandidates.length > 0)
    {
        // Check for multiple table cells on this line: [*Component*], [*Status*],
        const CellRegex = /\[([^\]]*)\]/g;
        let CellMatch;
        const LineCells = [];

        while
        (
            (CellMatch = CellRegex.exec(LineText)) !== null
        )
        {
            LineCells.push
            ({
                StartCol: CellMatch.index + 1,
                EndCol: CellMatch.index + CellMatch[0].length
            });
        }

        if (LineCells.length > 1)
        {
            const InsideCell = LineCells.find( (C) => Col >= C.StartCol && Col <= C.EndCol);
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
                // Cursor is in the space or comma between cells -> highlight all cells in the row
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
        return ;
    }
    // Line has no rendered glyphs (empty line, blank spaces, $, mat, delimiters) -> NO HIGHLIGHT
    ClearSyncHighlights();
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
        LoadAvailableFonts();
        SetupAssetDragAndDrop();
        SetViewportLayout(localStorage.getItem("TypstStudio_Layout") || "split");
    }
);

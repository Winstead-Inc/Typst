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
      line(length: 100%, stroke: 0.4pt + rgb("cccccc"))
    }
  },
  footer: context
  {
    let PageNum = counter(page).get().first()
    if PageNum > 1
    {
      line(length: 100%, stroke: 0.4pt + rgb("cccccc"))
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
  font: ("Times New Roman", "Segoe UI"),
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
    #rect(width: 80pt, height: 24pt, radius: 4pt, fill: rgb("4338ca"), stroke: 0.5pt + rgb("6366f1"))
    [
      #align(center + horizon)[#text(8pt, fill: rgb("ffffff"), weight: "bold")[Indigo Vector]]
    ]
  ]
]

= Mathematics & Equations <sec:math>

Typst features a native math engine with KaTeX parity. Inline expressions like $E = m c^2$ and $lim_(x -> 0) (sin x) / x = 1$ flow seamlessly within text paragraphs.

Display block equations feature automated numbering and alignment:

$
  integral_(-infinity)^infinity e^(-x^2) dif x = sqrt(pi)
$ <eq:gaussian>

We can also formulate complex linear transformations using matrices:

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

Equation @eq:gaussian defines the Gaussian integral, and @eq:rotation illustrates 2D affine rotation.

= Data Tables & Figures <sec:tables>

Tables in Typst support dynamic borders, alternating row fills, and automated alignment:

#figure
(
  table
  (
    columns: (1.5fr, 1fr, 1.2fr, 2fr),
    fill: (col, row) => if row == 0 { rgb("f0f4f8") } else if calc.even(row) { rgb("fafafa") } else { none },
    stroke: 0.5pt + rgb("dddddd"),
    align: (col, row) => if col == 0 { left } else { center },
    table.header([*Module Name*], [*Status*], [*Latency*], [*Architectural Role*]),
    [Syntax Parser], [Active], [4.2 ms], [Incremental Allman AST Generation],
    [Layout Engine], [Active], [18.7 ms], [Vector Box Positioning & Justification],
    [PDF Producer], [Active], [12.1 ms], [Tagged PDF/UA Production],
    [SVG Renderer], [Active], [6.4 ms], [Real-Time Browser DOM Streaming]
  ),
  caption: [System Pipeline Benchmark Results]
) <tab:benchmarks>

= Computational Scripting & Programmatic Generation

Typst features a built-in Turing-complete functional scripting language:

#let MetricBadge(Name, Score) =
{
  rect(width: 100%, stroke: 0.5pt + rgb("e5e7eb"), radius: 4pt, fill: rgb("f9fafb"))
  [
    #box(inset: 6pt)
    [
      *#Name*: #h(1fr) #text(weight: "bold", fill: if Score > 90 { rgb("16a34a") } else { rgb("2563eb") })[#Score / 100]
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
    }
}

function InitializeMonaco()
{
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
                        "editorBracketHighlight.foreground1": "#00e5ff",
                        "editorBracketHighlight.foreground2": "#f472b6",
                        "editorBracketHighlight.foreground3": "#a855f7",
                        "editorBracketHighlight.foreground4": "#4ade80",
                        "editorBracketHighlight.foreground5": "#fb7185",
                        "editorBracketHighlight.foreground6": "#818cf8",
                        "editorBracketHighlight.unexpectedBracket.foreground": "#ff5555",
                        // Matching Bracket Pair Connecting Guide Lines
                        "editorBracketPairGuide.activeBackground1": "#00e5ff",
                        "editorBracketPairGuide.activeBackground2": "#f472b6",
                        "editorBracketPairGuide.activeBackground3": "#a855f7",
                        "editorBracketPairGuide.activeBackground4": "#4ade80",
                        "editorBracketPairGuide.activeBackground5": "#fb7185",
                        "editorBracketPairGuide.activeBackground6": "#818cf8"
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
                        bracketPairsHorizontal: false,
                        highlightActiveBracketPair: false,
                        indentation: false
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

            // Fast, non-blocking status bar update using O(1) getValueLength()
            MonacoInstance.onDidChangeModelContent
            (
                (Event) =>
                {
                    UpdateStatusBar();
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

            UpdateStatusBar();
            TriggerCompileNow();
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
        const Response = await fetch
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
            RenderPages(Result.Pages);
            UpdatePagination();
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

        const EffectiveSvg = IsBlackPageMode ? ConvertSvgToDarkMode(SvgContent) : SvgContent;

        const VbMatch = EffectiveSvg.match(/viewBox\s*=\s*["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i);
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

        const CleanSvg = EffectiveSvg.replace
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

        PageDiv.innerHTML = CleanSvg;
        return PageDiv;
    }

    // Render the first 2 pages immediately so initial view renders in <5ms
    const InitialBatchCount = Math.min(Pages.length, 2);
    for (let I = 0; I < InitialBatchCount; I++)
    {
        PagesContainer.appendChild(CreatePageElement(Pages[I], I));
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
    ErrorContent.textContent = ErrorErrorMessageClean(ErrorMessage);
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
    const Icon = document.getElementById("BlackPageIcon");
    const Label = document.getElementById("BlackPageLabel");
    const Button = document.getElementById("BlackPageToggle");

    if (IsBlackPageMode)
    {
        Container.classList.add("BlackPageMode");
        if (Icon) { Icon.textContent = "☀️"; }
        if (Label) { Label.textContent = "Light Page"; }
        if (Button) { Button.classList.add("Active"); }
    }
    else
    {
        Container.classList.remove("BlackPageMode");
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
    if (LastCompiledPages && LastCompiledPages.length > 0)
    {
        RenderPages(LastCompiledPages);
    }
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
        const Response = await fetch
        (
            "/api/export/pdf",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Source: Source, FileName: DocTitle })
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

        StatusDot.className = "StatusDot";
        StatusText.textContent = "PDF Exported";
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
        const Response = await fetch
        (
            "/api/export/png",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Source: Source, PageNum: CurrentActivePage })
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

function SetupEventListeners()
{
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
        const Response = await fetch("/api/workspace/pick-folder", { method: "POST" });
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
        const Response = await fetch("/api/workspace/info");
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
        const Response = await fetch(`/api/workspace/file?path=${encodeURIComponent(FilePath)}`);
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
        const Response = await fetch
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
        const Response = await fetch
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
        const Response = await fetch
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
        const Response = await fetch
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
        const Response = await fetch
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

// Make functions accessible from onclick handlers
window.OpenFileFromWorkspace = OpenFileFromWorkspace;
window.RemoveWorkspaceDirectory = RemoveWorkspaceDirectory;
window.DeleteWorkspaceFile = DeleteWorkspaceFile;
window.SelectDashboardDirectory = SelectDashboardDirectory;
window.PickFolderFromDisk = PickFolderFromDisk;

window.addEventListener
(
    "DOMContentLoaded",
    () =>
    {
        LoadUISettings();
        ApplyUISettings();
        SetupEventListeners();
        SetupAppearanceEventListeners();
        UpdateBlackPageMode();
        InitializeMonaco();
        LoadWorkspaceInfo();
    }
);

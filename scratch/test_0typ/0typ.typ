#set page
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
  font: ("TT Lakes Neue Trl Cnd", "Times New Roman"),
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
  #text(24pt, weight: "bold")[Comprehensive Typst Showcase]\
  #v(0.5em)
  #text(12pt, style: "italic", fill: rgb("555555"))[Demonstrating Modern Vector Typesetting, Scripting, Tables & Math]\
  #v(0.8em)
  #text(10pt)[By Dr. Antigravity #footnote[Advanced Agentic Coding Research Group] • Published: #datetime.today().display()]\
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

  Inline formatting supports *bold emphasis*, _italic styling_, and `inline monospaced code`. Footnotes can be inserted inline #footnote[Footnotes automatically position at page bottoms with dynamic separator lines.] and cross-referenced dynamically.

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
  nabla times arrow(E) &= - (partial arrow(B)) / (partial t) \
  nabla times arrow(B) &= mu_0 arrow(J) + mu_0 epsilon_0 (partial arrow(E)) / (partial t)
$

= Data Tables & Figures <sec:tables>

Typst features high-performance tables supporting custom fills, alternating strokes, cell spanning, and nested hierarchical sub-tables.

== Advanced Merged Cells (Colspan & Rowspan)
The table below illustrates multi-column headers (`colspan`) and multi-row categorical spans (`rowspan`) with coordinate alignment:

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
  [ - *Phase #Step*: Initialized execution cycle with computed parameter #calc.pow(Step, 2).\ ]
}

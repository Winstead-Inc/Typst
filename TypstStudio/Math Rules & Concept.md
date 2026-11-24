# Formal Rule: Semantic Math Forward-Sync Highlighting (`Rust | Tauri | JS`)

This specification defines the mandatory architecture, resolution rules, and rendering invariants for **Math Forward-Sync Highlighting** in Typst/LAFS-enabled editors using a **Rust + Tauri + JavaScript** stack. Every agent or engineer implementing or modifying forward-sync behavior MUST adhere to these rules without exception.

---

## 1. Core Concept & Design Objective

Math expressions in Typst combine structural containers (`$ ... $`, `mat(...)`, `vec(...)`, `cases(...)`, `frac`, `binom`, `lr(...)`), multi-line LAFS formatting, and dense two-dimensional SVG glyph layouts (tall delimiters, vertically stacked matrices, centered rows, subscripts, fraction bars, and equation numbers). Simple line-number matching or horizontal proximity clustering breaks down in math mode because a single line can contain multiple nested containers, while a single container (`mat`, `vec`) can span multiple source lines with misaligned horizontal glyph centers.

Math Forward-Sync MUST therefore operate on **Semantic Syntax Spans** resolved from the source AST/structure rather than raw line heuristics, enforcing three core guarantees:

1. **Structural Completeness:** Selecting any boundary of a math block or container (opening or closing `$`, `mat`, `(`, `)`, `[`, `]`, `{`, `}`, or `$ <label>`) highlights the **entire logical construct as one unified rectangle**, including its rendered outer delimiters.
2. **Zero Fragmentation:** A single math construct or container MUST NEVER split into disjoint partial boxes (for example, merging rows 1–2 of a 3-row vector while isolating row 3 in a separate box).
3. **Zero Bleed:** Highlighting MUST NEVER leak outside the active math block into surrounding prose paragraphs, headings, page numbers, headers, or neighboring equations.

---

## 2. The 4-Tier Semantic Resolution Hierarchy

When the editor cursor moves to `(Line, Column)` inside or on the boundary of a Typst math context, the resolver MUST classify the cursor position according to the following strict top-down priority order.

| **Tier**                           | **Cursor Context (Source)**                                                                                                                                                                                               | **Mandatory Highlight Target (Preview)**                                                                                                          | **Boundary / Delimiter Inclusion**                                                                                                                                                                                        |
| :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tier 1: Equation Block & Label** | Standalone opening `$`, standalone closing `$`, inline `$` boundary, or equation label `$ <eq:...>`                                                                                                                     | The **entire rendered equation** (all glyphs in `[MathStartByte..MathEndByte]`)                                                                 | Includes all terms, operators, and outer parentheses/brackets of the equation; if cursor is specifically on `<eq:...>`, highlight either the equation number `(N)` if isolated cleanly or the entire labeled equation block |
| **Tier 2: Math Container**         | Function head (`mat`, `vec`, `cases`, `binom`, `frac`, `lr`, `abs`, `norm`, `sqrt`, `root`), opening delimiter `(`, `[`, `{`, **closing delimiter `)`, `]`, `}`**, or row separator `;` | The **entire enclosing math construct** as **one unified box** (or the current row if cursor is directly on `;` inside `mat`/`cases`) | **MUST** include the rendered outer math delimiters (tall parentheses, curly brace, square brackets, fraction bar, radical sign) belonging to that construct                                                              |
| **Tier 3: Argument / Row / Cell**  | Cursor inside an argument/cell of `vec(...)`, `mat(...)`, `cases(...)`, or `frac(...)` on whitespace, operators between terms, or when sub-token SVG spans are unavailable                                              | The **exact argument, matrix cell, row, or numerator/denominator** containing the cursor                                                          | Excludes sibling rows/arguments and excludes the outer container delimiters                                                                                                                                                     |
| **Tier 4: Leaf Token / Symbol**    | Cursor directly on or touching a specific leaf token (`theta`, `phi`, `cos`, `sin`, `x`, `1`, `+`, `-`, `=`, subscript/superscript leaf) when exact sub-span SVG mapping exists                               | **Only that exact rendered symbol/token** (or contiguous function glyph group such as `cos`)                                                    | Exact glyph bounds of the leaf token; falls back cleanly to **Tier 3** (never partial multi-row merges) if token-level span data is absent                                                                                |

---

## 3. Invariant Laws of Math Highlighting

### Law 1: Bidirectional Container Matching (Anti-Forward-Only Bug)

When the cursor rests on a closing delimiter (`)`, `]`, `}`, or closing `$`), the resolver MUST trace **backward** using a stack-balanced scanner (or AST parent lookup) within the enclosing math block to locate the matching opening delimiter and any attached function head (`mat`, `vec`, `cases`, `lr`, `binom`). It is **strictly forbidden** to scan only forward from a closing delimiter or to fall back to selecting arbitrary lines after the closing delimiter (such as `Line + 1..Line + 15`).

### Law 2: Single-Union Bounding Box (Zero-Orphan Law)

Every resolved `Tier 1`, `Tier 2`, or `Tier 3` math target MUST render as **exactly one unified bounding box** per page. The frontend MUST compute the union `(MinX, MinY, MaxX, MaxY)` over all SVG glyphs matching the resolved source span on that page. It is **strictly forbidden** to cluster math glyphs using horizontal X-alignment thresholds (such as `Math.abs(BoxA.x - BoxB.x) < 25.0`), which corrupts centered rows (`vec(a + b, c + d, 1)`) into split boxes. Multiple boxes are permitted **only** when a single target legitimately wraps across a **page break** (one box per page).

### Law 3: Exact Span & Vertical-Center Containment (Zero-Bleed Law)

Glyph matching MUST bind primarily by **exact source span overlap** `(GlyphSpanStart >= TargetStart && GlyphSpanEnd <= TargetEnd)` emitted by the Rust compiler layer. Whenever geometric fallback is required, glyphs MUST be filtered by **vertical-center containment** (`GlyphCenterY >= Box.y - 1.5 && GlyphCenterY <= Box.y + Box.height + 3.5`) with tight horizontal overlap. Proportional vertical padding scaled by container height (such as `Box.height * 0.25`) is **strictly forbidden** because tall blocks pull in headers, page numbers, and neighboring paragraphs.

### Law 4: LAFS Boundary-Line Transparency

Under LAFS formatting, `$`, `(`, `)`, `[`, `]`, `{`, and `}` frequently occupy standalone lines with zero direct glyph output in Typst's frame tree. Standalone delimiter lines MUST resolve to the **full span of the container they open or close**, never returning an empty match and never falling through to surrounding text.

### Law 5: Non-Disruptive Viewport Auto-Scroll

Clicking or moving the cursor within the editor MUST inspect whether the computed unified math highlight box is already completely visible inside `PreviewViewport` (including a small vertical safety margin). If the target box is already visible in the viewport, `PreviewViewport` MUST NOT scroll. Only when the target box lies partially or wholly outside the visible viewport (or on explicit click/jump navigation to an off-screen target) may the viewport scroll to center the target's vertical midpoint.

### Law 6: Visual Contrast & Color Compliance

All math highlight overlays, outlines, and gutter indicators MUST strictly obey the LAFS Contrast Policy: primary highlight stroke `#7100FF`, translucent fill `rgba(113, 0, 255, 0.14)` or `#7100FF22`, and `#C77DFF` / `#3D5AFE` for secondary nested indicators. All `#00E5FF` cyan variants and yellow/amber hues are **strictly forbidden**.

---

## 4. Cross-Layer Implementation Architecture (`Rust | Tauri | JS`)

### 4.1 Layer 1 — Rust Syntax & Cursor Target Resolver

The Rust backend MUST inspect the source text directly using `typst_syntax::parse` (or an equivalent linear-time deterministic scanner—never backtracking regexes, in compliance with ReDoS prevention) and checked arithmetic for all UTF-8 byte / UTF-16 column conversions.

```rust
#[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, Eq)]
pub enum Math_Target_Kind
{
    Equation_Block,
    Equation_Label,
    Math_Container,
    Math_Row_Or_Arg,
    Math_Token,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Math_Sync_Target
{
    pub Target_Kind: Math_Target_Kind,
    pub Start_Byte: usize,
    pub End_Byte: usize,
    pub Start_Line: usize,
    pub End_Line: usize,
    pub Include_Outer_Delimiters: bool,
}
```

#### Resolution Algorithm in Rust (`ResolveMathTargetAtCursor`)

1. Convert `(LineIndex, ColumnIndex)` (1-based or 0-based consistently documented at the IPC boundary) to a validated `CursorByte` inside `SourceText.len()` using checked arithmetic. If out of bounds, return `None`.
2. Parse `SourceText` into a `typst_syntax::SyntaxNode` tree (`LinkedNode::new(&RootNode)`) and locate the deepest leaf node at `CursorByte` (also checking `CursorByte.saturating_sub(1)` when the cursor sits immediately to the right of a closing delimiter such as `)` or `$`).
3. Walk upward through `LinkedNode` ancestors to check whether the cursor resides inside a `SyntaxKind::Equation` node (or directly on a `SyntaxKind::Label` attached immediately after a `SyntaxKind::Equation`):
   - **Case A (Opening/Closing `$` or Trailing `<label>`):** If the cursor is on the opening `$`, closing `$`, or the `Label` of a labeled equation, return `Math_Target_Kind::Equation_Block` spanning the entire `Equation` byte range `[EqStart, EqEnd]` with `Include_Outer_Delimiters = true`.
   - **Case B (Container Delimiter or Function Head):** If the cursor is on `(`, `)`, `[`, `]`, `{`, `}`, or the identifier head of a math function call (`mat`, `vec`, `cases`, `binom`, `frac`, `lr`, `abs`, `norm`, `sqrt`, `root`), walk to that enclosing `MathDelimited` or `FuncCall` node and return `Math_Target_Kind::Math_Container` spanning its full `[NodeStart, NodeEnd]` range with `Include_Outer_Delimiters = true`.
   - **Case C (Leaf Math Token):** If the cursor is directly inside a leaf `MathIdent`, `Ident`, `Number`, `Text`, or math operator token inside math mode, return `Math_Target_Kind::Math_Token` spanning `[TokenStart, TokenEnd]`. If the rendered SVG carries only argument/container-level spans, the frontend uses the enclosing `ParentArgSpan` attached as fallback metadata.
   - **Case D (Interior Whitespace / Separator):** If the cursor is on whitespace, `,`, or `;` inside a math call/delimited block, resolve to the current argument/row (`Math_Target_Kind::Math_Row_Or_Arg`) spanning that argument's byte range, or to the enclosing `Math_Container` if outside any specific argument.

```rust
pub fn LineColToByteOffset(SourceText: &str, TargetLineZeroBased: usize, TargetUtf16ColZeroBased: usize) -> Option<usize>
{
    let mut CurrentLine: usize = 0;
    let mut LineStartByte: usize = 0;

    for (ByteIdx, Ch) in SourceText.char_indices()
    {
        if CurrentLine == TargetLineZeroBased { break; }
        if Ch == '\n'
        {
            CurrentLine = CurrentLine.checked_add(1)?;
            LineStartByte = ByteIdx.checked_add(1)?;
        }
    }

    if CurrentLine != TargetLineZeroBased { return None; }

    let LineSlice = &SourceText[LineStartByte..];
    let LineEndRel = LineSlice.find('\n').unwrap_or(LineSlice.len());
    let BoundedLine = &LineSlice[..LineEndRel];

    let mut Utf16Acc: usize = 0;
    for (RelByteIdx, Ch) in BoundedLine.char_indices()
    {
        if Utf16Acc >= TargetUtf16ColZeroBased { return LineStartByte.checked_add(RelByteIdx); }
        Utf16Acc = Utf16Acc.checked_add(Ch.len_utf16())?;
    }

    LineStartByte.checked_add(BoundedLine.len())
}
```

### 4.2 Layer 2 — Rust Compiled Frame & SVG Span Attribution

During compilation/export in Rust, every rendered glyph, shape (fraction bars, radical overbars, matrix delimiters), and text run in the Typst `Frame` tree carries a `typst::syntax::Span`. The Rust compiler bridge MUST preserve and emit exact source byte ranges alongside rendered coordinates so the JS overlay engine never has to guess which SVG glyph belongs to which delimiter.

```rust
#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Rendered_Span_Box
{
    pub Page_Index: usize,
    pub Start_Byte: usize,
    pub End_Byte: usize,
    pub Start_Line: usize,
    pub End_Line: usize,
    pub X: f64,
    pub Y: f64,
    pub Width: f64,
    pub Height: f64,
    pub Is_Delimiter: bool,
}
```

Crucial requirements for Frame/SVG span extraction in Rust:

1. **Preserve Delimiter Glyphs:** Tall parentheses, curly braces in `cases(...)`, brackets in `mat(delim: "[", ...)`, fraction rules, and square-root radicals MUST NOT be stripped when building `Rendered_Span_Box` entries. Their `Span` MUST resolve to the enclosing `Math_Container` byte range so `Include_Outer_Delimiters = true` captures them automatically.
2. **Preserve Equation Numbers:** When an `Equation` produces a right-aligned counter `(1)`, store its bounding box under the `Equation_Block` span (or mark it explicitly as equation numbering) so `Equation_Block` highlighting remains clean and bounded to the page content column.
3. **Zero Unchecked Indexing:** All slice operations on `SourceText` derived from `Span` byte ranges MUST use `.get(Start..End)` and verify `is_char_boundary` before constructing substrings or line/column mappings.

### 4.3 Layer 3 — Tauri IPC Contract

Expose a dedicated, input-validated Tauri command for cursor-to-math resolution (or bundle the resolved span map with each compile response to avoid IPC round-trip latency on rapid typing):

```rust
#[tauri::command]
pub fn Resolve_Math_Forward_Sync
(
    Source_Text: String,
    Line_Zero_Based: usize,
    Col_Utf16_Zero_Based: usize
) -> Result<Option<Math_Sync_Target>, String>
{
    if Source_Text.len() > 16 * 1024 * 1024 { return Err(String::from("Source exceeds maximum allowed buffer size")); }
    let Target = ResolveMathTargetAtCursor(&Source_Text, Line_Zero_Based, Col_Utf16_Zero_Based);
    Ok(Target)
}
```

If an active sync index is already cached in JS per compile generation, Rust MAY emit the AST `Math_Container` / `Equation_Block` / `Math_Token` span table alongside the compiled SVG payload so JS resolves cursor moves synchronously in `< 1 ms` with zero IPC delay.

### 4.4 Layer 4 — JavaScript Preview Highlight Engine

The JS preview layer MUST follow strict single-union construction, safe DOM element creation (`document.createElementNS` / `createElement`—never `innerHTML` with unescaped content), and LAFS styling.

```javascript
const MATH_HIGHLIGHT_CONFIG =
{
    StrokeColor: "#7100FF",
    FillColor: "rgba(113, 0, 255, 0.14)",
    StrokeWidthPt: 1.25,
    PaddingPt: 2.5,
    BorderRadiusPt: 3.5,
    VisibleMarginPx: 24
};

function CollectMatchingSpanBoxes(SpanIndex, MathTarget)
{
    if (!MathTarget || !Array.isArray(SpanIndex)) { return []; }

    const ExactAndNested = SpanIndex.filter
    (
        (Entry) =>
        {
            const WithinRange = (Entry.Start_Byte >= MathTarget.Start_Byte) && (Entry.End_Byte <= MathTarget.End_Byte);
            if (!WithinRange) { return false; }
            if (!MathTarget.Include_Outer_Delimiters && Entry.Is_Delimiter) { return false; }
            return true;
        }
    );

    if (ExactAndNested.length > 0) { return ExactAndNested; }

    // Fallback for leaf tokens whose fine byte span rolled up to the parent container
    return SpanIndex.filter
    (
        (Entry) =>
        {
            return (Entry.Start_Byte <= MathTarget.Start_Byte) && (Entry.End_Byte >= MathTarget.End_Byte);
        }
    );
}

function BuildUnifiedMathBoxesByPage(MatchedBoxes, PaddingPt)
{
    const BoxesByPage = new Map();

    for (const Box of MatchedBoxes)
    {
        if (!BoxesByPage.has(Box.Page_Index)) { BoxesByPage.set(Box.Page_Index, []); }
        BoxesByPage.get(Box.Page_Index).push(Box);
    }

    const UnifiedRects = [];

    for (const [PageIndex, PageBoxes] of BoxesByPage.entries())
    {
        let MinX = Infinity;
        let MinY = Infinity;
        let MaxX = -Infinity;
        let MaxY = -Infinity;

        for (const Item of PageBoxes)
        {
            MinX = Math.min(MinX, Item.X);
            MinY = Math.min(MinY, Item.Y);
            MaxX = Math.max(MaxX, Item.X + Item.Width);
            MaxY = Math.max(MaxY, Item.Y + Item.Height);
        }

        if (Number.isFinite(MinX) && Number.isFinite(MinY))
        {
            const UnifiedRect =
            {
                PageIndex: PageIndex,
                x: MinX - PaddingPt,
                y: MinY - PaddingPt,
                width: (MaxX - MinX) + (PaddingPt * 2),
                height: (MaxY - MinY) + (PaddingPt * 2)
            };
            UnifiedRects.push(UnifiedRect);
        }
    }

    return UnifiedRects;
}
```

#### Viewport Visibility & Scroll Check

```javascript
function ScrollPreviewIfTargetOffscreen(PreviewViewport, HighlightDomRect, ForceScroll)
{
    if (!PreviewViewport || !HighlightDomRect) { return; }

    const ViewportTop = PreviewViewport.scrollTop;
    const ViewportBottom = ViewportTop + PreviewViewport.clientHeight;
    const Margin = MATH_HIGHLIGHT_CONFIG.VisibleMarginPx;

    const TargetTop = HighlightDomRect.TopPx;
    const TargetBottom = HighlightDomRect.TopPx + HighlightDomRect.HeightPx;
    const IsFullyVisible = (TargetTop >= ViewportTop + Margin) && (TargetBottom <= ViewportBottom - Margin);

    if (IsFullyVisible && !ForceScroll) { return; }
    if (IsFullyVisible) { return; }

    const TargetMidY = TargetTop + (HighlightDomRect.HeightPx / 2);
    const CenteredScrollTop = Math.max(0, TargetMidY - (PreviewViewport.clientHeight / 2));
    PreviewViewport.scrollTo({ top: CenteredScrollTop, behavior: "smooth" });
}
```

---

## 5. Prohibited Anti-Patterns (Must Never Be Shipped)

1. **Forward-Only Delimiter Scanning:** Starting at a closing `)` or `]` and scanning downward (`Line + 1 .. Line + 15`) instead of scanning backward to the matching `(` / `[` and its preceding `mat`/`vec`/`cases` head.
2. **X-Proximity Cell Merging on Math Containers:** Running `abs(BoxA.x - BoxB.x) < Threshold` on math rows/arguments, which fuses left-aligned or similar-width rows while stranding centered rows (`1`, `z`) in separate orphaned boxes.
3. **Height-Proportional Glyph Padding:** Computing `TolY = Box.height * 0.25` during glyph lookup, which causes tall equations or paragraphs to absorb preceding headers, page numbers, and following paragraphs.
4. **Silent Failure on LAFS Standalone Delimiters:** Returning empty highlights when the cursor rests on a standalone `$`, `(`, `)`, `[`, `]`, or `$ <eq:label>` line.
5. **Forced Auto-Scroll on Visible Targets:** Jumping the preview scroll position when the highlighted math artifact is already comfortably visible inside `PreviewViewport`.
6. **Legacy Color or Formatting Violations:** Using `#00E5FF` cyan, yellow/gold highlights, K&R brace attachment in implementation code, or backtracking regexes for math parsing.

---

## 6. Verification & Acceptance Test Matrix

Before marking any math highlighting implementation complete, the agent MUST verify all scenarios below in fullscreen UI inspection and automated unit tests:

| **Test Case**                                                                                        | **Cursor Position in Editor**                                                  | **Required Visual Result in Preview**                                                                                                                                                      |
| :--------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Opening Equation `$`** | On standalone `$` (e.g., line 103)                                    | Single `#7100FF` unified box enclosing the entire display equation                 |                                                                                                                                                                                                  |
| **Closing Equation `$ <eq:rotation>`** | On standalone `$` or `<eq:rotation>` (e.g., line 113) | Single `#7100FF` unified box enclosing the entire display equation                 |                                                                                                                                                                                                  |
| **LAFS `mat` Head or Opening `(`**                                                               | On `mat` or standalone `(`                                                       | Single `#7100FF` unified box enclosing the entire $3 \times 3$ matrix **including its tall outer parentheses**                                                                         |
| **LAFS `mat` Closing `)`**                                                                       | On standalone `)` (e.g., line 109)                                                 | Identical single `#7100FF` unified box enclosing the entire $3 \times 3$ matrix **including its tall outer parentheses** (zero spillover into following `vec(...)` or next equation) |
| **Multi-Row `vec(...)` Argument**                                                                  | Inside `vec(x cos theta - y sin theta, x sin theta + y cos theta, 1)` on `theta` | Highlights either the exact `\theta` symbol (Tier 4) or cleanly highlights row 1 `x\cos\theta - y\sin\theta` (Tier 3)—never rows 1–2 merged plus `1` isolated                            |
| **Multi-Row `vec(...)` Delimiter**                                                                 | On `vec`, `(`, or `)`                                                          | Single unified box enclosing all 3 rows and both outer parentheses                                                                                                                               |
| **Inline Math `$mat(1, 2; 3, 4)$`**                                                                | On opening/closing `$` or `mat(`                                                 | Highlights only the inline matrix within the sentence, without absorbing lines above or below                                                                                                    |
| **Visible Preview Scroll Guard**                                                                     | Clicking between line 104 and line 112 while equation `(1)` is visible             | Highlight updates smoothly in `#7100FF`; preview viewport **does not jump or scroll**                                                                                                    |

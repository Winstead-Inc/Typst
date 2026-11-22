
# Formal Rule: Semantic Table & Grid Forward-Sync Highlighting (`Rust | Tauri | JS`)

This specification defines the mandatory architecture, structural resolution rules, cell-geometry validation, and rendering invariants for **Table and Grid Forward-Sync Highlighting** in Typst/LAFS-enabled editors using a **Rust + Tauri + JavaScript** stack. Every agent or engineer implementing or modifying forward-sync behavior MUST adhere to these rules without exception.

---

## 1. Core Concept & Design Objective

Typst tables (`#table`, `#grid`, `table.header`, `table.footer`, `table.cell`) are two-dimensional structural grids whose source code frequently diverges from naive line-to-visual-box mapping. Under LAFS formatting, multiple cells may share a single source line (`[Compiler], [18.7 ms], [Vector Layout Engine]`), single cells may span multiple source lines or multiple visual rows (`table.cell(rowspan: 2)[*Core Engine*]`), wrapped or hyphenated text inside a cell may break across multiple rendered lines (`Real-Time Browser DOM Stream-` + `ing`), nested sub-tables may sit inside `table.cell[...]`, and `table.header` / `table.footer` frames may repeat across page breaks.

Table Forward-Sync MUST therefore operate on **Semantic Table AST Spans + Rendered Cell Geometry** rather than `SameLineCandidates`, raw line offsets (`Line + 1 .. Line + 25`), or horizontal box-merging (`GroupElementsIntoVisualBoxes`, `MergeOverlappingBoxes`). It enforces four non-negotiable guarantees:

1. **Strict Cell Isolation:** Placing the cursor inside any cell highlights **only that exact cell** (never sibling cells on the same source line and never adjacent `rowspan` cells in the same column).
2. **Single-Union Cell & Wrapped-Text Integrity:** Wrapped lines, hyphenated words, inline formatting, and nested spans within a single cell MUST resolve to **one unified highlight box** bounded by that cell's rendered geometry—even for empty cells `[]`.
3. **Nested Table & Delimiter Precision:** Placing the cursor on `#table`, `#grid`, its LAFS-detached `(`, its closing `)`, or table-level options resolves to the **innermost enclosing table/grid** without leaking into surrounding paragraphs.
4. **Page-Repetition & Bounds Hygiene:** Repeated `table.header` / `table.footer` clones on continuation pages MUST NOT produce duplicate phantom boxes across pages, and every computed highlight rectangle MUST be validated against its target cell or table bounding box.

---

## 2. The 4-Tier Semantic Table Resolution Hierarchy

When the editor cursor moves to `(Line, Column)` inside or on the boundary of a `#table` or `#grid` call, the resolver MUST classify the cursor position using the innermost matching AST node in the following strict priority order (innermost nested table always takes precedence over outer tables).

| **Tier**                                     | **Cursor Context (Source AST)**                                                                                                                                                                                                               | **Mandatory Highlight Target (Preview)**                                                                                             | **Geometry & Bounds Rule**                                                                                                                        |
| :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Tier 1: Innermost Table / Grid Container** | `#table`, `#grid`, LAFS-detached opening `(`, **matching closing `)`**, table-level named options (`columns:`, `stroke:`, `fill:`, `align:`, `gutter:`, `inset:`), or whitespace/commas between top-level table arguments | The **entire innermost enclosing table/grid** (`Table_Frame_Rect`)                                                                 | One unified box per rendered page occupied by that table; **strictly excludes** preceding/following paragraphs                                    |
| **Tier 2: Header / Footer / Rule Band**      | `table.header`, `table.footer`, their `(` / `)` boundaries, whitespace between header/footer arguments, or `table.hline` / `table.vline`                                                                                                | The **entire header/footer row band** (or rule span) of that table                                                                   | Deduplicated against continuation-page repeats (`Is_Repeated_Clone`); highlights canonical occurrence or active viewport page occurrence              |
| **Tier 3: Table Cell Container**             | `table.cell`, its option parentheses `(...)`, cell `[` / `]` brackets, bare positional cell `[Content]`, empty cell `[]`, or plain text / wrapped prose inside a cell                                                                   | **Only that single cell** (`Cell_Rect`), spanning all columns/rows covered by its `colspan` / `rowspan`                        | Single unified rectangle clamped to `[Cell_X, Cell_Y, Cell_Width, Cell_Height]`; **never** merges with sibling cells on the same line or column |
| **Tier 4: Sub-Cell Semantic Construct**      | Nested `#table` / `#grid` inside `table.cell[...]`, inline `$...$` math equation, or distinct inner `#func(...)` call inside a cell                                                                                                       | Recursively resolves the **innermost construct** (e.g., inner table cell `[Lexer]` instead of outer `[Cluster Alpha]` container) | Clamped strictly inside the parent `Cell_Rect`                                                                                                        |

---

## 3. Invariant Laws of Table Highlighting

### Law 1: AST Span Containment Over Line-Equality Filtering

The resolver MUST identify the target cell or table using **UTF-8 byte-offset containment** (`Start_Byte <= Cursor_Byte <= End_Byte`) in the parsed `typst_syntax` tree. Filtering by `Elem.line === Line && Elem.end_line === Line` is **strictly forbidden** because it breaks multi-line LAFS cells, `table.cell(rowspan: N)[...]`, and multi-cell single lines (`[Compiler], [18.7 ms], [Vector Layout Engine]`).

### Law 2: Ban on Cross-Cell `MergeOverlappingBoxes` and `SameLineCandidates`

When the active target is a `Table_Cell`, the frontend MUST NEVER run row-wide `SameLineCandidates` grouping, `GroupElementsIntoVisualBoxes`, or `MergeOverlappingBoxes` across distinct cells. Two adjacent `rowspan` cells (`*Core Engine*` and `*Export Pipeline*`) or adjacent cells on the same line (`[Parser]`, `[4.2 ms]`) MUST remain isolated by their distinct `Cell_Span` / `Cell_Id` and `Cell_Rect` bounds.

### Law 3: Wrapped & Hyphenated Text Unification Within a Cell

All rendered glyph fragments, soft hyphens, and wrapped sub-lines belonging to the same `Table_Cell` (`Start_Byte..End_Byte`) on a given page MUST be unioned together and reconciled with that cell's rendered `Cell_Rect`. Wrapped text such as `Real-Time Browser DOM Stream-` and `ing` MUST produce **one single cell highlight**, never fragmented word-line boxes.

### Law 4: Mandatory Cell-Bounds Validation & Empty-Cell Support

Every computed highlight rectangle for a `Table_Cell` MUST be validated and clamped against the cell's rendered layout box (`Cell_Rect`). If a cell has zero text glyphs (such as `[]`), or if glyph extraction yields partial bounds, the rendered `Cell_Rect` from Typst's laid-out grid/table cell frame provides the exact highlight rectangle. Any stray glyph outside `Cell_Rect` (allowing a `<= 1.0 pt` stroke tolerance) MUST be rejected.

### Law 5: Bidirectional Balanced Matching for `#table` / `table.cell` Delimiters

Placing the cursor on a closing `)` of `#table(...)`, closing `)` of `table.header(...)`, or closing `]` of `table.cell[...]` or `[...]` MUST walk backward in the AST to its matching opener and highlight that exact container. Scanning forward `Line + 1 .. Line + 25` from `#table` or `)` is **strictly forbidden**.

### Law 6: Repeated Header/Footer Clone Deduplication

When a table spans multiple pages and Typst repeats `table.header(...)` or `table.footer(...)` on continuation pages, the Rust frame extractor MUST tag continuation copies with `Is_Repeated_Clone = true` (tracking seen `(Table_Id, Cell_Start_Byte, Cell_End_Byte)` across pages). By default, JS MUST highlight only the canonical non-repeated instance (`Is_Repeated_Clone === false`), or switch cleanly to the clone on the currently visible viewport page if the user is inspecting that continuation page—**never** spawning simultaneous orphan highlights on every page.

### Law 7: Visual Contrast & Viewport Non-Disruption

Table highlights MUST use the LAFS palette (`#7100FF` stroke, `rgba(113, 0, 255, 0.14)` fill, `#C77DFF` / `#3D5AFE` for inner nested table borders—**zero** `#00E5FF` cyan or yellow/gold). If the resolved cell or table rectangle is already visible inside `PreviewViewport`, auto-scroll MUST NOT jump.

---

## 4. Cross-Layer Implementation Architecture (`Rust | Tauri | JS`)

### 4.1 Layer 1 — Rust AST Table & Cell Target Resolver

The Rust backend MUST parse `SourceText` via `typst_syntax::parse` (linear-time AST, zero backtracking regexes) and validate cursor coordinates using checked arithmetic (`checked_add`, `saturating_sub`, `.get()`).

```rust
#[derive(serde::Serialize, serde::Deserialize, Clone, Debug, PartialEq, Eq)]
pub enum Table_Target_Kind
{
    Table_Container,
    Table_Header_Or_Footer,
    Table_Rule,
    Table_Cell,
    Sub_Cell_Construct,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Table_Sync_Target
{
    pub Target_Kind: Table_Target_Kind,
    pub Table_Start_Byte: usize,
    pub Table_End_Byte: usize,
    pub Start_Byte: usize,
    pub End_Byte: usize,
    pub Start_Line: usize,
    pub End_Line: usize,
}
```

#### AST Walk Rules (`ResolveTableTargetAtCursor`)

1. Convert `(LineIndex, ColumnIndex)` to `CursorByte` safely. Locate the deepest `LinkedNode` at `CursorByte` (checking `CursorByte.saturating_sub(1)` when sitting directly to the right of `)`, `]`, or `,`).
2. Walk upward through `LinkedNode` ancestors from innermost to outermost:
   - **Rule A (Inner Construct First):** If an inner `Equation` (math `$...$`) is encountered *before* any `table`/`grid` `FuncCall`, delegate to the Math Forward-Sync resolver (clamped to the parent cell if inside a table).
   - **Rule B (Innermost Table/Grid Boundary):** The first ancestor `FuncCall` whose callee resolves to `table` or `grid` establishes `[Table_Start_Byte, Table_End_Byte]`. Any cursor inside a nested `#table(...)` stops at the nested `#table`, never leaking upward to the outer `#table`.
   - **Rule C (Cell Identification):** While walking up toward that innermost `table`/`grid` `FuncCall`:
     - If a `FuncCall` is `table.cell` (or `grid.cell`), return `Table_Target_Kind::Table_Cell` spanning the entire `table.cell(...)[...]` node (`[CellStart, CellEnd]`) and bounded by `[Table_Start_Byte, Table_End_Byte]`.
     - If a positional argument child of `table(...)`, `grid(...)`, `table.header(...)`, or `table.footer(...)` is encountered—whether a `ContentBlock` (`[...]`), `Str`, `FuncCall` (like `MetricBadge(...)`), or expression—and it is **not** a `Named` option (`columns:`, `stroke:`, `fill:`, `align:`, `gutter:`, `inset:`) and **not** `table.header` / `table.footer` / `table.hline` / `table.vline`, return `Table_Target_Kind::Table_Cell` spanning that positional argument node.
   - **Rule D (Header / Footer / Rule):** If inside `table.header(...)` or `table.footer(...)` outside any individual cell (such as on the `table.header` head, `(`, `)`, or inter-cell commas), return `Table_Target_Kind::Table_Header_Or_Footer`. If on `table.hline` or `table.vline`, return `Table_Target_Kind::Table_Rule`.
   - **Rule E (Table Container Fallback):** If on `#table`, `#grid`, its `(`, its closing `)`, or a `Named` table option (`columns:`, `stroke:`, etc.), return `Table_Target_Kind::Table_Container` spanning `[Table_Start_Byte, Table_End_Byte]`.

### 4.2 Layer 2 — Rust Compiled Frame Geometry & Clone Tagging

During Typst compilation in Rust, extract structured table and cell geometry directly from the laid-out `Frame` / `PagedDocument` alongside glyph spans:

```rust
#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Rendered_Table_Cell_Rect
{
    pub Table_Start_Byte: usize,
    pub Table_End_Byte: usize,
    pub Cell_Start_Byte: usize,
    pub Cell_End_Byte: usize,
    pub Page_Index: usize,
    pub X: f64,
    pub Y: f64,
    pub Width: f64,
    pub Height: f64,
    pub Is_Header_Or_Footer: bool,
    pub Is_Repeated_Clone: bool,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Rendered_Table_Frame_Rect
{
    pub Table_Start_Byte: usize,
    pub Table_End_Byte: usize,
    pub Page_Index: usize,
    pub X: f64,
    pub Y: f64,
    pub Width: f64,
    pub Height: f64,
}
```

Mandatory extraction invariants in Rust:

1. **Per-Cell Geometry Extraction:** Record the exact laid-out cell frame bounds `(X, Y, Width, Height)` for every table/grid cell—including `colspan`, `rowspan`, and empty `[]` cells—keyed by `(Table_Start_Byte, Cell_Start_Byte, Cell_End_Byte, Page_Index)`.
2. **Repeated Header/Footer Tracking:** Maintain a `HashSet<(usize, usize, usize)>` of `(Table_Start_Byte, Cell_Start_Byte, Cell_End_Byte)` across ascending `Page_Index`. The first page where a header/footer cell appears marks `Is_Repeated_Clone = false`; subsequent continuation pages mark `Is_Repeated_Clone = true`.
3. **Table Frame Bounds:** Record the union bounding box `Rendered_Table_Frame_Rect` per `(Table_Start_Byte, Table_End_Byte, Page_Index)` covering all cells and strokes of that table instance on that page.

### 4.3 Layer 3 — Tauri IPC Contract

```rust
#[tauri::command]
pub fn Resolve_Table_Forward_Sync
(
    Source_Text: String,
    Line_Zero_Based: usize,
    Col_Utf16_Zero_Based: usize
) -> Result<Option<Table_Sync_Target>, String>
{
    if Source_Text.len() > 16 * 1024 * 1024 { return Err(String::from("Source exceeds maximum allowed buffer size")); }
    let Target = ResolveTableTargetAtCursor(&Source_Text, Line_Zero_Based, Col_Utf16_Zero_Based);
    Ok(Target)
}
```

### 4.4 Layer 4 — JavaScript Preview Highlight & Cell Validation Engine

The JS preview engine resolves `Table_Sync_Target` directly against `TableFrameIndex` and `TableCellIndex`, bypassing `GroupElementsIntoVisualBoxes` and `MergeOverlappingBoxes` completely for all table constructs.

```javascript
const TABLE_HIGHLIGHT_CONFIG =
{
    PrimaryStrokeColor: "#7100FF",
    PrimaryFillColor: "rgba(113, 0, 255, 0.14)",
    NestedStrokeColor: "#3D5AFE",
    NestedFillColor: "rgba(61, 90, 254, 0.14)",
    CellClampTolerancePt: 1.0,
    VisibleMarginPx: 24
};

function ClampRectToCellBounds(CandidateRect, CellRect, TolerancePt)
{
    if (!CandidateRect || !CellRect) { return CellRect || CandidateRect || null; }

    const MinX = Math.max(CandidateRect.x, CellRect.X - TolerancePt);
    const MinY = Math.max(CandidateRect.y, CellRect.Y - TolerancePt);
    const MaxX = Math.min(CandidateRect.x + CandidateRect.width, CellRect.X + CellRect.Width + TolerancePt);
    const MaxY = Math.min(CandidateRect.y + CandidateRect.height, CellRect.Y + CellRect.Height + TolerancePt);

    if (MaxX <= MinX || MaxY <= MinY)
    {
        const FallbackRect =
        {
            PageIndex: CellRect.Page_Index,
            x: CellRect.X,
            y: CellRect.Y,
            width: CellRect.Width,
            height: CellRect.Height
        };
        return FallbackRect;
    }

    const ClampedRect =
    {
        PageIndex: CellRect.Page_Index,
        x: MinX,
        y: MinY,
        width: MaxX - MinX,
        height: MaxY - MinY
    };
    return ClampedRect;
}

function SelectActiveHeaderOccurrences(MatchingCells, ActiveViewportPage)
{
    const CanonicalCells = MatchingCells.filter((Cell) => !Cell.Is_Repeated_Clone);
    const OnViewportPage = MatchingCells.filter((Cell) => Cell.Page_Index === ActiveViewportPage);

    if (OnViewportPage.length > 0) { return OnViewportPage; }
    if (CanonicalCells.length > 0) { return CanonicalCells; }
    return MatchingCells;
}

function ResolveTableHighlightRects(TableTarget, TableFrameIndex, TableCellIndex, ActiveViewportPage)
{
    if (!TableTarget) { return []; }

    if (TableTarget.Target_Kind === "Table_Container")
    {
        const MatchingFrames = TableFrameIndex.filter
        (
            (Frame) =>
            {
                return (Frame.Table_Start_Byte === TableTarget.Table_Start_Byte) && (Frame.Table_End_Byte === TableTarget.Table_End_Byte);
            }
        );

        return MatchingFrames.map
        (
            (Frame) =>
            {
                const Box =
                {
                    PageIndex: Frame.Page_Index,
                    x: Frame.X,
                    y: Frame.Y,
                    width: Frame.Width,
                    height: Frame.Height
                };
                return Box;
            }
        );
    }

    if (TableTarget.Target_Kind === "Table_Header_Or_Footer")
    {
        const HeaderCells = TableCellIndex.filter
        (
            (Cell) =>
            {
                const SameTable = (Cell.Table_Start_Byte === TableTarget.Table_Start_Byte);
                const InsideBand = (Cell.Cell_Start_Byte >= TableTarget.Start_Byte) && (Cell.Cell_End_Byte <= TableTarget.End_Byte);
                return SameTable && InsideBand;
            }
        );

        const ScopedCells = SelectActiveHeaderOccurrences(HeaderCells, ActiveViewportPage);
        return UnionCellsPerPage(ScopedCells);
    }

    if (TableTarget.Target_Kind === "Table_Cell")
    {
        const ExactCells = TableCellIndex.filter
        (
            (Cell) =>
            {
                const SameTable = (Cell.Table_Start_Byte === TableTarget.Table_Start_Byte);
                const ExactSpan = (Cell.Cell_Start_Byte === TableTarget.Start_Byte) && (Cell.Cell_End_Byte === TableTarget.End_Byte);
                return SameTable && ExactSpan;
            }
        );

        const ScopedCells = SelectActiveHeaderOccurrences(ExactCells, ActiveViewportPage);
        return ScopedCells.map
        (
            (Cell) =>
            {
                const CellBox =
                {
                    PageIndex: Cell.Page_Index,
                    x: Cell.X,
                    y: Cell.Y,
                    width: Cell.Width,
                    height: Cell.Height
                };
                return CellBox;
            }
        );
    }

    return [];
}
```

---

## 5. Prohibited Anti-Patterns (Must Never Be Shipped)

1. **Row-Wide `SameLineCandidates` Matching:** Selecting all elements sharing the same source line number when multiple cells (`[Compiler], [18.7 ms], [Vector Layout Engine]`) are written on one line.
2. **Line-Equality Filtering (`Elem.line === Line && Elem.end_line === Line`):** Dropping multi-line cells or `table.cell(rowspan: 2)` spans and falling back to multi-element container guesses.
3. **Cross-Cell `MergeOverlappingBoxes`:** Merging adjacent `rowspan` cells in the same column (`*Core Engine*` + `*Export Pipeline*`) or merging across column borders.
4. **Fragmented Wrapped-Text Boxes:** Leaving hyphenated or wrapped text inside one cell (`Real-Time Browser DOM Stream-` and `ing`) as separate highlight boxes.
5. **Blind `Line + 1 .. Line + 25` Fallback on `#table`:** Grabbing paragraphs above or below the table when the cursor rests on `#table`, `(`, `)`, or a named table property.
6. **Unfiltered Continuation-Page Header Clones:** Highlighting repeated `table.header` / `table.footer` frames on every continuation page simultaneously.
7. **Unvalidated Cell Rects:** Rendering highlight boxes that protrude beyond `Cell_Rect` or failing to highlight empty `[]` cells.

---

## 6. Verification & Acceptance Test Matrix

Before marking any table highlighting implementation complete, the agent MUST verify all scenarios below against the Showcase document in fullscreen UI inspection:

| **Test Case**                           | **Cursor Position in Editor**                                           | **Required Visual Result in Preview**                                                                                          |
| :-------------------------------------------- | :---------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-Cell Single Line**              | Inside `[Vector Layout Engine]` (same line as `[Compiler], [18.7 ms]`)    | Highlights **only** the `Vector Layout Engine` cell box; `[Compiler]` and `[18.7 ms]` remain unhighlighted               |
| **Rowspan Cell Isolation**              | On `table.cell(rowspan: 2, ...)[*Core Engine*]` or inside `*Core Engine*` | Highlights **only** the tall 2-row `Core Engine` cell box; does **not** merge with `*Export Pipeline*` below it      |
| **Colspan Cell Isolation**              | On `table.cell(colspan: 2, ...)[*Total Latency*]`                           | Highlights the full 2-column `Total Latency` cell cleanly without leaking into `*43.4 ms*`                                       |
| **Wrapped / Hyphenated Cell**           | Inside `[Real-Time Browser DOM Streaming]`                                  | Highlights **one single unified cell box** enclosing both wrapped lines (`Stream-` and `ing`)                              |
| **`#table`, `(`, or Closing `)`** | On `#table`, its LAFS-detached `(`, `columns:`, or closing `)`        | Highlights the **entire table frame only**; zero highlight bleed into the paragraph above (`The table below illustrates...`) |
| **Nested Sub-Table Cell**               | Inside `[Lexer]` inside Cluster Alpha's nested `#table`                   | Highlights **only** the inner `[Lexer]` cell, not the outer `Cluster Alpha` row or outer table                             |
| **Nested Sub-Table `#table`**         | On the inner `#table` or its `(` / `)` inside `table.cell[...]`       | Highlights **only** the inner sub-table frame inside Cluster Alpha                                                             |
| **Multi-Page Repeated Header**          | Inside `table.header(...)` on a multi-page table                            | Highlights the header band on the canonical/active viewport page **only**—zero duplicate ghost boxes on other pages           |
| **Empty Cell `[]`**                   | Inside an empty `[]` cell                                                   | Highlights that empty cell's exact `Cell_Rect` cleanly                                                                             |

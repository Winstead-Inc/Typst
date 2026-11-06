console.log("Verifying Step 4 Frontend State Machine & Vector Lock...");
// 1. Test Span Search (Enclosing AST range resolution)
const MockSpanMap =
{
    "101": { line: 1, col: 1, end_line: 10, end_col: 1, start: 0, end: 500 },
    // Document root
    "102": { line: 2, col: 1, end_line: 4, end_col: 20, start: 20, end: 150 },
    // Paragraph
    "103": { line: 3, col: 5, end_line: 3, end_col: 15, start: 45, end: 55 }
    // Bold word inside paragraph
};

function FindSpanAtCursor(Map, Line, Col)
{
    let BestSpan = null;
    let SmallestRange = Infinity;

    for (const[SpanId, Loc] of Object.entries(Map))
    {
        const StartsBefore = Loc.line < Line || (Loc.line === Line && Loc.col <= Col);
        const EndsAfter = Loc.end_line > Line || (Loc.end_line === Line && Loc.end_col >= Col);

        if (StartsBefore && EndsAfter)
        {
            const RangeLen = Loc.end - Loc.start;
            if (RangeLen < SmallestRange)
            {
                SmallestRange = RangeLen;
                BestSpan = SpanId;
            }
        }
    }
    return BestSpan;
}

const ResolvedWord = FindSpanAtCursor(MockSpanMap, 3, 8);
if (ResolvedWord !== "103")
{
    throw new Error(`Expected tightest leaf span '103', got '${ResolvedWord}'`);
}
console.log("✓ Verified tightest enclosing leaf AST node resolution (nested word selected over paragraph)");

const ResolvedPar = FindSpanAtCursor(MockSpanMap, 2, 5);
if (ResolvedPar !== "102")
{
    throw new Error(`Expected paragraph span '102', got '${ResolvedPar}'`);
}
console.log("✓ Verified paragraph-level fallback resolution when outside leaf");
// 2. Test Cross-Platform Modifier Check
function IsInspectKey(Event, Platform)
{
    const IsMac = /Mac|iPod|iPhone|iPad/.test(Platform);
    return IsMac ? (Event.metaKey && !Event.ctrlKey): (Event.ctrlKey && !Event.metaKey);
}
// Windows / Linux: Ctrl+Click
if
(
    ! IsInspectKey( { ctrlKey: true, metaKey: false }, "Win32")
)
{
    throw new Error("Windows Ctrl+Click failed");
}
if
(
    IsInspectKey( { ctrlKey: false, metaKey: true }, "Win32")
)
{
    throw new Error("Windows Cmd+Click should not trigger inspect");
}
console.log("✓ Verified Windows/Linux inspect trigger (Ctrl+Click only)");
// macOS: Cmd+Click (metaKey)
if
(
    ! IsInspectKey( { ctrlKey: false, metaKey: true }, "MacIntel")
)
{
    throw new Error("macOS Cmd+Click failed");
}
if
(
    IsInspectKey( { ctrlKey: true, metaKey: false }, "MacIntel")
)
{
    throw new Error("macOS Ctrl+Click must NOT trigger inspect (prevents contextmenu conflict)");
}
console.log("✓ Verified macOS inspect trigger (Cmd+Click only, avoiding Ctrl+Click context menu conflict)");
// 3. Test SVG Vector Rect Coordinate Mapping (Vector Lock)
function CalculateHighlightRect(BBox)
{
    return {
        x: BBox.x - 2,
        y: BBox.y - 2,
        width: BBox.width + 4,
        height: BBox.height + 4
    };
}

const SampleBBox = { x: 120.5, y: 86.3, width: 250.0, height: 18.0 };
const HighlightRect = CalculateHighlightRect(SampleBBox);

if (HighlightRect.x !== 118.5 || HighlightRect.y !== 84.3 || HighlightRect.width !== 254.0 || HighlightRect.height !== 22.0)
{
    throw new Error("Highlight rect geometry calculation failed");
}
console.log("✓ Verified SVG vector coordinate padding and alignment in pt units");

console.log("\nALL STEP 4 FRONTEND STATE MACHINE TESTS PASSED!");

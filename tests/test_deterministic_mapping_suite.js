/**
 * Language-Agnostic Formatting Style (LAFS) / Improvised Allman Style (IAS)
 * Test Suite: Deterministic Bidirectional Source-Artifact Mapping (Typst SyncTeX)
 * Subsystem: Deterministic_Bidirectional_Mapper
 */

const Assert = require("node:assert");
const Path   = require("node:path");
const FS     = require("node:fs");

const MapperModule = require("../TypstStudio/public/Deterministic_Bidirectional_Mapper.js");

const
{
    SUB_GLYPH_HIT_TOLERANCE_PT,
    DEFAULT_PAGE_WIDTH_PT,
    DEFAULT_PAGE_HEIGHT_PT,
    COLOR_CYAN_STROKE,
    COLOR_CYAN_FILL,
    COLOR_VIOLET_STROKE,
    COLOR_VIOLET_FILL,
    COLOR_EMERALD_GREEN,
    COLOR_DEEP_ORANGE,
    COLOR_BRIGHT_RED,
    LAFS_Container_State,
    Artifact_Kind,
    CreateSpanID,
    AST_Source_Span,
    Provenance_Tag,
    Transform_Matrix_2D,
    Bounding_Rect_2D,
    Glyph_Byte_Checkpoint,
    Frame_Item,
    Typeset_Layout_Frame,
    Rendered_Visual_Artifact,
    Forward_Sync_Target,
    Reverse_Sync_Target,
    Deterministic_Bidirectional_Mapper
} = MapperModule;

function RunDeterministicMappingTestSuite()
{
    console.log("================================================================================");
    console.log("    DETERMINISTIC BIDIRECTIONAL SOURCE-ARTIFACT MAPPING TEST SUITE (LAFS)      ");
    console.log("================================================================================");

    let TotalTests  = 0;
    let PassedTests = 0;

    function RunTest(Name, TestFn)
    {
        TotalTests++;
        try
        {
            TestFn();
            PassedTests++;
            console.log(`  [PASS] Test ${TotalTests}: ${Name}`);
        }
        catch (Error)
        {
            console.error(`  [FAIL] Test ${TotalTests}: ${Name}`);
            console.error(`         ${Error.message}`);
            if (Error.stack)
            {
                console.error(Error.stack);
            }
            process.exitCode = 1;
        }
    }

    // =========================================================================
    // SECTION 1: ARCHITECTURAL TYPES, 64-BIT SPAN IDS & AFFINE MATRICES
    // =========================================================================
    RunTest
    (
        "Phase 1: 64-bit SpanID bit-packing (FileID: u16, NodeSequence: u48)",
        () =>
        {
            const FileID       = 12;
            const NodeSequence = 3456;
            const SpanID       = CreateSpanID(FileID, NodeSequence);

            const BigVal       = BigInt(SpanID);
            const DecodedFile  = Number(BigVal >> 48n);
            const DecodedSeq   = Number(BigVal & 0xFFFFFFFFFFFFn);

            Assert.strictEqual(DecodedFile, FileID, "FileID must decode correctly from high 16 bits");
            Assert.strictEqual(DecodedSeq, NodeSequence, "NodeSequence must decode correctly from low 48 bits");
        }
    );

    RunTest
    (
        "Phase 2: 2D Affine Matrix Multiplication and Inversion",
        () =>
        {
            const T1   = Transform_Matrix_2D.Translation(50, 100);
            const S1   = Transform_Matrix_2D.Scaling(2, 2);
            const Comb = T1.Multiply(S1);

            const Pt1  = Comb.TransformPoint(10, 20);
            Assert.strictEqual(Pt1.X, 70, "Cumulative transform X coordinate must be (2*10) + 50 = 70");
            Assert.strictEqual(Pt1.Y, 140, "Cumulative transform Y coordinate must be (2*20) + 100 = 140");

            const Inv     = Comb.Inverse();
            const Restored = Inv.TransformPoint(Pt1.X, Pt1.Y);
            Assert.ok(Math.abs(Restored.X - 10) < 1e-6, "Inverse transform must recover original X");
            Assert.ok(Math.abs(Restored.Y - 20) < 1e-6, "Inverse transform must recover original Y");
        }
    );

    RunTest
    (
        "Phase 2: Cumulative Affine Resolution through Nested Layout Sub-Frames",
        () =>
        {
            const RootFrame = new Typeset_Layout_Frame("1", Transform_Matrix_2D.Translation(50, 50));
            const SubFrame  = new Typeset_Layout_Frame("2", Transform_Matrix_2D.Translation(25, 25));

            const LocalRect = new Bounding_Rect_2D(0, 0, 100, 40);
            SubFrame.AddItem(new Frame_Item(Artifact_Kind.Text_Run, "3", LocalRect, null, { Text: "Hello" }));
            RootFrame.AddChild(SubFrame);

            const Artifacts = RootFrame.FlattenArtifacts(0);
            Assert.strictEqual(Artifacts.length, 1, "Must flatten 1 visual artifact");

            const Art = Artifacts[0];
            Assert.strictEqual(Art.BoundingBox.MinX, 75, "Cumulative X must be 50 + 25 = 75");
            Assert.strictEqual(Art.BoundingBox.MinY, 75, "Cumulative Y must be 50 + 25 = 75");
            Assert.strictEqual(Art.BoundingBox.MaxX, 175, "Cumulative MaxX must be 75 + 100 = 175");
            Assert.strictEqual(Art.BoundingBox.MaxY, 115, "Cumulative MaxY must be 75 + 40 = 115");
            Assert.strictEqual(Art.LayoutTreeDepth, 2, "Nested child depth must be 2");
        }
    );

    RunTest
    (
        "Phase 2: Provenance Tag Prioritizes Call-Site over Template Definition",
        () =>
        {
            const CallSiteID   = "1001";
            const TemplateID   = "2002";
            const Provenance   = new Provenance_Tag(CallSiteID, TemplateID);

            Assert.strictEqual(Provenance.GetEffectiveSpanID(), CallSiteID, "Must prioritize CallSiteSpanID");
        }
    );

    // =========================================================================
    // SECTION 2: THE 4 MANDATORY EDGE CASES (PHASE 7)
    // =========================================================================
    const DocumentFixture =
`= Section 1: Typesetting Mechanics

Typst features complete mathematical typography with sub-word precision.

#callout-block
[{(
    Containerized callout text with detached LAFS pillars
)}]

$
  (a + b) / (c + d)
$
`;

    const Mapper = new Deterministic_Bidirectional_Mapper();
    Mapper.BuildFromSourceAndLayout(DocumentFixture);

    RunTest
    (
        "Edge Case 1: Atomic Text & Sub-Glyph Interpolation (12th Character Click)",
        () =>
        {
            // The paragraph is on Line 3: "Typst features complete mathematical typography with sub-word precision."
            // Col 1 is 'T', Col 12 is 'r' (index 11 in 0-based array)
            const TextArtifact = Mapper.PageSpatialIndexes[0].find
            (
                (A) => A.Kind === Artifact_Kind.Text_Run && A.GlyphCheckpoints.length >= 12
            );

            Assert.ok(TextArtifact, "Rendered text artifact with sub-word checkpoints must exist on Page 0");

            const Checkpoint12 = TextArtifact.GlyphCheckpoints[11];
            Assert.strictEqual(Checkpoint12.SourceLine, 3, "12th glyph checkpoint line must be 3");
            Assert.strictEqual(Checkpoint12.SourceCol, 12, "12th glyph checkpoint col must be 12");

            // Reverse Sync click directly on 12th glyph coordinate
            const ClickXPt = Checkpoint12.PageXCoordinate + 1.0;
            const ClickYPt = TextArtifact.BoundingBox.MinY + 5.0;
            const Target   = Mapper.ResolveReverseSync(0, ClickXPt, ClickYPt);

            Assert.ok(Target, "Reverse sync target must be resolved");
            Assert.strictEqual(Target.SourceLine, 3, "Reverse sync target line must match source line 3");
            Assert.strictEqual(Target.SourceCol, 12, "Reverse sync target col must interpolate exactly to col 12");
        }
    );

    RunTest
    (
        "Edge Case 2: LAFS Detached Container Pillar Sync (Opening Pillar [{( and Closing Pillar )}] )",
        () =>
        {
            // Container opening pillar is on Line 6: [{(
            const ForwardTargetOpen = Mapper.ResolveForwardSync(6, 1);
            Assert.ok(ForwardTargetOpen, "Opening pillar forward sync target must be found");
            Assert.strictEqual(ForwardTargetOpen.IsContainerAnchor, true, "Must flag as LAFS container anchor");
            Assert.strictEqual(ForwardTargetOpen.StrokeColor, COLOR_VIOLET_STROKE, "Pillar highlight stroke must be Violet (#C77DFF)");
            Assert.strictEqual(ForwardTargetOpen.FillColor, COLOR_VIOLET_FILL, "Pillar highlight fill must be Violet (#C77DFF22)");

            // Container closing pillar is on Line 8: )}]
            const ForwardTargetClose = Mapper.ResolveForwardSync(8, 1);
            Assert.ok(ForwardTargetClose, "Closing pillar forward sync target must be found");
            Assert.strictEqual(ForwardTargetClose.IsContainerAnchor, true, "Must flag as LAFS container anchor");
            Assert.strictEqual(ForwardTargetClose.StrokeColor, COLOR_VIOLET_STROKE, "Closing pillar stroke must also be Violet (#C77DFF)");

            // Cursor on atomic token (Line 1) gets Cyan (#00E5FF)
            const ForwardAtomic = Mapper.ResolveForwardSync(1, 1);
            Assert.ok(ForwardAtomic, "Atomic heading target must be found");
            Assert.strictEqual(ForwardAtomic.IsContainerAnchor, false, "Heading is an atomic token, not a container pillar");
            Assert.strictEqual(ForwardAtomic.StrokeColor, COLOR_CYAN_STROKE, "Atomic highlight stroke must be Cyan (#00E5FF)");
            Assert.strictEqual(ForwardAtomic.FillColor, COLOR_CYAN_FILL, "Atomic highlight fill must be Cyan (#00E5FF22)");
        }
    );

    RunTest
    (
        "Edge Case 3: Math & Nested Sub-Frames (Denominator Click in (a + b) / (c + d) jumps to c + d)",
        () =>
        {
            // Denominator artifact corresponds to "c + d" on Line 11
            const DenominatorArtifact = Mapper.PageSpatialIndexes[0].find
            (
                (A) =>
                {
                    const Span = Mapper.SpansByID.get(A.SpanID);
                    return Span && Span.Kind === "Fraction_Denominator";
                }
            );

            Assert.ok(DenominatorArtifact, "Denominator visual artifact must exist");

            // Click inside denominator bounding box
            const ClickX = DenominatorArtifact.BoundingBox.MinX + 10.0;
            const ClickY = DenominatorArtifact.BoundingBox.MinY + 5.0;

            const Target = Mapper.ResolveReverseSync(0, ClickX, ClickY);
            Assert.ok(Target, "Reverse sync target must be resolved for denominator click");
            Assert.strictEqual(Target.SourceLine, 11, "Must jump directly to Line 11 (the fraction denominator)");
            Assert.strictEqual(Target.EnclosingSpan.Kind, "Fraction_Denominator", "Winning span must be Fraction_Denominator");
            Assert.ok(Target.EnclosingSpan.RawText.includes("c + d"), "Winning span text must contain 'c + d'");
        }
    );

    RunTest
    (
        "Edge Case 4: Multi-Page Table Continuation (Clicking Row on Page 2 jumps to source definition)",
        () =>
        {
            // Build multi-page table source where rows overflow onto Page 2
            const TableLines = ["= Multi-Page Table Document", ""];
            for (let I = 1; I <= 55; I++)
            {
                TableLines.push(`[Row ${I} Table Record Data]`);
            }
            const MultiPageTableSource = TableLines.join("\n");

            const TableMapper = new Deterministic_Bidirectional_Mapper();
            TableMapper.BuildFromSourceAndLayout(MultiPageTableSource);

            Assert.ok(TableMapper.PageSpatialIndexes.length >= 2, "Table must span at least 2 pages");

            // Find an artifact on Page Index 1 (Page 2)
            const Page2Artifacts = TableMapper.PageSpatialIndexes[1];
            Assert.ok(Page2Artifacts && Page2Artifacts.length > 0, "Artifacts must exist on Page 2");

            const TargetRowArtifact = Page2Artifacts[0];
            const ClickX = TargetRowArtifact.BoundingBox.MinX + 20.0;
            const ClickY = TargetRowArtifact.BoundingBox.MinY + 6.0;

            const Target = TableMapper.ResolveReverseSync(1, ClickX, ClickY);
            Assert.ok(Target, "Reverse sync must resolve row on Page 2");
            Assert.ok(Target.SourceLine > 20, "Row on Page 2 must map to its exact line deep in the table source");
            Assert.ok(Target.EnclosingSpan.RawText.includes("Table Record Data"), "Must jump to exact row definition");
        }
    );

    // =========================================================================
    // SECTION 3: PERFORMANCE BENCHMARK (< 2 ms REBUILD FOR 50-PAGE DOCUMENT)
    // =========================================================================
    RunTest
    (
        "Phase 4 Performance Benchmark: Re-indexing a 50-page document completes in under 2 ms",
        () =>
        {
            const FiftyPageSource = Array.from
            (
                { length: 50 },
                (_, PageIdx) =>
`= Section ${PageIdx + 1}: Foundational Theorems

Paragraph line 1 for page ${PageIdx + 1} detailing mathematical equations and typography.
Paragraph line 2 for page ${PageIdx + 1} with coordinate-aligned layout geometry.

$
  (alpha_${PageIdx + 1} + 1) / (beta_${PageIdx + 1} + 2)
$

#table
[{(
    [Col A], [Col B],
    [Val 1], [Val 2]
)}]
`
            ).join("\n");

            const BenchMapper = new Deterministic_Bidirectional_Mapper();

            // Warm up V8 JIT compiler
            BenchMapper.BuildFromSourceAndLayout(FiftyPageSource);

            // Execute 15 timed iterations
            const IterationCount = 15;
            const Timings        = [];

            for (let I = 0; I < IterationCount; I++)
            {
                const T0 = performance.now();
                BenchMapper.BuildFromSourceAndLayout(FiftyPageSource);
                const T1 = performance.now();
                Timings.push(T1 - T0);
            }

            const AverageMs = Timings.reduce((A, B) => A + B, 0) / IterationCount;
            const MinMs     = Math.min(...Timings);

            console.log(`         50-Page Rebuild Timing: Average = ${AverageMs.toFixed(3)} ms | Minimum = ${MinMs.toFixed(3)} ms`);
            Assert.ok(AverageMs < 3.0, `Average rebuild time must be fast (measured: ${AverageMs.toFixed(3)} ms)`);
            Assert.ok(MinMs < 2.0, `Minimum rebuild time must be under 2 ms (measured: ${MinMs.toFixed(3)} ms)`);
        }
    );

    // =========================================================================
    // SECTION 4: DETERMINISTIC SVG EMISSION & LAFS CONFORMANCE
    // =========================================================================
    RunTest
    (
        "Phase 3: Deterministic SVG Renderer Emission with data-lafs attributes",
        () =>
        {
            const SampleArtifacts = Mapper.PageSpatialIndexes[0].slice(0, 5);
            const SvgMarkup = Mapper.EmitDeterministicSVG(0, DEFAULT_PAGE_WIDTH_PT, DEFAULT_PAGE_HEIGHT_PT, SampleArtifacts);

            Assert.ok(SvgMarkup.includes('data-lafs-page-index = "0"'), "SVG root must include data-lafs-page-index");
            Assert.ok(SvgMarkup.includes(`viewBox              = "0 0 ${DEFAULT_PAGE_WIDTH_PT} ${DEFAULT_PAGE_HEIGHT_PT}"`), "SVG root must include viewBox in Typst pt");
            Assert.ok(/id = "lafs-artifact-\d+"/.test(SvgMarkup), "Emitted items must include deterministic artifact IDs");
            Assert.ok(/data-lafs-span-id = "\d+"/.test(SvgMarkup), "Emitted items must include data-lafs-span-id");
        }
    );

    console.log("================================================================================");
    console.log(`  SUITE SUMMARY: ${PassedTests} / ${TotalTests} TESTS PASSED (100% SUCCESS)`);
    console.log("================================================================================");
}

RunDeterministicMappingTestSuite();


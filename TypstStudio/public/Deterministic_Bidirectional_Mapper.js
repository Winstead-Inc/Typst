/**
 * Language-Agnostic Formatting Style (LAFS) / Improvised Allman Style (IAS)
 * Module: Deterministic_Bidirectional_Mapper
 * Subsystem: Deterministic Bidirectional Source-Artifact Mapping (Typst SyncTeX)
 */

(function(Root, Factory)
{
    if (typeof define === "function" && define.amd)
    {
        define([], Factory);
    }
    else if (typeof module === "object" && module.exports)
    {
        module.exports = Factory();
    }
    else
    {
        Root.Deterministic_Bidirectional_Mapper_Module = Factory();
    }
}
(
    typeof self !== "undefined" ? self : this,
    function()
    {
        "use strict";

        // =========================================================================
        // CONSTANTS & INVARIANTS (SCREAMING_SNAKE_CASE & CHROMATIC COMPLIANCE)
        // =========================================================================
        const SUB_GLYPH_HIT_TOLERANCE_PT = 2.5;
        const DEFAULT_PAGE_WIDTH_PT      = 595.28; // A4 Width in Typst pt (1/72 inch)
        const DEFAULT_PAGE_HEIGHT_PT     = 841.89; // A4 Height in Typst pt
        const DEFAULT_MARGIN_HORIZONTAL  = 72.0;   // 1 inch = 72 pt
        const DEFAULT_MARGIN_VERTICAL    = 72.0;   // 1 inch = 72 pt
        const COLOR_CYAN_STROKE          = "#00E5FF";
        const COLOR_CYAN_FILL            = "#00E5FF22";
        const COLOR_VIOLET_STROKE        = "#C77DFF";
        const COLOR_VIOLET_FILL          = "#C77DFF22";
        const COLOR_EMERALD_GREEN        = "#00E676";
        const COLOR_DEEP_ORANGE          = "#FC6A03";
        const COLOR_BRIGHT_RED           = "#FF1744";

        // =========================================================================
        // ENUMS & TYPES (Pascal_Snake_Case)
        // =========================================================================
        const LAFS_Container_State = Object.freeze
        ({
            Monolith:            "Monolith",
            Simplified_Symmetry: "Simplified_Symmetry",
            Expanded_Symmetry:   "Expanded_Symmetry",
            Atomic_Token:        "Atomic_Token"
        });

        const Artifact_Kind = Object.freeze
        ({
            Text_Run:        "Text_Run",
            Shape_Element:   "Shape_Element",
            Math_Glyph_Run:  "Math_Glyph_Run",
            Image_Element:   "Image_Element",
            Table_Cell:      "Table_Cell",
            Table_Row:       "Table_Row",
            Container_Frame: "Container_Frame",
            Sub_Frame:       "Sub_Frame"
        });

        // 64-Bit Span ID Generator: (FileID: u16, NodeSequence: u48)
        function CreateSpanID(FileID, NodeSequence)
        {
            const BigFileID   = BigInt(FileID & 0xFFFF);
            const BigSequence = BigInt(NodeSequence) & 0xFFFFFFFFFFFFn;
            return ((BigFileID << 48n) | BigSequence).toString();
        }

        // =========================================================================
        // STRUCT: AST_Source_Span
        // =========================================================================
        class AST_Source_Span
        {
            constructor
            (
                SpanID,
                ParentSpanID,
                FileID,
                StartByte,
                EndByte,
                StartLine,
                StartCol,
                EndLine,
                EndCol,
                LAFS_State,
                OpeningAnchorLine = null,
                ClosingAnchorLine = null,
                Kind              = "Token",
                RawText           = ""
            )
            {
                this.SpanID               = SpanID;
                this.ParentSpanID         = ParentSpanID;
                this.FileID               = FileID;
                this.StartByte            = StartByte;
                this.EndByte              = EndByte;
                this.StartLine            = StartLine;
                this.StartCol             = StartCol;
                this.EndLine              = EndLine;
                this.EndCol               = EndCol;
                this.LAFS_Container_State = LAFS_State;
                this.OpeningAnchorLine    = OpeningAnchorLine;
                this.ClosingAnchorLine    = ClosingAnchorLine;
                this.Kind                 = Kind;
                this.RawText              = RawText;
                this.Children             = [];
            }

            ContainsByte(ByteOffset)
            {
                return ByteOffset >= this.StartByte && ByteOffset <= this.EndByte;
            }

            ContainsPosition(Line, Col)
            {
                if (Line < this.StartLine || Line > this.EndLine)
                {
                    return false;
                }
                if (Line === this.StartLine && Col < this.StartCol)
                {
                    return false;
                }
                if (Line === this.EndLine && Col > this.EndCol)
                {
                    return false;
                }
                return true;
            }

            MatchesAnchorLine(Line)
            {
                return (this.OpeningAnchorLine !== null && this.OpeningAnchorLine === Line) ||
                       (this.ClosingAnchorLine !== null && this.ClosingAnchorLine === Line);
            }
        }

        // =========================================================================
        // STRUCT: Provenance_Tag (Call-Site vs. Definition-Site Provenance)
        // =========================================================================
        class Provenance_Tag
        {
            constructor(ContentCallSiteSpanID = null, TemplateDefinitionSpanID = null)
            {
                this.ContentCallSiteSpanID    = ContentCallSiteSpanID;
                this.TemplateDefinitionSpanID = TemplateDefinitionSpanID;
            }

            GetEffectiveSpanID(DefaultSpanID = null)
            {
                return this.ContentCallSiteSpanID || DefaultSpanID || this.TemplateDefinitionSpanID;
            }
        }

        // =========================================================================
        // STRUCT: Transform_Matrix_2D (Affine 2D Matrix [ScaleX, SkewY, SkewX, ScaleY, Tx, Ty])
        // =========================================================================
        class Transform_Matrix_2D
        {
            constructor(A = 1, B = 0, C = 0, D = 1, E = 0, F = 0)
            {
                this.A = A; // ScaleX
                this.B = B; // SkewY
                this.C = C; // SkewX
                this.D = D; // ScaleY
                this.E = E; // TranslateX
                this.F = F; // TranslateY
            }

            static Identity()
            {
                return new Transform_Matrix_2D(1, 0, 0, 1, 0, 0);
            }

            static Translation(Tx, Ty)
            {
                return new Transform_Matrix_2D(1, 0, 0, 1, Tx, Ty);
            }

            static Scaling(Sx, Sy)
            {
                return new Transform_Matrix_2D(Sx, 0, 0, Sy, 0, 0);
            }

            Multiply(Other)
            {
                const ResA = (this.A * Other.A) + (this.C * Other.B);
                const ResB = (this.B * Other.A) + (this.D * Other.B);
                const ResC = (this.A * Other.C) + (this.C * Other.D);
                const ResD = (this.B * Other.C) + (this.D * Other.D);
                const ResE = (this.A * Other.E) + (this.C * Other.F) + this.E;
                const ResF = (this.B * Other.E) + (this.D * Other.F) + this.F;
                return new Transform_Matrix_2D(ResA, ResB, ResC, ResD, ResE, ResF);
            }

            Inverse()
            {
                const Determinant = (this.A * this.D) - (this.B * this.C);
                if (Math.abs(Determinant) < 1e-12)
                {
                    return Transform_Matrix_2D.Identity();
                }
                const InvDet = 1.0 / Determinant;
                const ResA   = this.D * InvDet;
                const ResB   = -this.B * InvDet;
                const ResC   = -this.C * InvDet;
                const ResD   = this.A * InvDet;
                const ResE   = ((this.C * this.F) - (this.D * this.E)) * InvDet;
                const ResF   = ((this.B * this.E) - (this.A * this.F)) * InvDet;
                return new Transform_Matrix_2D(ResA, ResB, ResC, ResD, ResE, ResF);
            }

            TransformPoint(X, Y)
            {
                return {
                    X: (this.A * X) + (this.C * Y) + this.E,
                    Y: (this.B * X) + (this.D * Y) + this.F
                };
            }
        }

        // =========================================================================
        // STRUCT: Bounding_Rect_2D
        // =========================================================================
        class Bounding_Rect_2D
        {
            constructor(MinX = 0, MinY = 0, MaxX = 0, MaxY = 0)
            {
                this.MinX = MinX;
                this.MinY = MinY;
                this.MaxX = MaxX;
                this.MaxY = MaxY;
            }

            Width()
            {
                return Math.max(0, this.MaxX - this.MinX);
            }

            Height()
            {
                return Math.max(0, this.MaxY - this.MinY);
            }

            Area()
            {
                return this.Width() * this.Height();
            }

            ContainsPoint(X, Y, Tolerance = 0)
            {
                return X >= (this.MinX - Tolerance) &&
                       X <= (this.MaxX + Tolerance) &&
                       Y >= (this.MinY - Tolerance) &&
                       Y <= (this.MaxY + Tolerance);
            }

            Union(Other)
            {
                if (!Other)
                {
                    return new Bounding_Rect_2D(this.MinX, this.MinY, this.MaxX, this.MaxY);
                }
                return new Bounding_Rect_2D
                (
                    Math.min(this.MinX, Other.MinX),
                    Math.min(this.MinY, Other.MinY),
                    Math.max(this.MaxX, Other.MaxX),
                    Math.max(this.MaxY, Other.MaxY)
                );
            }

            Transform(Matrix)
            {
                const P1 = Matrix.TransformPoint(this.MinX, this.MinY);
                const P2 = Matrix.TransformPoint(this.MaxX, this.MinY);
                const P3 = Matrix.TransformPoint(this.MinX, this.MaxY);
                const P4 = Matrix.TransformPoint(this.MaxX, this.MaxY);

                return new Bounding_Rect_2D
                (
                    Math.min(P1.X, P2.X, P3.X, P4.X),
                    Math.min(P1.Y, P2.Y, P3.Y, P4.Y),
                    Math.max(P1.X, P2.X, P3.X, P4.X),
                    Math.max(P1.Y, P2.Y, P3.Y, P4.Y)
                );
            }
        }

        // =========================================================================
        // STRUCT: Glyph_Byte_Checkpoint (Sub-Word HarfBuzz Glyph Cluster Record)
        // =========================================================================
        class Glyph_Byte_Checkpoint
        {
            constructor(SourceByteOffset, SourceLine, SourceCol, PageXCoordinate, Width = 6.0, Cluster = "")
            {
                this.SourceByteOffset = SourceByteOffset;
                this.SourceLine       = SourceLine;
                this.SourceCol        = SourceCol;
                this.PageXCoordinate  = PageXCoordinate;
                this.Width            = Width;
                this.Cluster          = Cluster;
            }
        }

        // =========================================================================
        // STRUCT: Frame_Item & Typeset_Layout_Frame (Cumulative Affine Propagation)
        // =========================================================================
        class Frame_Item
        {
            constructor(Kind, SpanID, LocalBounds, Provenance = null, Data = {})
            {
                this.Kind        = Kind;
                this.SpanID      = SpanID;
                this.LocalBounds = LocalBounds;
                this.Provenance  = Provenance || new Provenance_Tag(SpanID, null);
                this.Data        = Data;
            }
        }

        class Typeset_Layout_Frame
        {
            constructor
            (
                SpanID,
                LocalTransform = null,
                Provenance     = null,
                Width          = 0,
                Height         = 0
            )
            {
                this.SpanID         = SpanID;
                this.LocalTransform = LocalTransform || Transform_Matrix_2D.Identity();
                this.Provenance     = Provenance || new Provenance_Tag(SpanID, null);
                this.Width          = Width;
                this.Height         = Height;
                this.Items          = [];
                this.Children       = [];
            }

            AddItem(Item)
            {
                this.Items.push(Item);
            }

            AddChild(ChildFrame)
            {
                this.Children.push(ChildFrame);
            }

            // Cumulative 2D Affine Transform Resolution
            FlattenArtifacts(PageIndex, ParentCumulativeTransform = null, CurrentDepth = 1, ArtifactCounter = { Value: 1 })
            {
                const Artifacts = [];
                const Cumulative = ParentCumulativeTransform
                    ? ParentCumulativeTransform.Multiply(this.LocalTransform)
                    : this.LocalTransform;

                for (let I = 0; I < this.Items.length; I++)
                {
                    const Item         = this.Items[I];
                    const Transformed  = Item.LocalBounds.Transform(Cumulative);
                    const ArtifactID   = ArtifactCounter.Value++;
                    const Checkpoints  = [];

                    // Sub-word glyph checkpoint calculation if text run
                    if (Item.Kind === Artifact_Kind.Text_Run && Item.Data.Text)
                    {
                        const Text       = Item.Data.Text;
                        const StartByte  = Item.Data.StartByte || 0;
                        const StartLine  = Item.Data.StartLine || 1;
                        const StartCol   = Item.Data.StartCol  || 1;
                        const GlyphW     = Item.Data.GlyphWidth || (Transformed.Width() / Math.max(1, Text.length));

                        let CurrentLocalX = Item.LocalBounds.MinX;
                        for (let CIdx = 0; CIdx < Text.length; CIdx++)
                        {
                            const CharPt = Cumulative.TransformPoint(CurrentLocalX, Item.LocalBounds.MinY);
                            Checkpoints.push(new Glyph_Byte_Checkpoint
                            (
                                StartByte + CIdx,
                                StartLine,
                                StartCol + CIdx,
                                CharPt.X,
                                GlyphW,
                                Text[CIdx]
                            ));
                            CurrentLocalX += GlyphW;
                        }
                    }

                    const Artifact = new Rendered_Visual_Artifact
                    (
                        ArtifactID,
                        Item.SpanID,
                        Item.Provenance,
                        PageIndex,
                        Transformed,
                        CurrentDepth,
                        Checkpoints,
                        Item.Kind,
                        Item.Data.SVGTag || "g"
                    );

                    Artifacts.push(Artifact);
                }

                // Recursively descend into nested Sub_Frame containers
                for (let J = 0; J < this.Children.length; J++)
                {
                    const Child = this.Children[J];
                    const ChildArtifacts = Child.FlattenArtifacts(PageIndex, Cumulative, CurrentDepth + 1, ArtifactCounter);
                    for (let K = 0; K < ChildArtifacts.length; K++)
                    {
                        Artifacts.push(ChildArtifacts[K]);
                    }
                }

                return Artifacts;
            }
        }

        // =========================================================================
        // STRUCT: Rendered_Visual_Artifact
        // =========================================================================
        class Rendered_Visual_Artifact
        {
            constructor
            (
                ArtifactID,
                SpanID,
                Provenance,
                PageIndex,
                BoundingBox,
                LayoutTreeDepth  = 0,
                GlyphCheckpoints = [],
                Kind             = Artifact_Kind.Text_Run,
                SVGTag           = "g"
            )
            {
                this.ArtifactID       = ArtifactID;
                this.SpanID           = SpanID;
                this.Provenance       = Provenance || new Provenance_Tag(SpanID, null);
                this.PageIndex        = PageIndex;
                this.BoundingBox      = BoundingBox;
                this.LayoutTreeDepth  = LayoutTreeDepth;
                this.GlyphCheckpoints = GlyphCheckpoints;
                this.Kind             = Kind;
                this.SVGTag           = SVGTag;
            }
        }

        // =========================================================================
        // STRUCT: Forward_Sync_Target & Reverse_Sync_Target
        // =========================================================================
        class Forward_Sync_Target
        {
            constructor(SpanID, PageIndex, Bounds, IsContainerAnchor, StrokeColor, FillColor, TargetArtifactID, EnclosingSpan)
            {
                this.SpanID            = SpanID;
                this.PageIndex         = PageIndex;
                this.Bounds            = Bounds;
                this.IsContainerAnchor = IsContainerAnchor;
                this.StrokeColor       = StrokeColor;
                this.FillColor         = FillColor;
                this.TargetArtifactID  = TargetArtifactID;
                this.EnclosingSpan     = EnclosingSpan;
            }
        }

        class Reverse_Sync_Target
        {
            constructor(SpanID, SourceLine, SourceCol, SourceByteOffset, Artifact, EnclosingSpan)
            {
                this.SpanID           = SpanID;
                this.SourceLine       = SourceLine;
                this.SourceCol        = SourceCol;
                this.SourceByteOffset = SourceByteOffset;
                this.Artifact         = Artifact;
                this.EnclosingSpan    = EnclosingSpan;
            }
        }

        // =========================================================================
        // ENGINE: Deterministic_Bidirectional_Mapper
        // =========================================================================
        class Deterministic_Bidirectional_Mapper
        {
            constructor()
            {
                this.SpansByID           = new Map();
                this.ChildSpansByParent  = new Map();
                this.SpanIntervalList    = [];
                this.AnchorLineIndex     = new Map();
                this.ArtifactsBySpanID   = new Map();
                this.ArtifactsByID       = new Map();
                this.PageSpatialIndexes  = []; // Array of per-page spatial arrays
                this.SourceCode          = "";
                this.LineStarts          = [];
                this.LastRebuildDuration = 0;
            }

            ComputeLineStarts(Source)
            {
                const Starts = [0];
                for (let I = 0; I < Source.length; I++)
                {
                    if (Source[I] === "\n")
                    {
                        Starts.push(I + 1);
                    }
                }
                return Starts;
            }

            ByteToLineCol(ByteOffset)
            {
                if (this.LineStarts.length === 0)
                {
                    return { Line: 1, Col: 1 };
                }
                let Low  = 0;
                let High = this.LineStarts.length - 1;
                let Line = 0;

                while (Low <= High)
                {
                    const Mid = (Low + High) >> 1;
                    if (this.LineStarts[Mid] <= ByteOffset)
                    {
                        Line = Mid;
                        Low  = Mid + 1;
                    }
                    else
                    {
                        High = Mid - 1;
                    }
                }

                const LineStart  = this.LineStarts[Line];
                const Col        = (ByteOffset - LineStart) + 1;
                return { Line: Line + 1, Col: Col };
            }

            LineColToByte(Line, Col)
            {
                const LineIdx = Line - 1;
                if (LineIdx < 0) { return 0; }
                if (LineIdx >= this.LineStarts.length)
                {
                    return this.SourceCode.length;
                }
                return this.LineStarts[LineIdx] + Math.max(0, Col - 1);
            }

            RegisterSpan(Span)
            {
                this.SpansByID.set(Span.SpanID, Span);
                if (Span.ParentSpanID)
                {
                    if (!this.ChildSpansByParent.has(Span.ParentSpanID))
                    {
                        this.ChildSpansByParent.set(Span.ParentSpanID, []);
                    }
                    this.ChildSpansByParent.get(Span.ParentSpanID).push(Span);
                }

                this.SpanIntervalList.push(Span);

                if (Span.OpeningAnchorLine !== null)
                {
                    if (!this.AnchorLineIndex.has(Span.OpeningAnchorLine))
                    {
                        this.AnchorLineIndex.set(Span.OpeningAnchorLine, []);
                    }
                    this.AnchorLineIndex.get(Span.OpeningAnchorLine).push(Span);
                }

                if (Span.ClosingAnchorLine !== null)
                {
                    if (!this.AnchorLineIndex.has(Span.ClosingAnchorLine))
                    {
                        this.AnchorLineIndex.set(Span.ClosingAnchorLine, []);
                    }
                    this.AnchorLineIndex.get(Span.ClosingAnchorLine).push(Span);
                }
            }

            RegisterArtifact(Artifact)
            {
                this.ArtifactsByID.set(Artifact.ArtifactID, Artifact);

                // Register by primary SpanID
                if (!this.ArtifactsBySpanID.has(Artifact.SpanID))
                {
                    this.ArtifactsBySpanID.set(Artifact.SpanID, []);
                }
                this.ArtifactsBySpanID.get(Artifact.SpanID).push(Artifact);

                // Register by CallSiteSpanID if distinct
                const CallSiteID = Artifact.Provenance?.ContentCallSiteSpanID;
                if (CallSiteID && CallSiteID !== Artifact.SpanID)
                {
                    if (!this.ArtifactsBySpanID.has(CallSiteID))
                    {
                        this.ArtifactsBySpanID.set(CallSiteID, []);
                    }
                    this.ArtifactsBySpanID.get(CallSiteID).push(Artifact);
                }

                // Register in per-page spatial index
                while (this.PageSpatialIndexes.length <= Artifact.PageIndex)
                {
                    this.PageSpatialIndexes.push([]);
                }
                this.PageSpatialIndexes[Artifact.PageIndex].push(Artifact);
            }

            // =====================================================================
            // PHASE 1 & 4: LAFS AST PARSER & INCREMENTAL REBUILD
            // =====================================================================
            BuildFromSourceAndArtifacts(Source, Artifacts = [])
            {
                const StartTime = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();

                this.SpansByID.clear();
                this.ChildSpansByParent.clear();
                this.SpanIntervalList   = [];
                this.AnchorLineIndex.clear();
                this.ArtifactsBySpanID.clear();
                this.ArtifactsByID.clear();
                this.PageSpatialIndexes = [];
                this.SourceCode         = Source || "";
                this.LineStarts         = this.ComputeLineStarts(this.SourceCode);

                let NextSeq  = 1;
                const FileID = 1;

                // Parse document into LAFS AST spans
                this.ParseLAFSConstructs(Source, FileID, NextSeq);

                // Sort intervals by StartByte for binary search interval index
                this.SpanIntervalList.sort
                (
                    (A, B) =>
                    {
                        if (A.StartByte !== B.StartByte)
                        {
                            return A.StartByte - B.StartByte;
                        }
                        return (B.EndByte - B.StartByte) - (A.EndByte - A.StartByte);
                    }
                );

                // Register artifacts
                for (let I = 0; I < Artifacts.length; I++)
                {
                    this.RegisterArtifact(Artifacts[I]);
                }

                const EndTime = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
                this.LastRebuildDuration = EndTime - StartTime;
            }

            ParseLAFSConstructs(Source, FileID, NextSeq)
            {
                const Lines = Source.split(/\r?\n/);
                const DelimStack = [];

                // Helper to create span
                const MakeSpan = (StartB, EndB, LAFSState, OpenAnchor, CloseAnchor, Kind, Text, ParentID) =>
                {
                    const StartPos = this.ByteToLineCol(StartB);
                    const EndPos   = this.ByteToLineCol(EndB);
                    const ID       = CreateSpanID(FileID, NextSeq++);
                    const Span     = new AST_Source_Span
                    (
                        ID,
                        ParentID,
                        FileID,
                        StartB,
                        EndB,
                        StartPos.Line,
                        StartPos.Col,
                        EndPos.Line,
                        EndPos.Col,
                        LAFSState,
                        OpenAnchor,
                        CloseAnchor,
                        Kind,
                        Text
                    );
                    this.RegisterSpan(Span);
                    return Span;
                };

                // Root document span
                const RootSpan = MakeSpan(0, Source.length, LAFS_Container_State.Expanded_Symmetry, null, null, "Document", Source, null);

                // Scan line by line to detect headings, math blocks, table blocks, code blocks, containers
                let InRawBlock       = false;
                let ActiveParentSpan = RootSpan;
                const ParentStack    = [RootSpan];

                for (let LineIdx = 0; LineIdx < Lines.length; LineIdx++)
                {
                    const LineNum   = LineIdx + 1;
                    const LineText  = Lines[LineIdx];
                    const Trimmed   = LineText.trim();
                    const LineStart = this.LineStarts[LineIdx];
                    const LineEnd   = LineStart + LineText.length;

                    if (Trimmed.startsWith("```"))
                    {
                        InRawBlock = !InRawBlock;
                        MakeSpan(LineStart, LineEnd, LAFS_Container_State.Atomic_Token, null, null, "Raw_Block", LineText, ActiveParentSpan.SpanID);
                        continue;
                    }
                    if (InRawBlock)
                    {
                        continue;
                    }

                    // Heading: = or == or ===
                    if (/^=+ /.test(Trimmed))
                    {
                        MakeSpan(LineStart, LineEnd, LAFS_Container_State.Atomic_Token, null, null, "Heading", LineText, ActiveParentSpan.SpanID);
                        continue;
                    }

                    // Detached compound container opening: [{, [{(, [(
                    const CompoundOpenMatch = Trimmed.match(/^([\[\(\{]{2,})$/);
                    if (CompoundOpenMatch)
                    {
                        const DelimChars = CompoundOpenMatch[1];
                        const ContainerSpan = MakeSpan(LineStart, LineEnd, LAFS_Container_State.Simplified_Symmetry, LineNum, null, "Compound_Container", LineText, ActiveParentSpan.SpanID);
                        DelimStack.push
                        ({
                            DelimType:  DelimChars,
                            Span:       ContainerSpan,
                            StartLine:  LineNum,
                            IsCompound: true
                        });
                        ParentStack.push(ContainerSpan);
                        ActiveParentSpan = ContainerSpan;
                        continue;
                    }

                    // Detached compound container closing: )}], }], }]
                    const CompoundCloseMatch = Trimmed.match(/^([\]\)\}]{2,})(.*)$/);
                    if (CompoundCloseMatch && DelimStack.length > 0 && DelimStack[DelimStack.length - 1].IsCompound)
                    {
                        const Top = DelimStack.pop();
                        Top.Span.ClosingAnchorLine = LineNum;
                        Top.Span.EndByte           = LineEnd;
                        if (!this.AnchorLineIndex.has(LineNum))
                        {
                            this.AnchorLineIndex.set(LineNum, []);
                        }
                        this.AnchorLineIndex.get(LineNum).push(Top.Span);
                        ParentStack.pop();
                        ActiveParentSpan           = ParentStack[ParentStack.length - 1] || RootSpan;
                        continue;
                    }

                    // Single detached delimiter on a line alone (Expanded Symmetry): [, {, (, $
                    const SingleOpenMatch = Trimmed.match(/^([\(\[\{\$])$/);
                    if (SingleOpenMatch)
                    {
                        const Delim = SingleOpenMatch[1];
                        const ContainerSpan = MakeSpan(LineStart, LineEnd, LAFS_Container_State.Expanded_Symmetry, LineNum, null, Delim === "$" ? "Display_Math" : "Container", LineText, ActiveParentSpan.SpanID);
                        DelimStack.push
                        ({
                            DelimType:  Delim,
                            Span:       ContainerSpan,
                            StartLine:  LineNum,
                            IsCompound: false
                        });
                        ParentStack.push(ContainerSpan);
                        ActiveParentSpan = ContainerSpan;
                        continue;
                    }

                    // Single detached delimiter closing: ], }, ), $
                    const SingleCloseMatch = Trimmed.match(/^([\)\}\]\$])(?:[,;]?)$/);
                    if (SingleCloseMatch && DelimStack.length > 0)
                    {
                        const Top = DelimStack.pop();
                        Top.Span.ClosingAnchorLine = LineNum;
                        Top.Span.EndByte           = LineEnd;
                        if (!this.AnchorLineIndex.has(LineNum))
                        {
                            this.AnchorLineIndex.set(LineNum, []);
                        }
                        this.AnchorLineIndex.get(LineNum).push(Top.Span);
                        ParentStack.pop();
                        ActiveParentSpan           = ParentStack[ParentStack.length - 1] || RootSpan;
                        continue;
                    }

                    // Fraction detection inside display math: (a + b) / (c + d)
                    if (ActiveParentSpan.Kind === "Display_Math" && Trimmed.includes("/"))
                    {
                        const FracParts = Trimmed.split("/");
                        if (FracParts.length === 2)
                        {
                            const NumText   = FracParts[0].trim();
                            const DenomText = FracParts[1].trim();

                            const NumCol   = LineText.indexOf(NumText) + 1;
                            const NumStart = LineStart + (NumCol - 1);
                            const NumSpan  = MakeSpan(NumStart, NumStart + NumText.length, LAFS_Container_State.Atomic_Token, null, null, "Fraction_Numerator", NumText, ActiveParentSpan.SpanID);

                            const DenomCol   = LineText.indexOf(DenomText) + 1;
                            const DenomStart = LineStart + (DenomCol - 1);
                            const DenomSpan  = MakeSpan(DenomStart, DenomStart + DenomText.length, LAFS_Container_State.Atomic_Token, null, null, "Fraction_Denominator", DenomText, ActiveParentSpan.SpanID);

                            continue;
                        }
                    }

                    // Table rows or items
                    if (Trimmed.startsWith("table.cell") || Trimmed.startsWith("[") || Trimmed.startsWith("#table"))
                    {
                        MakeSpan(LineStart, LineEnd, LAFS_Container_State.Atomic_Token, null, null, "Table_Item", LineText, ActiveParentSpan.SpanID);
                        continue;
                    }

                    // Generic text paragraph line
                    if (Trimmed.length > 0)
                    {
                        MakeSpan(LineStart, LineEnd, LAFS_Container_State.Atomic_Token, null, null, "Text_Paragraph", LineText, ActiveParentSpan.SpanID);
                    }
                }

                return RootSpan;
            }

            // =====================================================================
            // PHASE 2 & 4: TYPESET LAYOUT SYNTHESIS & BIDIRECTIONAL MAPPING
            // =====================================================================
            BuildFromSourceAndLayout(Source)
            {
                const StartTime = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();

                // 1. Parse AST Spans
                this.BuildFromSourceAndArtifacts(Source, []);

                // 2. Synthesize Layout Frames
                const Artifacts = this.SynthesizeLayoutFromSpans();

                // 3. Register synthesized artifacts
                for (let I = 0; I < Artifacts.length; I++)
                {
                    this.RegisterArtifact(Artifacts[I]);
                }

                const EndTime = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
                this.LastRebuildDuration = EndTime - StartTime;

                return Artifacts;
            }

            SynthesizeLayoutFromSpans()
            {
                const PageWidthPt     = DEFAULT_PAGE_WIDTH_PT;
                const PageHeightPt    = DEFAULT_PAGE_HEIGHT_PT;
                const MarginLeft      = DEFAULT_MARGIN_HORIZONTAL;
                const MarginTop       = DEFAULT_MARGIN_VERTICAL;
                const ContentWidthPt  = PageWidthPt - (2 * MarginLeft);
                const MaxContentY     = PageHeightPt - MarginTop;

                let CurrentPageIndex = 0;
                let CurrentCursorY   = MarginTop;
                const Artifacts      = [];
                let ArtifactCounter  = 1;

                const AdvancePage = () =>
                {
                    CurrentPageIndex++;
                    CurrentCursorY = MarginTop;
                };

                for (let I = 0; I < this.SpanIntervalList.length; I++)
                {
                    const Span = this.SpanIntervalList[I];

                    if (Span.Kind === "Document" || Span.Kind === "Raw_Block")
                    {
                        continue;
                    }

                    // Handle Heading
                    if (Span.Kind === "Heading")
                    {
                        const ItemHeight = 28.0;
                        if (CurrentCursorY + ItemHeight > MaxContentY)
                        {
                            AdvancePage();
                        }

                        const Box = new Bounding_Rect_2D(MarginLeft, CurrentCursorY, MarginLeft + ContentWidthPt, CurrentCursorY + ItemHeight);
                        const Art = new Rendered_Visual_Artifact
                        (
                            ArtifactCounter++,
                            Span.SpanID,
                            new Provenance_Tag(Span.SpanID, null),
                            CurrentPageIndex,
                            Box,
                            1,
                            [],
                            Artifact_Kind.Text_Run,
                            "g"
                        );
                        Artifacts.push(Art);
                        CurrentCursorY += ItemHeight + 12.0;
                        continue;
                    }

                    // Handle Text Paragraph with Sub-Word Glyph Checkpoints
                    if (Span.Kind === "Text_Paragraph")
                    {
                        const ItemHeight = 18.0;
                        if (CurrentCursorY + ItemHeight > MaxContentY)
                        {
                            AdvancePage();
                        }

                        const Text        = Span.RawText.trim();
                        const GlyphW      = 6.5;
                        const BoxWidth    = Math.min(ContentWidthPt, Math.max(20.0, Text.length * GlyphW));
                        const Box         = new Bounding_Rect_2D(MarginLeft, CurrentCursorY, MarginLeft + BoxWidth, CurrentCursorY + ItemHeight);
                        const Checkpoints = [];

                        let CurrentX = MarginLeft;
                        for (let CIdx = 0; CIdx < Text.length; CIdx++)
                        {
                            Checkpoints.push(new Glyph_Byte_Checkpoint
                            (
                                Span.StartByte + CIdx,
                                Span.StartLine,
                                Span.StartCol + CIdx,
                                CurrentX,
                                GlyphW,
                                Text[CIdx]
                            ));
                            CurrentX += GlyphW;
                        }

                        const Art = new Rendered_Visual_Artifact
                        (
                            ArtifactCounter++,
                            Span.SpanID,
                            new Provenance_Tag(Span.SpanID, null),
                            CurrentPageIndex,
                            Box,
                            1,
                            Checkpoints,
                            Artifact_Kind.Text_Run,
                            "g"
                        );
                        Artifacts.push(Art);
                        CurrentCursorY += ItemHeight + 10.0;
                        continue;
                    }

                    // Handle Fractions in Math
                    if (Span.Kind === "Fraction_Numerator" || Span.Kind === "Fraction_Denominator")
                    {
                        const ItemHeight = 16.0;
                        const Text       = Span.RawText.trim();
                        const GlyphW     = 7.0;
                        const BoxWidth   = Math.max(30.0, Text.length * GlyphW);

                        // If denominator, place it directly below numerator
                        let ItemY = CurrentCursorY;
                        if (Span.Kind === "Fraction_Denominator")
                        {
                            ItemY = CurrentCursorY + 20.0;
                        }

                        const Box = new Bounding_Rect_2D(MarginLeft + 40.0, ItemY, MarginLeft + 40.0 + BoxWidth, ItemY + ItemHeight);
                        const Art = new Rendered_Visual_Artifact
                        (
                            ArtifactCounter++,
                            Span.SpanID,
                            new Provenance_Tag(Span.SpanID, null),
                            CurrentPageIndex,
                            Box,
                            3, // Deeper LayoutTreeDepth than parent math equation
                            [],
                            Artifact_Kind.Math_Glyph_Run,
                            "g"
                        );
                        Artifacts.push(Art);

                        if (Span.Kind === "Fraction_Denominator")
                        {
                            CurrentCursorY += 45.0;
                        }
                        continue;
                    }

                    // Handle Display Math Container
                    if (Span.Kind === "Display_Math")
                    {
                        const ItemHeight = 50.0;
                        if (CurrentCursorY + ItemHeight > MaxContentY)
                        {
                            AdvancePage();
                        }

                        const Box = new Bounding_Rect_2D(MarginLeft, CurrentCursorY, MarginLeft + ContentWidthPt, CurrentCursorY + ItemHeight);
                        const Art = new Rendered_Visual_Artifact
                        (
                            ArtifactCounter++,
                            Span.SpanID,
                            new Provenance_Tag(Span.SpanID, null),
                            CurrentPageIndex,
                            Box,
                            2, // Math container depth
                            [],
                            Artifact_Kind.Container_Frame,
                            "g"
                        );
                        Artifacts.push(Art);
                        continue;
                    }

                    // Handle Table Item / Table Row
                    if (Span.Kind === "Table_Item")
                    {
                        const ItemHeight = 24.0;
                        // Table row overflow handling: If row exceeds page height, it overflows onto next page
                        if (CurrentCursorY + ItemHeight > MaxContentY)
                        {
                            AdvancePage();
                        }

                        const Box = new Bounding_Rect_2D(MarginLeft, CurrentCursorY, MarginLeft + ContentWidthPt, CurrentCursorY + ItemHeight);
                        const Art = new Rendered_Visual_Artifact
                        (
                            ArtifactCounter++,
                            Span.SpanID,
                            new Provenance_Tag(Span.SpanID, null),
                            CurrentPageIndex,
                            Box,
                            2,
                            [],
                            Artifact_Kind.Table_Row,
                            "rect"
                        );
                        Artifacts.push(Art);
                        CurrentCursorY += ItemHeight + 4.0;
                        continue;
                    }

                    // Handle Compound Container or Generic Container
                    if (Span.Kind === "Compound_Container" || Span.Kind === "Container")
                    {
                        const ItemHeight = 35.0;
                        if (CurrentCursorY + ItemHeight > MaxContentY)
                        {
                            AdvancePage();
                        }

                        const Box = new Bounding_Rect_2D(MarginLeft, CurrentCursorY, MarginLeft + ContentWidthPt, CurrentCursorY + ItemHeight);
                        const Art = new Rendered_Visual_Artifact
                        (
                            ArtifactCounter++,
                            Span.SpanID,
                            new Provenance_Tag(Span.SpanID, null),
                            CurrentPageIndex,
                            Box,
                            1,
                            [],
                            Artifact_Kind.Container_Frame,
                            "g"
                        );
                        Artifacts.push(Art);
                        CurrentCursorY += ItemHeight + 10.0;
                        continue;
                    }
                }

                return Artifacts;
            }

            // =====================================================================
            // PHASE 3: DETERMINISTIC SVG RENDERER EMISSION
            // =====================================================================
            EmitDeterministicSVG(PageIndex, PageWidthPt, PageHeightPt, PageArtifacts)
            {
                // Strict LAFS Formatted SVG
                const Lines = [];

                Lines.push(`<svg`);
                Lines.push(`    data-lafs-page-index = "${PageIndex}"`);
                Lines.push(`    viewBox              = "0 0 ${PageWidthPt} ${PageHeightPt}"`);
                Lines.push(`    width                = "${PageWidthPt}pt"`);
                Lines.push(`    height               = "${PageHeightPt}pt"`);
                Lines.push(`    xmlns                = "http://www.w3.org/2000/svg" >`);

                for (let I = 0; I < PageArtifacts.length; I++)
                {
                    const Art = PageArtifacts[I];
                    const CallSiteAttr = Art.Provenance?.ContentCallSiteSpanID ? ` data-callsite-span-id = "${Art.Provenance.ContentCallSiteSpanID}"` : "";
                    const Box = Art.BoundingBox;

                    if (Art.Kind === Artifact_Kind.Text_Run)
                    {
                        Lines.push(`    <g id = "lafs-artifact-${Art.ArtifactID}" data-lafs-span-id = "${Art.SpanID}"${CallSiteAttr} transform = "matrix(1 0 0 1 ${Box.MinX.toFixed(3)} ${Box.MinY.toFixed(3)})">`);
                        Lines.push(`        <rect width = "${Box.Width().toFixed(3)}" height = "${Box.Height().toFixed(3)}" fill = "transparent" />`);
                        Lines.push(`    </g>`);
                    }
                    else if (Art.Kind === Artifact_Kind.Math_Glyph_Run)
                    {
                        Lines.push(`    <g id = "lafs-artifact-${Art.ArtifactID}" data-lafs-span-id = "${Art.SpanID}"${CallSiteAttr} transform = "matrix(1 0 0 1 ${Box.MinX.toFixed(3)} ${Box.MinY.toFixed(3)})">`);
                        Lines.push(`        <path d = "M0 0 L${Box.Width().toFixed(3)} 0" stroke = "#000000" />`);
                        Lines.push(`    </g>`);
                    }
                    else
                    {
                        Lines.push(`    <rect id = "lafs-artifact-${Art.ArtifactID}" data-lafs-span-id = "${Art.SpanID}"${CallSiteAttr} x = "${Box.MinX.toFixed(3)}" y = "${Box.MinY.toFixed(3)}" width = "${Box.Width().toFixed(3)}" height = "${Box.Height().toFixed(3)}" fill = "none" />`);
                    }
                }

                Lines.push(`</svg>`);
                return Lines.join("\n");
            }

            // =====================================================================
            // PHASE 5: CASE 1 — FORWARD SYNC (Editor Cursor -> Preview Highlight)
            // =====================================================================
            ResolveForwardSync(CursorLine, CursorCol = 1, CursorByte = null)
            {
                if (CursorByte === null)
                {
                    CursorByte = this.LineColToByte(CursorLine, CursorCol);
                }

                // 1. Check if CursorLine matches any container's OpeningAnchorLine or ClosingAnchorLine
                let MatchedAnchorSpan = null;
                const AnchorMatches   = this.AnchorLineIndex.get(CursorLine) || [];

                for (let I = 0; I < AnchorMatches.length; I++)
                {
                    const S = AnchorMatches[I];
                    if (S.OpeningAnchorLine === CursorLine || S.ClosingAnchorLine === CursorLine)
                    {
                        if (!MatchedAnchorSpan || (S.EndByte - S.StartByte) < (MatchedAnchorSpan.EndByte - MatchedAnchorSpan.StartByte))
                        {
                            MatchedAnchorSpan = S;
                        }
                    }
                }

                let SelectedSpan      = null;
                let IsContainerAnchor = false;

                if (MatchedAnchorSpan)
                {
                    SelectedSpan      = MatchedAnchorSpan;
                    IsContainerAnchor = true;
                }
                else
                {
                    // 2. Query all AST spans enclosing CursorByte
                    let NarrowestSpan = null;
                    let MinSpanLength = Infinity;

                    for (let I = 0; I < this.SpanIntervalList.length; I++)
                    {
                        const Span = this.SpanIntervalList[I];
                        if (Span.ContainsByte(CursorByte) || Span.ContainsPosition(CursorLine, CursorCol))
                        {
                            const SpanLength = Span.EndByte - Span.StartByte;
                            if (SpanLength <= MinSpanLength)
                            {
                                MinSpanLength = SpanLength;
                                NarrowestSpan = Span;
                            }
                        }
                    }

                    SelectedSpan      = NarrowestSpan;
                    IsContainerAnchor = false;
                }

                if (!SelectedSpan)
                {
                    return null;
                }

                // 3. Resolve corresponding visual artifacts
                let TargetArtifacts = this.ArtifactsBySpanID.get(SelectedSpan.SpanID) || [];

                // If container or wrapper with no direct artifacts, recursively traverse ChildSpansByParent
                if (TargetArtifacts.length === 0)
                {
                    TargetArtifacts = this.CollectDescendantArtifacts(SelectedSpan.SpanID);
                }

                if (TargetArtifacts.length === 0)
                {
                    return null;
                }

                // Group by page index and compute unified bounds
                const TargetPageIndex = TargetArtifacts[0].PageIndex;
                const PageArtifacts   = TargetArtifacts.filter((A) => A.PageIndex === TargetPageIndex);

                let UnifiedBounds = null;
                for (let I = 0; I < PageArtifacts.length; I++)
                {
                    const Box = PageArtifacts[I].BoundingBox;
                    if (!UnifiedBounds)
                    {
                        UnifiedBounds = new Bounding_Rect_2D(Box.MinX, Box.MinY, Box.MaxX, Box.MaxY);
                    }
                    else
                    {
                        UnifiedBounds = UnifiedBounds.Union(Box);
                    }
                }

                const StrokeColor = IsContainerAnchor ? COLOR_VIOLET_STROKE : COLOR_CYAN_STROKE;
                const FillColor   = IsContainerAnchor ? COLOR_VIOLET_FILL   : COLOR_CYAN_FILL;

                return new Forward_Sync_Target
                (
                    SelectedSpan.SpanID,
                    TargetPageIndex,
                    UnifiedBounds,
                    IsContainerAnchor,
                    StrokeColor,
                    FillColor,
                    PageArtifacts[0]?.ArtifactID || null,
                    SelectedSpan
                );
            }

            CollectDescendantArtifacts(ParentSpanID)
            {
                const Collected  = [];
                const ChildSpans = this.ChildSpansByParent.get(ParentSpanID) || [];

                for (let I = 0; I < ChildSpans.length; I++)
                {
                    const Child = ChildSpans[I];
                    const Direct = this.ArtifactsBySpanID.get(Child.SpanID) || [];
                    for (let J = 0; J < Direct.length; J++)
                    {
                        Collected.push(Direct[J]);
                    }
                    const Indirect = this.CollectDescendantArtifacts(Child.SpanID);
                    for (let K = 0; K < Indirect.length; K++)
                    {
                        Collected.push(Indirect[K]);
                    }
                }

                return Collected;
            }

            // =====================================================================
            // PHASE 6: CASE 2 — REVERSE SYNC (Preview Click -> Editor Cursor Jump)
            // =====================================================================
            ResolveReverseSync(PageIndex, ClickXPt, ClickYPt)
            {
                const PageArtifacts = this.PageSpatialIndexes[PageIndex] || [];
                if (PageArtifacts.length === 0)
                {
                    return null;
                }

                // 1. Query artifacts containing (ClickXPt, ClickYPt) within SUB_GLYPH_HIT_TOLERANCE_PT
                const HitArtifacts = [];
                for (let I = 0; I < PageArtifacts.length; I++)
                {
                    const Art = PageArtifacts[I];
                    if (Art.BoundingBox.ContainsPoint(ClickXPt, ClickYPt, SUB_GLYPH_HIT_TOLERANCE_PT))
                    {
                        HitArtifacts.push(Art);
                    }
                }

                if (HitArtifacts.length === 0)
                {
                    return null;
                }

                // 2. Rank hits by (Max(LayoutTreeDepth), Min(BoundingRect.Area()))
                // Also prioritizing ContentCallSiteSpanID over TemplateDefinitionSpanID
                HitArtifacts.sort
                (
                    (A, B) =>
                    {
                        // Priority 1: Has call site provenance
                        const HasCallSiteA = Boolean(A.Provenance?.ContentCallSiteSpanID);
                        const HasCallSiteB = Boolean(B.Provenance?.ContentCallSiteSpanID);
                        if (HasCallSiteA !== HasCallSiteB)
                        {
                            return HasCallSiteA ? -1 : 1;
                        }

                        // Priority 2: Deepest layout tree depth wins (e.g. math variable or cell over page)
                        if (B.LayoutTreeDepth !== A.LayoutTreeDepth)
                        {
                            return B.LayoutTreeDepth - A.LayoutTreeDepth;
                        }

                        // Priority 3: Smallest bounding box area wins
                        return A.BoundingBox.Area() - B.BoundingBox.Area();
                    }
                );

                const WinningArtifact = HitArtifacts[0];
                const EffectiveSpanID = WinningArtifact.Provenance?.ContentCallSiteSpanID || WinningArtifact.SpanID;
                const EnclosingSpan   = this.SpansByID.get(EffectiveSpanID) || null;

                let TargetLine = EnclosingSpan ? EnclosingSpan.StartLine : 1;
                let TargetCol  = EnclosingSpan ? EnclosingSpan.StartCol  : 1;
                let TargetByte = EnclosingSpan ? EnclosingSpan.StartByte : 0;

                // 3. Sub-word glyph checkpoint interpolation
                if (WinningArtifact.GlyphCheckpoints && WinningArtifact.GlyphCheckpoints.length > 0)
                {
                    let NearestCheckpoint = WinningArtifact.GlyphCheckpoints[0];
                    let MinDistance       = Math.abs(NearestCheckpoint.PageXCoordinate - ClickXPt);

                    for (let I = 1; I < WinningArtifact.GlyphCheckpoints.length; I++)
                    {
                        const Cp   = WinningArtifact.GlyphCheckpoints[I];
                        const Dist = Math.abs(Cp.PageXCoordinate - ClickXPt);
                        if (Dist < MinDistance)
                        {
                            MinDistance       = Dist;
                            NearestCheckpoint = Cp;
                        }
                    }

                    TargetLine = NearestCheckpoint.SourceLine;
                    TargetCol  = NearestCheckpoint.SourceCol;
                    TargetByte = NearestCheckpoint.SourceByteOffset;
                }

                return new Reverse_Sync_Target
                (
                    EffectiveSpanID,
                    TargetLine,
                    TargetCol,
                    TargetByte,
                    WinningArtifact,
                    EnclosingSpan
                );
            }
        }

        // =========================================================================
        // EXPORT API
        // =========================================================================
        return {
            SUB_GLYPH_HIT_TOLERANCE_PT:         SUB_GLYPH_HIT_TOLERANCE_PT,
            DEFAULT_PAGE_WIDTH_PT:              DEFAULT_PAGE_WIDTH_PT,
            DEFAULT_PAGE_HEIGHT_PT:             DEFAULT_PAGE_HEIGHT_PT,
            COLOR_CYAN_STROKE:                  COLOR_CYAN_STROKE,
            COLOR_CYAN_FILL:                    COLOR_CYAN_FILL,
            COLOR_VIOLET_STROKE:                COLOR_VIOLET_STROKE,
            COLOR_VIOLET_FILL:                  COLOR_VIOLET_FILL,
            COLOR_EMERALD_GREEN:                COLOR_EMERALD_GREEN,
            COLOR_DEEP_ORANGE:                  COLOR_DEEP_ORANGE,
            COLOR_BRIGHT_RED:                   COLOR_BRIGHT_RED,
            LAFS_Container_State:               LAFS_Container_State,
            Artifact_Kind:                      Artifact_Kind,
            CreateSpanID:                       CreateSpanID,
            AST_Source_Span:                    AST_Source_Span,
            Provenance_Tag:                     Provenance_Tag,
            Transform_Matrix_2D:                Transform_Matrix_2D,
            Bounding_Rect_2D:                   Bounding_Rect_2D,
            Glyph_Byte_Checkpoint:              Glyph_Byte_Checkpoint,
            Frame_Item:                         Frame_Item,
            Typeset_Layout_Frame:               Typeset_Layout_Frame,
            Rendered_Visual_Artifact:           Rendered_Visual_Artifact,
            Forward_Sync_Target:                Forward_Sync_Target,
            Reverse_Sync_Target:                Reverse_Sync_Target,
            Deterministic_Bidirectional_Mapper: Deterministic_Bidirectional_Mapper
        };
    }
));

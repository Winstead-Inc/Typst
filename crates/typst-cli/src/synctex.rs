#![allow(non_snake_case, dead_code, unused_mut)]

use std::fs;
use std::num::NonZeroUsize;

use ecow::eco_format;
use serde::Serialize;
use typst::introspection::PagedPosition;
use typst::layout:: { Abs, Frame, FrameItem, Point, Size, Transform };
use typst::syntax:: { Source, Span };
use typst::visualize::Geometry;
use typst::World;
use typst_ide:: { jump_from_click, jump_from_cursor, Jump };
use typst_layout::PagedDocument;

use crate::args::Output;
use crate::compile::CompileConfig;
use crate::world::SystemWorld;

#[allow(non_camel_case_types)]
#[derive(Debug, Clone, Serialize)]
pub struct Sync_Element
{
    pub page: usize,
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    pub line: usize,
    pub col: usize,
    pub end_line: usize,
    pub end_col: usize,
    pub start: usize,
    pub end: usize,
    pub span: String,
}

#[allow(non_camel_case_types)]
#[derive(Debug, Clone, Serialize)]
pub struct Sync_Location { pub line: usize, pub col: usize, pub offset: usize, }

#[allow(non_camel_case_types)]
#[derive(Debug, Clone, Serialize)]
pub struct Sync_Cursor_Box { pub page: usize, pub x: f64, pub y: f64, }

pub fn ExportSynctex(Document: & PagedDocument, World: & SystemWorld, Config: & CompileConfig,)
{
    let Output::Path(ref OutPath) = Config.output
    else { return ; };

    let Some(Parent) = OutPath.parent()
    else { return ; };

    let SynctexPath = Parent.join("synctex.json");

    let Ok(Source) = World.source(World.main())
    else { return ; };

    let mut Elements = Vec:: new ();

    for (PageIdx, Page) in Document.pages().iter().enumerate()
    {
        let PageNum = PageIdx + 1;
        CollectFrameElements( & Page.frame, Transform::identity(), PageNum, & Source, & mut Elements,);
    }

    if let Ok(Json) = serde_json::to_string( & Elements) { let _ = fs::write(SynctexPath, Json); }
}

pub fn ResolveClick(World: & SystemWorld, Document: & PagedDocument, PageNum: usize, X_Pt: f64, Y_Pt: f64,)->Option<Sync_Location>
{
    let PageNZ = NonZeroUsize:: new (PageNum)?;
    let ClickPos = PagedPosition { page: PageNZ, point: Point::new (Abs::pt(X_Pt), Abs::pt(Y_Pt)), };

    let JumpResult = jump_from_click(World, Document, & ClickPos)?;
    match JumpResult
    {
        Jump::File(FileID, ByteOffset) =>
        {
            let SourceFile = World.source(FileID).ok()?;
            let (Line, _) = SourceFile.lines().byte_to_line_column(ByteOffset)?;
            let StartLineByte = SourceFile.lines().line_to_byte(Line)?;
            let Head = SourceFile.text(). get(StartLineByte..ByteOffset).unwrap_or("");
            let Col = Head.chars().map(char::len_utf16).sum::<usize>() + 1;

            Some(Sync_Location { line: Line + 1, col: Col, offset: ByteOffset })
        }
        _ => None,
    }
}

pub fn ResolveCursor(World: & SystemWorld, Document: & PagedDocument, Line: usize, Col: usize,)->Option<Sync_Cursor_Box>
{
    let SourceFile = World.source(World.main()).ok()?;
    let LineIdx = Line.saturating_sub(1);
    let LineRange = SourceFile.lines().line_to_range(LineIdx)?;
    let LineStr = & SourceFile.text()[LineRange.clone()];

    let mut CurrentUtf16 = 1;
    let mut TargetByte = LineRange.start;
    for (ByteIdx, Ch) in LineStr.char_indices()
    {
        if CurrentUtf16 >= Col { TargetByte = LineRange.start + ByteIdx; break ; }
        CurrentUtf16 += Ch.len_utf16();
        TargetByte = LineRange.start + ByteIdx + Ch.len_utf8();
    }

    let Positions = jump_from_cursor(Document, & SourceFile, TargetByte);
    if let Some(FirstPos) = Positions.first() { Some(Sync_Cursor_Box { page: FirstPos.page.get (), x: FirstPos.point.x.to_pt(), y: FirstPos.point.y.to_pt(), }) }
    else { None }
}

fn CollectFrameElements(TargetFrame: & Frame, CurrentTransform: Transform, PageNum: usize, SourceFile: & Source, Elements: & mut Vec<Sync_Element>,)
{
    for & (Pos, ref Item) in TargetFrame.items()
    {
        match Item
        {
            FrameItem::Group(Group) =>
            {
                let GroupTransform = CurrentTransform
                .pre_concat(Transform::translate(Pos.x, Pos.y))
                .pre_concat(Group.transform);
                CollectFrameElements( & Group.frame, GroupTransform, PageNum, SourceFile, Elements,);
            }
            FrameItem::Text(Text) =>
            {
                let mut GlyphX = Abs::zero();

                for Glyph in &Text.glyphs
                {
                    let Width = Glyph.x_advance.at(Text.size);
                    let OffsetX = Glyph.x_offset.at(Text.size);
                    let OffsetY = Glyph.y_offset.at(Text.size);
                    let GlyphSpan = Glyph.span.0;
                    let SubOffset = Glyph.span.1 as usize;

                    if !GlyphSpan.is_detached() && Width.to_pt() > 0.0001
                    {
                        if let Some(Elem) = CreateElementFromGlyph
                        (
                            GlyphSpan,
                            SubOffset,
                            Glyph.range.start as usize,
                            Glyph.range.end as usize,
                            PageNum,
                            Pos.x + GlyphX + OffsetX,
                            Pos.y - OffsetY - Text.size,
                            Width,
                            Text.size,
                            CurrentTransform,
                            SourceFile,
                        )
                        {
                            Elements.push(Elem);
                        }
                    }

                    GlyphX += Width;
                }
            }
            FrameItem::Shape(ShapeItem, SpanItem) =>
            {
                if ! SpanItem.is_detached()
                {
                    let (Width, Height) = match & ShapeItem.geometry
                    {
                        Geometry::Rect(SizeVal) => (SizeVal.x, SizeVal.y),
                        Geometry::Line(ToVal) => (ToVal.x.abs(), ToVal.y.abs()),
                        Geometry::Curve(CurveVal) => { let BBox = CurveVal.bbox(None); let SizeVal = BBox.size();(SizeVal.x, SizeVal.y) }
                    };

                    if let Some(Elem) = CreateElementFromSpan( * SpanItem, PageNum, Pos.x, Pos.y, Width, Height, CurrentTransform, SourceFile,)
                    {
                        Elements.push(Elem);
                    }
                }
            }
            FrameItem::Image(_, SizeVal, SpanItem) =>
            {
                if ! SpanItem.is_detached()
                {
                    if let Some(Elem) = CreateElementFromSpan( * SpanItem, PageNum, Pos.x, Pos.y, SizeVal.x, SizeVal.y, CurrentTransform, SourceFile,)
                    {
                        Elements.push(Elem);
                    }
                }
            }
            _ => {}
        }
    }
}

fn CreateElementFromGlyph
(
    TargetSpan: Span,
    SubOffset: usize,
    RangeStart: usize,
    RangeEnd: usize,
    PageNum: usize,
    X: Abs,
    Y: Abs,
    Width: Abs,
    Height: Abs,
    TransformVal: Transform,
    SourceFile: &Source,
) -> Option<Sync_Element>
{
    let Origin = Point::new(X, Y);
    let SizeVal = Size::new(Width, Height);
    let (PagePos, PageSize) = TransformRect(Origin, SizeVal, TransformVal);

    let SpanID = TargetSpan.id()?;
    if SpanID != SourceFile.id()
    {
        return None;
    }

    let Node = SourceFile.find(TargetSpan)?;
    let RangeVal = Node.range();

    let GlyphByteStart = RangeVal.start.saturating_add(SubOffset);
    let CharLen = RangeEnd.saturating_sub(RangeStart);
    let GlyphByteEnd = (GlyphByteStart + CharLen.max(1)).min(SourceFile.text().len());

    let (Line, _) = SourceFile.lines().byte_to_line_column(GlyphByteStart)?;
    let StartLineByte = SourceFile.lines().line_to_byte(Line)?;
    let Head = SourceFile.text().get(StartLineByte..GlyphByteStart).unwrap_or("");
    let Col = Head.chars().map(char::len_utf16).sum::<usize>() + 1;

    let (EndLine, _) = SourceFile.lines().byte_to_line_column(GlyphByteEnd).unwrap_or((Line, 0));
    let EndLineByte = SourceFile.lines().line_to_byte(EndLine).unwrap_or(0);
    let EndHead = SourceFile.text().get(EndLineByte..GlyphByteEnd).unwrap_or("");
    let EndCol = EndHead.chars().map(char::len_utf16).sum::<usize>() + 1;

    let Raw = TargetSpan.into_raw().get();
    let SpanHex = eco_format!("{:x}", Raw);

    Some
    (
        Sync_Element
        {
            page: PageNum,
            x: PagePos.x.to_pt(),
            y: PagePos.y.to_pt(),
            width: PageSize.x.to_pt(),
            height: PageSize.y.to_pt(),
            line: Line + 1,
            col: Col,
            end_line: EndLine + 1,
            end_col: EndCol,
            start: GlyphByteStart,
            end: GlyphByteEnd,
            span: SpanHex.to_string(),
        }
    )
}

fn CreateElementFromSpan(TargetSpan: Span, PageNum: usize, X: Abs, Y: Abs, Width: Abs, Height: Abs, TransformVal: Transform, SourceFile: & Source,)->Option<Sync_Element>
{
    let Origin = Point:: new (X, Y);
    let SizeVal = Size:: new (Width, Height);
    let (PagePos, PageSize) = TransformRect(Origin, SizeVal, TransformVal);

    let SpanID = TargetSpan.id()?;
    if SpanID != SourceFile.id() { return None; }

    let Node = SourceFile.find(TargetSpan)?;
    let RangeVal = Node.range();

    let (Line, _) = SourceFile.lines().byte_to_line_column(RangeVal.start)?;
    let StartLineByte = SourceFile.lines().line_to_byte(Line)?;
    let Head = & SourceFile.text()[StartLineByte..RangeVal.start];
    let Col = Head.chars().map(char::len_utf16).sum::<usize>() + 1;

    let (EndLine, _) = SourceFile.lines().byte_to_line_column(RangeVal.end).unwrap_or((Line, 0));
    let EndLineByte = SourceFile.lines().line_to_byte(EndLine).unwrap_or(0);
    let EndHead = SourceFile.text(). get(EndLineByte..RangeVal.end).unwrap_or("");
    let EndCol = EndHead.chars().map(char::len_utf16).sum::<usize>() + 1;

    let Raw = TargetSpan.into_raw(). get();
    let SpanHex = eco_format!("{:x}", Raw);

    Some
    (
        Sync_Element
        {
            page: PageNum,
            x: PagePos.x.to_pt(),
            y: PagePos.y.to_pt(),
            width: PageSize.x.to_pt(),
            height: PageSize.y.to_pt(),
            line: Line + 1,
            col: Col,
            end_line: EndLine + 1,
            end_col: EndCol,
            start: RangeVal.start,
            end: RangeVal.end,
            span: SpanHex.to_string(),
        }
    )
}

fn TransformRect(Origin: Point, SizeVal: Size, Ts: Transform)->(Point, Size)
{
    let P1 = Origin.transform(Ts);
    let P2 = Point:: new (Origin.x + SizeVal.x, Origin.y).transform(Ts);
    let P3 = Point:: new (Origin.x, Origin.y + SizeVal.y).transform(Ts);
    let P4 = Point:: new (Origin.x + SizeVal.x, Origin.y + SizeVal.y).transform(Ts);

    let MinX = P1.x.min(P2.x).min(P3.x).min(P4.x);
    let MaxX = P1.x.max(P2.x).max(P3.x).max(P4.x);
    let MinY = P1.y.min(P2.y).min(P3.y).min(P4.y);
    let MaxY = P1.y.max(P2.y).max(P3.y).max(P4.y);
    (Point::new (MinX, MinY), Size::new (MaxX - MinX, MaxY - MinY))
}

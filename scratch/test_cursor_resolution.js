const SyncMap = [
  { line: 4, col: 1, end_line: 4, end_col: 31, x: 70.9, y: 67.1, width: 133.2, height: 11.0, span: "title" },
  { line: 8, col: 9, end_line: 8, end_col: 14, x: 213.9, y: 90.4, width: 5.3, height: 11.0, span: "cos" },
  { line: 9, col: 9, end_line: 9, end_col: 14, x: 213.3, y: 103.6, width: 5.3, height: 11.0, span: "sin" },
  { line: 12, col: 7, end_line: 12, end_col: 8, x: 286.1, y: 90.4, width: 6.3, height: 11.0, span: "x" },
  { line: 12, col: 10, end_line: 12, end_col: 11, x: 286.3, y: 103.6, width: 5.7, height: 11.0, span: "y" },
  { line: 12, col: 13, end_line: 12, end_col: 14, x: 286.4, y: 116.7, width: 5.5, height: 11.0, span: "1" },
  { line: 5, col: 1, end_line: 15, end_col: 2, x: 510.4, y: 103.6, width: 14.1, height: 11.0, span: "eq_num" }
];

function ResolveCursor(Line, Col) {
    const SameLineCandidates = SyncMap.filter(
        (Elem) => (Elem.line === Line && Elem.end_line === Line) && !(Elem.width < 50 && Elem.x > 450)
    );

    let BestElem = null;

    if (SameLineCandidates.length > 0) {
        BestElem = SameLineCandidates[0];
        let MinDist = Math.abs(Col - BestElem.col);
        for (const Elem of SameLineCandidates) {
            const Dist = Math.min(Math.abs(Col - Elem.col), Math.abs(Col - Elem.end_col));
            if (Dist < MinDist) {
                MinDist = Dist;
                BestElem = Elem;
            }
        }
    } else {
        let Matches = SyncMap.filter((Elem) => {
            const StartsBefore = Elem.line < Line || (Elem.line === Line && Elem.col <= Col);
            const EndsAfter = Elem.end_line > Line || (Elem.end_line === Line && Elem.end_col >= Col);
            return StartsBefore && EndsAfter;
        });

        const ContentMatches = Matches.filter((Elem) => {
            const IsMultiLine = (Elem.end_line - Elem.line) >= 2;
            const IsNumbering = IsMultiLine && Elem.width < 50 && Elem.x > 450;
            return !IsNumbering;
        });

        if (ContentMatches.length > 0) {
            BestElem = ContentMatches[0];
            let MinRange = BestElem.end_line - BestElem.line;
            for (const Elem of ContentMatches) {
                const RangeLen = Elem.end_line - Elem.line;
                if (RangeLen < MinRange) {
                    MinRange = RangeLen;
                    BestElem = Elem;
                }
            }
        } else {
            // Find content element with minimal line distance
            const NonNumbering = SyncMap.filter((Elem) => !(Elem.width < 50 && Elem.x > 450));
            if (NonNumbering.length > 0) {
                let MinLineDist = Infinity;
                for (const Elem of NonNumbering) {
                    const Dist = Math.min(Math.abs(Elem.line - Line), Math.abs(Elem.end_line - Line));
                    if (Dist < MinLineDist) {
                        MinLineDist = Dist;
                        BestElem = Elem;
                    }
                }
            }
        }
    }

    return BestElem;
}

const Res1 = ResolveCursor(12, 3);
console.log("Cursor at line 12 col 3 (vec):", Res1 ? Res1.span : "none");

const Res2 = ResolveCursor(6, 4);
console.log("Cursor at line 6 col 4 (mat):", Res2 ? Res2.span : "none");

const fs = require('fs');

const PREDEFINED_MATH_OPERATORS = new Set([
    "arccos", "arcsin", "arctan", "arg", "cos", "cosh", "cot", "coth",
    "csc", "csch", "ctg", "deg", "det", "dim", "exp", "gcd", "lcm",
    "hom", "id", "im", "inf", "ker", "lg", "lim", "liminf", "limsup",
    "ln", "log", "max", "min", "mod", "Pr", "sec", "sech", "sin",
    "sinc", "sinh", "sup", "tan", "tanh", "tg", "tr", "dif", "Dif"
]);

function GetMathIntervals(Source) {
    const Intervals = [];
    const Regex = /(?<!\\)\$(?:[^$]|\\\$)*\$/g;
    let Match;
    while ((Match = Regex.exec(Source)) !== null) {
        Intervals.push({ Start: Match.index, End: Match.index + Match[0].length });
    }
    return Intervals;
}

function EnrichMathSyncMap(SyncMap, Source, SvgPages) {
    if (!SyncMap || !Source) return SyncMap || [];
    const Enriched = [...SyncMap];
    const Lines = Source.split(/\r?\n/);
    const MathIntervals = GetMathIntervals(Source);
    let ByteOffset = 0;
    const ClaimedGroups = new Map();

    const LineMap = new Map();
    for (const E of Enriched) {
        if (!LineMap.has(E.line)) LineMap.set(E.line, []);
        LineMap.get(E.line).push(E);
    }

    for (let LineIdx = 0; LineIdx < Lines.length; LineIdx++) {
        const LineText = Lines[LineIdx];
        const LineNum = LineIdx + 1;
        const Regex = /\b([a-zA-Z_]+)\b/g;
        let Match;

        while ((Match = Regex.exec(LineText)) !== null) {
            const Ident = Match[1];
            if (!PREDEFINED_MATH_OPERATORS.has(Ident)) continue;

            const Col = Match.index + 1;
            const EndCol = Col + Ident.length;
            const Start = ByteOffset + Match.index;
            const End = Start + Ident.length;

            const InsideMath = MathIntervals.some(Int => Start >= Int.Start && End <= Int.End);
            if (!InsideMath) continue;

            const LineElems = LineMap.get(LineNum) || [];
            const Exists = LineElems.some(E => Math.abs(E.col - Col) <= 1 && Math.abs(E.end_col - EndCol) <= 1);
            if (Exists) continue;

            LineElems.sort((A, B) => A.col - B.col);

            let PageNum = 1;
            let EstY = null;
            let EstH = 10.5;
            let EstX = null;
            let EstW = Ident.length * 5.3;

            const NextElem = LineElems.find(E => E.col >= EndCol);
            const PrevElem = [...LineElems].reverse().find(E => E.end_col <= Col);

            if (NextElem) {
                PageNum = NextElem.page;
                EstY = NextElem.y;
                EstH = NextElem.height;
                EstX = NextElem.x - EstW - 1.0;
            } else if (PrevElem) {
                PageNum = PrevElem.page;
                EstY = PrevElem.y;
                EstH = PrevElem.height;
                EstX = PrevElem.x + PrevElem.width + 1.0;
            } else {
                const EqElems = Enriched.filter(E => LineNum >= E.line && LineNum <= E.end_line);
                if (EqElems.length > 0) {
                    PageNum = EqElems[0].page;
                    EstY = EqElems[0].y;
                    EstH = EqElems[0].height;
                }
            }

            if (SvgPages && SvgPages[PageNum - 1]) {
                const Svg = SvgPages[PageNum - 1];
                if (!ClaimedGroups.has(PageNum)) ClaimedGroups.set(PageNum, new Set());
                const Claimed = ClaimedGroups.get(PageNum);

                const GroupRegex = /<g\b[^>]*transform="matrix\(1 0 0 -1 ([^ ]+) ([^)]+)\)"[^>]*>([\s\S]*?)<\/g>/g;
                let GMatch;
                let BestGroup = null;
                let BestDist = Infinity;
                let BestMatchIndex = -1;

                while ((GMatch = GroupRegex.exec(Svg)) !== null) {
                    const GroupIndex = GMatch.index;
                    if (Claimed.has(GroupIndex)) continue;

                    const Tx = parseFloat(GMatch[1]);
                    const Ty = parseFloat(GMatch[2]);
                    const Uses = [...GMatch[3].matchAll(/<use[^>]*x="([^"]*)"/g)].map(U => parseFloat(U[1]));

                    if (Uses.length === Ident.length) {
                        const GroupY = Ty - EstH;
                        const YDist = EstY !== null ? Math.abs(GroupY - EstY) : 0;
                        const XDist = EstX !== null ? Math.abs(Tx - EstX) : 0;
                        const TotalDist = (YDist * 10) + XDist;

                        if (YDist < 6.0 && TotalDist < BestDist) {
                            BestDist = TotalDist;
                            const MinUseX = Math.min(...Uses);
                            const MaxUseX = Math.max(...Uses);
                            BestGroup = {
                                X: Tx + MinUseX,
                                Y: GroupY,
                                Width: (MaxUseX - MinUseX) + 5.5,
                                Height: EstH
                            };
                            BestMatchIndex = GroupIndex;
                        }
                    }
                }

                if (BestGroup) {
                    Claimed.add(BestMatchIndex);
                    EstX = BestGroup.X;
                    EstY = BestGroup.Y;
                    EstW = BestGroup.Width;
                    EstH = BestGroup.Height;
                }
            }

            if (EstX !== null && EstY !== null) {
                const NewElem = {
                    page: PageNum,
                    line: LineNum,
                    col: Col,
                    end_line: LineNum,
                    end_col: EndCol,
                    start: Start,
                    end: End,
                    x: EstX,
                    y: EstY,
                    width: EstW,
                    height: EstH,
                    span: `synth_math_${LineNum}_${Col}`
                };
                Enriched.push(NewElem);
                LineElems.push(NewElem);
            }
        }
        ByteOffset += LineText.length + 1;
    }
    return Enriched;
}

const sync = JSON.parse(fs.readFileSync('scratch/synctex.json', 'utf8'));
const source = fs.readFileSync('projects/GenesisOfTheVanguard/0typ.typ', 'utf8');
const p1 = fs.existsSync('scratch/showcase-1.svg') ? fs.readFileSync('scratch/showcase-1.svg', 'utf8') : '';
const p2 = fs.existsSync('scratch/showcase-2.svg') ? fs.readFileSync('scratch/showcase-2.svg', 'utf8') : '';
const p3 = fs.existsSync('scratch/showcase-3.svg') ? fs.readFileSync('scratch/showcase-3.svg', 'utf8') : '';
const p4 = fs.existsSync('scratch/showcase-4.svg') ? fs.readFileSync('scratch/showcase-4.svg', 'utf8') : '';

const enriched = EnrichMathSyncMap(sync, source, [p1, p2, p3, p4]);
const l106 = enriched.filter(e => e.line === 106).sort((a,b) => a.col - b.col);
const l107 = enriched.filter(e => e.line === 107).sort((a,b) => a.col - b.col);
console.log('--- ENRICHED LINE 106 ---');
l106.forEach(e => console.log(`col ${e.col}-${e.end_col}: x=${e.x.toFixed(2)}, w=${e.width.toFixed(2)}, y=${e.y.toFixed(2)} [span=${e.span}]`));
console.log('--- ENRICHED LINE 107 ---');
l107.forEach(e => console.log(`col ${e.col}-${e.end_col}: x=${e.x.toFixed(2)}, w=${e.width.toFixed(2)}, y=${e.y.toFixed(2)} [span=${e.span}]`));

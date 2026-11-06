function MergeOverlappingBoxes(Boxes)
{
    if (!Boxes || Boxes.length <= 1) return Boxes || [];

    const PageGroups = new Map();
    for (const Box of Boxes)
    {
        const PageNum = Box.page || 1;
        if (!PageGroups.has(PageNum)) PageGroups.set(PageNum,[]);
        PageGroups.get(PageNum).push( { ...Box });
    }

    const Result = [];

    for (const[PageNum, PageBoxes] of PageGroups.entries())
    {
        let Changed = true;
        let Current = [...PageBoxes];

        while (Changed)
        {
            Changed = false;
            const Next = [];
            const MergedIndices = new Set();

            for (let I = 0; I < Current.length; I ++)
            {
                if (MergedIndices.has(I)) continue;
                let BoxA = Current[I];

                for (let J = I + 1; J < Current.length; J ++)
                {
                    if (MergedIndices.has(J)) continue;
                    const BoxB = Current[J];

                    const CenterY_A = BoxA.y + (BoxA.height / 2);
                    const CenterY_B = BoxB.y + (BoxB.height / 2);
                    const DistY = Math.abs(CenterY_A - CenterY_B);

                    const OverlapX = (Math.min(BoxA.x + BoxA.width, BoxB.x + BoxB.width) - Math.max(BoxA.x, BoxB.x)) >= - 1.0;
                    const OverlapY = (Math.min(BoxA.y + BoxA.height, BoxB.y + BoxB.height) - Math.max(BoxA.y, BoxB.y));

                    const MinHeight = Math.min(BoxA.height, BoxB.height);
                    const SameLine = DistY < 7.5 || (OverlapY > MinHeight * 0.45);

                    const AInsideB = (BoxA.x >= BoxB.x - 2.0) && ( (BoxA.x + BoxA.width) <= (BoxB.x + BoxB.width + 2.0));
                    const BInsideA = (BoxB.x >= BoxA.x - 2.0) && ( (BoxB.x + BoxB.width) <= (BoxA.x + BoxA.width + 2.0));
                    const Nested = (AInsideB || BInsideA) && DistY < 10.0;

                    if (OverlapX && (SameLine || Nested))
                    {
                        const MinX = Math.min(BoxA.x, BoxB.x);
                        const MaxX = Math.max(BoxA.x + BoxA.width, BoxB.x + BoxB.width);
                        const MinY = Math.min(BoxA.y, BoxB.y);
                        const MaxY = Math.max(BoxA.y + BoxA.height, BoxB.y + BoxB.height);

                        BoxA =
                        {
                            page: PageNum,
                            x: MinX,
                            y: MinY,
                            width: MaxX - MinX,
                            height: MaxY - MinY
                        };

                        MergedIndices.add(J);
                        Changed = true;
                    }
                }

                Next.push(BoxA);
            }

            Current = Next;
        }

        Result.push(...Current);
    }

    return Result;
}
// Test with exact numbers from real compilation:
const RealBoxes =
[
    { page: 1, x: 70.9, y: 85.7, width: 446.2, height: 11.0 },
    // Line 1 text
    { page: 1, x: 357.4, y: 83.2, width: 27.5, height: 17.6 },
    // Line 1 matrix
    { page: 1, x: 418.4, y: 97.2, width: 3.7, height: 5.5 },
    // Line 1 subscript
    { page: 1, x: 70.9, y: 102.1, width: 67.0, height: 11.0 }
    // Line 2 text ("text flows.")
];

const Res = MergeOverlappingBoxes(RealBoxes);
console.log("Output boxes count:", Res.length);
Res.forEach
(
    (B, I) =>
    {
        console.log
        (
            `Box ${I}: x:${B.x.toFixed(1)}..${(B.x+B.width).toFixed(1)} y:${B.y.toFixed(1)}..${(B.y+B.height).toFixed(1)} (w:${B.width.toFixed(1)}, h:${B.height.toFixed(1)})`
        );
    }
);

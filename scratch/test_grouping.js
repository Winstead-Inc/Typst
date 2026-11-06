const Elements =
[
    { page: 1, line: 2, col: 1, end_line: 2, end_col: 64, x: 70.9, y: 85.7, width: 283.8, height: 11.0 },
    { page: 1, line: 2, col: 64, end_line: 2, end_col: 65, x: 354.7, y: 85.7, width: 2.8, height: 11.0 },
    { page: 1, line: 2, col: 66, end_line: 2, end_col: 81, x: 357.4, y: 85.7, width: 6.6, height: 11.0 },
    { page: 1, line: 2, col: 70, end_line: 2, end_col: 71, x: 364.0, y: 83.2, width: 4.4, height: 7.7 },
    { page: 1, line: 2, col: 76, end_line: 2, end_col: 77, x: 364.0, y: 93.1, width: 4.4, height: 7.7 },
    { page: 1, line: 2, col: 73, end_line: 2, end_col: 74, x: 373.9, y: 83.2, width: 4.4, height: 7.7 },
    { page: 1, line: 2, col: 79, end_line: 2, end_col: 80, x: 373.9, y: 93.1, width: 4.4, height: 7.7 },
    { page: 1, line: 2, col: 66, end_line: 2, end_col: 81, x: 378.3, y: 85.7, width: 6.6, height: 11.0 },
    { page: 1, line: 2, col: 82, end_line: 2, end_col: 83, x: 384.8, y: 85.7, width: 2.8, height: 11.0 },
    { page: 1, line: 2, col: 83, end_line: 2, end_col: 86, x: 387.6, y: 85.7, width: 16.6, height: 11.0 },
    { page: 1, line: 2, col: 86, end_line: 2, end_col: 87, x: 404.1, y: 85.7, width: 2.8, height: 11.0 },
    { page: 1, line: 2, col: 88, end_line: 2, end_col: 101, x: 406.9, y: 85.7, width: 6.6, height: 11.0 },
    { page: 1, line: 2, col: 92, end_line: 2, end_col: 93, x: 413.5, y: 83.2, width: 5.0, height: 7.7 },
    { page: 1, line: 2, col: 94, end_line: 2, end_col: 95, x: 418.4, y: 87.3, width: 3.7, height: 5.5 },
    { page: 1, line: 2, col: 97, end_line: 2, end_col: 98, x: 413.5, y: 93.1, width: 5.0, height: 7.7 },
    { page: 1, line: 2, col: 99, end_line: 2, end_col: 100, x: 418.4, y: 97.2, width: 3.7, height: 5.5 },
    { page: 1, line: 2, col: 88, end_line: 2, end_col: 101, x: 422.6, y: 85.7, width: 6.6, height: 11.0 },
    { page: 1, line: 2, col: 102, end_line: 2, end_col: 103, x: 429.2, y: 85.7, width: 2.8, height: 11.0 },
    { page: 1, line: 2, col: 103, end_line: 2, end_col: 138, x: 431.9, y: 85.7, width: 85.2, height: 11.0 },
    { page: 1, line: 2, col: 103, end_line: 2, end_col: 138, x: 70.9, y: 102.1, width: 67.0, height: 11.0 }
];

function GroupElementsIntoVisualBoxesCurrent(Elements)
{
    if (!Elements || Elements.length === 0) return [];
    const PageGroups = new Map();
    for (const Elem of Elements)
    {
        const PageNum = Elem.page || 1;
        if (!PageGroups.has(PageNum)) PageGroups.set(PageNum,[]);
        PageGroups.get(PageNum).push( { ...Elem });
    }

    const FinalBoxes = [];
    for (const[PageNum, PageElements] of PageGroups.entries())
    {
        const LineClusters = [];
        PageElements.sort
        (
            (A, B) => ( (A.y + A.height / 2) - (B.y + B.height / 2)) || (A.x - B.x)
        );

        for (const Box of PageElements)
        {
            const CenterY = Box.y + (Box.height / 2);
            let Cluster = LineClusters.find( (C) => Math.abs(C.CenterY - CenterY) < 9.0);
            if (!Cluster)
            {
                LineClusters.push
                ({
                    CenterY: CenterY, Boxes:[Box]
                });
            }
            else
            {
                Cluster.Boxes.push(Box);
                Cluster.CenterY = Cluster.Boxes.reduce( (Sum, B) => Sum + B.y + B.height / 2, 0) / Cluster.Boxes.length;
            }
        }

        for (const Cluster of LineClusters)
        {
            const CBoxes = Cluster.Boxes;
            const MinX = Math.min
            (
                ...CBoxes.map( (B) => B.x)
            );
            const MaxX = Math.max
            (
                ...CBoxes.map( (B) => B.x + B.width)
            );
            const MinY = Math.min
            (
                ...CBoxes.map( (B) => B.y)
            );
            const MaxY = Math.max
            (
                ...CBoxes.map( (B) => B.y + B.height)
            );

            FinalBoxes.push
            ({
                page: PageNum,
                x: MinX,
                y: MinY,
                width: MaxX - MinX,
                height: MaxY - MinY,
                boxCount: CBoxes.length
            });
        }
    }
    return FinalBoxes;
}

const Result = GroupElementsIntoVisualBoxesCurrent(Elements);
console.log("Visual boxes count:", Result.length);
Result.forEach
(
    (B, I) =>
    {
        console.log
        (
            `Box ${I}: x:${B.x.toFixed(1)}..${(B.x+B.width).toFixed(1)} y:${B.y.toFixed(1)}..${(B.y+B.height).toFixed(1)} (w:${B.width.toFixed(1)}, h:${B.height.toFixed(1)}) boxes:${B.boxCount}`
        );
    }
);

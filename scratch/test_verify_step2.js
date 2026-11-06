const FS = require("node:fs");
const Path = require("node:path");

const TempDir = "scratch/test_job";
const SvgPath = Path.join(TempDir, "page-1.svg");
const MapPath = Path.join(TempDir, "span-map.json");

if (FS.existsSync(SvgPath) && FS.existsSync(MapPath))
{
    const Svg = FS.readFileSync(SvgPath, "utf-8");
    const Map = JSON.parse(FS.readFileSync(MapPath, "utf-8"));
    const Spans = [...Svg.matchAll(/data-span="([^"]+)"/g)].map((M) => M[1]);
    console.log("Total data-spans in SVG:", Spans.length);

    let FoundCount = 0;
    for (const Span of Spans)
    {
        if (Map[Span])
        {
            FoundCount++;
            console.log(`✓ Direct match: SVG data-span="${Span}" -> Line ${Map[Span].line}, Col ${Map[Span].col}`);
        }
        else
        {
            console.log(`? Looking up: SVG data-span="${Span}"`);
        }
    }
    console.log(`Match rate: ${FoundCount}/${Spans.length}`);
}

const FS = require("node:fs");

const Svg = FS.readFileSync("scratch/test_span.svg", "utf-8");
const Regex = /<g\b[^>]*data-span="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g;
let Match;
while ((Match = Regex.exec(Svg)) !== null)
{
    const SpanHex = Match[1];
    const Raw = BigInt("0x" + SpanHex);
    const FileId = Number(Raw >> 48n);
    const NumberPart = Raw & 0xFFFFFFFFFFFFn;
    console.log("Span:", SpanHex, "FileId:", FileId, "NumberPart:", NumberPart.toString(16));
}

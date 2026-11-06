const FS = require("node:fs");

const ServerCode = FS.readFileSync("TypstStudio/Server.js", "utf-8");
const StartIdx = ServerCode.indexOf("function ConvertColorHex(Hex)");
const EndIdx = ServerCode.indexOf("function ConvertTypstSourceToDarkMode", StartIdx);
const FuncCode = ServerCode.substring(StartIdx, EndIdx);

const Sandbox = {};
const Evaluator = new Function("exports", FuncCode + "\nexports.ConvertColorHex = ConvertColorHex;");
Evaluator(Sandbox);
const ConvertColorHex = Sandbox.ConvertColorHex;

const Colors =
{
    AltRow: ConvertColorHex("fafafa"),
    MetricBox: ConvertColorHex("f1f3f6"),
    TableHeader: ConvertColorHex("e4e9f0"),
    Borders: ConvertColorHex("dddddd"),
    Text: ConvertColorHex("000000"),
    GreenAccent: ConvertColorHex("16a34a"),
    BlueAccent: ConvertColorHex("2563eb")
};

console.log("Converted Colors in Black Mode:");
console.log
(
    "  Alternating Row (fafafa):   #" + Colors.AltRow + " (Brightness: " + parseInt(Colors.AltRow.slice(0, 2), 16) + ")"
);
console.log
(
    "  Metric Box (f1f3f6):        #" + Colors.MetricBox + " (Brightness: " + parseInt(Colors.MetricBox.slice(0, 2), 16) + ")"
);
console.log
(
    "  Table Header (e4e9f0):      #" + Colors.TableHeader + " (Brightness: " + parseInt(Colors.TableHeader.slice(0, 2), 16) + ")"
);
console.log
(
    "  Borders (dddddd):           #" + Colors.Borders + " (Brightness: " + parseInt(Colors.Borders.slice(0, 2), 16) + ")"
);
console.log
(
    "  Text (000000):              #" + Colors.Text + " (Brightness: " + parseInt(Colors.Text.slice(0, 2), 16) + ")"
);
console.log("  Green Accent (16a34a):      #" + Colors.GreenAccent + " (Preserved Saturated Hue)");
console.log("  Blue Accent (2563eb):       #" + Colors.BlueAccent + " (Preserved Saturated Hue)");

const BrightnessAlt = parseInt(Colors.AltRow.slice(0, 2), 16);
const BrightnessBox = parseInt(Colors.MetricBox.slice(0, 2), 16);
const BrightnessHeader = parseInt(Colors.TableHeader.slice(0, 2), 16);

console.log("\nDistinguishability Verification:");
console.log("  Page Canvas (0)  -> Alternating Row (" + BrightnessAlt + "): Delta = +" + (BrightnessAlt - 0) + " (Clearly visible dark gray)");
console.log
(
    "  Alternating Row (" + BrightnessAlt + ") -> Metric Box (" + BrightnessBox + "):      Delta = +" + (BrightnessBox - BrightnessAlt) + " (Distinct card background)"
);
console.log
(
    "  Metric Box (" + BrightnessBox + ")      -> Table Header (" + BrightnessHeader + "):    Delta = +" + (BrightnessHeader - BrightnessBox) + " (Prominent header, distinguishable)"
);

if (BrightnessAlt >= 30 && BrightnessBox >= 46 && BrightnessHeader >= 64 && (BrightnessBox - BrightnessAlt) >= 12 && (BrightnessHeader - BrightnessBox) >= 15)
{
    console.log("\n[PASS] All Dark Gray Tiers are distinct, distinguishable, and meet contrast specifications!");
    process.exit(0);
}
else
{
    console.error("\n[FAIL] Brightness steps do not meet distinguishability threshold.");
    process.exit(1);
}

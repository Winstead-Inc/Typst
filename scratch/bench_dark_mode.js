const fs = require('fs');
const svg = fs.readFileSync('scratch/test-1.svg', 'utf8');

function InvertMonochromeColor(ColorStr)
{
    if (!ColorStr) return ColorStr;
    const Trimmed = ColorStr.trim();
    if
    (
        Trimmed.startsWith('url(') || ['none', 'transparent', 'currentcolor', 'inherit'].includes(Trimmed.toLowerCase())
    )
    return ColorStr;
    let Red = 0, Green = 0, Blue = 0, Alpha = '';
    const Lower = Trimmed.toLowerCase();
    if (Lower === 'white') { Red = 255; Green = 255; Blue = 255; }
    else if (Lower === 'black') { Red = 0; Green = 0; Blue = 0; }
    else if (Lower === 'gray' || Lower === 'grey') { Red = 128; Green = 128; Blue = 128; }
    else if (Trimmed.startsWith('#'))
    {
        const Hex = Trimmed.slice(1);
        if (Hex.length === 3)
        {
            Red = parseInt(Hex[0] + Hex[0], 16);
            Green = parseInt(Hex[1] + Hex[1], 16);
            Blue = parseInt(Hex[2] + Hex[2], 16);
        }
        else if (Hex.length === 6)
        {
            Red = parseInt(Hex.slice(0, 2), 16);
            Green = parseInt(Hex.slice(2, 4), 16);
            Blue = parseInt(Hex.slice(4, 6), 16);
        }
        else return ColorStr;
    }
    else return ColorStr;
    const MaxDelta = Math.max(Math.abs(Red - Green), Math.abs(Green - Blue), Math.abs(Blue - Red));
    if (MaxDelta > 18) return ColorStr;
    const InvertComponent = (c) => Math.min
    (
        255, Math.max
        (
            0, Math.round(12 + (255 - c) * 0.902)
        )
    );
    return '#' + InvertComponent(Red).toString(16).padStart(2, '0') + InvertComponent(Green).toString(16).padStart(2, '0') + InvertComponent(Blue).toString(16).padStart
    (
        2, '0'
    );
}

function ConvertSvgToDarkMode(Svg)
{
    let Result = Svg.replace
    (
        /\b(fill|stroke|stop-color)\s*=\s*(['\"][^'\"]*['\"])/gi, (m, a, q) =>
        {
            return a + '=' + q[0] + InvertMonochromeColor(q.slice(1, - 1)) + q[0];
        }
    );
    return Result;
}

const t0 = Date.now();
const dark = ConvertSvgToDarkMode(svg);
const t1 = Date.now();
console.log('Single page dark mode regex conversion:', t1 - t0, 'ms');
console.log('For 4 pages:', (t1 - t0) * 4, 'ms');

const fs = require('fs');
const content = fs.readFileSync('projects/GenesisOfTheVanguard/main.typ', 'utf8');
const lines = content.split('\n');

let nestingDepth = 0;
let currentOpen = null;
const pairs = [];

for (let lineIdx = 0; lineIdx < lines.length; lineIdx ++)
{
    const lineNum = lineIdx + 1;
    const line = lines[lineIdx];
    // Scan character by character
    for (let colIdx = 0; colIdx < line.length; colIdx ++)
    {
        const char = line[colIdx];
        const prevChar = colIdx > 0 ? line[colIdx - 1]: '';
        // Track outer brackets for rainbow nesting level
        if (char === '(' || char === '[' || char === '{')
        {
            nestingDepth ++;
        }
        else if (char === ')' || char === ']' || char === '}')
        {
            nestingDepth = Math.max(0, nestingDepth - 1);
        }
        else if (char === '$' && prevChar !== '\\')
        {
            if (currentOpen === null)
            {
                // Opening $
                currentOpen =
                {
                    startLine: lineNum,
                    startCol: colIdx + 1,
                    level: nestingDepth % 6
                };
            }
            else
            {
                // Closing $
                pairs.push
                ({
                    startLine: currentOpen.startLine,
                    startCol: currentOpen.startCol,
                    endLine: lineNum,
                    endCol: colIdx + 1,
                    level: currentOpen.level,
                    isMultiline: currentOpen.startLine !== lineNum
                });
                currentOpen = null;
            }
        }
    }
}

console.log('Total math pairs found:', pairs.length);
for (const p of pairs)
{
    console.log(`Pair: [${p.startLine}:${p.startCol} -> ${p.endLine}:${p.endCol}] Level: ${p.level} Multiline: ${p.isMultiline}`);
}

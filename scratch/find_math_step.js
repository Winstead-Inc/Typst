const fs = require('fs');
const readline = require('readline');

async function findMathGuides()
{
    const fileStream = fs.createReadStream
    (
        'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.system_generated/logs/transcript.jsonl'
    );
    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity });

    for await (const line of rl)
    {
        if (line.includes('UpdateMathBracketHighlighting') || line.includes('typst-math-guide-line'))
        {
            const obj = JSON.parse(line);
            if (obj.tool_calls)
            {
                for (const tc of obj.tool_calls)
                {
                    if (tc.name === 'edit_file' || tc.name === 'write_file')
                    {
                        console.log('Found edit in step', obj.step_index);
                        console.log(JSON.stringify(tc.args).slice(0, 500));
                    }
                }
            }
        }
    }
}
findMathGuides();

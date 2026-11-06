const fs = require('fs');
const readline = require('readline');

async function findStep()
{
    const fileStream = fs.createReadStream
    (
        'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.system_generated/logs/transcript_full.jsonl'
    );
    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity });
    let count = 0;
    for await (const line of rl)
    {
        if (line.includes('typst-math-guide-line') && line.includes('function '))
        {
            const obj = JSON.parse(line);
            console.log('Step with typst-math-guide-line:', obj.step_index);
            for
            (
                const tc of(obj.tool_calls ||[])
            )
            {
                if (tc.name === 'edit_file' || tc.name === 'write_file')
                {
                    console.log('Tool call in step', obj.step_index);
                    fs.writeFileSync(`scratch/math_guide_step_${obj.step_index}.txt`, tc.args.Replacement || tc.args.Content || '', 'utf8');
                    count ++;
                }
            }
        }
    }
    console.log('Found', count, 'matches');
}
findStep();

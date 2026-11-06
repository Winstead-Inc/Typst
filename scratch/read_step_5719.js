const fs = require('fs');
const readline = require('readline');

async function showStep()
{
    const fileStream = fs.createReadStream
    (
        'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.system_generated/logs/transcript_full.jsonl'
    );
    const rl = readline.createInterface( { input: fileStream, crlfDelay: Infinity });
    for await (const line of rl)
    {
        if (line.includes('"step_index":5719'))
        {
            const obj = JSON.parse(line);
            fs.writeFileSync('scratch/step_5719_replacement.txt', obj.tool_calls[0].args.Replacement, 'utf8');
            console.log('Saved step 5719 replacement!');
            process.exit(0);
        }
    }
}
showStep();

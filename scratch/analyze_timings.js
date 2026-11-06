const fs = require('fs');
const file = process.argv[2] || 'scratch/timings.json';
const events = JSON.parse(fs.readFileSync(file, 'utf8'));

const stack = [];
const durations = {};

for (const ev of events)
{
    if (ev.ph === 'B')
    {
        stack.push(ev);
    }
    else if (ev.ph === 'E')
    {
        const top = stack.pop();
        if (top && top.name === ev.name)
        {
            const dur = (ev.ts - top.ts);
            // in microseconds
            durations[top.name] = (durations[top.name] || 0) + dur;
        }
    }
    else if (ev.ph === 'X')
    {
        durations[ev.name] = (durations[ev.name] || 0) + (ev.dur || 0);
    }
}

console.log(`Timings for: ${file}`);
const sorted = Object.entries(durations).sort( (a, b) => b[1] - a[1]);
for (const[name, dur] of sorted.slice(0, 20))
{
    console.log(`${name.padEnd(35)}: ${(dur / 1000).toFixed(2)} ms`);
}

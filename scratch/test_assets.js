const https = require('https');

const options = {
    hostname: 'api.github.com',
    path: '/repos/Winstead-Inc/Language-Agnostic-Formatting-Style/releases/latest',
    headers: { 'User-Agent': 'TypstStudio-Update-Checker' }
};

https.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        const json = JSON.parse(data);
        console.log('Tag:', json.tag_name);
        if (json.assets) {
            json.assets.forEach(a => {
                console.log(`- ${a.name} (${(a.size / 1024 / 1024).toFixed(2)} MB)`);
            });
        }
    });
});

const https = require('https');

const options = {
    hostname: 'api.github.com',
    path: '/repos/Winstead-Inc/Language-Agnostic-Formatting-Style/releases/latest',
    headers: { 'User-Agent': 'TypstStudio-Update-Checker' }
};

const req = https.get(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('GitHub API Status Code:', res.statusCode);
        try {
            const json = JSON.parse(data);
            if (res.statusCode === 200) {
                console.log('Latest Release Tag:', json.tag_name);
                console.log('Assets count:', json.assets ? json.assets.length : 0);
            } else {
                console.log('GitHub API response:', json.message || data);
            }
        } catch (e) {
            console.error('JSON parse error:', e.message);
        }
    });
});

req.on('error', (err) => {
    console.log('Offline/Network Error (Graceful fallback):', err.message);
});

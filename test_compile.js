const http = require('http');

http.get
(
    'http://localhost:3000/api/auth/token',
    (res) =>
    {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on
        (
            'end',
            () =>
            {
                const token = JSON.parse(data).Token;
                console.log("Token:", token);

                const req = http.request
                (
                    {
                        hostname: 'localhost',
                        port: 3000,
                        path: '/api/compile',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'X-Typst-Auth-Token': token }
                    },

                    (res2) =>
                    {
                        let data2 = '';
                        res2.on('data', chunk => data2 += chunk);
                        res2.on
                        (
                            'end',
                            () =>
                            {
                                console.log("Compile response status:", res2.statusCode);
                                const json = JSON.parse(data2);
                                console.log("Success:", json.Success, "PageCount:", json.Pages ? json.Pages.length : 0, "Error:", json.Error);
                            }
                        );
                    }
                );

                req.write(JSON.stringify( { Source: "= Hello Typst\nThis is a test." }));
                req.end();
            }
        );
    }
);

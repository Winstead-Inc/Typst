const fs = require('fs');
const app = fs.readFileSync('TypstStudio/public/App.js', 'utf8');

const startIdx = app.indexOf('const TEMPLATES =');
const endIdx = app.indexOf('let LastCompiledPages = [];');
const templatesCode = app.slice(startIdx, endIdx).replace('const TEMPLATES =', 'global.TEMPLATES =');

eval(templatesCode);
console.log("Showcase length:", global.TEMPLATES.showcase.length);
fs.writeFileSync('temp_showcase.typ', global.TEMPLATES.showcase);

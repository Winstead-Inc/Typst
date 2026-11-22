const fs = require("fs");
const app = fs.readFileSync("TypstStudio/public/App.js", "utf8");
const html = fs.readFileSync("TypstStudio/public/index.html", "utf8");

// Case-insensitive ID check
function hasId(id) {
    const regex = new RegExp(`\\bId\\s*=\\s*["']${id}["']`, "i");
    return regex.test(html);
}

const matches = [...app.matchAll(/document\.getElementById\(\s*["']([^"']+)["']\s*\)\.addEventListener/g)];
const missing = [];
for (const m of matches) {
    const id = m[1];
    if (!hasId(id)) {
        missing.push(id);
    }
}
console.log("Missing IDs called directly with addEventListener:", [...new Set(missing)]);

const allMatches = [...app.matchAll(/document\.getElementById\(\s*["']([^"']+)["']\s*\)\.([a-zA-Z]+)/g)];
const missingProps = [];
for (const m of allMatches) {
    const id = m[1];
    const prop = m[2];
    if (!hasId(id)) {
        missingProps.push({ id, prop });
    }
}
console.log("Missing IDs with direct property access:", missingProps);

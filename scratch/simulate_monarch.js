const fs = require("fs");
const path = require("path");

// Extract the tokenizer definition from App.js
const appJs = fs.readFileSync(path.join(__dirname, "../TypstStudio/public/App.js"), "utf8");
const startIdx = appJs.indexOf("setMonarchTokensProvider");
const endIdx = appJs.indexOf("defineTheme", startIdx);
const snippet = appJs.slice(startIdx, endIdx);
console.log("Snippet length:", snippet.length);

// Also let's read page-setup.typ lines 155 to 200
const pageSetup = fs.readFileSync(path.join(__dirname, "../docs/content/guides/page-setup.typ"), "utf8");
const lines = pageSetup.split(/\r?\n/);
for (let i = 150; i < 200; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
}

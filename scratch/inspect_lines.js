const fs = require("fs");
const path = require("path");

const pageSetup = fs.readFileSync(path.join(__dirname, "../docs/content/guides/page-setup.typ"), "utf8");
const allLines = pageSetup.split(/\r?\n/);

for (let i = 160; i <= 195; i++) {
    console.log(`Line ${i + 1}: ${JSON.stringify(allLines[i])}`);
}

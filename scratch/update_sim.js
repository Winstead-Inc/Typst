// Update simulate_dom.js createElement with remove()
const fs = require("fs");
let simCode = fs.readFileSync("scratch/simulate_dom.js", "utf-8");
simCode = simCode.replace("innerHTML: \"\"", "innerHTML: \"\", remove() {}");
fs.writeFileSync("scratch/simulate_dom.js", simCode);

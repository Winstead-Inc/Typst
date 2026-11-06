const FS = require("fs");
const M = FS.readFileSync("TypstStudio/public/Deterministic_Bidirectional_Mapper.js", "utf8");
const Lines = M.split("\n");
console.log("Lines 690-720:");
console.log(Lines.slice(690, 720).join("\n"));

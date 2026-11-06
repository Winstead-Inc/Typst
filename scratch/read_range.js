const FS = require("fs");
const Lines = FS.readFileSync("TypstStudio/public/App.js", "utf8").split("\n");
console.log(Lines.slice(3150, 3300).join("\n"));

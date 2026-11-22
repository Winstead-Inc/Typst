const fs = require("fs");
const vm = require("vm");
const code = fs.readFileSync("TypstStudio/public/App.js", "utf-8");
const sandbox = {
    window: {},
    document: {
        getElementById: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        body: { style: {} }
    },
    localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    setTimeout: () => {},
    setInterval: () => {},
    console: console,
    navigator: { platform: "Win32" }
};
sandbox.window = sandbox;
sandbox.addEventListener = () => {};
try {
    vm.runInNewContext(code, sandbox);
    console.log("App.js executed to the end!");
    console.log("window.SwitchToTab:", typeof sandbox.SwitchToTab);
    console.log("window.OpenDocumentInTab:", typeof sandbox.OpenDocumentInTab);
    console.log("window.CloseTab:", typeof sandbox.CloseTab);
    console.log("window.OpenProjectInExplorer:", typeof sandbox.OpenProjectInExplorer);
} catch (e) {
    console.error("TOP LEVEL ERROR in App.js:", e);
}

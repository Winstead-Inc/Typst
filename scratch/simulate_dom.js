// Update simulate_dom.js
const fs = require("fs");
const html = fs.readFileSync("TypstStudio/public/index.html", "utf-8");
const js = fs.readFileSync("TypstStudio/public/App.js", "utf-8");

const elements = new Map();

function createElement(id, tag = "div") {
    const el = {
        id,
        tagName: tag.toUpperCase(),
        style: {
            setProperty(k, v) { this[k] = v; }
        },
        classList: {
            classes: new Set(),
            add(c) { this.classes.add(c); },
            remove(c) { this.classes.delete(c); },
            contains(c) { return this.classes.has(c); },
            toggle(c) { if (this.contains(c)) this.remove(c); else this.add(c); }
        },
        children: [],
        appendChild(child) { this.children.push(child); return child; },
        setAttribute(k, v) { this[k] = v; },
        getAttribute(k) { return this[k]; },
        addEventListener(evt, fn) {
            if (!this._listeners) this._listeners = {};
            if (!this._listeners[evt]) this._listeners[evt] = [];
            this._listeners[evt].push(fn);
        },
        click() {
            if (this.onclick) this.onclick({ stopPropagation() {}, preventDefault() {} });
            if (this._listeners && this._listeners["click"]) {
                this._listeners["click"].forEach(fn => fn({ stopPropagation() {}, preventDefault() {}, target: this }));
            }
        },
        dataset: {},
        value: "",
        textContent: "",
        innerHTML: "", remove() {}
    };
    elements.set(id, el);
    return el;
}

const idMatches = html.match(/Id\s*=\s*["']([^"']+)["']/gi) || [];
idMatches.forEach(m => {
    const id = m.replace(/Id\s*=\s*["']/i, "").replace(/["']/, "");
    createElement(id);
});

const windowMock = {
    addEventListener(evt, fn) {
        if (!this._listeners) this._listeners = {};
        if (!this._listeners[evt]) this._listeners[evt] = [];
        this._listeners[evt].push(fn);
    },
    document: {
        documentElement: createElement("html"),
        body: createElement("body"),
        getElementById(id) {
            if (!elements.has(id)) {
                return createElement(id);
            }
            return elements.get(id);
        },
        querySelector(sel) {
            if (sel.startsWith("#")) return this.getElementById(sel.slice(1));
            return createElement("dummy_" + sel);
        },
        querySelectorAll() { return []; },
        createElement(tag) { return createElement("dyn_" + Math.random(), tag); },
        addEventListener(evt, fn) { windowMock.addEventListener(evt, fn); }
    },
    localStorage: {
        _store: {},
        getItem(k) { return this._store[k] || null; },
        setItem(k, v) { this._store[k] = String(v); },
        removeItem(k) { delete this._store[k]; }
    },
    setTimeout(fn) { return typeof fn === "function" ? fn() : null; },
    setInterval() {},
    requestAnimationFrame(fn) { return typeof fn === "function" ? fn() : null; },
    console: console,
    navigator: { platform: "Win32" },
    monaco: {
        editor: {
            create() {
                return {
                    getValue() { return "= Document Title\nSome content"; },
                    setValue() {},
                    layout() {},
                    onKeyDown() {},
                    getModel() {
                        return {
                            getValue() { return ""; },
                            onDidChangeContent() {}
                        };
                    }
                };
            },
            defineTheme() {}
        },
        languages: {
            register() {},
            setMonarchTokensProvider() {},
            setLanguageConfiguration() {}
        }
    },
    __TAURI__: {
        core: {
            invoke(cmd, args) {
                if (cmd === "GetWorkspaceInfo") {
                    return Promise.resolve({
                        Directories: ["e:\\Typst\\projects", "D:\\Interception\\Novel"],
                        Files: [
                            { Path: "D:\\Interception\\Novel\\STUPIDITY.typ", Name: "STUPIDITY.typ", Size: 92, Modified: 100 },
                            { Path: "D:\\Interception\\Novel\\0typ.typ", Name: "0typ.typ", Size: 150000, Modified: 100 },
                            { Path: "e:\\Typst\\projects\\GenesisOfTheVanguard\\main.typ", Name: "main.typ", Size: 8200, Modified: 100 },
                            { Path: "e:\\Typst\\projects\\GenesisOfTheVanguard\\0typ.typ", Name: "0typ.typ", Size: 8200, Modified: 100 }
                        ]
                    });
                }
                if (cmd === "ReadWorkspaceFile") {
                    return Promise.resolve("= Test File Content\nHello world");
                }
                return Promise.resolve(null);
            }
        }
    }
};

windowMock.window = windowMock;

const vm = require("vm");
vm.runInNewContext(js, windowMock);

if (windowMock._listeners && windowMock._listeners["DOMContentLoaded"]) {
    const dcl = windowMock._listeners["DOMContentLoaded"][0];
    dcl().then(() => {
        console.log("SUCCESS: DOMContentLoaded completed!");
        console.log("Testing window functions:");
        console.log("SwitchToTab type:", typeof windowMock.SwitchToTab);
        console.log("OpenDocumentInTab type:", typeof windowMock.OpenDocumentInTab);
        console.log("CloseTab type:", typeof windowMock.CloseTab);
        console.log("OpenProjectInExplorer type:", typeof windowMock.OpenProjectInExplorer);
        console.log("CreateFileInProject type:", typeof windowMock.CreateFileInProject);

        // Test calling SwitchToTab
        windowMock.SwitchToTab("e:\\Typst\\projects\\GenesisOfTheVanguard\\main.typ");
        console.log("SwitchToTab executed successfully!");

        // Test calling OpenDocumentInTab
        windowMock.OpenDocumentInTab("D:\\Interception\\Novel\\STUPIDITY.typ");
        console.log("OpenDocumentInTab executed successfully!");

        // Test calling OpenProjectInExplorer
        windowMock.OpenProjectInExplorer("D:\\Interception\\Novel");
        console.log("OpenProjectInExplorer executed successfully!");
    }).catch(err => {
        console.error("CRASH inside DOMContentLoaded:", err);
    });
}

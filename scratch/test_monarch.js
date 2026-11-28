const fs = require("fs");
const path = require("path");

const pageSetup = fs.readFileSync(path.join(__dirname, "../docs/content/guides/page-setup.typ"), "utf8");
const allLines = pageSetup.split(/\r?\n/);

const monarchDef = {
    keywords: [
        "let", "set", "show", "context", "if", "else", "while",
        "for", "in", "return", "import", "include", "as", "break", "continue"
    ],
    constants: ["none", "auto", "true", "false"],
    builtins: [
        "align", "text", "par", "page", "v", "h", "grid", "table",
        "image", "heading", "list", "enum", "rect", "circle",
        "calc", "counter", "line", "pagebreak", "columns",
        "box", "block", "stack", "place", "move", "rotate", "scale", "hide", "repeat",
        "path", "polygon", "curve", "link", "outline", "bibliography", "cite",
        "figure", "caption", "footnote", "quote", "raw", "state", "query", "locate",
        "measure", "layout", "datetime", "regex", "bytes", "duration", "version",
        "type", "repr", "str", "int", "float", "array", "dictionary", "arguments",
        "rgb", "cmyk", "luma", "color", "gradient", "pattern", "stroke", "vec", "mat",
        "std", "panic", "assert"
    ],
    tokenizer: {
        root: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/```/, "markup.raw.block", "@rawblock"],
            [/`[^`\n]*`/, "markup.raw.inline"],
            [/^(\s*=+)(.*)$/, ["keyword.heading", "markup.heading.text"]],
            [/<[a-zA-Z0-9_\-:]+>/, "entity.name.label"],
            [/@[a-zA-Z0-9_\-:]+/, "entity.name.reference"],
            [/\*([^*]+)\*/, "markup.bold"],
            [/_([^_]+)_/, "markup.italic"],
            [/\\([#$*_\-\\@[\]{}])/, "constant.character.escape"],
            [/\\$/, "constant.character.escape"],
            [/^\s*[-+]\s+/, "punctuation.list"],
            [/^\s*\d+\.\s+/, "punctuation.list"],
            [/\[\s*[\(\)\{\}\[\]\.,:;\\` ]+\s*\]/, "markup.content.literal"],
            [/\$/, "string.math", "@mathmode"],
            [/#([a-zA-Z_][a-zA-Z0-9_-]*)/, { cases: { "@keywords": "keyword", "@constants": "constant.language", "@builtins": "type.identifier", "@default": "type.identifier" } }],
            [/#/, "keyword", "@codemode"],
            [/"([^"\\]|\\.)*"/, "string"],
            [/[{}()\[\]]/, "@brackets"],
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, ""],
            [/./, ""]
        ],
        codemode: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/\{/, "@brackets", "@push"],
            [/\}/, "@brackets", "@pop"],
            [/\[/, "@brackets", "@markupmode"],
            [/"([^"\\]|\\.)*"/, "string"],
            [/\d+(\.\d+)?(pt|in|cm|mm|em|fr|%|deg|rad)?/, "number"],
            [/([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=:)/, "variable.parameter"],
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, { cases: { "@keywords": "keyword", "@constants": "constant.language", "@builtins": "type.identifier", "@default": "identifier" } }],
            [/=>|==|!=|<=|>=|\.\.|\+=|-=|\*=|\/=|&&|\|\||[+\-*/=<>!&|~]/, "operator"],
            [/[()]/, "@brackets"],
            [/[,;:]/, "delimiter"],
            [/\s+/, ""]
        ],
        markupmode: [
            [/\[/, "@brackets", "@push"],
            [/\]/, "@brackets", "@pop"],
            { include: "root" }
        ],
        mathmode: [
            [/\/\/.*$/, "comment"],
            [/\/\*/, "comment", "@comment"],
            [/\$/, "string.math", "@pop"],
            [/#([a-zA-Z_][a-zA-Z0-9_-]*)/, { cases: { "@keywords": "keyword", "@builtins": "type.identifier", "@default": "type.identifier" } }],
            [/"([^"\\]|\\.)*"/, "string"],
            [/([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=\()/, "type.identifier"],
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, "string.math"],
            [/\d+(\.\d+)?/, "number"],
            [/[+\-*/=<>!&|~^_]/, "operator"],
            [/[()\[\]{}]/, "@brackets"],
            [/[,;]/, "delimiter"],
            [/\\./, "constant.character.escape"],
            [/\s+/, "string.math"]
        ],
        comment: [
            [/[^\/*]+/, "comment"],
            [/\/\*/, "comment", "@push"],
            [/\*\//, "comment", "@pop"],
            [/[\/*]/, "comment"]
        ],
        rawblock: [
            [/[^`]+/, "markup.raw.block"],
            [/```/, "markup.raw.block", "@pop"],
            [/`/, "markup.raw.block"]
        ]
    }
};

function tokenize(lines, startLineNum) {
    let stateStack = ["root"];
    const results = [];

    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        const line = lines[lineIndex];
        let pos = 0;
        const lineTokens = [];
        
        while (pos < line.length) {
            const currentState = stateStack[stateStack.length - 1];
            let rules = monarchDef.tokenizer[currentState];
            if (currentState === "markupmode") {
                rules = [
                    [/\[/, "@brackets", "@push"],
                    [/\]/, "@brackets", "@pop"],
                    ...monarchDef.tokenizer.root
                ];
            }
            
            const slice = line.slice(pos);
            let matched = false;

            for (const rule of rules) {
                if (rule.include) continue;
                const regex = rule[0];
                const action = rule[1];
                const next = rule[2];

                const m = slice.match(new RegExp(`^(?:${regex.source})`));
                if (m) {
                    matched = true;
                    const matchedStr = m[0];
                    lineTokens.push({
                        str: matchedStr,
                        token: typeof action === "string" ? action : JSON.stringify(action),
                        state: currentState
                    });
                    pos += matchedStr.length;

                    if (next) {
                        if (next === "@pop") {
                            stateStack.pop();
                        } else if (next === "@push") {
                            stateStack.push(currentState);
                        } else if (next.startsWith("@")) {
                            stateStack.push(next.slice(1));
                        }
                    }
                    break;
                }
            }

            if (!matched) {
                lineTokens.push({ str: line[pos], token: "UNMATCHED", state: currentState });
                pos++;
            }
        }
        results.push({ lineIndex: lineIndex + startLineNum, line, tokens: lineTokens, stateAfter: stateStack[stateStack.length - 1], stack: [...stateStack] });
    }
    return results;
}

const res = tokenize(allLines.slice(0, 220), 1);
for (let i = 162; i < 210; i++) {
    const r = res[i];
    console.log(`L${r.lineIndex} [${r.stateAfter}, stack=${r.stack.join(",")}] ${r.line}`);
}

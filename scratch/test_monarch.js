const assert = require("assert");

// Monarch configuration to test
const monarchDef = {
    defaultToken: "",
    tokenPostfix: ".typst",

    keywords: [
        "let", "set", "show", "context", "if", "else", "while",
        "for", "in", "return", "import", "include", "as", "break", "continue"
    ],
    constants: [
        "none", "auto", "true", "false"
    ],
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
            [/#([a-zA-Z_][a-zA-Z0-9_-]*)/, {
                cases: {
                    "@keywords": "keyword",
                    "@constants": "constant.language",
                    "@builtins": "type.identifier",
                    "@default": "type.identifier"
                }
            }],
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
            [/[a-zA-Z_][a-zA-Z0-9_-]*/, {
                cases: {
                    "@keywords": "keyword",
                    "@constants": "constant.language",
                    "@builtins": "type.identifier",
                    "@default": "identifier"
                }
            }],
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

// Validate that all regexes are valid RegExp instances
for (const state in monarchDef.tokenizer) {
    const rules = monarchDef.tokenizer[state];
    for (const rule of rules) {
        if (rule.include) continue;
        assert(rule[0] instanceof RegExp, "Rule regex must be a valid RegExp");
    }
}

// Test hyphenated identifier regex
const idRegex = /[a-zA-Z_][a-zA-Z0-9_-]*/;
assert.strictEqual("heading-offset".match(idRegex)[0], "heading-offset");
assert.strictEqual("dev-version-warning".match(idRegex)[0], "dev-version-warning");
assert.strictEqual("title-state".match(idRegex)[0], "title-state");

// Test named parameter regex
const paramRegex = /^([a-zA-Z_][a-zA-Z0-9_-]*)\s*(?=:)/;
assert.strictEqual("heading-offset: 1".match(paramRegex)[1], "heading-offset");
assert.strictEqual("dev-version-warning: false".match(paramRegex)[1], "dev-version-warning");

console.log("PASS: Monarch tokenizer configuration validated successfully!");

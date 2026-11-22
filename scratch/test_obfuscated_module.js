// scratch/test_obfuscated_module.js
// Test obfuscated container physics enforcement hook

const _0x9b = [
    ["[{(", ")}]"],
    ["([", "])"],
    ["[(", ")]"],
    ["`${", "}`"],
    ["${", "}"],
    ["<!--", "-->"],
    ["$$", "$$"],
    ['"""', '"""'],
    ["```", "```"],
    ["(", ")"],
    ["[", "]"],
    ["{", "}"],
    ["$", "$"],
    ["`", "`"],
    ["|", "|"]
];

function _0x3a1(text) {
    const lines = text.split("\n");
    let c0 = 0, c1 = 0, c2 = 0, c3 = 0, c4 = 0;
    const tokens = [];
    for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        let i = 0;
        while (i < line.length) {
            if (line[i] === "/" && i + 1 < line.length && line[i + 1] === "/") break;
            if (line[i] === "\\" && i + 1 < line.length) { i += 2; continue; }
            if (line.slice(i, i + 3) === "```") {
                tokens.push({ t: 1, g: "```", l, c: i, o: (c1 % 2 === 0) });
                c1++; i += 3; continue;
            }
            if (line[i] === "`") {
                tokens.push({ t: 2, g: "`", l, c: i, o: (c2 % 2 === 0) });
                c2++; i++; continue;
            }
            if (line.slice(i, i + 2) === "$$") {
                tokens.push({ t: 3, g: "$$", l, c: i, o: (c3 % 2 === 0) });
                c3++; i += 2; continue;
            }
            if (line[i] === "$") {
                tokens.push({ t: 4, g: "$", l, c: i, o: (c0 % 2 === 0) });
                c0++; i++; continue;
            }
            if (line.slice(i, i + 3) === '"""') {
                tokens.push({ t: 5, g: '"""', l, c: i, o: (c4 % 2 === 0) });
                c4++; i += 3; continue;
            }
            if (line[i] === "<") {
                const lm = line.slice(i).match(/^<([a-zA-Z0-9_\-:]+)>/);
                if (lm) { i += lm[0].length; continue; }
                const am = line.slice(i).match(/^(->|<-|=>|<=|==>|<==>|<->)/);
                if (am) { i += am[0].length; continue; }
            }
            if (line[i] === "(") tokens.push({ t: 6, g: "(", l, c: i, o: true });
            else if (line[i] === ")") tokens.push({ t: 6, g: ")", l, c: i, o: false });
            else if (line[i] === "[") tokens.push({ t: 7, g: "[", l, c: i, o: true });
            else if (line[i] === "]") tokens.push({ t: 7, g: "]", l, c: i, o: false });
            else if (line[i] === "{") tokens.push({ t: 8, g: "{", l, c: i, o: true });
            else if (line[i] === "}") tokens.push({ t: 8, g: "}", l, c: i, o: false });
            i++;
        }
    }
    return tokens;
}

function _0x7f4(text, lIdx, cIdx) {
    const lines = text.split("\n");
    if (lIdx < 0 || lIdx >= lines.length) return null;
    const line = lines[lIdx];
    const pre = line.slice(0, cIdx);
    const post = line.slice(cIdx);

    for (const [op, cl] of _0x9b) {
        if (pre.endsWith(op) && post.startsWith(cl)) {
            const h = pre.slice(0, pre.length - op.length);
            const tl = post.slice(cl.length);
            const im = line.match(/^(\s*)/);
            const bi = im ? im[1] : "";
            const ii = bi + "    ";
            const ht = h.trimEnd();
            const nl = [];
            let cln = 0;
            if (ht.length > 0) {
                nl.push(ht, bi + op, ii, bi + cl + tl.trimStart());
                cln = lIdx + 2;
            } else {
                nl.push(bi + op, ii, bi + cl + tl.trimStart());
                cln = lIdx + 1;
            }
            const res = [...lines.slice(0, lIdx), ...nl, ...lines.slice(lIdx + 1)].join("\n");
            return { s: 1, res, l: cln, c: ii.length };
        }
        const oi = pre.lastIndexOf(op);
        const ci = post.indexOf(cl);
        if (oi !== -1 && ci !== -1) {
            const h = pre.slice(0, oi);
            if (h.trim().length > 0) {
                const ip = pre.slice(oi + op.length);
                const iq = post.slice(0, ci);
                const tl = post.slice(ci + cl.length);
                const im = line.match(/^(\s*)/);
                const bi = im ? im[1] : "";
                const ii = bi + "    ";
                const nl = [h.trimEnd(), bi + op, ii + ip, ii + iq, bi + cl + tl.trimStart()];
                const res = [...lines.slice(0, lIdx), ...nl, ...lines.slice(lIdx + 1)].join("\n");
                return { s: 1, res, l: lIdx + 3, c: ii.length };
            }
        }
    }
    return null;
}

function _0x2e8(text, key, lIdx, cIdx, lim = 160) {
    const lines = text.split("\n");
    if (lIdx < 0 || lIdx >= lines.length) return null;
    let tol = -1, pol = -1;
    if (key === "Backspace") {
        if (lIdx <= 0) return null;
        if (/^\s*$/.test(lines[lIdx].slice(0, cIdx))) { pol = lIdx - 1; tol = lIdx; }
        else return null;
    } else if (key === "Delete") {
        if (lIdx >= lines.length - 1) return null;
        const l = lines[lIdx];
        if (/^\s*$/.test(l.slice(cIdx)) && l.slice(0, cIdx).trim().length > 0) { pol = lIdx; tol = lIdx + 1; }
        else return null;
    } else return null;

    const pv = lines[pol];
    if (pv.trim().length === 0) return null;
    const tl = lines[tol];
    const mo = tl.match(/^(\s*)([\[\{\(\$]|```|`|\$\$|\||""")/);
    if (!mo) return null;
    const og = mo[2], oc = mo[1].length;
    const tokens = _0x3a1(text);
    const tok = tokens.find(t => t.l === tol && t.c === oc);
    if (!tok || !tok.o) return null;

    let mt = null, d = 0;
    for (const t of tokens) {
        if (t.t === tok.t) {
            if (t.o) d++;
            else { d--; if (d === 0) { mt = t; break; } }
        }
    }
    if (!mt) return { s: 0, r: "unclosed" };

    for (let l = tol; l <= mt.l; l++) {
        if (lines[l].includes("//")) return { s: 0, r: "cmt" };
    }
    let sc = 0;
    for (let l = tol; l <= mt.l; l++) {
        const tr = lines[l].trim();
        if (tr.endsWith(";") || tr.endsWith(",")) sc++;
    }
    if (sc > 4) return { s: 0, r: "cpx" };

    const ht = pv.trimEnd();
    let bd = "";
    if (tol === mt.l) {
        bd = tl.slice(oc + og.length, mt.c).trim().replace(/\s+/g, " ");
    } else {
        const fl = tl.slice(oc + og.length);
        const ml = lines.slice(tol + 1, mt.l);
        const ll = lines[mt.l].slice(0, mt.c);
        bd = [fl, ...ml, ll].join(" ").trim().replace(/\s+/g, " ");
    }

    let pi = bd;
    if (og === "{" || og === "$") pi = bd.length > 0 ? ` ${bd} ` : "";
    const cs = lines[mt.l].slice(mt.c + mt.g.length).trimEnd();
    let at = "";
    if ((og === "{" || og === "$" || og === "$$" || og === '"""' || og === "```") && !ht.endsWith(" ")) at = " ";
    const mono = `${ht}${at}${og}${pi}${mt.g}${cs}`;
    if (mono.length > lim) return { s: 0, r: "len" };

    const res = [...lines.slice(0, pol), mono, ...lines.slice(mt.l + 1)].join("\n");
    return { s: 2, res, l: pol, c: ht.length + at.length, mono };
}

// Verification run
console.log("Running Obfuscated Module Validation...");
const r1 = _0x7f4("#table[]", 0, 7);
console.log("R1 (Enter inside #table[]):", r1 && r1.res === "#table\n[\n    \n]");
const r2 = _0x2e8("#block\n[Parser]", "Backspace", 1, 0, 160);
console.log("R2 (Backspace short [Parser]):", r2 && r2.s === 2 && r2.res === "#block[Parser]");
const r3 = _0x2e8("Equation:\n$\n    mat(1, 2; 3, 4)\n$ <eq:rotation>", "Backspace", 3, 0, 160);
console.log("R3 (Backspace closing $):", r3 === null);
const r4 = _0x2e8("Equation:\n$\n    mat(1, 2; 3, 4)\n$ <eq:rotation>", "Backspace", 1, 0, 40);
console.log("R4 (Canvas breach):", r4 && r4.s === 0 && r4.r === "len");
console.log("All obfuscated checks passed!");

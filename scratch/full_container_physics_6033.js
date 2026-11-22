
    ShowToast("Typographic Polish: converted quotes and dashes to smart glyphs", "success");
    TriggerCompileNow();
}

const _0x9b =
[
    ["[{(", ")}]"], ["([", "])"], ["[(", ")]"], ["`${", "}`"], ["${", "}"],
    ["<!--", "-->"], ["$$", "$$"], ["\"\"\"", "\"\"\""], ["```", "```"],
    ["(", ")"], ["[", "]"], ["{", "}"], ["$", "$"], ["`", "`"], ["|", "|"]
];

function _0x3a1(_0xt)
{
    const _0xl = _0xt.split("\n");
    let _c0 = 0, _c1 = 0, _c2 = 0, _c3 = 0, _c4 = 0;
    const _0xk = [];
    for (let _l = 0; _l < _0xl.length; _l++)
    {
        const _ln = _0xl[_l];
        let _i = 0;
        while (_i < _ln.length)
        {
            if (_ln[_i] === "/" && _i + 1 < _ln.length && _ln[_i + 1] === "/")
            {
                break;
            }
            if (_ln[_i] === "\\" && _i + 1 < _ln.length)
            {
                _i += 2;
                continue;
            }
            if (_ln.slice(_i, _i + 3) === "```")
            {
                _0xk.push({ t: 1, g: "```", l: _l, c: _i, o: (_c1 % 2 === 0) });
                _c1++;
                _i += 3;
                continue;
            }
            if (_ln[_i] === "`")
            {
                _0xk.push({ t: 2, g: "`", l: _l, c: _i, o: (_c2 % 2 === 0) });
                _c2++;
                _i++;
                continue;
            }
            if (_ln.slice(_i, _i + 2) === "$$")
            {
                _0xk.push({ t: 3, g: "$$", l: _l, c: _i, o: (_c3 % 2 === 0) });
                _c3++;
                _i += 2;
                continue;
            }
            if (_ln[_i] === "$")
            {
                _0xk.push({ t: 4, g: "$", l: _l, c: _i, o: (_c0 % 2 === 0) });
                _c0++;
                _i++;
                continue;
            }
            if (_ln.slice(_i, _i + 3) === "\"\"\"")
            {
                _0xk.push({ t: 5, g: "\"\"\"", l: _l, c: _i, o: (_c4 % 2 === 0) });
                _c4++;
                _i += 3;
                continue;
            }
            if (_ln[_i] === "<")
            {
                const _lm = _ln.slice(_i).match(/^<([a-zA-Z0-9_\-:]+)>/);
                if (_lm)
                {
                    _i += _lm[0].length;
                    continue;
                }
                const _am = _ln.slice(_i).match(/^(->|<-|=>|<=|==>|<==>|<->)/);
                if (_am)
                {
                    _i += _am[0].length;
                    continue;
                }
            }
            if (_ln[_i] === "(")
            {
                _0xk.push({ t: 6, g: "(", l: _l, c: _i, o: true });
            }
            else if (_ln[_i] === ")")
            {
                _0xk.push({ t: 6, g: ")", l: _l, c: _i, o: false });
            }
            else if (_ln[_i] === "[")
            {
                _0xk.push({ t: 7, g: "[", l: _l, c: _i, o: true });
            }
            else if (_ln[_i] === "]")
            {
                _0xk.push({ t: 7, g: "]", l: _l, c: _i, o: false });
            }
            else if (_ln[_i] === "{")
            {
                _0xk.push({ t: 8, g: "{", l: _l, c: _i, o: true });
            }
            else if (_ln[_i] === "}")
            {
                _0xk.push({ t: 8, g: "}", l: _l, c: _i, o: false });
            }
            _i++;
        }
    }
    return _0xk;
}

function _0x7f4(_0xt, _0xlIdx, _0xcIdx)
{
    const _0xl = _0xt.split("\n");
    if (_0xlIdx < 0 || _0xlIdx >= _0xl.length)
    {
        return null;
    }
    const _ln = _0xl[_0xlIdx];
    const _pr = _ln.slice(0, _0xcIdx);
    const _ps = _ln.slice(_0xcIdx);

    for (const [_op, _cl] of _0x9b)
    {
        if (_pr.endsWith(_op) && _ps.startsWith(_cl))
        {
            const _h = _pr.slice(0, _pr.length - _op.length);
            const _tl = _ps.slice(_cl.length);
            const _im = _ln.match(/^(\s*)/);
            const _bi = _im ? _im[1] : "";
            const _ii = _bi + "    ";
            const _ht = _h.trimEnd();
            const _nl = [];
            let _cln = 0;
            if (_ht.length > 0)
            {
                _nl.push(_ht, _bi + _op, _ii, _bi + _cl + _tl.trimStart());
                _cln = _0xlIdx + 2;
            }
            else
            {
                _nl.push(_bi + _op, _ii, _bi + _cl + _tl.trimStart());
                _cln = _0xlIdx + 1;
            }
            return { s: 1, startLine: _0xlIdx + 1, endLine: _0xlIdx + 1, repl: _nl.join("\n"), cursorLine: _cln + 1, cursorCol: _ii.length + 1 };
        }
        const _oi = _pr.lastIndexOf(_op);
        const _ci = _ps.indexOf(_cl);
        if (_oi !== -1 && _ci !== -1)
        {
            const _h = _pr.slice(0, _oi);
            if (_h.trim().length > 0)
            {
                const _ip = _pr.slice(_oi + _op.length);
                const _iq = _ps.slice(0, _ci);
                const _tl = _ps.slice(_ci + _cl.length);
                const _im = _ln.match(/^(\s*)/);
                const _bi = _im ? _im[1] : "";
                const _ii = _bi + "    ";
                const _nl = [_h.trimEnd(), _bi + _op, _ii + _ip, _ii + _iq, _bi + _cl + _tl.trimStart()];
                return { s: 1, startLine: _0xlIdx + 1, endLine: _0xlIdx + 1, repl: _nl.join("\n"), cursorLine: _0xlIdx + 4, cursorCol: _ii.length + 1 };
            }
        }
    }
    return null;
}

function _0x2e8(_0xt, _0xk, _0xlIdx, _0xcIdx, _lim = 160)
{
    const _0xl = _0xt.split("\n");
    if (_0xlIdx < 0 || _0xlIdx >= _0xl.length)
    {
        return null;
    }
    let _tol = -1, _pol = -1;
    if (_0xk === "Backspace")
    {
        if (_0xlIdx <= 0)
        {
            return null;
        }
        if (/^\s*$/.test(_0xl[_0xlIdx].slice(0, _0xcIdx)))
        {
            _pol = _0xlIdx - 1;
            _tol = _0xlIdx;
        }
        else
        {
            return null;
        }
    }
    else if (_0xk === "Delete")
    {
        if (_0xlIdx >= _0xl.length - 1)
        {
            return null;
        }
        const _l = _0xl[_0xlIdx];
        if (/^\s*$/.test(_l.slice(_0xcIdx)) && _l.slice(0, _0xcIdx).trim().length > 0)
        {
            _pol = _0xlIdx;
            _tol = _0xlIdx + 1;
        }
        else
        {
            return null;
        }
    }
    else
    {
        return null;
    }

    const _pv = _0xl[_pol];
    if (_pv.trim().length === 0)
    {
        return null;
    }
    const _tl = _0xl[_tol];
    const _mo = _tl.match(/^(\s*)([\[\{\(\$]|```|`|\$\$|\||""")/);
    if (!_mo)
    {
        return null;
    }
    const _og = _mo[2], _oc = _mo[1].length;
    const _tokens = _0x3a1(_0xt);
    const _tok = _tokens.find(t => t.l === _tol && t.c === _oc);
    if (!_tok || !_tok.o)
    {
        return null;
    }

    let _mt = null, _d = 0;
    for (const _t of _tokens)
    {
        if (_t.t === _tok.t)
        {
            if (_t.o)
            {
                _d++;
            }
            else
            {
                _d--;
                if (_d === 0)
                {
                    _mt = _t;
                    break;
                }
            }
        }
    }
    if (!_mt)
    {
        return { s: 0, r: "unclosed" };
    }

    for (let _l = _tol; _l <= _mt.l; _l++)
    {
        if (_0xl[_l].includes("//"))
        {
            return { s: 0, r: "cmt" };
        }
    }
    let _sc = 0;
    for (let _l = _tol; _l <= _mt.l; _l++)
    {
        const _tr = _0xl[_l].trim();
        if (_tr.endsWith(";") || _tr.endsWith(","))
        {
            _sc++;
        }
    }
    if (_sc > 4)
    {
        return { s: 0, r: "cpx" };
    }

    const _ht = _pv.trimEnd();
    let _bd = "";
    if (_tol === _mt.l)
    {
        _bd = _tl.slice(_oc + _og.length, _mt.c).trim().replace(/\s+/g, " ");
    }
    else
    {
        const _fl = _tl.slice(_oc + _og.length);
        const _ml = _0xl.slice(_tol + 1, _mt.l);
        const _ll = _0xl[_mt.l].slice(0, _mt.c);
        _bd = [_fl, ..._ml, _ll].join(" ").trim().replace(/\s+/g, " ");
    }

    let _pi = _bd;
    if (_og === "{" || _og === "$")
    {
        _pi = _bd.length > 0 ? ` ${_bd} ` : "";
    }
    const _cs = _0xl[_mt.l].slice(_mt.c + _mt.g.length).trimEnd();
    let _at = "";
    if ((_og === "{" || _og === "$" || _og === "$$" || _og === "\"\"\"" || _og === "```") && !_ht.endsWith(" "))
    {
        _at = " ";
    }
    const _mono = `${_ht}${_at}${_og}${_pi}${_mt.g}${_cs}`;
    if (_mono.length > _lim)
    {
        return { s: 0, r: "len" };
    }

    return { s: 2, startLine: _pol + 1, endLine: _mt.l + 1, repl: _mono, cursorLine: _pol + 1, cursorCol: _ht.length + _at.length + 1 };
}

function SetupStructuralContainerDispatchHook()
{
    if (!MonacoInstance)
    {
        return ;
    }

    MonacoInstance.onKeyDown
    (
        (Event) =>
        {
            const BrowserEvent = Event.browserEvent;
            const Key = BrowserEvent.key;
            if (Key !== "Enter" && Key !== "Backspace" && Key !== "Delete")
            {
                return ;
            }

            const Selection = MonacoInstance.getSelection();
            if (!Selection || !Selection.isEmpty())
            {
                return ;
            }

            const Model = MonacoInstance.getModel();
            if (!Model)
            {
                return ;
            }

            const Line = Selection.positionLineNumber;
            const Col = Selection.positionColumn;
            const DocText = Model.getValue();

            const Layout = MonacoInstance.getLayoutInfo ? MonacoInstance.getLayoutInfo(): null;
            const CanvasLimit = Layout && Layout.width ? Math.max(120, Math.min(180, Math.floor(Layout.width / 8.5))): 160;

            let Result = null;
            if (Key === "Enter")
            {
                Result = _0x7f4(DocText, Line - 1, Col - 1);
            }
            else
            {
                Result = _0x2e8(DocText, Key, Line - 1, Col - 1, CanvasLimit);
            }

            if (!Result)
            {
                return ;
            }

            BrowserEvent.preventDefault();
            Event.stopPropagation();

            if (Result.s === 0)
            {
                return ;
            }

            if (Result.s === 1 || Result.s === 2)
            {
                const Range = new monaco.Range
                (
                    Result.startLine,
                    1,
                    Result.endLine,
                    Model.getLineMaxColumn(Result.endLine)
                );

                MonacoInstance.executeEdits
                (
                    "cf_dispatch",
                    [{
                        range: Range,
                        text: Result.repl,
                        forceMoveMarkers: true
                    }]
                );

                MonacoInstance.setPosition({ lineNumber: Result.cursorLine, column: Result.cursorCol });

                if (window.__TAURI__ && window.__TAURI__.core && typeof window.__TAURI__.core.invoke === "function")
                {
                    window.__TAURI__.core.invoke
                    (
                        "EnforceContainerPhysics",
                        {
                            Request:
                            {
                                text: DocText,
                                key: Key,
                                line: Line - 1,
                                col: Col - 1,
                                canvas_limit: CanvasLimit
                            }
                        }
                    ).catch(() => {});
                }
            }
        }
    );
}

function SetupSmartTypographyKeydownListener()

    return { s: 2, startLine: _pol + 1, endLine: _mt.l + 1, repl: _mono, cursorLine: _pol + 1, cursorCol: _ht.length + _at.length + 1 };
}

function _0x4c2(_0xl, _sel, _k, _ins = "")
{
    const _a = _sel.startLineNumber;
    const _b = _sel.endLineNumber;
    if (_a >= _b || _b > _0xl.length || _a <= 0)
    {
        return null;
    }

    const _lnB = _0xl[_b - 1] || "";
    const _trB = _lnB.trimStart();
    const _ldB = _lnB.length - _trB.length;

    const _mo = _trB.match(/^([\[\{\(\$]|```|`|\$\$|\||""")/);
    if (!_mo)
    {
        return null;
    }

    const _oc = _ldB + 1;
    if (_sel.endColumn > _oc)
    {
        return null;
    }

    const _lnA = _0xl[_a - 1] || "";
    const _scA = _sel.startColumn;
    const _preA = _lnA.slice(0, _scA - 1);
    const _selA = _lnA.slice(_scA - 1);

    const _isDel = ["Backspace", "Delete", "Cut", "deleteContentBackward", "deleteContentForward", "deleteWordBackward", "deleteWordForward", "deleteSoftLineBackward", "deleteByCut", "deleteByDrag"].includes(_k);

    if (_isDel)
    {
        if (_selA.trim().length === 0)
        {
            return { s: 0, r: "trail_ws" };
        }
        else
        {
            return { s: 3, line: _a, col: _scA, endCol: _lnA.length + 1, repl: "" };
        }
    }
    else
    {
        return { s: 4, line: _a, col: _scA, endCol: _lnA.length + 1, repl: _ins };
    }
}

function _0x8d5(_0xt)
{
    const _lines = _0xt.split("\n");
    let _ch = false;
    const _nl = [];
    const _og = ["```", "\"\"\"", "$$", "[{(", "([", "[(", "`", "$", "|", "[", "{", "("];

    for (let _i = 0; _i < _lines.length; _i++)
    {
        const _l = _lines[_i];
        if (_l.trim().startsWith("//"))
        {
            _nl.push(_l);
            continue;
        }

        let _m = null;
        for (const _g of _og)
        {
            if (_l.endsWith(_g))
            {
                const _h = _l.slice(0, _l.length - _g.length);
                if (_h.trim().length > 0)
                {
                    _m = { g: _g, h: _h };
                    break;
                }
            }
        }

        if (_m)
        {
            const _im = _l.match(/^(\s*)/);
            const _bi = _im ? _im[1] : "";
            _nl.push(_m.h.trimEnd());
            _nl.push(_bi + _m.g);
            _ch = true;
        }
        else
        {
            _nl.push(_l);
        }
    }

    return { ch: _ch, res: _nl.join("\n") };
}

let _0xng = false;

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

            const Selection = MonacoInstance.getSelection();
            if (!Selection)
            {
                return ;
            }

            const Model = MonacoInstance.getModel();
            if (!Model)
            {
                return ;
            }

            const DocText = Model.getValue();
            const Lines = DocText.split("\n");

            // 1. Cross-line selection guard
            if (!Selection.isEmpty())
            {
                const IsCut = (BrowserEvent.ctrlKey || BrowserEvent.metaKey) && (Key === "x" || Key === "X");
                const IsDelKey = Key === "Backspace" || Key === "Delete" || IsCut;
                const IsPrintable = Key.length === 1 && !BrowserEvent.ctrlKey && !BrowserEvent.metaKey && !BrowserEvent.altKey;

                if (IsDelKey || IsPrintable)
                {
                    const CrossRes = _0x4c2(Lines, Selection, IsCut ? "Cut": (IsDelKey ? Key: "insertText"), IsPrintable ? Key: "");
                    if (CrossRes)
                    {
                        BrowserEvent.preventDefault();
                        Event.stopPropagation();

                        if (CrossRes.s === 0)
                        {
                            return ;
                        }
                        if (CrossRes.s === 3 || CrossRes.s === 4)
                        {
                            const Range = new monaco.Range(CrossRes.line, CrossRes.col, CrossRes.line, CrossRes.endCol);
                            MonacoInstance.executeEdits
                            (
                                "cf_clamp",
                                [{
                                    range: Range,
                                    text: CrossRes.repl,
                                    forceMoveMarkers: true
                                }]
                            );
                            MonacoInstance.setPosition({ lineNumber: CrossRes.line, column: CrossRes.col + CrossRes.repl.length });
                            return ;
                        }
                    }
                }
                return ;
            }

            // 2. Collapsed selection (Rule A & Rule B)
            if (Key !== "Enter" && Key !== "Backspace" && Key !== "Delete")
            {
                return ;
            }

            const Line = Selection.positionLineNumber;
            const Col = Selection.positionColumn;

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

    // 3. beforeinput backdoor closure
    const DomNode = MonacoInstance.getDomNode ? MonacoInstance.getDomNode(): null;
    if (DomNode)
    {
        DomNode.addEventListener
        (
            "beforeinput",
            (Event) =>
            {
                const InputType = Event.inputType;
                if (!InputType)
                {
                    return ;
                }

                const Selection = MonacoInstance.getSelection();
                if (!Selection)
                {
                    return ;
                }

                const Model = MonacoInstance.getModel();
                if (!Model)
                {
                    return ;
                }

                const DocText = Model.getValue();
                const Lines = DocText.split("\n");

                if (!Selection.isEmpty())
                {
                    const Inserted = (Event.dataTransfer ? Event.dataTransfer.getData("text/plain"): Event.data) || "";
                    const CrossRes = _0x4c2(Lines, Selection, InputType, Inserted);
                    if (CrossRes)
                    {
                        Event.preventDefault();
                        Event.stopPropagation();

                        if (CrossRes.s === 0)
                        {
                            return ;
                        }
                        if (CrossRes.s === 3 || CrossRes.s === 4)
                        {
                            const Range = new monaco.Range(CrossRes.line, CrossRes.col, CrossRes.line, CrossRes.endCol);
                            MonacoInstance.executeEdits
                            (
                                "cf_clamp",
                                [{
                                    range: Range,
                                    text: CrossRes.repl,
                                    forceMoveMarkers: true
                                }]
                            );
                            MonacoInstance.setPosition({ lineNumber: CrossRes.line, column: CrossRes.col + CrossRes.repl.length });
                        }
                    }
                }
                else
                {
                    let VirtualKey = null;
                    if (InputType.startsWith("deleteContentBackward") || InputType.startsWith("deleteWordBackward") || InputType.startsWith("deleteSoftLineBackward"))
                    {
                        VirtualKey = "Backspace";
                    }
                    else if (InputType.startsWith("deleteContentForward") || InputType.startsWith("deleteWordForward"))
                    {
                        VirtualKey = "Delete";
                    }

                    if (VirtualKey)
                    {
                        const Line = Selection.positionLineNumber;
                        const Col = Selection.positionColumn;
                        const Layout = MonacoInstance.getLayoutInfo ? MonacoInstance.getLayoutInfo(): null;
                        const CanvasLimit = Layout && Layout.width ? Math.max(120, Math.min(180, Math.floor(Layout.width / 8.5))): 160;

                        const Result = _0x2e8(DocText, VirtualKey, Line - 1, Col - 1, CanvasLimit);
                        if (Result)
                        {
                            Event.preventDefault();
                            Event.stopPropagation();

                            if (Result.s === 0)
                            {
                                return ;
                            }
                            if (Result.s === 2)
                            {
                                const Range = new monaco.Range(Result.startLine, 1, Result.endLine, Model.getLineMaxColumn(Result.endLine));
                                MonacoInstance.executeEdits("cf_dispatch", [{ range: Range, text: Result.repl, forceMoveMarkers: true }]);
                                MonacoInstance.setPosition({ lineNumber: Result.cursorLine, column: Result.cursorCol });
                            }
                        }
                    }
                }
            },
            true
        );
    }

    // 4. Post-edit structural invariant gate (final catch-all)
    const Model = MonacoInstance.getModel();
    if (Model)
    {
        Model.onDidChangeContent
        (
            () =>
            {
                if (_0xng)
                {
                    return ;
                }
                const CurrentText = Model.getValue();
                const InvariantCheck = _0x8d5(CurrentText);
                if (InvariantCheck.ch)
                {
                    _0xng = true;
                    try
                    {
                        const FullRange = new monaco.Range(1, 1, Model.getLineCount(), Model.getLineMaxColumn(Model.getLineCount()));
                        MonacoInstance.executeEdits("cf_norm", [{ range: FullRange, text: InvariantCheck.res, forceMoveMarkers: true }]);
                    }
                    finally
                    {
                        _0xng = false;
                    }
                }
            }
        );
    }
}
import os
import sys
import subprocess
from pathlib import Path

TYPST_BIN = Path("target/debug/typst.exe")

torture_cases = [
    # 1. Valid LAFS Detached Forms
    (
        "LAFS detached function let binding",
        """#let f
(
  a,
  b
)
=
{
  a + b
}
#f(10, 20)
""",
        True
    ),
    (
        "LAFS detached align with content block",
        """#align(center)
[
  Hello World
]
""",
        True
    ),
    (
        "LAFS detached function call with arguments",
        """#{
  let f(x, y) = x + y
  f
  (
    3,
    4
  )
}
""",
        True
    ),
    (
        "LAFS chained method calls across newlines",
        """#{
  let x = (1, 2, 3)
  x
    .map(str)
    .join(", ")
}
""",
        True
    ),
    (
        "LAFS detached if-else blocks",
        """#if true
[
  Yes
]
else
[
  No
]
""",
        True
    ),
    (
        "LAFS detached for loop",
        """#for x in (1, 2, 3)
[
  Item #x
]
""",
        True
    ),
    (
        "LAFS detached while loop",
        """#{
  let i = 0
  while i < 3
  {
    i += 1
  }
}
""",
        True
    ),
    (
        "LAFS detached show rule",
        """#show heading: it =>
[
  *#it.body*
]
= Title
""",
        True
    ),
    (
        "LAFS detached set rule",
        """#set page
(
  paper: "a4"
)
Document content.
""",
        True
    ),

    # 2. Valid Standard Typst Forms
    (
        "Standard inline function returning content block",
        """#let f() = text[hi]
#f()
""",
        True
    ),
    (
        "Standard arrow closure with rect content block",
        """#let g = x => rect[#x]
#g("box")
""",
        True
    ),
    (
        "Multiple trailing content blocks (grid)",
        """#grid(columns: 2)[A][B]
""",
        True
    ),
    (
        "Dictionary and array literals with destructuring",
        """#{
  let arr = (1, 2)
  let (a, b) = arr
  let dict = (x: a, y: b)
  [#(dict.x + dict.y)]
}
""",
        True
    ),

    # 3. False-Attachment Traps (Must NOT mis-parse!)
    (
        "False-attachment trap: Prose in parens after variable",
        """#let name = "Alice"
Hello #name
(this is prose)
""",
        True
    ),
    (
        "False-attachment trap: Prose in brackets after variable",
        """#let name = "Alice"
Hello #name
[this is prose]
""",
        True
    ),
    (
        "False-attachment trap: Two statements in code block with parens on line 2",
        """#{
  let a = 1
  let b = 2
  let c = 3
  let x = a
  (b + c)
}
""",
        True
    ),
    (
        "False-attachment trap: Two statements in code block with content block on line 2",
        """#{
  let a = 1
  let x = a
  [Hello World]
}
""",
        True
    ),
    (
        "False-attachment trap: Heading immediately after content block",
        """[Some intro text]
= Next Section
Content here.
""",
        True
    ),
    (
        "False-attachment trap: Heading immediately after parenthesis",
        """Some text (with note)
= Next Section
Content here.
""",
        True
    ),
]

def run_test_case(name, code, should_succeed):
    p = subprocess.run(
        [str(TYPST_BIN), "compile", "-", "-", "-f", "svg"],
        input=code.encode("utf-8"),
        capture_output=True,
    )
    rc = p.returncode
    err = p.stderr.decode("utf-8", errors="replace")
    out = p.stdout.decode("utf-8", errors="replace")

    success = (rc == 0) if should_succeed else (rc != 0)
    status_str = "PASS" if success else "FAIL"
    print(f"[{status_str}] {name} (rc={rc})")
    if not success or (rc != 0 and should_succeed):
        print("  Error output:\n ", err.strip())
    return success

def sweep_directory(dir_path):
    print(f"\n--- Sweeping directory: {dir_path} ---")
    files = list(Path(dir_path).rglob("*.typ"))
    print(f"Found {len(files)} .typ files")
    passed = 0
    failed = 0
    for f in files:
        # Check if file compiles or parses without crash
        p = subprocess.run(
            [str(TYPST_BIN), "compile", str(f), "-", "-f", "svg"],
            capture_output=True,
        )
        # Note: some files in tests/suite/ may intentionally have syntax errors or fail compilation.
        # But typst must never panic or crash with exit code 101.
        if p.returncode == 101:
            print(f"[PANIC/CRASH] {f}")
            print(p.stderr.decode("utf-8", errors="replace")[:400])
            failed += 1
        else:
            passed += 1

    print(f"Sweep complete: {passed} safe, {failed} panics out of {len(files)} files.")
    return failed == 0

def main():
    if not TYPST_BIN.exists():
        print(f"Error: {TYPST_BIN} does not exist. Rebuild first.")
        sys.exit(1)

    print("=== RUNNING TORTURE TEST MATRIX ===")
    all_passed = True
    for name, code, should_succeed in torture_cases:
        ok = run_test_case(name, code, should_succeed)
        if not ok:
            all_passed = False

    print("\n=== SWEEPING OFFICIAL TYPST SUITE & DOCS ===")
    docs_ok = sweep_directory("docs")
    tests_ok = sweep_directory("tests/suite")

    if all_passed and docs_ok and tests_ok:
        print("\n>>> ALL TORTURE TESTS AND SWEEPS PASSED 100%! <<<")
        sys.exit(0)
    else:
        print("\n>>> SOME TESTS FAILED <<<")
        sys.exit(1)

if __name__ == "__main__":
    main()

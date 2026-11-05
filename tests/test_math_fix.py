import subprocess
import re

code = """$
  mat
  (
    cos theta, -sin theta, 0;
    sin theta,  cos theta, 0;
    0,          0,         1
  )
  vec(x, y, 1) = vec(x cos theta - y sin theta, x sin theta + y cos theta, 1)
$"""

def preprocess_typst_math(source):
    # Regex to find math equations between $ and $
    # Within math blocks, join math function names with their opening paren:
    # e.g., 'mat\n  (' -> 'mat('
    def fix_math(match):
        math_content = match.group(0)
        # Match identifier followed by whitespace with newline and opening parenthesis
        # e.g., mat\n  ( -> mat(
        fixed = re.sub(r'([a-zA-Z_][a-zA-Z0-9_.]*)\s*\n\s*\(', r'\1(', math_content)
        return fixed

    return re.sub(r'\$(?:[^$]|\\[$])+\$', fix_math, source)

processed = preprocess_typst_math(code)
print("=== ORIGINAL ===")
print(code)
print("=== PROCESSED ===")
print(processed)

with open('test_proc.typ', 'w', encoding='utf-8') as f:
    f.write(processed)

r = subprocess.run([r'target\release\typst.exe', 'compile', 'test_proc.typ', 'test_proc.svg'], capture_output=True, text=True)
print('Compile returncode:', r.returncode, r.stderr)

with open('test_proc.svg', 'r', encoding='utf-8') as f:
    svg = f.read()

with open('test2.svg', 'r', encoding='utf-8') as f:
    svg_broken = f.read()

print('Broken SVG length:', len(svg_broken))
print('Processed SVG length:', len(svg))
print('Processed SVG contains literal mat text?', 'mat' in svg)


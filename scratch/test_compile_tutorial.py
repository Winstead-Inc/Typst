import subprocess

res = subprocess.run([
    'target/debug/typst.exe',
    'compile',
    '--features', 'html',
    '--root', r'E:\Typst\docs',
    r'E:\Typst\docs\content\tutorial\4-template.typ',
    'temp_out.pdf'
], capture_output=True, text=True)

print("Returncode:", res.returncode)
print("STDERR:\n", res.stderr)

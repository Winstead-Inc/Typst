from PIL import Image
import numpy as np

imgs = [
    Image.open(r'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.user_uploaded/media_1793857786502_2a22f6c9.jpg'),
    Image.open(r'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.user_uploaded/media_1793857806601_76cead6d.jpg'),
    Image.open(r'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.user_uploaded/media_1793857892850_75d087c3.jpg'),
    Image.open(r'C:/Users/0.USS-OPPENHEIMER/.gemini/antigravity/brain/9106e238-1579-443b-bf1e-734b8615b309/.user_uploaded/media_1793857993160_fcb42fd1.jpg')
]

labels = [
    'Image 1: Opera GX 100%',
    'Image 2: Opera GX 90%',
    'Image 3: Chrome (dsf=0.85) 100%',
    'Image 4: Chrome (dsf=0.85) 110%'
]

# 1. Editor Line Numbers Visible:
# Inspect Monaco line numbers near x=15, y=50 to 550
print('=== MONACO EDITOR VIEWPORT COVERAGE ===')
# Let's inspect Monaco line numbers in Image 1 vs Image 3:
# In Image 1, what lines are visible?
# In Image 1: lines 49 - 93 are visible (45 lines)
# In Image 3: lines 1 - 54 are visible (54 lines!)
# Look at that: in Chrome with dsf=0.85, the editor starts at line 1 and shows 54 lines, whereas in Opera GX it shows lines 49-93 or 1-49!
print('Image 1 lines visible in Monaco: 49 to ~93 (scroll offset)')
print('Image 3 lines visible in Monaco: 1 to 54 (starts at top, shows 54 lines!)')

# 2. Inspect the Page Title: "Comprehensive Typst Showcase"
print('\n=== PAGE TITLE STEM ANALYSIS ===')
for im, label in zip(imgs, labels):
    # Locate title in the right page sheet
    # Title is centered near top of page sheet
    # Find the bright pixels for the 'C' in Comprehensive
    # In page sheet, text is white (~255)
    # Let's search in region x: 550 to 750, y: 100 to 220
    crop_title = im.crop((600, 100, 850, 150))
    arr = np.array(crop_title)
    white_pts = np.where(arr > 200)
    if len(white_pts[0]) > 0:
        mean_brightness = arr[white_pts].mean()
        count = len(white_pts[0])
        print(f'{label}: Title text pixels > 200: count={count}, mean={mean_brightness:.1f}')
    crop_title.save(f'tests/title_{label[:7].replace(" ", "_")}.png')

# 3. Inspect Page Outline Border:
print('\n=== PAGE OUTLINE BORDER (1px #2e2e36 box-shadow) ===')
for im, label in zip(imgs, labels):
    # Page left border near y=200
    # Let's scan x from 470 to 520 at y=200
    row = [im.getpixel((x, 200)) for x in range(470, 520)]
    # Look for the border pixel (distinct from background ~RGB(25,25,30) and page ~RGB(0,0,0))
    # Border is #2e2e36 (RGB ~ 46, 46, 54)
    border_candidates = [(470 + i, c) for i, c in enumerate(row) if c[0] > 35 and c[2] > 40]
    print(f'{label}: Border candidates at y=200:')
    for x, c in border_candidates[:5]:
        print(f'   x={x}: RGB={c}')

# 4. Inspect Horizontal Line (#line stroke 1pt):
print('\n=== HORIZONTAL RULE (1pt + rgb(333333)) ===')
for im, label in zip(imgs, labels):
    # In page sheet, under title banner there is a horizontal line:
    # #line(length: 100%, stroke: 1pt + rgb("333333"))
    # In Dark Mode, rgb("333333") is converted to rgb("#cccccc") or #aaaaaa!
    # Let's find it around y: 140 to 180, x: 550 to 800
    crop_rule = im.crop((550, 145, 850, 175))
    arr = np.array(crop_rule)
    # Search for a continuous horizontal line where brightness is ~ 120-220
    line_rows = []
    for y_idx in range(arr.shape[0]):
        row_vals = arr[y_idx, :, 0]
        line_pix = np.where(row_vals > 80)[0]
        if len(line_pix) > 150: # continuous line across the column
            line_rows.append((y_idx, len(line_pix), row_vals[line_pix].mean()))
    print(f'{label}: Horizontal rule detected at relative y rows: {line_rows}')


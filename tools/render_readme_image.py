import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_rounded_mask(width, height, radius):
    mask = Image.new("L", (width * 4, height * 4), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, width * 4, height * 4], radius=radius * 4, fill=255)
    return mask.resize((width, height), Image.Resampling.LANCZOS)

def draw_card_shadow(canvas, x1, y1, x2, y2, radius, shadow_blur=18, shadow_offset=(0, 6), shadow_alpha=35):
    w = x2 - x1
    h = y2 - y1
    shadow_img = Image.new("RGBA", (w + shadow_blur * 4, h + shadow_blur * 4), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow_img)
    s_x1 = shadow_blur * 2
    s_y1 = shadow_blur * 2
    s_draw.rounded_rectangle([s_x1, s_y1, s_x1 + w, s_y1 + h], radius=radius, fill=(90, 85, 105, shadow_alpha))
    shadow_blurred = shadow_img.filter(ImageFilter.GaussianBlur(shadow_blur))
    paste_x = x1 - shadow_blur * 2 + shadow_offset[0]
    paste_y = y1 - shadow_blur * 2 + shadow_offset[1]
    canvas.alpha_composite(shadow_blurred, (paste_x, paste_y))

def build_showcase():
    canvas_w = 1800
    canvas_h = 1084
    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))

    # Fonts
    font_regular_path = "C:/Windows/Fonts/JetBrainsMono-Medium.ttf"
    font_bold_path = "C:/Windows/Fonts/JetBrainsMono-Bold.ttf"
    font_italic_path = "C:/Windows/Fonts/JetBrainsMono-MediumItalic.ttf"
    if not os.path.exists(font_regular_path):
        font_regular_path = "C:/Windows/Fonts/JetBrainsMono-Regular.ttf"
    if not os.path.exists(font_italic_path):
        font_italic_path = font_regular_path

    font_size = 17
    line_font = ImageFont.truetype(font_regular_path, font_size)
    gutter_font = ImageFont.truetype(font_regular_path, 14)
    bold_font = ImageFont.truetype(font_bold_path, font_size)
    italic_font = ImageFont.truetype(font_italic_path, font_size)

    # Card dimensions
    card_w = 850
    card_h = 1044
    card_r = 16
    left_x1, left_y1 = 40, 20
    left_x2, left_y2 = left_x1 + card_w, left_y1 + card_h
    right_x1, right_y1 = 910, 20
    right_x2, right_y2 = right_x1 + card_w, right_y1 + card_h

    # 1. Draw shadows for cards
    draw_card_shadow(canvas, left_x1, left_y1, left_x2, left_y2, card_r)
    draw_card_shadow(canvas, right_x1, right_y1, right_x2, right_y2, card_r)

    # 2. Draw Left Card (Code Editor)
    left_card = Image.new("RGBA", (card_w, card_h), (252, 252, 252, 255))
    left_draw = ImageDraw.Draw(left_card)

    # Line tokens definition: (line_no, [(text, style)])
    # Pure LAFS formatting with 4-space indent tiers and detached delimiters
    code_lines = [
        (1, [("#set", "kw"), (" ", "plain"), ("page", "fn"), ("(", "delim"), ("width", "plain"), (":", "delim"), (" ", "plain"), ("10cm", "num"), (",", "delim"), (" ", "plain"), ("height", "plain"), (":", "delim"), (" ", "plain"), ("auto", "kw"), (")", "delim")]),
        (2, [("#set", "kw"), (" ", "plain"), ("heading", "fn"), ("(", "delim"), ("numbering", "plain"), (":", "delim"), (" ", "plain"), ('"1."', "str"), (")", "delim")]),
        (3, []),
        (4, [("=", "head"), (" ", "plain"), ("Fibonacci sequence", "head_text")]),
        (5, [("The Fibonacci sequence is defined through the", "plain")]),
        (6, [("recurrence relation ", "plain"), ("$", "math_delim"), ("F_n", "math_id"), (" = ", "math_op"), ("F_(n-1)", "math_id"), (" + ", "math_op"), ("F_(n-2)", "math_id"), ("$", "math_delim"), (".", "plain")]),
        (7, [("It can also be expressed in ", "plain"), ("_closed form:_", "italic")]),
        (8, []),
        (9, [("$", "math_delim"), (" F_n = ", "math_plain"), ("round", "fn"), ("(1 / ", "math_plain"), ("sqrt", "fn"), ("(5) phi.alt^n), quad", "math_plain")]),
        (10, [("  phi.alt = (1 + ", "math_plain"), ("sqrt", "fn"), ("(5)) / 2 ", "math_plain"), ("$", "math_delim")]),
        (11, []),
        (12, [("#let", "kw"), (" ", "plain"), ("Count", "ident"), (" ", "plain"), ("=", "op"), (" ", "plain"), ("8", "num")]),
        (13, [("#let", "kw"), (" ", "plain"), ("Nums", "ident"), (" ", "plain"), ("=", "op"), (" ", "plain"), ("range", "fn"), ("(", "delim"), ("1", "num"), (",", "delim"), (" ", "plain"), ("Count", "ident"), (" ", "plain"), ("+", "op"), (" ", "plain"), ("1", "num"), (")", "delim")]),
        (14, [("#let", "kw"), (" ", "plain"), ("Fib", "fn"), ("(", "delim"), ("N", "ident"), (")", "delim"), (" ", "plain"), ("=", "op")]),
        (15, [("(", "delim")]),
        (16, [("    ", "plain"), ("if", "kw"), (" ", "plain"), ("N", "ident"), (" ", "plain"), ("<=", "op"), (" ", "plain"), ("2", "num")]),
        (17, [("    ", "plain"), ("{", "delim")]),
        (18, [("        ", "plain"), ("1", "num")]),
        (19, [("    ", "plain"), ("}", "delim")]),
        (20, [("    ", "plain"), ("else", "kw")]),
        (21, [("    ", "plain"), ("{", "delim")]),
        (22, [("        ", "plain"), ("Fib", "fn"), ("(", "delim"), ("N", "ident"), (" ", "plain"), ("-", "op"), (" ", "plain"), ("1", "num"), (")", "delim"), (" ", "plain"), ("+", "op"), (" ", "plain"), ("Fib", "fn"), ("(", "delim"), ("N", "ident"), (" ", "plain"), ("-", "op"), (" ", "plain"), ("2", "num"), (")", "delim")]),
        (23, [("    ", "plain"), ("}", "delim")]),
        (24, [(")", "delim")]),
        (25, []),
        (26, [("The first ", "plain"), ("#Count", "kw_ident"), (" numbers of the sequence are:", "plain")]),
        (27, []),
        (28, [("#align", "kw")]),
        (29, [("(", "delim")]),
        (30, [("    ", "plain"), ("center", "ident"), (",", "delim")]),
        (31, [("    ", "plain"), ("table", "fn")]),
        (32, [("    ", "plain"), ("(", "delim")]),
        (33, [("        ", "plain"), ("columns", "plain"), (":", "delim"), (" ", "plain"), ("Count", "ident"), (",", "delim")]),
        (34, [("        ", "plain"), ("..", "op"), ("Nums", "ident"), (".", "delim"), ("map", "fn"), ("(", "delim"), ("N", "ident"), (" ", "plain"), ("=>", "op"), (" ", "plain"), ("$F_#N$", "math_plain"), (")", "delim"), (",", "delim")]),
        (35, [("        ", "plain"), ("..", "op"), ("Nums", "ident"), (".", "delim"), ("map", "fn"), ("(", "delim"), ("N", "ident"), (" ", "plain"), ("=>", "op"), (" ", "plain"), ("str", "fn"), ("(", "delim"), ("Fib", "fn"), ("(", "delim"), ("N", "ident"), (")", "delim"), (")", "delim"), (")", "delim"), (",", "delim")]),
        (36, [("    ", "plain"), (")", "delim")]),
        (37, [(")", "delim")])
    ]

    # Color Palette (Zero Yellow/Gold)
    colors = {
        "kw": (37, 99, 235),          # Royal Blue
        "fn": (217, 70, 90),          # Warm coral crimson
        "str": (22, 163, 74),         # Emerald green
        "num": (2, 132, 199),         # Ocean cyan blue
        "op": (147, 51, 234),         # Purple
        "delim": (55, 65, 81),        # Charcoal slate
        "ident": (31, 41, 55),        # Dark charcoal
        "plain": (31, 41, 55),        # Dark charcoal
        "head": (37, 99, 235),        # Blue heading =
        "head_text": (17, 24, 39),    # Near black bold
        "italic": (55, 65, 81),       # Charcoal italic
        "math_delim": (147, 51, 234), # Purple $
        "math_op": (147, 51, 234),    # Purple operator
        "math_id": (31, 41, 55),      # Charcoal
        "math_plain": (31, 41, 55),   # Charcoal
        "kw_ident": (37, 99, 235),    # Blue #Count
        "gutter": (156, 163, 175)     # Slate 400
    }

    start_y = 50
    line_h = 25.5
    gutter_right_x = 68
    code_start_x = 92

    for idx, (num, tokens) in enumerate(code_lines):
        y = start_y + idx * line_h
        # Draw line number
        num_str = str(num)
        num_w = gutter_font.getlength(num_str)
        left_draw.text((gutter_right_x - num_w, y + 1), num_str, font=gutter_font, fill=colors["gutter"])

        cur_x = code_start_x
        for token_text, style in tokens:
            f = line_font
            if style == "head_text":
                f = bold_font
            elif style == "italic":
                f = italic_font
            color = colors.get(style, colors["plain"])
            left_draw.text((cur_x, y), token_text, font=f, fill=color)
            cur_x += f.getlength(token_text)

    # Mask left card with rounded rectangle
    left_mask = create_rounded_mask(card_w, card_h, card_r)
    canvas.paste(left_card, (left_x1, left_y1), left_mask)

    # 3. Draw Right Card (Preview Canvas + Compiled Document)
    right_card = Image.new("RGBA", (card_w, card_h), (228, 229, 234, 255))

    # Load compiled document
    doc_path = "e:/Typst/test_readme_doc.png"
    doc_img = Image.open(doc_path).convert("RGBA")
    doc_target_w = 760
    doc_target_h = int(doc_img.height * (doc_target_w / doc_img.width))
    doc_resized = doc_img.resize((doc_target_w, doc_target_h), Image.Resampling.LANCZOS)

    # Center document in right card
    doc_x = (card_w - doc_target_w) // 2
    doc_y = (card_h - doc_target_h) // 2

    # Draw shadow under document inside right card
    doc_shadow = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
    ds_draw = ImageDraw.Draw(doc_shadow)
    ds_draw.rectangle([doc_x - 1, doc_y + 4, doc_x + doc_target_w + 1, doc_y + doc_target_h + 8], fill=(90, 85, 105, 55))
    doc_shadow_blurred = doc_shadow.filter(ImageFilter.GaussianBlur(10))
    right_card.alpha_composite(doc_shadow_blurred, (0, 0))

    # Paste document onto right card
    right_card.alpha_composite(doc_resized, (doc_x, doc_y))

    # Mask right card with rounded rectangle
    right_mask = create_rounded_mask(card_w, card_h, card_r)
    canvas.paste(right_card, (right_x1, right_y1), right_mask)

    # Save final composite
    out_path = "e:/Typst/assets/example-lafs.png"
    canvas.save(out_path, format="PNG")
    print(f"Successfully generated {out_path} ({canvas.size[0]}x{canvas.size[1]})")

if __name__ == "__main__":
    build_showcase()


"""Generate cover images using Pillow — text overlay on the reel image."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from .config import CFG, ASSETS_DIR


def _get_font(size):
    """Get a font, falling back to default if brand font not found."""
    font_dir = ASSETS_DIR / "fonts"
    for name in ["Fraunces.ttf", "Georgia.ttf", "brand.ttf"]:
        p = font_dir / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    try:
        return ImageFont.truetype("Georgia", size)
    except (OSError, IOError):
        return ImageFont.load_default().font_variant(size=size)


def generate_cover(image_path: Path, title: str, output_dir: Path):
    """Generate cover images (4:5 and 1:1) with title overlay."""
    sizes = CFG["cover"]["sizes"]
    brand = CFG["brand"]
    results = []

    for w, h in sizes:
        ratio = f"{w}x{h}"
        out_path = output_dir / f"cover_{ratio}.png"
        if out_path.exists():
            results.append(out_path)
            continue

        # Load and resize image to cover dimensions
        img = Image.open(image_path).convert("RGBA")
        img_ratio = w / h
        src_ratio = img.width / img.height
        if src_ratio > img_ratio:
            new_h = h
            new_w = int(h * src_ratio)
        else:
            new_w = w
            new_h = int(w / src_ratio)
        img = img.resize((new_w, new_h), Image.LANCZOS)
        left = (new_w - w) // 2
        top = (new_h - h) // 2
        img = img.crop((left, top, left + w, top + h))

        # Darken with gradient overlay
        overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        for y in range(h):
            # Stronger darkness at bottom
            alpha = int(40 + (y / h) * 160)
            draw.line([(0, y), (w, y)], fill=(10, 10, 15, alpha))
        img = Image.alpha_composite(img, overlay)

        # Draw title text
        draw = ImageDraw.Draw(img)
        title_font = _get_font(min(52, w // 12))
        brand_font = _get_font(min(28, w // 20))

        # Title — centered, lower third
        title_y = int(h * 0.65)
        _draw_text_centered(draw, title, title_font, (w // 2, title_y), fill="#f5f0e8", max_width=w - 80)

        # Brand mark — bottom
        brand_text = f"🌙 {brand['name']}"
        brand_y = int(h * 0.88)
        _draw_text_centered(draw, brand_text, brand_font, (w // 2, brand_y), fill="#f0a500")

        out_path.parent.mkdir(parents=True, exist_ok=True)
        img.convert("RGB").save(out_path, quality=95)
        results.append(out_path)

    return results


def _draw_text_centered(draw, text, font, position, fill="#fff", max_width=None):
    """Draw centered text, wrapping if needed."""
    x, y = position
    if max_width:
        words = text.split()
        lines = []
        current = ""
        for word in words:
            test = f"{current} {word}".strip()
            bbox = draw.textbbox((0, 0), test, font=font)
            if bbox[2] - bbox[0] > max_width and current:
                lines.append(current)
                current = word
            else:
                current = test
        if current:
            lines.append(current)
    else:
        lines = [text]

    line_height = font.size + 8
    total_height = len(lines) * line_height
    start_y = y - total_height // 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        tw = bbox[2] - bbox[0]
        draw.text((x - tw // 2, start_y + i * line_height), line, font=font, fill=fill)

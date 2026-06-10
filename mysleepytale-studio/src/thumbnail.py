"""Ranked thumbnail candidates — generate, score, and pick the best cover."""
import json
import cv2
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from dataclasses import dataclass, asdict
from .config import CFG, ASSETS_DIR, GEMINI_API_KEY, OPENAI_API_KEY
from .placement import find_top_placements, PlacementResult, compute_saliency


@dataclass
class CandidateInfo:
    variant: int
    zone: str
    treatment: str
    score: float
    reason: str
    path: str


def _get_font(size):
    font_dir = ASSETS_DIR / "fonts"
    for name in ["Fraunces.ttf", "Georgia.ttf", "brand.ttf"]:
        p = font_dir / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    try:
        return ImageFont.truetype("Georgia", size)
    except (OSError, IOError):
        return ImageFont.load_default().font_variant(size=size)


def _wrap_text(draw, text, font, max_width):
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
    return lines


# ─── Treatments ───

def _treatment_gradient(img: Image.Image, placement: PlacementResult) -> Image.Image:
    """Soft gradient scrim — heavier near the text zone."""
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    zone_y_center = placement.y / h

    for y in range(h):
        frac = y / h
        dist = abs(frac - zone_y_center)
        if dist < 0.25:
            alpha = int(160 * (1 - dist / 0.25))
        else:
            alpha = int(40 + frac * 60)
        draw.line([(0, y), (w, y)], fill=(5, 5, 15, alpha))

    return Image.alpha_composite(img.convert("RGBA"), overlay)


def _treatment_vignette(img: Image.Image, placement: PlacementResult) -> Image.Image:
    """Radial vignette darkening edges, keeping center lighter."""
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    cx, cy = w // 2, h // 2
    max_dist = ((w / 2) ** 2 + (h / 2) ** 2) ** 0.5

    for y in range(0, h, 2):
        for x in range(0, w, 4):
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            alpha = int(min(180, (dist / max_dist) * 220))
            draw.point((x, y), fill=(5, 5, 15, alpha))
            draw.point((x + 1, y), fill=(5, 5, 15, alpha))
            draw.point((x + 2, y), fill=(5, 5, 15, alpha))
            draw.point((x + 3, y), fill=(5, 5, 15, alpha))
            draw.point((x, y + 1), fill=(5, 5, 15, alpha))
            draw.point((x + 1, y + 1), fill=(5, 5, 15, alpha))
            draw.point((x + 2, y + 1), fill=(5, 5, 15, alpha))
            draw.point((x + 3, y + 1), fill=(5, 5, 15, alpha))

    return Image.alpha_composite(img.convert("RGBA"), overlay)


def _treatment_vignette_fast(img: Image.Image, placement: PlacementResult) -> Image.Image:
    """Fast radial vignette using numpy."""
    w, h = img.size
    arr = np.array(img.convert("RGBA")).astype(np.float32)

    # Create vignette mask
    Y, X = np.ogrid[:h, :w]
    cx, cy = w / 2, h / 2
    dist = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    max_dist = np.sqrt(cx ** 2 + cy ** 2)
    vignette = np.clip(dist / max_dist * 220, 0, 180).astype(np.uint8)

    overlay = np.zeros((h, w, 4), dtype=np.uint8)
    overlay[:, :, 0] = 5
    overlay[:, :, 1] = 5
    overlay[:, :, 2] = 15
    overlay[:, :, 3] = vignette

    ov_img = Image.fromarray(overlay, "RGBA")
    return Image.alpha_composite(img.convert("RGBA"), ov_img)


def _treatment_scrim_local(img: Image.Image, placement: PlacementResult) -> Image.Image:
    """Minimal local scrim — soft dark panel only behind the text zone."""
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Light overall gradient
    for y in range(h):
        alpha = int(30 + (y / h) * 80)
        draw.line([(0, y), (w, y)], fill=(5, 5, 15, alpha))

    # Local scrim around text zone
    zone_y = placement.y
    scrim_h = 280
    scrim_y1 = max(0, zone_y - scrim_h // 2)
    scrim_y2 = min(h, zone_y + scrim_h // 2)
    margin = 40
    draw.rounded_rectangle(
        [margin, scrim_y1, w - margin, scrim_y2],
        radius=20, fill=(10, 10, 20, 140)
    )

    return Image.alpha_composite(img.convert("RGBA"), overlay)


TREATMENTS = {
    "gradient": _treatment_gradient,
    "vignette": _treatment_vignette_fast,
    "scrim": _treatment_scrim_local,
}


# ─── Smartcrop variants ───

def _smartcrop_variants(img: Image.Image, target_w: int, target_h: int,
                        count: int = 2) -> list[Image.Image]:
    """Produce cropped variants: center, slightly up, slightly down."""
    results = []
    src_w, src_h = img.size
    ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > ratio:
        new_h = src_h
        new_w = int(src_h * ratio)
    else:
        new_w = src_w
        new_h = int(src_w / ratio)

    # Center crop
    cx = (src_w - new_w) // 2
    cy = (src_h - new_h) // 2
    offsets = [
        (cx, cy),                                    # center
        (cx, max(0, cy - src_h // 12)),             # shifted up
        (cx, min(src_h - new_h, cy + src_h // 12)), # shifted down
    ]

    for ox, oy in offsets[:count]:
        cropped = img.crop((ox, oy, ox + new_w, oy + new_h))
        cropped = cropped.resize((target_w, target_h), Image.LANCZOS)
        results.append(cropped)

    return results


# ─── Render a single candidate ───

def _render_candidate(base_img: Image.Image, title: str, placement: PlacementResult,
                      treatment_name: str, target_w: int, target_h: int) -> Image.Image:
    """Render a complete cover candidate."""
    brand = CFG["brand"]
    treatment_fn = TREATMENTS.get(treatment_name, _treatment_gradient)

    # Apply treatment
    img = treatment_fn(base_img.copy(), placement)

    draw = ImageDraw.Draw(img)
    title_font = _get_font(min(60, target_w // 14))
    brand_font = _get_font(min(30, target_w // 22))

    # If scrim needed and treatment isn't already scrim, add minimal local scrim
    if placement.needs_scrim and treatment_name != "scrim":
        scrim = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
        sd = ImageDraw.Draw(scrim)
        scrim_h = 240
        sy1 = max(0, placement.y - scrim_h // 2)
        sy2 = min(target_h, placement.y + scrim_h // 2)
        sd.rounded_rectangle([30, sy1, target_w - 30, sy2], radius=16, fill=(10, 10, 20, 120))
        img = Image.alpha_composite(img, scrim)
        draw = ImageDraw.Draw(img)

    # Wrap and draw title
    lines = _wrap_text(draw, title, title_font, int(target_w * 0.85))
    line_height = title_font.size + 10
    total_text_h = len(lines) * line_height
    text_y_start = placement.y - total_text_h // 2

    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=title_font)
        tw = bbox[2] - bbox[0]

        if placement.zone in ("left-third",):
            tx = int(target_w * 0.08)
        elif placement.zone in ("right-third",):
            tx = int(target_w * 0.92) - tw
        else:
            tx = (target_w - tw) // 2

        ty = text_y_start + i * line_height

        # Shadow
        draw.text((tx + 2, ty + 2), line, font=title_font, fill=(0, 0, 0, 160))
        draw.text((tx, ty), line, font=title_font, fill=placement.title_color)

    # Brand wordmark at bottom
    brand_text = f"{brand['name']}  \U0001f319"
    bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    btw = bbox[2] - bbox[0]
    brand_y = int(target_h * 0.92)
    draw.text(((target_w - btw) // 2, brand_y), brand_text, font=brand_font, fill="#f0a500")

    return img.convert("RGB")


# ─── Heuristic scorer ───

def _heuristic_score(img: Image.Image, placement: PlacementResult) -> tuple[float, str]:
    """Score a candidate: sharpness, calm palette, saliency contrast, legibility."""
    arr = np.array(img.convert("RGB"))
    bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    h, w = gray.shape

    # Sharpness via Laplacian variance (normalized 0-1)
    laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
    sharpness = min(1.0, laplacian_var / 800)

    # Colorfulness (low = calm = good for sleep brand)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    mean_sat = float(np.mean(hsv[:, :, 1])) / 255.0
    calm_bonus = max(0, 1.0 - mean_sat * 1.5)  # reward low saturation

    # Overall darkness bonus (dark images = on-brand)
    mean_brightness = float(np.mean(gray)) / 255.0
    dark_bonus = max(0, 1.0 - mean_brightness * 1.3)

    # Saliency contrast in title zone vs rest
    sal_map = compute_saliency(bgr)
    zone_y1 = max(0, placement.y - 120)
    zone_y2 = min(h, placement.y + 120)
    zone_sal = float(np.mean(sal_map[zone_y1:zone_y2, :]))
    rest_sal = float(np.mean(sal_map))
    sal_contrast = max(0, rest_sal - zone_sal)  # text zone calmer than rest = good

    # Weighted score
    score = (
        sharpness * 0.15 +
        calm_bonus * 0.25 +
        dark_bonus * 0.20 +
        sal_contrast * 0.20 +
        placement.score * 0.20
    )

    reasons = []
    if sharpness > 0.4:
        reasons.append("sharp")
    if calm_bonus > 0.5:
        reasons.append("calm palette")
    if dark_bonus > 0.5:
        reasons.append("dark/warm")
    if sal_contrast > 0.1:
        reasons.append("text in clear zone")
    if placement.score > 0.6:
        reasons.append(f"good {placement.zone}")

    reason = ", ".join(reasons) if reasons else "balanced"
    return round(score * 10, 2), reason


# ─── VLM ranker ───

def _vlm_rank(candidates: list[tuple[Image.Image, CandidateInfo]]) -> list[CandidateInfo]:
    """Rank candidates using a vision-capable model. Returns updated CandidateInfos."""
    import base64
    import io
    import requests as req

    rubric = (
        "Rank these mysleepytale sleep-story covers for being scroll-stopping yet calm, "
        "on-brand (dark/warm/soothing), and legible. Return JSON only: "
        '[{"variant": N, "score": 0-10, "reason": "one line"}] ranked best-first.'
    )

    # Encode images
    image_parts = []
    for img, info in candidates:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        b64 = base64.b64encode(buf.getvalue()).decode()
        image_parts.append((b64, info.variant))

    # Try Gemini vision first
    if GEMINI_API_KEY:
        try:
            return _vlm_gemini(image_parts, rubric, [c[1] for c in candidates])
        except Exception as e:
            print(f"  VLM Gemini failed ({e}), trying OpenAI...")

    # Fall back to OpenAI vision
    if OPENAI_API_KEY:
        try:
            return _vlm_openai(image_parts, rubric, [c[1] for c in candidates])
        except Exception as e:
            print(f"  VLM OpenAI failed ({e}), falling back to heuristic")

    return [c[1] for c in candidates]


def _vlm_gemini(image_parts, rubric, infos):
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=GEMINI_API_KEY)

    contents = [rubric]
    for b64, variant in image_parts:
        import base64
        contents.append(types.Part(
            inline_data=types.Blob(mime_type="image/png", data=base64.b64decode(b64))
        ))
        contents.append(f"(This is variant {variant})")

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
    )

    text = response.text.strip()
    # Extract JSON from response
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    rankings = json.loads(text)

    # Update infos with VLM scores
    vlm_map = {r["variant"]: (r["score"], r["reason"]) for r in rankings}
    for info in infos:
        if info.variant in vlm_map:
            info.score = vlm_map[info.variant][0]
            info.reason = vlm_map[info.variant][1]

    infos.sort(key=lambda i: i.score, reverse=True)
    return infos


def _vlm_openai(image_parts, rubric, infos):
    import requests as req

    content = [{"type": "text", "text": rubric}]
    for b64, variant in image_parts:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/png;base64,{b64}", "detail": "low"},
        })
        content.append({"type": "text", "text": f"(Variant {variant})"})

    resp = req.post(
        "https://api.openai.com/v1/chat/completions",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
        json={
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": content}],
            "max_tokens": 500,
        },
        timeout=60,
    )
    if resp.status_code != 200:
        raise RuntimeError(f"OpenAI VLM error: {resp.status_code}")

    text = resp.json()["choices"][0]["message"]["content"].strip()
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    rankings = json.loads(text)

    vlm_map = {r["variant"]: (r["score"], r["reason"]) for r in rankings}
    for info in infos:
        if info.variant in vlm_map:
            info.score = vlm_map[info.variant][0]
            info.reason = vlm_map[info.variant][1]

    infos.sort(key=lambda i: i.score, reverse=True)
    return infos


# ─── Contact sheet ───

def _make_contact_sheet(candidates: list[tuple[Image.Image, CandidateInfo]],
                        output_path: Path):
    """Grid of all candidates with scores + labels."""
    n = len(candidates)
    cols = min(n, 2)
    rows = (n + cols - 1) // cols

    thumb_w, thumb_h = 540, 960  # half-size for contact sheet
    pad = 20
    label_h = 60

    sheet_w = cols * (thumb_w + pad) + pad
    sheet_h = rows * (thumb_h + label_h + pad) + pad

    sheet = Image.new("RGB", (sheet_w, sheet_h), "#0a0a0f")
    draw = ImageDraw.Draw(sheet)
    label_font = _get_font(22)
    score_font = _get_font(28)

    for idx, (img, info) in enumerate(candidates):
        col = idx % cols
        row = idx // cols
        x = pad + col * (thumb_w + pad)
        y = pad + row * (thumb_h + label_h + pad)

        # Resize and paste
        thumb = img.resize((thumb_w, thumb_h), Image.LANCZOS)
        sheet.paste(thumb, (x, y))

        # Winner badge
        if idx == 0:
            draw.rounded_rectangle(
                [x, y, x + 80, y + 30], radius=8, fill="#f0a500"
            )
            draw.text((x + 8, y + 4), "BEST", font=label_font, fill="#0a0a0f")

        # Label below
        label_y = y + thumb_h + 5
        label = f"v{info.variant} | {info.zone} | {info.treatment}"
        draw.text((x, label_y), label, font=label_font, fill="#888")

        score_text = f"{info.score:.1f}/10"
        draw.text((x, label_y + 26), score_text, font=score_font,
                  fill="#f0a500" if idx == 0 else "#f5f0e8")

        reason_font = _get_font(16)
        reason = info.reason[:50]
        draw.text((x + 100, label_y + 30), reason, font=reason_font, fill="#666")

    sheet.save(output_path, quality=95)


# ─── Main entry point ───

def generate_thumbnails(image_path: Path, title: str, output_dir: Path,
                        count: int = None, ranker: str = None,
                        force: bool = False) -> Path:
    """Generate N thumbnail candidates, rank them, output contact sheet + winner."""
    thumb_cfg = CFG.get("thumbnails", {})
    count = count or thumb_cfg.get("count", 4)
    ranker = ranker or thumb_cfg.get("ranker", "heuristic")

    thumbs_dir = output_dir / "thumbs"
    ranked_json = thumbs_dir / "ranked.json"

    if not force and ranked_json.exists():
        return thumbs_dir

    thumbs_dir.mkdir(parents=True, exist_ok=True)

    # Load source image
    src_img = Image.open(image_path)

    # Target size: 4:5 (1080x1350) as primary
    target_w, target_h = 1080, 1350

    # Generate crop variants
    crops = _smartcrop_variants(src_img, target_w, target_h, count=min(3, count))

    # Get top-2 placements per crop
    treatments = ["gradient", "vignette"]

    all_candidates = []
    variant_num = 1

    for crop_idx, crop_img in enumerate(crops):
        placements = find_top_placements(crop_img, n=2)

        for p_idx, placement in enumerate(placements):
            treatment = treatments[p_idx % len(treatments)]

            rendered = _render_candidate(crop_img, title, placement, treatment, target_w, target_h)

            info = CandidateInfo(
                variant=variant_num,
                zone=placement.zone,
                treatment=treatment,
                score=0,
                reason="",
                path=f"v{variant_num}.png",
            )

            all_candidates.append((rendered, info))
            rendered.save(thumbs_dir / f"v{variant_num}.png", quality=95)
            variant_num += 1

            if len(all_candidates) >= count:
                break
        if len(all_candidates) >= count:
            break

    # ─── Rank ───
    if ranker in ("heuristic", "both"):
        for img, info in all_candidates:
            placement = find_top_placements(img, n=1)[0]
            h_score, h_reason = _heuristic_score(img, placement)
            info.score = h_score
            info.reason = h_reason

    if ranker in ("vlm", "both"):
        h_scores = {info.variant: info.score for _, info in all_candidates}
        vlm_infos = _vlm_rank(all_candidates)

        if ranker == "both":
            for info in vlm_infos:
                h = h_scores.get(info.variant, 5)
                # Average heuristic + vlm (both on 0-10 scale)
                info.score = round((h + info.score) / 2, 2)

        # Update in all_candidates
        vlm_map = {i.variant: i for i in vlm_infos}
        for idx, (img, info) in enumerate(all_candidates):
            if info.variant in vlm_map:
                all_candidates[idx] = (img, vlm_map[info.variant])

    # Sort by score
    all_candidates.sort(key=lambda c: c[1].score, reverse=True)

    # Contact sheet
    _make_contact_sheet(all_candidates, thumbs_dir / "contact_sheet.png")

    # Ranked JSON
    ranked_data = [asdict(info) for _, info in all_candidates]
    (thumbs_dir / "ranked.json").write_text(json.dumps(ranked_data, indent=2))

    # Copy winner to standard cover files
    winner_img, winner_info = all_candidates[0]
    winner_img.save(output_dir / "cover_1080x1350.png", quality=95)

    # Also generate 1:1 and 9:16 from the winner's crop
    src_for_1x1 = Image.open(image_path)
    for w, h, name in [(1080, 1080, "cover_1080x1080.png"), (1080, 1920, "cover_1080x1920.png")]:
        crops_extra = _smartcrop_variants(src_for_1x1, w, h, count=1)
        placement = find_top_placements(crops_extra[0], n=1)[0]
        rendered = _render_candidate(crops_extra[0], title, placement,
                                     winner_info.treatment, w, h)
        rendered.save(output_dir / name, quality=95)

    return thumbs_dir


def pick_candidate(output_dir: Path, pick_n: int, title: str, image_path: Path):
    """Override: regenerate final covers from candidate N."""
    thumbs_dir = output_dir / "thumbs"
    ranked_json = thumbs_dir / "ranked.json"

    if not ranked_json.exists():
        raise RuntimeError("No ranked.json found — run thumbnails first")

    ranked = json.loads(ranked_json.read_text())
    chosen = next((r for r in ranked if r["variant"] == pick_n), None)
    if not chosen:
        raise RuntimeError(f"Variant {pick_n} not found in ranked.json")

    # Load the chosen candidate
    chosen_path = thumbs_dir / chosen["path"]
    if not chosen_path.exists():
        raise RuntimeError(f"Candidate image {chosen_path} not found")

    chosen_img = Image.open(chosen_path)
    chosen_img.save(output_dir / "cover_1080x1350.png", quality=95)

    # Regenerate other sizes
    src_img = Image.open(image_path)
    for w, h, name in [(1080, 1080, "cover_1080x1080.png"), (1080, 1920, "cover_1080x1920.png")]:
        crops = _smartcrop_variants(src_img, w, h, count=1)
        placement = find_top_placements(crops[0], n=1)[0]
        rendered = _render_candidate(crops[0], title, placement, chosen["treatment"], w, h)
        rendered.save(output_dir / name, quality=95)

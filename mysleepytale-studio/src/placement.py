"""Saliency-based text placement — put titles where they won't cover the subject."""
import cv2
import numpy as np
from PIL import Image
from dataclasses import dataclass
from .config import CFG


@dataclass
class PlacementResult:
    zone: str           # e.g. "lower-third", "top-band", "center", "left-third", "right-third"
    x: int
    y: int
    title_color: str    # hex color auto-picked for legibility
    needs_scrim: bool   # whether a soft dark panel is needed behind text
    score: float        # placement quality score (higher = better)


# Candidate zones as (name, y_fraction_start, y_fraction_end, x_fraction_start, x_fraction_end)
ZONES = [
    ("top-band",     0.05, 0.30, 0.05, 0.95),
    ("upper-third",  0.20, 0.45, 0.05, 0.95),
    ("center",       0.35, 0.65, 0.10, 0.90),
    ("lower-third",  0.55, 0.80, 0.05, 0.95),
    ("bottom-band",  0.70, 0.92, 0.05, 0.95),
    ("left-third",   0.30, 0.70, 0.05, 0.50),
    ("right-third",  0.30, 0.70, 0.50, 0.95),
]


def compute_saliency(img_bgr: np.ndarray) -> np.ndarray:
    """Compute normalized saliency map (0-1) using OpenCV."""
    try:
        saliency = cv2.saliency.StaticSaliencyFineGrained_create()
        success, sal_map = saliency.computeSaliency(img_bgr)
        if success:
            sal_map = sal_map.astype(np.float32)
            sal_map = cv2.GaussianBlur(sal_map, (31, 31), 0)
            mn, mx = sal_map.min(), sal_map.max()
            if mx > mn:
                sal_map = (sal_map - mn) / (mx - mn)
            return sal_map
    except Exception:
        pass

    # Fallback: spectral residual
    try:
        saliency = cv2.saliency.StaticSaliencySpectralResidual_create()
        success, sal_map = saliency.computeSaliency(img_bgr)
        if success:
            sal_map = sal_map.astype(np.float32)
            sal_map = cv2.GaussianBlur(sal_map, (31, 31), 0)
            mn, mx = sal_map.min(), sal_map.max()
            if mx > mn:
                sal_map = (sal_map - mn) / (mx - mn)
            return sal_map
    except Exception:
        pass

    # Last resort: edge-based pseudo-saliency
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 50, 150).astype(np.float32) / 255.0
    edges = cv2.GaussianBlur(edges, (31, 31), 0)
    mn, mx = edges.min(), edges.max()
    if mx > mn:
        edges = (edges - mn) / (mx - mn)
    return edges


def _zone_luminance(gray: np.ndarray, y1: int, y2: int, x1: int, x2: int) -> float:
    """Mean luminance of a zone (0-255)."""
    region = gray[y1:y2, x1:x2]
    return float(np.mean(region)) if region.size > 0 else 128.0


def _legibility_score(mean_lum: float, title_on_dark: bool) -> float:
    """How readable is light-on-dark or dark-on-light text in this zone."""
    if title_on_dark:
        # Light text on dark bg: darker bg = better
        return max(0, (200 - mean_lum) / 200)
    else:
        # Dark text on light bg: lighter bg = better
        return max(0, (mean_lum - 60) / 200)


def find_placement(image: Image.Image, title_block_h: int = 200,
                   title_block_w: int = None) -> PlacementResult:
    """Find the best zone to place title text on the image."""
    cfg_placement = CFG.get("placement", {})
    legibility_threshold = cfg_placement.get("legibility_threshold", 0.35)

    w, h = image.size
    if title_block_w is None:
        title_block_w = int(w * 0.85)

    # Convert to OpenCV
    img_rgb = np.array(image.convert("RGB"))
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    # Compute saliency
    sal_map = compute_saliency(img_bgr)

    # Score each zone
    candidates = []
    for zone_name, y_frac_s, y_frac_e, x_frac_s, x_frac_e in ZONES:
        y1 = int(h * y_frac_s)
        y2 = int(h * y_frac_e)
        x1 = int(w * x_frac_s)
        x2 = int(w * x_frac_e)

        # Mean saliency in zone (lower = calmer = better for text)
        zone_sal = sal_map[y1:y2, x1:x2]
        mean_sal = float(np.mean(zone_sal)) if zone_sal.size > 0 else 0.5

        # Luminance
        mean_lum = _zone_luminance(gray, y1, y2, x1, x2)

        # Auto-pick title color: light text if bg is dark, dark text if bg is light
        title_on_dark = mean_lum < 140
        title_color = "#f5f0e8" if title_on_dark else "#1a1040"

        # Legibility
        legibility = _legibility_score(mean_lum, title_on_dark)

        # Combined score: want LOW saliency + HIGH legibility
        # Weight saliency avoidance more (0.6) than legibility (0.4)
        score = (1.0 - mean_sal) * 0.6 + legibility * 0.4

        # Needs scrim if legibility is borderline
        needs_scrim = legibility < legibility_threshold

        # Text position: center of zone
        text_x = (x1 + x2) // 2
        text_y = (y1 + y2) // 2

        candidates.append(PlacementResult(
            zone=zone_name,
            x=text_x,
            y=text_y,
            title_color=title_color,
            needs_scrim=needs_scrim,
            score=score,
        ))

    # Sort by score (highest first)
    candidates.sort(key=lambda c: c.score, reverse=True)
    return candidates[0]


def find_top_placements(image: Image.Image, n: int = 2,
                        title_block_h: int = 200) -> list[PlacementResult]:
    """Return top-N placement zones ranked by score."""
    cfg_placement = CFG.get("placement", {})
    legibility_threshold = cfg_placement.get("legibility_threshold", 0.35)

    w, h = image.size
    img_rgb = np.array(image.convert("RGB"))
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    sal_map = compute_saliency(img_bgr)

    candidates = []
    for zone_name, y_frac_s, y_frac_e, x_frac_s, x_frac_e in ZONES:
        y1, y2 = int(h * y_frac_s), int(h * y_frac_e)
        x1, x2 = int(w * x_frac_s), int(w * x_frac_e)

        zone_sal = sal_map[y1:y2, x1:x2]
        mean_sal = float(np.mean(zone_sal)) if zone_sal.size > 0 else 0.5
        mean_lum = _zone_luminance(gray, y1, y2, x1, x2)

        title_on_dark = mean_lum < 140
        title_color = "#f5f0e8" if title_on_dark else "#1a1040"
        legibility = _legibility_score(mean_lum, title_on_dark)
        score = (1.0 - mean_sal) * 0.6 + legibility * 0.4
        needs_scrim = legibility < legibility_threshold

        candidates.append(PlacementResult(
            zone=zone_name,
            x=(x1 + x2) // 2,
            y=(y1 + y2) // 2,
            title_color=title_color,
            needs_scrim=needs_scrim,
            score=score,
        ))

    candidates.sort(key=lambda c: c.score, reverse=True)
    return candidates[:n]

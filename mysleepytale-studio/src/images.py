"""Generate reel images using OpenAI gpt-image-1 or Google Gemini."""
import base64
import requests
from pathlib import Path
from .config import CFG, GEMINI_API_KEY, OPENAI_API_KEY


def generate_image(reel_concept: str, output_path: Path, model: str = None):
    """Generate a 9:16 image from the reel concept description."""
    if output_path.exists():
        return output_path

    preamble = CFG["image"]["style_preamble"]
    prompt = f"{preamble}\n\nScene: {reel_concept}"

    # Try OpenAI first (gpt-image-1), fall back to Gemini
    if OPENAI_API_KEY:
        _generate_openai(prompt, output_path)
    elif GEMINI_API_KEY:
        _generate_gemini(prompt, output_path, model)
    else:
        raise RuntimeError("No OPENAI_API_KEY or GEMINI_API_KEY set")

    _ensure_aspect(output_path, 1080, 1920)
    return output_path


def _generate_openai(prompt: str, output_path: Path):
    """Generate image with OpenAI gpt-image-1."""
    response = requests.post(
        "https://api.openai.com/v1/images/generations",
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"},
        json={"model": "gpt-image-1", "prompt": prompt, "n": 1, "size": "1024x1536", "quality": "high"},
        timeout=90,
    )
    if response.status_code != 200:
        raise RuntimeError(f"OpenAI image error {response.status_code}: {response.text[:200]}")

    data = response.json()
    img_b64 = data["data"][0]["b64_json"]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(base64.b64decode(img_b64))


def _generate_gemini(prompt: str, output_path: Path, model: str = None):
    """Generate image with Google Gemini."""
    from google import genai
    from google.genai import types
    model = model or CFG["image"]["model"]
    client = genai.Client(api_key=GEMINI_API_KEY)
    response = client.models.generate_content(
        model=model, contents=prompt,
        config=types.GenerateContentConfig(response_modalities=["IMAGE", "TEXT"]),
    )
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            img_data = part.inline_data.data
            if isinstance(img_data, str):
                img_data = base64.b64decode(img_data)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            output_path.write_bytes(img_data)
            return
    raise RuntimeError("No image in Gemini response")


def _ensure_aspect(path: Path, w: int, h: int):
    """Crop/pad image to exact dimensions."""
    from PIL import Image
    img = Image.open(path)
    if img.size == (w, h):
        return

    # Resize to cover, then center crop
    ratio_w = w / img.width
    ratio_h = h / img.height
    scale = max(ratio_w, ratio_h)
    new_w = int(img.width * scale)
    new_h = int(img.height * scale)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center crop
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    img = img.crop((left, top, left + w, top + h))
    img.save(path)

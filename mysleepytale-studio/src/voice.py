"""Generate voiceover audio using OpenAI TTS."""
import requests
from pathlib import Path
from .config import CFG, OPENAI_API_KEY


def generate_voice(text: str, output_path: Path):
    """Generate narration audio from text using OpenAI TTS."""
    if output_path.exists():
        return output_path

    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not set")

    voice_cfg = CFG["voice"]

    response = requests.post(
        "https://api.openai.com/v1/audio/speech",
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": voice_cfg["model"],
            "input": text[:4096],
            "voice": voice_cfg["voice"],
            "speed": voice_cfg["speed"],
            "response_format": "mp3",
            "instructions": voice_cfg["instructions"],
        },
        timeout=60,
    )

    if response.status_code != 200:
        raise RuntimeError(f"OpenAI TTS error {response.status_code}: {response.text[:200]}")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(response.content)
    return output_path

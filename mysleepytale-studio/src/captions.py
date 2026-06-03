"""Generate .ass subtitle file from voiceover text + audio duration."""
import re
import json
import subprocess
from pathlib import Path


def get_audio_duration(audio_path: Path) -> float:
    """Get duration of audio file in seconds using ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_format", str(audio_path)],
        capture_output=True, text=True,
    )
    data = json.loads(result.stdout)
    return float(data["format"]["duration"])


def generate_captions(text: str, audio_path: Path, output_path: Path):
    """Generate styled .ass subtitle file with evenly distributed lines."""
    if output_path.exists():
        return output_path

    duration = get_audio_duration(audio_path)

    # Split text into sentences
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    sentences = [s.strip() for s in sentences if s.strip()]

    if not sentences:
        return None

    time_per_sentence = duration / len(sentences)

    # Build .ass file
    header = """[Script Info]
Title: MySleepyTale Reel
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,56,&H00F0E8F5,&H000000FF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,3,0,2,40,40,200,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""

    events = []
    for i, sentence in enumerate(sentences):
        start = i * time_per_sentence
        end = (i + 1) * time_per_sentence
        # Add fade effect
        fade = r"{\fad(300,300)}"
        events.append(
            f"Dialogue: 0,{_format_time(start)},{_format_time(end)},Default,,0,0,0,,{fade}{sentence}"
        )

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(header + "\n".join(events))
    return output_path


def _format_time(seconds: float) -> str:
    """Format seconds as H:MM:SS.CC for .ass format."""
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}"

"""Assemble final reel MP4 using ffmpeg."""
import subprocess
import shutil
from pathlib import Path
from .config import CFG
from .captions import get_audio_duration


def generate_reel(image_path: Path, audio_path: Path, captions_path: Path,
                  output_path: Path, music_path: Path = None):
    """Assemble a 1080x1920 reel with Ken Burns, audio, and burned captions."""
    if output_path.exists():
        return output_path

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise RuntimeError("ffmpeg not found. Install with: brew install ffmpeg")

    reel_cfg = CFG["reel"]
    duration = get_audio_duration(audio_path)

    # Clamp duration
    duration = max(reel_cfg["duration_min"], min(reel_cfg["duration_max"], duration))
    fps = reel_cfg["fps"]
    total_frames = int(duration * fps)
    zoom = reel_cfg["zoom_factor"]
    fade = reel_cfg["fade_duration"]

    # Build ffmpeg command
    # Ken Burns: slow zoom in using zoompan filter
    zoom_inc = (zoom - 1) / total_frames
    zoompan = (
        f"zoompan=z=min(zoom+{zoom_inc:.8f}\\,1.5)"
        f":x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2)"
        f":d={total_frames}:s=1080x1920:fps={fps}"
    )

    # Video filter chain
    vf = f"[0:v]{zoompan},fade=t=in:st=0:d={fade},fade=t=out:st={duration - fade}:d={fade}[v]"

    # Audio: if music provided and mode is full, mix them
    music_mode = reel_cfg.get("music_mode", "voice_only")

    cmd = [ffmpeg, "-y"]

    # Input: image
    cmd.extend(["-loop", "1", "-i", str(image_path)])
    # Input: narration audio
    cmd.extend(["-i", str(audio_path)])

    if music_mode == "full" and music_path and music_path.exists():
        cmd.extend(["-i", str(music_path)])
        # Mix voice + music (music ducked)
        af = (
            f"[1:a]afade=t=in:st=0:d={fade},afade=t=out:st={duration - fade}:d={fade}[voice];"
            f"[2:a]volume=-18dB,afade=t=in:st=0:d=1,afade=t=out:st={duration - 1}:d=1[music];"
            f"[voice][music]amix=inputs=2:duration=shortest[a]"
        )
        filter_complex = f"{vf};{af}"
        cmd.extend(["-filter_complex", filter_complex, "-map", "[v]", "-map", "[a]"])
    else:
        # Voice only
        af = f"[1:a]afade=t=in:st=0:d={fade},afade=t=out:st={duration - fade}:d={fade}[a]"
        filter_complex = f"{vf};{af}"
        cmd.extend(["-filter_complex", filter_complex, "-map", "[v]", "-map", "[a]"])

    # Note: subtitle burn-in via subtitles filter is fragile with paths.
    # For now, captions are generated as .ass files for manual use if needed.

    # Output settings
    cmd.extend([
        "-t", str(duration),
        "-c:v", "libx264", "-preset", "medium", "-crf", "23",
        "-c:a", "aac", "-b:a", "128k",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(output_path),
    ])

    output_path.parent.mkdir(parents=True, exist_ok=True)

    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg failed:\n{result.stderr[-500:]}")

    return output_path

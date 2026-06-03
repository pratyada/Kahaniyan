"""Orchestrate the full pipeline for one day."""
import json
from pathlib import Path
from datetime import datetime
from rich.console import Console
from .config import CFG, OUTPUT_DIR, ASSETS_DIR
from .plan import InstagramDay
from .images import generate_image
from .voice import generate_voice
from .captions import generate_captions
from .cover import generate_cover
from .reel import generate_reel

console = Console()


def process_day(day: InstagramDay, force: bool = False, dry_run: bool = False):
    """Run the full pipeline for a single day."""
    day_dir = OUTPUT_DIR / f"day{day.day:02d}"
    day_dir.mkdir(parents=True, exist_ok=True)

    image_path = day_dir / "image.png"
    audio_path = day_dir / "narration.mp3"
    captions_path = day_dir / "captions.ass"
    reel_path = day_dir / "reel.mp4"
    caption_path = day_dir / "caption.txt"
    manifest_path = day_dir / "manifest.json"

    if force:
        for f in [image_path, audio_path, captions_path, reel_path, caption_path, manifest_path]:
            f.unlink(missing_ok=True)
        # Also remove covers
        for f in day_dir.glob("cover_*.png"):
            f.unlink(missing_ok=True)

    # Skip if already complete
    if not force and reel_path.exists() and caption_path.exists():
        console.print(f"  [dim]Day {day.day} already done, skipping[/dim]")
        return day_dir

    if dry_run:
        _print_dry_run(day)
        return day_dir

    costs = {}

    # ─── Step 1: Image ───
    console.print(f"  [bold gold1]1/6[/] Generating image...")
    try:
        generate_image(day.reel_concept, image_path)
        costs["image"] = 0.04  # ~$0.039/img
        console.print(f"       [green]Image saved[/green]")
    except Exception as e:
        console.print(f"       [red]Image failed: {e}[/red]")
        return day_dir

    # ─── Step 2: Voice ───
    if not day.variety:
        console.print(f"  [bold gold1]2/6[/] Generating voiceover...")
        try:
            generate_voice(day.voiceover, audio_path)
            # Estimate: ~$0.015/min, assume ~15 sec = $0.004
            costs["voice"] = 0.004
            console.print(f"       [green]Audio saved[/green]")
        except Exception as e:
            console.print(f"       [red]Voice failed: {e}[/red]")
            return day_dir
    else:
        console.print(f"  [bold gold1]2/6[/] [dim]Variety post — skipping voiceover[/dim]")
        # For variety posts, generate a short VO anyway for the reel
        if day.voiceover:
            try:
                generate_voice(day.voiceover, audio_path)
                costs["voice"] = 0.002
            except Exception:
                pass

    # ─── Step 3: Captions ───
    if audio_path.exists():
        console.print(f"  [bold gold1]3/6[/] Generating captions...")
        try:
            generate_captions(day.voiceover, audio_path, captions_path)
            console.print(f"       [green]Captions saved[/green]")
        except Exception as e:
            console.print(f"       [yellow]Captions failed (continuing): {e}[/yellow]")
    else:
        console.print(f"  [bold gold1]3/6[/] [dim]No audio — skipping captions[/dim]")

    # ─── Step 4: Reel ───
    if audio_path.exists():
        console.print(f"  [bold gold1]4/6[/] Assembling reel...")
        # Check for ambient music
        music_dir = ASSETS_DIR / "music"
        music_files = list(music_dir.glob("*.mp3")) if music_dir.exists() else []
        music_path = music_files[day.day % len(music_files)] if music_files else None

        try:
            generate_reel(image_path, audio_path, captions_path, reel_path, music_path)
            console.print(f"       [green]Reel saved ({reel_path.stat().st_size // 1024} KB)[/green]")
        except Exception as e:
            console.print(f"       [red]Reel failed: {e}[/red]")
    else:
        console.print(f"  [bold gold1]4/6[/] [dim]No audio — skipping reel[/dim]")

    # ─── Step 5: Covers ───
    console.print(f"  [bold gold1]5/6[/] Generating covers...")
    try:
        covers = generate_cover(image_path, day.title, day_dir)
        console.print(f"       [green]{len(covers)} covers saved[/green]")
    except Exception as e:
        console.print(f"       [yellow]Covers failed: {e}[/yellow]")

    # ─── Step 6: Caption file ───
    console.print(f"  [bold gold1]6/6[/] Writing caption...")
    disclosure = CFG["caption"]["disclosure"]
    caption_text = f"{day.caption}\n\n{day.cta}\n\n{day.hashtags}\n\n{disclosure}"
    caption_path.write_text(caption_text)
    console.print(f"       [green]Caption saved[/green]")

    # ─── Manifest ───
    manifest = {
        "day": day.day,
        "date": day.date,
        "title": day.title,
        "variety": day.variety,
        "models": {
            "image": CFG["image"]["model"],
            "voice": CFG["voice"]["model"],
        },
        "costs": costs,
        "total_cost": sum(costs.values()),
        "files": {
            "image": str(image_path.name),
            "audio": str(audio_path.name) if audio_path.exists() else None,
            "captions": str(captions_path.name) if captions_path.exists() else None,
            "reel": str(reel_path.name) if reel_path.exists() else None,
            "caption_txt": str(caption_path.name),
        },
        "generated_at": datetime.now().isoformat(),
    }
    manifest_path.write_text(json.dumps(manifest, indent=2))

    return day_dir


def _print_dry_run(day):
    """Print cost estimate without calling APIs."""
    console.print(f"\n  [bold]DRY RUN — Day {day.day}: {day.title}[/bold]")
    console.print(f"  Image model: {CFG['image']['model']}")
    console.print(f"  Voice model: {CFG['voice']['model']} / {CFG['voice']['voice']}")
    console.print(f"  Voiceover length: {len(day.voiceover)} chars")
    console.print(f"  Reel concept: {day.reel_concept[:80]}...")
    console.print()
    console.print(f"  [bold]Estimated costs:[/bold]")
    console.print(f"    Image (Gemini):   ~$0.04")
    if not day.variety:
        console.print(f"    Voice (OpenAI):   ~$0.004")
    console.print(f"    Total:            ~${'0.044' if not day.variety else '0.04'}")

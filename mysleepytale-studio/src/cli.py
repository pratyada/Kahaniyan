"""CLI entry point for mysleepytale-studio."""
import argparse
import sys
from rich.console import Console
from rich.table import Table
from .plan import load_plan
from .pipeline import process_day
from .config import GEMINI_API_KEY, OPENAI_API_KEY, OUTPUT_DIR

console = Console()


def main():
    parser = argparse.ArgumentParser(
        description="mysleepytale-studio — generate Instagram Reels + creatives from the 30-day plan"
    )
    parser.add_argument("--day", type=int, help="Generate for a single day (1-30)")
    parser.add_argument("--range", type=str, help="Generate for a range (e.g., 1-7)")
    parser.add_argument("--all", action="store_true", help="Generate all 30 days")
    parser.add_argument("--only-todo", action="store_true", help="Skip days that already have output")
    parser.add_argument("--force", action="store_true", help="Regenerate even if outputs exist")
    parser.add_argument("--dry-run", action="store_true", help="Print cost estimate, don't call APIs")

    args = parser.parse_args()

    # Validate keys
    if not args.dry_run:
        if not GEMINI_API_KEY and not OPENAI_API_KEY:
            console.print("[red]Need at least OPENAI_API_KEY or GEMINI_API_KEY. Add to .env or .env.prod[/red]")
            sys.exit(1)
        if not OPENAI_API_KEY:
            console.print("[yellow]OPENAI_API_KEY not set — voice generation will fail[/yellow]")

    # Load plan
    console.print("\n[bold gold1]🌙 mysleepytale-studio[/bold gold1]\n")
    instagram, xposts = load_plan()
    console.print(f"Loaded {len(instagram)} Instagram days, {len(xposts)} X posts\n")

    # Determine which days to process
    days = []
    if args.day:
        days = [args.day]
    elif args.range:
        start, end = map(int, args.range.split("-"))
        days = list(range(start, end + 1))
    elif args.all:
        days = list(range(1, len(instagram) + 1))
    else:
        console.print("[yellow]Specify --day N, --range 1-7, or --all[/yellow]")
        sys.exit(1)

    # Filter to only-todo if requested
    if args.only_todo:
        days = [d for d in days if not (OUTPUT_DIR / f"day{d:02d}" / "reel.mp4").exists()]

    if not days:
        console.print("[green]Nothing to generate — all days complete![/green]")
        return

    console.print(f"Processing days: {days}\n")

    # Process each day
    total_cost = 0
    results = []

    for day_num in days:
        ig_day = next((d for d in instagram if d.day == day_num), None)
        if not ig_day:
            console.print(f"[yellow]Day {day_num} not found in plan, skipping[/yellow]")
            continue

        console.rule(f"[bold gold1]Day {day_num} — {ig_day.title}[/bold gold1]")

        day_dir = process_day(ig_day, force=args.force, dry_run=args.dry_run)

        # Read manifest for cost
        manifest_path = day_dir / "manifest.json"
        if manifest_path.exists():
            import json
            manifest = json.loads(manifest_path.read_text())
            cost = manifest.get("total_cost", 0)
            total_cost += cost
            results.append((day_num, ig_day.title, cost, "done"))
        else:
            results.append((day_num, ig_day.title, 0, "dry-run" if args.dry_run else "failed"))

    # Summary table
    console.print()
    table = Table(title="Summary", show_header=True, header_style="bold gold1")
    table.add_column("Day", style="bold")
    table.add_column("Title")
    table.add_column("Cost", justify="right")
    table.add_column("Status")

    for day_num, title, cost, status in results:
        color = "green" if status == "done" else "yellow" if status == "dry-run" else "red"
        table.add_row(str(day_num), title, f"${cost:.3f}", f"[{color}]{status}[/{color}]")

    table.add_row("", "[bold]Total[/bold]", f"[bold]${total_cost:.3f}[/bold]", "")
    console.print(table)


if __name__ == "__main__":
    main()

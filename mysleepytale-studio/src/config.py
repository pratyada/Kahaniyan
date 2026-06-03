"""Load config.yaml and .env"""
import os
import yaml
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env")

# Also try loading from project root .env.prod
_env_prod = ROOT.parent / ".env.prod"
if _env_prod.exists():
    load_dotenv(_env_prod, override=False)

def load_config():
    with open(ROOT / "config.yaml") as f:
        return yaml.safe_load(f)

CFG = load_config()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OUTPUT_DIR = ROOT / "output"
CONTENT_DIR = ROOT / "content"
ASSETS_DIR = ROOT / "assets"

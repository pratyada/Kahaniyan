"""Social media posting — STUB (Phase 2).

TODO: Implement auto-posting when ready.

Instagram (Reels):
  - Requires Instagram Graph API
  - Business/Creator account linked to Facebook Page
  - Long-lived access token from Meta developer app
  - Two-step publish: create media container (public MP4 URL) → publish
  - ~25 posts/24h limit

Platform X (Twitter):
  - Requires X API v2 with paid tier
  - Upload media → create post
  - Threads = chained replies

Alternative (easier):
  - Push files to Later/Buffer/Metricool scheduler
  - Import via their UI or API
  - caption.txt + reel.mp4 are already formatted for this

Files are structured for future automation:
  - output/dayNN/reel.mp4 — ready to upload
  - output/dayNN/caption.txt — ready to paste
  - output/dayNN/manifest.json — metadata for the poster
"""


def post_instagram(day_dir):
    """TODO: Post reel to Instagram via Graph API."""
    raise NotImplementedError("Instagram posting not yet implemented. Use caption.txt + reel.mp4 manually.")


def post_x(day_dir, post_text):
    """TODO: Post to Platform X via v2 API."""
    raise NotImplementedError("X posting not yet implemented. Copy post from Studio or caption.txt.")

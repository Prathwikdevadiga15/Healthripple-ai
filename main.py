from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent / "backend"))

from app.main import app

app.frontend(
    "/",
    directory=Path(__file__).parent / "apps" / "web" / "dist",
    fallback="index.html",
)
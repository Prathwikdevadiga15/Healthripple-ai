import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")
DATA_DIR = BASE_DIR / "data" / "synthetic"

APP_NAME = "HealthRipple AI"
API_PREFIX = "/api"

# Not used by the CSV-backed prototype backend, but kept so this file is the
# single place to point at a real Postgres instance once one exists.
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://healthripple:healthripple@localhost:5432/healthripple")

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "").strip()
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile").strip()

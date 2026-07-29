import sys
import os

# Add backend directory to Python path so Vercel Serverless can import app.main
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app  # noqa: F401

# Vercel Serverless Python builder exposes 'app' ASGI FastAPI instance

import os
from pathlib import Path
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent

# Read .env file manually if exists to support zero-dependency config
env_file = BASE_DIR / ".env"
if env_file.exists():
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

class Settings:
    PROJECT_NAME: str = "UniPulse Campus API"
    VERSION: str = "1.0.0"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/unipulse.db")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "unipulse-super-secret-jwt-key-2026")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip() for origin in os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:8080,http://127.0.0.1:8080,http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000"
        ).split(",") if origin.strip()
    ]

    # File uploads
    UPLOAD_DIR: Path = BASE_DIR / os.getenv("UPLOAD_DIR", "uploads")
    MAX_UPLOAD_SIZE_BYTES: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_EXTENSIONS: set = {".jpg", ".jpeg", ".png", ".webp", ".heic"}

    # AI Prototype Scoring Weights (Percentages summing to 1.0)
    MATCH_WEIGHT_VISUAL: float = 0.35
    MATCH_WEIGHT_LOCATION: float = 0.25
    MATCH_WEIGHT_DESCRIPTION: float = 0.20
    MATCH_WEIGHT_TIME: float = 0.10
    MATCH_WEIGHT_CATEGORY: float = 0.10

settings = Settings()

# Ensure upload directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

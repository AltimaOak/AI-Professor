import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    APP_NAME = os.getenv("APP_NAME", "AI-Professor")
    ENV = os.getenv("ENV", "development")
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))

    # LLM Keys
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")

    # Qdrant
    QDRANT_URL = os.getenv("QDRANT_URL", "")
    QDRANT_API_KEY = os.getenv("QDRANT_API_KEY", "")
    QDRANT_COLLECTION = os.getenv("QDRANT_COLLECTION", "ai_professor")

    # File storage
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

    # Database
    DB_URL = os.getenv("DB_URL", "postgresql://postgres:nik05@localhost:5432/ai_professor")

    # JWT
    JWT_SECRET = os.getenv("JWT_SECRET", "change-this-in-production")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 24hrs
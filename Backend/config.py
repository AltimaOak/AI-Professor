# config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Core settings
    APP_NAME = os.getenv("APP_NAME", "AI-Professor")
    ENV = os.getenv("ENV", "development")
    DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")

    # Server settings
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))

    # Database settings
    DB_URL = os.getenv("DB_URL", "postgresql://user:password@localhost:5432/aiprofessor")

    # Authentication
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

    # Generic LLM settings (fallback)
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")
    LLM_API_KEY = os.getenv("LLM_API_KEY", "")

    # Groq API settings
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_API_ENDPOINT = os.getenv("GROQ_API_ENDPOINT", "https://api.groq.com/v1")

    # Gemini API settings
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GEMINI_API_ENDPOINT = os.getenv("GEMINI_API_ENDPOINT", "https://generativelanguage.googleapis.com/v1beta")

    # File storage
    UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")

# Convenience exports (optional, for short imports)
GROQ_API_KEY = Config.GROQ_API_KEY
GROQ_API_ENDPOINT = Config.GROQ_API_ENDPOINT
GEMINI_API_KEY = Config.GEMINI_API_KEY
GEMINI_API_ENDPOINT = Config.GEMINI_API_ENDPOINT

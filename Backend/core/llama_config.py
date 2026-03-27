# core/llama_config.py
from llama_index.core import Settings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

def configure_llama() -> None:
    """
    Called once at app startup.
    Uses local HuggingFace model for embeddings — no API key needed.
    Model downloads once (~90MB) and caches locally.
    LLM is None — we call Groq/Gemini directly in routes.
    """
    Settings.embed_model = HuggingFaceEmbedding(
        model_name="BAAI/bge-small-en-v1.5"  # fast, accurate, 384-dim vectors
    )
    Settings.node_parser = SentenceSplitter(
        chunk_size=400,
        chunk_overlap=50,
    )
    Settings.llm = None
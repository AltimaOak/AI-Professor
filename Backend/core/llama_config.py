# core/llama_config.py
from llama_index.core import Settings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.gemini import GeminiEmbedding
from config import Config

def configure_llama() -> None:
    Settings.embed_model = GeminiEmbedding(
        model_name="models/embedding-001",
        api_key=Config.GEMINI_API_KEY,
    )
    Settings.node_parser = SentenceSplitter(
        chunk_size=400,
        chunk_overlap=50,
    )
    Settings.llm = None
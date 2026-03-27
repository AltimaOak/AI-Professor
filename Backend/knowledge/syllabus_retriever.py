from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.qdrant import QdrantVectorStore

from config import Config
from core.qdrant_client import get_qdrant_client


def retrieve_context(question: str, student_id: str, top_k: int = 4) -> str:
    """
    Searches the student's Qdrant collection for the most relevant chunks.
    Returns combined context string, or empty string if nothing found.
    """
    client = get_qdrant_client()
    collection_name = f"{Config.QDRANT_COLLECTION}_{student_id}"

    # Guard: return empty if student has no collection yet
    try:
        existing = [c.name for c in client.get_collections().collections]
        if collection_name not in existing:
            return ""
    except Exception:
        return ""

    vector_store = QdrantVectorStore(
        client=client,
        collection_name=collection_name,
    )
    index = VectorStoreIndex.from_vector_store(vector_store)
    retriever = index.as_retriever(similarity_top_k=top_k)

    try:
        nodes = retriever.retrieve(question)
        if not nodes:
            return ""
        return "\n\n".join(node.get_content() for node in nodes)
    except Exception:
        return ""
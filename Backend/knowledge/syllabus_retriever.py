# knowledge/syllabus_retriever.py

import os
import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

# ---------------- CONFIG ---------------- #

EMBEDDING_MODEL = "all-MiniLM-L6-v2"

BASE_DIR = os.path.dirname(__file__)
VECTOR_DB_PATH = os.path.join(BASE_DIR, "syllabus_faiss.index")
METADATA_PATH = os.path.join(BASE_DIR, "syllabus_chunks.pkl")

TOP_K = 4  # number of chunks to retrieve
SIMILARITY_THRESHOLD = 0.35  # lower = stricter syllabus matching

# ---------------------------------------- #

# Load embedding model once
embedding_model = SentenceTransformer(EMBEDDING_MODEL)


def _load_vector_db():
    """Load FAISS index and chunk metadata"""
    if not os.path.exists(VECTOR_DB_PATH) or not os.path.exists(METADATA_PATH):
        return None, None

    index = faiss.read_index(VECTOR_DB_PATH)

    with open(METADATA_PATH, "rb") as f:
        chunks = pickle.load(f)

    return index, chunks


def retrieve_syllabus_context(query: str) -> str | None:
    """
    Retrieves relevant syllabus chunks for a query.
    Returns combined context string or None if out of syllabus.
    """

    index, chunks = _load_vector_db()

    if index is None or not chunks:
        return None

    # Convert query → embedding
    query_embedding = embedding_model.encode([query]).astype("float32")

    # Search FAISS
    distances, indices = index.search(query_embedding, TOP_K)

    relevant_chunks = []

    for score, idx in zip(distances[0], indices[0]):
        if idx == -1:
            continue

        # FAISS uses distance → convert to similarity
        similarity = 1 / (1 + score)

        if similarity >= SIMILARITY_THRESHOLD:
            relevant_chunks.append(chunks[idx])

    if not relevant_chunks:
        return None

    # Combine chunks into a single context
    return "\n\n".join(relevant_chunks)

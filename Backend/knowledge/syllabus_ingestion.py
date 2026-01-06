# knowledge/syllabus_ingestion.py

import os
import faiss
import pickle
from pypdf import PdfReader
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract

# ---------------- CONFIG ---------------- #

EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CHUNK_SIZE = 500       # characters per chunk
CHUNK_OVERLAP = 100    # overlap for context continuity

BASE_DIR = os.path.dirname(__file__)
VECTOR_DB_PATH = os.path.join(BASE_DIR, "syllabus_faiss.index")
METADATA_PATH = os.path.join(BASE_DIR, "syllabus_chunks.pkl")

# ---------------------------------------- #

embedding_model = SentenceTransformer(EMBEDDING_MODEL)


# ---------- TEXT EXTRACTION ---------- #

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text


def extract_text_from_txt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()


def extract_text_from_image(file_path: str) -> str:
    image = Image.open(file_path)
    return pytesseract.image_to_string(image)


# ---------- CHUNKING ---------- #

def chunk_text(text: str) -> list[str]:
    chunks = []
    start = 0

    while start < len(text):
        end = start + CHUNK_SIZE
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks


# ---------- INGESTION PIPELINE ---------- #

def ingest_syllabus(file_path: str):
    """
    Main ingestion function.
    Call this ONCE when syllabus is uploaded.
    """

    if not os.path.exists(file_path):
        raise FileNotFoundError("Syllabus file not found")

    # 1️⃣ Extract text
    if file_path.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file_path.endswith(".txt"):
        text = extract_text_from_txt(file_path)
    elif file_path.lower().endswith((".png", ".jpg", ".jpeg")):
        text = extract_text_from_image(file_path)
    else:
        raise ValueError("Unsupported syllabus file format")

    if not text.strip():
        raise ValueError("No readable text found in syllabus")

    # 2️⃣ Chunk text
    chunks = chunk_text(text)

    # 3️⃣ Generate embeddings
    embeddings = embedding_model.encode(chunks, show_progress_bar=True)

    # 4️⃣ Create FAISS index
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    # 5️⃣ Save index + metadata
    faiss.write_index(index, VECTOR_DB_PATH)

    with open(METADATA_PATH, "wb") as f:
        pickle.dump(chunks, f)

    return {
        "status": "success",
        "chunks_created": len(chunks)
    }

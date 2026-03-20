from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os

# 🔥 FIX: Proper dotenv loading (IMPORTANT)
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

import fitz  # PyMuPDF
import chromadb
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract

# ---------------- APP SETUP ----------------
app = Flask(__name__)
CORS(app)

# ---------------- GEMINI SETUP ----------------
API_KEY = os.getenv("GEMINI_API_KEY")

# 🔥 DEBUG (keep for now)
print("Loaded API KEY:", API_KEY)

if not API_KEY:
    raise ValueError("GEMINI_API_KEY not set in environment variables")

client = genai.Client(api_key=API_KEY)

# ---------------- GLOBAL DATA ----------------
syllabus_data = ""

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- VECTOR DB SETUP ----------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("uploaded_docs")

# ---------------- HELPER FUNCTIONS ----------------

def extract_pdf_text(path):
    with fitz.open(path) as doc:
        return " ".join(page.get_text() for page in doc)

def extract_text_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def extract_image_text(path):
    image = Image.open(path)
    return pytesseract.image_to_string(image)

def clean_text(text):
    return " ".join(text.replace("\n", " ").split())

def chunk_text(text, size=400, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), size - overlap):
        chunks.append(" ".join(words[i:i + size]))
    return chunks

def gemini_generate(prompt):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

# ---------------- ROUTES ----------------

@app.route("/")
def home():
    return "AI Professor Backend (Gemini Latest) Running"

# -------- GENERAL MODE --------
@app.route("/general", methods=["POST"])
def general_mode():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    prompt = f"""
You are an AI Professor.

Teach clearly in structured format:
1. Concept overview
2. Step-by-step explanation
3. Example
4. Summary

QUESTION:
{question}
"""

    answer = gemini_generate(prompt)

    return jsonify({
        "mode": "general",
        "question": question,
        "answer": answer
    })

# -------- SYLLABUS MODE --------
@app.route("/upload-syllabus", methods=["POST"])
def upload_syllabus():
    global syllabus_data
    data = request.get_json(silent=True) or {}

    syllabus_data = data.get("syllabus", "")
    if not syllabus_data:
        return jsonify({"error": "Syllabus content is required"}), 400

    return jsonify({"status": "Syllabus stored successfully"})

@app.route("/syllabus", methods=["POST"])
def syllabus_mode():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    if not syllabus_data:
        return jsonify({"error": "No syllabus uploaded"}), 400

    prompt = f"""
You are an AI Professor.

Answer ONLY from syllabus.
If not present, say:
"This topic is not part of your syllabus."

SYLLABUS:
{syllabus_data}

QUESTION:
{question}
"""

    answer = gemini_generate(prompt)

    return jsonify({
        "mode": "syllabus",
        "question": question,
        "answer": answer
    })

# -------- FILE UPLOAD --------
@app.route("/upload-file", methods=["POST"])
def upload_file():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    try:
        if file.filename.lower().endswith(".pdf"):
            text = extract_pdf_text(filepath)
        elif file.filename.lower().endswith(".txt"):
            text = extract_text_file(filepath)
        elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
            text = extract_image_text(filepath)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        text = clean_text(text)
        if not text:
            return jsonify({"error": "No identifiable text found in file"}), 400

        chunks = chunk_text(text)
        if not chunks:
            return jsonify({"error": "Text too short to process"}), 400

        embeddings = embedding_model.encode(chunks).tolist()

        collection.upsert(
            documents=chunks,
            embeddings=embeddings,
            ids=[f"{file.filename}_{i}" for i in range(len(chunks))]
        )

        return jsonify({
            "status": "File processed successfully",
            "chunks_created": len(chunks)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------- ASK FROM FILE --------
@app.route("/ask-file", methods=["POST"])
def ask_file():
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        query_embedding = embedding_model.encode([question]).tolist()
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=4
        )

        docs = results.get("documents", [])
        if not docs or not docs[0]:
            return jsonify({"error": "No relevant context found. Please upload a document first."}), 404

        context = "\n".join(docs[0])

        prompt = f"""
Answer ONLY using this context.
If not found, say:
"Answer not available in uploaded documents."

CONTEXT:
{context}

QUESTION:
{question}
"""

        answer = gemini_generate(prompt)

        return jsonify({
            "mode": "file",
            "question": question,
            "answer": answer
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True)
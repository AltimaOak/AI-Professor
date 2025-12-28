from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
import fitz  # PyMuPDF
import chromadb
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract

# ---------------- APP SETUP ----------------
app = Flask(__name__)
CORS(app)

# ---------------- GEMINI SETUP ----------------
genai.configure(api_key=os.getenv("AIzaSyB6dy9tuNWAGu19vhna5vWYCv6Mx5AA2Wg"))
gemini_model = genai.GenerativeModel("gemini-2.5-flash")

# ---------------- GLOBAL DATA ----------------
syllabus_data = ""

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- VECTOR DB SETUP ----------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("uploaded_docs")

# ---------------- OCR PATH (WINDOWS FIX) ----------------
# Uncomment if needed
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---------------- HELPER FUNCTIONS ----------------
def extract_pdf_text(path):
    doc = fitz.open(path)
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
    response = gemini_model.generate_content(prompt)
    return response.text

# ---------------- ROUTES ----------------
@app.route("/")
def home():
    return "AI Professor Backend (Gemini) Running"

# -------- GENERAL MODE --------
@app.route("/general", methods=["POST"])
def general_mode():
    question = request.json.get("question", "")

    prompt = f"""
    You are an AI Professor.
    Explain clearly with examples.

    QUESTION:
    {question}
    """

    answer = gemini_generate(prompt)
    return jsonify({"answer": answer})

# -------- SYLLABUS MODE --------
@app.route("/upload-syllabus", methods=["POST"])
def upload_syllabus():
    global syllabus_data
    syllabus_data = request.json.get("syllabus", "")
    return jsonify({"status": "Syllabus stored successfully"})

@app.route("/syllabus", methods=["POST"])
def syllabus_mode():
    question = request.json.get("question", "")

    prompt = f"""
    You are an AI Professor.
    Answer ONLY using the syllabus below.
    If the question is outside the syllabus, reply:
    "This topic is not part of your syllabus."

    SYLLABUS:
    {syllabus_data}

    QUESTION:
    {question}
    """

    answer = gemini_generate(prompt)
    return jsonify({"answer": answer})

# -------- FILE UPLOAD (PDF / TXT / IMAGE) --------
@app.route("/upload-file", methods=["POST"])
def upload_file():
    file = request.files.get("file")

    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    if file.filename.lower().endswith(".pdf"):
        text = extract_pdf_text(filepath)
    elif file.filename.lower().endswith(".txt"):
        text = extract_text_file(filepath)
    elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        text = extract_image_text(filepath)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    text = clean_text(text)
    chunks = chunk_text(text)

    embeddings = embedding_model.encode(chunks).tolist()

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=[f"{file.filename}_{i}" for i in range(len(chunks))]
    )

    return jsonify({
        "status": "File processed successfully",
        "chunks_created": len(chunks)
    })

# -------- ASK FROM UPLOADED FILE --------
@app.route("/ask-file", methods=["POST"])
def ask_file():
    question = request.json.get("question", "")

    results = collection.query(
        query_texts=[question],
        n_results=4
    )

    context = "\n".join(results["documents"][0])

    prompt = f"""
    Answer ONLY using the context below.
    If the answer is not found, say:
    "Answer not available in uploaded documents."

    CONTEXT:
    {context}

    QUESTION:
    {question}
    """

    answer = gemini_generate(prompt)
    return jsonify({"answer": answer})

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True)

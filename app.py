from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import fitz
import chromadb
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract

# ---------------- APP SETUP ----------------
app = Flask(_name_)
CORS(app)

# ⚠ SECURITY WARNING: Move this to env variable later
client = OpenAI(
    api_key="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"
)

# ---------------- GLOBAL DATA ----------------
syllabus_data = ""

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- VECTOR DB SETUP ----------------
model = SentenceTransformer("all-MiniLM-L6-v2")

chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("uploaded_docs")

# ---------------- OCR PATH (WINDOWS FIX) ----------------
# Uncomment if pytesseract throws error
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# ---------------- HELPER FUNCTIONS ----------------
def extract_pdf_text(path):
    doc = fitz.open(path)
    return " ".join(page.get_text() for page in doc)

def extract_text_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def extract_image_text(path):
    img = Image.open(path)
    return pytesseract.image_to_string(img)

def clean_text(text):
    return " ".join(text.replace("\n", " ").split())

def chunk_text(text, size=400, overlap=50):
    words = text.split()
    chunks = []
    for i in range(0, len(words), size - overlap):
        chunks.append(" ".join(words[i:i + size]))
    return chunks

# ---------------- ROUTES ----------------
@app.route("/")
def home():
    return "AI Professor Backend Running"

# -------- GENERAL MODE --------
@app.route("/general", methods=["POST"])
def general_mode():
    question = request.json.get("question", "")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are an AI Professor. Explain clearly with examples."},
            {"role": "user", "content": question}
        ]
    )

    return jsonify({"answer": response.choices[0].message.content})

# -------- SYLLABUS MODE --------
@app.route("/upload-syllabus", methods=["POST"])
def upload_syllabus():
    global syllabus_data
    syllabus_data = request.json.get("syllabus", "")
    return jsonify({"status": "Syllabus stored"})

@app.route("/syllabus", methods=["POST"])
def syllabus_mode():
    question = request.json.get("question", "")

    prompt = f"""
    You are an AI Professor.
    Answer ONLY using the syllabus below.
    If the question is outside syllabus, reply:
    "This topic is not part of your syllabus."

    SYLLABUS:
    {syllabus_data}

    QUESTION:
    {question}
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return jsonify({"answer": response.choices[0].message.content})

# -------- FILE UPLOAD (PDF / TXT / IMAGE) --------
@app.route("/upload-file", methods=["POST"])
def upload_file():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    if file.filename.endswith(".pdf"):
        text = extract_pdf_text(filepath)
    elif file.filename.endswith(".txt"):
        text = extract_text_file(filepath)
    elif file.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        text = extract_image_text(filepath)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    text = clean_text(text)
    chunks = chunk_text(text)

    embeddings = model.encode(chunks).tolist()

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

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )

    return jsonify({"answer": response.choices[0].message.content})

# ---------------- RUN SERVER ----------------
if _name_ == "_main_":
    app.run(debug=True)
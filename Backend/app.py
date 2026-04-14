from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import fitz  # PyMuPDF
import chromadb
from sentence_transformers import SentenceTransformer
from PIL import Image
import pytesseract

# Load environment variables from .env file
load_dotenv()

# ---------------- APP SETUP ----------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

# ---- CORS HEADERS: applied to EVERY response (including 500 errors) ----
def _add_cors(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    return response

@app.after_request
def after_request(response):
    return _add_cors(response)

# Handle preflight OPTIONS requests for all routes
@app.route("/", methods=["OPTIONS"])
@app.route("/<path:path>", methods=["OPTIONS"])
def options_handler(path=""):
    return _add_cors(make_response("", 204))

# Global error handlers — MUST add CORS headers manually since after_request is skipped
@app.errorhandler(Exception)
def handle_exception(e):
    response = jsonify({"error": "Internal server error", "detail": str(e)})
    response.status_code = 500
    return _add_cors(response)

@app.errorhandler(404)
def not_found(e):
    response = jsonify({
        "error": "Endpoint not found",
        "available_endpoints": ["/", "/general", "/upload-syllabus", "/syllabus", "/upload-file", "/ask-file"]
    })
    response.status_code = 404
    return _add_cors(response)

@app.errorhandler(400)
def bad_request(e):
    response = jsonify({"error": "Bad request", "detail": str(e)})
    response.status_code = 400
    return _add_cors(response)

# ---------------- GEMINI SETUP ----------------
gemini_api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_GEMINI_API_KEY")
if not gemini_api_key:
    raise RuntimeError("GEMINI_API_KEY is required in environment variables")
genai.configure(api_key=gemini_api_key)
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

# ---------------- GLOBAL DATA ----------------
syllabus_data = ""

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------------- VECTOR DB SETUP ----------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("uploaded_docs")

# ---------------- OCR PATH (WINDOWS FIX) ----------------
# Uncomment if tesseract is installed:
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
    """Call Gemini and return text. Falls back to Groq Llama 3 on Gemini API errors."""
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API error: {str(e)[:100]}... Falling back to Groq...")
        try:
            import requests
            url = "https://api.groq.com/openai/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
                "Content-Type": "application/json"
            }
            data = {
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
            res = requests.post(url, json=data, headers=headers)
            if res.status_code == 200:
                return res.json()["choices"][0]["message"]["content"]
            else:
                raise RuntimeError(f"Groq API error HTTP {res.status_code}: {res.text}")
        except Exception as groq_err:
            raise RuntimeError(f"Both Gemini and Groq APIs failed. Gemini: {str(e)[:50]}... | Groq: {str(groq_err)}")

# ---------------- ROUTES ----------------
@app.route("/")
def home():
    return jsonify({"status": "AI Professor Backend (Gemini) Running", "port": 8000})

# -------- GENERAL MODE --------
@app.route("/general", methods=["GET", "POST"])
def general_mode():
    if request.method == "GET":
        return jsonify({
            "info": "POST JSON {question:'...'} to this endpoint for a response",
            "example": {"question": "What is a neural network?"}
        })

    data = request.get_json(force=True, silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    prompt = f"""You are an AI Professor teaching a class. 
Explain clearly with examples.

IMPORTANT: Your response MUST be in JSON format with exactly these two keys:
1. "answer": Your full detailed explanation (Markdown allowed).
2. "board_notes": A list of 3-5 short, punchy key concepts or definitions to write on the blackboard.

QUESTION:
{question}
"""
    raw_response = gemini_generate(prompt)
    
    # Simple JSON extraction in case the AI wraps it in code blocks or adds text
    import json
    import re
    try:
        # Look for JSON between triple backticks or just the first { and last }
        json_match = re.search(r'(\{.*\})', raw_response, re.DOTALL)
        if json_match:
            data = json.loads(json_match.group(1))
            return jsonify(data)
        else:
            # Fallback if no JSON found
            return jsonify({"answer": raw_response, "board_notes": []})
    except Exception as e:
        print(f"JSON Parsing error: {e}")
        return jsonify({"answer": raw_response, "board_notes": []})

# -------- SYLLABUS MODE --------
@app.route("/upload-syllabus", methods=["GET", "POST"])
def upload_syllabus():
    if request.method == "GET":
        return jsonify({
            "info": "POST JSON {syllabus:'...'} to save text for syllabus mode",
            "example": {"syllabus": "Week1: Intro to AI..."}
        })

    global syllabus_data
    data = request.get_json(force=True, silent=True) or {}
    syllabus_data = data.get("syllabus", "")
    return jsonify({"status": "Syllabus stored successfully"})

@app.route("/syllabus", methods=["GET", "POST"])
def syllabus_mode():
    if request.method == "GET":
        return jsonify({
            "info": "POST JSON {question:'...'} to query from syllabus context",
            "example": {"question": "Explain normalization"}
        })

    data = request.get_json(force=True, silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    prompt = f"""You are an AI Professor.
Answer ONLY using the syllabus below.
If the question is outside the syllabus, reply: "This topic is not part of your syllabus."

SYLLABUS:
{syllabus_data}

QUESTION:
{question}
"""
    answer = gemini_generate(prompt)
    return jsonify({"answer": answer})

# -------- FILE UPLOAD (PDF / TXT / IMAGE) --------
@app.route("/upload-file", methods=["GET", "POST"])
def upload_file():
    if request.method == "GET":
        return jsonify({
            "info": "POST multi-part file (key='file') to upload PDF/TXT/IMAGE",
            "supported_types": ["pdf", "txt", "png", "jpg", "jpeg"]
        })

    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)

    ext = file.filename.lower()
    if ext.endswith(".pdf"):
        text = extract_pdf_text(filepath)
    elif ext.endswith(".txt"):
        text = extract_text_file(filepath)
    elif ext.endswith((".png", ".jpg", ".jpeg")):
        text = extract_image_text(filepath)
    else:
        return jsonify({"error": "Unsupported file type"}), 400

    text = clean_text(text)
    if not text:
        return jsonify({"error": "No text could be extracted from the file"}), 400

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
@app.route("/ask-file", methods=["GET", "POST"])
def ask_file():
    if request.method == "GET":
        return jsonify({
            "info": "POST JSON {question:'...'} to query uploaded file context"
        })

    data = request.get_json(force=True, silent=True) or {}
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    results = collection.query(query_texts=[question], n_results=4)
    context = "\n".join(results["documents"][0]) if results["documents"] else ""

    if not context:
        return jsonify({"answer": "No documents uploaded yet. Please upload a file first."})

    prompt = f"""Answer ONLY using the context below.
If the answer is not found, say: "Answer not available in uploaded documents."

CONTEXT:
{context}

QUESTION:
{question}
"""
    answer = gemini_generate(prompt)
    return jsonify({"answer": answer})

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "True").lower() in ("true", "1", "yes")
    print(f"Starting AI Professor on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)

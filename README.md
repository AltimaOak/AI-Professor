# AI Professor - Learn with Professor Bones 🦴 💀

AI Professor is an interactive learning platform featuring **Professor Bones**, a funny and engaging skeleton character who helps you master any topic. The application supports general inquiry and a specialized syllabus mode where you can upload your own study materials for personalized teaching.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v10+)
- Gemini API Key (set in `Backend/.env`)

---

### 1. Backend Setup & Startup
The backend is a Flask API that handles query classification, lesson planning, and document retrieval.

1. **Environment Variables**:
   Ensure you have a `.env` file in the `Backend/` directory with your `GEMINI_API_KEY`.

2. **Run the Backend** (from the project root):
   ```powershell
   # Navigate to the project root
   cd D:/aiptest/AI-Professor/
   
   # Run as a module to support absolute package imports
   python -m Backend.main
   ```
   The backend will start at `http://localhost:8000`.

---

### 2. Frontend Setup & Startup
The frontend is a modern React application built with Vite, Tailwind CSS, and Shadcn UI.

1. **Install Dependencies**:
   ```powershell
   cd D:/aiptest/AI-Professor/Frontend
   npm install
   ```

2. **Run the Development Server**:
   ```powershell
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, Framer Motion, Lucide Icons.
- **Backend**: Flask, Python, Google Gemini AI, ChromaDB (Vector Search), PyMuPDF (PDF Parsing), Pytesseract (OCR).

## 📖 Key Features
- **General Mode**: Ask any question and get an engaging explanation from Professor Bones.
- **Syllabus Mode**: Upload PDFs, text files, or images to get teaching content strictly based on your curriculum.
- **Interactive Canvas**: Use point, draw, and highlight tools to interact with the teaching material.
- **Hallucination Guard**: Multi-module backend architecture to ensure accuracy and safety.

---
© 2024 AI Professor Team. Making learning fun, one bone at a time! 🦴

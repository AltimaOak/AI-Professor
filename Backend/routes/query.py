from groq import Groq
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config import Config
from knowledge.syllabus_retriever import retrieve_context

router = APIRouter()

# ── Groq client ──────────────────────────────────────────────────────────────
_groq = Groq(api_key=Config.GROQ_API_KEY)
GROQ_MODEL = "llama-3.1-8b-instant"


def _call_groq(prompt: str) -> str:
    response = _groq.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1024,
    )
    return response.choices[0].message.content


# ── Request schemas ───────────────────────────────────────────────────────────
class GeneralQuery(BaseModel):
    question: str

class SyllabusQuery(BaseModel):
    question: str
    student_id: str


# ── Routes ────────────────────────────────────────────────────────────────────
@router.post("/general")
async def general_query(body: GeneralQuery):
    prompt = f"""You are an AI Professor. Explain the following concept clearly with examples.

QUESTION: {body.question}"""
    try:
        return {"answer": _call_groq(prompt)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/syllabus")
async def syllabus_query(body: SyllabusQuery):
    context = retrieve_context(body.question, body.student_id)

    if not context:
        return {"answer": "This topic is not covered in your uploaded syllabus."}

    prompt = f"""You are an AI Professor. Answer ONLY using the context below.
If the answer is not found in the context, say: "This topic is not covered in your syllabus."

CONTEXT:
{context}

QUESTION: {body.question}"""

    try:
        return {"answer": _call_groq(prompt)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
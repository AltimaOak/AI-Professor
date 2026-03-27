from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from knowledge.syllabus_ingestion import ingest_file

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx", ".png", ".jpg", ".jpeg"}

@router.post("/file")
async def upload_file(
    file: UploadFile = File(...),
    student_id: str = Form(...),
):
    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{suffix}'. Allowed: {ALLOWED_EXTENSIONS}",
        )

    file_bytes = await file.read()

    try:
        result = ingest_file(file_bytes, file.filename, student_id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
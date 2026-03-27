from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from knowledge.syllabus_ingestion import ingest_file
from core.db import get_db
from core.deps import get_current_user
from models.user import User
from models.uploaded_file import UploadedFileModel

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".txt", ".docx", ".png", ".jpg", ".jpeg"}

@router.post("/file")
async def upload_file(
    file: UploadFile = File(...),
    student_id: str = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
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
        
        size_kb = len(file_bytes) // 1024
        file_type = suffix.lstrip('.')
        
        new_file = UploadedFileModel(
            user_id=current_user.id,
            filename=file.filename,
            file_type=file_type,
            file_size_kb=size_kb,
            qdrant_collection=result.get("collection", f"ai_professor_{student_id}")
        )
        db.add(new_file)
        await db.commit()
        await db.refresh(new_file)
        
        result["file_id"] = str(new_file.id)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")

@router.get("/files")
async def get_uploaded_files(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from sqlalchemy.future import select
    stmt = select(UploadedFileModel).where(UploadedFileModel.user_id == current_user.id).order_by(UploadedFileModel.uploaded_at.desc())
    result = await db.execute(stmt)
    files = result.scalars().all()
    
    return [
        {
            "id": str(f.id),
            "name": f.filename,
            "type": f.file_type,
            "size": f.file_size_kb,
            "uploadedAt": f.uploaded_at.isoformat() if f.uploaded_at else None
        }
        for f in files
    ]
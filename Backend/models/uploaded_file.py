import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from core.db import Base

class UploadedFileModel(Base):
    __tablename__ = "uploaded_files"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(20), nullable=False)
    file_size_kb = Column(Integer, nullable=True)
    qdrant_collection = Column(String(255), nullable=False)
    chunk_count = Column(Integer, server_default=text("0"))
    is_active = Column(Boolean, server_default=text("TRUE"))
    uploaded_at = Column(DateTime(timezone=True), server_default=text("NOW()"))

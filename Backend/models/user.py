import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Text, DateTime, text
from sqlalchemy.dialects.postgresql import UUID

from core.db import Base

class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()")
    )
    full_name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=True)
    auth_provider = Column(String(50), server_default="email")
    avatar_url = Column(Text, nullable=True)
    is_active = Column(Boolean, server_default=text("TRUE"))
    created_at = Column(DateTime(timezone=True), server_default=text("NOW()"))
    updated_at = Column(DateTime(timezone=True), server_default=text("NOW()"))

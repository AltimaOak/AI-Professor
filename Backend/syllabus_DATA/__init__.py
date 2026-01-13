# Backend/syllabus_DATA/__init__.py

from .pdf_parse import parse_pdf_file
from .image_parse import parse_image_file
from .text_parse import parse_text_file

__all__ = [
    "parse_pdf_file",
    "parse_image_file",
    "parse_text_file",
]

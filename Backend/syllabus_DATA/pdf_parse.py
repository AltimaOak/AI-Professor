# Backend/syllabus_DATA/pdf_parse.py

import fitz  # PyMuPDF


def parse_pdf_file(file_path: str) -> str:
    """
    Extracts text from a PDF file using PyMuPDF
    """

    try:
        doc = fitz.open(file_path)
        full_text = []

        for page in doc:
            text = page.get_text()
            if text:
                full_text.append(text)

        doc.close()

        combined_text = " ".join(full_text)
        cleaned_text = " ".join(combined_text.split())

        return cleaned_text

    except Exception as e:
        raise Exception(f"Error parsing PDF file: {str(e)}")

# Backend/syllabus_DATA/image_parse.py

from PIL import Image
import pytesseract


def parse_image_file(file_path: str) -> str:
    """
    Extracts text from an image using OCR (Tesseract)
    """

    try:
        image = Image.open(file_path)
        raw_text = pytesseract.image_to_string(image)

        cleaned_text = " ".join(raw_text.split())

        return cleaned_text

    except Exception as e:
        raise Exception(f"Error parsing image file: {str(e)}")

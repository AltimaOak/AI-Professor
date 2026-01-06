# Backend/syllabus_DATA/text_parse.py

def parse_text_file(file_path: str) -> str:
    """
    Extracts and cleans text from a .txt file
    """

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            text = file.read()

        # Basic cleaning
        cleaned_text = " ".join(text.split())

        return cleaned_text

    except Exception as e:
        raise Exception(f"Error parsing text file: {str(e)}")

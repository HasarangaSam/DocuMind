import fitz
from pathlib import Path


def extract_pdf_text(file_path: str):
    """
    Extract text from a PDF while preserving page numbers.
    """

    document = fitz.open(file_path)

    pages = []

    for page_number, page in enumerate(document, start=1):

        page_text = page.get_text().strip()

        if page_text:
            pages.append({
                "page": page_number,
                "text": page_text
            })

    document.close()

    return pages


def extract_txt_text(file_path: str):
    """
    Extract text from a TXT file.
    """

    with open(file_path, "r", encoding="utf-8") as file:
        text = file.read().strip()

    if not text:
        raise ValueError("The uploaded TXT file is empty.")

    return [{
        "page": None,
        "text": text
    }]


def load_document(file_path: str, filename: str):
    """
    Identify the document type and extract its content.
    """

    extension = Path(filename).suffix.lower()

    if extension == ".pdf":
        return extract_pdf_text(file_path)

    elif extension == ".txt":
        return extract_txt_text(file_path)

    else:
        raise ValueError("Only PDF and TXT files are supported.")
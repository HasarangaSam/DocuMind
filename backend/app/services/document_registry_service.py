import json
from pathlib import Path
from datetime import datetime, timezone

# Store document information in a JSON file.
DATA_DIR = Path("data")
REGISTRY_FILE = DATA_DIR / "documents.json"


def load_documents():
    """Load all registered documents from the JSON file."""

    DATA_DIR.mkdir(exist_ok=True)

    if not REGISTRY_FILE.exists():
        return []

    with open(REGISTRY_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_documents(documents: list):
    """Save document information to the JSON file."""

    DATA_DIR.mkdir(exist_ok=True)

    with open(REGISTRY_FILE, "w", encoding="utf-8") as file:
        json.dump(documents, file, indent=4)


def register_document(document: dict):
    """Add a newly uploaded document to the registry."""

    documents = load_documents()
    documents.append(document)

    save_documents(documents)


def get_all_documents():
    """Return all uploaded documents."""

    return load_documents()


def get_document(document_id: str):
    """Find a document using its ID."""

    documents = load_documents()

    for document in documents:
        if document["document_id"] == document_id:
            return document

    return None
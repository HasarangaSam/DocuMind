import os
import uuid

from pathlib import Path
from datetime import datetime, timezone

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.services.document_service import load_document
from app.services.chunking_service import split_documents
from app.services.vector_store_service import store_chunks
from app.services.document_registry_service import (
    register_document,
    get_all_documents,
    get_document
)


router = APIRouter(prefix="/api/documents", tags=["Documents"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    original_filename = Path(file.filename or "document").name
    extension = Path(original_filename).suffix.lower()

    # Validate supported file types.
    if extension not in [".pdf", ".txt"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and TXT files are supported."
        )

    document_id = str(uuid.uuid4())

    unique_filename = f"{document_id}{extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # Read the uploaded file.
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty."
            )

        # Save the original document.
        with open(file_path, "wb") as uploaded_file:
            uploaded_file.write(content)

        # Step 1: Extract text.
        pages = load_document(file_path, original_filename)

        if not pages:
            raise HTTPException(
                status_code=400,
                detail="No extractable text found in the document. Scanned PDFs are not supported."
            )

        # Step 2: Split text into chunks.
        chunks = split_documents(pages, original_filename)

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No readable text chunks found in the document."
            )

        # Step 3: Generate embeddings and store chunks.
        total_chunks = store_chunks(chunks, document_id)

        # Step 4: Prepare document information.
        document_info = {
            "document_id": document_id,
            "filename": original_filename,
            "file_type": extension.replace(".", "").upper(),
            "total_pages": len(pages) if extension == ".pdf" else None,
            "total_chunks": total_chunks,
            "total_characters": sum(
                len(page["text"]) for page in pages
            ),
            "uploaded_at": datetime.now(timezone.utc).isoformat()
        }

        # Step 5: Save document information.
        register_document(document_info)

        return {
            "message": "Document uploaded and indexed successfully.",
            "document": document_info
        }

    except HTTPException:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise

    except Exception as error:
        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=f"Document processing failed: {str(error)}"
        )


@router.get("/")
def list_documents():
    """Return all uploaded document information."""

    return {
        "documents": get_all_documents()
    }


@router.get("/{document_id}")
def get_document_details(document_id: str):
    """Return information about one uploaded document."""

    document = get_document(document_id)

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
        )

    return {
        "document": document
    }
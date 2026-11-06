import uuid
import chromadb

from app.core.config import CHROMA_DB_PATH
from app.services.embedding_service import generate_embeddings


# Create persistent ChromaDB client
chroma_client = chromadb.PersistentClient(
    path=CHROMA_DB_PATH
)

# Create or retrieve collection
collection = chroma_client.get_or_create_collection(
    name="documind_documents",
    metadata={"hnsw:space": "cosine"}
)


def store_chunks(chunks: list, document_id: str):
    """
    Generate embeddings and store document chunks in ChromaDB.
    """

    if not chunks:
        raise ValueError("No text chunks available to store.")

    texts = [chunk["text"] for chunk in chunks]

    # Generate embeddings
    embeddings = generate_embeddings(texts)

    # Prepare metadata
    metadatas = []

    for chunk in chunks:

        metadata = {
            "filename": chunk["metadata"]["filename"],
            "document_id": document_id
        }

        # ChromaDB metadata cannot contain None values
        page_number = chunk["metadata"]["page"]

        if page_number is not None:
            metadata["page"] = page_number

        metadatas.append(metadata)

    # Generate unique IDs for chunks
    ids = [str(uuid.uuid4()) for _ in chunks]

    # Store everything in ChromaDB
    collection.add(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadatas
    )

    return len(chunks)
from app.services.embedding_service import generate_embeddings
from app.services.vector_store_service import collection


def retrieve_documents(question: str, document_id: str, top_k: int = 3):
    """
    Retrieve the most relevant chunks for a user's question.
    """

    # Convert the question into an embedding
    question_embedding = generate_embeddings([question])

    # Search ChromaDB within the selected document
    results = collection.query(
        query_embeddings=question_embedding,
        n_results=top_k,
        where={"document_id": document_id}
    )

    # No matching documents found
    if not results["documents"] or not results["documents"][0]:
        return []

    retrieved_chunks = []

    for i, text in enumerate(results["documents"][0]):

        metadata = results["metadatas"][0][i]

        retrieved_chunks.append({
            "text": text,
            "filename": metadata["filename"],
            "page": metadata.get("page")
        })

    return retrieved_chunks
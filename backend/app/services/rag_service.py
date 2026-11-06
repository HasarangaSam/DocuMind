from app.services.retrieval_service import retrieve_documents
from app.services.llm_service import generate_answer


def answer_question(question: str, document_id: str, top_k: int = 3):
    """
    Complete RAG pipeline:
    1. Retrieve relevant document chunks.
    2. Build context.
    3. Generate answer using Groq.
    4. Return answer and sources.
    """

    # Retrieve relevant chunks
    retrieved_chunks = retrieve_documents(
        question=question,
        document_id=document_id,
        top_k=top_k
    )

    if not retrieved_chunks:
        return {
            "answer": "I couldn't find relevant information in the uploaded document.",
            "sources": []
        }

    # Combine retrieved chunks into context
    context = "\n\n".join(
        chunk["text"] for chunk in retrieved_chunks
    )

    # Generate answer using Groq
    answer = generate_answer(
        question=question,
        context=context
    )

    # Prepare source references
    sources = [
        {
            "filename": chunk["filename"],
            "page": chunk["page"],
            "snippet": chunk["text"]
        }
        for chunk in retrieved_chunks
    ]

    return {
        "answer": answer,
        "sources": sources
    }
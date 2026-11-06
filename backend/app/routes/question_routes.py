from fastapi import APIRouter, HTTPException

from app.schemas.question_schema import QuestionRequest
from app.services.rag_service import answer_question
from app.services.document_registry_service import get_document


router = APIRouter(prefix="/api/questions", tags=["Questions"])


@router.post("/ask")
def ask_question(request: QuestionRequest):

    try:
        # Check whether the requested document exists.
        document = get_document(request.document_id)

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document not found. Please upload a document first."
            )

        result = answer_question(
            question=request.question.strip(),
            document_id=request.document_id,
            top_k=request.top_k
        )

        return {
            "question": request.question,
            "document_id": request.document_id,
            "answer": result["answer"],
            "sources": result["sources"]
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Question answering failed: {str(error)}"
        )
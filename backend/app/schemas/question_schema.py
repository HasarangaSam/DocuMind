from pydantic import BaseModel, Field

class QuestionRequest(BaseModel):
    document_id: str
    question: str = Field(min_length=1, max_length=2000)
    top_k: int = Field(default=3, ge=1, le=10)
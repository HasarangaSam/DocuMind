from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.document_routes import router as document_router
from app.routes.question_routes import router as question_router


app = FastAPI(
    title="DocuMind API",
    description="AI-Powered Document Question Answering System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(document_router)
app.include_router(question_router)


@app.get("/")
def root():
    return {"message": "Welcome to DocuMind API"}


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "DocuMind"
    }
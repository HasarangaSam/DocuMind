# DocuMind – AI-Powered Document Question Answering System

DocuMind is a lightweight Retrieval-Augmented Generation (RAG) application that allows users to upload PDF and TXT documents and ask questions about their content.

Instead of relying only on an LLM's existing knowledge, DocuMind retrieves relevant information from uploaded documents and uses that context to generate answers with source references.

## Features

- Upload PDF and TXT documents.
- Extract text from documents using PyMuPDF.
- Split extracted text into smaller chunks.
- Generate text embeddings using Hugging Face Sentence Transformers.
- Store document embeddings in ChromaDB.
- Retrieve relevant document chunks using semantic similarity.
- Generate context-based answers using the Groq API.
- Display source filenames, page numbers and relevant text snippets.
- Maintain uploaded document information locally.

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Backend

- Python
- FastAPI
- LangChain Text Splitters
- PyMuPDF
- Sentence Transformers
- ChromaDB
- Groq API

### AI Models

- Embedding Model: `all-MiniLM-L6-v2`
- LLM: `openai/gpt-oss-20b` through Groq

## RAG Architecture

DocuMind implements a basic Retrieval-Augmented Generation pipeline.

### Document Processing

1. User uploads a PDF or TXT document.
2. FastAPI receives the document.
3. PyMuPDF extracts text from PDF pages.
4. LangChain splits the extracted text into smaller chunks.
5. Sentence Transformers converts chunks into numerical embeddings.
6. ChromaDB stores the embeddings with document metadata.

### Question Answering

1. User submits a question about an uploaded document.
2. The question is converted into an embedding using the same embedding model.
3. ChromaDB retrieves the most relevant document chunks using semantic similarity.
4. Retrieved chunks are combined into a context.
5. The Groq LLM generates an answer using the retrieved context.
6. The application returns the answer with source references.

## Project Structure

```text
DocuMind/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   └── config.py
│   │   │
│   │   ├── routes/
│   │   │   ├── document_routes.py
│   │   │   └── question_routes.py
│   │   │
│   │   ├── schemas/
│   │   │   └── question_schema.py
│   │   │
│   │   ├── services/
│   │   │   ├── document_service.py
│   │   │   ├── chunking_service.py
│   │   │   ├── embedding_service.py
│   │   │   ├── vector_store_service.py
│   │   │   ├── retrieval_service.py
│   │   │   ├── llm_service.py
│   │   │   ├── rag_service.py
│   │   │   └── document_registry_service.py
│   │   │
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── chroma_db/
│   ├── data/
│   ├── .env
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.tsx
    │   ├── index.css
    │   ├── main.tsx
    │   └── types.ts
    │
    ├── .env
    └── package.json
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- A Groq API key

### 1. Clone the repository

```bash
git clone https://github.com/hasarangasam/DocuMind.git

cd DocuMind
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the backend directory:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHROMA_DB_PATH=./chroma_db
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## API Endpoints

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| GET    | `/`                            | API welcome message             |
| GET    | `/api/health`                  | Backend health check            |
| POST   | `/api/documents/upload`        | Upload and process a document   |
| GET    | `/api/documents/`              | List uploaded documents         |
| GET    | `/api/documents/{document_id}` | Get document details            |
| POST   | `/api/questions/ask`           | Ask a question about a document |

## Current Limitations

- Only PDF and TXT documents are supported.
- Scanned PDFs and OCR are not supported.
- No authentication or user management.
- Documents and vector data are stored locally.
- No conversational memory between questions.
- Answers depend on the quality of extracted text and retrieved chunks.

## Learning Objectives

This project was developed to understand practical AI integration and the fundamentals of Retrieval-Augmented Generation.

Key concepts explored:

- Document text extraction
- Text chunking and overlap
- Text embeddings
- Vector databases
- Semantic similarity search
- Context retrieval
- LLM integration
- Source-grounded answer generation

---

**DocuMind** – Making document knowledge easier to explore.

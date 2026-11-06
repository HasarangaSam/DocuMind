import type { Document, QuestionResponse } from "../types";

// Backend API base URL.
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Upload a PDF or TXT document.
export async function uploadDocument(file: File): Promise<Document> {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/documents/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Document upload failed.");
  }

  return data.document;
}

// Retrieve all uploaded documents.
export async function getDocuments(): Promise<Document[]> {
  const response = await fetch(`${API_URL}/api/documents/`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to load documents.");
  }

  return data.documents;
}

// Ask a question about a selected document.
export async function askQuestion(
  documentId: string,
  question: string,
): Promise<QuestionResponse> {
  const response = await fetch(`${API_URL}/api/questions/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      document_id: documentId,
      question,
      top_k: 3,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to generate an answer.");
  }

  return data;
}

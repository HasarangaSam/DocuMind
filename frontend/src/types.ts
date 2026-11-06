// Information about an uploaded document.
export interface Document {
  document_id: string;
  filename: string;
  file_type: string;
  total_pages: number | null;
  total_chunks: number;
  total_characters: number;
  uploaded_at: string;
}

// Information about a retrieved document source.
export interface Source {
  filename: string;
  page: number | null;
  snippet: string;
}

// Response returned by the question API.
export interface QuestionResponse {
  question: string;
  document_id: string;
  answer: string;
  sources: Source[];
}

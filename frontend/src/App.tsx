import { useEffect, useState } from "react";

import type { Document, QuestionResponse } from "./types";

import { uploadDocument, getDocuments, askQuestion } from "./services/api";

function App() {
  // Uploaded documents.
  const [documents, setDocuments] = useState<Document[]>([]);

  // Currently selected document.
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  // File upload states.
  const [uploading, setUploading] = useState(false);

  // Question and answer states.
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QuestionResponse | null>(null);
  const [asking, setAsking] = useState(false);

  // General error message.
  const [error, setError] = useState("");

  // Load previously uploaded documents when the page opens.
  useEffect(() => {
    async function loadDocuments() {
      try {
        const data = await getDocuments();

        setDocuments(data);

        if (data.length > 0) {
          setSelectedDocumentId(data[0].document_id);
        }
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load documents.",
        );
      }
    }

    loadDocuments();
  }, []);

  // Handle document upload.
  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setResult(null);

    setUploading(true);

    try {
      const uploadedDocument = await uploadDocument(file);

      // Add the new document to the document list.
      setDocuments((previous) => [uploadedDocument, ...previous]);

      // Automatically select the newly uploaded document.
      setSelectedDocumentId(uploadedDocument.document_id);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Document upload failed.",
      );
    } finally {
      setUploading(false);

      // Allow uploading the same file again.
      event.target.value = "";
    }
  }

  // Handle question submission.
  async function handleAskQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedDocumentId || !question.trim()) {
      setError("Please select a document and enter a question.");
      return;
    }

    setError("");
    setResult(null);
    setAsking(true);

    try {
      const response = await askQuestion(selectedDocumentId, question.trim());

      setResult(response);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setAsking(false);
    }
  }

  // Find the currently selected document.
  const selectedDocument = documents.find(
    (document) => document.document_id === selectedDocumentId,
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Docu<span className="text-blue-600">Mind</span>
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              AI-powered document question answering
            </p>
          </div>

          <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700">
            ● AI Assistant
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Introduction */}
        <section className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Chat with your documents
          </h2>

          <p className="mt-3 max-w-2xl text-slate-500">
            Upload a PDF or text document and ask questions. DocuMind retrieves
            relevant information and generates answers with document references.
          </p>
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Section */}
          <aside className="space-y-6 lg:col-span-1">
            {/* Upload Card */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Upload Document</h3>

              <p className="mt-2 text-sm text-slate-500">
                Supported formats: PDF and TXT
              </p>

              <label className="mt-5 flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-500 hover:bg-blue-50">
                <span className="text-3xl">📄</span>

                <span className="mt-3 text-sm font-semibold text-blue-600">
                  {uploading ? "Processing document..." : "Choose a file"}
                </span>

                <span className="mt-2 text-xs text-slate-400">PDF or TXT</span>

                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {uploading && (
                <p className="mt-4 text-center text-sm text-blue-600">
                  Extracting text and generating embeddings...
                </p>
              )}
            </section>

            {/* Document List */}
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Documents</h3>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                  {documents.length}
                </span>
              </div>

              {documents.length === 0 ? (
                <p className="mt-5 text-sm text-slate-400">
                  No documents uploaded yet.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {documents.map((document) => (
                    <button
                      key={document.document_id}
                      onClick={() => {
                        setSelectedDocumentId(document.document_id);
                        setResult(null);
                        setError("");
                      }}
                      className={`w-full rounded-lg border p-3 text-left transition ${
                        selectedDocumentId === document.document_id
                          ? "border-blue-300 bg-blue-50"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <p className="truncate text-sm font-medium">
                        📄 {document.filename}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {document.file_type} · {document.total_chunks} chunks
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Selected Document Information */}
            {selectedDocument && (
              <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="font-semibold">Document Information</h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-slate-400">Filename</p>
                    <p className="mt-1 break-all font-medium">
                      {selectedDocument.filename}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">File type</span>
                    <span className="font-medium">
                      {selectedDocument.file_type}
                    </span>
                  </div>

                  {selectedDocument.total_pages !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pages</span>
                      <span className="font-medium">
                        {selectedDocument.total_pages}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-slate-500">Text chunks</span>
                    <span className="font-medium">
                      {selectedDocument.total_chunks}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Characters</span>
                    <span className="font-medium">
                      {selectedDocument.total_characters.toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>
            )}
          </aside>

          {/* Right Section */}
          <section className="space-y-6 lg:col-span-2">
            {/* Question Card */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Ask a Question</h3>

              <p className="mt-2 text-sm text-slate-500">
                Ask anything about your selected document.
              </p>

              <form onSubmit={handleAskQuestion} className="mt-5">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Example: What are the main topics covered in this document?"
                  rows={4}
                  maxLength={2000}
                  disabled={!selectedDocumentId || asking}
                  className="w-full resize-none rounded-lg border border-slate-200 p-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50"
                />

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {question.length}/2000 characters
                  </span>

                  <button
                    type="submit"
                    disabled={!selectedDocumentId || !question.trim() || asking}
                    className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {asking ? "Generating..." : "Ask DocuMind →"}
                  </button>
                </div>
              </form>
            </div>

            {/* Answer Section */}
            {asking && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-6">
                <p className="font-medium text-blue-700">
                  DocuMind is thinking...
                </p>

                <p className="mt-2 text-sm text-blue-600">
                  Retrieving relevant document information and generating an
                  answer.
                </p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* AI Answer */}
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">AI Answer</h3>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                      Generated
                    </span>
                  </div>

                  <div className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {result.answer}
                  </div>
                </section>

                {/* Source References */}
                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Source References</h3>

                    <span className="text-sm text-slate-400">
                      {result.sources.length} sources
                    </span>
                  </div>

                  {result.sources.length === 0 ? (
                    <p className="mt-4 text-sm text-slate-400">
                      No source references available.
                    </p>
                  ) : (
                    <div className="mt-5 space-y-4">
                      {result.sources.map((source, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm font-semibold">
                              📄 {source.filename}
                            </p>

                            {source.page !== null && (
                              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                                Page {source.page}
                              </span>
                            )}
                          </div>

                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {source.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* Empty State */}
            {!result && !asking && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <div className="text-4xl">💬</div>

                <h3 className="mt-4 font-semibold">
                  Your answers will appear here
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Upload a document, select it and ask your first question.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 text-center text-sm text-slate-400">
          DocuMind · AI-Powered Document Question Answering System
        </div>
      </footer>
    </div>
  );
}

export default App;

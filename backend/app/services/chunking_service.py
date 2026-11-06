from langchain_text_splitters import RecursiveCharacterTextSplitter


# Configure text splitter
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100,
    separators=["\n\n", "\n", " ", ""]
)


def split_documents(pages: list, filename: str):
    """
    Split extracted document pages into smaller chunks.

    Each chunk retains its source filename and page number.
    """

    chunks = []

    for page in pages:

        page_number = page["page"]
        page_text = page["text"]

        # Split individual page content
        page_chunks = text_splitter.split_text(page_text)

        for chunk in page_chunks:

            chunks.append({
                "text": chunk,
                "metadata": {
                    "filename": filename,
                    "page": page_number
                }
            })

    return chunks
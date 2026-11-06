from sentence_transformers import SentenceTransformer

from app.core.config import EMBEDDING_MODEL


# Load the embedding model once when the application starts
embedding_model = SentenceTransformer(EMBEDDING_MODEL)


def generate_embeddings(texts: list[str]):
    """
    Convert text into numerical vectors using Hugging Face.
    """

    embeddings = embedding_model.encode(texts)

    return embeddings.tolist()
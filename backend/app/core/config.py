import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b"
)

EMBEDDING_MODEL = os.getenv(
    "EMBEDDING_MODEL",
    "all-MiniLM-L6-v2"
)

CHROMA_DB_PATH = os.getenv(
    "CHROMA_DB_PATH",
    "./chroma_db"
)

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing!")
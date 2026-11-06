from groq import Groq

from app.core.config import GROQ_API_KEY, GROQ_MODEL


# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)


def generate_answer(question: str, context: str):
    """
    Generate an answer using the retrieved document context.
    """

    prompt = f"""
    You are DocuMind, an AI document question-answering assistant.

    Answer the user's question using ONLY the information
    provided in the document context.

    Instructions:
    - Do not use outside knowledge.
    - Do not invent information.
    - If the answer is not available in the context,
      clearly say that the information was not found
      in the uploaded document.
    - Provide a clear and concise answer.

    Document Context:
    {context}

    User Question:
    {question}

    Answer:
    """

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content
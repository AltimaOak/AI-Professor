# modes/syllabus_model.py
import sys
import os

# Ensure Backend is in Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Imports
try:
    from Backend.knowledge.syllabus_retriever import retrieve_syllabus_context
except ModuleNotFoundError:
    # Temporary fallback (for testing)
    def retrieve_syllabus_context(query: str):
        return None

try:
    from Backend.llm_selector.llm_model_selection import select_llm_and_generate
except ModuleNotFoundError:
    # Temporary fallback (for testing)
    def select_llm_and_generate(**kwargs):
        return "LLM not connected."

def run_syllabus_mode(user_query: str) -> dict:
    """
    Entry point for Syllabus Study Session.
    Answers strictly from syllabus content.
    """

    # 0️⃣ Validate input
    if not user_query or not user_query.strip():
        return {
            "status": "error",
            "message": "Empty query received"
        }

    # 1️⃣ Retrieve relevant syllabus chunks
    syllabus_context = retrieve_syllabus_context(user_query)

    # 2️⃣ If nothing found → outside syllabus
    if not syllabus_context:
        return {
            "status": "out_of_syllabus",
            "mode": "syllabus",
            "answer": "This topic is not part of your syllabus."
        }

    # 3️⃣ Strict syllabus‑only system prompt
    system_prompt = (
        "You are AI Professor.\n"
        "You must answer ONLY using the provided syllabus content.\n"
        "Do not add external knowledge.\n"
        "If the answer is not explicitly present in the syllabus, reply exactly:\n"
        "'This topic is not part of your syllabus.'"
    )

    # 4️⃣ Generate answer using selected LLM
    answer = select_llm_and_generate(
        query=user_query,
        context=syllabus_context,
        system_prompt=system_prompt,
        mode="syllabus"
    )

    # 5️⃣ Final response
    return {
        "status": "success",
        "mode": "syllabus",
        "answer": answer
    }

# Local test
if __name__ == "__main__":
    test_query = "Explain normalization in DBMS"
    result = run_syllabus_mode(test_query)
    print(result)

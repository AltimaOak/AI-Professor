# modes/syllabus_model.py

from knowledge.syllabus_retriever import retrieve_syllabus_context
from llm_selector.llm_model_selection import select_llm_and_generate


def run_syllabus_mode(user_query: str) -> dict:
    """
    Entry point for Syllabus Study Session
    """

    if not user_query or not user_query.strip():
        return {
            "status": "error",
            "message": "Empty query received"
        }

    # 1️⃣ Retrieve relevant syllabus chunks
    syllabus_context = retrieve_syllabus_context(user_query)

    # If nothing relevant found → outside syllabus
    if not syllabus_context:
        return {
            "status": "out_of_syllabus",
            "answer": "This topic is not part of your syllabus."
        }

    # 2️⃣ Create strict syllabus prompt
    system_prompt = (
        "You are an AI Professor.\n"
        "Answer ONLY using the syllabus content provided.\n"
        "If the answer is not present in the syllabus, reply exactly:\n"
        "'This topic is not part of your syllabus.'"
    )

    # 3️⃣ Generate answer using selected LLM
    answer = select_llm_and_generate(
        query=user_query,
        context=syllabus_context,
        system_prompt=system_prompt,
        mode="syllabus"
    )

    return {
        "status": "success",
        "mode": "syllabus",
        "answer": answer
    }

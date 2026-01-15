import sys
import os
from typing import Dict, Any

# --------------------------------------------------
# Ensure Backend is in Python path
# --------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.append(BASE_DIR)

# --------------------------------------------------
# Imports
# --------------------------------------------------
from Backend.classification.query_classifier import QueryClassifier
from Backend.llm_selector.llm_model_selection import select_llm_and_generate
from safety.hallucination_guard import hallucination_guard
from safety.source_validation import validate_sources

# --------------------------------------------------
# Initialize reusable components
# --------------------------------------------------
query_classifier = QueryClassifier()


# --------------------------------------------------
# General Mode Orchestrator
# --------------------------------------------------
def run_general_mode(user_query: str, context: Dict[str, Any] | None = None) -> Dict[str, Any]:
    """
    Executes GENERAL STUDY MODE.

    Flow:
    1. Validate input
    2. Classify query
    3. Select LLM (Groq / Gemini)
    4. Generate response
    5. Run safety checks
    6. Return structured response
    """

    # 1️⃣ Input validation
    if not user_query or not user_query.strip():
        return {
            "status": "error",
            "mode": "general",
            "message": "Empty query received"
        }

    # 2️⃣ Query classification
    classification_result = query_classifier.classify(
        query=user_query,
        context=context
    )

    # 3️⃣ LLM selection & generation
    llm_response = select_llm_and_generate(
        query=user_query,
        classification=classification_result
    )

    # 4️⃣ Safety checks
    hallucination_flag = hallucination_guard(
        answer=llm_response,
        classification=classification_result
    )

    source_validation_flag = validate_sources(
        answer=llm_response
    )

    # 5️⃣ Final unified response
    return {
        "status": "success",
        "mode": "general",
        "classification": classification_result,
        "answer": llm_response,
        "safety": {
            "hallucination_risk": hallucination_flag,
            "source_validity": source_validation_flag
        }
    }


# --------------------------------------------------
# Local test run
# --------------------------------------------------
if __name__ == "__main__":
    test_query = "Explain polymorphism in OOP with an example"
    result = run_general_mode(test_query)
    print(result)

import sys
import os

# Add Backend folder to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Imports (ensure folder names are correct)
try:
    from classification.query_classifier import query_classifier
except ModuleNotFoundError:
    # Temporary mock for testing
    def query_classifier(user_query):
        return {
            "intent": "concept_explanation",
            "complexity": "medium",
            "domain": "computer_science"
        }

try:
    from llm_selector.llm_model_selection import select_llm_and_generate
except ModuleNotFoundError:
    # Temporary mock for testing
    def select_llm_and_generate(query, classification):
        return "This is a generated answer."


def run_general_mode(user_query: str) -> dict:
    if not user_query or not user_query.strip():
        return {
            "status": "error",
            "message": "Empty query received"
        }

    # 1️⃣ Classify user query
    classification_result = query_classifier(user_query)

    # 2️⃣ Select LLM & generate response
    llm_response = select_llm_and_generate(
        query=user_query,
        classification=classification_result
    )

    # 3️⃣ Final unified response
    return {
        "status": "success",
        "mode": "general",
        "classification": classification_result,
        "answer": llm_response
    }


# Test run
if __name__ == "__main__":
    test_query = "Explain polymorphism in OOP."
    result = run_general_mode(test_query)
    print(result)

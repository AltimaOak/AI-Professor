import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from teaching.explanation_engine import ExplanationEngine
from prompts.prompt_loader import build_full_prompt


def build_lesson_plan_from_query(query: str) -> dict:
    return {
        "topic": query,
        "introduction": f"{query} is an important concept you should understand.",
        "core_explanation": f"This section explains {query} clearly with examples.",
        "summary": f"In short, {query} is a key topic to remember."
    }


def main():
    engine = ExplanationEngine()

    print("Enter a query (or 'exit' to quit):")

    while True:
        user_query = input(">> ").strip()

        if user_query.lower() == "exit":
            print("Exiting...")
            break

        # 🔹 TEST PROMPTS
        full_prompt = build_full_prompt(user_query, mode="general")

        print("\n========== PROMPT SENT TO LLM ==========\n")
        print(full_prompt)
        print("\n========== END PROMPT ==========\n")

        # 🔹 EXISTING LOGIC (unchanged)
        lesson_plan = build_lesson_plan_from_query(user_query)
        result = engine.generate_explanation(lesson_plan)

        print("\n========== ENGINE OUTPUT ==========\n")
        print(result)
        print("\n=================================\n")


if __name__ == "__main__":
    main()

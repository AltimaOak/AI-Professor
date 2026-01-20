import sys
import os

sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from teaching.explanation_engine import ExplanationEngine

def build_lesson_plan_from_query(query: str) -> dict:
    """
    Converts a raw user query into a valid lesson_plan structure
    """
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

        lesson_plan = build_lesson_plan_from_query(user_query)

        result = engine.generate_explanation(lesson_plan)
        print("\n" + result + "\n")

if __name__ == "__main__":
    main()

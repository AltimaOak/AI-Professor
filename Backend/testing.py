# Backend/testing.py

import sys
import os

# Add Backend to path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from teaching.explanation_engine import ExplanationEngine


def main():
    engine = ExplanationEngine()

    print("Enter a query (or 'exit' to quit):")

    while True:
        user_query = input("> ").strip()

        if user_query.lower() == "exit":
            print("Exiting...")
            break

        # Dummy lesson plan (later this will come from LLM output)
        lesson_plan = {
            "topic": user_query,
            "introduction": f"{user_query} is an important concept you should understand.",
            "core_explanation": f"This section explains {user_query} in simple terms.",
            "summary": f"In short, {user_query} is a key topic to remember."
        }

        result = engine.generate_explanation(lesson_plan)
        print("\n" + result + "\n")


if __name__ == "__main__":
    main()

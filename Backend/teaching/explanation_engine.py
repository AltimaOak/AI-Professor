# teaching/explanation_engine.py

class ExplanationEngine:
    def generate_explanation(self, lesson_plan: dict) -> str:
        """
        Converts a lesson plan into a teaching-style explanation
        """

        explanation = f"""
📘 Topic: {lesson_plan['topic']}

🔹 Introduction:
{lesson_plan['introduction']}

🔹 Explanation:
{lesson_plan['core_explanation']}

🔹 Summary:
{lesson_plan['summary']}
"""

        return explanation.strip()

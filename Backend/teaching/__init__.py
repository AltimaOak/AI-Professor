from teaching.lesson_planner import LessonPlanner
from teaching.explanation_engine import ExplanationEngine
from teaching.example_generator import ExampleGenerator

planner = LessonPlanner()
explainer = ExplanationEngine()
example_gen = ExampleGenerator()

lesson = planner.plan_lesson("Operating System", "beginner")
explanation = explainer.generate_explanation(lesson)
example = example_gen.generate_examples(
    "Operating System",
    "beginner",
    1
)



final_response = f"""
{explanation}

🔹 Example:
{example}
"""


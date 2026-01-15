# core/orchestrator.py

import google.generativeai as genai

from classification.difficulty_estimator import DifficultyEstimator
from classification.query_classifier import QueryClassifier

from llm_selector.llm_model_selection import LLMModelSelector
from teaching.lesson_planner import LessonPlanner
from teaching.explanation_engine import ExplanationEngine
from teaching.example_generator import ExampleGenerator
from core.session_manager import SessionManager


class Orchestrator:
    """
    Central controller for AI Professor
    """

    def __init__(self, gemini_api_key: str):
        genai.configure(api_key=gemini_api_key)

        self.session_manager = SessionManager()
        self.query_classifier = QueryClassifier()
        self.difficulty_estimator = DifficultyEstimator()
        self.model_selector = LLMModelSelector()

        self.lesson_planner = LessonPlanner()
        self.explainer = ExplanationEngine()
        self.example_generator = ExampleGenerator()

    def handle_query(self, session_id: str, user_query: str) -> str:
        """
        Main entry point for processing student query
        """

        # Create session if not exists
        self.session_manager.create_session(session_id)

        # Step 1: classify query
        mode = self.query_classifier.classify(user_query)

        # Step 2: estimate difficulty
        difficulty = self.difficulty_estimator.estimate(user_query)

        # Step 3: select Gemini model
        model_config = self.model_selector.select_model(
            mode=mode,
            difficulty=difficulty
        )

        model = genai.GenerativeModel(model_config["name"])

        # Step 4: plan lesson
        lesson_plan = self.lesson_planner.plan_lesson(
            topic=user_query,
            difficulty=difficulty
        )

        explanation = self.explainer.generate_explanation(lesson_plan)
        example = self.example_generator.generate_example(
            user_query,
            difficulty
        )

        teaching_prompt = f"""
You are an AI Professor.

{explanation}

Example:
{example}
"""

        # Step 5: generate response
        response = model.generate_content(
            teaching_prompt,
            generation_config={
                "temperature": model_config["temperature"],
                "max_output_tokens": model_config["max_tokens"]
            }
        )

        final_answer = response.text

        # Step 6: update session
        self.session_manager.update_session(
            session_id,
            user_query,
            final_answer
        )

        return final_answer

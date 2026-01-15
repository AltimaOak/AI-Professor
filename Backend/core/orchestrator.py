# core/orchestrator.py

import google.generativeai as genai
from groq import Groq

from classification.difficulty_estimator import DifficultyEstimator
from classification.query_classifier import QueryClassifier

from llm_selector.llm_model_selector import LLMModelSelector
from teaching.lesson_planner import LessonPlanner
from teaching.explanation_engine import ExplanationEngine
from teaching.example_generator import ExampleGenerator
from core.session_manager import SessionManager


class Orchestrator:
    """
    Central controller for AI Professor
    Supports Gemini (primary) + Groq (optional / fallback)
    """

    def __init__(self, gemini_api_key: str, groq_api_key: str | None = None):
        # Configure Gemini
        genai.configure(api_key=gemini_api_key)

        # Configure Groq (optional)
        self.groq_client = Groq(api_key=groq_api_key) if groq_api_key else None

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

        # 1️⃣ Create session
        self.session_manager.create_session(session_id)

        # 2️⃣ Classify query
        mode = self.query_classifier.classify(user_query)

        # 3️⃣ Estimate difficulty
        difficulty = self.difficulty_estimator.estimate(user_query)

        # 4️⃣ Select model config
        model_config = self.model_selector.select_model(
            mode=mode,
            difficulty=difficulty
        )

        provider = model_config.get("provider", "gemini")

        # 5️⃣ Plan lesson
        lesson_plan = self.lesson_planner.plan_lesson(
            topic=user_query,
            difficulty=difficulty
        )

        explanation = self.explainer.generate_explanation(lesson_plan)
        example = self.example_generator.generate_example(user_query, difficulty)

        teaching_prompt = f"""
You are an AI Professor.

{explanation}

Example:
{example}
"""

        # 6️⃣ Generate response
        if provider == "groq" and self.groq_client:
            response = self._generate_with_groq(
                teaching_prompt,
                model_config
            )
        else:
            response = self._generate_with_gemini(
                teaching_prompt,
                model_config
            )

        # 7️⃣ Update session
        self.session_manager.update_session(
            session_id,
            user_query,
            response
        )

        return response

    # ---------------- LLM CALLS ---------------- #

    def _generate_with_gemini(self, prompt: str, model_config: dict) -> str:
        model = genai.GenerativeModel(model_config["name"])

        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": model_config["temperature"],
                "max_output_tokens": model_config["max_tokens"]
            }
        )
        return response.text

    def _generate_with_groq(self, prompt: str, model_config: dict) -> str:
        chat_completion = self.groq_client.chat.completions.create(
            model=model_config["name"],
            messages=[
                {"role": "system", "content": "You are an AI Professor."},
                {"role": "user", "content": prompt}
            ],
            temperature=model_config["temperature"],
            max_tokens=model_config["max_tokens"]
        )
        return chat_completion.choices[0].message.content

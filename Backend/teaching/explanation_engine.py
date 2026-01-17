# teaching/explanation_engine.py

import os
import requests

class ExplanationEngine:
    def __init__(self):
        # Load Groq API key from environment
        self.api_key = os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not set in environment variables")

        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.1-8b-instant" # you can change later

    def generate_explanation(self, lesson_plan: dict) -> str:
        """
        Converts a lesson plan into a teaching-style explanation
        using Groq LLM
        """

        # 🔹 Build teaching prompt
        prompt = f"""
You are an AI Professor.

Teach the following topic in a clear and student-friendly way.

Topic: {lesson_plan['topic']}

Introduction:
{lesson_plan['introduction']}

Core Explanation:
{lesson_plan['core_explanation']}

Summary:
{lesson_plan['summary']}

Explain step-by-step and keep it simple.
"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a helpful teaching assistant."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.5,
            "max_tokens": 500
        }

        response = requests.post(
            self.api_url,
            headers=headers,
            json=payload,
            timeout=30
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Groq API Error {response.status_code}: {response.text}"
            )

        result = response.json()
        return result["choices"][0]["message"]["content"].strip()

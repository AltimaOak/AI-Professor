import os
import requests

from prompts.system_prompts import get_system_prompt
from prompts.teaching_prompts import get_teaching_prompt
from prompts.personality_prompts import get_personality_prompt


class ExplanationEngine:
    def __init__(self):
        # Load Groq API key from environment
        self.api_key = os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not set in environment variables")

        self.api_url = "https://api.groq.com/openai/v1/chat/completions"
        self.model = "llama-3.1-8b-instant"

    def generate_explanation(self, lesson_plan: dict) -> str:
        """
        Converts a lesson plan into a teaching-style explanation
        using Groq LLM
        """

        # 🔹 Build layered prompts
        system_prompt = get_system_prompt(mode="general")
        teaching_prompt = get_teaching_prompt()
        personality_prompt = get_personality_prompt()

        # 🔹 User-facing teaching content
        user_prompt = f"""
Topic: {lesson_plan['topic']}

Introduction:
{lesson_plan['introduction']}

Core Explanation:
{lesson_plan['core_explanation']}

Summary:
{lesson_plan['summary']}
"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "system", "content": teaching_prompt},
                {"role": "system", "content": personality_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.5,
            "max_tokens": 700
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

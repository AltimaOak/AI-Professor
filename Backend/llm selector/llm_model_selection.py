# llm_selector/llm_model_selection.py

class LLMModelSelector:
    """
    Gemini-only LLM selector for AI Professor
    """

    def __init__(self):
        self.models = {
            "fast": {
                "name": "gemini-1.5-flash",
                "temperature": 0.4,
                "max_tokens": 2048
            },
            "balanced": {
                "name": "gemini-1.5-pro",
                "temperature": 0.6,
                "max_tokens": 4096
            },
            "accurate": {
                "name": "gemini-1.5-pro",
                "temperature": 0.3,
                "max_tokens": 8192
            }
        }

    def select_model(
        self,
        mode: str,
        difficulty: str,
        priority: str = "balanced"
    ) -> dict:
        """
        Selects the best Gemini model based on context
        """

        # Syllabus mode → accuracy first
        if mode.lower() == "syllabus":
            return self.models["accurate"]

        # Difficulty-based routing
        if difficulty.lower() == "beginner":
            return self.models["fast"]

        elif difficulty.lower() == "intermediate":
            return self.models["balanced"]

        elif difficulty.lower() == "advanced":
            return self.models["accurate"]

        # Fallback
        return self.models.get(priority, self.models["balanced"])

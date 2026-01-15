# llm_selector/llm_model_selection.py
from Backend.config import Config

class LLMModelSelector:
    """
    LLM Model Selector for AI Professor
    Supports Gemini and Groq providers
    """

    def __init__(self):
        # Gemini model presets
        self.gemini_models = {
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

        # Groq model presets
        self.groq_models = {
            "fast": {
                "name": "llama-3-8b-instruct",
                "temperature": 0.5,
                "max_tokens": 2048
            },
            "balanced": {
                "name": "llama-3-70b-instruct",
                "temperature": 0.7,
                "max_tokens": 4096
            },
            "accurate": {
                "name": "llama-3-70b-instruct",
                "temperature": 0.3,
                "max_tokens": 8192
            }
        }

    def select_model(
        self,
        provider: str,
        mode: str,
        difficulty: str,
        priority: str = "balanced"
    ) -> dict:
        """
        Selects the best LLM model based on provider, mode, and difficulty.
        Returns dict with model config + API key + endpoint.
        """

        provider = provider.lower()
        difficulty = difficulty.lower()
        mode = mode.lower()

        # Choose provider models
        if provider == "gemini":
            models = self.gemini_models
            api_key = Config.GEMINI_API_KEY
            endpoint = Config.GEMINI_API_ENDPOINT
        elif provider == "groq":
            models = self.groq_models
            api_key = Config.GROQ_API_KEY
            endpoint = Config.GROQ_API_ENDPOINT
        else:
            raise ValueError(f"Unsupported provider: {provider}")

        # Routing logic
        if mode == "syllabus":
            selected = models["accurate"]
        elif difficulty == "beginner":
            selected = models["fast"]
        elif difficulty == "intermediate":
            selected = models["balanced"]
        elif difficulty == "advanced":
            selected = models["accurate"]
        else:
            selected = models.get(priority, models["balanced"])

        return {
            "provider": provider,
            "model": selected["name"],
            "temperature": selected["temperature"],
            "max_tokens": selected["max_tokens"],
            "api_key": api_key,
            "endpoint": endpoint
        }

# llm_selector/llm_model_selection.py
import requests
from Backend.config import Config

class LLMModelSelector:
    """
    LLM Model Selector for AI Professor
    Supports Gemini and Groq providers
    """

    def __init__(self):
        # Gemini model presets (static)
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

        # Groq model presets (default names, will be updated dynamically if possible)
        self.groq_models = {
            "fast": {
                "name": "llama-3.1-8b-instruct",  # updated default
                "temperature": 0.5,
                "max_tokens": 2048
            },
            "balanced": {
                "name": "llama-3.1-70b-instruct",  # updated default
                "temperature": 0.7,
                "max_tokens": 4096
            },
            "accurate": {
                "name": "llama-3.1-70b-instruct",  # updated default
                "temperature": 0.3,
                "max_tokens": 8192
            }
        }

        # Try to refresh Groq models dynamically
        self._refresh_groq_models()

    def _refresh_groq_models(self):
        """
        Fetch available Groq models dynamically and update presets if possible.
        """
        try:
            headers = {"Authorization": f"Bearer {Config.GROQ_API_KEY}"}
            resp = requests.get(f"{Config.GROQ_API_ENDPOINT}/openai/v1/models", headers=headers)
            if resp.status_code == 200:
                models = [m["id"] for m in resp.json().get("data", [])]

                # Update presets if matching models are found
                for m in models:
                    if "70b" in m:
                        self.groq_models["balanced"]["name"] = m
                        self.groq_models["accurate"]["name"] = m
                    elif "8b" in m:
                        self.groq_models["fast"]["name"] = m
        except Exception:
            # Fail silently — keep defaults
            pass

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
            endpoint = f"{Config.GROQ_API_ENDPOINT}/openai/v1/chat/completions"
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

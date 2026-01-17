import requests
from Backend.config import Config

class LLMModelSelector:
    """
    LLM Model Selector for AI Professor
    Supports Gemini, Groq, and DeepSeek providers
    """

    def __init__(self):
        # Gemini model presets
        self.gemini_models = {
            "fast": {"name": "gemini-1.5-flash", "temperature": 0.4, "max_tokens": 2048},
            "balanced": {"name": "gemini-1.5-pro", "temperature": 0.6, "max_tokens": 4096},
            "accurate": {"name": "gemini-1.5-pro", "temperature": 0.3, "max_tokens": 8192},
        }

        # Groq model presets
        self.groq_models = {
            "fast": {"name": "llama-3.1-8b-instruct", "temperature": 0.5, "max_tokens": 2048},
            "balanced": {"name": "llama-3.1-70b-instruct", "temperature": 0.7, "max_tokens": 4096},
            "accurate": {"name": "llama-3.1-70b-instruct", "temperature": 0.3, "max_tokens": 8192},
        }

        # DeepSeek model presets
        self.deepseek_models = {
            "fast": {"name": "deepseek-chat", "temperature": 0.5, "max_tokens": 2048},
            "balanced": {"name": "deepseek-coder", "temperature": 0.6, "max_tokens": 4096},
            "accurate": {"name": "deepseek-coder", "temperature": 0.3, "max_tokens": 8192},
        }

        # Try to refresh Groq models dynamically
        self._refresh_groq_models()

    def _refresh_groq_models(self):
        try:
            headers = {"Authorization": f"Bearer {Config.GROQ_API_KEY}"}
            resp = requests.get(f"{Config.GROQ_API_ENDPOINT}/openai/v1/models", headers=headers)
            if resp.status_code == 200:
                models = [m["id"] for m in resp.json().get("data", [])]
                for m in models:
                    if "70b" in m:
                        self.groq_models["balanced"]["name"] = m
                        self.groq_models["accurate"]["name"] = m
                    elif "8b" in m:
                        self.groq_models["fast"]["name"] = m
        except Exception:
            pass

    def select_model(self, provider: str, mode: str, difficulty: str, priority: str = "balanced") -> dict:
        provider = provider.lower()
        difficulty = difficulty.lower()
        mode = mode.lower()

        if provider == "gemini":
            models = self.gemini_models
            api_key = Config.GEMINI_API_KEY
            endpoint = Config.GEMINI_API_ENDPOINT
        elif provider == "groq":
            models = self.groq_models
            api_key = Config.GROQ_API_KEY
            endpoint = f"{Config.GROQ_API_ENDPOINT}/openai/v1/chat/completions"
        elif provider == "deepseek":
            models = self.deepseek_models
            api_key = Config.DEEPSEEK_API_KEY
            endpoint = Config.DEEPSEEK_API_ENDPOINT
        else:
            raise ValueError(f"Unsupported provider: {provider}")

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
            "endpoint": endpoint,
        }

    def get_available_model(self, mode: str, difficulty: str, priority: str = "balanced") -> dict:
        """
        Try providers in order of preference until one works.
        """
        providers = ["groq", "gemini", "deepseek"]  # order of preference

        for provider in providers:
            try:
                model_config = self.select_model(provider, mode, difficulty, priority)
                # Test the API key by making a lightweight request (optional)
                headers = {"Authorization": f"Bearer {model_config['api_key']}"}
                test_resp = requests.get(model_config["endpoint"], headers=headers, timeout=3)
                if test_resp.status_code == 200:
                    return model_config
            except Exception:
                continue

        raise RuntimeError("No available LLM provider found. Check API keys and quotas.")

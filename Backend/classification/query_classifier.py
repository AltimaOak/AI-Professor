# classification/query_classifier.py

import requests
import json
from typing import Dict, Any
from Backend.llm_selector.llm_model_selection import LLMModelSelector


class QueryClassifier:
    """
    QueryClassifier powered by Groq API.
    Uses LLMModelSelector to pick the correct model dynamically.
    Sends the query to Groq LLM and asks it to classify into:
    - intent_type
    - topic_domain
    - requested_explanation_level
    - query_complexity_level
    - is_followup
    - confidence_signal
    """

    def __init__(self, provider: str = "groq", mode: str = "general", difficulty: str = "beginner"):
        # Use LLMModelSelector to get model config
        selector = LLMModelSelector()
        model_config = selector.select_model(provider=provider, mode=mode, difficulty=difficulty)

        self.api_key = model_config["api_key"]
        self.endpoint = model_config["endpoint"]
        self.model = model_config["model"]
        self.temperature = model_config["temperature"]
        self.max_tokens = model_config["max_tokens"]

    def classify(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Classify a query using Groq LLM.
        :param query: User query string
        :param context: Optional context (e.g., previous query for follow-up detection)
        :return: Dict with classification schema
        """

        # Build prompt for classification
        prompt = f"""
        You are a query classifier for an AI teaching assistant.
        Classify the following query into a JSON object with keys:
        - intent_type (explanation, example, syllabus, multimodal, general)
        - topic_domain (physics, math, programming, dbms, ai, biology, etc.)
        - requested_explanation_level (beginner, intermediate, advanced, unspecified)
        - query_complexity_level (beginner, intermediate, advanced)
        - is_followup (true/false)
        - confidence_signal (high, neutral, low)

        Query: "{query}"
        Context: "{context if context else ''}"

        Return ONLY raw JSON without code fences, without markdown, and without any extra text.
        """

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a strict query classifier."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": self.max_tokens,
            "temperature": self.temperature
        }

        response = requests.post(self.endpoint, json=payload, headers=headers)

        if response.status_code != 200:
            raise RuntimeError(f"Groq API error {response.status_code}: {response.text}")

        data = response.json()

        try:
            # Extract the model's JSON output
            content = data["choices"][0]["message"]["content"]
            classification = json.loads(content)
        except Exception as e:
            raise RuntimeError(f"Failed to parse Groq response: {e}\nRaw: {data}")

        return classification


# if __name__ == "__main__":
#     qc = QueryClassifier(provider="groq", mode="general", difficulty="beginner")
#     test_query = input("Enter a query: ")
#     result = qc.classify(test_query)
#     print("Classification result:", result)

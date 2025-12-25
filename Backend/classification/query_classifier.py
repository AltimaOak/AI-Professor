# classification/query_classifier.py

import re
from typing import Dict, Any


class QueryClassifier:
    """
    QueryClassifier performs:
    - Intent classification
    - Keyword scanning
    - Topic tagging
    - Signal extraction

    Returns a structured schema for downstream orchestration.
    """

    def __init__(self):
        # Intent keyword mapping
        self.intent_map = {
            "explanation": ["explain", "definition", "what is", "describe", "meaning"],
            "example": ["example", "illustrate", "analogy", "show me", "demo"],
            "syllabus": ["syllabus", "unit", "chapter", "topic", "course"],
            "multimodal": ["image", "pdf", "diagram", "parse", "vision"],
            "general": ["who", "when", "where", "history", "fact", "information"]
        }

        # Topic domains (expandable)
        self.topic_domains = {
            "dbms": ["database", "sql", "normalization", "transaction", "schema", "index"],
            "math": ["algebra", "calculus", "geometry", "equation", "proof"],
            "ai": ["machine learning", "neural network", "agent", "reinforcement", "cognition"],
            "programming": ["python", "java", "c++", "code", "function", "loop"]
        }

    def classify(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Classify raw query into structured schema.
        :param query: User query string
        :param context: Optional context (e.g., previous query for follow-up detection)
        :return: Dict with classification schema
        """
        query_lower = query.lower()

        # --- Intent Classification ---
        intent_type = "general"
        for intent, keywords in self.intent_map.items():
            if any(kw in query_lower for kw in keywords):
                intent_type = intent
                break

        # --- Topic Tagging ---
        topic_domain = "unspecified"
        for domain, keywords in self.topic_domains.items():
            if any(kw in query_lower for kw in keywords):
                topic_domain = domain
                break

        # --- Explanation Level (requested) ---
        if any(word in query_lower for word in ["beginner", "easy", "simple"]):
            requested_explanation_level = "beginner"
        elif any(word in query_lower for word in ["intermediate", "medium"]):
            requested_explanation_level = "intermediate"
        elif any(word in query_lower for word in ["advanced", "complex", "hard"]):
            requested_explanation_level = "advanced"
        else:
            requested_explanation_level = "unspecified"

        # --- Query Complexity Level (rough heuristic) ---
        # Count technical terms or length as proxy
        word_count = len(query_lower.split())
        if word_count <= 5:
            query_complexity_level = "beginner"
        elif 6 <= word_count <= 12:
            query_complexity_level = "intermediate"
        else:
            query_complexity_level = "advanced"

        # --- Follow-up Detection ---
        is_followup = False
        if context and "last_query" in context:
            # crude heuristic: overlap of topic words
            last_query = context["last_query"].lower()
            overlap = len(set(query_lower.split()) & set(last_query.split()))
            if overlap > 0:
                is_followup = True

        # --- Confidence Signal ---
        # Simple heuristic: if intent and topic both detected → high
        if intent_type != "general" and topic_domain != "unspecified":
            confidence_signal = "high"
        elif intent_type != "general" or topic_domain != "unspecified":
            confidence_signal = "neutral"
        else:
            confidence_signal = "low"

        # --- Output Schema ---
        return {
            "intent_type": intent_type,
            "topic_domain": topic_domain,
            "requested_explanation_level": requested_explanation_level,
            "query_complexity_level": query_complexity_level,
            "is_followup": is_followup,
            "confidence_signal": confidence_signal
        }

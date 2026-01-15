

import re
from typing import Dict, Any


class DifficultyEstimator:
    """
    Estimates the difficulty level of a user query.
    Uses heuristics based on keywords, length, and technical term density.
    """

    def __init__(self):
        # Keyword sets for difficulty estimation
        self.beginner_keywords = ["beginner", "easy", "simple", "basic", "intro"]
        self.intermediate_keywords = ["intermediate", "medium", "moderate", "standard"]
        self.advanced_keywords = ["advanced", "complex", "hard", "difficult", "expert"]

        # Technical vocabulary (expandable)
        self.technical_terms = [
            "normalization", "transaction", "indexing", "schema", "recursion",
            "neural network", "reinforcement", "calculus", "proof", "algorithm"
        ]

    def estimate(self, query: str) -> Dict[str, Any]:
        """
        Estimate difficulty level of query.
        Returns structured dict with requested and inferred levels.
        """
        query_lower = query.lower()

        # --- Requested Level (explicit keywords) ---
        if any(word in query_lower for word in self.beginner_keywords):
            requested_level = "beginner"
        elif any(word in query_lower for word in self.intermediate_keywords):
            requested_level = "intermediate"
        elif any(word in query_lower for word in self.advanced_keywords):
            requested_level = "advanced"
        else:
            requested_level = "unspecified"

        # --- Inferred Complexity Level ---
        word_count = len(query_lower.split())
        tech_term_count = sum(1 for term in self.technical_terms if term in query_lower)

        # Base complexity on length + technical density
        if word_count <= 5 and tech_term_count == 0:
            inferred_level = "beginner"
        elif 6 <= word_count <= 12 or tech_term_count <= 2:
            inferred_level = "intermediate"
        else:
            inferred_level = "advanced"

        # --- Confidence Signal ---
        if requested_level != "unspecified" and inferred_level == requested_level:
            confidence_signal = "high"
        elif requested_level != "unspecified" and inferred_level != requested_level:
            confidence_signal = "neutral"
        else:
            confidence_signal = "low"

        return {
            "requested_explanation_level": requested_level,
            "query_complexity_level": inferred_level,
            "confidence_signal": confidence_signal
        }

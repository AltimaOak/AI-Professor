# Backend/classification/difficulty_estimator.py

from typing import Dict


class DifficultyEstimator:
    """
    Estimates difficulty level of a user query
    using heuristic-based signals.
    """

    def __init__(self):
        self.advanced_keywords = [
            "derive", "prove", "analyze", "optimize",
            "complexity", "theorem", "architecture",
            "algorithm", "backpropagation", "normalization"
        ]

        self.intermediate_keywords = [
            "explain", "compare", "difference",
            "working", "how", "why", "example"
        ]

    def estimate(self, query: str) -> Dict[str, str]:
        """
        Returns estimated difficulty level and confidence.
        """

        query_lower = query.lower()
        word_count = len(query_lower.split())

        # --- Keyword-based scoring ---
        advanced_score = sum(kw in query_lower for kw in self.advanced_keywords)
        intermediate_score = sum(kw in query_lower for kw in self.intermediate_keywords)

        # --- Heuristic decision ---
        if advanced_score > 0 or word_count > 15:
            difficulty = "advanced"
            confidence = "high"
        elif intermediate_score > 0 or 7 <= word_count <= 15:
            difficulty = "intermediate"
            confidence = "medium"
        else:
            difficulty = "beginner"
            confidence = "medium"

        return {
            "estimated_difficulty": difficulty,
            "confidence": confidence
        }

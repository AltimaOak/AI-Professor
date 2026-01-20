# teaching/lesson_planner.py

from typing import Dict, List


class LessonPlanner:
    """
    Converts a classified query + context into a structured lesson plan.
    Ensures ExplanationEngine never receives raw user queries.
    """

    # ---------------------------
    # Public API
    # ---------------------------

    def plan_lesson(
        self,
        topic: str,
        difficulty: str = "beginner",
        context: str | None = None
    ) -> Dict:
        """
        Plans a structured lesson for a topic.

        Args:
            topic (str): Cleaned / classified topic (NOT raw user query)
            difficulty (str): beginner | intermediate | advanced
            context (str): Retrieved knowledge context (optional)

        Returns:
            dict: Structured lesson plan
        """

        difficulty = self._normalize_difficulty(difficulty)

        lesson_plan = {
            "topic": topic,
            "difficulty": difficulty,
            "introduction": self._build_introduction(topic, difficulty),
            "explanation_outline": self._build_outline(topic, difficulty),
            "teaching_notes": self._build_teaching_notes(difficulty),
            "summary_goals": self._build_summary_goals(topic, difficulty),
            "context_used": bool(context),
        }

        return lesson_plan

    # ---------------------------
    # Internal helpers
    # ---------------------------

    def _normalize_difficulty(self, difficulty: str) -> str:
        allowed = {"beginner", "intermediate", "advanced"}
        return difficulty if difficulty in allowed else "beginner"

    def _build_introduction(self, topic: str, difficulty: str) -> str:
        depth_style = {
            "beginner": "simple and intuitive",
            "intermediate": "logical and structured",
            "advanced": "technical and in-depth",
        }

        return (
            f"This lesson introduces **{topic}** in a "
            f"{depth_style[difficulty]} manner, "
            f"building understanding step by step."
        )

    def _build_outline(self, topic: str, difficulty: str) -> List[str]:
        """
        Produces a deterministic explanation outline.
        Prevents chaotic or free-form teaching.
        """

        base_outline = [
            f"Definition and purpose of {topic}",
            f"Core components or concepts of {topic}",
            f"How {topic} works in practice",
        ]

        if difficulty in {"intermediate", "advanced"}:
            base_outline.append(
                f"Common use-cases and design considerations in {topic}"
            )

        if difficulty == "advanced":
            base_outline.extend([
                f"Technical challenges and trade-offs in {topic}",
                f"Real-world systems or implementations involving {topic}",
            ])

        return base_outline

    def _build_teaching_notes(self, difficulty: str) -> Dict:
        """
        Teaching constraints passed to ExplanationEngine
        """

        return {
            "tone": self._tone_for_difficulty(difficulty),
            "avoid_assumptions": True,
            "use_examples": True,
            "stepwise_explanation": True,
        }

    def _tone_for_difficulty(self, difficulty: str) -> str:
        return {
            "beginner": "friendly and clear",
            "intermediate": "precise and explanatory",
            "advanced": "formal and technical",
        }[difficulty]

    def _build_summary_goals(self, topic: str, difficulty: str) -> List[str]:
        goals = [
            f"Understand the fundamental idea of {topic}",
            f"Explain {topic} in simple terms",
        ]

        if difficulty in {"intermediate", "advanced"}:
            goals.append(f"Apply {topic} to practical scenarios")

        if difficulty == "advanced":
            goals.append(f"Analyze and evaluate systems using {topic}")

        return goals

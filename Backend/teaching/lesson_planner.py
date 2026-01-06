# teaching/lesson_planner.py

class LessonPlanner:
    def plan_lesson(self, topic: str, difficulty: str = "beginner") -> dict:
        """
        Plans a structured lesson for a topic
        """

        depth_map = {
            "beginner": "simple and intuitive",
            "intermediate": "detailed with logic",
            "advanced": "in-depth with technical clarity"
        }

        lesson_plan = {
            "topic": topic,
            "difficulty": difficulty,
            "introduction": f"Introduction to {topic} in a {depth_map[difficulty]} way.",
            "core_explanation": f"Detailed explanation of {topic}.",
            "example_section": f"Practical examples related to {topic}.",
            "summary": f"Quick recap of key points in {topic}."
        }

        return lesson_plan

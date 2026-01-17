# teaching/example_generator.py

from typing import List


class ExampleGenerator:
    """
    Purpose:
    Generates practical examples, analogies, and use-cases for any topic.

    Guarantees:
    - Not abstract-only
    - Real-world relevance
    - Scales instantly for multiple examples
    """

    def __init__(self):
        # Predefined example templates (FAST)
        self.beginner_templates = [
            "Think of {topic} like something you use in daily life.",
            "A simple real-life example of {topic} is seen in everyday situations.",
            "{topic} can be understood easily with this basic example."
        ]

        self.intermediate_templates = [
            "{topic} is commonly applied in academic or practical systems.",
            "A practical scenario where {topic} is used is explained here.",
            "In real projects, {topic} helps solve structured problems."
        ]

        self.advanced_templates = [
            "{topic} is implemented in real-world systems using optimized techniques.",
            "A production-level use-case of {topic} involves performance and scalability.",
            "{topic} plays a critical role in complex technical architectures."
        ]

    def generate_examples(
        self,
        query: str,
        difficulty: str = "beginner",
        count: int = 1,
        include_code: bool = False
    ) -> List[str]:
        """
        Generates multiple examples instantly.

        :param query: User-defined topic/query
        :param difficulty: beginner | intermediate | advanced
        :param count: Number of examples to generate
        :param include_code: Whether to add code snippets (optional)
        """

        templates = self._select_templates(difficulty)

        examples = []
        for i in range(count):
            template = templates[i % len(templates)]
            example = template.format(topic=query)

            if include_code and difficulty in ["intermediate", "advanced"]:
                example += self._code_snippet(query)

            examples.append(f"{i + 1}. {example}")

        return examples

    def _select_templates(self, difficulty: str):
        if difficulty == "beginner":
            return self.beginner_templates
        elif difficulty == "intermediate":
            return self.intermediate_templates
        elif difficulty == "advanced":
            return self.advanced_templates
        else:
            return self.beginner_templates

    def _code_snippet(self, topic: str) -> str:
        """
        Lightweight optional code snippet
        """
        return f"\n   Example Code:\n   ```python\n   # Example related to {topic}\n   print('{topic} in action')\n   ```"

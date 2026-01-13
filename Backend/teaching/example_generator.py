# teaching/example_generator.py

class ExampleGenerator:
    def generate_example(self, topic: str, difficulty: str = "beginner") -> str:
        """
        Generates examples based on difficulty level
        """

        if difficulty == "beginner":
            return f"A simple real-life example to understand {topic}."

        elif difficulty == "intermediate":
            return f"A practical academic example explaining how {topic} works."

        elif difficulty == "advanced":
            return f"A technical and real-world implementation example of {topic}."

        else:
            return f"An example related to {topic}."

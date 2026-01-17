from teaching.example_generator import ExampleGenerator

def main():
    generator = ExampleGenerator()

    query = input("Enter any query: ")
    count = int(input("How many examples do you want? "))
    difficulty = input("Difficulty (beginner/intermediate/advanced): ")

    examples = generator.generate_examples(
        query=query,
        difficulty=difficulty,
        count=count
    )

    print("\nGenerated Examples:\n")
    for i, ex in enumerate(examples, 1):
        print(f"{i}. {ex}")

if __name__ == "__main__":
    main()

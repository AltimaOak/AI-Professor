# teaching/test_lesson_planner.py

from lesson_planner import LessonPlanner

def main():
    planner = LessonPlanner()

    topic = "Operating System"
    difficulty = "beginner"

    lesson = planner.plan_lesson(topic, difficulty)

    print("\n--- LESSON PLAN OUTPUT ---\n")
    for key, value in lesson.items():
        print(f"{key.upper()}:\n{value}\n")

if __name__ == "__main__":
    main()

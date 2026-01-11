# Backend/safety/hallucination_guard.py

HALLUCINATION_KEYWORDS = [
    "it is widely believed",
    "studies show",
    "experts say",
    "research proves",
    "it is known that",
    "according to sources"
]


def detect_hallucination(answer: str) -> bool:
    """
    Detects potential hallucination patterns in the LLM response.
    Returns True if hallucination risk is detected.
    """

    if not answer or len(answer.strip()) < 20:
        return True  # Too short → unreliable

    lower_answer = answer.lower()

    for keyword in HALLUCINATION_KEYWORDS:
        if keyword in lower_answer:
            return True

    return False


def apply_hallucination_guard(answer: str) -> str:
    """
    Applies hallucination safety check.
    If unsafe, returns a guarded response.
    """

    if detect_hallucination(answer):
        return (
            "I’m not fully confident about this answer based on the available information. "
            "Could you please provide more context or clarify your question?"
        )

    return answer

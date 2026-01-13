# Backend/safety/source_validation.py

def validate_answer_source(
    answer: str,
    allowed_context: str
) -> bool:
    """
    Validates whether the answer is grounded in the provided context.
    
    Returns True if answer is valid.
    Returns False if answer is likely outside the source.
    """

    if not allowed_context or not answer:
        return False

    answer_words = set(answer.lower().split())
    context_words = set(allowed_context.lower().split())

    # Calculate overlap
    overlap_ratio = len(answer_words.intersection(context_words)) / max(len(answer_words), 1)

    # Threshold can be tuned
    return overlap_ratio > 0.15

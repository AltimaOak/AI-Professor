from prompts.system_prompts import get_system_prompt
from prompts.teaching_prompts import get_teaching_prompt
from prompts.personality_prompts import get_personality_prompt

def build_full_prompt(user_query: str, mode: str | None = None) -> str:
    """
    Combines all prompt layers into a single prompt string
    """

    system_prompt = get_system_prompt(mode)
    teaching_prompt = get_teaching_prompt()
    personality_prompt = get_personality_prompt()

    full_prompt = f"""
{system_prompt}

{teaching_prompt}

{personality_prompt}

USER QUESTION:
{user_query}
"""

    return full_prompt.strip()

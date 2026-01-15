# Backend/prompts/__init__.py

from .personality_prompts import get_personality_prompt
from .system_prompts import get_system_prompt
from .teaching_prompts import get_teaching_prompt

__all__ = [
    "get_personality_prompt",
    "get_system_prompt",
    "get_teaching_prompt",
]

# core/session_manager.py

class SessionManager:
    """
    Manages user session and conversation context for AI Professor
    """

    def __init__(self, max_history: int = 5):
        self.sessions = {}
        self.max_history = max_history

    def create_session(self, session_id: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "history": [],
                "current_topic": None
            }

    def update_session(self, session_id: str, user_input: str, ai_response: str):
        session = self.sessions.get(session_id)

        if not session:
            return

        session["history"].append({
            "user": user_input,
            "ai": ai_response
        })

        # Keep only recent N interactions
        if len(session["history"]) > self.max_history:
            session["history"] = session["history"][-self.max_history:]

    def set_topic(self, session_id: str, topic: str):
        if session_id in self.sessions:
            self.sessions[session_id]["current_topic"] = topic

    def get_context(self, session_id: str) -> str:
        """
        Returns formatted conversation context for LLM prompt
        """
        session = self.sessions.get(session_id)

        if not session or not session["history"]:
            return ""

        context_lines = []
        for turn in session["history"]:
            context_lines.append(f"Student: {turn['user']}")
            context_lines.append(f"Professor: {turn['ai']}")

        return "\n".join(context_lines)

    def get_current_topic(self, session_id: str) -> str | None:
        session = self.sessions.get(session_id)
        return session.get("current_topic") if session else None

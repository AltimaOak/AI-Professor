# core/session_manager.py

class SessionManager:
    """
    Manages user session and conversation context
    """

    def __init__(self):
        self.sessions = {}

    def create_session(self, session_id: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "history": [],
                "current_topic": None
            }

    def update_session(self, session_id: str, user_input: str, ai_response: str):
        self.sessions[session_id]["history"].append({
            "user": user_input,
            "ai": ai_response
        })

    def set_topic(self, session_id: str, topic: str):
        self.sessions[session_id]["current_topic"] = topic

    def get_context(self, session_id: str) -> dict:
        return self.sessions.get(session_id, {})

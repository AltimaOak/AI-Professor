# knowledge/api_sources.py

class APISources:
    """
    Defines available knowledge sources for AI Professor
    """

    def __init__(self):
        self.sources = {
            "general": "General AI knowledge base",
            "web": "Internet-based information",
            "academic": "Academic-style explanations"
        }

    def get_source(self, source_name: str) -> str:
        """
        Returns description of the source
        """
        return self.sources.get(
            source_name,
            "Unknown knowledge source"
        )

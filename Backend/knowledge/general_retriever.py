# knowledge/general_retriever.py

from knowledge.api_sources import APISources


class GeneralRetriever:
    """
    Retrieves general knowledge context for a query
    """

    def __init__(self):
        self.api_sources = APISources()

    def retrieve(self, query: str) -> str:
        """
        Fetch relevant information for the query
        """

        source_info = self.api_sources.get_source("general")

        # Placeholder retrieval logic (can be upgraded later)
        context = f"""
Source: {source_info}

Relevant information related to:
"{query}"

Use standard academic explanations and real-world examples.
"""

        return context.strip()

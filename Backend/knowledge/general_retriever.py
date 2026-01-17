# knowledge/general_retriever.py

from typing import Dict
from Backend.knowledge.api_sources import APISources


class GeneralRetriever:
    """
    Retrieves non-syllabus general knowledge for a user query.

    Responsibilities:
    - Call external/general knowledge APIs
    - Cache retrieved results to reduce repeated calls
    - Provide a hook for future RAG-based retrieval
    """

    def __init__(self):
        self.api_sources = APISources()

        # Simple in-memory cache
        # Key: query string, Value: retrieved context
        self._cache: Dict[str, str] = {}

        # Toggle for future RAG integration
        self.enable_rag = False

    def retrieve(self, query: str) -> str:
        """
        Fetch relevant general knowledge information for the query.
        """

        query = query.strip().lower()

        # 1️⃣ Check cache first
        if query in self._cache:
            return self._cache[query]

        # 2️⃣ Get source configuration
        source_info = self.api_sources.get_source("general")

        # 3️⃣ Retrieve information (API-based or placeholder logic)
        context = self._retrieve_from_api(query, source_info)

        # 4️⃣ Optional RAG enhancement (future-ready)
        if self.enable_rag:
            context = self._apply_rag(query, context)

        # 5️⃣ Cache result
        self._cache[query] = context

        return context

    def _retrieve_from_api(self, query: str, source_info: str) -> str:
        """
        Handles API-based retrieval.
        Currently structured for expansion.
        """

        # Placeholder for real API calls (Wikipedia, search APIs, etc.)
        # This keeps architecture stable while logic evolves
        context = f"""
Source:
{source_info}

General Knowledge Context:
This information relates to "{query}".

Explanation should follow standard academic tone,
include real-world examples,
and avoid syllabus-specific assumptions.
"""
        return context.strip()

    def _apply_rag(self, query: str, base_context: str) -> str:
        """
        Optional Retrieval-Augmented Generation layer.
        This will later integrate vector DB / embeddings.
        """

        # Placeholder for RAG logic
        rag_context = f"""
[RAG ENHANCEMENT ENABLED]

{base_context}

Additional insights may be added from retrieved documents.
"""
        return rag_context.strip()

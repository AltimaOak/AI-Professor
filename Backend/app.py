from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.llama_config import configure_llama
from routes.upload import router as upload_router
from routes.query import router as query_router

# Configure LlamaIndex globally before anything else
configure_llama()

app = FastAPI(
    title="AI Professor",
    version="1.0.0",
    description="Agentic AI tutoring system",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api/upload", tags=["Upload"])
app.include_router(query_router, prefix="/api/query", tags=["Query"])


@app.get("/")
def root():
    return {"status": "AI Professor API is running"}
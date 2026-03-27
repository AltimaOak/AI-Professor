from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.llama_config import configure_llama
from routes.upload import router as upload_router
from routes.query import router as query_router
from routes.auth import router as auth_router

configure_llama()

app = FastAPI(
    title="AI Professor",
    version="1.0.0",
    description="Agentic AI tutoring system",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/api/upload", tags=["Upload"])
app.include_router(query_router, prefix="/api/query", tags=["Query"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"status": "AI Professor API is running"}
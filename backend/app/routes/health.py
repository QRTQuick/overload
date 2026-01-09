from fastapi import APIRouter
from app.models import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", version="1.0.0")

@router.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "🧠 Overload API - AI-Powered Python Bug Detection",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "analyze": "/analyze"
    }
from fastapi import APIRouter
from app.models import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok", version="1.0.0")
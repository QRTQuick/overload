from fastapi import APIRouter, HTTPException, Depends
from app.models import AnalyzeRequest, AnalyzeResponse
from app.ai.groq_client import analyze_code
from app.utils.validators import validate_code
from app.security import rate_limit
import time

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse, dependencies=[Depends(rate_limit)])
async def analyze_python_code(request: AnalyzeRequest):
    start_time = time.time()
    
    try:
        validate_code(request.code)
        bugs = await analyze_code(request.code)
        analysis_time = time.time() - start_time
        
        return AnalyzeResponse(bugs=bugs, analysis_time=analysis_time)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Analysis failed")
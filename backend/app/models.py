from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SeverityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AnalyzeRequest(BaseModel):
    code: str = Field(..., description="Python code to analyze")

class BugReport(BaseModel):
    type: str = Field(..., description="Type of bug or issue")
    severity: SeverityLevel = Field(..., description="Severity level")
    line: Optional[int] = Field(None, description="Line number where issue occurs")
    description: str = Field(..., description="Description of the issue")
    fix: str = Field(..., description="Suggested fix")

class AnalyzeResponse(BaseModel):
    bugs: List[BugReport] = Field(..., description="List of identified bugs")
    analysis_time: float = Field(..., description="Time taken for analysis in seconds")

class HealthResponse(BaseModel):
    status: str = Field(..., description="Service status")
    version: str = Field(..., description="API version")
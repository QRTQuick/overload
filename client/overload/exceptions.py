"""
Overload client exceptions
"""

class OverloadError(Exception):
    """Base exception for all Overload client errors"""
    pass

class AnalysisError(OverloadError):
    """Raised when code analysis fails"""
    pass

class RateLimitError(OverloadError):
    """Raised when rate limit is exceeded"""
    pass
import ast
from app.config import MAX_CODE_SIZE

def validate_code(code: str) -> None:
    if len(code) > MAX_CODE_SIZE:
        raise ValueError(f"Code too large. Maximum size: {MAX_CODE_SIZE} characters")
    
    if not code.strip():
        raise ValueError("Code cannot be empty")
    
    try:
        ast.parse(code)
    except SyntaxError as e:
        raise ValueError(f"Syntax error in code: {e}")
    
    dangerous_patterns = [
        "import os", "import subprocess", "import sys",
        "__import__", "eval(", "exec(", "open("
    ]
    
    code_lower = code.lower()
    for pattern in dangerous_patterns:
        if pattern in code_lower:
            raise ValueError(f"Potentially dangerous code detected: {pattern}")
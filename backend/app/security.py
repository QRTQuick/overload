from fastapi import HTTPException, Request
from app.config import RATE_LIMIT
import time
from collections import defaultdict

request_counts = defaultdict(list)

def rate_limit(request: Request):
    client_ip = request.client.host
    current_time = time.time()
    
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip]
        if current_time - req_time < 60
    ]
    
    if len(request_counts[client_ip]) >= RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Maximum {RATE_LIMIT} requests per minute."
        )
    
    request_counts[client_ip].append(current_time)
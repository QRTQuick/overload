from dotenv import load_dotenv
import os

load_dotenv()

GROQ_KEYS = [
    os.getenv(f"GROQ_KEY_{i}") 
    for i in range(1, 7) 
    if os.getenv(f"GROQ_KEY_{i}")
]

MAX_CODE_SIZE = int(os.getenv("MAX_CODE_SIZE", 50000))
RATE_LIMIT = int(os.getenv("RATE_LIMIT", 10))
APP_ENV = os.getenv("APP_ENV", "development")
PORT = int(os.getenv("PORT", 8000))

if not GROQ_KEYS:
    raise ValueError("No Groq API keys found in environment variables")
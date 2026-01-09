import random
from groq import Groq
from app.config import GROQ_KEYS
from app.ai.prompt import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE
from app.ai.parser import parse_ai_response
from app.models import BugReport
from typing import List

def get_client():
    if not GROQ_KEYS:
        raise ValueError("No Groq API keys available")
    return Groq(api_key=random.choice(GROQ_KEYS))

async def analyze_code(code: str) -> List[BugReport]:
    try:
        client = get_client()
        user_prompt = USER_PROMPT_TEMPLATE.format(code=code)
        
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=2000
        )
        
        ai_output = response.choices[0].message.content
        return parse_ai_response(ai_output)
        
    except Exception as e:
        print(f"AI analysis failed: {e}")
        return []
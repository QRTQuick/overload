import requests
from typing import List, Dict, Union
import os
from .exceptions import OverloadError, AnalysisError, RateLimitError

BASE_URL = os.getenv("OVERLOAD_BASE_URL", "https://overload-api.onrender.com")
API_KEY = os.getenv("OVERLOAD_API_KEY")


def analyze(code_or_file: Union[str, object], timeout: int = 30) -> List[Dict]:
    """
    Analyze Python code for bugs and issues

    Args:
        code_or_file: Python code string or file path
        timeout: Request timeout in seconds

    Returns:
        List of bug reports with type, severity, line, description, and fix
    """
    # Handle file path vs code string
    if hasattr(code_or_file, "read"):
        code = code_or_file.read()
    elif (
        isinstance(code_or_file, str)
        and "\n" not in code_or_file
        and len(code_or_file) < 260
    ):
        try:
            with open(code_or_file, "r", encoding="utf-8") as f:
                code = f.read()
        except FileNotFoundError:
            code = code_or_file
    else:
        code = code_or_file

    try:
        headers = {"Content-Type": "application/json"}
        if API_KEY:
            headers["Authorization"] = f"Bearer {API_KEY}"

        response = requests.post(
            f"{BASE_URL}/analyze", json={"code": code}, timeout=timeout, headers=headers
        )

        if response.status_code == 429:
            raise RateLimitError("Rate limit exceeded. Please try again later.")
        elif response.status_code == 400:
            error_detail = response.json().get("detail", "Invalid request")
            raise AnalysisError(f"Analysis failed: {error_detail}")
        elif response.status_code != 200:
            raise AnalysisError(f"Server error: {response.status_code}")

        result = response.json()
        return result.get("bugs", [])

    except requests.exceptions.Timeout:
        raise OverloadError("Request timed out. The service may be busy.")
    except requests.exceptions.ConnectionError:
        raise OverloadError("Could not connect to Overload service.")
    except requests.exceptions.RequestException as e:
        raise OverloadError(f"Request failed: {e}")
    except Exception as e:
        raise OverloadError(f"Unexpected error: {e}")

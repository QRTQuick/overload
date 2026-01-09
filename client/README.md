# Overload Client

AI-powered Python bug identification client library.

## Installation

```bash
pip install overload
```

## Usage

```python
from overload import analyze

code = """
def divide(a, b):
    return a / b

result = divide(10, 0)
"""

bugs = analyze(code)
for bug in bugs:
    print(f"{bug['severity']}: {bug['description']}")
```

## Features

- Detect syntax bugs, runtime exceptions, logic flaws, security vulnerabilities
- Simple API with automatic file/code detection
- Custom timeout and error handling

## Configuration

Set environment variables:

- `OVERLOAD_BASE_URL`: Custom API base URL (default: https://overload-api.onrender.com)
- `OVERLOAD_API_KEY`: API key if required (future feature)

## License

MIT License
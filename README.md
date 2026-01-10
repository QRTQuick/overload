# 🧠 Overload - AI-Powered Python Bug Detection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-green.svg)](https://fastapi.tiangolo.com/)
[![Render](https://img.shields.io/badge/Deployed%20on-Render-46E3B7.svg)](https://render.com)

> Transform your Python development workflow with intelligent static analysis. Overload uses advanced Large Language Models to automatically detect bugs, security vulnerabilities, and performance issues before they reach production.

## 🌟 Features

- **AI-Powered Analysis**: Leverages Groq's LLaMA 3.1 model for intelligent code analysis
- **Comprehensive Detection**: Identifies bugs, security vulnerabilities, and performance issues
- **Real-time Feedback**: Instant analysis with detailed explanations
- **User-Friendly Interface**: Modern, responsive web interface with circular navigation
- **API-First Design**: RESTful API for easy integration
- **Rate Limiting**: Built-in protection against abuse
- **CORS Enabled**: Supports cross-origin requests
- **Open Source**: Free and open-source under MIT license

## 🚀 Live Demo

- **Frontend**: [https://overload-web.onrender.com](https://overload-web.onrender.com)
- **API**: [https://overload-api.onrender.com](https://overload-api.onrender.com)
- **API Docs**: [https://overload-api.onrender.com/docs](https://overload-api.onrender.com/docs)

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance async web framework
- **Groq AI**: LLaMA 3.1 8B model for code analysis
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation and serialization
- **python-dotenv**: Environment variable management

### Frontend
- **HTML5/CSS3**: Modern responsive design
- **Vanilla JavaScript**: No frameworks, lightweight and fast
- **Prism.js**: Syntax highlighting
- **Font Awesome**: Icon library
- **Circular Navigation**: Innovative floating menu design

### Client Library
- **Python SDK**: Easy-to-use client for programmatic access
- **Async Support**: Asynchronous API calls
- **Error Handling**: Comprehensive exception handling
- **Type Hints**: Full type annotation support

### Deployment
- **Render**: Cloud hosting for both frontend and backend
- **Static Site**: Frontend deployed as static site
- **Web Service**: Backend deployed as web service

## 📦 Installation

### Prerequisites
- Python 3.8+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/QRTQuick/overload.git
   cd overload
   ```

2. **Set up virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Run tests**
   ```bash
   python test_api.py
   ```

5. **Run the backend**
   ```bash
   python -m app.main
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Serve the static files**
   ```bash
   python -m http.server 8000
   ```
   Or use any static file server. The frontend will be available at `http://localhost:8000`

## 🎯 Usage

### Web Interface

1. Open the frontend in your browser
2. Click the circular brain icon to access navigation
3. Navigate to the "Analyzer" section
4. Paste your Python code into the text area
5. Click "Analyze Code"
6. View the detailed analysis results

### API Usage

#### Analyze Code
```bash
curl -X POST "https://overload-api.onrender.com/analyze" \
     -H "Content-Type: application/json" \
     -d '{
       "code": "def hello():\n    print(\"Hello World\")"
     }'
```

#### Response
```json
{
  "bugs": [
    {
      "type": "style",
      "severity": "low",
      "line": 1,
      "message": "Function name should be lowercase",
      "suggestion": "Rename 'hello' to 'hello_world'"
    }
  ],
  "analysis_time": 1.23
}
```

#### Health Check
```bash
curl "https://overload-api.onrender.com/health"
```

### Python Client Library

Install and use the Overload Python SDK:

```python
from overload import analyze, OverloadError

# Analyze Python code
code = """
def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)  # Bug: no empty list check
"""

try:
    bugs = analyze(code)
    print(f"Found {len(bugs)} issues")
    
    for bug in bugs:
        print(f"Line {bug['line']}: {bug['message']}")
        print(f"Suggestion: {bug['suggestion']}")
        print(f"Severity: {bug['severity']} ({bug['type']})")
        
except OverloadError as e:
    print(f"Analysis failed: {e}")
```

#### Analyze a File
```python
# Analyze a Python file
bugs = analyze("my_script.py")
```

#### Environment Variables
```bash
export OVERLOAD_BASE_URL="https://overload-api.onrender.com"
export OVERLOAD_API_KEY="your-api-key-if-required"
```

## 📚 API Documentation

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/analyze` | Analyze Python code for bugs |
| `GET` | `/health` | Health check endpoint |

### Request/Response Models

#### AnalyzeRequest
```typescript
{
  code: string  // Python code to analyze (max 50,000 characters)
}
```

#### AnalyzeResponse
```typescript
{
  bugs: BugReport[]
  analysis_time: number
}
```

#### BugReport
```typescript
{
  type: "bug" | "security" | "performance" | "style"
  severity: "low" | "medium" | "high" | "critical"
  line: number
  message: string
  suggestion: string
}
```

## 🚀 Deployment

### Backend Deployment (Render)

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure build settings:**
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m app.main`
4. **Add environment variables** in Render dashboard
5. **Deploy**

### Frontend Deployment (Render)

1. **Create a new Static Site** on Render
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Build Command**: Leave empty
   - **Publish Directory**: `frontend/`
4. **Deploy**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   python test_api.py
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 style guidelines
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Test both API and client library functionality

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Groq** for providing fast AI inference
- **FastAPI** for the excellent web framework
- **Render** for hosting services
- **Font Awesome** for icons
- **Prism.js** for syntax highlighting

## 📞 Contact

- **Author**: Chisom Life Eke
- **Email**: chisomlifeeke@gmail.com
- **GitHub**: [@QRTQuick](https://github.com/QRTQuick)
- **Project Link**: [https://github.com/QRTQuick/overload](https://github.com/QRTQuick/overload)

---

<p align="center">Made with ❤️ and AI</p></content>
<parameter name="filePath">e:\code base\overload\README.md
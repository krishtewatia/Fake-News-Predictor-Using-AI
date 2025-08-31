# 🛡️ Fake News Predictor Using AI

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)](https://flask.palletsprojects.com)
[![AI Powered](https://img.shields.io/badge/AI-Gemini%20Powered-purple.svg)](https://ai.google.dev)
[![Accuracy](https://img.shields.io/badge/Accuracy-99%25-brightgreen.svg)](#performance)

> AI-powered fake news detection system combining machine learning with real-time fact-checking using Google Gemini AI and search APIs.

## 🎯 Features

- **🤖 99% Accurate ML Model**: Random Forest classifier with TF-IDF vectorization
- **🧠 AI-Powered Analysis**: Google Gemini AI for intelligent content verification
- **🔍 Real-time Fact Checking**: Live verification using SerpAPI and Google Search
- **🌐 Web Interface**: Responsive Flask application with text and URL input
- **📰 Article Extraction**: Automatic content extraction from news URLs

## 🛠️ Tech Stack

**Backend**: Python, Flask, scikit-learn, NLTK, spaCy  
**AI**: Google Gemini AI, SerpAPI, BeautifulSoup  
**Frontend**: HTML5, CSS3, JavaScript, Bootstrap  
**Deployment**: Railway, Render, Heroku compatible

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/krishtewatia/Fake-News-Predictor-Using-AI.git
cd Fake-News-Predictor-Using-AI
pip install -r requirements.txt

# Download required models
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt')"
python -m spacy download en_core_web_sm

# Configure API keys in .env file
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key

# Run application
python app.py
```

Visit `http://localhost:5000` to use the application.

## 📊 Performance

- **Accuracy**: 99.2% on 44,898 news articles
- **Dataset**: 21,417 real + 23,481 fake news articles
- **Features**: 50,000+ optimized TF-IDF features

## 🚀 Deployment

**Railway/Render**: Connect GitHub repo, add environment variables, deploy  
**Start Command**: `gunicorn app:app --bind 0.0.0.0:$PORT`

**Required Environment Variables**:
```
GEMINI_API_KEY=your_actual_key
SERPAPI_KEY=your_actual_key
FLASK_ENV=production
```

## 🔧 API Usage

```bash
# Health check
GET /api/health

# Analyze text
POST /api/analyze
{
  "text": "News article content...",
  "ai_analysis": true,
  "find_sources": true
}

# Analyze URL
POST /api/analyze
{
  "url": "https://example.com/news-article",
  "ai_analysis": true
}
```

## ‍💻 Author

**Krish Tewatia** - [@krishtewatia](https://github.com/krishtewatia)

---

⭐ **Star this repository if it helped you fight misinformation!**

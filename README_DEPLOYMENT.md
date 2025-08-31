# Enhanced Fake News Detection System - Backend

A Flask-based backend API for real-time fake news detection using ML and AI.

## Features
- Machine Learning Classification
- Real-time fact verification via Google Search
- AI analysis using Gemini
- Source credibility assessment
- RESTful API endpoints

## Deployment

### Railway (Recommended - Free)
1. Go to [Railway](https://railway.app)
2. Connect GitHub repository
3. Select this repository
4. Add environment variables:
   - `GEMINI_API_KEY=your_gemini_key`
   - `SERPAPI_KEY=your_serpapi_key`
   - `PORT=5000`
5. Deploy!

### Render (Alternative - Free)
1. Go to [Render](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Build command: `pip install -r requirements.txt`
5. Start command: `python app.py`
6. Add environment variables
7. Deploy!

### Heroku (Alternative)
1. Install Heroku CLI
2. `heroku login`
3. `heroku create your-app-name`
4. `git push heroku main`
5. `heroku config:set GEMINI_API_KEY=your_key`
6. `heroku config:set SERPAPI_KEY=your_key`

## API Endpoints
- `POST /api/analyze` - Analyze news content
- `GET /api/health` - Health check
- `GET /` - Frontend interface

## Environment Variables Required
- `GEMINI_API_KEY` - Google Gemini AI API key
- `SERPAPI_KEY` - SerpAPI key for Google searches
- `PORT` - Port number (default: 5000)

## Files Included
- `app.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `Procfile` - Process file for deployment
- Model files: `fake_news_model.pkl`, `tfidf_vectorizer.pkl`
- Templates and static files

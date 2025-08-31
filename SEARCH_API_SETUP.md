# 🔍 Getting Search API Keys - Step by Step Guide

## Option A: SerpAPI (Recommended - Easier Setup)

### Why SerpAPI is recommended:
- Easier to set up (just one API key)
- Better results formatting
- More reliable
- Free tier: 100 searches/month

### Steps:
1. Go to: https://serpapi.com/
2. Click "Sign Up" (free account)
3. Verify your email
4. Go to Dashboard: https://serpapi.com/dashboard
5. Copy your API key
6. Add to .env file:
```
SERPAPI_KEY=your_actual_serpapi_key_here
```

## Option B: Google Custom Search API (Free but more complex)

### Steps:
1. Go to: https://console.cloud.google.com/
2. Create/select a project
3. Enable "Custom Search API"
4. Create credentials (API key)
5. Set up Custom Search Engine:
   - Go to: https://cse.google.com/cse/
   - Click "Add"
   - Enter "*.com" as sites to search
   - Create the search engine
   - Copy the "Search engine ID"

6. Add to .env file:
```
GOOGLE_SEARCH_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_search_engine_id
```

### Free Limits:
- Google Custom Search: 100 queries/day (free)
- Can be increased with billing

## Which one to choose?
- **SerpAPI**: If you want easy setup and better results
- **Google**: If you prefer Google's ecosystem and don't mind setup complexity

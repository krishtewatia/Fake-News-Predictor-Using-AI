#!/bin/bash

# Quick deployment script for Enhanced Fake News Detection System
echo "🚀 Enhanced Fake News Detection - Deployment Setup"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "app.py" ]; then
    echo "❌ Error: Please run this script from the project root directory (where app.py is located)"
    exit 1
fi

echo "✅ Setting up deployment files..."

# Create frontend directory if it doesn't exist
if [ ! -d "frontend" ]; then
    mkdir frontend
    echo "📁 Created frontend directory"
fi

# Copy necessary files to frontend
cp static/styles.css frontend/ 2>/dev/null || echo "⚠️  styles.css not found in static/"
cp templates/index.html frontend/ 2>/dev/null || echo "⚠️  index.html not found in templates/"

# Check if required files exist
echo "🔍 Checking required files..."

required_files=(
    "app.py"
    "requirements.txt" 
    "Procfile"
    "fake_news_model.pkl"
    "tfidf_vectorizer.pkl"
    ".env"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing files:"
    printf '   - %s\n' "${missing_files[@]}"
    echo "Please ensure all files are in the project directory"
fi

# Check environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "GEMINI_API_KEY=AIza" .env && grep -q "SERPAPI_KEY=" .env; then
        echo "✅ API keys configured in .env"
    else
        echo "⚠️  Please check your API keys in .env file"
    fi
else
    echo "❌ .env file not found - create it with your API keys"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Backend Deployment:"
echo "   - Go to https://railway.app"
echo "   - Deploy from GitHub repo"
echo "   - Add environment variables from .env file"
echo ""
echo "2. Frontend Deployment:"
echo "   - Update API_BASE_URL in frontend/main.js"
echo "   - Go to https://netlify.com"
echo "   - Drag and drop the 'frontend' folder"
echo ""
echo "3. Update CORS in app.py with your Netlify URL"
echo ""
echo "🎉 Ready for deployment!"
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"

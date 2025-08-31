@echo off
REM Quick deployment setup for Windows
echo 🚀 Enhanced Fake News Detection - Deployment Setup
echo ==================================================

REM Check if we're in the right directory
if not exist "app.py" (
    echo ❌ Error: Please run this script from the project root directory (where app.py is located)
    pause
    exit /b 1
)

echo ✅ Setting up deployment files...

REM Create frontend directory if it doesn't exist
if not exist "frontend" (
    mkdir frontend
    echo 📁 Created frontend directory
)

REM Copy necessary files to frontend
copy "static\styles.css" "frontend\" >nul 2>&1 || echo ⚠️  styles.css not found in static/
copy "templates\index.html" "frontend\" >nul 2>&1 || echo ⚠️  index.html not found in templates/

echo 🔍 Checking required files...

set missing_files=0

if not exist "app.py" (
    echo ❌ Missing: app.py
    set missing_files=1
)
if not exist "requirements.txt" (
    echo ❌ Missing: requirements.txt
    set missing_files=1
)
if not exist "Procfile" (
    echo ❌ Missing: Procfile
    set missing_files=1
)
if not exist "fake_news_model.pkl" (
    echo ❌ Missing: fake_news_model.pkl
    set missing_files=1
)
if not exist "tfidf_vectorizer.pkl" (
    echo ❌ Missing: tfidf_vectorizer.pkl
    set missing_files=1
)
if not exist ".env" (
    echo ❌ Missing: .env
    set missing_files=1
)

if %missing_files%==0 (
    echo ✅ All required files present
) else (
    echo Please ensure all files are in the project directory
)

echo.
echo 🔐 Checking environment variables...
if exist ".env" (
    findstr /c:"GEMINI_API_KEY=AIza" .env >nul && findstr /c:"SERPAPI_KEY=" .env >nul
    if errorlevel 1 (
        echo ⚠️  Please check your API keys in .env file
    ) else (
        echo ✅ API keys configured in .env
    )
) else (
    echo ❌ .env file not found - create it with your API keys
)

echo.
echo 📋 Next Steps:
echo 1. Backend Deployment:
echo    - Go to https://railway.app
echo    - Deploy from GitHub repo
echo    - Add environment variables from .env file
echo.
echo 2. Frontend Deployment:
echo    - Update API_BASE_URL in frontend/main.js
echo    - Go to https://netlify.com
echo    - Drag and drop the 'frontend' folder
echo.
echo 3. Update CORS in app.py with your Netlify URL
echo.
echo 🎉 Ready for deployment!
echo 📖 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause

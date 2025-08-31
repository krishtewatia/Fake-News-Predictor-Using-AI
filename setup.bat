@echo off
echo Setting up Fake News Detection System...
echo =====================================

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

echo Installing requirements...
python -m pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install requirements
    pause
    exit /b 1
)

echo Setting up environment file...
if not exist .env (
    copy env_template.txt .env
    echo Created .env file from template
    echo Please edit .env file and add your API keys
) else (
    echo .env file already exists
)

echo.
echo =====================================
echo Setup completed successfully!
echo.
echo Next steps:
echo 1. Edit .env file with your API keys
echo 2. Run: python app.py
echo 3. Open http://localhost:5000 in your browser
echo.
pause

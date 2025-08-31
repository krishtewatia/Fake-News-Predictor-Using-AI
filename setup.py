"""
Setup script for Fake News Detection System
"""

import os
import subprocess
import sys
import shutil

def install_requirements():
    """Install required packages from requirements.txt"""
    print("Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ Requirements installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False

def setup_environment():
    """Setup environment file from template"""
    env_template = "env_template.txt"
    env_file = ".env"
    
    if os.path.exists(env_template):
        if not os.path.exists(env_file):
            shutil.copy(env_template, env_file)
            print(f"✅ Created {env_file} from template")
            print("📝 Please edit .env file and add your API keys")
        else:
            print(f"⚠️  {env_file} already exists")
    else:
        print(f"❌ {env_template} not found")

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major == 3 and version.minor >= 8:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} is compatible")
        return True
    else:
        print(f"❌ Python {version.major}.{version.minor}.{version.micro} is not compatible. Requires Python 3.8+")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Fake News Detection System...")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Setup environment
    setup_environment()
    
    print("\n" + "=" * 50)
    print("🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Edit .env file with your API keys (see GEMINI_SETUP.md and SEARCH_API_SETUP.md)")
    print("2. Run: python app.py")
    print("3. Open http://localhost:5000 in your browser")

if __name__ == "__main__":
    main()

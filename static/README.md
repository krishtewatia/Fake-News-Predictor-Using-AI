# 🚀 AI Fake News Detection System

**Created by Krish Tewatia**

A professional web interface for detecting fake news using advanced AI and machine learning algorithms.

## 🌟 Features

- **Professional Design**: Modern, responsive UI with smooth animations
- **Dual Input Modes**: Analyze text directly or from URL
- **AI-Powered Analysis**: Advanced machine learning for credibility assessment
- **Source Verification**: Cross-reference with reliable news sources
- **Real-time Results**: Instant analysis with detailed scoring
- **Mobile Friendly**: Responsive design for all devices

## 🚀 Quick Start

### Option 1: Open Directly
1. Simply open `index.html` in your web browser
2. The page includes fallback CSS for standalone viewing

### Option 2: Local Server (Recommended)
1. Open terminal/command prompt
2. Navigate to the static folder:
   ```bash
   cd "c:\Users\HP\Downloads\personel_work\fake_news_pred\static"
   ```
3. Start a local server:
   ```bash
   python -m http.server 8080
   ```
4. Open your browser and go to: `http://localhost:8080/index.html`

## 💡 How to Use

1. **Choose Input Method**: 
   - Text Analysis: Paste news content directly
   - URL Analysis: Enter a news article URL

2. **Configure Options**:
   - ✅ Internet Source Verification: Cross-check with reliable sources
   - ✅ Advanced AI Analysis: Include sentiment and bias detection

3. **Analyze**: Click the "Analyze News Article" button

4. **Review Results**: 
   - Credibility score and assessment
   - Machine learning predictions
   - Source verification results
   - AI insights and reasoning

## 🎨 Features Showcase

### Professional UI Elements
- **Gradient backgrounds** with floating animations
- **Modern typography** using Inter and Poppins fonts
- **Icon-based navigation** with Font Awesome icons
- **Smooth transitions** and hover effects
- **Professional color scheme** with CSS custom properties

### Advanced Functionality
- **Tab-based interface** for different input methods
- **Real-time validation** with user-friendly alerts
- **Loading states** with animated spinners
- **Responsive grid layouts** for all screen sizes
- **Accessibility features** with proper ARIA labels

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Modern CSS with Flexbox and Grid
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Inter, Poppins)
- **Backend Integration**: Flask API compatible

## 🎭 Demo Mode

The webpage includes a demo button (top-left corner) that loads sample text for testing the interface.

## 📱 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🛠️ File Structure

```
static/
├── index.html          # Main webpage
├── css/
│   └── styles.css      # Professional styling
├── js/
│   └── main.js         # Interactive functionality
└── README.md           # This file
```

## 🚀 Integration with Backend

The frontend is designed to work with your Flask backend API endpoint `/api/analyze`. 

Expected request format:
```json
{
    "text": "news content here",
    "url": "https://news-url.com",
    "ai_analysis": true,
    "find_sources": true
}
```

## 🎉 Creator Credits

**Developed by Krish Tewatia**
- Professional AI & Machine Learning Developer
- Specializing in NLP and fake news detection
- Technologies: Python, Scikit-learn, Flask, JavaScript

---

© 2024 AI Fake News Detection System. All rights reserved.

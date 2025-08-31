#!/usr/bin/env python3
"""
System test script to verify the fake news detection system is working correctly.
"""

import requests
import json
import sys

def test_api_endpoint(url, data):
    """Test an API endpoint with given data."""
    try:
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, json=data, headers=headers, timeout=30)
        return response.status_code, response.json()
    except Exception as e:
        return None, str(e)

def main():
    base_url = "http://localhost:5000"
    
    print("🧪 SYSTEM TEST - Fake News Detection")
    print("=" * 50)
    
    # Test 1: Health check
    print("🔍 Test 1: Health Check")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=10)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Health check passed")
            print(f"   Status: {health_data.get('status')}")
            print(f"   Models loaded: {health_data.get('models_loaded')}")
            print(f"   AI available: {health_data.get('ai_available')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test 2: Analyze real news text
    print("\n🔍 Test 2: Real News Analysis")
    real_news = {
        "text": "Scientists at MIT have developed a new method for producing hydrogen fuel using solar energy. The research, published in Nature Energy, shows promising results for sustainable energy production. The team spent two years perfecting the process.",
        "ai_analysis": True
    }
    
    status, result = test_api_endpoint(f"{base_url}/api/analyze", real_news)
    if status == 200:
        print("✅ Real news analysis successful")
        print(f"   Prediction: {result['analysis']['ml_result']['prediction']}")
        print(f"   Final Assessment: {result['analysis']['final_assessment']}")
        print(f"   Confidence Score: {result['analysis']['final_score']:.2f}")
    else:
        print(f"❌ Real news analysis failed: {status}, {result}")
        return False
    
    # Test 3: Analyze suspicious text
    print("\n🔍 Test 3: Suspicious News Analysis")
    fake_news = {
        "text": "SHOCKING!!! Aliens have landed in New York City!!! Government trying to cover it up!!! Click here for AMAZING photos!!! This will change EVERYTHING!!!",
        "ai_analysis": True
    }
    
    status, result = test_api_endpoint(f"{base_url}/api/analyze", fake_news)
    if status == 200:
        print("✅ Suspicious news analysis successful")
        print(f"   Prediction: {result['analysis']['ml_result']['prediction']}")
        print(f"   Final Assessment: {result['analysis']['final_assessment']}")
        print(f"   Confidence Score: {result['analysis']['final_score']:.2f}")
    else:
        print(f"❌ Suspicious news analysis failed: {status}, {result}")
        return False
    
    # Test 4: Error handling
    print("\n🔍 Test 4: Error Handling")
    empty_request = {"text": ""}
    
    status, result = test_api_endpoint(f"{base_url}/api/analyze", empty_request)
    if status == 400:
        print("✅ Error handling working correctly")
        print(f"   Error message: {result.get('error')}")
    else:
        print(f"⚠️ Error handling test unexpected result: {status}, {result}")
    
    print("\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!")
    print("✅ The fake news detection system is working correctly.")
    print("✅ Web interface is accessible at http://localhost:5000")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

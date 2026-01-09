#!/usr/bin/env python3
"""
Test script for Overload API
"""
import requests
import time

API_URL = "https://overload-api.onrender.com"

def test_health():
    """Test the health endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=60)
        if response.status_code == 200:
            print("✅ Health check passed:", response.json())
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.Timeout:
        print("⏰ Health check timed out (service may be waking up)")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_analyze():
    """Test the analyze endpoint"""
    print("\nTesting analyze endpoint...")
    
    # Simple Python code with a bug
    test_code = """
def divide_numbers(a, b):
    return a / b  # Bug: no zero division check

result = divide_numbers(10, 0)
print(result)
"""
    
    try:
        response = requests.post(
            f"{API_URL}/analyze",
            json={"code": test_code},
            timeout=60,
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Analysis successful!")
            print(f"Found {len(result.get('bugs', []))} issues:")
            for bug in result.get('bugs', []):
                print(f"  - {bug['severity']}: {bug['description']}")
            return True
        else:
            print(f"❌ Analysis failed: {response.status_code}")
            print(response.text)
            return False
            
    except Exception as e:
        print(f"❌ Analysis error: {e}")
        return False

def main():
    print("🧠 Testing Overload API")
    print("=" * 50)
    
    # Test health first (this will wake up the service)
    health_ok = test_health()
    
    if not health_ok:
        print("\n⏰ Service may be sleeping. Waiting 30 seconds...")
        time.sleep(30)
        health_ok = test_health()
    
    if health_ok:
        # Test analysis
        test_analyze()
    else:
        print("\n❌ Cannot proceed - health check failed")
    
    print("\n🎉 Testing complete!")

if __name__ == "__main__":
    main()
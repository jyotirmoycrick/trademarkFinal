import requests
import sys
import json
from datetime import datetime

class WebDesertAPITester:
    def __init__(self, base_url="https://brandlock.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_user_email = f"testuser_{datetime.now().strftime('%H%M%S')}@example.com"

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        
        if headers:
            default_headers.update(headers)
        
        if self.token and 'Authorization' not in default_headers:
            default_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=default_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers, timeout=10)

            print(f"   Status Code: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        user_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "password": "password123",
            "phone": "+919876543210"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=user_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            if 'user' in response:
                self.user_id = response['user'].get('id')
            print(f"   Token obtained: {self.token[:20]}...")
            return True
        return False

    def test_user_login(self):
        """Test user login with same credentials"""
        login_data = {
            "email": self.test_user_email,
            "password": "password123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            if 'user' in response:
                self.user_id = response['user'].get('id')
            print(f"   Login token: {self.token[:20]}...")
            return True
        return False

    def test_get_services(self):
        """Test getting services list"""
        success, response = self.run_test(
            "Get Services List",
            "GET",
            "services",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} services")
            expected_services = ["trademark-registration", "gst-registration", "company-registration"]
            found_services = [service.get('id') for service in response]
            
            for expected in expected_services:
                if expected in found_services:
                    print(f"   ✅ Found service: {expected}")
                else:
                    print(f"   ❌ Missing service: {expected}")
            
            return len(response) == 3
        return False

    def test_protected_endpoint(self):
        """Test protected endpoint /auth/me"""
        if not self.token:
            print("❌ No token available for protected endpoint test")
            return False
            
        success, response = self.run_test(
            "Protected Endpoint (/auth/me)",
            "GET",
            "auth/me",
            200
        )
        
        if success and 'id' in response:
            print(f"   User ID: {response.get('id')}")
            print(f"   User Name: {response.get('name')}")
            print(f"   User Email: {response.get('email')}")
            return True
        return False

    def test_order_creation(self):
        """Test order creation"""
        if not self.token:
            print("❌ No token available for order creation test")
            return False
            
        order_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "phone": "+919876543210",
            "business_name": "Test Business",
            "cart_items": [
                {
                    "service_id": "trademark-registration",
                    "quantity": 1
                }
            ]
        }
        
        success, response = self.run_test(
            "Order Creation",
            "POST",
            "orders/create",
            200,
            data=order_data
        )
        
        if success and 'razorpay_order_id' in response:
            print(f"   Razorpay Order ID: {response.get('razorpay_order_id')}")
            print(f"   Amount: {response.get('amount')}")
            print(f"   Currency: {response.get('currency')}")
            print(f"   Key ID: {response.get('key_id')}")
            return True
        return False

    def test_order_creation_with_coupon(self):
        """Test order creation with coupon code"""
        if not self.token:
            print("❌ No token available for order creation with coupon test")
            return False
            
        order_data = {
            "name": "Test User",
            "email": self.test_user_email,
            "phone": "+919876543210",
            "business_name": "Test Business",
            "cart_items": [
                {
                    "service_id": "trademark-registration",
                    "quantity": 1
                }
            ],
            "coupon_code": "LAUNCH50"
        }
        
        success, response = self.run_test(
            "Order Creation with Coupon",
            "POST",
            "orders/create",
            200,
            data=order_data
        )
        
        if success and 'razorpay_order_id' in response:
            print(f"   Razorpay Order ID: {response.get('razorpay_order_id')}")
            print(f"   Amount (with discount): {response.get('amount')}")
            # Original price: 1000 + 4500 = 5500, with 5% discount = 5225
            expected_amount = 5225
            actual_amount = response.get('amount')
            if actual_amount == expected_amount:
                print(f"   ✅ Coupon discount applied correctly")
            else:
                print(f"   ❌ Coupon discount incorrect. Expected: {expected_amount}, Got: {actual_amount}")
            return True
        return False

    def test_get_my_orders(self):
        """Test getting user's orders"""
        if not self.token:
            print("❌ No token available for get orders test")
            return False
            
        success, response = self.run_test(
            "Get My Orders",
            "GET",
            "orders/my-orders",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} orders")
            return True
        return False

def main():
    print("🚀 Starting WebDesert Legal Services API Tests")
    print("=" * 60)
    
    tester = WebDesertAPITester()
    
    # Test sequence
    tests = [
        ("Root Endpoint", tester.test_root_endpoint),
        ("User Registration", tester.test_user_registration),
        ("User Login", tester.test_user_login),
        ("Get Services", tester.test_get_services),
        ("Protected Endpoint", tester.test_protected_endpoint),
        ("Order Creation", tester.test_order_creation),
        ("Order Creation with Coupon", tester.test_order_creation_with_coupon),
        ("Get My Orders", tester.test_get_my_orders),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            if not result:
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {tester.tests_run - tester.tests_passed}")
    
    if failed_tests:
        print(f"\n❌ Failed Tests:")
        for test in failed_tests:
            print(f"   - {test}")
    else:
        print(f"\n✅ All tests passed!")
    
    return 0 if len(failed_tests) == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing LEHAR Backend API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE.replace('/api', '')}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.message);

    // Test 2: Auth test endpoint
    console.log('\n2. Testing auth test endpoint...');
    const authTestResponse = await fetch(`${API_BASE}/auth/test`);
    const authTestData = await authTestResponse.json();
    console.log('✅ Auth test:', authTestData.message);

    // Test 3: Test registration
    console.log('\n3. Testing user registration...');
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpass123',
      role: 'citizen'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const registerData = await registerResponse.json();
    if (registerData.success) {
      console.log('✅ Registration successful:', registerData.message);
    } else {
      console.log('❌ Registration failed:', registerData.message);
    }

    // Test 4: Test login
    console.log('\n4. Testing user login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();
    if (loginData.success) {
      console.log('✅ Login successful:', loginData.message);
      console.log('   User:', loginData.user.name, `(${loginData.user.email})`);
    } else {
      console.log('❌ Login failed:', loginData.message);
    }

    // Test 5: Test reports endpoint
    console.log('\n5. Testing reports endpoint...');
    const reportsResponse = await fetch(`${API_BASE}/reports`);
    const reportsData = await reportsResponse.json();
    console.log('✅ Reports endpoint accessible');

    console.log('\n🎉 All API tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your backend server is running on port 5000');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = { testAPI };

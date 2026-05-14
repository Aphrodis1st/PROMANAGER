import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3001';
const email = 'superadmin@madsmart.com';
const password = 'SuperAdmin123!';

async function testLogin(service, endpoint) {
  try {
    console.log(`\n🧪 Testing ${service} login...`);
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok && (data.token || data.success)) {
      console.log(`✅ ${service} login successful!`);
      console.log(`   Token: ${data.token?.substring(0, 20)}...`);
      console.log(`   Role: ${data.user?.role || data.admin?.role}`);
      return true;
    } else {
      console.log(`❌ ${service} login failed:`, data.error || data.message);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${service} login error:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Testing Superadmin Access Across All Services');
  console.log('================================================');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  
  const results = {
    stock: await testLogin('Stock', '/api/v1/stock/auth/login'),
    hospital: await testLogin('Hospital', '/api/v1/hospital/auth/login'),
    hr: await testLogin('HR', '/api/v1/hr/auth/login'),
    pharmacy: await testLogin('Pharmacy', '/api/v1/auth/login')
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('======================');
  Object.entries(results).forEach(([service, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${service.toUpperCase()}: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  const allPassed = Object.values(results).every(r => r);
  console.log(`\n${allPassed ? '🎉 All tests passed!' : '⚠️  Some tests failed'}`);
}

runTests();

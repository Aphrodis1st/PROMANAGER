#!/usr/bin/env node

/**
 * Comprehensive Authentication Debug Test
 * Run: node debug-auth.js
 */

const API_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@hospital.com';
const ADMIN_PASSWORD = 'admin@123';

let token = null;

async function makeRequest(method, path, body = null, authToken = null) {
  const url = new URL(path, API_URL);
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (authToken) {
    options.headers['Authorization'] = `Bearer ${authToken}`;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), options);
    const data = await response.text();
    
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers),
      body: data ? JSON.parse(data) : null
    };
  } catch (error) {
    throw error;
  }
}

async function runDebugTests() {
  console.log('🔍 Comprehensive Authentication Debug Test\n');
  console.log('='.repeat(60));

  try {
    // Step 1: Login
    console.log('\n🔐 Step 1: Login');
    const login = await makeRequest('POST', '/api/v1/hospital/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (login.status !== 200 || !login.body.token) {
      console.log('❌ Login failed:', login.body.error);
      return;
    }
    
    token = login.body.token;
    console.log('✅ Login successful');
    console.log(`Token: ${token.substring(0, 50)}...`);
    
    // Decode token to see payload
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('Token payload:', payload);

    // Step 2: Test simple endpoint (no auth)
    console.log('\n🧪 Step 2: Test Simple Endpoint (No Auth)');
    const simple = await makeRequest('GET', '/api/v1/hospital/admin/debug/simple');
    console.log(`Status: ${simple.status}`);
    console.log(`Response: ${JSON.stringify(simple.body)}`);

    // Step 3: Test token reception
    console.log('\n🧪 Step 3: Test Token Reception');
    const tokenTest = await makeRequest('GET', '/api/v1/hospital/admin/debug/token', null, token);
    console.log(`Status: ${tokenTest.status}`);
    console.log(`Response: ${JSON.stringify(tokenTest.body)}`);

    // Step 4: Test auth middleware only
    console.log('\n🧪 Step 4: Test Auth Middleware Only');
    const authOnly = await makeRequest('GET', '/api/v1/hospital/admin/debug/auth-only', null, token);
    console.log(`Status: ${authOnly.status}`);
    if (authOnly.status === 200) {
      console.log('✅ Auth middleware working');
      console.log(`User: ${JSON.stringify(authOnly.body.user)}`);
    } else {
      console.log('❌ Auth middleware failed:', authOnly.body.error);
    }

    // Step 5: Test full auth (both middlewares)
    console.log('\n🧪 Step 5: Test Full Auth (Both Middlewares)');
    const fullAuth = await makeRequest('GET', '/api/v1/hospital/admin/debug/full-auth', null, token);
    console.log(`Status: ${fullAuth.status}`);
    if (fullAuth.status === 200) {
      console.log('✅ Full auth working');
      console.log(`User: ${JSON.stringify(fullAuth.body.user)}`);
    } else {
      console.log('❌ Full auth failed:', fullAuth.body.error);
    }

    // Step 6: Test actual endpoints
    console.log('\n🧪 Step 6: Test Actual Endpoints');
    
    console.log('\n📋 Testing /users endpoint:');
    const users = await makeRequest('GET', '/api/v1/hospital/admin/users', null, token);
    console.log(`Status: ${users.status}`);
    if (users.status === 200) {
      console.log('✅ Users endpoint working');
      console.log(`User count: ${users.body.data?.length || 0}`);
    } else {
      console.log('❌ Users endpoint failed:', users.body.error);
    }

    console.log('\n🏥 Testing /departments endpoint:');
    const depts = await makeRequest('GET', '/api/v1/hospital/admin/departments', null, token);
    console.log(`Status: ${depts.status}`);
    if (depts.status === 200) {
      console.log('✅ Departments endpoint working');
      console.log(`Department count: ${depts.body.data?.length || 0}`);
    } else {
      console.log('❌ Departments endpoint failed:', depts.body.error);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Debug test completed!\n');

  } catch (error) {
    console.error('\n❌ Debug test failed:', error.message);
    process.exit(1);
  }
}

// Run debug tests
runDebugTests().catch(console.error);
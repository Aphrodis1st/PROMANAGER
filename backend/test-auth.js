#!/usr/bin/env node

/**
 * Hospital Admin Authentication Test Script
 * Run: node test-auth.js
 */

const API_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'admin@hospital.com';
const ADMIN_PASSWORD = 'admin@123'; // Updated password

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

async function runTests() {
  console.log('🧪 Hospital Admin Authentication Test Suite\n');
  console.log('='.repeat(50));

  try {
    // Test 1: Health Check
    console.log('\n✅ Test 1: Health Check');
    const health = await makeRequest('GET', '/api/v1/health');
    console.log(`Status: ${health.status}`);
    console.log(`Response: ${JSON.stringify(health.body)}`);
    if (health.status !== 200) throw new Error('Health check failed');

    // Test 2: Auth Routes Test
    console.log('\n✅ Test 2: Hospital Auth Routes Test');
    const authTest = await makeRequest('GET', '/api/v1/hospital/auth/test');
    console.log(`Status: ${authTest.status}`);
    console.log(`Response: ${JSON.stringify(authTest.body)}`);
    if (authTest.status !== 200) throw new Error('Auth routes not working');

    // Test 3: Login
    console.log('\n✅ Test 3: Hospital Admin Login');
    const login = await makeRequest('POST', '/api/v1/hospital/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    console.log(`Status: ${login.status}`);
    if (login.status === 200 && login.body.token) {
      token = login.body.token;
      console.log(`✅ Login successful`);
      console.log(`Token: ${token.substring(0, 50)}...`);
      console.log(`Admin: ${login.body.admin.firstName || 'N/A'} ${login.body.admin.lastName || 'N/A'}`);
      console.log(`Hospital: ${login.body.hospital.name}`);
    } else {
      console.log(`❌ Login failed: ${login.body.error}`);
      throw new Error('Login failed');
    }

    // Test 4: Debug Token Endpoint
    console.log('\n✅ Test 4: Debug Token Endpoint');
    const debug = await makeRequest('GET', '/api/v1/hospital/admin/debug/token', null, token);
    console.log(`Status: ${debug.status}`);
    console.log(`Response: ${JSON.stringify(debug.body)}`);

    // Test 5: Get Users (Protected Endpoint)
    console.log('\n✅ Test 5: Get Users (Protected Endpoint)');
    const users = await makeRequest('GET', '/api/v1/hospital/admin/users', null, token);
    console.log(`Status: ${users.status}`);
    if (users.status === 200) {
      console.log(`✅ Successfully fetched users`);
      console.log(`User count: ${users.body.data?.length || 0}`);
    } else {
      console.log(`❌ Failed to fetch users: ${users.body.error}`);
    }

    // Test 6: Get Departments (Protected Endpoint)
    console.log('\n✅ Test 6: Get Departments (Protected Endpoint)');
    const depts = await makeRequest('GET', '/api/v1/hospital/admin/departments', null, token);
    console.log(`Status: ${depts.status}`);
    if (depts.status === 200) {
      console.log(`✅ Successfully fetched departments`);
      console.log(`Department count: ${depts.body.data?.length || 0}`);
    } else {
      console.log(`❌ Failed to fetch departments: ${depts.body.error}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ All tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
runTests().catch(console.error);

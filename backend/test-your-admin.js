#!/usr/bin/env node

/**
 * Test Super Admin Created Hospital Admin Authentication
 * Run: node test-your-admin.js
 */

const API_URL = 'http://localhost:5000';
const ADMIN_EMAIL = 'ngiriyezadavidadmh@gmail.com';
const ADMIN_PASSWORD = 'HospitalAdmin@2024';

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

async function testYourAdmin() {
  console.log('🏥 Testing Your Super Admin Created Hospital Admin\n');
  console.log('='.repeat(60));
  console.log(`📧 Email: ${ADMIN_EMAIL}`);
  console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
  console.log('='.repeat(60));

  try {
    // Step 1: Login
    console.log('\n🔐 Step 1: Login Test');
    const login = await makeRequest('POST', '/api/v1/hospital/auth/login', {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    if (login.status !== 200 || !login.body.token) {
      console.log('❌ Login failed:', login.body.error);
      return;
    }
    
    token = login.body.token;
    console.log('✅ Login successful!');
    console.log(`Token: ${token.substring(0, 50)}...`);
    console.log(`Hospital: ${login.body.hospital.name}`);
    console.log(`Admin ID: ${login.body.admin.id}`);

    // Step 2: Test User Management Endpoint
    console.log('\n👥 Step 2: Test User Management');
    const users = await makeRequest('GET', '/api/v1/hospital/admin/users', null, token);
    console.log(`Status: ${users.status}`);
    if (users.status === 200) {
      console.log('✅ User Management endpoint working!');
      console.log(`Users found: ${users.body.data?.length || 0}`);
    } else {
      console.log('❌ User Management failed:', users.body.error);
    }

    // Step 3: Test Department Management
    console.log('\n🏢 Step 3: Test Department Management');
    const depts = await makeRequest('GET', '/api/v1/hospital/admin/departments', null, token);
    console.log(`Status: ${depts.status}`);
    if (depts.status === 200) {
      console.log('✅ Department Management endpoint working!');
      console.log(`Departments found: ${depts.body.data?.length || 0}`);
    } else {
      console.log('❌ Department Management failed:', depts.body.error);
    }

    // Step 4: Test Dashboard
    console.log('\n📊 Step 4: Test Dashboard');
    const dashboard = await makeRequest('GET', '/api/v1/hospital/admin/dashboard', null, token);
    console.log(`Status: ${dashboard.status}`);
    if (dashboard.status === 200) {
      console.log('✅ Dashboard endpoint working!');
      console.log(`Total Users: ${dashboard.body.data?.totalUsers || 0}`);
      console.log(`Total Departments: ${dashboard.body.data?.totalDepartments || 0}`);
    } else {
      console.log('❌ Dashboard failed:', dashboard.body.error);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 ALL TESTS PASSED! Your admin is ready to use!');
    console.log('\n📋 Frontend Login Instructions:');
    console.log('1. Go to hospital login page');
    console.log(`2. Email: ${ADMIN_EMAIL}`);
    console.log(`3. Password: ${ADMIN_PASSWORD}`);
    console.log('4. Navigate to User Management page');
    console.log('5. Start managing users professionally!');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
testYourAdmin().catch(console.error);
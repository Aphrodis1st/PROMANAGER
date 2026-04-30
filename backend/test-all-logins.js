import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

async function testAllLogins() {
  console.log('🧪 Testing All Login Endpoints\n');
  
  // Test Super Admin Login
  console.log('1️⃣ Testing Super Admin Login...');
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      email: 'ngiriyezadavid@gmail.com',
      password: 'Supper@123'
    });
    
    if (response.data.success && response.data.user.role === 'super_admin') {
      console.log('✅ Super Admin Login: SUCCESS');
      console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      console.log(`   User: ${response.data.user.email} (${response.data.user.role})`);
    } else {
      console.log('❌ Super Admin Login: FAILED - Invalid response');
      console.log('   Response:', response.data);
    }
  } catch (error) {
    console.log('❌ Super Admin Login: ERROR');
    console.log('   Error:', error.response?.data || error.message);
  }
  
  console.log('');
  
  // Test Hospital Admin Logins
  const hospitalAdmins = [
    { email: 'ngiriyezadavidadmh@gmail.com', password: 'Admin@123' },
    { email: 'admin@hospital.com', password: 'admin123' },
    { email: 'partial@hospital.com', password: 'partial123' }
  ];
  
  console.log('2️⃣ Testing Hospital Admin Logins...');
  
  for (let i = 0; i < hospitalAdmins.length; i++) {
    const admin = hospitalAdmins[i];
    console.log(`   Testing ${admin.email}...`);
    
    try {
      const response = await axios.post(`${API_BASE}/hospital/auth/login`, {
        email: admin.email,
        password: admin.password
      });
      
      if (response.data.success) {
        console.log(`   ✅ ${admin.email}: SUCCESS`);
        console.log(`      Token: ${response.data.token.substring(0, 20)}...`);
        console.log(`      User: ${response.data.user.email} (${response.data.user.role})`);
        console.log(`      Hospital: ${response.data.hospital.name}`);
      } else {
        console.log(`   ❌ ${admin.email}: FAILED - ${response.data.error}`);
      }
    } catch (error) {
      console.log(`   ❌ ${admin.email}: ERROR`);
      console.log(`      Error: ${error.response?.data?.error || error.message}`);
    }
  }
  
  console.log('');
  
  // Test Hospital User Logins
  const hospitalUsers = [
    { email: 'ngiriyezadavidnus@gmail.com', password: 'Nurse@123' },
    { email: 'doctor@hospital.com', password: 'Doctor@123' }
  ];
  
  console.log('3️⃣ Testing Hospital User Logins...');
  
  for (let i = 0; i < hospitalUsers.length; i++) {
    const user = hospitalUsers[i];
    console.log(`   Testing ${user.email}...`);
    
    try {
      const response = await axios.post(`${API_BASE}/hospital/auth/login`, {
        email: user.email,
        password: user.password
      });
      
      if (response.data.success) {
        console.log(`   ✅ ${user.email}: SUCCESS`);
        console.log(`      Token: ${response.data.token.substring(0, 20)}...`);
        console.log(`      User: ${response.data.user.email} (${response.data.user.role})`);
        console.log(`      Hospital: ${response.data.hospital.name}`);
      } else {
        console.log(`   ❌ ${user.email}: FAILED - ${response.data.error}`);
      }
    } catch (error) {
      console.log(`   ❌ ${user.email}: ERROR`);
      console.log(`      Error: ${error.response?.data?.error || error.message}`);
    }
  }
  
  console.log('\n🎉 Login Testing Complete!\n');
  
  // Print credential summary
  console.log('📋 WORKING CREDENTIALS:');
  console.log('========================');
  console.log('Super Admin:');
  console.log('  Email: ngiriyezadavid@gmail.com');
  console.log('  Password: Supper@123');
  console.log('  Endpoint: /api/v1/auth/login');
  console.log('');
  console.log('Hospital Admins:');
  hospitalAdmins.forEach(admin => {
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${admin.password}`);
  });
  console.log('  Endpoint: /api/v1/hospital/auth/login');
  console.log('');
  console.log('Hospital Users:');
  hospitalUsers.forEach(user => {
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
  });
  console.log('  Endpoint: /api/v1/hospital/auth/login');
}

// Run the test
testAllLogins().catch(console.error);
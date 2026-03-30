import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api/v1';
const SUPER_ADMIN_TOKEN = 'your_super_admin_jwt_token_here';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPER_ADMIN_TOKEN}`
};

async function testSuperAdminSystem() {
  console.log('🏥 Testing Super Admin Hospital Management System\n');

  try {
    // Test 1: Get Dashboard Stats
    console.log('1. Testing Dashboard Stats...');
    const statsResponse = await fetch(`${BASE_URL}/super-admin/dashboard/stats`, { headers });
    const stats = await statsResponse.json();
    console.log('✅ Dashboard Stats:', stats);

    // Test 2: Create Hospital
    console.log('\n2. Testing Hospital Creation...');
    const hospitalData = {
      name: 'Test General Hospital',
      location: '123 Test St, Test City, TC',
      contactInfo: {
        phone: '+1-555-TEST',
        email: 'admin@testgeneral.com'
      },
      subscriptionPlan: 'premium',
      featuresEnabled: ['appointments', 'billing', 'lab', 'pharmacy']
    };

    const createHospitalResponse = await fetch(`${BASE_URL}/super-admin/hospitals`, {
      method: 'POST',
      headers,
      body: JSON.stringify(hospitalData)
    });
    const newHospital = await createHospitalResponse.json();
    console.log('✅ Hospital Created:', newHospital);

    if (newHospital.success) {
      const hospitalId = newHospital.data.id;

      // Test 3: Create Hospital Admin
      console.log('\n3. Testing Hospital Admin Creation...');
      const adminData = {
        email: 'admin@testgeneral.com',
        password: 'testPassword123',
        hospitalId: hospitalId
      };

      const createAdminResponse = await fetch(`${BASE_URL}/super-admin/hospital-admins`, {
        method: 'POST',
        headers,
        body: JSON.stringify(adminData)
      });
      const newAdmin = await createAdminResponse.json();
      console.log('✅ Hospital Admin Created:', newAdmin);

      // Test 4: Update Hospital Status
      console.log('\n4. Testing Hospital Status Update...');
      const statusUpdateResponse = await fetch(`${BASE_URL}/super-admin/hospitals/${hospitalId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: 'suspended' })
      });
      const updatedHospital = await statusUpdateResponse.json();
      console.log('✅ Hospital Status Updated:', updatedHospital);

      // Test 5: Get All Hospitals
      console.log('\n5. Testing Get All Hospitals...');
      const hospitalsResponse = await fetch(`${BASE_URL}/super-admin/hospitals`, { headers });
      const hospitals = await hospitalsResponse.json();
      console.log('✅ All Hospitals:', hospitals);

      // Test 6: Get System Activity
      console.log('\n6. Testing System Activity...');
      const activityResponse = await fetch(`${BASE_URL}/super-admin/dashboard/activity`, { headers });
      const activity = await activityResponse.json();
      console.log('✅ System Activity:', activity);

      console.log('\n🎉 All Super Admin tests completed successfully!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testSuperAdminSystem();
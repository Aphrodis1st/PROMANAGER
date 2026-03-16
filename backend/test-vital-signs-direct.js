// Test Vital Signs API directly
import axios from 'axios';

const PATIENT_ID = 'iARXWFjagadpKCODyCPO'; // Rony's patient ID
const BASE_URL = 'http://localhost:5000/api/v1/hospital';

async function testVitalSignsAPI() {
  console.log('🧪 Testing Vital Signs API');
  console.log('==========================\n');
  
  try {
    console.log(`📡 Testing: GET ${BASE_URL}/vital-signs/patient/${PATIENT_ID}`);
    
    // Test without authentication first
    console.log('🔓 Testing without authentication...');
    try {
      const response = await axios.get(`${BASE_URL}/vital-signs/patient/${PATIENT_ID}`);
      console.log('✅ SUCCESS without auth!');
      console.log('📊 Response status:', response.status);
      console.log('📈 Data received:', response.data);
      console.log('📝 Number of records:', response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log('\n🎯 Sample record:');
        const sample = response.data[0];
        console.log('- ID:', sample.id);
        console.log('- Patient:', sample.patientName);
        console.log('- Temperature:', sample.temperature);
        console.log('- Blood Pressure:', sample.bloodPressure);
        console.log('- Heart Rate:', sample.heartRate);
        console.log('- Recorded At:', sample.recordedAt);
      }
      
      return;
    } catch (noAuthError) {
      console.log('❌ Failed without auth:', noAuthError.response?.status, noAuthError.response?.statusText);
    }
    
    // Test with a dummy token
    console.log('\n🔐 Testing with dummy token...');
    try {
      const response = await axios.get(`${BASE_URL}/vital-signs/patient/${PATIENT_ID}`, {
        headers: { Authorization: 'Bearer dummy-token' }
      });
      console.log('✅ SUCCESS with dummy token!');
      console.log('📊 Response:', response.data);
    } catch (tokenError) {
      console.log('❌ Failed with dummy token:', tokenError.response?.status, tokenError.response?.statusText);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('- Is backend server running on port 5000?');
    console.log('- Check backend console for errors');
    console.log('- Verify the patient ID exists');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If API works, the frontend auth token issue needs fixing');
  console.log('2. If API fails, check backend server and routes');
  console.log('3. Check browser network tab for actual request details');
}

testVitalSignsAPI();
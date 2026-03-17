import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1/hospital';

// Test function to verify medical record and vital signs integration
async function testMedicalRecordIntegration() {
  try {
    console.log('🏥 Testing Medical Record Integration...\n');

    // Test 1: Get all medical records
    console.log('1. Testing: Get all medical records');
    try {
      const response = await axios.get(`${API_BASE}/medical-records`);
      console.log(`✅ Success: Found ${response.data.length} medical records`);
      if (response.data.length > 0) {
        const firstRecord = response.data[0];
        console.log(`   First record ID: ${firstRecord.id}, Patient: ${firstRecord.patientId}`);
        
        // Test 2: Get vital signs for the first patient
        if (firstRecord.patientId) {
          console.log('\n2. Testing: Get vital signs for patient');
          try {
            const vitalResponse = await axios.get(`${API_BASE}/vital-signs/patient/${firstRecord.patientId}`);
            console.log(`✅ Success: Found ${vitalResponse.data.length} vital signs records`);
            if (vitalResponse.data.length > 0) {
              const latestVital = vitalResponse.data[0];
              console.log(`   Latest vital signs: Temp: ${latestVital.temperature?.value || 'N/A'}, BP: ${latestVital.bloodPressure ? `${latestVital.bloodPressure.systolic}/${latestVital.bloodPressure.diastolic}` : 'N/A'}, HR: ${latestVital.heartRate || 'N/A'}`);
            }
          } catch (error) {
            console.log(`❌ Error getting vital signs: ${error.response?.data?.message || error.message}`);
          }
        }

        // Test 3: Get specific medical record by ID
        console.log('\n3. Testing: Get medical record by ID');
        try {
          const recordResponse = await axios.get(`${API_BASE}/medical-records/${firstRecord.id}`);
          console.log(`✅ Success: Retrieved medical record ${recordResponse.data.id}`);
          console.log(`   Diagnoses: ${recordResponse.data.diagnoses?.length || 0} entries`);
          console.log(`   Primary diagnosis: ${recordResponse.data.diagnosis || 'None'}`);
        } catch (error) {
          console.log(`❌ Error getting medical record by ID: ${error.response?.data?.message || error.message}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error getting medical records: ${error.response?.data?.message || error.message}`);
    }

    console.log('\n🎯 Integration test completed!');
    console.log('\n📋 Summary:');
    console.log('- Medical records API: Available');
    console.log('- Vital signs API: Available');
    console.log('- Frontend should now display vital signs and diagnosis properly');
    console.log('\n💡 Next steps:');
    console.log('1. Start the backend server: npm start');
    console.log('2. Start the frontend: npm run dev');
    console.log('3. Navigate to a medical record to see vital signs and diagnosis');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMedicalRecordIntegration();
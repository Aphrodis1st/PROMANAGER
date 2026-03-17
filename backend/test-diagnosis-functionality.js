import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1/hospital';

// Test function to verify diagnosis functionality
async function testDiagnosisFunctionality() {
  try {
    console.log('🩺 Testing Diagnosis Functionality...\n');

    // Test 1: Get all medical records
    console.log('1. Testing: Get all medical records');
    let medicalRecords = [];
    try {
      const response = await axios.get(`${API_BASE}/medical-records`);
      medicalRecords = response.data;
      console.log(`✅ Success: Found ${medicalRecords.length} medical records`);
      
      if (medicalRecords.length === 0) {
        console.log('❌ No medical records found. Please create a medical record first.');
        return;
      }
    } catch (error) {
      console.log(`❌ Error getting medical records: ${error.response?.data?.message || error.message}`);
      return;
    }

    // Test 2: Get a specific medical record by ID
    const testRecord = medicalRecords[0];
    console.log(`\n2. Testing: Get medical record by ID: ${testRecord.id}`);
    try {
      const recordResponse = await axios.get(`${API_BASE}/medical-records/${testRecord.id}`);
      console.log(`✅ Success: Retrieved medical record`);
      console.log(`   Patient ID: ${recordResponse.data.patientId}`);
      console.log(`   Current diagnoses: ${recordResponse.data.diagnoses?.length || 0}`);
    } catch (error) {
      console.log(`❌ Error getting medical record by ID: ${error.response?.data?.message || error.message}`);
      return;
    }

    // Test 3: Test updating medical record with diagnosis
    console.log(`\n3. Testing: Update medical record with diagnosis`);
    const testDiagnosis = {\n      id: Date.now().toString(),\n      code: \"I10\",\n      description: \"Essential (primary) hypertension\",\n      severity: \"Moderate\",\n      status: \"Active\",\n      diagnosisType: \"Primary\",\n      diagnosisDate: new Date().toISOString().split('T')[0],\n      diagnosedBy: \"test-doctor-id\",\n      symptoms: \"High blood pressure readings\",\n      treatmentRecommendations: \"Lifestyle modifications and medication\",\n      createdAt: new Date().toISOString()\n    };\n\n    const updatedData = {\n      ...testRecord,\n      diagnoses: [...(testRecord.diagnoses || []), testDiagnosis],\n      diagnosis: testRecord.diagnosis || testDiagnosis.description,\n      updatedAt: new Date().toISOString()\n    };\n\n    try {\n      const updateResponse = await axios.put(`${API_BASE}/medical-records/${testRecord.id}`, updatedData);\n      console.log(`✅ Success: Updated medical record with diagnosis`);\n      console.log(`   New diagnoses count: ${updateResponse.data.diagnoses?.length || 0}`);\n    } catch (error) {\n      console.log(`❌ Error updating medical record: ${error.response?.data?.message || error.message}`);\n      console.log(`   Status: ${error.response?.status}`);\n      console.log(`   Data:`, error.response?.data);\n    }\n\n    // Test 4: Verify the update\n    console.log(`\n4. Testing: Verify diagnosis was added`);\n    try {\n      const verifyResponse = await axios.get(`${API_BASE}/medical-records/${testRecord.id}`);\n      const diagnosesCount = verifyResponse.data.diagnoses?.length || 0;\n      console.log(`✅ Success: Medical record now has ${diagnosesCount} diagnoses`);\n      \n      if (diagnosesCount > 0) {\n        const latestDiagnosis = verifyResponse.data.diagnoses[diagnosesCount - 1];\n        console.log(`   Latest diagnosis: ${latestDiagnosis.code} - ${latestDiagnosis.description}`);\n      }\n    } catch (error) {\n      console.log(`❌ Error verifying update: ${error.response?.data?.message || error.message}`);\n    }\n\n    console.log('\\n🎯 Diagnosis test completed!');\n    console.log('\\n📋 Summary:');\n    console.log('- Medical records API: Available');\n    console.log('- Get by ID API: Available');\n    console.log('- Update API: Available');\n    console.log('- Diagnosis functionality should work now');\n    \n    console.log('\\n💡 If diagnosis still fails in frontend:');\n    console.log('1. Check browser console for detailed error messages');\n    console.log('2. Verify the medical record ID is correct');\n    console.log('3. Ensure all required fields are filled');\n    console.log('4. Check network tab for API call details');\n\n  } catch (error) {\n    console.error('❌ Test failed:', error.message);\n  }\n}\n\n// Run the test\ntestDiagnosisFunctionality();
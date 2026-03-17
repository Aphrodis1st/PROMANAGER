import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1/hospital';

// Test function to verify prescription functionality
async function testPrescriptionFunctionality() {
  try {
    console.log('💊 Testing Prescription Functionality...\n');

    // Test 1: Get all prescriptions
    console.log('1. Testing: Get all prescriptions');
    try {
      const response = await axios.get(`${API_BASE}/prescriptions`);
      console.log(`✅ Success: Found ${response.data.length} prescriptions`);
    } catch (error) {
      console.log(`❌ Error getting prescriptions: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    }

    // Test 2: Create a new prescription
    console.log('\n2. Testing: Create new prescription');
    const testPrescription = {
      patientId: 'test-patient-id',
      patientName: 'Test Patient',
      doctorId: 'test-doctor-id',
      doctorName: 'Dr. Test Doctor',
      medicalRecordId: 'test-record-id',
      items: [
        {
          medication: 'Amoxicillin',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '7 days',
          qty: 21,
          instructions: 'Take with food'
        },
        {
          medication: 'Ibuprofen',
          dosage: '200mg',
          frequency: 'As needed',
          duration: '5 days',
          qty: 10,
          instructions: 'Take for pain relief'
        }
      ],
      notes: 'Patient has mild infection, monitor for allergic reactions',
      createdBy: 'hospital-staff'
    };

    try {
      const createResponse = await axios.post(`${API_BASE}/prescriptions`, testPrescription);
      console.log(`✅ Success: Created prescription with ID: ${createResponse.data.id}`);
      console.log(`   Status: ${createResponse.data.status}`);
      console.log(`   Items: ${createResponse.data.items?.length || 0} medications`);
      
      // Test 3: Get the created prescription by ID
      console.log('\n3. Testing: Get prescription by ID');
      try {
        const getResponse = await axios.get(`${API_BASE}/prescriptions/${createResponse.data.id}`);
        console.log(`✅ Success: Retrieved prescription`);
        console.log(`   Patient: ${getResponse.data.patientName}`);
        console.log(`   Doctor: ${getResponse.data.doctorName}`);
        console.log(`   Status: ${getResponse.data.status}`);
      } catch (error) {
        console.log(`❌ Error getting prescription by ID: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }

      // Test 4: Update the prescription
      console.log('\n4. Testing: Update prescription');
      try {
        const updateData = {
          ...testPrescription,
          status: 'REVIEWED',
          notes: 'Updated: Prescription reviewed and approved'
        };
        const updateResponse = await axios.put(`${API_BASE}/prescriptions/${createResponse.data.id}`, updateData);
        console.log(`✅ Success: Updated prescription`);
        console.log(`   New status: ${updateResponse.data.status}`);
      } catch (error) {
        console.log(`❌ Error updating prescription: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }

      // Test 5: Get prescriptions by patient
      console.log('\n5. Testing: Get prescriptions by patient');
      try {
        const patientResponse = await axios.get(`${API_BASE}/prescriptions/patient/test-patient-id`);
        console.log(`✅ Success: Found ${patientResponse.data.length} prescriptions for patient`);
      } catch (error) {
        console.log(`❌ Error getting patient prescriptions: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      }

    } catch (error) {
      console.log(`❌ Error creating prescription: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
      if (error.response?.status === 401) {
        console.log('   This indicates an authentication issue');
      }
    }

    console.log('\n🎯 Prescription test completed!');
    console.log('\n📋 Summary:');
    console.log('- Prescription API endpoints should now work without authentication');
    console.log('- 401 errors should be resolved');
    console.log('- Hospital staff can create prescriptions for patients');
    
    console.log('\n💡 If you still get 401 errors:');
    console.log('1. Restart the backend server');
    console.log('2. Check if the routes are properly registered');
    console.log('3. Verify the API URL is correct');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testPrescriptionFunctionality();
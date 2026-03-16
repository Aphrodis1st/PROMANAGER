// Quick test to verify vital signs API and data format
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/hospital';
const MEDICAL_RECORD_ID = 'nyr5MdqXgl6eCAWlv69E';

async function testVitalSignsAPI() {
  console.log('🧪 Testing Vital Signs API');
  console.log('==========================\n');
  
  try {
    // Test with a known patient ID (from mock data)
    const testPatientIds = [
      'qwCCVRquMhl6BnhFoVTy', // John Doe
      'vLiQLk1oboJIfbK0fJeI', // Jane Smith
      'patient-3',              // Mike Johnson
      'iARXWFjagadpKCODyCPO'   // Rony
    ];
    
    for (const patientId of testPatientIds) {
      console.log(`📊 Testing patient ID: ${patientId}`);
      
      try {
        const response = await axios.get(`${BASE_URL}/vital-signs/patient/${patientId}`);
        console.log(`✅ API Response: ${response.status}`);
        console.log(`📈 Records found: ${response.data?.length || 0}`);
        
        if (response.data && response.data.length > 0) {
          const firstRecord = response.data[0];
          console.log('📋 Sample record structure:');
          console.log('   - ID:', firstRecord.id);
          console.log('   - Patient:', firstRecord.patientName);
          console.log('   - Temperature:', firstRecord.temperature);
          console.log('   - Blood Pressure:', firstRecord.bloodPressure);
          console.log('   - Heart Rate:', firstRecord.heartRate);
          console.log('   - Recorded At:', firstRecord.recordedAt);
          console.log('   - Recorded By:', firstRecord.recordedBy);
          
          // Test date parsing
          let parsedDate = 'Could not parse';
          try {
            if (firstRecord.recordedAt?.seconds) {
              parsedDate = new Date(firstRecord.recordedAt.seconds * 1000).toLocaleString();
            } else if (firstRecord.recordedAt?._seconds) {
              parsedDate = new Date(firstRecord.recordedAt._seconds * 1000).toLocaleString();
            } else {
              const date = new Date(firstRecord.recordedAt);
              if (!isNaN(date.getTime())) {
                parsedDate = date.toLocaleString();
              }
            }
          } catch (e) {
            parsedDate = `Parse error: ${e.message}`;
          }
          console.log('   - Parsed Date:', parsedDate);
          
          console.log('✅ Found data for this patient!\n');
          break; // Found data, no need to test other patients
        } else {
          console.log('⚠️ No vital signs data found\n');
        }
      } catch (error) {
        console.log(`❌ Error for patient ${patientId}:`, error.response?.status || error.message);
        console.log('');
      }
    }
    
    console.log('🎯 Next Steps:');
    console.log('1. If no data found, run: add-vitals-for-medical-record.bat');
    console.log('2. If data found but dates are wrong, check the date parsing logic');
    console.log('3. If API errors, check backend server is running on port 5000');
    console.log(`4. Test the medical record page: http://localhost:5173/hospital/medical-records/view/${MEDICAL_RECORD_ID}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('- Ensure backend server is running: npm start or node src/server.js');
    console.log('- Check if port 5000 is available');
    console.log('- Verify Firebase configuration');
  }
}

testVitalSignsAPI();
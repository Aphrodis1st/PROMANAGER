// Add Vital Signs for Rony
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/v1/hospital';
const PATIENT_ID = 'iARXWFjagadpKCODyCPO';
const PATIENT_NAME = 'Rony';

const vitalSignsData = [
  {
    patientId: PATIENT_ID,
    patientName: PATIENT_NAME,
    temperature: '37.2',
    tempUnit: 'C',
    systolic: '125',
    diastolic: '82',
    heartRate: '78',
    respiratoryRate: '16',
    spo2: '98',
    weight: '72',
    height: '175',
    glucose: '95',
    pain: '2',
    recordedBy: 'Dr. Clarisse',
    recordedAt: new Date().toISOString(),
    notes: 'Patient stable, normal vitals'
  },
  {
    patientId: PATIENT_ID,
    patientName: PATIENT_NAME,
    temperature: '37.0',
    tempUnit: 'C',
    systolic: '120',
    diastolic: '80',
    heartRate: '75',
    respiratoryRate: '15',
    spo2: '99',
    weight: '72',
    height: '175',
    glucose: '88',
    pain: '1',
    recordedBy: 'Nurse Johnson',
    recordedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    notes: 'Morning vitals, patient feeling well'
  },
  {
    patientId: PATIENT_ID,
    patientName: PATIENT_NAME,
    temperature: '36.8',
    tempUnit: 'C',
    systolic: '118',
    diastolic: '78',
    heartRate: '72',
    respiratoryRate: '14',
    spo2: '99',
    weight: '72',
    height: '175',
    glucose: '92',
    pain: '0',
    recordedBy: 'Dr. Clarisse',
    recordedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    notes: 'Baseline vitals on admission'
  }
];

async function addVitalSignsForRony() {
  console.log('🏥 Adding vital signs for Rony...');
  console.log('=====================================');
  
  try {
    for (let i = 0; i < vitalSignsData.length; i++) {
      const vitals = vitalSignsData[i];
      console.log(`\n📊 Adding vital signs record ${i + 1}/3...`);
      
      const response = await axios.post(`${BASE_URL}/vital-signs`, vitals);
      
      if (response.data.success) {
        console.log(`✅ Record ${i + 1} added successfully:`, response.data.data.id);
      } else {
        console.log(`⚠️ Record ${i + 1} added with response:`, response.data);
      }
    }
    
    console.log('\n🎉 All vital signs added successfully!');
    console.log('=====================================');
    console.log('\n🎯 Next steps:');
    console.log('1. Refresh your medical record page:');
    console.log('   http://localhost:5173/hospital/medical-records/view/nyr5MdqXgl6eCAWlv69E');
    console.log('2. You should now see:');
    console.log('   - Latest vital signs with actual values');
    console.log('   - Vital signs history table with 3 records');
    console.log('   - Proper timestamps instead of "Invalid Date"');
    
  } catch (error) {
    console.error('❌ Error adding vital signs:', error.response?.data || error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log('- Make sure backend server is running on port 5000');
    console.log('- Check server logs for detailed error messages');
    console.log('- Verify the patient ID exists in the database');
  }
}

// Run the script
addVitalSignsForRony();
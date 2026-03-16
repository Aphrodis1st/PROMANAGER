// Add Vital Signs for Medical Record Patient
import axios from 'axios';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const BASE_URL = 'http://localhost:5000/api/v1/hospital';
const MEDICAL_RECORD_ID = 'nyr5MdqXgl6eCAWlv69E';

async function findPatientForMedicalRecord() {
  console.log('🔍 Finding patient for medical record:', MEDICAL_RECORD_ID);
  
  try {
    // Search in all patients' medical records
    const patientsSnapshot = await db.collection('patients').get();
    
    for (const patientDoc of patientsSnapshot.docs) {
      const patientId = patientDoc.id;
      const patientData = patientDoc.data();
      
      // Check medical records subcollection
      const medicalRecordsSnapshot = await db
        .collection('patients')
        .doc(patientId)
        .collection('medicalRecords')
        .doc(MEDICAL_RECORD_ID)
        .get();
      
      if (medicalRecordsSnapshot.exists) {
        console.log('✅ Found patient:', patientData.fullName || patientData.name);
        console.log('   Patient ID:', patientId);
        return {
          id: patientId,
          name: patientData.fullName || patientData.name || 'Unknown Patient'
        };
      }
    }
    
    // If not found in subcollection, check main medicalRecords collection
    const recordSnapshot = await db.collection('medicalRecords').doc(MEDICAL_RECORD_ID).get();
    if (recordSnapshot.exists) {
      const recordData = recordSnapshot.data();
      console.log('✅ Found medical record with patient ID:', recordData.patientId);
      
      const patientSnapshot = await db.collection('patients').doc(recordData.patientId).get();
      if (patientSnapshot.exists) {
        const patientData = patientSnapshot.data();
        return {
          id: recordData.patientId,
          name: patientData.fullName || patientData.name || 'Unknown Patient'
        };
      }
    }
    
    console.log('❌ Medical record not found');
    return null;
  } catch (error) {
    console.error('Error finding patient:', error);
    return null;
  }
}

async function addVitalSigns(patientId, patientName) {
  console.log('\n📊 Adding vital signs for:', patientName);
  console.log('=====================================');
  
  const vitalSignsData = [
    {
      patientId: patientId,
      patientName: patientName,
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
      recordedBy: 'Dr. Smith',
      recordedAt: new Date().toISOString(),
      notes: 'Patient stable, normal vitals'
    },
    {
      patientId: patientId,
      patientName: patientName,
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
      recordedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      notes: 'Morning vitals, patient feeling well'
    },
    {
      patientId: patientId,
      patientName: patientName,
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
      recordedBy: 'Dr. Smith',
      recordedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Baseline vitals on admission'
    }
  ];
  
  try {
    for (let i = 0; i < vitalSignsData.length; i++) {
      const vitals = vitalSignsData[i];
      console.log(`\n📝 Adding record ${i + 1}/3...`);
      
      const response = await axios.post(`${BASE_URL}/vital-signs`, vitals);
      
      if (response.data.success) {
        console.log(`✅ Record ${i + 1} added successfully`);
      }
    }
    
    console.log('\n🎉 All vital signs added successfully!');
    console.log('=====================================');
    console.log('\n🎯 Next steps:');
    console.log('1. Refresh your medical record page:');
    console.log(`   http://localhost:5173/hospital/medical-records/view/${MEDICAL_RECORD_ID}`);
    console.log('2. You should now see vital signs data with proper dates');
    
  } catch (error) {
    console.error('❌ Error adding vital signs:', error.response?.data || error.message);
  }
}

async function main() {
  console.log('🏥 Medical Record Vital Signs Setup');
  console.log('=====================================\n');
  
  const patient = await findPatientForMedicalRecord();
  
  if (patient) {
    await addVitalSigns(patient.id, patient.name);
  } else {
    console.log('\n⚠️ Could not find patient for medical record');
    console.log('Please verify the medical record ID is correct');
  }
  
  process.exit(0);
}

main();

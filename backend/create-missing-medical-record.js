// Add Missing Medical Record
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Initialize Firebase Admin
const serviceAccount = JSON.parse(readFileSync('./firebase-service-account.json', 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const MEDICAL_RECORD_ID = 'nyr5MdqXgl6eCAWlv69E';

async function createMissingMedicalRecord() {
  console.log('🏥 Creating Missing Medical Record');
  console.log('=====================================\n');
  
  try {
    // First, let's find a patient to associate with this record
    const patientsSnapshot = await db.collection('patients').get();
    
    if (patientsSnapshot.empty) {
      console.log('❌ No patients found in database');
      return;
    }
    
    // Use the first patient (or you can specify a particular one)
    const firstPatient = patientsSnapshot.docs[0];
    const patientData = firstPatient.data();
    const patientId = firstPatient.id;
    
    console.log('👤 Using patient:', patientData.fullName || patientData.name);
    console.log('🆔 Patient ID:', patientId);
    
    // Create the medical record
    const medicalRecordData = {
      id: MEDICAL_RECORD_ID,
      patientId: patientId,
      patientName: patientData.fullName || patientData.name,
      recordNumber: `MR-${Date.now()}`,
      visitDate: new Date().toISOString().split('T')[0],
      visitType: 'Outpatient',
      primaryDoctor: 'Dr. Smith',
      chiefComplaint: 'Routine checkup and vital signs monitoring',
      presentIllness: 'Patient presents for routine health assessment. No acute complaints at this time.',
      diagnosis: 'Routine health maintenance',
      treatmentPlan: 'Continue routine monitoring. Follow up as needed.',
      notes: 'Patient stable. Vital signs to be recorded regularly.',
      status: 'Active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to main medicalRecords collection
    await db.collection('medicalRecords').doc(MEDICAL_RECORD_ID).set(medicalRecordData);
    console.log('✅ Created medical record in main collection');
    
    // Also add to patient's subcollection
    await db
      .collection('patients')
      .doc(patientId)
      .collection('medicalRecords')
      .doc(MEDICAL_RECORD_ID)
      .set(medicalRecordData);
    console.log('✅ Created medical record in patient subcollection');
    
    console.log('\n🎉 Medical record created successfully!');
    console.log('=====================================');
    console.log('\n🎯 Next steps:');
    console.log('1. Refresh your page:');
    console.log(`   http://localhost:5173/hospital/medical-records/view/${MEDICAL_RECORD_ID}`);
    console.log('2. The page should now load the medical record');
    console.log('3. You can record vital signs and they will be associated with this record');
    
  } catch (error) {
    console.error('❌ Error creating medical record:', error);
    console.log('\n🔍 Troubleshooting:');
    console.log('- Make sure Firebase Admin SDK is properly configured');
    console.log('- Check if you have write permissions to Firestore');
    console.log('- Verify the service account key is valid');
  }
  
  process.exit(0);
}

createMissingMedicalRecord();
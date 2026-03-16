// Test script to add sample prescription data
import { initFirebase, db } from './utils/firebase.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const addSamplePrescriptions = async () => {
  try {
    // Initialize Firebase first
    console.log('🔥 Initializing Firebase...');
    await initFirebase(process.env.SERVICE_ACCOUNT_PATH);
    
    console.log('🧪 Adding sample prescription data...');
    
    const prescriptionsCollection = db().collection('prescriptions');
    
    // Sample prescription data
    const samplePrescriptions = [
      {
        medicalRecordId: 'nyr5MdqXgl6eCAWlv69E', // Use the medical record ID we've been working with
        patientId: 'patient1',
        patientName: 'Bony',
        prescribedBy: 'doc1',
        prescriptionDate: '2024-01-15',
        diagnosis: 'Upper Respiratory Infection',
        medications: [
          {
            medicationName: 'Amoxicillin',
            genericName: 'Amoxicillin',
            strength: '500mg',
            dosage: '1 tablet',
            frequency: 'TID',
            duration: '7 days',
            route: 'Oral',
            quantity: '21',
            refills: '0',
            instructions: 'Take with food to avoid stomach upset'
          },
          {
            medicationName: 'Paracetamol',
            genericName: 'Acetaminophen',
            strength: '500mg',
            dosage: '1-2 tablets',
            frequency: 'QID',
            duration: '5 days',
            route: 'Oral',
            quantity: '40',
            refills: '1',
            instructions: 'Take as needed for fever or pain. Do not exceed 8 tablets in 24 hours'
          }
        ],
        urgency: 'Routine',
        substitutionAllowed: true,
        pharmacyNotes: 'Patient has no known drug allergies. Please counsel on proper antibiotic use.',
        status: 'Active',
        createdAt: new Date(),
        createdBy: 'hospital-staff'
      },
      {
        medicalRecordId: 'nyr5MdqXgl6eCAWlv69E',
        patientId: 'patient1',
        patientName: 'Bony',
        prescribedBy: 'doc2',
        prescriptionDate: '2024-01-10',
        diagnosis: 'Hypertension',
        medications: [
          {
            medicationName: 'Lisinopril',
            genericName: 'Lisinopril',
            strength: '10mg',
            dosage: '1 tablet',
            frequency: 'QD',
            duration: '30 days',
            route: 'Oral',
            quantity: '30',
            refills: '5',
            instructions: 'Take once daily in the morning. Monitor blood pressure regularly.'
          }
        ],
        urgency: 'Routine',
        substitutionAllowed: true,
        pharmacyNotes: 'Long-term medication for blood pressure control.',
        status: 'Active',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdBy: 'hospital-staff'
      }
    ];
    
    // Add each prescription
    for (const prescription of samplePrescriptions) {
      const docRef = await prescriptionsCollection.add(prescription);
      console.log(`✅ Added prescription with ID: ${docRef.id}`);
    }
    
    console.log('🎉 Sample prescription data added successfully!');
    
    // Verify the data was added
    const snapshot = await prescriptionsCollection.where('patientId', '==', 'patient1').get();
    console.log(`📊 Total prescriptions for patient1: ${snapshot.size}`);
    
    snapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- Prescription ${doc.id}: ${data.diagnosis} (${data.medications?.length || 0} medications)`);
    });
    
  } catch (error) {
    console.error('❌ Error adding sample prescriptions:', error);
  }
};

// Run the script
addSamplePrescriptions().then(() => {
  console.log('✅ Script completed');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
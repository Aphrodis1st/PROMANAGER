import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('medicalRecords');

export const createMedicalRecord = async (data) => {
  console.log('Creating medical record with data:', data);
  try {
    const doc = await coll().add({ ...data, createdAt: new Date() });
    console.log('Medical record created with ID:', doc.id);
    const result = { id: doc.id, ...data, createdAt: new Date() };
    console.log('Returning result:', result);
    return result;
  } catch (error) {
    console.error('Error creating medical record:', error);
    throw error;
  }
};

export const getRecordsByPatient = async (patientId) => {
  console.log('Fetching records for patient ID:', patientId);
  try {
    const snap = await coll()
      .where('patientId', '==', patientId)
      .get();

    console.log('Firestore query returned', snap.docs.length, 'documents');
    const records = snap.docs.map(d => {
      const data = d.data();
      console.log('Record data:', { id: d.id, ...data });
      return { id: d.id, ...data };
    });
    
    // Sort by createdAt in JavaScript instead of Firestore
    const sortedRecords = records.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA; // desc order
    });
    
    console.log('Returning sorted records:', sortedRecords);
    return sortedRecords;
  } catch (error) {
    console.error('Error fetching medical records:', error);
    // Return empty array instead of throwing
    return [];
  }
};

export const updateMedicalRecord = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const getAllMedicalRecords = async () => {
  console.log('Fetching all medical records');
  try {
    const snap = await coll().get();
    console.log('Firestore query returned', snap.docs.length, 'documents');
    const records = snap.docs.map(d => {
      const data = d.data();
      return { id: d.id, ...data };
    });
    
    // Sort by createdAt in JavaScript
    const sortedRecords = records.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA; // desc order
    });
    
    console.log('Returning sorted records:', sortedRecords.length);
    return sortedRecords;
  } catch (error) {
    console.error('Error fetching all medical records:', error);
    return [];
  }
};

export const getMedicalRecordById = async (id) => {
  console.log('Fetching medical record by ID:', id);
  try {
    const doc = await coll().doc(id).get();
    if (!doc.exists) {
      console.log('Medical record not found:', id);
      return null;
    }
    const data = doc.data();
    console.log('Found medical record:', { id: doc.id, ...data });
    return { id: doc.id, ...data };
  } catch (error) {
    console.error('Error fetching medical record by ID:', error);
    return null;
  }
};

export const deleteMedicalRecord = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
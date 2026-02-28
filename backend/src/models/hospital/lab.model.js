import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('labTests');

// CREATE LAB TEST
export const createLabTest = async (data) => {
  const doc = await coll().add({
    ...data,
    status: 'PENDING',
    createdAt: new Date()
  });

  return { id: doc.id, ...data };
};

// GET ALL LAB TESTS
export const getLabTests = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// GET BY PATIENT
export const getLabTestsByPatient = async (patientId) => {
  const snap = await coll()
    .where('patientId', '==', patientId)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// UPDATE RESULT
export const updateLabTest = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({
    ...data,
    status: 'COMPLETED',
    updatedAt: new Date()
  });

  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

// DELETE
export const deleteLabTest = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
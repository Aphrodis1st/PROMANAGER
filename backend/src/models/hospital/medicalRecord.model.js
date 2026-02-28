import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('medicalRecords');

export const createMedicalRecord = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getRecordsByPatient = async (patientId) => {
  const snap = await coll()
    .where('patientId', '==', patientId)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateMedicalRecord = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteMedicalRecord = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
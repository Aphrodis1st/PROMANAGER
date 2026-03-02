import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('doctors');

export const createDoctor = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getDoctors = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getDoctorById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateDoctor = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteDoctor = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
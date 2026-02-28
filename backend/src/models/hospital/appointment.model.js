import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('appointments');

export const createAppointment = async (data) => {
  const doc = await coll().add({ ...data, status: 'SCHEDULED', createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getAppointments = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateAppointment = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteAppointment = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
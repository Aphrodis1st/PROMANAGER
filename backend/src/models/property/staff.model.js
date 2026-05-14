import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('propertyStaff');

export const createStaff = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getStaff = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.propertyId) query = query.where('propertyId', '==', filters.propertyId);
  if (filters.role) query = query.where('role', '==', filters.role);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getStaffById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateStaff = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteStaff = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

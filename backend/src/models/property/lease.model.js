import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('leases');

export const createLease = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getLeases = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.tenantId) query = query.where('tenantId', '==', filters.tenantId);
  if (filters.unitId) query = query.where('unitId', '==', filters.unitId);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getLeaseById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateLease = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteLease = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

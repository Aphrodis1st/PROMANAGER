import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('properties');

export const createProperty = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getProperties = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.ownerId) query = query.where('ownerId', '==', filters.ownerId);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getPropertyById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateProperty = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteProperty = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

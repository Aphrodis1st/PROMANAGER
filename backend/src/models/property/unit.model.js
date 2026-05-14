import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('units');

export const createUnit = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getUnits = async (filters = {}) => {
  let query = coll();
  if (filters.propertyId) query = query.where('propertyId', '==', filters.propertyId);
  if (filters.status) query = query.where('status', '==', filters.status);
  const snap = await query.get();
  const units = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  return units.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
};

export const getUnitById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateUnit = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteUnit = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

export const bulkImportUnits = async (units) => {
  const batch = db().batch();
  const results = [];
  units.forEach(unit => {
    const ref = coll().doc();
    batch.set(ref, { ...unit, createdAt: new Date() });
    results.push({ id: ref.id, ...unit });
  });
  await batch.commit();
  return results;
};

import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('insuranceProviders');

export const createInsuranceProvider = async (data) => {
  const doc = await coll().add({ 
    ...data, 
    status: 'Active',
    createdAt: new Date() 
  });
  return { id: doc.id, ...data, status: 'Active' };
};

export const getInsuranceProviders = async () => {
  const snap = await coll().orderBy('name', 'asc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getInsuranceProviderById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateInsuranceProvider = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteInsuranceProvider = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
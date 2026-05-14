import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('propertyBilling');

export const createInvoice = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getInvoices = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.tenantId) query = query.where('tenantId', '==', filters.tenantId);
  if (filters.status) query = query.where('status', '==', filters.status);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getInvoiceById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateInvoice = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteInvoice = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

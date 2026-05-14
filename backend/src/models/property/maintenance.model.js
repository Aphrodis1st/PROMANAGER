import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('maintenance');

export const createTicket = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

export const getTickets = async (filters = {}) => {
  let query = coll().orderBy('createdAt', 'desc');
  if (filters.propertyId) query = query.where('propertyId', '==', filters.propertyId);
  if (filters.status) query = query.where('status', '==', filters.status);
  if (filters.technicianId) query = query.where('technicianId', '==', filters.technicianId);
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const getTicketById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const updateTicket = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

export const deleteTicket = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

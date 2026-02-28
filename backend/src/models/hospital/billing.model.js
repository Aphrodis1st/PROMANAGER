import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('billing');

// CREATE INVOICE
export const createInvoice = async (data) => {
  const doc = await coll().add({
    ...data,
    status: 'UNPAID',
    createdAt: new Date()
  });

  return { id: doc.id, ...data };
};

// GET ALL
export const getInvoices = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// GET BY PATIENT
export const getInvoicesByPatient = async (patientId) => {
  const snap = await coll()
    .where('patientId', '==', patientId)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// MARK AS PAID
export const markInvoicePaid = async (id) => {
  const ref = coll().doc(id);
  await ref.update({
    status: 'PAID',
    paidAt: new Date()
  });

  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

// DELETE
export const deleteInvoice = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
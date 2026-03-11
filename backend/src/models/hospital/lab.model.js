import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('labTests');
const ordersColl = () => db().collection('labOrders');

// CREATE LAB TEST
export const createLabTest = async (data) => {
  const doc = await coll().add({
    ...data,
    status: 'PENDING',
    createdAt: new Date()
  });

  return { id: doc.id, ...data };
};

// GET ALL LAB TESTS
export const getLabTests = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// GET BY PATIENT
export const getLabTestsByPatient = async (patientId) => {
  const snap = await coll()
    .where('patientId', '==', patientId)
    .orderBy('createdAt', 'desc')
    .get();

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// UPDATE RESULT
export const updateLabTest = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({
    ...data,
    status: 'COMPLETED',
    updatedAt: new Date()
  });

  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

// DELETE
export const deleteLabTest = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};

// CREATE LAB ORDER
export const createLabOrder = async (data) => {
  const doc = await ordersColl().add({
    ...data,
    createdAt: new Date()
  });

  return { id: doc.id, ...data };
};

// GET ALL LAB ORDERS
export const getLabOrders = async () => {
  const snap = await ordersColl().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// GET LAB ORDER BY ID
export const getLabOrderById = async (id) => {
  const doc = await ordersColl().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// UPDATE LAB ORDER
export const updateLabOrder = async (id, data) => {
  const ref = ordersColl().doc(id);
  await ref.update({
    ...data,
    updatedAt: new Date()
  });

  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};
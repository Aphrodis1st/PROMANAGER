import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('departments');

// CREATE
export const createDepartment = async (data) => {
  const doc = await coll().add({ ...data, createdAt: new Date() });
  return { id: doc.id, ...data };
};

// GET ALL
export const getDepartments = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// GET BY ID
export const getDepartmentById = async (id) => {
  const doc = await coll().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

// UPDATE
export const updateDepartment = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({ ...data, updatedAt: new Date() });
  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

// DELETE
export const deleteDepartment = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
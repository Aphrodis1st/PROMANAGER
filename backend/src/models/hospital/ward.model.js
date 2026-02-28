import { db } from '../../../utils/firebase.js';

const coll = () => db().collection('wards');

// CREATE
export const createWard = async (data) => {
  const doc = await coll().add({
    ...data,
    createdAt: new Date()
  });

  return { id: doc.id, ...data };
};

// GET ALL
export const getWards = async () => {
  const snap = await coll().orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

// UPDATE
export const updateWard = async (id, data) => {
  const ref = coll().doc(id);
  await ref.update({
    ...data,
    updatedAt: new Date()
  });

  const updated = await ref.get();
  return { id: updated.id, ...updated.data() };
};

// DELETE
export const deleteWard = async (id) => {
  await coll().doc(id).delete();
  return { success: true };
};
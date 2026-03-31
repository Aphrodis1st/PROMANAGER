// backend/src/models/stock/transfer.model.js
import { db } from '../../../utils/firebase.js';
import admin from 'firebase-admin';

const getTransferCollection = () => db().collection('transfers');

export const TransferModel = {
  async create(data) {
    const transferCollection = getTransferCollection();
    const newDoc = transferCollection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const transferData = {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(transferData);
    return { id: newDoc.id, ...transferData };
  },

  async findAll() {
    const transferCollection = getTransferCollection();
    const snapshot = await transferCollection.get();
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      };
    });
  },

  async findById(id) {
    const transferCollection = getTransferCollection();
    const snap = await transferCollection.doc(id).get();
    if (!snap.exists) return null;
    const data = snap.data();
    return {
      id: snap.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
    };
  },

  async update(id, data) {
    const transferCollection = getTransferCollection();
    const ref = transferCollection.doc(id);
    const updateData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await ref.update(updateData);
    return { id, ...updateData };
  },

  async remove(id) {
    const transferCollection = getTransferCollection();
    await transferCollection.doc(id).delete();
    return { id };
  },
};

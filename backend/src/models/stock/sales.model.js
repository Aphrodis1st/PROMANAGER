import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getSalesCollection = () => db().collection("sales");

export const SalesModel = {
  // CREATE SALE
  async create(data) {
    const salesCollection = getSalesCollection();
    const newDoc = salesCollection.doc();
    const payload = {
      ...data,
      id: newDoc.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await newDoc.set(payload);
    return { id: newDoc.id, ...data };
  },

  // FIND ALL SALES
  async findAll() {
    const salesCollection = getSalesCollection();
    const snapshot = await salesCollection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // FIND ONE SALE BY ID
  async findById(id) {
    const salesCollection = getSalesCollection();
    const doc = await salesCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // UPDATE SALE
  async update(id, data) {
    const salesCollection = getSalesCollection();
    const ref = salesCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return null;

    const updated = {
      ...doc.data(),
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update(updated);
    return updated;
  },

  // DELETE SALE
  async remove(id) {
    const salesCollection = getSalesCollection();
    const ref = salesCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  },
};

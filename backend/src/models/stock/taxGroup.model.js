import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getTaxGroupCollection = () => db().collection("taxGroups");

export const TaxGroupModel = {
  async create(data) {
    const collection = getTaxGroupCollection();
    const newDoc = collection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const payload = {
      id: newDoc.id,
      groupName: data.groupName || "",
      groupCode: data.groupCode || "",
      taxIds: data.taxIds || [],
      description: data.description || "",
      isActive: data.isActive !== false,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(payload);
    return { id: newDoc.id, ...payload };
  },

  async getAll() {
    const collection = getTaxGroupCollection();
    const snapshot = await collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const collection = getTaxGroupCollection();
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const collection = getTaxGroupCollection();
    const ref = collection.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;

    const updatedData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update(updatedData);
    return { id, ...existing.data(), ...updatedData };
  },

  async remove(id) {
    const collection = getTaxGroupCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  },
};

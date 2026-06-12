import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getAccountsCollection = () => db().collection("accounts");

export const AccountModel = {
  async create(data) {
    const accountsCollection = getAccountsCollection();
    const newDoc = accountsCollection.doc(); // Firestore auto-ID
    const payload = {
      ...data,
      code: data.code || "",
      name: data.name || "",
      accountType: data.accountType || data.type || "",
      category: data.category || "",
      subCategory: data.subCategory || "",
      statement: data.statement || "",
      status: data.status || "Active",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await newDoc.set(payload);
    return { id: newDoc.id, ...payload };
  },

  async findAll() {
    const accountsCollection = getAccountsCollection();
    const snapshot = await accountsCollection.get();
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async findById(id) {
    const accountsCollection = getAccountsCollection();
    const doc = await accountsCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const accountsCollection = getAccountsCollection();
    const ref = accountsCollection.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;

    const payload = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await ref.update(payload);
    return { id, ...existing.data(), ...payload };
  },

  async remove(id) {
    const accountsCollection = getAccountsCollection();
    const ref = accountsCollection.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return false;
    await ref.delete();
    return true;
  },

  async removeAll() {
    const accountsCollection = getAccountsCollection();
    const snapshot = await accountsCollection.get();
    const batch = db().batch();
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    return snapshot.size;
  }
};

import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getCustomerCollection = () => db().collection("customers");

export const CustomerModel = {
  async create(data) {
    const customerCollection = getCustomerCollection();
    const newDoc = customerCollection.doc();
    await newDoc.set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id: newDoc.id, ...data };
  },

  async findAll() {
    const customerCollection = getCustomerCollection();
    const snapshot = await customerCollection.get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async findById(id) {
    const customerCollection = getCustomerCollection();
    const snap = await customerCollection.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  async update(id, data) {
    const customerCollection = getCustomerCollection();
    const ref = customerCollection.doc(id);
    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id, ...data };
  },

  async remove(id) {
    const customerCollection = getCustomerCollection();
    const ref = customerCollection.doc(id);
    await ref.delete();
    return { id };
  },
};

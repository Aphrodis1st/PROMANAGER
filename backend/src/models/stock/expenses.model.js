import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getExpensesCollection = () => db().collection("expenses");

export const ExpenseModel = {
  async create(data) {
    const expensesCollection = getExpensesCollection();
    const newDoc = expensesCollection.doc();
    await newDoc.set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id: newDoc.id, ...data };
  },

  async findAll() {
    const expensesCollection = getExpensesCollection();
    const snapshot = await expensesCollection.orderBy("date", "desc").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async findById(id) {
    const expensesCollection = getExpensesCollection();
    const doc = await expensesCollection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async remove(id) {
    const expensesCollection = getExpensesCollection();
    const result = await expensesCollection.doc(id).delete();
    return true;
  }
};

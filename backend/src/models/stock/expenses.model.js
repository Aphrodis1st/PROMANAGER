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

  async update(id, data) {
    const expensesCollection = getExpensesCollection();
    const docRef = expensesCollection.doc(id);
    
    // Check if document exists
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error('Expense not found');
    }
    
    // Update the document
    await docRef.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Return updated document
    const updatedDoc = await docRef.get();
    return { id: updatedDoc.id, ...updatedDoc.data() };
  },

  async remove(id) {
    const expensesCollection = getExpensesCollection();
    const result = await expensesCollection.doc(id).delete();
    return true;
  }
};

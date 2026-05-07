import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getCollection = () => db().collection("inventoryLedger");

export const InventoryLedgerModel = {
  async create(data) {
    const collection = getCollection();
    const newDoc = collection.doc();
    
    const payload = {
      id: newDoc.id,
      productId: data.productId,
      transactionType: data.transactionType, // 'OPENING', 'PURCHASE', 'PRODUCTION', 'SALE'
      transactionId: data.transactionId,
      transactionDate: data.transactionDate || new Date().toISOString(),
      quantity: Number(data.quantity),
      unitCost: Number(data.unitCost),
      totalCost: Number(data.quantity) * Number(data.unitCost),
      remainingQuantity: Number(data.quantity),
      batchNumber: data.batchNumber || null,
      expiryDate: data.expiryDate || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    await newDoc.set(payload);
    return { id: newDoc.id, ...payload };
  },

  async findByProduct(productId) {
    const collection = getCollection();
    const snapshot = await collection
      .where("productId", "==", productId)
      .where("remainingQuantity", ">", 0)
      .orderBy("transactionDate", "asc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateRemainingQuantity(id, newQuantity) {
    const collection = getCollection();
    const ref = collection.doc(id);
    await ref.update({
      remainingQuantity: Number(newQuantity),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  },

  async getAllByProduct(productId) {
    const collection = getCollection();
    const snapshot = await collection
      .where("productId", "==", productId)
      .orderBy("transactionDate", "desc")
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
};

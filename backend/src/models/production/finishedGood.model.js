// models/production/finishedGood.model.js
import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";
import { InventoryLedgerModel } from "../stock/inventoryLedger.model.js";

const getCollection = () => db().collection("finishedGoods");

export const FinishedGoodModel = {
  async create(data) {
    const collection = getCollection();
    const doc = collection.doc();
    const payload = {
      id: doc.id,
      cycleId: data.cycleId,
      planId: data.planId,
      productId: data.productId,
      productName: data.productName,
      quantityProduced: Number(data.quantityProduced) || 0,
      unitCost: Number(data.unitCost) || 0,
      totalCost: Number(data.totalCost) || 0,
      addedToInventory: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await doc.set(payload);
    return payload;
  },

  async findAll() {
    const collection = getCollection();
    const snap = await collection.orderBy("createdAt", "desc").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async findByCycle(cycleId) {
    const collection = getCollection();
    const snap = await collection.where("cycleId", "==", cycleId).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async update(id, data) {
    const collection = getCollection();
    const existing = await this.findById(id);
    
    // If adding to inventory for the first time, record in ledger
    if (data.addedToInventory && !existing.addedToInventory && existing.productId) {
      await InventoryLedgerModel.create({
        productId: existing.productId,
        transactionType: 'PRODUCTION',
        transactionId: id,
        transactionDate: new Date().toISOString(),
        quantity: Number(existing.quantityProduced),
        unitCost: Number(existing.unitCost) || 0,
      });
    }
    
    const upd = { ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    await collection.doc(id).update(upd);
    return this.findById(id);
  },

  async findById(id) {
    const collection = getCollection();
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async remove(id) {
    const collection = getCollection();
    const result = await collection.doc(id).delete();
    return true;
  },
};

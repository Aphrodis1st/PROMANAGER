// backend/src/models/stock/purchase.model.js
import { db } from '../../../utils/firebase.js';
import admin from 'firebase-admin';
import { ProductSettingModel } from './productSetting.model.js';
import { TaxTransactionModel } from './taxTransaction.model.js';

// Lazy-loaded collection
const getPurchaseCollection = () => db().collection('purchases');

export const PurchaseModel = {
  async create(data) {
    const purchaseCollection = getPurchaseCollection();
    const newDoc = purchaseCollection.doc();
    const purchaseData = {
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    await newDoc.set(purchaseData);
    
    // Update product stock
    if (data.productId && data.quantity) {
      await ProductSettingModel.updateStock(data.productId, Number(data.quantity));
    }
    
    // Record tax transactions
    if (data.taxes && Array.isArray(data.taxes)) {
      for (const tax of data.taxes) {
        await TaxTransactionModel.create({
          transactionType: "Purchase",
          transactionId: newDoc.id,
          transactionDate: data.date || new Date().toISOString(),
          taxId: tax.taxId,
          taxName: tax.taxName,
          taxCode: tax.taxCode,
          taxType: tax.taxType,
          taxableAmount: Number(tax.taxableAmount) || 0,
          taxAmount: Number(tax.taxAmount) || 0,
          taxRate: Number(tax.taxRate) || 0,
          supplierId: data.supplierId,
          invoiceNumber: data.invoiceNumber,
          description: `Purchase - ${data.invoiceNumber || newDoc.id}`,
        });
      }
    }
    
    return { id: newDoc.id, ...data };
  },

  async findAll() {
    const purchaseCollection = getPurchaseCollection();
    const snapshot = await purchaseCollection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async findById(id) {
    const purchaseCollection = getPurchaseCollection();
    const snap = await purchaseCollection.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  async update(id, data) {
    const purchaseCollection = getPurchaseCollection();
    const ref = purchaseCollection.doc(id);
    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id, ...data };
  },

  async remove(id) {
    const purchaseCollection = getPurchaseCollection();
    const ref = purchaseCollection.doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      const data = doc.data();
      // Reverse stock update
      if (data.productId && data.quantity) {
        await ProductSettingModel.updateStock(data.productId, -Number(data.quantity));
      }
    }
    await ref.delete();
    return { id };
  },

  async adjustStock(id, adjustment) {
    const purchaseCollection = getPurchaseCollection();
    const ref = purchaseCollection.doc(id);
    const doc = await ref.get();
    
    if (!doc.exists) {
      throw new Error(`Purchase with ID ${id} not found`);
    }
    
    const currentData = doc.data();
    const currentQty = Number(currentData.quantity || 0);
    const newQty = currentQty + adjustment;
    
    if (newQty < 0) {
      throw new Error(`Insufficient stock. Available: ${currentQty}, Requested: ${Math.abs(adjustment)}`);
    }
    
    await ref.update({
      quantity: newQty,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { id, quantity: newQty };
  },
};

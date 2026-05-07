import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";
import { ProductSettingModel } from './productSetting.model.js';
import { TaxTransactionModel } from './taxTransaction.model.js';

const getSalesCollection = () => db().collection("sales");

export const SalesModel = {
  // CREATE SALE (Reduces Inventory - IAS 2 Compliant)
  async create(data) {
    const salesCollection = getSalesCollection();
    const newDoc = salesCollection.doc();
    
    console.log('💾 [SalesModel] Creating sale with data:', JSON.stringify(data, null, 2));
    
    const payload = {
      ...data,
      id: newDoc.id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    
    console.log('💾 [SalesModel] Payload to save:', JSON.stringify(payload, null, 2));
    
    await newDoc.set(payload);
    
    // Record tax transactions (IAS 12 - Income Taxes)
    if (data.taxes && Array.isArray(data.taxes)) {
      for (const tax of data.taxes) {
        await TaxTransactionModel.create({
          transactionType: "Sale",
          transactionId: newDoc.id,
          transactionDate: data.date || new Date().toISOString(),
          taxId: tax.taxId,
          taxName: tax.taxName,
          taxCode: tax.taxCode,
          taxType: tax.taxType,
          taxableAmount: Number(tax.taxableAmount) || 0,
          taxAmount: Number(tax.taxAmount) || 0,
          taxRate: Number(tax.taxRate) || 0,
          customerId: data.customerId,
          invoiceNumber: data.invoiceNumber,
          description: `Sale - ${data.invoiceNumber || newDoc.id}`,
        });
      }
    }
    
    console.log('✅ [SalesModel] Sale saved with ID:', newDoc.id);
    
    // Return the data with the ID (timestamps will be set by Firestore)
    return { 
      id: newDoc.id, 
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
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

  // DELETE SALE (Reverses Inventory Reduction - IAS 2 Compliant)
  async remove(id) {
    const salesCollection = getSalesCollection();
    const ref = salesCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    
    const data = doc.data();
    // ✅ REVERSE INVENTORY REDUCTION (IAS 2 - Inventory Reversal)
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        if (item.productId && item.quantity) {
          console.log(`📈 [INVENTORY] Reversing sale - adding back stock for product ${item.productId} by ${item.quantity}`);
          await ProductSettingModel.updateStock(item.productId, Number(item.quantity));
          console.log(`✅ [INVENTORY] Stock reversed for product ${item.productId}`);
        }
      }
    } else if (data.productId && data.quantity) {
      console.log(`📈 [INVENTORY] Reversing sale - adding back stock for product ${data.productId} by ${data.quantity}`);
      await ProductSettingModel.updateStock(data.productId, Number(data.quantity));
      console.log(`✅ [INVENTORY] Stock reversed for product ${data.productId}`);
    }
    
    await ref.delete();
    return true;
  },
};

import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";
import { TaxTransactionModel } from './taxTransaction.model.js';

const getSupplierInvoiceCollection = () => db().collection("supplierInvoices");

export const SupplierInvoiceModel = {
  async create(data) {
    const supplierInvoiceCollection = getSupplierInvoiceCollection();
    const newDoc = supplierInvoiceCollection.doc();
    await newDoc.set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Record tax transactions
    if (data.taxes && Array.isArray(data.taxes)) {
      for (const tax of data.taxes) {
        await TaxTransactionModel.create({
          transactionType: "Purchase",
          transactionId: newDoc.id,
          transactionDate: data.invoiceDate || new Date().toISOString(),
          taxId: tax.taxId,
          taxName: tax.taxName,
          taxCode: tax.taxCode,
          taxType: tax.taxType,
          taxableAmount: Number(tax.taxableAmount) || 0,
          taxAmount: Number(tax.taxAmount) || 0,
          taxRate: Number(tax.taxRate) || 0,
          supplierId: data.supplierId,
          invoiceNumber: data.invoiceNumber,
          description: `Supplier Invoice - ${data.invoiceNumber}`,
        });
      }
    }
    
    return { id: newDoc.id, ...data };
  },

  async findAll() {
    const supplierInvoiceCollection = getSupplierInvoiceCollection();
    const snapshot = await supplierInvoiceCollection.get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async findById(id) {
    const supplierInvoiceCollection = getSupplierInvoiceCollection();
    const snap = await supplierInvoiceCollection.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  async update(id, data) {
    const supplierInvoiceCollection = getSupplierInvoiceCollection();
    const ref = supplierInvoiceCollection.doc(id);
    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id, ...data };
  },

  async remove(id) {
    const supplierInvoiceCollection = getSupplierInvoiceCollection();
    const ref = supplierInvoiceCollection.doc(id);
    await ref.delete();
    return { id };
  },

  async findBySupplier(supplierId) {
    const supplierInvoiceCollection = getSupplierInvoiceCollection();
    const snapshot = await supplierInvoiceCollection
      .where("supplierId", "==", supplierId)
      .get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};

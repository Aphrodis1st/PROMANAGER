import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";
import { TaxTransactionModel } from './taxTransaction.model.js';

const getCustomerInvoiceCollection = () => db().collection("customerInvoices");

export const CustomerInvoiceModel = {
  async create(data) {
    const customerInvoiceCollection = getCustomerInvoiceCollection();
    const newDoc = customerInvoiceCollection.doc();
    await newDoc.set({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    // Record tax transactions
    if (data.taxes && Array.isArray(data.taxes)) {
      for (const tax of data.taxes) {
        await TaxTransactionModel.create({
          transactionType: "Sale",
          transactionId: newDoc.id,
          transactionDate: data.invoiceDate || new Date().toISOString(),
          taxId: tax.taxId,
          taxName: tax.taxName,
          taxCode: tax.taxCode,
          taxType: tax.taxType,
          taxableAmount: Number(tax.taxableAmount) || 0,
          taxAmount: Number(tax.taxAmount) || 0,
          taxRate: Number(tax.taxRate) || 0,
          customerId: data.customerId,
          invoiceNumber: data.invoiceNumber,
          description: `Customer Invoice - ${data.invoiceNumber}`,
        });
      }
    }
    
    return { id: newDoc.id, ...data };
  },

  async findAll() {
    const customerInvoiceCollection = getCustomerInvoiceCollection();
    const snapshot = await customerInvoiceCollection.get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async findById(id) {
    const customerInvoiceCollection = getCustomerInvoiceCollection();
    const snap = await customerInvoiceCollection.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  async update(id, data) {
    const customerInvoiceCollection = getCustomerInvoiceCollection();
    const ref = customerInvoiceCollection.doc(id);
    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id, ...data };
  },

  async remove(id) {
    const customerInvoiceCollection = getCustomerInvoiceCollection();
    const ref = customerInvoiceCollection.doc(id);
    await ref.delete();
    return { id };
  },

  async findByCustomer(customerId) {
    const customerInvoiceCollection = getCustomerInvoiceCollection();
    const snapshot = await customerInvoiceCollection
      .where("customerId", "==", customerId)
      .get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};

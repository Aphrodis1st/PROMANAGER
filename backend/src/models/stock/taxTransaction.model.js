import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getTaxTransactionCollection = () => db().collection("taxTransactions");

export const TaxTransactionModel = {
  async create(data) {
    const collection = getTaxTransactionCollection();
    const newDoc = collection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const payload = {
      id: newDoc.id,
      transactionType: data.transactionType || "", // Sale, Purchase, Payment, Receipt
      transactionId: data.transactionId || "",
      transactionDate: data.transactionDate || new Date().toISOString(),
      taxId: data.taxId || "",
      taxName: data.taxName || "",
      taxCode: data.taxCode || "",
      taxType: data.taxType || "",
      taxableAmount: Number(data.taxableAmount) || 0,
      taxAmount: Number(data.taxAmount) || 0,
      taxRate: Number(data.taxRate) || 0,
      customerId: data.customerId || null,
      supplierId: data.supplierId || null,
      invoiceNumber: data.invoiceNumber || "",
      description: data.description || "",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(payload);
    return { id: newDoc.id, ...payload };
  },

  async getAll(filters = {}) {
    const collection = getTaxTransactionCollection();
    let query = collection;

    if (filters.transactionType) {
      query = query.where("transactionType", "==", filters.transactionType);
    }
    if (filters.taxType) {
      query = query.where("taxType", "==", filters.taxType);
    }
    if (filters.startDate) {
      query = query.where("transactionDate", ">=", filters.startDate);
    }
    if (filters.endDate) {
      query = query.where("transactionDate", "<=", filters.endDate);
    }

    query = query.orderBy("transactionDate", "asc");

    const snapshot = await query.get();
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return results.reverse();
  },

  async getByTaxType(taxType, startDate, endDate) {
    const collection = getTaxTransactionCollection();
    let query = collection.where("taxType", "==", taxType);

    if (startDate) {
      query = query.where("transactionDate", ">=", startDate);
    }
    if (endDate) {
      query = query.where("transactionDate", "<=", endDate);
    }

    const snapshot = await query.orderBy("transactionDate", "asc").get();
    const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return results.reverse();
  },

  async getTaxSummary(startDate, endDate) {
    const collection = getTaxTransactionCollection();
    let query = collection;

    if (startDate) {
      query = query.where("transactionDate", ">=", startDate);
    }
    if (endDate) {
      query = query.where("transactionDate", "<=", endDate);
    }

    const snapshot = await query.get();
    const transactions = snapshot.docs.map((doc) => doc.data());

    const summary = {};
    transactions.forEach((txn) => {
      const key = txn.taxType || "Other";
      if (!summary[key]) {
        summary[key] = {
          taxType: key,
          totalTaxableAmount: 0,
          totalTaxAmount: 0,
          transactionCount: 0,
        };
      }
      summary[key].totalTaxableAmount += Number(txn.taxableAmount) || 0;
      summary[key].totalTaxAmount += Number(txn.taxAmount) || 0;
      summary[key].transactionCount += 1;
    });

    return Object.values(summary);
  },
};

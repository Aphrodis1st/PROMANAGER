import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getTaxCollection = () => db().collection("taxes");

export const TaxModel = {
  async create(data) {
    const collection = getTaxCollection();
    const newDoc = collection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const payload = {
      id: newDoc.id,
      taxName: data.taxName || "",
      taxCode: data.taxCode || "",
      taxType: data.taxType || "VAT", // VAT, Sales Tax, Excise, WHT, Customs, Zero-Rated, Exempt
      calculationType: data.calculationType || "Percentage", // Percentage or Fixed
      rate: Number(data.rate) || 0,
      fixedAmount: Number(data.fixedAmount) || 0,
      priceType: data.priceType || "Exclusive", // Inclusive or Exclusive
      appliesTo: data.appliesTo || "All", // All, Product, Service, Category
      categoryFilter: data.categoryFilter || [],
      isActive: data.isActive !== false,
      isCompoundTax: Boolean(data.isCompoundTax),
      taxGroupId: data.taxGroupId || null,
      description: data.description || "",
      reportingCategory: data.reportingCategory || "Sales", // Sales, Purchase, Payroll
      // GL Account Codes
      glAccountCode: data.glAccountCode || "",
      glAccountId: data.glAccountId || null,
      glAccountName: data.glAccountName || "",
      // For Sales (Output Tax)
      outputGLCode: data.outputGLCode || "2101", // VAT Output (Liability)
      outputGLAccountId: data.outputGLAccountId || null,
      // For Purchases (Input Tax)
      inputGLCode: data.inputGLCode || "1301", // VAT Input (Asset)
      inputGLAccountId: data.inputGLAccountId || null,
      // Control Account
      controlGLCode: data.controlGLCode || "2102", // VAT Control
      controlGLAccountId: data.controlGLAccountId || null,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(payload);
    return { id: newDoc.id, ...payload };
  },

  async getAll() {
    const collection = getTaxCollection();
    const snapshot = await collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getActive() {
    const collection = getTaxCollection();
    const snapshot = await collection.where("isActive", "==", true).get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getById(id) {
    const collection = getTaxCollection();
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  async update(id, data) {
    const collection = getTaxCollection();
    const ref = collection.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;

    const updatedData = {
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update(updatedData);
    return { id, ...existing.data(), ...updatedData };
  },

  async remove(id) {
    const collection = getTaxCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  },

  calculateTax(amount, taxConfig) {
    if (!taxConfig || !taxConfig.isActive) return 0;
    
    if (taxConfig.calculationType === "Fixed") {
      return Number(taxConfig.fixedAmount) || 0;
    }
    
    const rate = Number(taxConfig.rate) || 0;
    if (taxConfig.priceType === "Inclusive") {
      // For tax-inclusive prices: Tax = Amount - (Amount / (1 + rate/100))
      return amount - (amount / (1 + rate / 100));
    }
    
    // For tax-exclusive prices: Tax = Amount * (rate/100)
    return (amount * rate) / 100;
  },

  // Calculate net amount (excluding tax) from gross amount (including tax)
  calculateNetAmount(grossAmount, taxConfig) {
    if (!taxConfig || !taxConfig.isActive) return grossAmount;
    
    if (taxConfig.priceType === "Inclusive") {
      const rate = Number(taxConfig.rate) || 0;
      return grossAmount / (1 + rate / 100);
    }
    
    return grossAmount;
  },

  // Calculate gross amount (including tax) from net amount (excluding tax)
  calculateGrossAmount(netAmount, taxConfig) {
    if (!taxConfig || !taxConfig.isActive) return netAmount;
    
    if (taxConfig.calculationType === "Fixed") {
      return netAmount + (Number(taxConfig.fixedAmount) || 0);
    }
    
    const rate = Number(taxConfig.rate) || 0;
    return netAmount * (1 + rate / 100);
  },
};

import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

const getSupplierPayments = () => db().collection("supplierPayments");
const getCustomerPayments = () => db().collection("customerPayments");

export const PaymentModel = {
  // ===== SUPPLIER PAYMENTS =====
  async createSupplierPayment(data) {
    const supplierPayments = getSupplierPayments();
    const newDoc = supplierPayments.doc();
    await newDoc.set({
      ...data,
      type: "supplier",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id: newDoc.id, ...data };
  },

  async findAllSupplierPayments() {
    const supplierPayments = getSupplierPayments();
    const snapshot = await supplierPayments.get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async findSupplierPaymentById(id) {
    const supplierPayments = getSupplierPayments();
    const snap = await supplierPayments.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  async updateSupplierPayment(id, data) {
    const supplierPayments = getSupplierPayments();
    const ref = supplierPayments.doc(id);
    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id, ...data };
  },

  async removeSupplierPayment(id) {
    const supplierPayments = getSupplierPayments();
    const result = await supplierPayments.doc(id).delete();
    return { id };
  },

  async findBySupplier(supplierId) {
    const supplierPayments = getSupplierPayments();
    const snapshot = await supplierPayments.where("supplierId", "==", supplierId).get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // ===== CUSTOMER PAYMENTS =====
  async createCustomerPayment(data) {
    const customerPayments = getCustomerPayments();
    const newDoc = customerPayments.doc();
    await newDoc.set({
      ...data,
      type: "customer",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id: newDoc.id, ...data };
  },

  async findAllCustomerPayments() {
    const customerPayments = getCustomerPayments();
    const snapshot = await customerPayments.get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async findCustomerPaymentById(id) {
    const customerPayments = getCustomerPayments();
    const snap = await customerPayments.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  async updateCustomerPayment(id, data) {
    const customerPayments = getCustomerPayments();
    const ref = customerPayments.doc(id);
    await ref.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { id, ...data };
  },

  async removeCustomerPayment(id) {
    const customerPayments = getCustomerPayments();
    const result = await customerPayments.doc(id).delete();
    return { id };
  },

  async findByCustomer(customerId) {
    const customerPayments = getCustomerPayments();
    const snapshot = await customerPayments.where("customerId", "==", customerId).get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },
};

import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";

// Lazy-loaded collections to avoid calling db() before Firebase is initialized
const getCollections = () => ({
  productCollection: db().collection("products"),
  purchaseCollection: db().collection("purchases"),
  salesCollection: db().collection("sales"),
  returnsCollection: db().collection("returns")
});

export const ProductModel = {
  // ========================
  // CREATE PRODUCT
  // ========================
  async create(data) {
    const { productCollection } = getCollections();
    const newDoc = productCollection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const payload = {
      id: newDoc.id,
      name: data.name || "Unnamed Product",
      category: data.category || "General",
      unit: data.unit || "pcs",
      costPrice: Number(data.costPrice || 0),
      sellingPrice: Number(data.sellingPrice || 0),
      openingQty: Number(data.openingQty || 0),
      currentStock: Number(data.openingQty || 0),
      damaged: Number(data.damaged || 0),
      status: data.status || "Active",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(payload);
    return payload;
  },

  // ========================
  // GET ALL PRODUCTS
  // ========================
  async findAll() {
    const { productCollection } = getCollections();
    const snapshot = await productCollection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // ========================
  // GET PRODUCT BY ID
  // ========================
  async findById(id) {
    const { productCollection } = getCollections();
    const snap = await productCollection.doc(id).get();
    if (!snap.exists) return null;
    return { id: snap.id, ...snap.data() };
  },

  // ========================
  // UPDATE PRODUCT
  // ========================
  async update(id, data) {
    const { productCollection } = getCollections();
    const ref = productCollection.doc(id);
    const oldDoc = await ref.get();
    if (!oldDoc.exists) throw new Error("Product not found");

    const updated = {
      ...oldDoc.data(),
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update(updated);
    return { id, ...updated };
  },

  // ========================
  // DELETE PRODUCT
  // ========================
  async remove(id) {
    const { productCollection } = getCollections();
    const ref = productCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new Error("Product not found");
    await ref.delete();
    return true;
  },

  // ========================
  // ADJUST STOCK
  // ========================
  async adjustStock(id, qtyChange) {
    const { productCollection } = getCollections();
    const ref = productCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new Error("Product not found");

    const data = doc.data();
    const newStock = (Number(data.currentStock) || 0) + qtyChange;
    if (newStock < 0) throw new Error("Insufficient stock");

    await ref.update({
      currentStock: newStock,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { id, newStock };
  },

  // ========================
  // HELPER: Convert Firestore Timestamp to JS Date
  // ========================
  parseDate(date) {
    if (!date) return null;
    if (date._seconds) return new Date(date._seconds * 1000);
    return new Date(date);
  },

  // ========================
  // FILTER TRANSACTIONS BY DATE RANGE
  // ========================
  async filterTransactionsByDateRange(collection, start, end) {
    let query = collection;

    if (start) {
      const startTS = admin.firestore.Timestamp.fromDate(new Date(start));
      query = query.where("createdAt", ">=", startTS);
    }
    if (end) {
      const endTS = admin.firestore.Timestamp.fromDate(new Date(end));
      query = query.where("createdAt", "<=", endTS);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  // ========================
  // CALCULATE TOTALS BY PRODUCT
  // ========================
  calculateTotalsByProduct(transactions) {
    const totals = {};
    transactions.forEach((t) => {
      const pid = t.productId || t.id;
      const qty = Number(t.quantity || 0);
      totals[pid] = (totals[pid] || 0) + qty;
    });
    return totals;
  },

  // ========================
  // GET FULL SUMMARY REPORT
  // ========================
  async getSummaryReport(startDate, endDate) {
    const { productCollection, purchaseCollection, salesCollection, returnsCollection } = getCollections();
    const [productsSnap, purchases, sales, returns] = await Promise.all([
      productCollection.get(),
      this.filterTransactionsByDateRange(purchaseCollection, startDate, endDate),
      this.filterTransactionsByDateRange(salesCollection, startDate, endDate),
      this.filterTransactionsByDateRange(returnsCollection, startDate, endDate),
    ]);

    const products = productsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const purchaseTotals = this.calculateTotalsByProduct(purchases);
    const salesTotals = this.calculateTotalsByProduct(sales);
    const returnsTotals = this.calculateTotalsByProduct(returns);

    return products.map((p) => {
      const pid = p.id;
      const opening = Number(p.openingQty || 0);
      const purchased = purchaseTotals[pid] || 0;
      const sold = salesTotals[pid] || 0;
      const returned = returnsTotals[pid] || 0;
      const damaged = Number(p.damaged || 0);
      const closing = opening + purchased - sold - damaged + returned;

      return {
        id: pid,
        productName: p.name,
        category: p.category,
        unit: p.unit,
        opening,
        purchased,
        sold,
        returned,
        damaged,
        closing,
      };
    });
  },
};

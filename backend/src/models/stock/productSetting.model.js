import { db } from "../../../utils/firebase.js";
import admin from "firebase-admin";
import { InventoryLedgerModel } from './inventoryLedger.model.js';

const getCollection = () => db().collection("productSettings");

export const ProductSettingModel = {
  // CREATE PRODUCT SETTING
  async create(data) {
    const collection = getCollection();
    const newDoc = collection.doc();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    const payload = {
      id: newDoc.id,
      type: data.type || "Product",
      mainOrSub: data.mainOrSub || "Main Stock",
      location: data.location || "",
      storeCategory: data.storeCategory || "",
      productCategory: data.productCategory || "",
      name: data.name || "",
      quality: data.quality || "Medium",
      tax: Number(data.tax) || 0,
      taxId: data.taxId || null,
      taxGroupId: data.taxGroupId || null,
      taxExempt: Boolean(data.taxExempt),
      openingStock: Number(data.openingStock) || 0,
      currentStock: Number(data.openingStock) || 0,
      reorderLevel: Number(data.reorderLevel) || 0,
      unit: data.unit || "pcs",
      status: data.status || "Active",
      // Pricing & Defaults
      defaultSellingPrice: Number(data.defaultSellingPrice) || 0,
      defaultBuyingPrice: Number(data.defaultBuyingPrice) || 0,
      defaultDiscount: Number(data.defaultDiscount) || 0,
      defaultDiscountType: data.defaultDiscountType || "Percentage",
      // Tracking settings
      trackBatchNumber: Boolean(data.trackBatchNumber),
      trackSerialNumber: Boolean(data.trackSerialNumber),
      trackExpiryDate: Boolean(data.trackExpiryDate),
      trackWarranty: Boolean(data.trackWarranty),
      defaultWarrantyPeriod: data.defaultWarrantyPeriod || "",
      defaultWarrantyUnit: data.defaultWarrantyUnit || "Months",
      defaultShelfLife: data.defaultShelfLife || "",
      defaultShelfLifeUnit: data.defaultShelfLifeUnit || "Months",
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await newDoc.set(payload);
    
    // Record opening stock in inventory ledger
    if (payload.openingStock > 0) {
      await InventoryLedgerModel.create({
        productId: newDoc.id,
        transactionType: 'OPENING',
        transactionId: newDoc.id,
        transactionDate: new Date().toISOString(),
        quantity: payload.openingStock,
        unitCost: payload.defaultBuyingPrice,
      });
    }
    
    return { id: newDoc.id, ...payload };
  },

  // GET ALL PRODUCT SETTINGS
  async getAll() {
    const collection = getCollection();
    const snapshot = await collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  // GET PRODUCT SETTING BY ID
  async getById(id) {
    const collection = getCollection();
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // UPDATE PRODUCT SETTING
  async update(id, data) {
    const collection = getCollection();
    const ref = collection.doc(id);
    const existing = await ref.get();
    if (!existing.exists) return null;

    const updatedData = {
      ...existing.data(),
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.update(updatedData);
    return { id, ...updatedData };
  },

  // UPDATE STOCK QUANTITY (used by sales/purchases)
  async updateStock(id, quantityChange) {
    const collection = getCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) throw new Error("Product not found");

    const data = doc.data();
    const newStock = (Number(data.currentStock) || 0) + Number(quantityChange);
    if (newStock < 0) throw new Error("Insufficient stock");

    await ref.update({
      currentStock: newStock,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { id, newStock };
  },

  // GET STOCK MOVEMENTS FOR A PRODUCT
  async getStockMovements(productId, startDate, endDate) {
    const collection = getCollection();
    const doc = await collection.doc(productId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
  },

  // DELETE PRODUCT SETTING
  async remove(id) {
    const collection = getCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) return false;
    await ref.delete();
    return true;
  },

  // ADJUST STOCK (for production consumption)
  async adjustStock(id, adjustment) {
    const collection = getCollection();
    const ref = collection.doc(id);
    const doc = await ref.get();
    
    if (!doc.exists) {
      throw new Error(`Product setting with ID ${id} not found`);
    }
    
    const currentData = doc.data();
    const currentQty = Number(currentData.currentStock || 0);
    const newQty = currentQty + adjustment;
    
    if (newQty < 0) {
      throw new Error(`Insufficient stock. Available: ${currentQty}, Requested: ${Math.abs(adjustment)}`);
    }
    
    await ref.update({
      currentStock: newQty,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    return { id, currentStock: newQty };
  },

  // FIND BY ID (alias for getById for consistency)
  async findById(id) {
    return this.getById(id);
  },
};

import { db } from '../../../utils/firebase.js';

export class Stock {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.location = data.location;
    this.contactInfo = data.contactInfo;
    this.subscriptionPlan = data.subscriptionPlan;
    this.featuresEnabled = data.featuresEnabled || [];
    this.status = data.status || 'active';
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(stockData) {
    const { id, ...rest } = stockData;
    const stock = new Stock(rest);
    const { id: _id, ...stockFields } = { ...stock };
    const docRef = await db().collection('stocks').add({
      ...stockFields,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...stockFields };
  }

  static async getAll() {
    const snapshot = await db().collection('stocks').where('isDeleted', '==', false).get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  static async getById(id) {
    const doc = await db().collection('stocks').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } : null;
  }

  static async update(id, updates) {
    await db().collection('stocks').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async softDelete(id) {
    return this.update(id, { isDeleted: true, status: 'deleted' });
  }

  static async hardDelete(id) {
    await db().collection('stocks').doc(id).delete();
    return true;
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }

  static async updateFeatures(id, features) {
    return this.update(id, { featuresEnabled: features });
  }
}

import { db } from '../../../utils/firebase.js';

export class Pharmacy {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.location = data.location;
    this.contactInfo = data.contactInfo;
    this.subscriptionPlan = data.subscriptionPlan;
    this.featuresEnabled = data.featuresEnabled || [];
    this.currencyId = data.currencyId || null;
    this.status = data.status || 'active';
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(pharmacyData) {
    const { id, ...rest } = pharmacyData;
    const pharmacy = new Pharmacy(rest);
    const { id: _id, ...pharmacyFields } = { ...pharmacy };
    const docRef = await db().collection('pharmacies').add({
      ...pharmacyFields,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...pharmacyFields };
  }

  static async getAll() {
    const snapshot = await db().collection('pharmacies').where('isDeleted', '==', false).get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  static async getById(id) {
    const doc = await db().collection('pharmacies').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } : null;
  }

  static async update(id, updates) {
    await db().collection('pharmacies').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async softDelete(id) {
    return this.update(id, { isDeleted: true, status: 'deleted' });
  }

  static async hardDelete(id) {
    await db().collection('pharmacies').doc(id).delete();
    return true;
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }

  static async updateFeatures(id, features) {
    return this.update(id, { featuresEnabled: features });
  }
}

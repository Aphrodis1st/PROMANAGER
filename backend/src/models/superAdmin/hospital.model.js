import { db } from '../../../utils/firebase.js';

export class Hospital {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.location = data.location;
    this.contactInfo = data.contactInfo;
    this.subscriptionPlan = data.subscriptionPlan;
    this.featuresEnabled = data.featuresEnabled || [];
    this.status = data.status || 'active'; // active, suspended
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(hospitalData) {
    const { id, ...rest } = hospitalData;
    const hospital = new Hospital(rest);
    const { id: _id, ...hospitalFields } = { ...hospital };
    const docRef = await db().collection('hospitals').add({
      ...hospitalFields,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...hospitalFields };
  }

  static async getAll() {
    const snapshot = await db().collection('hospitals').where('isDeleted', '==', false).get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  static async getById(id) {
    const doc = await db().collection('hospitals').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } : null;
  }

  static async update(id, updates) {
    await db().collection('hospitals').doc(id).update({
      ...updates,
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async softDelete(id) {
    return this.update(id, { isDeleted: true, status: 'deleted' });
  }

  static async hardDelete(id) {
    await db().collection('hospitals').doc(id).delete();
    return true;
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }

  static async updateFeatures(id, features) {
    return this.update(id, { featuresEnabled: features });
  }
}
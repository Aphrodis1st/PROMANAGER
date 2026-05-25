import { db } from '../../../utils/firebase.js';

export class PropertyOrganization {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name;
    this.location = data.location;
    this.contactInfo = data.contactInfo;
    this.subscriptionPlan = data.subscriptionPlan;
    this.featuresEnabled = data.featuresEnabled || [];
    this.currencyId = data.currencyId || null;
    this.propertyCount = data.propertyCount || 0;
    this.unitCount = data.unitCount || 0;
    this.status = data.status || 'active';
    this.isDeleted = data.isDeleted || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async create(data) {
    const { id, ...rest } = data;
    const org = new PropertyOrganization(rest);
    const { id: _id, ...fields } = { ...org };
    const docRef = await db().collection('propertyOrganizations').add({
      ...fields,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...fields };
  }

  static async getAll() {
    const snapshot = await db().collection('propertyOrganizations').where('isDeleted', '==', false).get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }

  static async getById(id) {
    const doc = await db().collection('propertyOrganizations').doc(id).get();
    return doc.exists ? { ...doc.data(), id: doc.id } : null;
  }

  static async update(id, updates) {
    await db().collection('propertyOrganizations').doc(id).update({
      ...updates,
      updatedAt: new Date(),
    });
    return this.getById(id);
  }

  static async softDelete(id) {
    return this.update(id, { isDeleted: true, status: 'deleted' });
  }

  static async hardDelete(id) {
    await db().collection('propertyOrganizations').doc(id).delete();
    return true;
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }

  static async updateFeatures(id, features) {
    return this.update(id, { featuresEnabled: features });
  }
}

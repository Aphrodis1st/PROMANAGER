import { db } from '../../../utils/firebase.js';

export class HROrganization {
  static async create(data) {
    const docRef = await db().collection('hr_organizations').add({
      ...data,
      currencyId: data.currencyId || null,
      isDeleted: false,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll() {
    const snapshot = await db().collection('hr_organizations').where('isDeleted', '==', false).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_organizations').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('hr_organizations').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('hr_organizations').doc(id).update({ isDeleted: true, status: 'deleted' });
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }
}

import { db } from '../../../utils/firebase.js';

export class Department {
  static async create(data) {
    const docRef = await db().collection('hr_departments').add({
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(organizationId) {
    const snapshot = await db().collection('hr_departments')
      .where('organizationId', '==', organizationId)
      .where('isDeleted', '==', false)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_departments').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('hr_departments').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('hr_departments').doc(id).update({ isDeleted: true });
  }
}

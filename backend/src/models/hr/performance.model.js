import { db } from '../../../utils/firebase.js';

export class Performance {
  static async create(data) {
    const docRef = await db().collection('hr_performance').add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getByEmployee(employeeId) {
    const snapshot = await db().collection('hr_performance')
      .where('employeeId', '==', employeeId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getByOrganization(organizationId) {
    const snapshot = await db().collection('hr_performance')
      .where('organizationId', '==', organizationId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_performance').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('hr_performance').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('hr_performance').doc(id).delete();
  }
}

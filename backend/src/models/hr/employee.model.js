import { db } from '../../../utils/firebase.js';

export class Employee {
  static async create(data) {
    const docRef = await db().collection('hr_employees').add({
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(organizationId) {
    const snapshot = await db().collection('hr_employees')
      .where('organizationId', '==', organizationId)
      .where('isDeleted', '==', false)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_employees').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('hr_employees').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('hr_employees').doc(id).update({ isDeleted: true });
  }

  static async getByDepartment(departmentId) {
    const snapshot = await db().collection('hr_employees')
      .where('departmentId', '==', departmentId)
      .where('isDeleted', '==', false)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

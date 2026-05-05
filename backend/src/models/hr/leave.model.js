import { db } from '../../../utils/firebase.js';

export class Leave {
  static async create(data) {
    const docRef = await db().collection('hr_leaves').add({
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getByEmployee(employeeId) {
    const snapshot = await db().collection('hr_leaves')
      .where('employeeId', '==', employeeId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getPending(organizationId) {
    const snapshot = await db().collection('hr_leaves')
      .where('organizationId', '==', organizationId)
      .where('status', '==', 'pending')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async updateStatus(id, status, approvedBy) {
    await db().collection('hr_leaves').doc(id).update({
      status,
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    });
    const doc = await db().collection('hr_leaves').doc(id).get();
    return { id: doc.id, ...doc.data() };
  }

  static async getById(id) {
    const doc = await db().collection('hr_leaves').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
}

import { db } from '../../../utils/firebase.js';

export class Contract {
  static async create(data) {
    const docRef = await db().collection('hr_contracts').add({
      ...data,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getByEmployee(employeeId) {
    const snapshot = await db().collection('hr_contracts')
      .where('employeeId', '==', employeeId)
      .where('isDeleted', '==', false)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getExpiring(organizationId, days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);
    const snapshot = await db().collection('hr_contracts')
      .where('organizationId', '==', organizationId)
      .where('endDate', '<=', expiryDate)
      .where('isDeleted', '==', false)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hr_contracts').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('hr_contracts').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }
}

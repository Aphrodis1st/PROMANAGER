import { db } from '../../../utils/firebase.js';

export class HRAdmin {
  static async create(data) {
    const docRef = await db().collection('hrAdmins').add({
      ...data,
      status: 'active',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll() {
    const snapshot = await db().collection('hrAdmins').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('hrAdmins').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async getByEmail(email) {
    const snapshot = await db().collection('hrAdmins').where('email', '==', email).limit(1).get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  static async getByOrganization(organizationId) {
    const snapshot = await db().collection('hrAdmins').where('organizationId', '==', organizationId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async update(id, data) {
    await db().collection('hrAdmins').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('hrAdmins').doc(id).delete();
  }

  static async updateStatus(id, status) {
    return this.update(id, { status, isActive: status === 'active' });
  }
}

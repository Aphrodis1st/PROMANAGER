import { db } from '../../../utils/firebase.js';

export class Project {
  static async create(data) {
    const docRef = await db().collection('ngo_projects').add({
      ...data,
      organizationId: data.organizationId,
      status: data.status || 'planning',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(organizationId) {
    let query = db().collection('ngo_projects');
    if (organizationId) query = query.where('organizationId', '==', organizationId);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_projects').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('ngo_projects').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('ngo_projects').doc(id).delete();
  }
}

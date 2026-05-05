import { db } from '../../utils/firebase.js';

export class Currency {
  static async create(data) {
    const docRef = await db().collection('currencies').add({
      ...data,
      isActive: data.isActive !== undefined ? data.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll() {
    const snapshot = await db().collection('currencies').orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getActive() {
    const snapshot = await db().collection('currencies').where('isActive', '==', true).orderBy('name').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('currencies').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('currencies').doc(id).update({ ...data, updatedAt: new Date() });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('currencies').doc(id).delete();
    return true;
  }

  static async setDefault(organizationId, moduleType, currencyId) {
    const settingRef = db().collection('currency_settings').doc(`${organizationId}_${moduleType}`);
    await settingRef.set({
      organizationId,
      moduleType,
      currencyId,
      updatedAt: new Date()
    }, { merge: true });
    return this.getById(currencyId);
  }

  static async getDefaultCurrency(organizationId, moduleType) {
    const doc = await db().collection('currency_settings').doc(`${organizationId}_${moduleType}`).get();
    if (!doc.exists) return null;
    const { currencyId } = doc.data();
    return this.getById(currencyId);
  }
}

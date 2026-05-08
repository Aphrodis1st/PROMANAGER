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
    const snapshot = await db().collection('currencies').get();
    const currencies = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        name: data.name,
        symbol: data.symbol,
        decimalPlaces: data.decimalPlaces,
        isActive: data.isActive
      };
    });
    return currencies.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  static async getActive() {
    const snapshot = await db().collection('currencies').where('isActive', '==', true).get();
    const currencies = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        code: data.code,
        name: data.name,
        symbol: data.symbol,
        decimalPlaces: data.decimalPlaces,
        isActive: data.isActive
      };
    });
    return currencies.sort((a, b) => a.name.localeCompare(b.name));
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
    const currency = await this.getById(currencyId);
    if (!currency) throw new Error('Currency not found');
    
    await settingRef.set({
      organizationId,
      moduleType,
      currencyId,
      currencyCode: currency.code,
      currencySymbol: currency.symbol,
      currencyName: currency.name,
      decimalPlaces: currency.decimalPlaces || 2,
      updatedAt: new Date()
    }, { merge: true });
    return currency;
  }

  static async getDefaultCurrency(organizationId, moduleType) {
    const doc = await db().collection('currency_settings').doc(`${organizationId}_${moduleType}`).get();
    if (!doc.exists) {
      // Return USD as default if no currency is set
      const usdSnapshot = await db().collection('currencies').where('code', '==', 'USD').limit(1).get();
      if (!usdSnapshot.empty) {
        return { id: usdSnapshot.docs[0].id, ...usdSnapshot.docs[0].data() };
      }
      return { code: 'USD', symbol: '$', name: 'US Dollar', decimalPlaces: 2 };
    }
    const { currencyId } = doc.data();
    return this.getById(currencyId);
  }

  static async getOrganizationCurrencySettings(organizationId, moduleType) {
    const doc = await db().collection('currency_settings').doc(`${organizationId}_${moduleType}`).get();
    if (!doc.exists) return null;
    return doc.data();
  }
}

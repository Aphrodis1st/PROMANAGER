import { db } from '../../../utils/firebase.js';

function stripUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

export class Branch {
  static buildDocument(data, { includeTimestamps = true } = {}) {
    const doc = stripUndefined({
      organizationId: data.organizationId,
      name: data.name,
      code: data.code,
      type: data.type || 'regional',
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      postalCode: data.postalCode,
      phone: data.phone,
      email: data.email,
      manager: data.manager,
      managerId: data.managerId,
      coordinates: data.coordinates,
      operatingHours: data.operatingHours,
      established: data.established,
      status: data.status || 'active'
    });

    if (includeTimestamps) {
      doc.createdAt = new Date();
      doc.updatedAt = new Date();
    } else {
      doc.updatedAt = new Date();
    }

    return doc;
  }

  static async create(data) {
    const payload = this.buildDocument(data);
    const docRef = await db().collection('ngo_branches').add(payload);
    return { id: docRef.id, ...payload };
  }

  static async getAll(organizationId, filters = {}) {
    let query = db().collection('ngo_branches');
    if (organizationId) query = query.where('organizationId', '==', organizationId);
    if (filters.status) query = query.where('status', '==', filters.status);
    if (filters.type) query = query.where('type', '==', filters.type);
    if (filters.country) query = query.where('country', '==', filters.country);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_branches').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    const payload = this.buildDocument(data, { includeTimestamps: false });
    await db().collection('ngo_branches').doc(id).update(payload);
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('ngo_branches').doc(id).delete();
  }

  static async getByOrganization(organizationId) {
    const snapshot = await db().collection('ngo_branches')
      .where('organizationId', '==', organizationId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

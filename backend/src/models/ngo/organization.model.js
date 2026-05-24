import { db } from '../../../utils/firebase.js';

/** Firestore rejects undefined field values — omit them before write. */
function stripUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

/** Store established date as YYYY-MM-DD string */
function normalizeEstablished(value) {
  if (value == null || value === '') return undefined;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? trimmed.slice(0, 10) : undefined;
  }

  if (typeof value.toDate === 'function') {
    return value.toDate().toISOString().slice(0, 10);
  }

  if (typeof value._seconds === 'number') {
    return new Date(value._seconds * 1000).toISOString().slice(0, 10);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return undefined;
}

export class Organization {
  static buildDocument(data, { includeTimestamps = true } = {}) {
    const doc = stripUndefined({
      name: data.name,
      registrationNumber: data.registrationNumber,
      type: data.type || 'NGO',
      legalStatus: data.legalStatus,
      taxId: data.taxId,
      established: normalizeEstablished(data.established ?? data.foundedDate),
      mission: data.mission,
      vision: data.vision,
      address: data.address,
      city: data.city,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website,
      logo: data.logo,
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
    const docRef = await db().collection('ngo_organizations').add(payload);
    return this.formatRecord(docRef.id, payload);
  }

  static formatRecord(id, data) {
    const established = normalizeEstablished(data.established ?? data.foundedDate);
    return stripUndefined({
      id,
      ...data,
      established: established ?? data.established,
      foundedDate: established ?? data.foundedDate
    });
  }

  static async getAll(filters = {}) {
    let query = db().collection('ngo_organizations');
    if (filters.status) query = query.where('status', '==', filters.status);
    if (filters.type) query = query.where('type', '==', filters.type);
    if (filters.country) query = query.where('country', '==', filters.country);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => this.formatRecord(doc.id, doc.data()));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_organizations').doc(id).get();
    return doc.exists ? this.formatRecord(doc.id, doc.data()) : null;
  }

  static async update(id, data) {
    const payload = this.buildDocument(data, { includeTimestamps: false });
    await db().collection('ngo_organizations').doc(id).update(payload);
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('ngo_organizations').doc(id).delete();
  }

  static async getStats(organizationId) {
    const org = await this.getById(organizationId);
    if (!org) return null;

    const branchesSnapshot = await db().collection('ngo_branches')
      .where('organizationId', '==', organizationId).get();
    const departmentsSnapshot = await db().collection('ngo_departments')
      .where('organizationId', '==', organizationId).get();
    const projectsSnapshot = await db().collection('ngo_projects')
      .where('organizationId', '==', organizationId).get();

    return {
      ...org,
      stats: {
        totalBranches: branchesSnapshot.size,
        totalDepartments: departmentsSnapshot.size,
        totalProjects: projectsSnapshot.size
      }
    };
  }
}

import { db } from '../../../utils/firebase.js';

export class Organization {
  static async create(data) {
    const docRef = await db().collection('ngo_organizations').add({
      ...data,
      name: data.name,
      registrationNumber: data.registrationNumber,
      type: data.type || 'NGO',
      legalStatus: data.legalStatus,
      taxId: data.taxId,
      foundedDate: data.foundedDate,
      mission: data.mission,
      vision: data.vision,
      address: data.address,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website,
      logo: data.logo,
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(filters = {}) {
    let query = db().collection('ngo_organizations');
    if (filters.status) query = query.where('status', '==', filters.status);
    if (filters.type) query = query.where('type', '==', filters.type);
    if (filters.country) query = query.where('country', '==', filters.country);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_organizations').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('ngo_organizations').doc(id).update({ 
      ...data, 
      updatedAt: new Date() 
    });
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

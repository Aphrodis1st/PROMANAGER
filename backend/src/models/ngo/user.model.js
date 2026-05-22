import { db } from '../../../utils/firebase.js';

const COLLECTION = 'ngo_users';

export class NGOUser {
  static sanitize(data = {}) {
    return {
      organizationId: data.organizationId,
      staffId: data.staffId || '',
      fullName: data.fullName || data.name || '',
      email: (data.email || '').trim().toLowerCase(),
      phone: data.phone || '',
      jobTitle: data.jobTitle || '',
      departmentId: data.departmentId || '',
      branchId: data.branchId || '',
      roleId: data.roleId || '',
      roleName: data.roleName || '',
      permissions: Array.isArray(data.permissions) ? data.permissions : [],
      accessScope: data.accessScope || 'Organization',
      accountStatus: data.accountStatus || data.status || 'Invited',
      mfaRequired: Boolean(data.mfaRequired),
      lastLoginAt: data.lastLoginAt || null,
      invitedBy: data.invitedBy || '',
      approvedBy: data.approvedBy || '',
      notes: data.notes || ''
    };
  }

  static async create(data) {
    const user = this.sanitize(data);
    const docRef = await db().collection(COLLECTION).add({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...user };
  }

  static async getAll(organizationId, filters = {}) {
    let query = db().collection(COLLECTION);
    if (organizationId) query = query.where('organizationId', '==', organizationId);
    if (filters.roleId) query = query.where('roleId', '==', filters.roleId);
    if (filters.departmentId) query = query.where('departmentId', '==', filters.departmentId);
    if (filters.branchId) query = query.where('branchId', '==', filters.branchId);
    if (filters.accountStatus) query = query.where('accountStatus', '==', filters.accountStatus);

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection(COLLECTION).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection(COLLECTION).doc(id).update({
      ...this.sanitize(data),
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection(COLLECTION).doc(id).delete();
  }

  static async activate(id, approvedBy = '') {
    await db().collection(COLLECTION).doc(id).update({
      accountStatus: 'Active',
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async suspend(id, suspendedBy = '', reason = '') {
    await db().collection(COLLECTION).doc(id).update({
      accountStatus: 'Suspended',
      suspendedBy,
      suspensionReason: reason,
      suspendedAt: new Date(),
      updatedAt: new Date()
    });
    return this.getById(id);
  }

  static async updatePermissions(id, permissions = []) {
    await db().collection(COLLECTION).doc(id).update({
      permissions,
      updatedAt: new Date()
    });
    return this.getById(id);
  }
}

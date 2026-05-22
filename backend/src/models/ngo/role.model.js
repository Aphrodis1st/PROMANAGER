import { db } from '../../../utils/firebase.js';

export class Role {
  static async create(data) {
    const docRef = await db().collection('ngo_roles').add({
      ...data,
      organizationId: data.organizationId,
      name: data.name,
      code: data.code,
      description: data.description,
      level: data.level || 1,
      permissions: data.permissions || [],
      responsibilities: data.responsibilities || [],
      reportingTo: data.reportingTo,
      departmentId: data.departmentId,
      isSystemRole: data.isSystemRole || false,
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(organizationId, filters = {}) {
    let query = db().collection('ngo_roles');
    if (organizationId) query = query.where('organizationId', '==', organizationId);
    if (filters.departmentId) query = query.where('departmentId', '==', filters.departmentId);
    if (filters.status) query = query.where('status', '==', filters.status);
    if (filters.isSystemRole !== undefined) query = query.where('isSystemRole', '==', filters.isSystemRole);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_roles').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('ngo_roles').doc(id).update({ 
      ...data, 
      updatedAt: new Date() 
    });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('ngo_roles').doc(id).delete();
  }

  static async assignPermissions(roleId, permissions) {
    await db().collection('ngo_roles').doc(roleId).update({
      permissions,
      updatedAt: new Date()
    });
    return this.getById(roleId);
  }

  static async getByDepartment(departmentId) {
    const snapshot = await db().collection('ngo_roles')
      .where('departmentId', '==', departmentId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getRoleHierarchy(organizationId) {
    const roles = await this.getAll(organizationId);
    return roles.sort((a, b) => (b.level || 0) - (a.level || 0));
  }
}

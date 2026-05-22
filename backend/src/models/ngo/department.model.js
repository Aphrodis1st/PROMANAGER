import { db } from '../../../utils/firebase.js';

export class Department {
  static async create(data) {
    const docRef = await db().collection('ngo_departments').add({
      ...data,
      organizationId: data.organizationId,
      branchId: data.branchId,
      name: data.name,
      code: data.code,
      description: data.description,
      headId: data.headId,
      parentDepartmentId: data.parentDepartmentId,
      budget: data.budget || 0,
      employeeCount: data.employeeCount || 0,
      functions: data.functions || [],
      status: data.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(organizationId, filters = {}) {
    let query = db().collection('ngo_departments');
    if (organizationId) query = query.where('organizationId', '==', organizationId);
    if (filters.branchId) query = query.where('branchId', '==', filters.branchId);
    if (filters.status) query = query.where('status', '==', filters.status);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_departments').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async update(id, data) {
    await db().collection('ngo_departments').doc(id).update({ 
      ...data, 
      updatedAt: new Date() 
    });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('ngo_departments').doc(id).delete();
  }

  static async getByBranch(branchId) {
    const snapshot = await db().collection('ngo_departments')
      .where('branchId', '==', branchId)
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getHierarchy(organizationId) {
    const departments = await this.getAll(organizationId);
    const buildTree = (parentId = null) => {
      return departments
        .filter(dept => dept.parentDepartmentId === parentId)
        .map(dept => ({
          ...dept,
          children: buildTree(dept.id)
        }));
    };
    return buildTree();
  }
}

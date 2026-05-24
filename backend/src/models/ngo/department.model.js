import { db } from '../../../utils/firebase.js';

function stripUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  );
}

export class Department {
  static buildDocument(data, { includeTimestamps = true } = {}) {
    const functions = Array.isArray(data.functions)
      ? data.functions
      : typeof data.functions === 'string' && data.functions.trim()
        ? data.functions.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

    const doc = stripUndefined({
      organizationId: data.organizationId,
      branchId: data.branchId,
      name: data.name,
      code: data.code,
      description: data.description,
      headId: data.headId,
      parentDepartmentId: data.parentDepartmentId || null,
      budget: Number(data.budget) || 0,
      employeeCount: Number(data.employeeCount) || 0,
      functions,
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
    const docRef = await db().collection('ngo_departments').add(payload);
    return { id: docRef.id, ...payload };
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
    const payload = this.buildDocument(data, { includeTimestamps: false });
    await db().collection('ngo_departments').doc(id).update(payload);
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
        .filter(dept => (dept.parentDepartmentId || null) === parentId)
        .map(dept => ({
          ...dept,
          children: buildTree(dept.id)
        }));
    };
    return buildTree();
  }
}

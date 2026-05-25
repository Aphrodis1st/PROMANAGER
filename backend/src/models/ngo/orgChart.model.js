import { db } from '../../../utils/firebase.js';

export class OrgChart {
  static async create(data) {
    const docRef = await db().collection('ngo_org_charts').add({
      ...data,
      organizationId: data.organizationId,
      name: data.name,
      version: data.version || '1.0',
      effectiveDate: data.effectiveDate,
      structure: data.structure || {},
      positions: data.positions || [],
      relationships: data.relationships || [],
      isActive: data.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: docRef.id, ...data };
  }

  static async getAll(organizationId) {
    let query = db().collection('ngo_org_charts');
    if (organizationId) query = query.where('organizationId', '==', organizationId);
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async getById(id) {
    const doc = await db().collection('ngo_org_charts').doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async getActive(organizationId) {
    const snapshot = await db().collection('ngo_org_charts')
      .where('organizationId', '==', organizationId)
      .where('isActive', '==', true)
      .limit(1)
      .get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }

  static async update(id, data) {
    await db().collection('ngo_org_charts').doc(id).update({ 
      ...data, 
      updatedAt: new Date() 
    });
    return this.getById(id);
  }

  static async delete(id) {
    await db().collection('ngo_org_charts').doc(id).delete();
  }

  static async generateFromStructure(organizationId) {
    const departments = await db().collection('ngo_departments')
      .where('organizationId', '==', organizationId)
      .get();
    
    const positions = departments.docs.map(doc => {
      const dept = doc.data();
      return {
        id: doc.id,
        name: dept.name,
        title: dept.name,
        departmentId: doc.id,
        headId: dept.headId,
        parentId: dept.parentDepartmentId,
        level: 0
      };
    });

    const relationships = positions
      .filter(pos => pos.parentId)
      .map(pos => ({
        from: pos.parentId,
        to: pos.id,
        type: 'reports_to'
      }));

    return {
      positions,
      relationships,
      structure: { type: 'hierarchical', layout: 'top-down' }
    };
  }
}

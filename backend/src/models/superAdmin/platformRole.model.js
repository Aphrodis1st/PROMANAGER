import crypto from 'crypto';
import { db } from '../../../utils/firebase.js';

const COLLECTION = 'platform_roles';
export const SUPER_ADMIN_ROLE_NAME = 'SUPER_ADMIN';

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

function normalizeSubRole(subRole, parentRoleId) {
  return stripUndefined({
    id: subRole.id || crypto.randomUUID(),
    name: (subRole.name || '').trim(),
    parent_role_id: subRole.parent_role_id || parentRoleId,
  });
}

export class PlatformRole {
  static sanitize(data = {}) {
    return stripUndefined({
      role_name: (data.role_name || '').trim().toUpperCase().replace(/\s+/g, '_'),
      sub_roles: Array.isArray(data.sub_roles)
        ? data.sub_roles.map((sr) => normalizeSubRole(sr, data.id))
        : [],
      created_by: data.created_by
        ? {
            role_id: data.created_by.role_id,
            role_name: data.created_by.role_name,
          }
        : undefined,
      is_system: data.is_system === true,
      status: data.status || 'active',
    });
  }

  static async create(data) {
    const role = this.sanitize({
      ...data,
      sub_roles: data.sub_roles || [],
      status: data.status || 'active',
      is_system: data.is_system || false,
    });

    if (!role.role_name) {
      throw Object.assign(new Error('Role name is required.'), { status: 400 });
    }

    const existing = await this.getByName(role.role_name);
    if (existing) {
      throw Object.assign(new Error('A role with this name already exists.'), { status: 409 });
    }

    const docRef = await db().collection(COLLECTION).add({
      ...role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { id: docRef.id, ...role };
  }

  static async getAll() {
    const snapshot = await db().collection(COLLECTION).get();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => (a.role_name || '').localeCompare(b.role_name || ''));
  }

  static async getById(id) {
    const doc = await db().collection(COLLECTION).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }

  static async getByName(roleName) {
    const normalized = (roleName || '').trim().toUpperCase().replace(/\s+/g, '_');
    const snapshot = await db()
      .collection(COLLECTION)
      .where('role_name', '==', normalized)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    const role = await this.getById(id);
    if (!role) throw Object.assign(new Error('Role not found.'), { status: 404 });
    if (role.is_system && data.role_name && data.role_name !== role.role_name) {
      throw Object.assign(new Error('System roles cannot be renamed.'), { status: 403 });
    }

    const updates = stripUndefined({
      role_name: data.role_name
        ? data.role_name.trim().toUpperCase().replace(/\s+/g, '_')
        : undefined,
      status: data.status,
      updatedAt: new Date(),
    });

    await db().collection(COLLECTION).doc(id).update(updates);
    return this.getById(id);
  }

  static async delete(id) {
    const role = await this.getById(id);
    if (!role) throw Object.assign(new Error('Role not found.'), { status: 404 });
    if (role.is_system) {
      throw Object.assign(new Error('System roles cannot be deleted.'), { status: 403 });
    }
    await db().collection(COLLECTION).doc(id).delete();
  }

  static async addSubRole(roleId, { name }) {
    const role = await this.getById(roleId);
    if (!role) throw Object.assign(new Error('Role not found.'), { status: 404 });

    const trimmed = (name || '').trim();
    if (!trimmed) throw Object.assign(new Error('Sub-role name is required.'), { status: 400 });

    const subRole = normalizeSubRole({ name: trimmed }, roleId);
    const subRoles = [...(role.sub_roles || []), subRole];

    await db().collection(COLLECTION).doc(roleId).update({
      sub_roles: subRoles,
      updatedAt: new Date(),
    });

    return this.getById(roleId);
  }

  static async removeSubRole(roleId, subRoleId) {
    const role = await this.getById(roleId);
    if (!role) throw Object.assign(new Error('Role not found.'), { status: 404 });

    const subRoles = (role.sub_roles || []).filter((sr) => sr.id !== subRoleId);
    await db().collection(COLLECTION).doc(roleId).update({
      sub_roles: subRoles,
      updatedAt: new Date(),
    });

    return this.getById(roleId);
  }

  static async ensureSuperAdminRole() {
    let role = await this.getByName(SUPER_ADMIN_ROLE_NAME);
    if (role) return role;

    role = await this.create({
      role_name: SUPER_ADMIN_ROLE_NAME,
      sub_roles: [],
      is_system: true,
      created_by: { role_id: 'system', role_name: SUPER_ADMIN_ROLE_NAME },
    });

    return role;
  }
}

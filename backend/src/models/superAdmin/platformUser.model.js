import { db } from '../../../utils/firebase.js';
import bcrypt from 'bcryptjs';

const COLLECTION = 'platform_users';

function stripUndefined(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

function normalizeRoleAssignment(role, subRoles = []) {
  if (!role?.role_id || !role?.role_name) return null;
  return {
    role_id: role.role_id,
    role_name: role.role_name,
    sub_roles: Array.isArray(subRoles)
      ? subRoles.map((sr) => ({
          id: sr.id,
          name: sr.name,
          parent_role_id: sr.parent_role_id || role.role_id,
        }))
      : [],
  };
}

export class PlatformUser {
  static sanitize(data = {}) {
    return stripUndefined({
      name: (data.name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      role: data.role ? normalizeRoleAssignment(data.role, data.role.sub_roles) : undefined,
      status: data.status || 'active',
    });
  }

  static async create({ name, email, password, phone, role }) {
    const userData = this.sanitize({ name, email, phone, role });
    if (!userData.email || !userData.name || !userData.role) {
      throw Object.assign(new Error('Name, email, and role are required.'), { status: 400 });
    }
    if (!password) {
      throw Object.assign(new Error('Password is required.'), { status: 400 });
    }

    const existing = await this.getByEmail(userData.email);
    if (existing) {
      throw Object.assign(new Error('A user with this email already exists.'), { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const docRef = await db().collection(COLLECTION).add({
      ...userData,
      passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const created = await this.getById(docRef.id);
    delete created.passwordHash;
    return created;
  }

  static async getAll() {
    const snapshot = await db().collection(COLLECTION).get();
    return snapshot.docs
      .map((doc) => {
        const data = doc.data();
        delete data.passwordHash;
        return { id: doc.id, ...data };
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  static async getById(id) {
    const doc = await db().collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data();
    return { id: doc.id, ...data };
  }

  static async getByEmail(email) {
    const normalized = (email || '').trim().toLowerCase();
    const snapshot = await db()
      .collection(COLLECTION)
      .where('email', '==', normalized)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, updates) {
    const cleaned = stripUndefined({ ...updates, updatedAt: new Date() });
    delete cleaned.passwordHash;
    delete cleaned.email;

    if (cleaned.role) {
      cleaned.role = normalizeRoleAssignment(cleaned.role, cleaned.role.sub_roles);
    }

    await db().collection(COLLECTION).doc(id).update(cleaned);
    const user = await this.getById(id);
    delete user.passwordHash;
    return user;
  }

  static async delete(id) {
    await db().collection(COLLECTION).doc(id).delete();
  }

  static async comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
  }

  static toPublicUser(user) {
    if (!user) return null;
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

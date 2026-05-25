import { db } from '../../utils/firebase.js';
import bcrypt from 'bcryptjs';
import { PlatformRole, SUPER_ADMIN_ROLE_NAME } from '../models/superAdmin/platformRole.model.js';

const SUPER_ADMIN_EMAIL = 'superadmin@madsmart.com';
const SUPER_ADMIN_PASSWORD = 'SuperAdmin123!';

export async function seedSuperAdminRoleAndUser() {
  const superAdminRole = await PlatformRole.ensureSuperAdminRole();

  const roleAssignment = {
    role_id: superAdminRole.id,
    role_name: SUPER_ADMIN_ROLE_NAME,
    sub_roles: [],
  };

  const legacySnapshot = await db()
    .collection('users')
    .where('email', '==', SUPER_ADMIN_EMAIL)
    .limit(1)
    .get();

  if (!legacySnapshot.empty) {
    const doc = legacySnapshot.docs[0];
    const passwordHash =
      doc.data().passwordHash || (await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10));

    await doc.ref.update({
      name: doc.data().name || 'Super Administrator',
      role: roleAssignment,
      legacyRole: doc.data().role || 'super_admin',
      passwordHash,
      status: 'active',
      updatedAt: new Date(),
    });

    return { role: superAdminRole, userId: doc.id, collection: 'users' };
  }

  const passwordHash = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
  const docRef = await db().collection('users').add({
    name: 'Super Administrator',
    email: SUPER_ADMIN_EMAIL,
    passwordHash,
    role: roleAssignment,
    legacyRole: 'super_admin',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { role: superAdminRole, userId: docRef.id, collection: 'users' };
}

export function resolveUserRoleName(user) {
  if (user?.role?.role_name) return user.role.role_name;
  if (typeof user?.role === 'string') return user.role.toUpperCase();
  return null;
}

export function isSuperAdminUser(user) {
  const roleName = resolveUserRoleName(user);
  return roleName === SUPER_ADMIN_ROLE_NAME || user?.role === 'super_admin' || user?.legacyRole === 'super_admin';
}

export function userCreatedBySuperAdmin(user) {
  return user?.role?.created_by?.role_name === SUPER_ADMIN_ROLE_NAME;
}

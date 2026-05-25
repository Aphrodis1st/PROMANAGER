import { PlatformUser } from '../../models/superAdmin/platformUser.model.js';
import { PlatformRole } from '../../models/superAdmin/platformRole.model.js';
import { ServiceRegistration } from '../../models/superAdmin/serviceRegistration.model.js';
import { isSuperAdminUser } from '../../services/platformRoleSeed.service.js';
import { normalizeUserStatus } from '../../services/userStatusSync.service.js';

async function resolveRoleAssignment(roleId, subRoleIds = []) {
  const role = await PlatformRole.getById(roleId);
  if (!role) throw Object.assign(new Error('Selected role not found.'), { status: 400 });

  const selectedSubRoles = (role.sub_roles || []).filter((sr) => subRoleIds.includes(sr.id));

  return {
    role_id: role.id,
    role_name: role.role_name,
    sub_roles: selectedSubRoles,
  };
}

export const listUsers = async (_req, res) => {
  try {
    const [platformUsers, serviceRegistrations] = await Promise.all([
      PlatformUser.getAll(),
      ServiceRegistration.getAll(),
    ]);

    const data = [
      ...platformUsers.map((user) => ({ ...user, source: 'platform' })),
      ...serviceRegistrations.map((record) => ServiceRegistration.toListItem(record)),
    ].sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await PlatformUser.getById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.json({ success: true, data: PlatformUser.toPublicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    if (!isSuperAdminUser(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can create users.' });
    }

    const { name, email, password, phone, roleId, subRoleIds } = req.body;
    const role = await resolveRoleAssignment(roleId, subRoleIds || []);

    const user = await PlatformUser.create({ name, email, password, phone, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    if (!isSuperAdminUser(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can update users.' });
    }

    const updates = { ...req.body };
    if (updates.roleId) {
      updates.role = await resolveRoleAssignment(updates.roleId, updates.subRoleIds || []);
      delete updates.roleId;
      delete updates.subRoleIds;
    }
    if (updates.status) {
      updates.status = normalizeUserStatus(updates.status);
    }

    const user = await PlatformUser.update(req.params.id, updates);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (!isSuperAdminUser(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can delete users.' });
    }

    await PlatformUser.delete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

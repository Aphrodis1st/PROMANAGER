import { ServiceRegistration } from '../../models/superAdmin/serviceRegistration.model.js';
import { PlatformRole } from '../../models/superAdmin/platformRole.model.js';
import { isSuperAdminUser } from '../../services/platformRoleSeed.service.js';
import { normalizeUserStatus } from '../../services/userStatusSync.service.js';
import {
  tryProvisionServiceUser,
  assertCanAssignRole,
  assertServiceRoleValid,
} from '../../services/serviceUserActivation.service.js';

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

export const listRegistrations = async (_req, res) => {
  try {
    const records = await ServiceRegistration.getAll();
    const data = records.map((record) => ServiceRegistration.toListItem(record));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRegistration = async (req, res) => {
  try {
    const record = await ServiceRegistration.getById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }
    res.json({ success: true, data: ServiceRegistration.toListItem(record) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateRegistration = async (req, res) => {
  try {
    if (!isSuperAdminUser(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can update registrations.' });
    }

    const existing = await ServiceRegistration.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    const updates = { ...req.body };
    const nextStatus = updates.status
      ? normalizeUserStatus(updates.status)
      : existing.status || 'inactive';

    if (updates.status) {
      updates.status = nextStatus;
    }

    if (updates.roleId) {
      assertCanAssignRole(existing, nextStatus);
      updates.role = await resolveRoleAssignment(updates.roleId, updates.subRoleIds || []);
      assertServiceRoleValid(updates.role.role_name, existing.serviceId);
      delete updates.roleId;
      delete updates.subRoleIds;
    }

    const record = await ServiceRegistration.update(req.params.id, updates);
    const provision = await tryProvisionServiceUser(record, { previous: existing });

    res.json({
      success: true,
      data: {
        ...ServiceRegistration.toListItem(record),
        provision,
      },
    });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    if (!isSuperAdminUser(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can delete registrations.' });
    }

    await ServiceRegistration.delete(req.params.id);
    res.json({ success: true, message: 'Registration deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

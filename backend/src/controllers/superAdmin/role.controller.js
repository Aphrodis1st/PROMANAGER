import { PlatformRole } from '../../models/superAdmin/platformRole.model.js';
import { isSuperAdminUser } from '../../services/platformRoleSeed.service.js';

function getActorRole(req) {
  return req.user?.role?.role_name
    ? req.user.role
    : isSuperAdminUser(req.user)
      ? { role_id: req.user.role?.role_id, role_name: 'SUPER_ADMIN' }
      : req.user?.role;
}

function canCreateRole(actor) {
  return isSuperAdminUser(actor);
}

function canAddSubRole(actor, targetRole) {
  if (isSuperAdminUser(actor)) return true;
  const actorRole = getActorRole({ user: actor });
  if (!actorRole?.role_id) return false;
  return (
    actorRole.role_id === targetRole.id &&
    targetRole.created_by?.role_name === 'SUPER_ADMIN'
  );
}

export const listRoles = async (_req, res) => {
  try {
    const roles = await PlatformRole.getAll();
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await PlatformRole.getById(req.params.id);
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    if (!canCreateRole(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can create roles.' });
    }

    const actorRole = getActorRole(req);
    const role = await PlatformRole.create({
      role_name: req.body.role_name,
      sub_roles: req.body.sub_roles || [],
      created_by: {
        role_id: actorRole.role_id,
        role_name: actorRole.role_name || 'SUPER_ADMIN',
      },
    });

    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    if (!canCreateRole(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can update roles.' });
    }

    const role = await PlatformRole.update(req.params.id, req.body);
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    if (!canCreateRole(req.user)) {
      return res.status(403).json({ success: false, error: 'Only super admin can delete roles.' });
    }

    await PlatformRole.delete(req.params.id);
    res.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const addSubRole = async (req, res) => {
  try {
    const targetRole = await PlatformRole.getById(req.params.id);
    if (!targetRole) return res.status(404).json({ success: false, error: 'Role not found' });

    if (!canAddSubRole(req.user, targetRole)) {
      return res.status(403).json({
        success: false,
        error: 'You cannot add sub-roles to this role.',
      });
    }

    const role = await PlatformRole.addSubRole(req.params.id, { name: req.body.name });
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const removeSubRole = async (req, res) => {
  try {
    const targetRole = await PlatformRole.getById(req.params.id);
    if (!targetRole) return res.status(404).json({ success: false, error: 'Role not found' });

    if (!canAddSubRole(req.user, targetRole)) {
      return res.status(403).json({
        success: false,
        error: 'You cannot remove sub-roles from this role.',
      });
    }

    const role = await PlatformRole.removeSubRole(req.params.id, req.params.subRoleId);
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, error: error.message });
  }
};

export const getRolePermissions = async (req, res) => {
  res.json({
    success: true,
    data: {
      canCreateRoles: canCreateRole(req.user),
      canAddSubRoles: isSuperAdminUser(req.user),
      isSuperAdmin: isSuperAdminUser(req.user),
    },
  });
};

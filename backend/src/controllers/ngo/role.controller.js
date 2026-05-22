import { Role } from '../../models/ngo/role.model.js';

export const createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const { organizationId, departmentId, status, isSystemRole } = req.query;
    const filters = { 
      departmentId, 
      status, 
      isSystemRole: isSystemRole === 'true' ? true : isSystemRole === 'false' ? false : undefined 
    };
    const roles = await Role.getAll(organizationId, filters);
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRole = async (req, res) => {
  try {
    const role = await Role.getById(req.params.id);
    if (!role) return res.status(404).json({ success: false, error: 'Role not found' });
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const role = await Role.update(req.params.id, req.body);
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await Role.delete(req.params.id);
    res.json({ success: true, message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const assignPermissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    const role = await Role.assignPermissions(req.params.id, permissions);
    res.json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRolesByDepartment = async (req, res) => {
  try {
    const roles = await Role.getByDepartment(req.params.departmentId);
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getRoleHierarchy = async (req, res) => {
  try {
    const hierarchy = await Role.getRoleHierarchy(req.params.organizationId);
    res.json({ success: true, data: hierarchy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

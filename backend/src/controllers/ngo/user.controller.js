import { NGOUser } from '../../models/ngo/user.model.js';

const requireEmail = (body) => {
  if (!body?.email) {
    const error = new Error('User email is required');
    error.statusCode = 400;
    throw error;
  }
};

export const createUser = async (req, res) => {
  try {
    requireEmail(req.body);
    const user = await NGOUser.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { organizationId, roleId, departmentId, branchId, accountStatus } = req.query;
    const users = await NGOUser.getAll(organizationId, { roleId, departmentId, branchId, accountStatus });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await NGOUser.getById(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'NGO user not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    requireEmail(req.body);
    const user = await NGOUser.update(req.params.id, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await NGOUser.delete(req.params.id);
    res.json({ success: true, message: 'NGO user removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const user = await NGOUser.activate(req.params.id, req.body?.approvedBy || '');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const user = await NGOUser.suspend(req.params.id, req.body?.suspendedBy || '', req.body?.reason || '');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserPermissions = async (req, res) => {
  try {
    const user = await NGOUser.updatePermissions(req.params.id, req.body?.permissions || []);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

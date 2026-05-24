import { NGOUser } from '../../models/ngo/user.model.js';
import { denyForeignNgoResource } from '../../middleware/ngoAuth.middleware.js';
import { provisionNgoStaffCredentials } from '../../services/ngoStaffProvisioning.service.js';

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
    const user = await NGOUser.create({ ...req.body, organizationId: req.organizationId });
    const { user: provisionedUser, emailSent, emailError } = await provisionNgoStaffCredentials(user.id);
    res.status(201).json({
      success: true,
      data: { ...provisionedUser, emailSent, emailError: emailError || null },
      emailSent,
      emailError: emailError || null,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.query.organizationId;
    const { roleId, departmentId, branchId, accountStatus } = req.query;
    const users = await NGOUser.getAll(organizationId, { roleId, departmentId, branchId, accountStatus });
    res.json({ success: true, data: users.map(NGOUser.toSafe) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await NGOUser.getById(req.params.id);
    if (denyForeignNgoResource(req, res, user)) return;
    res.json({ success: true, data: NGOUser.toSafe(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    requireEmail(req.body);
    const existing = await NGOUser.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    const user = await NGOUser.update(req.params.id, { ...req.body, organizationId: req.organizationId });
    res.json({ success: true, data: NGOUser.toSafe(user) });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const existing = await NGOUser.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    await NGOUser.delete(req.params.id);
    res.json({ success: true, message: 'NGO user removed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const existing = await NGOUser.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    await NGOUser.activate(req.params.id, req.body?.approvedBy || '');

    if (!existing.passwordHash) {
      const { user, emailSent, emailError } = await provisionNgoStaffCredentials(req.params.id, {
        activate: false,
      });
      return res.json({
        success: true,
        data: { ...user, emailSent, emailError: emailError || null },
        emailSent,
        emailError: emailError || null,
      });
    }

    const user = await NGOUser.getById(req.params.id);
    res.json({ success: true, data: NGOUser.toSafe(user) });
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, error: error.message });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const existing = await NGOUser.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    const user = await NGOUser.suspend(req.params.id, req.body?.suspendedBy || '', req.body?.reason || '');
    res.json({ success: true, data: NGOUser.toSafe(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserPermissions = async (req, res) => {
  try {
    const existing = await NGOUser.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    const user = await NGOUser.updatePermissions(req.params.id, req.body?.permissions || []);
    res.json({ success: true, data: NGOUser.toSafe(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

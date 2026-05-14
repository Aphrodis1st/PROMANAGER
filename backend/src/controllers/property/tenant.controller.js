import * as TenantModel from '../../models/property/tenant.model.js';

export const create = async (req, res) => {
  try {
    const tenant = await TenantModel.createTenant(req.body);
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const tenants = await TenantModel.getTenants(req.query);
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const tenant = await TenantModel.getTenantById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Not found' });
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await TenantModel.updateTenant(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await TenantModel.deleteTenant(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

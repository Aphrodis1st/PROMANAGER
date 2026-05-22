import { Organization } from '../../models/ngo/organization.model.js';

export const createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      type: req.query.type,
      country: req.query.country
    };
    const organizations = await Organization.getAll(filters);
    res.json({ success: true, data: organizations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.getById(req.params.id);
    if (!organization) return res.status(404).json({ success: false, error: 'Organization not found' });
    res.json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.update(req.params.id, req.body);
    res.json({ success: true, data: organization });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteOrganization = async (req, res) => {
  try {
    await Organization.delete(req.params.id);
    res.json({ success: true, message: 'Organization deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrganizationStats = async (req, res) => {
  try {
    const stats = await Organization.getStats(req.params.id);
    if (!stats) return res.status(404).json({ success: false, error: 'Organization not found' });
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

import { Organization } from '../../models/hr/organization.model.js';

export const createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.getAll();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrganization = async (req, res) => {
  try {
    const organization = await Organization.getById(req.params.id);
    if (!organization) return res.status(404).json({ error: 'Organization not found' });
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.update(req.params.id, req.body);
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

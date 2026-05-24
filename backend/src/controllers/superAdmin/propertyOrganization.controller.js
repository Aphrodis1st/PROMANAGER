import { PropertyOrganization } from '../../models/superAdmin/propertyOrganization.model.js';

export const createPropertyOrganization = async (req, res) => {
  try {
    const org = await PropertyOrganization.create(req.body);
    res.status(201).json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPropertyOrganizations = async (req, res) => {
  try {
    const orgs = await PropertyOrganization.getAll();
    res.json({ success: true, data: orgs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPropertyOrganization = async (req, res) => {
  try {
    const org = await PropertyOrganization.getById(req.params.id);
    if (!org) {
      return res.status(404).json({ success: false, error: 'Property organization not found' });
    }
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePropertyOrganization = async (req, res) => {
  try {
    const org = await PropertyOrganization.update(req.params.id, req.body);
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePropertyOrganizationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const org = await PropertyOrganization.updateStatus(req.params.id, status);
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePropertyOrganizationFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    const org = await PropertyOrganization.updateFeatures(req.params.id, features);
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const softDeletePropertyOrganization = async (req, res) => {
  try {
    const org = await PropertyOrganization.softDelete(req.params.id);
    res.json({ success: true, data: org });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const hardDeletePropertyOrganization = async (req, res) => {
  try {
    await PropertyOrganization.hardDelete(req.params.id);
    res.json({ success: true, message: 'Property organization permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

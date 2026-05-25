import { Branch } from '../../models/ngo/branch.model.js';
import { denyForeignNgoResource } from '../../middleware/ngoAuth.middleware.js';

export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create({ ...req.body, organizationId: req.organizationId });
    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const organizationId = req.organizationId || req.query.organizationId;
    const { status, type, country } = req.query;
    const filters = { status, type, country };
    const branches = await Branch.getAll(organizationId, filters);
    res.json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.getById(req.params.id);
    if (denyForeignNgoResource(req, res, branch)) return;
    res.json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const existing = await Branch.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    const branch = await Branch.update(req.params.id, { ...req.body, organizationId: req.organizationId });
    res.json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const existing = await Branch.getById(req.params.id);
    if (denyForeignNgoResource(req, res, existing)) return;
    await Branch.delete(req.params.id);
    res.json({ success: true, message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBranchesByOrganization = async (req, res) => {
  try {
    if (req.params.organizationId !== req.organizationId) {
      return res.status(403).json({ success: false, error: 'Access denied for this organization' });
    }
    const branches = await Branch.getByOrganization(req.params.organizationId);
    res.json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

import { Branch } from '../../models/ngo/branch.model.js';

export const createBranch = async (req, res) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllBranches = async (req, res) => {
  try {
    const { organizationId, status, type, country } = req.query;
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
    if (!branch) return res.status(404).json({ success: false, error: 'Branch not found' });
    res.json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const branch = await Branch.update(req.params.id, req.body);
    res.json({ success: true, data: branch });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    await Branch.delete(req.params.id);
    res.json({ success: true, message: 'Branch deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBranchesByOrganization = async (req, res) => {
  try {
    const branches = await Branch.getByOrganization(req.params.organizationId);
    res.json({ success: true, data: branches });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

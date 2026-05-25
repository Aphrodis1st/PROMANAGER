import { Department } from '../../models/ngo/department.model.js';

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const { organizationId, branchId, status } = req.query;
    const filters = { branchId, status };
    const departments = await Department.getAll(organizationId, filters);
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartment = async (req, res) => {
  try {
    const department = await Department.getById(req.params.id);
    if (!department) return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.update(req.params.id, req.body);
    res.json({ success: true, data: department });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    await Department.delete(req.params.id);
    res.json({ success: true, message: 'Department deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartmentsByBranch = async (req, res) => {
  try {
    const departments = await Department.getByBranch(req.params.branchId);
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDepartmentHierarchy = async (req, res) => {
  try {
    const hierarchy = await Department.getHierarchy(req.params.organizationId);
    res.json({ success: true, data: hierarchy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

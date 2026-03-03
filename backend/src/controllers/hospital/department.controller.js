import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from '../../models/hospital/department.model.js';

export const create = async (req, res) => {
  try {
    const payload = {
      hospitalId: req.user?.hospitalId || 'default-hospital',
      ...req.body
    };

    const dept = await createDepartment(payload);
    res.status(201).json(dept);
  } catch (err) {
    console.error('Create department error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAll = async (req, res) => {
  try {
    const depts = await getDepartments();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getById = async (req, res) => {
  try {
    const dept = await getDepartmentById(req.params.id);
    if (!dept) return res.status(404).json({ message: 'Not found' });
    res.json(dept);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateDepartment(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteDepartment(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

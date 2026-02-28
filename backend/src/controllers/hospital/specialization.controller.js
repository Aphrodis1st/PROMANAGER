import {
  createSpecialization,
  getByDepartment,
  updateSpecialization,
  deleteSpecialization
} from '../../models/hospital/specialization.model.js';

export const create = async (req, res) => {
  try {
    const spec = await createSpecialization(req.body);
    res.status(201).json(spec);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getByDept = async (req, res) => {
  try {
    const data = await getByDepartment(req.params.departmentId);
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateSpecialization(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteSpecialization(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
import {
  createWard,
  getWards,
  updateWard,
  deleteWard
} from '../../models/hospital/ward.model.js';

// CREATE
export const create = async (req, res) => {
  try {
    const ward = await createWard(req.body);
    res.status(201).json(ward);
  } catch (err) {
    console.error('Create ward error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL
export const getAll = async (req, res) => {
  try {
    const wards = await getWards();
    res.json(wards);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
export const update = async (req, res) => {
  try {
    const updated = await updateWard(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const remove = async (req, res) => {
  try {
    await deleteWard(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
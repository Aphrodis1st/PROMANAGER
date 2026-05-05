import { Shift } from '../../models/hr/shift.model.js';

export const createShift = async (req, res) => {
  try {
    const shift = await Shift.create(req.body);
    res.status(201).json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getShifts = async (req, res) => {
  try {
    const { organizationId } = req.query;
    const shifts = await Shift.getAll(organizationId);
    res.json(shifts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateShift = async (req, res) => {
  try {
    const shift = await Shift.update(req.params.id, req.body);
    res.json(shift);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteShift = async (req, res) => {
  try {
    await Shift.delete(req.params.id);
    res.json({ message: 'Shift deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

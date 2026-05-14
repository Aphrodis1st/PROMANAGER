import * as StaffModel from '../../models/property/staff.model.js';

export const create = async (req, res) => {
  try {
    const staff = await StaffModel.createStaff(req.body);
    res.status(201).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const staff = await StaffModel.getStaff(req.query);
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const staff = await StaffModel.getStaffById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Not found' });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await StaffModel.updateStaff(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await StaffModel.deleteStaff(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

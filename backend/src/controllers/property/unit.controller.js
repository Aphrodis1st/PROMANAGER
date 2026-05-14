import * as UnitModel from '../../models/property/unit.model.js';

export const create = async (req, res) => {
  try {
    const unit = await UnitModel.createUnit(req.body);
    res.status(201).json({ success: true, data: unit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const units = await UnitModel.getUnits(req.query);
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const unit = await UnitModel.getUnitById(req.params.id);
    if (!unit) return res.status(404).json({ message: 'Not found' });
    res.json(unit);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await UnitModel.updateUnit(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await UnitModel.deleteUnit(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkImport = async (req, res) => {
  try {
    const units = await UnitModel.bulkImportUnits(req.body.units);
    res.status(201).json({ success: true, data: units });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

import * as LeaseModel from '../../models/property/lease.model.js';

export const create = async (req, res) => {
  try {
    const lease = await LeaseModel.createLease(req.body);
    res.status(201).json({ success: true, data: lease });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const leases = await LeaseModel.getLeases(req.query);
    res.json(leases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const lease = await LeaseModel.getLeaseById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Not found' });
    res.json(lease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await LeaseModel.updateLease(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await LeaseModel.deleteLease(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

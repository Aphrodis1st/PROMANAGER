import { Impact } from '../../models/ngo/impact.model.js';

export const createImpact = async (req, res) => {
  try {
    const impact = await Impact.create(req.body);
    res.status(201).json({ success: true, data: impact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllImpacts = async (req, res) => {
  try {
    const { organizationId, projectId } = req.query;
    const impacts = await Impact.getAll(organizationId, projectId);
    res.json({ success: true, data: impacts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getImpact = async (req, res) => {
  try {
    const impact = await Impact.getById(req.params.id);
    if (!impact) return res.status(404).json({ success: false, error: 'Impact not found' });
    res.json({ success: true, data: impact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateImpact = async (req, res) => {
  try {
    const impact = await Impact.update(req.params.id, req.body);
    res.json({ success: true, data: impact });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteImpact = async (req, res) => {
  try {
    await Impact.delete(req.params.id);
    res.json({ success: true, message: 'Impact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

import { Tender } from '../../models/ngo/tender.model.js';

export const createTender = async (req, res) => {
  try {
    const tender = await Tender.create(req.body);
    res.status(201).json({ success: true, data: tender });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllTenders = async (req, res) => {
  try {
    const { organizationId, projectId } = req.query;
    const tenders = await Tender.getAll(organizationId, projectId);
    res.json({ success: true, data: tenders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTender = async (req, res) => {
  try {
    const tender = await Tender.getById(req.params.id);
    if (!tender) return res.status(404).json({ success: false, error: 'Tender not found' });
    res.json({ success: true, data: tender });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTender = async (req, res) => {
  try {
    const tender = await Tender.update(req.params.id, req.body);
    res.json({ success: true, data: tender });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTender = async (req, res) => {
  try {
    await Tender.delete(req.params.id);
    res.json({ success: true, message: 'Tender deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

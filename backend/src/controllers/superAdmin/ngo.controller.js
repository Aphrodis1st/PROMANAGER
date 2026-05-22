import { NGO } from '../../models/superAdmin/ngo.model.js';

export const createNGO = async (req, res) => {
  try {
    const ngo = await NGO.create(req.body);
    res.status(201).json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.getAll();
    res.json({ success: true, data: ngos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getNGO = async (req, res) => {
  try {
    const ngo = await NGO.getById(req.params.id);
    if (!ngo) {
      return res.status(404).json({ success: false, error: 'NGO not found' });
    }
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNGO = async (req, res) => {
  try {
    const ngo = await NGO.update(req.params.id, req.body);
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNGOStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ngo = await NGO.updateStatus(req.params.id, status);
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateNGOFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    const ngo = await NGO.updateFeatures(req.params.id, features);
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const softDeleteNGO = async (req, res) => {
  try {
    const ngo = await NGO.softDelete(req.params.id);
    res.json({ success: true, data: ngo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const hardDeleteNGO = async (req, res) => {
  try {
    await NGO.hardDelete(req.params.id);
    res.json({ success: true, message: 'NGO permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

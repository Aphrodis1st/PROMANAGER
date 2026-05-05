import { Pharmacy } from '../../models/superAdmin/pharmacy.model.js';

export const createPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.create(req.body);
    res.status(201).json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.getAll();
    res.json({ success: true, data: pharmacies });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.getById(req.params.id);
    if (!pharmacy) {
      return res.status(404).json({ success: false, error: 'Pharmacy not found' });
    }
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.update(req.params.id, req.body);
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePharmacyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const pharmacy = await Pharmacy.updateStatus(req.params.id, status);
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePharmacyFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    const pharmacy = await Pharmacy.updateFeatures(req.params.id, features);
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const softDeletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.softDelete(req.params.id);
    res.json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const hardDeletePharmacy = async (req, res) => {
  try {
    await Pharmacy.hardDelete(req.params.id);
    res.json({ success: true, message: 'Pharmacy permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

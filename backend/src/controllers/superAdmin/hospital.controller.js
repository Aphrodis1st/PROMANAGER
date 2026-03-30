import { Hospital } from '../../models/superAdmin/hospital.model.js';

export const createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.getAll();
    res.json({ success: true, data: hospitals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.getById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.update(req.params.id, req.body);
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateHospitalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const hospital = await Hospital.updateStatus(req.params.id, status);
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateHospitalFeatures = async (req, res) => {
  try {
    const { features } = req.body;
    const hospital = await Hospital.updateFeatures(req.params.id, features);
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const softDeleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.softDelete(req.params.id);
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const hardDeleteHospital = async (req, res) => {
  try {
    await Hospital.hardDelete(req.params.id);
    res.json({ success: true, message: 'Hospital permanently deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
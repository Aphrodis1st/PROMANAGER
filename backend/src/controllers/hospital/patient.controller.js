import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from '../../models/hospital/patient.model.js';

// CREATE
export const create = async (req, res) => {
  try {
    const payload = {
      hospitalId: req.user.hospitalId,
      ...req.body
    };

    const patient = await createPatient(payload);
    res.status(201).json(patient);
  } catch (err) {
    console.error('Create patient error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL
export const getAll = async (req, res) => {
  try {
    const patients = await getPatients();
    res.json(patients);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET BY ID
export const getById = async (req, res) => {
  try {
    const patient = await getPatientById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Not found' });
    res.json(patient);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
export const update = async (req, res) => {
  try {
    const updated = await updatePatient(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const remove = async (req, res) => {
  try {
    await deletePatient(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
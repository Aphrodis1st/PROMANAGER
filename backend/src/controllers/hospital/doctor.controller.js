import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor
} from '../../models/hospital/doctor.model.js';

export const create = async (req, res) => {
  try {
    const doctor = await createDoctor(req.body);
    res.status(201).json(doctor);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAll = async (req, res) => {
  try {
    const doctors = await getDoctors();
    res.json(doctors);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getById = async (req, res) => {
  try {
    const doctor = await getDoctorById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Not found' });
    res.json(doctor);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateDoctor(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteDoctor(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
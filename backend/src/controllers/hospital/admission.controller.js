import {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission
} from '../../models/hospital/admission.model.js';
import { getPatientById } from '../../models/hospital/patient.model.js';

// CREATE
export const create = async (req, res) => {
  try {
    const { patientId, admitDate, ward, bed, reason, admissionType } = req.body;
    
    // Get patient details
    const patient = await getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const payload = {
      patientId,
      patientName: patient.fullName || patient.name,
      admitDate,
      ward,
      bed,
      reason,
      admissionType,
      status: 'Active',
      hospitalId: req.user?.hospitalId || 'default-hospital'
    };

    const admission = await createAdmission(payload);
    res.status(201).json({ success: true, data: admission });
  } catch (err) {
    console.error('Create admission error:', err);
    res.status(500).json({ 
      success: false, 
      message: err.message || 'Internal server error'
    });
  }
};

// GET ALL
export const getAll = async (req, res) => {
  try {
    const admissions = await getAdmissions();
    res.json(admissions);
  } catch (err) {
    console.error('Get admissions error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET BY ID
export const getById = async (req, res) => {
  try {
    const admission = await getAdmissionById(req.params.id);
    if (!admission) return res.status(404).json({ message: 'Not found' });
    res.json(admission);
  } catch (err) {
    console.error('Get admission error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// UPDATE
export const update = async (req, res) => {
  try {
    const updated = await updateAdmission(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    console.error('Update admission error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE
export const remove = async (req, res) => {
  try {
    await deleteAdmission(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete admission error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DISCHARGE
export const discharge = async (req, res) => {
  try {
    const { dischargeDate, dischargeNotes } = req.body;
    const updated = await updateAdmission(req.params.id, {
      status: 'Discharged',
      dischargeDate,
      dischargeNotes
    });
    res.json(updated);
  } catch (err) {
    console.error('Discharge admission error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

import {
  createMedicalRecord,
  getRecordsByPatient,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../../models/hospital/medicalRecord.model.js';

export const create = async (req, res) => {
  try {
    const record = await createMedicalRecord({
      doctorId: req.user.uid,
      ...req.body
    });

    res.status(201).json(record);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getByPatient = async (req, res) => {
  try {
    const data = await getRecordsByPatient(req.params.patientId);
    res.json(data);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateMedicalRecord(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteMedicalRecord(req.params.id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Internal server error' });
  }
};
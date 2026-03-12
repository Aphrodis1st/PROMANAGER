import {
  createMedicalRecord,
  getRecordsByPatient,
  updateMedicalRecord,
  deleteMedicalRecord
} from '../../models/hospital/medicalRecord.model.js';

export const create = async (req, res) => {
  try {
    console.log('Received medical record creation request:');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const recordData = {
      doctorId: req.user?.uid || 'default-doctor',
      ...req.body
    };
    
    console.log('Creating record with data:', recordData);
    const record = await createMedicalRecord(recordData);
    console.log('Record created successfully:', record);

    res.status(201).json(record);
  } catch (error) {
    console.error('Error in create medical record:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const getByPatient = async (req, res) => {
  try {
    const data = await getRecordsByPatient(req.params.patientId);
    res.json(data);
  } catch (error) {
    console.error('Error in getByPatient:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await updateMedicalRecord(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error in update medical record:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await deleteMedicalRecord(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error in delete medical record:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
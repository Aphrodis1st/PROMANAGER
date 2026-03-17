import { Router } from 'express';
import {
  create,
  getByPatient,
  update,
  remove,
  addSurgeryRecord
} from '../../controllers/hospital/medicalRecord.controller.js';
import { getAllMedicalRecords, getMedicalRecordById } from '../../models/hospital/medicalRecord.model.js';

const router = Router();

// Get all medical records
router.get('/', async (req, res) => {
  try {
    const records = await getAllMedicalRecords();
    res.json(records);
  } catch (error) {
    console.error('Error fetching all medical records:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get medical record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = await getMedicalRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Medical record not found' });
    }
    res.json(record);
  } catch (error) {
    console.error('Error fetching medical record by ID:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/', create);
router.get('/patient/:patientId', getByPatient);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/surgery/:patientId', addSurgeryRecord);

export default router;
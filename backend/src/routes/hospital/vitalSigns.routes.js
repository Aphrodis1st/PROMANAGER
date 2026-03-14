import { Router } from 'express';
import {
  create,
  getByPatient,
  getLatestByPatient,
  getById,
  update,
  remove,
  getStats
} from '../../controllers/hospital/vitalSigns.controller.js';

const router = Router();

// Get all vital signs for a patient
router.get('/patient/:patientId', getByPatient);

// Get latest vital signs for a patient
router.get('/patient/:patientId/latest', getLatestByPatient);

// Get vital signs statistics for a patient
router.get('/patient/:patientId/stats', getStats);

// Create new vital signs record
router.post('/', create);

// Get vital signs by ID
router.get('/:id', getById);

// Update vital signs record
router.put('/:id', update);

// Delete vital signs record
router.delete('/:id', remove);

export default router;
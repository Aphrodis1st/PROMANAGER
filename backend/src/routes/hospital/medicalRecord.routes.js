import { Router } from 'express';
import {
  create,
  getByPatient,
  update,
  remove,
  addSurgeryRecord
} from '../../controllers/hospital/medicalRecord.controller.js';

const router = Router();

router.post('/', create);
router.get('/patient/:patientId', getByPatient);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/surgery/:patientId', addSurgeryRecord);

export default router;
import { Router } from 'express';
import {
  create,
  getByPatient,
  update,
  remove
} from '../../controllers/hospital/medicalRecord.controller.js';

const router = Router();

router.post('/', create);
router.get('/patient/:patientId', getByPatient);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
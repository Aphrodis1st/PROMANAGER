import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  create,
  getByPatient,
  update,
  remove
} from '../../controllers/hospital/medicalRecord.controller.js';

const router = Router();

router.post('/', requireAuth, requireRole('DOCTOR','ADMIN'), create);
router.get('/patient/:patientId', requireAuth, getByPatient);
router.put('/:id', requireAuth, requireRole('DOCTOR','ADMIN'), update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

export default router;
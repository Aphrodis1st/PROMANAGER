import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  create,
  getAll,
  getByPatient,
  update,
  remove
} from '../../controllers/hospital/lab.controller.js';

const router = Router();

router.post('/', requireAuth, requireRole('LAB','ADMIN'), create);
router.get('/', requireAuth, requireRole('LAB','ADMIN'), getAll);
router.get('/patient/:patientId', requireAuth, getByPatient);
router.put('/:id', requireAuth, requireRole('LAB','ADMIN'), update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

export default router;
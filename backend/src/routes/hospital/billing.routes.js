import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  create,
  getAll,
  getByPatient,
  markPaid,
  remove
} from '../../controllers/hospital/billing.controller.js';

const router = Router();

router.post('/', requireAuth, requireRole('ACCOUNTANT','ADMIN'), create);
router.get('/', requireAuth, requireRole('ACCOUNTANT','ADMIN'), getAll);
router.get('/patient/:patientId', requireAuth, getByPatient);
router.patch('/:id/pay', requireAuth, requireRole('ACCOUNTANT','ADMIN'), markPaid);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

export default router;
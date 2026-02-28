import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import {
  create,
  getAll,
  getById,
  update,
  remove
} from '../../controllers/hospital/patient.controller.js';

const router = Router();

router.post('/', requireAuth, requireRole('RECEPTIONIST','ADMIN'), create);
router.get('/', requireAuth, getAll);
router.get('/:id', requireAuth, getById);
router.put('/:id', requireAuth, requireRole('RECEPTIONIST','ADMIN'), update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), remove);

export default router;
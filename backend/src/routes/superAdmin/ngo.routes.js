import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  createNGO,
  getAllNGOs,
  getNGO,
  updateNGO,
  updateNGOStatus,
  updateNGOFeatures,
  softDeleteNGO,
  hardDeleteNGO
} from '../../controllers/superAdmin/ngo.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.post('/', createNGO);
router.get('/', getAllNGOs);
router.get('/:id', getNGO);
router.put('/:id', updateNGO);
router.patch('/:id/status', updateNGOStatus);
router.patch('/:id/features', updateNGOFeatures);
router.patch('/:id/soft-delete', softDeleteNGO);
router.delete('/:id', hardDeleteNGO);

export default router;

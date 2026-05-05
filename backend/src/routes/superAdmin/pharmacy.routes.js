import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  createPharmacy,
  getAllPharmacies,
  getPharmacy,
  updatePharmacy,
  updatePharmacyStatus,
  updatePharmacyFeatures,
  softDeletePharmacy,
  hardDeletePharmacy
} from '../../controllers/superAdmin/pharmacy.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.post('/', createPharmacy);
router.get('/', getAllPharmacies);
router.get('/:id', getPharmacy);
router.put('/:id', updatePharmacy);
router.patch('/:id/status', updatePharmacyStatus);
router.patch('/:id/features', updatePharmacyFeatures);
router.patch('/:id/soft-delete', softDeletePharmacy);
router.delete('/:id', hardDeletePharmacy);

export default router;

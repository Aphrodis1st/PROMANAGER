import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  createHospital,
  getAllHospitals,
  getHospital,
  updateHospital,
  updateHospitalStatus,
  updateHospitalFeatures,
  softDeleteHospital,
  hardDeleteHospital
} from '../../controllers/superAdmin/hospital.controller.js';

const router = express.Router();

// Apply super admin auth to all routes
router.use(superAdminAuth);

router.post('/', createHospital);
router.get('/', getAllHospitals);
router.get('/:id', getHospital);
router.put('/:id', updateHospital);
router.patch('/:id/status', updateHospitalStatus);
router.patch('/:id/features', updateHospitalFeatures);
router.patch('/:id/soft-delete', softDeleteHospital);
router.delete('/:id', hardDeleteHospital);

export default router;
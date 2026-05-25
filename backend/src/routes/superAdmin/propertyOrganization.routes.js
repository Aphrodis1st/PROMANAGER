import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  createPropertyOrganization,
  getAllPropertyOrganizations,
  getPropertyOrganization,
  updatePropertyOrganization,
  updatePropertyOrganizationStatus,
  updatePropertyOrganizationFeatures,
  softDeletePropertyOrganization,
  hardDeletePropertyOrganization,
} from '../../controllers/superAdmin/propertyOrganization.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.post('/', createPropertyOrganization);
router.get('/', getAllPropertyOrganizations);
router.get('/:id', getPropertyOrganization);
router.put('/:id', updatePropertyOrganization);
router.patch('/:id/status', updatePropertyOrganizationStatus);
router.patch('/:id/features', updatePropertyOrganizationFeatures);
router.patch('/:id/soft-delete', softDeletePropertyOrganization);
router.delete('/:id', hardDeletePropertyOrganization);

export default router;

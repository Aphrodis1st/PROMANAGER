import express from 'express';
import { hrOrganizationController } from '../../controllers/superAdmin/hrOrganization.controller.js';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';

const router = express.Router();

// All routes require super admin authentication
router.use(superAdminAuth);

// HR Organization routes
router.get('/', hrOrganizationController.getAll);
router.get('/:id', hrOrganizationController.getById);
router.post('/', hrOrganizationController.create);
router.put('/:id', hrOrganizationController.update);
router.patch('/:id/status', hrOrganizationController.updateStatus);
router.patch('/:id/features', hrOrganizationController.updateFeatures);
router.delete('/:id', hrOrganizationController.delete);
router.get('/:id/admins', hrOrganizationController.getAdmins);

export default router;

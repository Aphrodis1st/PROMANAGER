import express from 'express';
import { payrollController } from '../../controllers/superAdmin/payroll.controller.js';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';

const router = express.Router();

// All routes require super admin authentication
router.use(superAdminAuth);

// Payroll routes
router.get('/', payrollController.getAll);
router.get('/stats', payrollController.getStats);
router.get('/organization/:organizationId', payrollController.getByOrganization);

export default router;

import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  getDashboardStats,
  getSystemActivity,
  getSystemSettings
} from '../../controllers/superAdmin/dashboard.controller.js';

const router = express.Router();

// Apply super admin auth to all routes
router.use(superAdminAuth);

router.get('/stats', getDashboardStats);
router.get('/activity', getSystemActivity);
router.get('/settings', getSystemSettings);

export default router;
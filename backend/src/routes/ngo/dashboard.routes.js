import express from 'express';
import { getDashboardOverview } from '../../controllers/ngo/dashboard.controller.js';
import { ngoAuth, attachNgoUserContext, requireNgoAdmin } from '../../middleware/ngoAuth.middleware.js';

const router = express.Router();

router.get('/', ngoAuth, attachNgoUserContext, requireNgoAdmin, getDashboardOverview);

export default router;

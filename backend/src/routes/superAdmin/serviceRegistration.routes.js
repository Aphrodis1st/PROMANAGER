import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  listRegistrations,
  getRegistration,
  updateRegistration,
  deleteRegistration,
} from '../../controllers/superAdmin/serviceRegistration.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.get('/', listRegistrations);
router.get('/:id', getRegistration);
router.patch('/:id', updateRegistration);
router.delete('/:id', deleteRegistration);

export default router;

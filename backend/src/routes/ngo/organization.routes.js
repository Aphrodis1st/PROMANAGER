import express from 'express';
import { 
  createOrganization, 
  getAllOrganizations, 
  getOrganization, 
  updateOrganization, 
  deleteOrganization,
  getOrganizationStats
} from '../../controllers/ngo/organization.controller.js';

const router = express.Router();

router.post('/', createOrganization);
router.get('/', getAllOrganizations);
router.get('/:id', getOrganization);
router.get('/:id/stats', getOrganizationStats);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

export default router;

import express from 'express';
import * as organizationController from '../../controllers/hr/organization.controller.js';

const router = express.Router();

router.post('/', organizationController.createOrganization);
router.get('/', organizationController.getOrganizations);
router.get('/:id', organizationController.getOrganization);
router.put('/:id', organizationController.updateOrganization);

export default router;

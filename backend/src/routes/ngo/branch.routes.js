import express from 'express';
import {
  createBranch,
  getAllBranches,
  getBranch,
  updateBranch,
  deleteBranch,
  getBranchesByOrganization,
} from '../../controllers/ngo/branch.controller.js';
import { ngoAuth, bindNgoTenant, assertNgoOrgAccess, attachNgoUserContext, requireNgoAdmin } from '../../middleware/ngoAuth.middleware.js';

const router = express.Router();

router.use(ngoAuth, attachNgoUserContext, requireNgoAdmin, bindNgoTenant);

router.post('/', createBranch);
router.get('/', getAllBranches);
router.get('/organization/:organizationId', assertNgoOrgAccess, getBranchesByOrganization);
router.get('/:id', getBranch);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export default router;

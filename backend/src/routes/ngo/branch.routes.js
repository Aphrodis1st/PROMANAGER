import express from 'express';
import { 
  createBranch, 
  getAllBranches, 
  getBranch, 
  updateBranch, 
  deleteBranch,
  getBranchesByOrganization
} from '../../controllers/ngo/branch.controller.js';

const router = express.Router();

router.post('/', createBranch);
router.get('/', getAllBranches);
router.get('/:id', getBranch);
router.get('/organization/:organizationId', getBranchesByOrganization);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export default router;

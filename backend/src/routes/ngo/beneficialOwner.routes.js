import express from 'express';
import { 
  createBeneficialOwner, 
  getAllBeneficialOwners, 
  getBeneficialOwner, 
  updateBeneficialOwner, 
  deleteBeneficialOwner,
  verifyBeneficialOwner,
  getOwnershipStructure,
  getPoliticallyExposed
} from '../../controllers/ngo/beneficialOwner.controller.js';

const router = express.Router();

router.post('/', createBeneficialOwner);
router.get('/', getAllBeneficialOwners);
router.get('/:id', getBeneficialOwner);
router.get('/structure/:organizationId', getOwnershipStructure);
router.get('/pep/:organizationId', getPoliticallyExposed);
router.put('/:id', updateBeneficialOwner);
router.put('/:id/verify', verifyBeneficialOwner);
router.delete('/:id', deleteBeneficialOwner);

export default router;

import express from 'express';
import { 
  createAudit, 
  getAllAudits, 
  getAudit, 
  updateAudit, 
  deleteAudit,
  addAuditFinding,
  getAuditTrail,
  getComplianceStatus
} from '../../controllers/ngo/audit.controller.js';

const router = express.Router();

router.post('/', createAudit);
router.get('/', getAllAudits);
router.get('/:id', getAudit);
router.get('/trail/history', getAuditTrail);
router.get('/compliance/:organizationId', getComplianceStatus);
router.put('/:id', updateAudit);
router.post('/:id/findings', addAuditFinding);
router.delete('/:id', deleteAudit);

export default router;

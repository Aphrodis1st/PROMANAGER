import express from 'express';
import { 
  getOrganizationOverview, 
  getProjectDetails, 
  getTenderDetails,
  linkTenderToProject,
  linkContractToTenderAndProject,
  linkImpactToProject,
  linkEvaluationToProject
} from '../../controllers/ngo/integration.controller.js';

const router = express.Router();

router.get('/organization/:organizationId/overview', getOrganizationOverview);
router.get('/project/:projectId/details', getProjectDetails);
router.get('/tender/:tenderId/details', getTenderDetails);
router.post('/link/tender-to-project', linkTenderToProject);
router.post('/link/contract-to-tender-project', linkContractToTenderAndProject);
router.post('/link/impact-to-project', linkImpactToProject);
router.post('/link/evaluation-to-project', linkEvaluationToProject);

export default router;

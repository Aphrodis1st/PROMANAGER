import express from 'express';
import { 
  createOrgChart, 
  getAllOrgCharts, 
  getOrgChart, 
  getActiveOrgChart,
  updateOrgChart, 
  deleteOrgChart,
  generateOrgChart
} from '../../controllers/ngo/orgChart.controller.js';

const router = express.Router();

router.post('/', createOrgChart);
router.get('/', getAllOrgCharts);
router.get('/:id', getOrgChart);
router.get('/active/:organizationId', getActiveOrgChart);
router.get('/generate/:organizationId', generateOrgChart);
router.put('/:id', updateOrgChart);
router.delete('/:id', deleteOrgChart);

export default router;

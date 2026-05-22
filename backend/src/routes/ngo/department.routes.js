import express from 'express';
import { 
  createDepartment, 
  getAllDepartments, 
  getDepartment, 
  updateDepartment, 
  deleteDepartment,
  getDepartmentsByBranch,
  getDepartmentHierarchy
} from '../../controllers/ngo/department.controller.js';

const router = express.Router();

router.post('/', createDepartment);
router.get('/', getAllDepartments);
router.get('/:id', getDepartment);
router.get('/branch/:branchId', getDepartmentsByBranch);
router.get('/hierarchy/:organizationId', getDepartmentHierarchy);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;

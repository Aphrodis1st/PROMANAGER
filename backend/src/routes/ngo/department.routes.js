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
import { ngoAuth, attachNgoUserContext, requireNgoAdmin } from '../../middleware/ngoAuth.middleware.js';

const router = express.Router();

router.use(ngoAuth, attachNgoUserContext, requireNgoAdmin);

router.post('/', createDepartment);
router.get('/', getAllDepartments);
router.get('/branch/:branchId', getDepartmentsByBranch);
router.get('/hierarchy/:organizationId', getDepartmentHierarchy);
router.get('/:id', getDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);

export default router;

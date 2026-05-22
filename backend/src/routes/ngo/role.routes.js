import express from 'express';
import { 
  createRole, 
  getAllRoles, 
  getRole, 
  updateRole, 
  deleteRole,
  assignPermissions,
  getRolesByDepartment,
  getRoleHierarchy
} from '../../controllers/ngo/role.controller.js';

const router = express.Router();

router.post('/', createRole);
router.get('/', getAllRoles);
router.get('/:id', getRole);
router.get('/department/:departmentId', getRolesByDepartment);
router.get('/hierarchy/:organizationId', getRoleHierarchy);
router.put('/:id', updateRole);
router.put('/:id/permissions', assignPermissions);
router.delete('/:id', deleteRole);

export default router;

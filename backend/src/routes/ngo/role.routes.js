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
import { ngoAuth, attachNgoUserContext, requireNgoAdmin } from '../../middleware/ngoAuth.middleware.js';

const router = express.Router();

router.use(ngoAuth, attachNgoUserContext, requireNgoAdmin);

router.post('/', createRole);
router.get('/', getAllRoles);
router.get('/department/:departmentId', getRolesByDepartment);
router.get('/hierarchy/:organizationId', getRoleHierarchy);
router.get('/:id', getRole);
router.put('/:id/permissions', assignPermissions);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

export default router;

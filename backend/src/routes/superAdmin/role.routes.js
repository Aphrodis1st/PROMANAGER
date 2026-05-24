import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  listRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  addSubRole,
  removeSubRole,
  getRolePermissions,
} from '../../controllers/superAdmin/role.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.get('/permissions', getRolePermissions);
router.get('/', listRoles);
router.post('/', createRole);
router.get('/:id', getRole);
router.patch('/:id', updateRole);
router.delete('/:id', deleteRole);
router.post('/:id/sub-roles', addSubRole);
router.delete('/:id/sub-roles/:subRoleId', removeSubRole);

export default router;

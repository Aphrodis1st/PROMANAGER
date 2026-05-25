import express from 'express';
import { superAdminAuth } from '../../middleware/superAdminAuth.js';
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../../controllers/superAdmin/platformUser.controller.js';

const router = express.Router();

router.use(superAdminAuth);

router.get('/', listUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;

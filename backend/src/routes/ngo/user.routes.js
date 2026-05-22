import express from 'express';
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  suspendUser,
  updateUserPermissions
} from '../../controllers/ngo/user.controller.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.put('/:id/activate', activateUser);
router.put('/:id/suspend', suspendUser);
router.put('/:id/permissions', updateUserPermissions);
router.delete('/:id', deleteUser);

export default router;

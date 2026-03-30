import express from 'express';
import { 
  getDashboardStats,
  getUserManagement,
  createUser,
  updateUser,
  deleteUser,
  assignRole,
  getDepartmentManagement,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getStaffManagement,
  assignStaffToDepartment,
  getPatientManagement,
  getAppointmentSystem,
  createSubAdmin,
  getAccessControl,
  updatePermissions,
  resetUserPassword,
  toggleUserAccess,
  assignDepartmentHead,
  getProfessionalRoles,
  getStaffByDepartment,
  bulkUpdateUserStatus,
  bulkDeleteUsers,
  setPartialPassword
} from '../../controllers/hospital/hospitalAdmin.controller.js';
import { authenticateToken } from '../../middleware/auth.middleware.js';
import { checkHospitalAdmin } from '../../middleware/hospitalAuth.middleware.js';

const router = express.Router();

// Debug endpoints - no middleware
router.get('/debug/token', (req, res) => {
  const authHeader = req.headers['authorization'];
  console.log('Debug - Auth header:', authHeader);
  res.json({
    authHeaderPresent: !!authHeader,
    authHeader: authHeader ? authHeader.substring(0, 50) + '...' : 'missing',
    headers: Object.keys(req.headers)
  });
});

router.get('/debug/simple', (req, res) => {
  res.json({ success: true, message: 'Simple endpoint working' });
});

// Test with only auth middleware
router.get('/debug/auth-only', authenticateToken, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth middleware working',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      hospitalId: req.user.hospitalId
    }
  });
});

// Test with both middlewares
router.get('/debug/full-auth', authenticateToken, checkHospitalAdmin, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Full auth working',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      hospitalId: req.user.hospitalId
    }
  });
});

// Dashboard Stats
router.get('/dashboard', authenticateToken, checkHospitalAdmin, getDashboardStats);

// User Management
router.get('/users', authenticateToken, checkHospitalAdmin, getUserManagement);
router.post('/users', authenticateToken, checkHospitalAdmin, createUser);
router.put('/users/:userId', authenticateToken, checkHospitalAdmin, updateUser);
router.delete('/users/:userId', authenticateToken, checkHospitalAdmin, deleteUser);
router.post('/users/:userId/role', authenticateToken, checkHospitalAdmin, assignRole);
router.post('/users/:userId/reset-password', authenticateToken, checkHospitalAdmin, resetUserPassword);
router.post('/users/:userId/partial-password', authenticateToken, checkHospitalAdmin, setPartialPassword);
router.post('/users/:userId/toggle-access', authenticateToken, checkHospitalAdmin, toggleUserAccess);

// Department Management
router.get('/departments', authenticateToken, checkHospitalAdmin, getDepartmentManagement);
router.post('/departments', authenticateToken, checkHospitalAdmin, createDepartment);
router.put('/departments/:deptId', authenticateToken, checkHospitalAdmin, updateDepartment);
router.delete('/departments/:deptId', authenticateToken, checkHospitalAdmin, deleteDepartment);

// Staff Management
router.get('/staff', authenticateToken, checkHospitalAdmin, getStaffManagement);
router.post('/staff/:staffId/department', authenticateToken, checkHospitalAdmin, assignStaffToDepartment);

// Patient Management
router.get('/patients', authenticateToken, checkHospitalAdmin, getPatientManagement);

// Appointment System
router.get('/appointments', authenticateToken, checkHospitalAdmin, getAppointmentSystem);

// Sub Admin Management
router.post('/sub-admin', authenticateToken, checkHospitalAdmin, createSubAdmin);

// Access Control
router.get('/access-control', authenticateToken, checkHospitalAdmin, getAccessControl);
router.put('/permissions/:userId', authenticateToken, checkHospitalAdmin, updatePermissions);

// Department Head Assignment
router.post('/departments/:deptId/head', authenticateToken, checkHospitalAdmin, assignDepartmentHead);

// Professional Roles
router.get('/roles', authenticateToken, checkHospitalAdmin, getProfessionalRoles);

// Staff by Department
router.get('/departments/:deptId/staff', authenticateToken, checkHospitalAdmin, getStaffByDepartment);

// Bulk Operations
router.post('/users/bulk/status', authenticateToken, checkHospitalAdmin, bulkUpdateUserStatus);
router.post('/users/bulk/delete', authenticateToken, checkHospitalAdmin, bulkDeleteUsers);

export default router;
import jwt from 'jsonwebtoken';
import { db } from '../../utils/firebase.js';

// Enhanced hospital authentication middleware
export const hospitalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Get user details from database to ensure fresh permissions
    let userDoc;
    let userData;
    
    if (decoded.userType === 'admin') {
      userDoc = await db().collection('hospitalAdmins').doc(decoded.id).get();
    } else {
      userDoc = await db().collection('users').doc(decoded.id).get();
    }
    
    if (!userDoc.exists) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    userData = { id: userDoc.id, ...userDoc.data() };
    
    // Check if user is active
    if (userData.status !== 'active' && userData.isActive !== true) {
      return res.status(403).json({ success: false, error: 'Account is inactive' });
    }
    
    // Attach user info to request
    req.user = {
      id: decoded.id,
      hospitalId: decoded.hospitalId,
      role: decoded.role,
      userType: decoded.userType,
      departmentId: userData.departmentId,
      permissions: userData.permissions || {},
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email
    };
    
    next();
  } catch (error) {
    console.error('Hospital auth error:', error);
    res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};

// Role-based access control
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const userRole = req.user.role;
    const allowedRolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    if (!allowedRolesList.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required role: ${allowedRolesList.join(' or ')}. Your role: ${userRole}` 
      });
    }
    
    next();
  };
};

// Department-based access control
export const requireDepartment = (allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    // Hospital admins can access all departments
    if (req.user.role === 'admin' || req.user.role === 'hospital_admin') {
      return next();
    }
    
    const userDepartment = req.user.departmentId;
    const allowedDeptsList = Array.isArray(allowedDepartments) ? allowedDepartments : [allowedDepartments];
    
    if (!userDepartment) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. No department assigned to user' 
      });
    }
    
    if (!allowedDeptsList.includes(userDepartment)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required department: ${allowedDeptsList.join(' or ')}. Your department: ${userDepartment}` 
      });
    }
    
    next();
  };
};

// Combined role and department access control
export const requireRoleAndDepartment = (allowedRoles, allowedDepartments) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const userRole = req.user.role;
    const userDepartment = req.user.departmentId;
    const allowedRolesList = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const allowedDeptsList = Array.isArray(allowedDepartments) ? allowedDepartments : [allowedDepartments];
    
    // Check role
    if (!allowedRolesList.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required role: ${allowedRolesList.join(' or ')}. Your role: ${userRole}` 
      });
    }
    
    // Hospital admins can access all departments
    if (userRole === 'admin' || userRole === 'hospital_admin') {
      return next();
    }
    
    // Check department for non-admin roles
    if (!userDepartment) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. No department assigned to user' 
      });
    }
    
    if (!allowedDeptsList.includes(userDepartment)) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required department: ${allowedDeptsList.join(' or ')}. Your department: ${userDepartment}` 
      });
    }
    
    next();
  };
};

// Permission-based access control
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    // Hospital admins have all permissions
    if (req.user.role === 'admin' || req.user.role === 'hospital_admin') {
      return next();
    }
    
    const userPermissions = req.user.permissions || {};
    
    if (!userPermissions[permission]) {
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. Required permission: ${permission}` 
      });
    }
    
    next();
  };
};

// Advanced RBAC with multiple conditions
export const requireAccess = (config) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const { roles, departments, permissions, requireAll = false } = config;
    const userRole = req.user.role;
    const userDepartment = req.user.departmentId;
    const userPermissions = req.user.permissions || {};
    
    // Hospital admins bypass most restrictions
    if (userRole === 'admin' || userRole === 'hospital_admin') {
      return next();
    }
    
    let hasRoleAccess = true;
    let hasDepartmentAccess = true;
    let hasPermissionAccess = true;
    
    // Check roles
    if (roles && roles.length > 0) {
      hasRoleAccess = roles.includes(userRole);
    }
    
    // Check departments
    if (departments && departments.length > 0) {
      hasDepartmentAccess = userDepartment && departments.includes(userDepartment);
    }
    
    // Check permissions
    if (permissions && permissions.length > 0) {
      if (requireAll) {
        hasPermissionAccess = permissions.every(perm => userPermissions[perm]);
      } else {
        hasPermissionAccess = permissions.some(perm => userPermissions[perm]);
      }
    }
    
    // Determine access based on requireAll flag
    let hasAccess;
    if (requireAll) {
      hasAccess = hasRoleAccess && hasDepartmentAccess && hasPermissionAccess;
    } else {
      hasAccess = hasRoleAccess || hasDepartmentAccess || hasPermissionAccess;
    }
    
    if (!hasAccess) {
      const errors = [];
      if (roles && !hasRoleAccess) errors.push(`Required role: ${roles.join(' or ')}`);
      if (departments && !hasDepartmentAccess) errors.push(`Required department: ${departments.join(' or ')}`);
      if (permissions && !hasPermissionAccess) errors.push(`Required permission: ${permissions.join(requireAll ? ' and ' : ' or ')}`);
      
      return res.status(403).json({ 
        success: false, 
        error: `Access denied. ${errors.join('. ')}` 
      });
    }
    
    next();
  };
};

// Middleware to check if user can access specific patient data
export const requirePatientAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const patientId = req.params.patientId || req.body.patientId;
    if (!patientId) {
      return res.status(400).json({ success: false, error: 'Patient ID required' });
    }
    
    // Hospital admins can access all patient data
    if (req.user.role === 'admin' || req.user.role === 'hospital_admin') {
      return next();
    }
    
    // Get patient data
    const patientDoc = await db().collection('patients').doc(patientId).get();
    if (!patientDoc.exists) {
      return res.status(404).json({ success: false, error: 'Patient not found' });
    }
    
    const patientData = patientDoc.data();
    
    // Check if patient belongs to same hospital
    if (patientData.hospitalId !== req.user.hospitalId) {
      return res.status(403).json({ success: false, error: 'Access denied. Patient not in your hospital' });
    }
    
    // Department-based access for patient data
    if (req.user.departmentId && patientData.assignedDepartment) {
      if (patientData.assignedDepartment !== req.user.departmentId) {
        return res.status(403).json({ 
          success: false, 
          error: 'Access denied. Patient not assigned to your department' 
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Patient access check error:', error);
    res.status(500).json({ success: false, error: 'Access verification failed' });
  }
};

// Middleware to log access attempts for audit
export const auditAccess = (action) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await db().collection('auditLogs').add({
          userId: req.user.id,
          userRole: req.user.role,
          userDepartment: req.user.departmentId,
          hospitalId: req.user.hospitalId,
          action,
          endpoint: req.originalUrl,
          method: req.method,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          timestamp: new Date()
        });
      }
      next();
    } catch (error) {
      console.error('Audit logging error:', error);
      // Don't block the request if audit logging fails
      next();
    }
  };
};

export default {
  hospitalAuth,
  requireRole,
  requireDepartment,
  requireRoleAndDepartment,
  requirePermission,
  requireAccess,
  requirePatientAccess,
  auditAccess
};
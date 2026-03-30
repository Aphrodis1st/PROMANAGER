import jwt from 'jsonwebtoken';
import { db } from '../../utils/firebase.js';
import { 
  hospitalAuth, 
  requireRole, 
  requireDepartment, 
  requireRoleAndDepartment, 
  requirePermission, 
  requireAccess, 
  requirePatientAccess, 
  auditAccess 
} from './rbac.middleware.js';

// Legacy middleware for backward compatibility
export const legacyHospitalAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token)
      return res.status(401).json({ success: false, error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (decoded.role !== 'hospital_admin')
      return res.status(403).json({ success: false, error: 'Hospital admin role required' });

    req.adminId = decoded.id;
    req.hospitalId = decoded.hospitalId;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Export new RBAC middleware as default
export { 
  hospitalAuth, 
  requireRole, 
  requireDepartment, 
  requireRoleAndDepartment, 
  requirePermission, 
  requireAccess, 
  requirePatientAccess, 
  auditAccess 
};

// Default export for backward compatibility
export default hospitalAuth;

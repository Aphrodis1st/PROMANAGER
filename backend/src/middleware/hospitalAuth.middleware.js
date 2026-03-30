import { db } from '../../utils/firebase.js';

export const checkHospitalAdmin = async (req, res, next) => {
  try {
    const userId = req.user.uid || req.user.id;
    
    console.log('checkHospitalAdmin - User ID:', userId);
    console.log('checkHospitalAdmin - User role:', req.user.role);
    console.log('checkHospitalAdmin - User hospitalId:', req.user.hospitalId);

    // User is already authenticated and has hospitalId from token
    // Just verify the role
    const validRoles = ['hospital_admin', 'hospital_sub_admin', 'admin'];
    
    if (!validRoles.includes(req.user.role)) {
      console.log('Invalid role:', req.user.role);
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied. Hospital admin role required.' 
      });
    }

    // Get hospital ID from token (already set by authenticateToken)
    const hospitalId = req.user.hospitalId;
    if (!hospitalId) {
      console.log('No hospital ID found');
      return res.status(403).json({ 
        success: false, 
        error: 'No hospital assigned to this admin.' 
      });
    }

    // Add hospital info to request
    req.user.hospitalId = hospitalId;
    req.user.permissions = req.user.permissions || {};

    console.log('checkHospitalAdmin - Authorization successful');
    next();
  } catch (error) {
    console.error('Hospital admin check error:', error);
    res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

export const checkPermission = (permission) => {
  return (req, res, next) => {
    const userPermissions = req.user.permissions || {};
    
    // Hospital admin has all permissions
    if (req.user.role === 'hospital_admin' || req.user.role === 'admin') {
      return next();
    }
    
    // Check specific permission for sub admins
    if (userPermissions[permission]) {
      return next();
    }
    
    return res.status(403).json({ 
      success: false, 
      error: `Permission denied. ${permission} access required.` 
    });
  };
};

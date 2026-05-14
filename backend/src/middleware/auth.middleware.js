import jwt from 'jsonwebtoken';
import { db } from '../../utils/firebase.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    
    console.log('🔐 Auth middleware - Start');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.log('❌ No authorization header');
      return res.status(401).json({ success: false, error: 'Authorization header missing' });
    }

    // Extract token - handle both "Bearer token" and just "token"
    let token = authHeader;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }

    console.log('Token extracted:', token ? `${token.substring(0, 20)}...` : 'empty');

    if (!token || token.trim() === '') {
      console.log('❌ Empty token');
      return res.status(401).json({ success: false, error: 'Access token required' });
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      console.error('❌ JWT_ACCESS_SECRET not configured');
      return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      console.log('✅ Token verified. Payload:', { 
        id: decoded.id, 
        uid: decoded.uid, 
        role: decoded.role, 
        hospitalId: decoded.hospitalId 
      });
    } catch (jwtError) {
      console.error('❌ JWT verification error:', jwtError.message);
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, error: 'Token expired' });
      }
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, error: 'Invalid token format' });
      }
      throw jwtError;
    }

    // Support both 'uid' and 'id' fields in token
    const userId = decoded.uid || decoded.id;
    if (!userId) {
      console.error('❌ No user ID in token');
      return res.status(401).json({ success: false, error: 'Invalid token payload' });
    }

    console.log('🔍 Looking up user:', userId);

    // For hospital admins, they are in hospitalAdmins collection
    // For regular users, they are in users collection
    let userDoc;
    let userData;

    // Check if super admin first
    if (decoded.role === 'super_admin' || decoded.role === 'SUPER_ADMIN') {
      userDoc = await db().collection('users').doc(userId).get();
      if (userDoc.exists) {
        userData = userDoc.data();
        console.log('✅ Super admin found');
        req.user = {
          uid: userDoc.id,
          id: userDoc.id,
          email: userData.email,
          role: 'super_admin',
          hospitalId: decoded.hospitalId || userData.hospitalId,
          permissions: { '*': true }, // Full permissions
          ...userData
        };
        console.log('✅ Super admin authentication successful');
        return next();
      }
    }

    // Try hospitalAdmins collection first (for hospital admins)
    userDoc = await db().collection('hospitalAdmins').doc(userId).get();
    if (userDoc.exists) {
      userData = userDoc.data();
      console.log('✅ User found in hospitalAdmins collection');
      console.log('User data:', { 
        id: userDoc.id, 
        email: userData.email, 
        role: userData.role || 'admin',
        status: userData.status,
        hospitalId: userData.hospitalId 
      });
    } else {
      // Try users collection (for staff/patients)
      console.log('🔍 User not found in hospitalAdmins, checking users collection');
      userDoc = await db().collection('users').doc(userId).get();
      if (userDoc.exists) {
        userData = userDoc.data();
        console.log('✅ User found in users collection');
        console.log('User data:', { 
          id: userDoc.id, 
          email: userData.email, 
          role: userData.role,
          isActive: userData.isActive,
          hospitalId: userData.hospitalId 
        });
      }
    }
    
    if (!userData) {
      console.error('❌ User not found in any collection:', userId);
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    // Check if user is active (super admin bypasses this check)
    const isSuperAdmin = userData.role === 'super_admin' || userData.role === 'SUPER_ADMIN';
    const isActive = isSuperAdmin || userData.isActive !== false && userData.status !== 'inactive';
    if (!isActive) {
      console.warn('❌ User is inactive:', userId);
      return res.status(403).json({ success: false, error: 'User account is inactive' });
    }

    // Set user data on request
    req.user = {
      uid: userDoc.id,
      id: userDoc.id,
      email: userData.email,
      role: userData.role || 'admin', // Default to 'admin' for hospital admins
      hospitalId: decoded.hospitalId || userData.hospitalId,
      permissions: userData.permissions || {},
      ...userData
    };

    console.log('✅ Authentication successful for user:', req.user.uid);
    console.log('Final user object:', {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      hospitalId: req.user.hospitalId
    });

    next();
  } catch (error) {
    console.error('❌ Authentication error:', error);
    return res.status(403).json({ success: false, error: 'Authentication failed' });
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
    // Super admin has access to everything
    if (req.user.role === 'super_admin' || req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
    }
    next();
  };
};
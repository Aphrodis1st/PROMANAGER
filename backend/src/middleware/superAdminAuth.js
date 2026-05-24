import jwt from 'jsonwebtoken';
import { db } from '../../utils/firebase.js';
import { isSuperAdminUser } from '../services/platformRoleSeed.service.js';

export const superAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ success: false, error: 'Access denied. No authorization header.' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Access denied. Invalid authorization format.' });
    }
    
    const token = authHeader.replace('Bearer ', '').trim();
    
    if (!token || token === 'null' || token === 'undefined' || token === '') {
      return res.status(401).json({ success: false, error: 'Access denied. No token provided.' });
    }

    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      return res.status(400).json({ success: false, error: 'Invalid token format.' });
    }

    if (!process.env.JWT_ACCESS_SECRET) {
      return res.status(500).json({ success: false, error: 'Server configuration error.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    if (!decoded.id) {
      return res.status(400).json({ success: false, error: 'Invalid token payload.' });
    }
    
    const userDoc = await db().collection('users').doc(decoded.id).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ success: false, error: 'User not found.' });
    }
    
    const user = userDoc.data();

    if (!isSuperAdminUser({ ...user, id: decoded.id })) {
      return res.status(403).json({ success: false, error: 'Access denied. Super admin role required.' });
    }

    req.user = { id: decoded.id, ...user };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ success: false, error: 'Invalid or malformed token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired.' });
    }
    console.error('Super Admin Auth Error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed.' });
  }
};
import jwt from 'jsonwebtoken';
import { db } from '../../utils/firebase.js';

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

    // Validate token format (JWT should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format. Token parts:', tokenParts.length, 'Token:', token.substring(0, 20) + '...');
      return res.status(400).json({ success: false, error: 'Invalid token format.' });
    }

    // Check if JWT_ACCESS_SECRET is available
    if (!process.env.JWT_ACCESS_SECRET) {
      console.error('JWT_ACCESS_SECRET not found in environment variables');
      return res.status(500).json({ success: false, error: 'Server configuration error.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Check if decoded token has required fields
    if (!decoded.id) {
      return res.status(400).json({ success: false, error: 'Invalid token payload.' });
    }
    
    // Check if user is super admin
    const userDoc = await db().collection('users').doc(decoded.id).get();
    
    if (!userDoc.exists) {
      return res.status(403).json({ success: false, error: 'User not found.' });
    }
    
    const user = userDoc.data();
    
    if (!user || user.role !== 'super_admin') {
      return res.status(403).json({ success: false, error: 'Access denied. Super admin role required.' });
    }

    req.user = { id: decoded.id, ...user };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      console.error('JWT Error:', error.message, 'Token received:', req.header('Authorization')?.substring(0, 30) + '...');
      return res.status(400).json({ success: false, error: 'Invalid or malformed token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, error: 'Token expired.' });
    }
    console.error('Super Admin Auth Error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed.' });
  }
};
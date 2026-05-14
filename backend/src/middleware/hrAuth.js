import jwt from 'jsonwebtoken';

export const hrAuth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token)
      return res.status(401).json({ success: false, error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    // Super admin has full access to HR
    if (decoded.role === 'super_admin' || decoded.role === 'SUPER_ADMIN') {
      req.adminId = decoded.id;
      req.userId = decoded.id;
      req.organizationId = decoded.organizationId;
      req.role = decoded.role;
      req.userType = decoded.userType || 'super_admin';
      return next();
    }
    
    if (decoded.role !== 'hr_admin' && decoded.role !== 'hr_user')
      return res.status(403).json({ success: false, error: 'HR access required' });

    req.adminId = decoded.id;
    req.userId = decoded.id;
    req.organizationId = decoded.organizationId;
    req.role = decoded.role;
    req.userType = decoded.userType;
    
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const requireHRAdmin = (req, res, next) => {
  // Super admin bypasses HR admin requirement
  if (req.role === 'super_admin' || req.role === 'SUPER_ADMIN') {
    return next();
  }
  if (req.role !== 'hr_admin') {
    return res.status(403).json({ success: false, error: 'HR admin role required' });
  }
  next();
};

export default hrAuth;

import jwt from 'jsonwebtoken';

export const hospitalAuth = (req, res, next) => {
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

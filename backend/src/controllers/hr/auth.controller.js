import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../../utils/firebase.js';
import { HROrganization } from '../../models/superAdmin/hrOrganization.model.js';
import { HRAdmin } from '../../models/superAdmin/hrAdmin.model.js';

export const hrLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('HR login attempt for:', email);
    
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required' });

    let user = null;
    let userType = null;
    let userDoc = null;

    // First, try to find in hrAdmins collection
    const adminSnapshot = await db().collection('hrAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!adminSnapshot.empty) {
      userDoc = adminSnapshot.docs[0];
      const userData = userDoc.data();
      user = { ...userData, id: userDoc.id };
      userType = 'admin';
      console.log('Found HR admin:', { id: user.id, email: user.email, organizationId: user.organizationId });
    } else {
      // If not found in hrAdmins, try users collection with HR role
      const userSnapshot = await db().collection('users')
        .where('email', '==', email)
        .where('role', '==', 'hr_user')
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        user = { ...userData, id: userDoc.id };
        userType = 'user';
        console.log('Found HR user:', { id: user.id, email: user.email, organizationId: user.organizationId });
      }
    }

    if (!user) {
      console.log('No HR admin or user found with email:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const userId = userDoc.id;
    if (!userId || userId.trim() === '') {
      console.error('Invalid user document ID:', userId);
      return res.status(500).json({ success: false, error: 'Invalid user data' });
    }

    user.id = userId;

    if (user.status !== 'active' && user.isActive !== true) {
      console.log('User account is not active:', user.status || user.isActive);
      return res.status(403).json({ success: false, error: 'Account is inactive' });
    }

    // Check if this is a partial password
    if (user.isPartialPassword) {
      console.log('User has partial password, checking credentials...');
      const userPassword = user.password || user.passwordHash;
      
      if (!userPassword) {
        console.log('No password found for partial password user:', user.id);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      
      const valid = await bcrypt.compare(password, userPassword);
      if (!valid) {
        console.log('Invalid partial password for user:', user.id);
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      
      console.log('Partial password valid, generating partial token...');
      const partialToken = jwt.sign(
        { id: userDoc.id, organizationId: user.organizationId, type: 'partial', userType },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
      );
      
      console.log('Returning partial password response');
      return res.json({
        success: false,
        requiresPasswordCompletion: true,
        partialToken,
        message: 'Please complete your password setup'
      });
    }

    console.log('Regular password login, checking credentials...');
    const userPassword = user.password || user.passwordHash;
    
    if (!userPassword) {
      console.log('No password found for user:', user.id, 'userType:', userType);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    let valid = false;
    try {
      valid = await bcrypt.compare(password, userPassword);
    } catch (error) {
      console.log('Bcrypt compare failed:', error.message);
      valid = password === userPassword;
    }
    
    if (!valid) {
      console.log('Invalid password for user:', user.id);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Validate organizationId
    if (!user.organizationId || user.organizationId.trim() === '') {
      console.log('User has no valid organizationId:', user.id);
      return res.status(400).json({ success: false, error: 'User has no organizationId assigned' });
    }

    console.log('Fetching organization with ID:', user.organizationId);
    const organization = await HROrganization.getById(user.organizationId);
    if (!organization) {
      console.log('Organization not found with ID:', user.organizationId);
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    
    if (organization.status === 'suspended' || organization.status === 'deleted')
      return res.status(403).json({ success: false, error: `Organization is ${organization.status}` });

    // Update lastLogin
    if (userId && userId.trim() !== '') {
      const collection = userType === 'admin' ? 'hrAdmins' : 'users';
      await db().collection(collection).doc(userId).update({ lastLogin: new Date() });
    }

    const tokenRole = userType === 'admin' ? 'hr_admin' : user.role;

    const token = jwt.sign(
      { id: userId, organizationId: organization.id, role: tokenRole, userType },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '8h' }
    );

    const { password: _, ...userResponse } = user;
    userResponse.role = tokenRole;
    userResponse.id = userId;
    userResponse.userType = userType;
    
    console.log('Login successful for user:', userId, 'type:', userType);
    res.json({
      success: true,
      token,
      admin: userResponse,
      user: userResponse,
      organization: { id: organization.id, name: organization.name, location: organization.location }
    });
  } catch (error) {
    console.error('HR login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const completePassword = async (req, res) => {
  try {
    const { partialToken, newPassword } = req.body;
    
    if (!partialToken || !newPassword) {
      return res.status(400).json({ success: false, error: 'Partial token and new password required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(partialToken, process.env.JWT_ACCESS_SECRET);
      if (decoded.type !== 'partial') {
        return res.status(401).json({ success: false, error: 'Invalid token type' });
      }
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    const collection = decoded.userType === 'admin' ? 'hrAdmins' : 'users';
    
    const userDoc = await db().collection(collection).doc(decoded.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const user = { id: userDoc.id, ...userDoc.data() };
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db().collection(collection).doc(decoded.id).update({
      password: hashedPassword,
      isPartialPassword: false,
      passwordCompletedAt: new Date(),
      lastLogin: new Date(),
      updatedAt: new Date()
    });
    
    const organization = await HROrganization.getById(user.organizationId);
    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    
    const tokenRole = decoded.userType === 'admin' ? 'hr_admin' : user.role;
    
    const token = jwt.sign(
      { id: decoded.id, organizationId: organization.id, role: tokenRole, userType: decoded.userType },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '8h' }
    );
    
    const { password: _, isPartialPassword, ...userResponse } = user;
    userResponse.role = tokenRole;
    userResponse.id = decoded.id;
    userResponse.userType = decoded.userType;
    
    res.json({
      success: true,
      token,
      admin: userResponse,
      user: userResponse,
      organization: { id: organization.id, name: organization.name, location: organization.location },
      message: 'Password completed successfully'
    });
  } catch (error) {
    console.error('Complete password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHRMe = async (req, res) => {
  try {
    const organization = await HROrganization.getById(req.organizationId);
    if (!organization) {
      return res.status(404).json({ success: false, error: 'Organization not found' });
    }
    res.json({ success: true, organization });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, position } = req.body;
    const adminId = req.adminId;

    await db().collection('hrAdmins').doc(adminId).update({
      firstName,
      lastName,
      phone,
      position,
      updatedAt: new Date()
    });

    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.adminId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long' });
    }

    const adminDoc = await db().collection('hrAdmins').doc(adminId).get();
    if (!adminDoc.exists) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    const admin = adminDoc.data();

    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await db().collection('hrAdmins').doc(adminId).update({
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ success: false, error: 'Failed to change password' });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const analytics = {
      totalEmployees: 150,
      employeesGrowth: 10,
      presentToday: 142,
      onLeave: 8,
      lateCheckIns: 5,
      payrollThisMonth: 450000,
      pendingLeaveRequests: 12,
      expiringContracts: 3,
      departmentStats: [
        { name: 'Engineering', employees: 45 },
        { name: 'Sales', employees: 30 },
        { name: 'Marketing', employees: 25 },
        { name: 'HR', employees: 10 }
      ],
      alerts: [
        { type: 'warning', message: '3 contracts expiring this month', time: '2 hours ago' },
        { type: 'info', message: '12 pending leave requests', time: '1 day ago' }
      ]
    };

    res.json({ success: true, data: analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch analytics' });
  }
};

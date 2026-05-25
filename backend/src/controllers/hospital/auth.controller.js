import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../../utils/firebase.js';
import { Hospital } from '../../models/superAdmin/hospital.model.js';
import { HospitalAdmin } from '../../models/superAdmin/hospitalAdmin.model.js';
import { isCredentialExpired, credentialExpiryMessage } from '../../utils/credentialExpiry.js';

export const hospitalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Hospital login attempt for:', email);
    console.log('Password provided:', password ? 'Yes' : 'No');
    
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required' });

    // Check for superadmin credentials
    if (email === 'superadmin@madsmart.com' && password === 'SuperAdmin123!') {
      const superAdminDoc = await db().collection('users').where('email', '==', email).limit(1).get();
      if (!superAdminDoc.empty) {
        const userDoc = superAdminDoc.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() };
        const token = jwt.sign(
          { id: user.id, role: 'super_admin', userType: 'superadmin' },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '8h' }
        );
        await db().collection('users').doc(user.id).update({ lastLogin: new Date() });
        console.log('Superadmin login successful for hospital service');
        return res.json({
          success: true,
          token,
          user: { ...user, role: 'super_admin', userType: 'superadmin' },
          admin: { ...user, role: 'super_admin', userType: 'superadmin' },
          hospital: { id: 'all', name: 'All Hospitals', location: 'Global' }
        });
      }
    }

    let user = null;
    let userType = null;
    let userDoc = null;

    // First, try to find in hospitalAdmins collection
    const adminSnapshot = await db().collection('hospitalAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (!adminSnapshot.empty) {
      userDoc = adminSnapshot.docs[0];
      const userData = userDoc.data();
      user = { ...userData, id: userDoc.id }; // Ensure document ID overwrites any id in data
      userType = 'admin';
      console.log('Found hospital admin:', { id: user.id, email: user.email, hospitalId: user.hospitalId, isPartialPassword: user.isPartialPassword });
    } else {
      // If not found in hospitalAdmins, try users collection
      const userSnapshot = await db().collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        user = { ...userData, id: userDoc.id }; // Ensure document ID overwrites any id in data
        userType = 'user';
        console.log('Found hospital user:', { id: user.id, email: user.email, role: user.role, hospitalId: user.hospitalId, isPartialPassword: user.isPartialPassword });
      }
    }

    if (!user) {
      console.log('No hospital admin or user found with email:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Clean up user ID if needed - ensure we use the document ID
    const userId = userDoc.id;
    if (!userId || userId.trim() === '') {
      console.error('Invalid user document ID:', userId);
      return res.status(500).json({ success: false, error: 'Invalid user data' });
    }

    // Ensure user object has the correct ID
    user.id = userId;

    console.log('Checking user status and role:', { role: user.role, status: user.status, isActive: user.isActive });

    // Check if this is super admin - they can have any status
    const isSuperAdmin = user.role === 'super_admin' || user.role === 'SUPER_ADMIN';
    console.log('Is super admin?', isSuperAdmin);
    
    if (!isSuperAdmin && user.status !== 'active' && user.isActive !== true) {
      console.log('User account is not active:', user.status || user.isActive);
      return res.status(403).json({ success: false, error: 'Account is inactive' });
    }
    
    console.log('Status check passed for user:', userId);

    if (isCredentialExpired(user)) {
      return res.status(403).json({ success: false, error: credentialExpiryMessage() });
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
      // Generate partial token for password completion
      const partialToken = jwt.sign(
        { id: userDoc.id, hospitalId: user.hospitalId, type: 'partial', userType },
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
    // Check password - try both 'password' and 'passwordHash' fields
    const userPassword = user.password || user.passwordHash;
    
    if (!userPassword) {
      console.log('No password found for user:', user.id, 'userType:', userType);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    console.log('Password field found, length:', userPassword?.length, 'starts with:', userPassword?.substring(0, 4));
    
    let valid = false;
    try {
      valid = await bcrypt.compare(password, userPassword);
    } catch (error) {
      console.log('Bcrypt compare failed, trying plain text:', error.message);
      valid = password === userPassword;
    }
    
    if (!valid) {
      console.log('Invalid password for user:', user.id);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Validate hospitalId
    if (!user.hospitalId || user.hospitalId.trim() === '') {
      console.log('User has no valid hospitalId:', user.id, 'hospitalId:', user.hospitalId);
      return res.status(400).json({ success: false, error: 'User has no hospitalId assigned', userId: user.id });
    }

    console.log('Fetching hospital with ID:', user.hospitalId);
    const hospital = await Hospital.getById(user.hospitalId);
    if (!hospital) {
      console.log('Hospital not found with ID:', user.hospitalId);
      return res.status(404).json({ success: false, error: 'Hospital not found', hospitalId: user.hospitalId });
    }
    
    if (hospital.status === 'suspended' || hospital.status === 'deleted')
      return res.status(403).json({ success: false, error: `Hospital is ${hospital.status}` });

    // Update lastLogin
    if (userId && userId.trim() !== '') {
      const collection = userType === 'admin' ? 'hospitalAdmins' : 'users';
      await db().collection(collection).doc(userId).update({ lastLogin: new Date() });
    }

    // Determine user role for token
    const tokenRole = userType === 'admin' ? 'hospital_admin' : user.role;

    const token = jwt.sign(
      { id: userId, hospitalId: hospital.id, role: tokenRole, userType },
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
      admin: userResponse, // Keep 'admin' for backward compatibility
      user: userResponse,
      hospital: { id: hospital.id, name: hospital.name, location: hospital.location, subscriptionPlan: hospital.subscriptionPlan }
    });
  } catch (error) {
    console.error('Hospital login error:', error);
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
    
    // Verify partial token
    let decoded;
    try {
      decoded = jwt.verify(partialToken, process.env.JWT_ACCESS_SECRET);
      if (decoded.type !== 'partial') {
        return res.status(401).json({ success: false, error: 'Invalid token type' });
      }
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    // Determine which collection to use
    const collection = decoded.userType === 'admin' ? 'hospitalAdmins' : 'users';
    
    // Get user
    const userDoc = await db().collection(collection).doc(decoded.id).get();
    if (!userDoc.exists) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const user = { id: userDoc.id, ...userDoc.data() };
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user with new password and remove partial flag
    await db().collection(collection).doc(decoded.id).update({
      password: hashedPassword,
      isPartialPassword: false,
      passwordCompletedAt: new Date(),
      lastLogin: new Date(),
      updatedAt: new Date()
    });
    
    // Get hospital
    const hospital = await Hospital.getById(user.hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    
    // Determine user role for token
    const tokenRole = decoded.userType === 'admin' ? 'hospital_admin' : user.role;
    
    // Generate full access token
    const token = jwt.sign(
      { id: decoded.id, hospitalId: hospital.id, role: tokenRole, userType: decoded.userType },
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
      admin: userResponse, // Keep 'admin' for backward compatibility
      user: userResponse,
      hospital: { id: hospital.id, name: hospital.name, location: hospital.location, subscriptionPlan: hospital.subscriptionPlan },
      message: 'Password completed successfully'
    });
  } catch (error) {
    console.error('Complete password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getHospitalMe = async (req, res) => {
  try {
    const hospital = await Hospital.getById(req.hospitalId);
    if (!hospital) {
      return res.status(404).json({ success: false, error: 'Hospital not found' });
    }
    res.json({ success: true, hospital });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, position } = req.body;
    const adminId = req.adminId;

    await db().collection('hospitalAdmins').doc(adminId).update({
      firstName,
      lastName,
      phone,
      position,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update profile' 
    });
  }
};

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.adminId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters long'
      });
    }

    // Get current admin
    const adminDoc = await db().collection('hospitalAdmins').doc(adminId).get();
    if (!adminDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found'
      });
    }

    const admin = adminDoc.data();

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db().collection('hospitalAdmins').doc(adminId).update({
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to change password' 
    });
  }
};

export const updateHospitalSettings = async (req, res) => {
  try {
    const settings = req.body;
    const hospitalId = req.hospitalId;

    await db().collection('hospitals').doc(hospitalId).update({
      settings,
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    console.error('Update hospital settings error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update settings' 
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    const hospitalId = req.hospitalId;

    // Mock analytics data - replace with real queries
    const analytics = {
      totalPatients: 1250,
      patientsGrowth: 12,
      totalAppointments: 450,
      appointmentsGrowth: 8,
      totalRevenue: 125000,
      revenueGrowth: 15,
      bedOccupancy: 78,
      activeDoctors: 25,
      activeNurses: 45,
      supportStaff: 30,
      completedAppointments: 380,
      cancelledAppointments: 45,
      pendingAppointments: 25,
      departmentStats: [
        { name: 'Emergency', patients: 150 },
        { name: 'Cardiology', patients: 120 },
        { name: 'Pediatrics', patients: 100 },
        { name: 'Orthopedics', patients: 80 }
      ],
      alerts: [
        { type: 'warning', message: 'Low inventory in pharmacy', time: '2 hours ago' },
        { type: 'info', message: 'System maintenance scheduled', time: '1 day ago' }
      ],
      recentActivity: [
        { action: 'New patient registered', user: 'Dr. Smith', time: '5 minutes ago' },
        { action: 'Appointment scheduled', user: 'Nurse Johnson', time: '15 minutes ago' },
        { action: 'Lab results updated', user: 'Lab Tech', time: '30 minutes ago' }
      ]
    };

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch analytics' 
    });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email and new password required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, error: 'Password must be at least 8 characters' });
    }
    
    // Find user
    const userSnapshot = await db().collection('users').where('email', '==', email).limit(1).get();
    
    if (userSnapshot.empty) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    const userDoc = userSnapshot.docs[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db().collection('users').doc(userDoc.id).update({
      password: hashedPassword,
      isPartialPassword: false,
      updatedAt: new Date()
    });
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

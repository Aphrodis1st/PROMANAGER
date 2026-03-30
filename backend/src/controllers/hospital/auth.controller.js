import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../../../utils/firebase.js';
import { Hospital } from '../../models/superAdmin/hospital.model.js';
import { HospitalAdmin } from '../../models/superAdmin/hospitalAdmin.model.js';

export const hospitalLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Hospital login attempt for:', email);
    
    if (!email || !password)
      return res.status(400).json({ success: false, error: 'Email and password required' });

    // Find admin by email
    const snapshot = await db().collection('hospitalAdmins')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log('No hospital admin found with email:', email);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const adminDoc = snapshot.docs[0];
    const adminData = adminDoc.data();
    // Use document ID as the admin ID
    const admin = { id: adminDoc.id, ...adminData };
    // Remove any null id field from the data
    if (admin.id && adminData.id === null) {
      delete admin.id;
      admin.id = adminDoc.id;
    }
    
    console.log('Admin document ID:', adminDoc.id);
    console.log('Admin data:', adminData);
    console.log('Found admin:', { id: admin.id, email: admin.email, hospitalId: admin.hospitalId });

    if (admin.status !== 'active')
      return res.status(403).json({ success: false, error: 'Account is inactive' });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      console.log('Invalid password for admin:', admin.id);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Validate hospitalId
    if (!admin.hospitalId || admin.hospitalId.trim() === '') {
      console.log('Admin has no valid hospitalId:', admin.id, 'hospitalId:', admin.hospitalId);
      return res.status(400).json({ success: false, error: 'Admin has no hospitalId assigned', adminId: admin.id });
    }

    console.log('Fetching hospital with ID:', admin.hospitalId);
    const hospital = await Hospital.getById(admin.hospitalId);
    if (!hospital) {
      console.log('Hospital not found with ID:', admin.hospitalId);
      return res.status(404).json({ success: false, error: 'Hospital not found', hospitalId: admin.hospitalId });
    }
    
    if (hospital.status === 'suspended' || hospital.status === 'deleted')
      return res.status(403).json({ success: false, error: `Hospital is ${hospital.status}` });

    // Update lastLogin (use document ID)
    if (adminDoc.id && adminDoc.id.trim() !== '') {
      await db().collection('hospitalAdmins').doc(adminDoc.id).update({ lastLogin: new Date() });
    } else {
      console.warn('Skipping lastLogin update - invalid admin document ID:', adminDoc.id);
    }

    const token = jwt.sign(
      { id: adminDoc.id, hospitalId: hospital.id, role: 'hospital_admin' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '8h' }
    );

    const { password: _, ...adminResponse } = admin;
    // Override role to hospital_admin for frontend and ensure ID is document ID
    adminResponse.role = 'hospital_admin';
    adminResponse.id = adminDoc.id;
    console.log('Login successful for admin:', adminDoc.id);
    res.json({
      success: true,
      token,
      admin: adminResponse,
      hospital: { id: hospital.id, name: hospital.name, location: hospital.location, subscriptionPlan: hospital.subscriptionPlan }
    });
  } catch (error) {
    console.error('Hospital login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getHospitalMe = async (req, res) => {
  try {
    const hospital = await Hospital.getById(req.hospitalId);
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
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

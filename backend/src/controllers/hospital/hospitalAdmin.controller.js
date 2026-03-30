import { db } from '../../../utils/firebase.js';
import bcrypt from 'bcryptjs';

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    
    // Get counts for dashboard
    const [users, departments, patients, appointments] = await Promise.all([
      db().collection('users').where('hospitalId', '==', hospitalId).get(),
      db().collection('departments').where('hospitalId', '==', hospitalId).get(),
      db().collection('patients').where('hospitalId', '==', hospitalId).get(),
      db().collection('appointments').where('hospitalId', '==', hospitalId).get()
    ]);

    const stats = {
      totalUsers: users.size,
      totalDepartments: departments.size,
      totalPatients: patients.size,
      totalAppointments: appointments.size,
      usersByRole: {},
      recentActivity: []
    };

    // Count users by role
    users.forEach(doc => {
      const role = doc.data().role;
      stats.usersByRole[role] = (stats.usersByRole[role] || 0) + 1;
    });

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// User Management
export const getUserManagement = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const usersSnapshot = await db().collection('users')
      .where('hospitalId', '==', hospitalId)
      .get();

    const users = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      delete userData.password; // Remove password from response
      users.push({ id: doc.id, ...userData });
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const { email, password, firstName, lastName, role, departmentId, phone, isPartialPassword, ...otherData } = req.body;

    // Validate role
    const allowedRoles = ['doctor', 'nurse', 'lab_technician', 'pharmacist', 'receptionist', 'patient'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await db().collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      hospitalId,
      departmentId: departmentId || null,
      phone: phone || null,
      isActive: true,
      isPartialPassword: isPartialPassword || false,
      requirePasswordChange: isPartialPassword || false,
      createdAt: new Date(),
      createdBy: req.user.uid,
      ...otherData
    };

    const userRef = await db().collection('users').add(userData);
    
    // If patient, also create patient record
    if (role === 'patient') {
      await db().collection('patients').add({
        userId: userRef.id,
        hospitalId,
        firstName,
        lastName,
        email,
        phone,
        createdAt: new Date()
      });
    }

    // Remove password from response
    delete userData.password;
    res.json({ success: true, data: { id: userRef.id, ...userData } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const hospitalId = req.user.hospitalId;
    const updates = req.body;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Remove sensitive fields from updates
    delete updates.password;
    delete updates.hospitalId;
    
    updates.updatedAt = new Date();
    updates.updatedBy = req.user.uid;

    await db().collection('users').doc(userId).update(updates);
    res.json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const hospitalId = req.user.hospitalId;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await db().collection('users').doc(userId).delete();
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, permissions } = req.body;
    const hospitalId = req.user.hospitalId;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await db().collection('users').doc(userId).update({
      role,
      permissions: permissions || {},
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    res.json({ success: true, message: 'Role assigned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Department Management
export const getDepartmentManagement = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const deptSnapshot = await db().collection('departments')
      .where('hospitalId', '==', hospitalId)
      .get();

    const departments = [];
    for (const doc of deptSnapshot.docs) {
      const deptData = doc.data();
      
      // Get staff count for each department
      const staffSnapshot = await db().collection('users')
        .where('hospitalId', '==', hospitalId)
        .where('departmentId', '==', doc.id)
        .get();

      departments.push({
        id: doc.id,
        ...deptData,
        staffCount: staffSnapshot.size
      });
    }

    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const { name, description, headOfDepartment } = req.body;

    const deptData = {
      name,
      description,
      headOfDepartment: headOfDepartment || null,
      hospitalId,
      isActive: true,
      createdAt: new Date(),
      createdBy: req.user.uid
    };

    const deptRef = await db().collection('departments').add(deptData);
    res.json({ success: true, data: { id: deptRef.id, ...deptData } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const hospitalId = req.user.hospitalId;
    const updates = req.body;

    // Verify department belongs to hospital
    const deptDoc = await db().collection('departments').doc(deptId).get();
    if (!deptDoc.exists || deptDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    updates.updatedAt = new Date();
    updates.updatedBy = req.user.uid;

    await db().collection('departments').doc(deptId).update(updates);
    res.json({ success: true, message: 'Department updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const hospitalId = req.user.hospitalId;

    // Verify department belongs to hospital
    const deptDoc = await db().collection('departments').doc(deptId).get();
    if (!deptDoc.exists || deptDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    await db().collection('departments').doc(deptId).delete();
    res.json({ success: true, message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Staff Management
export const getStaffManagement = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const staffSnapshot = await db().collection('users')
      .where('hospitalId', '==', hospitalId)
      .where('role', 'in', ['doctor', 'nurse', 'lab_technician', 'pharmacist', 'receptionist'])
      .get();

    const staff = [];
    for (const doc of staffSnapshot.docs) {
      const staffData = doc.data();
      delete staffData.password;
      
      // Get department info if assigned
      let department = null;
      if (staffData.departmentId) {
        const deptDoc = await db().collection('departments').doc(staffData.departmentId).get();
        if (deptDoc.exists) {
          department = { id: deptDoc.id, name: deptDoc.data().name };
        }
      }

      staff.push({
        id: doc.id,
        ...staffData,
        department
      });
    }

    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const assignStaffToDepartment = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { departmentId } = req.body;
    const hospitalId = req.user.hospitalId;

    // Verify staff belongs to hospital
    const staffDoc = await db().collection('users').doc(staffId).get();
    if (!staffDoc.exists || staffDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'Staff not found' });
    }

    await db().collection('users').doc(staffId).update({
      departmentId,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    res.json({ success: true, message: 'Staff assigned to department successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Patient Management
export const getPatientManagement = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const patientsSnapshot = await db().collection('patients')
      .where('hospitalId', '==', hospitalId)
      .get();

    const patients = [];
    patientsSnapshot.forEach(doc => {
      patients.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Appointment System
export const getAppointmentSystem = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const appointmentsSnapshot = await db().collection('appointments')
      .where('hospitalId', '==', hospitalId)
      .orderBy('appointmentDate', 'desc')
      .limit(100)
      .get();

    const appointments = [];
    appointmentsSnapshot.forEach(doc => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Sub Admin Management
export const createSubAdmin = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const { email, password, firstName, lastName, permissions } = req.body;

    // Check if user already exists
    const existingUser = await db().collection('users').where('email', '==', email).get();
    if (!existingUser.empty) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const subAdminData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'hospital_sub_admin',
      hospitalId,
      permissions: permissions || {
        userManagement: true,
        departmentManagement: true,
        staffManagement: true,
        patientManagement: true,
        appointmentManagement: true
      },
      isActive: true,
      createdAt: new Date(),
      createdBy: req.user.uid
    };

    const subAdminRef = await db().collection('users').add(subAdminData);
    delete subAdminData.password;

    res.json({ success: true, data: { id: subAdminRef.id, ...subAdminData } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Access Control
export const getAccessControl = async (req, res) => {
  try {
    const hospitalId = req.user.hospitalId;
    const usersSnapshot = await db().collection('users')
      .where('hospitalId', '==', hospitalId)
      .get();

    const accessControl = [];
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      accessControl.push({
        id: doc.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        permissions: userData.permissions || {},
        isActive: userData.isActive
      });
    });

    res.json({ success: true, data: accessControl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;
    const hospitalId = req.user.hospitalId;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await db().collection('users').doc(userId).update({
      permissions,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    res.json({ success: true, message: 'Permissions updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reset User Password
export const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    const hospitalId = req.user.hospitalId;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db().collection('users').doc(userId).update({
      password: hashedPassword,
      passwordResetAt: new Date(),
      passwordResetBy: req.user.uid
    });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Toggle User Access
export const toggleUserAccess = async (req, res) => {
  try {
    const { userId } = req.params;
    const hospitalId = req.user.hospitalId;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const currentStatus = userDoc.data().isActive;
    await db().collection('users').doc(userId).update({
      isActive: !currentStatus,
      accessToggledAt: new Date(),
      accessToggledBy: req.user.uid
    });

    res.json({ success: true, message: `User access ${!currentStatus ? 'enabled' : 'disabled'} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Assign Department Head
export const assignDepartmentHead = async (req, res) => {
  try {
    const { deptId } = req.params;
    const { userId } = req.body;
    const hospitalId = req.user.hospitalId;

    const deptDoc = await db().collection('departments').doc(deptId).get();
    if (!deptDoc.exists || deptDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    await db().collection('departments').doc(deptId).update({
      headOfDepartment: userId,
      headOfDepartmentName: `${userDoc.data().firstName} ${userDoc.data().lastName}`,
      updatedAt: new Date(),
      updatedBy: req.user.uid
    });

    await db().collection('users').doc(userId).update({
      isDepartmentHead: true,
      departmentHeadOf: deptId,
      updatedAt: new Date()
    });

    res.json({ success: true, message: 'Department head assigned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Professional Roles
export const getProfessionalRoles = async (req, res) => {
  try {
    const roles = [
      { value: 'doctor', label: 'Doctor', category: 'Clinical' },
      { value: 'specialist_doctor', label: 'Specialist Doctor', category: 'Clinical' },
      { value: 'surgeon', label: 'Surgeon', category: 'Clinical' },
      { value: 'nurse', label: 'Nurse', category: 'Clinical' },
      { value: 'senior_nurse', label: 'Senior Nurse', category: 'Clinical' },
      { value: 'lab_technician', label: 'Lab Technician', category: 'Technical' },
      { value: 'pharmacist', label: 'Pharmacist', category: 'Technical' },
      { value: 'radiologist', label: 'Radiologist', category: 'Technical' },
      { value: 'receptionist', label: 'Receptionist', category: 'Administrative' },
      { value: 'admin', label: 'Administrator', category: 'Administrative' },
      { value: 'department_head', label: 'Department Head', category: 'Management' },
      { value: 'hospital_manager', label: 'Hospital Manager', category: 'Management' },
      { value: 'patient', label: 'Patient', category: 'Patient' }
    ];
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get Staff by Department
export const getStaffByDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const hospitalId = req.user.hospitalId;

    const deptDoc = await db().collection('departments').doc(deptId).get();
    if (!deptDoc.exists || deptDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'Department not found' });
    }

    const staffSnapshot = await db().collection('users')
      .where('hospitalId', '==', hospitalId)
      .where('departmentId', '==', deptId)
      .get();

    const staff = [];
    staffSnapshot.forEach(doc => {
      const staffData = doc.data();
      delete staffData.password;
      staff.push({ id: doc.id, ...staffData });
    });

    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Bulk Update User Status
export const bulkUpdateUserStatus = async (req, res) => {
  try {
    const { userIds, status } = req.body;
    const hospitalId = req.user.hospitalId;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid user IDs' });
    }

    const batch = db().batch();
    const updateData = {
      isActive: status === 'active',
      updatedAt: new Date(),
      updatedBy: req.user.uid
    };

    for (const userId of userIds) {
      const userRef = db().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists && userDoc.data().hospitalId === hospitalId) {
        batch.update(userRef, updateData);
      }
    }

    await batch.commit();
    res.json({ success: true, message: `${userIds.length} users updated successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Set Partial Password
export const setPartialPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { partialPassword, requirePasswordChange } = req.body;
    const hospitalId = req.user.hospitalId;

    // Verify user belongs to hospital
    const userDoc = await db().collection('users').doc(userId).get();
    if (!userDoc.exists || userDoc.data().hospitalId !== hospitalId) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Hash partial password
    const hashedPassword = await bcrypt.hash(partialPassword, 10);

    await db().collection('users').doc(userId).update({
      password: hashedPassword,
      isPartialPassword: true,
      requirePasswordChange: requirePasswordChange !== false,
      partialPasswordSetAt: new Date(),
      partialPasswordSetBy: req.user.uid
    });

    res.json({ success: true, message: 'Partial password set successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// Bulk Delete Users
export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    const hospitalId = req.user.hospitalId;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid user IDs' });
    }

    const batch = db().batch();

    for (const userId of userIds) {
      const userRef = db().collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (userDoc.exists && userDoc.data().hospitalId === hospitalId) {
        batch.delete(userRef);
      }
    }

    await batch.commit();
    res.json({ success: true, message: `${userIds.length} users deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
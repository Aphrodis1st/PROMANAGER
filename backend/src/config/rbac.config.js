// Role-Based Access Control Configuration for Hospital Management System

export const HOSPITAL_ROLES = {
  // Administrative Roles
  HOSPITAL_ADMIN: {
    key: 'hospital_admin',
    name: 'Hospital Administrator',
    level: 10,
    description: 'Full system access and management',
    canAccessAllDepartments: true,
    defaultPermissions: ['*'] // All permissions
  },
  
  ADMIN: {
    key: 'admin',
    name: 'System Administrator',
    level: 9,
    description: 'System-wide administrative access',
    canAccessAllDepartments: true,
    defaultPermissions: ['*']
  },
  
  // Medical Staff Roles
  DOCTOR: {
    key: 'doctor',
    name: 'Doctor',
    level: 8,
    description: 'Medical practitioner with patient care responsibilities',
    canAccessAllDepartments: false,
    defaultPermissions: [
      'viewPatients', 'editPatients', 'viewMedicalRecords', 'createMedicalRecords',
      'editMedicalRecords', 'viewPrescriptions', 'createPrescriptions', 'editPrescriptions',
      'viewLabTests', 'orderLabTests', 'viewLabResults', 'viewAppointments',
      'manageAppointments', 'scheduleAppointments', 'viewDiagnosis', 'createDiagnosis',
      'viewTreatmentPlans', 'createTreatmentPlans', 'editTreatmentPlans'
    ]
  },
  
  NURSE: {
    key: 'nurse',
    name: 'Nurse',
    level: 6,
    description: 'Nursing staff with patient care duties',
    canAccessAllDepartments: false,
    defaultPermissions: [
      'viewPatients', 'editPatients', 'viewMedicalRecords', 'viewPrescriptions',
      'viewLabTests', 'viewLabResults', 'viewAppointments', 'scheduleAppointments',
      'viewVitalSigns', 'recordVitalSigns', 'viewTreatmentPlans', 'viewAdmissions',
      'manageAdmissions'
    ]
  },
  
  // Specialized Staff Roles
  LAB_TECHNICIAN: {
    key: 'lab_technician',
    name: 'Lab Technician',
    level: 5,
    description: 'Laboratory testing and results management',
    canAccessAllDepartments: false,
    restrictedToDepartments: ['laboratory', 'pathology', 'radiology'],
    defaultPermissions: [
      'viewLabTests', 'processLabTests', 'viewLabResults', 'enterLabResults',
      'editLabResults', 'viewPatients', 'viewLabOrders', 'manageLabOrders',
      'viewLabReports', 'generateLabReports'
    ]
  },
  
  PHARMACIST: {
    key: 'pharmacist',
    name: 'Pharmacist',
    level: 5,
    description: 'Medication management and dispensing',
    canAccessAllDepartments: false,
    restrictedToDepartments: ['pharmacy'],
    defaultPermissions: [
      'viewPrescriptions', 'dispenseMedications', 'viewMedications', 'manageMedications',
      'viewInventory', 'manageInventory', 'viewPatients', 'viewDrugInteractions',
      'viewPharmacyReports', 'generatePharmacyReports'
    ]
  },
  
  RADIOLOGIST: {
    key: 'radiologist',
    name: 'Radiologist',
    level: 7,
    description: 'Medical imaging specialist',
    canAccessAllDepartments: false,
    restrictedToDepartments: ['radiology', 'imaging'],
    defaultPermissions: [
      'viewPatients', 'viewMedicalRecords', 'viewRadiologyOrders', 'processRadiologyOrders',
      'viewRadiologyResults', 'enterRadiologyResults', 'editRadiologyResults',
      'viewRadiologyReports', 'generateRadiologyReports'
    ]
  },
  
  // Support Staff Roles
  RECEPTIONIST: {
    key: 'receptionist',
    name: 'Receptionist',
    level: 3,
    description: 'Front desk and appointment management',
    canAccessAllDepartments: false,
    defaultPermissions: [
      'viewPatients', 'createPatients', 'editPatients', 'viewAppointments',
      'scheduleAppointments', 'manageAppointments', 'viewBasicBilling',
      'processPayments', 'viewInsurance'
    ]
  },
  
  BILLING_STAFF: {
    key: 'billing_staff',
    name: 'Billing Staff',
    level: 4,
    description: 'Financial and billing operations',
    canAccessAllDepartments: false,
    restrictedToDepartments: ['billing', 'finance'],
    defaultPermissions: [
      'viewBilling', 'manageBilling', 'createInvoices', 'editInvoices',
      'processPayments', 'viewInsurance', 'manageInsurance', 'viewFinancialReports',
      'generateFinancialReports', 'viewPatients'
    ]
  },
  
  // Patient Role
  PATIENT: {
    key: 'patient',
    name: 'Patient',
    level: 1,
    description: 'Hospital patient with limited access',
    canAccessAllDepartments: false,
    defaultPermissions: [
      'viewOwnMedicalRecords', 'viewOwnAppointments', 'scheduleOwnAppointments',
      'viewOwnPrescriptions', 'viewOwnLabResults', 'viewOwnBilling',
      'updateOwnProfile'
    ]
  }
};

// Department-based access rules
export const DEPARTMENT_ACCESS_RULES = {
  // Emergency Department
  emergency: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'receptionist'],
    restrictedOperations: {
      'discharge_patient': ['doctor'],
      'prescribe_controlled_substances': ['doctor'],
      'access_critical_care': ['doctor', 'nurse']
    }
  },
  
  // Intensive Care Unit
  icu: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'nurse'],
    restrictedOperations: {
      'ventilator_management': ['doctor', 'nurse'],
      'critical_medication': ['doctor'],
      'life_support_decisions': ['doctor']
    }
  },
  
  // Cardiology
  cardiology: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'lab_technician'],
    restrictedOperations: {
      'cardiac_procedures': ['doctor'],
      'ecg_interpretation': ['doctor'],
      'cardiac_medication': ['doctor']
    }
  },
  
  // Laboratory
  laboratory: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'lab_technician'],
    restrictedOperations: {
      'lab_result_approval': ['doctor', 'lab_technician'],
      'critical_value_notification': ['lab_technician'],
      'lab_equipment_calibration': ['lab_technician']
    }
  },
  
  // Pharmacy
  pharmacy: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'pharmacist'],
    restrictedOperations: {
      'dispense_medication': ['pharmacist'],
      'controlled_substances': ['pharmacist'],
      'drug_interaction_check': ['pharmacist']
    }
  },
  
  // Radiology
  radiology: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'radiologist', 'lab_technician'],
    restrictedOperations: {
      'interpret_images': ['doctor', 'radiologist'],
      'radiation_safety': ['radiologist'],
      'contrast_administration': ['doctor', 'radiologist']
    }
  },
  
  // Surgery
  surgery: {
    allowedRoles: ['hospital_admin', 'admin', 'doctor', 'nurse'],
    restrictedOperations: {
      'surgical_procedures': ['doctor'],
      'anesthesia_management': ['doctor'],
      'surgical_scheduling': ['doctor', 'nurse']
    }
  },
  
  // Billing
  billing: {
    allowedRoles: ['hospital_admin', 'admin', 'billing_staff', 'receptionist'],
    restrictedOperations: {
      'insurance_claims': ['billing_staff'],
      'payment_processing': ['billing_staff', 'receptionist'],
      'financial_reports': ['billing_staff']
    }
  }
};

// Feature-based permissions
export const PERMISSIONS = {
  // Patient Management
  viewPatients: { category: 'Patient Management', description: 'View patient information' },
  createPatients: { category: 'Patient Management', description: 'Create new patient records' },
  editPatients: { category: 'Patient Management', description: 'Edit patient information' },
  deletePatients: { category: 'Patient Management', description: 'Delete patient records' },
  
  // Medical Records
  viewMedicalRecords: { category: 'Medical Records', description: 'View medical records' },
  createMedicalRecords: { category: 'Medical Records', description: 'Create medical records' },
  editMedicalRecords: { category: 'Medical Records', description: 'Edit medical records' },
  deleteMedicalRecords: { category: 'Medical Records', description: 'Delete medical records' },
  
  // Prescriptions
  viewPrescriptions: { category: 'Prescriptions', description: 'View prescriptions' },
  createPrescriptions: { category: 'Prescriptions', description: 'Create prescriptions' },
  editPrescriptions: { category: 'Prescriptions', description: 'Edit prescriptions' },
  dispenseMedications: { category: 'Prescriptions', description: 'Dispense medications' },
  
  // Laboratory
  viewLabTests: { category: 'Laboratory', description: 'View lab tests' },
  orderLabTests: { category: 'Laboratory', description: 'Order lab tests' },
  processLabTests: { category: 'Laboratory', description: 'Process lab tests' },
  viewLabResults: { category: 'Laboratory', description: 'View lab results' },
  enterLabResults: { category: 'Laboratory', description: 'Enter lab results' },
  editLabResults: { category: 'Laboratory', description: 'Edit lab results' },
  
  // Appointments
  viewAppointments: { category: 'Appointments', description: 'View appointments' },
  scheduleAppointments: { category: 'Appointments', description: 'Schedule appointments' },
  manageAppointments: { category: 'Appointments', description: 'Manage appointments' },
  cancelAppointments: { category: 'Appointments', description: 'Cancel appointments' },
  
  // Billing
  viewBilling: { category: 'Billing', description: 'View billing information' },
  manageBilling: { category: 'Billing', description: 'Manage billing' },
  createInvoices: { category: 'Billing', description: 'Create invoices' },
  processPayments: { category: 'Billing', description: 'Process payments' },
  
  // Administration
  manageUsers: { category: 'Administration', description: 'Manage users' },
  manageRoles: { category: 'Administration', description: 'Manage roles' },
  manageDepartments: { category: 'Administration', description: 'Manage departments' },
  viewAuditLogs: { category: 'Administration', description: 'View audit logs' },
  systemSettings: { category: 'Administration', description: 'System settings' },
  
  // Reports
  viewReports: { category: 'Reports', description: 'View reports' },
  generateReports: { category: 'Reports', description: 'Generate reports' },
  exportReports: { category: 'Reports', description: 'Export reports' },
  
  // Inventory
  viewInventory: { category: 'Inventory', description: 'View inventory' },
  manageInventory: { category: 'Inventory', description: 'Manage inventory' },
  
  // Admissions
  viewAdmissions: { category: 'Admissions', description: 'View admissions' },
  manageAdmissions: { category: 'Admissions', description: 'Manage admissions' },
  dischargePatients: { category: 'Admissions', description: 'Discharge patients' }
};

// Access control helper functions
export const hasRole = (userRole, requiredRoles) => {
  const requiredRolesList = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return requiredRolesList.includes(userRole);
};

export const hasDepartmentAccess = (userRole, userDepartment, requiredDepartments) => {
  // Admins can access all departments
  if (userRole === 'hospital_admin' || userRole === 'admin') {
    return true;
  }
  
  const requiredDeptsList = Array.isArray(requiredDepartments) ? requiredDepartments : [requiredDepartments];
  return requiredDeptsList.includes(userDepartment);
};

export const hasPermission = (userRole, userPermissions, requiredPermission) => {
  // Admins have all permissions
  if (userRole === 'hospital_admin' || userRole === 'admin') {
    return true;
  }
  
  return userPermissions && userPermissions[requiredPermission] === true;
};

export const canAccessPage = (userRole, userDepartment, userPermissions, pageConfig) => {
  const { roles, departments, permissions, requireAll = false } = pageConfig;
  
  let hasRoleAccess = !roles || hasRole(userRole, roles);
  let hasDeptAccess = !departments || hasDepartmentAccess(userRole, userDepartment, departments);
  let hasPermAccess = !permissions || permissions.some(perm => hasPermission(userRole, userPermissions, perm));
  
  if (requireAll) {
    return hasRoleAccess && hasDeptAccess && hasPermAccess;
  } else {
    return hasRoleAccess || hasDeptAccess || hasPermAccess;
  }
};

// Page access configurations
export const PAGE_ACCESS_CONFIG = {
  // Dashboard
  '/hospital/dashboard': {
    roles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'receptionist', 'lab_technician', 'pharmacist'],
    requireAll: false
  },
  
  // Patient Management
  '/hospital/patients': {
    roles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'receptionist'],
    permissions: ['viewPatients'],
    requireAll: false
  },
  
  '/hospital/patients/create': {
    roles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'receptionist'],
    permissions: ['createPatients'],
    requireAll: false
  },
  
  // Medical Records
  '/hospital/medical-records': {
    roles: ['hospital_admin', 'admin', 'doctor', 'nurse'],
    permissions: ['viewMedicalRecords'],
    requireAll: false
  },
  
  // Laboratory
  '/hospital/lab': {
    roles: ['hospital_admin', 'admin', 'doctor', 'nurse', 'lab_technician'],
    departments: ['laboratory', 'pathology'],
    permissions: ['viewLabTests'],
    requireAll: false
  },
  
  // Pharmacy
  '/hospital/pharmacy': {
    roles: ['hospital_admin', 'admin', 'doctor', 'pharmacist'],
    departments: ['pharmacy'],
    permissions: ['viewPrescriptions'],
    requireAll: false
  },
  
  // Billing
  '/hospital/billing': {
    roles: ['hospital_admin', 'admin', 'billing_staff', 'receptionist'],
    departments: ['billing', 'finance'],
    permissions: ['viewBilling'],
    requireAll: false
  },
  
  // Administration
  '/hospital/admin/users': {
    roles: ['hospital_admin', 'admin'],
    permissions: ['manageUsers'],
    requireAll: true
  },
  
  '/hospital/admin/departments': {
    roles: ['hospital_admin', 'admin'],
    permissions: ['manageDepartments'],
    requireAll: true
  },
  
  // Reports
  '/hospital/reports': {
    roles: ['hospital_admin', 'admin', 'doctor', 'billing_staff'],
    permissions: ['viewReports'],
    requireAll: false
  }
};

export default {
  HOSPITAL_ROLES,
  DEPARTMENT_ACCESS_RULES,
  PERMISSIONS,
  PAGE_ACCESS_CONFIG,
  hasRole,
  hasDepartmentAccess,
  hasPermission,
  canAccessPage
};
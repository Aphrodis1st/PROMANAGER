import React, { createContext, useContext, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useHospitalAuth } from '../../context/HospitalAuthContext';

// RBAC Context
const RBACContext = createContext(null);

// Role definitions (mirrored from backend)
const HOSPITAL_ROLES = {
  HOSPITAL_ADMIN: 'hospital_admin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  LAB_TECHNICIAN: 'lab_technician',
  PHARMACIST: 'pharmacist',
  RADIOLOGIST: 'radiologist',
  RECEPTIONIST: 'receptionist',
  BILLING_STAFF: 'billing_staff',
  PATIENT: 'patient'
};

// Permission definitions
const PERMISSIONS = {
  // Patient Management
  VIEW_PATIENTS: 'viewPatients',
  CREATE_PATIENTS: 'createPatients',
  EDIT_PATIENTS: 'editPatients',
  DELETE_PATIENTS: 'deletePatients',
  
  // Medical Records
  VIEW_MEDICAL_RECORDS: 'viewMedicalRecords',
  CREATE_MEDICAL_RECORDS: 'createMedicalRecords',
  EDIT_MEDICAL_RECORDS: 'editMedicalRecords',
  DELETE_MEDICAL_RECORDS: 'deleteMedicalRecords',
  
  // Prescriptions
  VIEW_PRESCRIPTIONS: 'viewPrescriptions',
  CREATE_PRESCRIPTIONS: 'createPrescriptions',
  EDIT_PRESCRIPTIONS: 'editPrescriptions',
  DISPENSE_MEDICATIONS: 'dispenseMedications',
  
  // Laboratory
  VIEW_LAB_TESTS: 'viewLabTests',
  ORDER_LAB_TESTS: 'orderLabTests',
  PROCESS_LAB_TESTS: 'processLabTests',
  VIEW_LAB_RESULTS: 'viewLabResults',
  ENTER_LAB_RESULTS: 'enterLabResults',
  EDIT_LAB_RESULTS: 'editLabResults',
  
  // Appointments
  VIEW_APPOINTMENTS: 'viewAppointments',
  SCHEDULE_APPOINTMENTS: 'scheduleAppointments',
  MANAGE_APPOINTMENTS: 'manageAppointments',
  CANCEL_APPOINTMENTS: 'cancelAppointments',
  
  // Billing
  VIEW_BILLING: 'viewBilling',
  MANAGE_BILLING: 'manageBilling',
  CREATE_INVOICES: 'createInvoices',
  PROCESS_PAYMENTS: 'processPayments',
  
  // Administration
  MANAGE_USERS: 'manageUsers',
  MANAGE_ROLES: 'manageRoles',
  MANAGE_DEPARTMENTS: 'manageDepartments',
  VIEW_AUDIT_LOGS: 'viewAuditLogs',
  SYSTEM_SETTINGS: 'systemSettings',
  
  // Reports
  VIEW_REPORTS: 'viewReports',
  GENERATE_REPORTS: 'generateReports',
  EXPORT_REPORTS: 'exportReports',
  
  // Inventory
  VIEW_INVENTORY: 'viewInventory',
  MANAGE_INVENTORY: 'manageInventory',
  
  // Admissions
  VIEW_ADMISSIONS: 'viewAdmissions',
  MANAGE_ADMISSIONS: 'manageAdmissions',
  DISCHARGE_PATIENTS: 'dischargePatients'
};

// RBAC Provider Component
export const RBACProvider = ({ children }) => {
  const { admin, user } = useHospitalAuth();
  
  const currentUser = admin || user;
  
  const rbacContext = useMemo(() => {
    if (!currentUser) {
      return {
        hasRole: () => false,
        hasPermission: () => false,
        hasDepartmentAccess: () => false,
        canAccess: () => false,
        user: null
      };
    }
    
    const userRole = currentUser.role;
    const userDepartment = currentUser.departmentId;
    const userPermissions = currentUser.permissions || {};
    
    // Check if user has specific role
    const hasRole = (requiredRoles) => {
      const rolesList = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      return rolesList.includes(userRole);
    };
    
    // Check if user has specific permission
    const hasPermission = (permission) => {
      // Admins have all permissions
      if (userRole === HOSPITAL_ROLES.HOSPITAL_ADMIN || userRole === HOSPITAL_ROLES.ADMIN) {
        return true;
      }
      return userPermissions[permission] === true;
    };
    
    // Check if user has department access
    const hasDepartmentAccess = (requiredDepartments) => {
      // Admins can access all departments
      if (userRole === HOSPITAL_ROLES.HOSPITAL_ADMIN || userRole === HOSPITAL_ROLES.ADMIN) {
        return true;
      }
      
      if (!userDepartment) return false;
      
      const deptsList = Array.isArray(requiredDepartments) ? requiredDepartments : [requiredDepartments];
      return deptsList.includes(userDepartment);
    };
    
    // Combined access check
    const canAccess = (config) => {
      const { roles, departments, permissions, requireAll = false } = config;
      
      let hasRoleAccess = !roles || hasRole(roles);
      let hasDeptAccess = !departments || hasDepartmentAccess(departments);
      let hasPermAccess = !permissions || (Array.isArray(permissions) 
        ? permissions.some(perm => hasPermission(perm))
        : hasPermission(permissions));
      
      if (requireAll) {
        return hasRoleAccess && hasDeptAccess && hasPermAccess;
      } else {
        return hasRoleAccess || hasDeptAccess || hasPermAccess;
      }
    };
    
    return {
      hasRole,
      hasPermission,
      hasDepartmentAccess,
      canAccess,
      user: currentUser,
      userRole,
      userDepartment,
      userPermissions
    };
  }, [currentUser]);
  
  return (
    <RBACContext.Provider value={rbacContext}>
      {children}
    </RBACContext.Provider>
  );
};

// Hook to use RBAC context
export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute = ({ 
  children, 
  roles, 
  departments, 
  permissions, 
  requireAll = false,
  fallback = null 
}) => {
  const { isAuthenticated } = useHospitalAuth();
  const { canAccess, user } = useRBAC();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/hospital/login" replace />;
  }
  
  const hasAccess = canAccess({ roles, departments, permissions, requireAll });
  
  if (!hasAccess) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button 
            onClick={() => window.history.back()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

// Protected Component (for UI elements)
export const ProtectedComponent = ({ 
  children, 
  roles, 
  departments, 
  permissions, 
  requireAll = false,
  fallback = null 
}) => {
  const { canAccess } = useRBAC();
  
  const hasAccess = canAccess({ roles, departments, permissions, requireAll });
  
  if (!hasAccess) {
    return fallback;
  }
  
  return children;
};

// Role Badge Component
export const RoleBadge = ({ role, className = '' }) => {
  const getRoleColor = (role) => {
    const colors = {
      [HOSPITAL_ROLES.HOSPITAL_ADMIN]: 'bg-red-100 text-red-800 border-red-200',
      [HOSPITAL_ROLES.ADMIN]: 'bg-red-100 text-red-800 border-red-200',
      [HOSPITAL_ROLES.DOCTOR]: 'bg-blue-100 text-blue-800 border-blue-200',
      [HOSPITAL_ROLES.NURSE]: 'bg-green-100 text-green-800 border-green-200',
      [HOSPITAL_ROLES.LAB_TECHNICIAN]: 'bg-purple-100 text-purple-800 border-purple-200',
      [HOSPITAL_ROLES.PHARMACIST]: 'bg-orange-100 text-orange-800 border-orange-200',
      [HOSPITAL_ROLES.RADIOLOGIST]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      [HOSPITAL_ROLES.RECEPTIONIST]: 'bg-pink-100 text-pink-800 border-pink-200',
      [HOSPITAL_ROLES.BILLING_STAFF]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      [HOSPITAL_ROLES.PATIENT]: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  const getRoleName = (role) => {
    const names = {
      [HOSPITAL_ROLES.HOSPITAL_ADMIN]: 'Hospital Admin',
      [HOSPITAL_ROLES.ADMIN]: 'Administrator',
      [HOSPITAL_ROLES.DOCTOR]: 'Doctor',
      [HOSPITAL_ROLES.NURSE]: 'Nurse',
      [HOSPITAL_ROLES.LAB_TECHNICIAN]: 'Lab Technician',
      [HOSPITAL_ROLES.PHARMACIST]: 'Pharmacist',
      [HOSPITAL_ROLES.RADIOLOGIST]: 'Radiologist',
      [HOSPITAL_ROLES.RECEPTIONIST]: 'Receptionist',
      [HOSPITAL_ROLES.BILLING_STAFF]: 'Billing Staff',
      [HOSPITAL_ROLES.PATIENT]: 'Patient'
    };
    return names[role] || role;
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(role)} ${className}`}>
      {getRoleName(role)}
    </span>
  );
};

// Department Badge Component
export const DepartmentBadge = ({ departmentId, departmentName, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 ${className}`}>
      {departmentName || departmentId}
    </span>
  );
};

// Access Control Hook for specific features
export const useAccessControl = () => {
  const { hasRole, hasPermission, hasDepartmentAccess, canAccess, user } = useRBAC();
  
  return {
    // Patient Management
    canViewPatients: () => hasPermission(PERMISSIONS.VIEW_PATIENTS),
    canCreatePatients: () => hasPermission(PERMISSIONS.CREATE_PATIENTS),
    canEditPatients: () => hasPermission(PERMISSIONS.EDIT_PATIENTS),
    canDeletePatients: () => hasPermission(PERMISSIONS.DELETE_PATIENTS),
    
    // Medical Records
    canViewMedicalRecords: () => hasPermission(PERMISSIONS.VIEW_MEDICAL_RECORDS),
    canCreateMedicalRecords: () => hasPermission(PERMISSIONS.CREATE_MEDICAL_RECORDS),
    canEditMedicalRecords: () => hasPermission(PERMISSIONS.EDIT_MEDICAL_RECORDS),
    
    // Prescriptions
    canViewPrescriptions: () => hasPermission(PERMISSIONS.VIEW_PRESCRIPTIONS),
    canCreatePrescriptions: () => hasPermission(PERMISSIONS.CREATE_PRESCRIPTIONS),
    canDispenseMedications: () => hasPermission(PERMISSIONS.DISPENSE_MEDICATIONS),
    
    // Laboratory
    canViewLabTests: () => hasPermission(PERMISSIONS.VIEW_LAB_TESTS),
    canOrderLabTests: () => hasPermission(PERMISSIONS.ORDER_LAB_TESTS),
    canProcessLabTests: () => hasPermission(PERMISSIONS.PROCESS_LAB_TESTS),
    canViewLabResults: () => hasPermission(PERMISSIONS.VIEW_LAB_RESULTS),
    
    // Appointments
    canViewAppointments: () => hasPermission(PERMISSIONS.VIEW_APPOINTMENTS),
    canScheduleAppointments: () => hasPermission(PERMISSIONS.SCHEDULE_APPOINTMENTS),
    canManageAppointments: () => hasPermission(PERMISSIONS.MANAGE_APPOINTMENTS),
    
    // Billing
    canViewBilling: () => hasPermission(PERMISSIONS.VIEW_BILLING),
    canManageBilling: () => hasPermission(PERMISSIONS.MANAGE_BILLING),
    canProcessPayments: () => hasPermission(PERMISSIONS.PROCESS_PAYMENTS),
    
    // Administration
    canManageUsers: () => hasPermission(PERMISSIONS.MANAGE_USERS),
    canManageDepartments: () => hasPermission(PERMISSIONS.MANAGE_DEPARTMENTS),
    canViewAuditLogs: () => hasPermission(PERMISSIONS.VIEW_AUDIT_LOGS),
    
    // Reports
    canViewReports: () => hasPermission(PERMISSIONS.VIEW_REPORTS),
    canGenerateReports: () => hasPermission(PERMISSIONS.GENERATE_REPORTS),
    canExportReports: () => hasPermission(PERMISSIONS.EXPORT_REPORTS),
    
    // Department Access
    canAccessEmergency: () => hasDepartmentAccess('emergency'),
    canAccessICU: () => hasDepartmentAccess('icu'),
    canAccessLab: () => hasDepartmentAccess(['laboratory', 'pathology']),
    canAccessPharmacy: () => hasDepartmentAccess('pharmacy'),
    canAccessRadiology: () => hasDepartmentAccess(['radiology', 'imaging']),
    
    // Role Checks
    isAdmin: () => hasRole([HOSPITAL_ROLES.HOSPITAL_ADMIN, HOSPITAL_ROLES.ADMIN]),
    isDoctor: () => hasRole(HOSPITAL_ROLES.DOCTOR),
    isNurse: () => hasRole(HOSPITAL_ROLES.NURSE),
    isLabTech: () => hasRole(HOSPITAL_ROLES.LAB_TECHNICIAN),
    isPharmacist: () => hasRole(HOSPITAL_ROLES.PHARMACIST),
    isReceptionist: () => hasRole(HOSPITAL_ROLES.RECEPTIONIST),
    
    // General access
    hasRole,
    hasPermission,
    hasDepartmentAccess,
    canAccess,
    user
  };
};

export { HOSPITAL_ROLES, PERMISSIONS };
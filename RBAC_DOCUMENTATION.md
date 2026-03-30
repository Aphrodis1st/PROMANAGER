# Hospital Management System - Role-Based Access Control (RBAC)

## Overview

This RBAC system provides comprehensive access control for the hospital management system, ensuring users can only access resources and perform actions appropriate to their role and department assignment.

## Key Features

- **Role-Based Access**: Control access based on user roles (Doctor, Nurse, Lab Technician, etc.)
- **Department-Based Access**: Restrict access to specific departments
- **Permission-Based Access**: Fine-grained control using specific permissions
- **Combined Access Control**: Mix roles, departments, and permissions for complex scenarios
- **Patient Data Protection**: Special middleware for patient-specific data access
- **Audit Logging**: Track all access attempts for security compliance

## Architecture

### Backend Components

1. **RBAC Middleware** (`/backend/src/middleware/rbac.middleware.js`)
2. **RBAC Configuration** (`/backend/src/config/rbac.config.js`)
3. **Route Protection** (Applied to API endpoints)

### Frontend Components

1. **RBAC Provider** (`/frontend/src/components/hospital/RBAC.jsx`)
2. **Protected Routes** (Page-level access control)
3. **Protected Components** (UI element-level access control)

## Backend Implementation

### 1. Basic Authentication

```javascript
import { hospitalAuth } from '../middleware/rbac.middleware.js';

// Apply to all protected routes
router.use(hospitalAuth);
```

### 2. Role-Based Protection

```javascript
import { requireRole } from '../middleware/rbac.middleware.js';

// Single role
router.get('/admin/users', hospitalAuth, requireRole('hospital_admin'), handler);

// Multiple roles
router.get('/patients', hospitalAuth, requireRole(['doctor', 'nurse', 'receptionist']), handler);
```

### 3. Department-Based Protection

```javascript
import { requireDepartment } from '../middleware/rbac.middleware.js';

// Single department
router.get('/lab/tests', hospitalAuth, requireDepartment('laboratory'), handler);

// Multiple departments
router.get('/lab/results', hospitalAuth, requireDepartment(['laboratory', 'pathology']), handler);
```

### 4. Combined Role and Department Protection

```javascript
import { requireRoleAndDepartment } from '../middleware/rbac.middleware.js';

// Must have specific role AND be in specific department
router.post('/lab/process', 
  hospitalAuth, 
  requireRoleAndDepartment('lab_technician', ['laboratory', 'pathology']), 
  handler
);
```

### 5. Permission-Based Protection

```javascript
import { requirePermission } from '../middleware/rbac.middleware.js';

router.get('/medical-records', 
  hospitalAuth, 
  requirePermission('viewMedicalRecords'), 
  handler
);
```

### 6. Advanced Access Control

```javascript
import { requireAccess } from '../middleware/rbac.middleware.js';

router.get('/reports/financial',
  hospitalAuth,
  requireAccess({
    roles: ['hospital_admin', 'billing_staff'],
    departments: ['billing', 'finance'],
    permissions: ['viewReports'],
    requireAll: true  // Must satisfy ALL conditions
  }),
  handler
);
```

### 7. Patient Data Protection

```javascript
import { requirePatientAccess } from '../middleware/rbac.middleware.js';

// Automatically checks if user can access specific patient data
router.get('/patients/:patientId', 
  hospitalAuth, 
  requirePatientAccess, 
  handler
);
```

### 8. Audit Logging

```javascript
import { auditAccess } from '../middleware/rbac.middleware.js';

router.post('/patients', 
  hospitalAuth, 
  requireRole(['doctor', 'nurse']),
  auditAccess('create_patient'),  // Logs this action
  handler
);
```

## Frontend Implementation

### 1. Setup RBAC Provider

```jsx
import { RBACProvider } from '../components/hospital/RBAC';

function App() {
  return (
    <RBACProvider>
      {/* Your app components */}
    </RBACProvider>
  );
}
```

### 2. Protected Routes

```jsx
import { ProtectedRoute, HOSPITAL_ROLES, PERMISSIONS } from '../components/hospital/RBAC';

function PatientManagement() {
  return (
    <ProtectedRoute
      roles={[HOSPITAL_ROLES.DOCTOR, HOSPITAL_ROLES.NURSE]}
      permissions={[PERMISSIONS.VIEW_PATIENTS]}
      fallback={<AccessDeniedPage />}
    >
      <PatientManagementContent />
    </ProtectedRoute>
  );
}
```

### 3. Protected UI Components

```jsx
import { ProtectedComponent, HOSPITAL_ROLES } from '../components/hospital/RBAC';

function Dashboard() {
  return (
    <div>
      {/* Only admins can see this button */}
      <ProtectedComponent roles={[HOSPITAL_ROLES.HOSPITAL_ADMIN]}>
        <Button>Admin Settings</Button>
      </ProtectedComponent>

      {/* Only lab technicians in lab departments can see this */}
      <ProtectedComponent
        roles={[HOSPITAL_ROLES.LAB_TECHNICIAN]}
        departments={['laboratory', 'pathology']}
        requireAll={true}
      >
        <LabControls />
      </ProtectedComponent>
    </div>
  );
}
```

### 4. Using Access Control Hooks

```jsx
import { useAccessControl } from '../components/hospital/RBAC';

function PatientCard({ patient }) {
  const accessControl = useAccessControl();

  return (
    <div className="patient-card">
      <h3>{patient.name}</h3>
      
      {accessControl.canViewMedicalRecords() && (
        <Button onClick={() => viewMedicalRecords(patient.id)}>
          View Medical Records
        </Button>
      )}
      
      {accessControl.canEditPatients() && (
        <Button onClick={() => editPatient(patient.id)}>
          Edit Patient
        </Button>
      )}
      
      {accessControl.isDoctor() && (
        <Button onClick={() => createPrescription(patient.id)}>
          Create Prescription
        </Button>
      )}
    </div>
  );
}
```

### 5. Role and Department Badges

```jsx
import { RoleBadge, DepartmentBadge } from '../components/hospital/RBAC';

function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <RoleBadge role={user.role} />
      <DepartmentBadge departmentId={user.departmentId} departmentName={user.departmentName} />
    </div>
  );
}
```

## Role Definitions

### Administrative Roles
- **Hospital Administrator**: Full system access
- **System Administrator**: System-wide administrative access

### Medical Staff Roles
- **Doctor**: Patient care, medical records, prescriptions
- **Nurse**: Patient care, basic medical records, vital signs
- **Radiologist**: Medical imaging specialist
- **Lab Technician**: Laboratory testing and results
- **Pharmacist**: Medication management and dispensing

### Support Staff Roles
- **Receptionist**: Front desk, appointments, basic patient info
- **Billing Staff**: Financial operations and billing

### Patient Role
- **Patient**: Limited access to own medical information

## Department-Based Access Examples

### Emergency Department
```javascript
// Only doctors and nurses in emergency department
requireRoleAndDepartment(['doctor', 'nurse'], 'emergency')
```

### Laboratory
```javascript
// Lab technicians in lab or pathology departments
requireRoleAndDepartment('lab_technician', ['laboratory', 'pathology'])
```

### ICU
```javascript
// Doctors and nurses in ICU only
requireRoleAndDepartment(['doctor', 'nurse'], 'icu')
```

### Pharmacy
```javascript
// Pharmacists in pharmacy department
requireRoleAndDepartment('pharmacist', 'pharmacy')
```

## Permission Examples

### Patient Management
- `viewPatients`: View patient information
- `createPatients`: Create new patient records
- `editPatients`: Edit patient information
- `deletePatients`: Delete patient records

### Medical Records
- `viewMedicalRecords`: View medical records
- `createMedicalRecords`: Create medical records
- `editMedicalRecords`: Edit medical records

### Laboratory
- `viewLabTests`: View lab tests
- `orderLabTests`: Order lab tests
- `processLabTests`: Process lab tests
- `viewLabResults`: View lab results
- `enterLabResults`: Enter lab results

### Prescriptions
- `viewPrescriptions`: View prescriptions
- `createPrescriptions`: Create prescriptions
- `dispenseMedications`: Dispense medications

## Complex Access Control Scenarios

### 1. Emergency Department Access
```javascript
// Emergency doctors can access all emergency patients
router.get('/emergency/patients',
  hospitalAuth,
  requireRoleAndDepartment('doctor', 'emergency'),
  requirePermission('viewPatients'),
  handler
);
```

### 2. Lab Result Approval
```javascript
// Only lab technicians in lab departments can approve results
router.put('/lab/results/:id/approve',
  hospitalAuth,
  requireRoleAndDepartment('lab_technician', ['laboratory', 'pathology']),
  requirePermission('editLabResults'),
  handler
);
```

### 3. Financial Reports
```javascript
// Only billing staff in billing department or admins
router.get('/reports/financial',
  hospitalAuth,
  requireAccess({
    roles: ['hospital_admin', 'billing_staff'],
    departments: ['billing', 'finance'],
    permissions: ['viewReports'],
    requireAll: false  // Either admin OR (billing staff in billing dept with permission)
  }),
  handler
);
```

### 4. Patient-Specific Access
```javascript
// Doctors can only access patients in their department
router.get('/patients/:patientId/records',
  hospitalAuth,
  requirePatientAccess,  // Checks patient-doctor relationship
  requirePermission('viewMedicalRecords'),
  handler
);
```

## Security Best Practices

### 1. Always Use Authentication First
```javascript
// Always apply hospitalAuth before any RBAC middleware
router.use(hospitalAuth);
```

### 2. Principle of Least Privilege
```javascript
// Give users minimum permissions needed
const nursePermissions = [
  'viewPatients',
  'editPatients',
  'viewMedicalRecords',
  'recordVitalSigns'
];
```

### 3. Department Isolation
```javascript
// Ensure users can only access their department's data
requireRoleAndDepartment('lab_technician', userDepartment)
```

### 4. Audit Critical Actions
```javascript
// Log sensitive operations
router.delete('/patients/:id',
  hospitalAuth,
  requireRole('hospital_admin'),
  auditAccess('delete_patient'),
  handler
);
```

### 5. Frontend-Backend Consistency
```javascript
// Ensure frontend and backend have same access rules
const patientAccess = {
  roles: ['doctor', 'nurse', 'receptionist'],
  permissions: ['viewPatients']
};
```

## Testing RBAC

### 1. Unit Tests for Middleware
```javascript
describe('RBAC Middleware', () => {
  it('should allow doctor to view patients', async () => {
    const req = { user: { role: 'doctor', permissions: { viewPatients: true } } };
    const result = await requirePermission('viewPatients')(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
```

### 2. Integration Tests
```javascript
describe('Patient API', () => {
  it('should deny access to non-medical staff', async () => {
    const response = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${receptionistToken}`);
    expect(response.status).toBe(403);
  });
});
```

## Troubleshooting

### Common Issues

1. **403 Forbidden Errors**
   - Check user role matches required roles
   - Verify user has required permissions
   - Ensure user is in correct department

2. **Token Issues**
   - Verify JWT token is valid
   - Check token contains role and department info
   - Ensure hospitalAuth middleware is applied

3. **Frontend Access Issues**
   - Verify RBACProvider wraps components
   - Check user data is loaded in context
   - Ensure permissions are set correctly

### Debug Tips

1. **Enable Audit Logging**
```javascript
// Add audit logging to debug access issues
router.use(auditAccess('debug_access'));
```

2. **Check User Context**
```javascript
// In React components
const { user, userRole, userDepartment, userPermissions } = useRBAC();
console.log('User context:', { user, userRole, userDepartment, userPermissions });
```

3. **Verify Middleware Order**
```javascript
// Correct order
router.get('/endpoint',
  hospitalAuth,        // 1. Authentication first
  requireRole('doctor'), // 2. Role check
  requireDepartment('emergency'), // 3. Department check
  requirePermission('viewPatients'), // 4. Permission check
  auditAccess('action'), // 5. Audit logging
  handler              // 6. Business logic
);
```

This RBAC system provides comprehensive security for the hospital management system while maintaining flexibility for complex healthcare workflows.
import React from 'react';
import { 
  RBACProvider, 
  ProtectedRoute, 
  ProtectedComponent, 
  RoleBadge, 
  DepartmentBadge, 
  useRBAC, 
  useAccessControl, 
  HOSPITAL_ROLES, 
  PERMISSIONS 
} from '../../components/hospital/RBAC';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/hospital/card';
import { Button } from '../../components/hospital/Button';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Calendar, 
  DollarSign, 
  Activity, 
  Settings, 
  BarChart3, 
  Shield, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Download 
} from 'lucide-react';

// Main Hospital Dashboard with RBAC
const HospitalDashboard = () => {
  const { user, userRole, userDepartment } = useRBAC();
  const accessControl = useAccessControl();

  return (
    <div className="p-6 space-y-6">
      {/* User Info Header */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Welcome, {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <RoleBadge role={userRole} />
                {userDepartment && (
                  <DepartmentBadge 
                    departmentId={userDepartment} 
                    departmentName={userDepartment} 
                  />
                )}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last login: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Quick Actions - Role-based visibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Patient Management - Doctors, Nurses, Receptionists */}
        <ProtectedComponent
          roles={[HOSPITAL_ROLES.DOCTOR, HOSPITAL_ROLES.NURSE, HOSPITAL_ROLES.RECEPTIONIST]}
          permissions={[PERMISSIONS.VIEW_PATIENTS]}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Patients</p>
                  <p className="text-2xl font-bold">1,234</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mt-4 flex gap-2">
                {accessControl.canViewPatients() && (
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                {accessControl.canCreatePatients() && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        {/* Medical Records - Doctors and Nurses only */}
        <ProtectedComponent
          roles={[HOSPITAL_ROLES.DOCTOR, HOSPITAL_ROLES.NURSE]}
          permissions={[PERMISSIONS.VIEW_MEDICAL_RECORDS]}
          requireAll={true}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Medical Records</p>
                  <p className="text-2xl font-bold">856</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {accessControl.canCreateMedicalRecords() && (
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        {/* Laboratory - Lab department only */}
        <ProtectedComponent
          roles={[HOSPITAL_ROLES.LAB_TECHNICIAN, HOSPITAL_ROLES.DOCTOR]}
          departments={['laboratory', 'pathology']}
          permissions={[PERMISSIONS.VIEW_LAB_TESTS]}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Lab Tests</p>
                  <p className="text-2xl font-bold">342</p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {accessControl.canProcessLabTests() && (
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Process
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        {/* Billing - Billing department or admin */}
        <ProtectedComponent
          roles={[HOSPITAL_ROLES.BILLING_STAFF, HOSPITAL_ROLES.RECEPTIONIST]}
          departments={['billing', 'finance']}
          permissions={[PERMISSIONS.VIEW_BILLING]}
        >
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">$125K</p>
                </div>
                <DollarSign className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {accessControl.canManageBilling() && (
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>
      </div>

      {/* Department-Specific Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Department Dashboard */}
        <ProtectedComponent
          roles={[HOSPITAL_ROLES.DOCTOR, HOSPITAL_ROLES.NURSE]}
          departments={['emergency']}
          requireAll={true}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Emergency Department
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Critical Patients</span>
                  <span className="font-bold text-red-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Waiting Patients</span>
                  <span className="font-bold text-yellow-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available Beds</span>
                  <span className="font-bold text-green-600">3</span>
                </div>
                <Button className="w-full">
                  View Emergency Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>

        {/* ICU Dashboard */}
        <ProtectedComponent
          roles={[HOSPITAL_ROLES.DOCTOR, HOSPITAL_ROLES.NURSE]}
          departments={['icu']}
          requireAll={true}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Intensive Care Unit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Occupied Beds</span>
                  <span className="font-bold">8/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ventilators in Use</span>
                  <span className="font-bold">6/8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Critical Alerts</span>
                  <span className="font-bold text-red-600">2</span>
                </div>
                <Button className="w-full">
                  View ICU Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </ProtectedComponent>
      </div>

      {/* Administrative Section - Admin Only */}
      <ProtectedComponent
        roles={[HOSPITAL_ROLES.HOSPITAL_ADMIN, HOSPITAL_ROLES.ADMIN]}
        requireAll={true}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Administrative Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Manage Users
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Settings
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                View Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </ProtectedComponent>

      {/* Recent Activity - Role-based content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Show different activities based on role */}
            {accessControl.isDoctor() && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">New patient consultation scheduled</p>
                  <p className="text-sm text-gray-600">Patient ID: P-2024-001 - 2:00 PM</p>
                </div>
              </div>
            )}
            
            {accessControl.isNurse() && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Vital signs recorded</p>
                  <p className="text-sm text-gray-600">Patient ID: P-2024-002 - Room 205</p>
                </div>
              </div>
            )}
            
            {accessControl.isLabTech() && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Lab results ready for review</p>
                  <p className="text-sm text-gray-600">Test ID: LAB-2024-156 - Blood work</p>
                </div>
              </div>
            )}
            
            {accessControl.isPharmacist() && (
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium">Prescription dispensed</p>
                  <p className="text-sm text-gray-600">RX-2024-789 - Antibiotics</p>
                </div>
              </div>
            )}
            
            {accessControl.isReceptionist() && (
              <div className="flex items-center gap-3 p-3 bg-pink-50 rounded-lg">
                <Calendar className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="font-medium">Appointment scheduled</p>
                  <p className="text-sm text-gray-600">Dr. Smith - Tomorrow 10:00 AM</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Reports Section - Permission-based access */}
      <ProtectedComponent
        permissions={[PERMISSIONS.VIEW_REPORTS]}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reports & Analytics
              </span>
              <ProtectedComponent permissions={[PERMISSIONS.EXPORT_REPORTS]}>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </ProtectedComponent>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Department-specific reports */}
              {accessControl.canAccessLab() && (
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Activity className="h-6 w-6 mb-2" />
                  Lab Reports
                </Button>
              )}
              
              {accessControl.canAccessPharmacy() && (
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Activity className="h-6 w-6 mb-2" />
                  Pharmacy Reports
                </Button>
              )}
              
              <ProtectedComponent
                roles={[HOSPITAL_ROLES.BILLING_STAFF]}
                departments={['billing', 'finance']}
              >
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <DollarSign className="h-6 w-6 mb-2" />
                  Financial Reports
                </Button>
              </ProtectedComponent>
              
              <ProtectedComponent
                roles={[HOSPITAL_ROLES.HOSPITAL_ADMIN, HOSPITAL_ROLES.ADMIN]}
              >
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Shield className="h-6 w-6 mb-2" />
                  System Reports
                </Button>
              </ProtectedComponent>
            </div>
          </CardContent>
        </Card>
      </ProtectedComponent>
    </div>
  );
};

// Example of a protected page component
const PatientManagementPage = () => {
  return (
    <ProtectedRoute
      roles={[HOSPITAL_ROLES.DOCTOR, HOSPITAL_ROLES.NURSE, HOSPITAL_ROLES.RECEPTIONIST]}
      permissions={[PERMISSIONS.VIEW_PATIENTS]}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Restricted</h2>
            <p className="text-gray-600">You need patient management permissions to access this page.</p>
          </div>
        </div>
      }
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Patient Management</h1>
        {/* Patient management content */}
      </div>
    </ProtectedRoute>
  );
};

// Main App component with RBAC Provider
const HospitalApp = () => {
  return (
    <RBACProvider>
      <div className="min-h-screen bg-gray-50">
        <HospitalDashboard />
      </div>
    </RBACProvider>
  );
};

export default HospitalApp;
export { PatientManagementPage };
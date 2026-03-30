import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute, RBACProvider, HOSPITAL_ROLES, PERMISSIONS } from '../components/hospital/RBAC';

// Use the older, simpler hospital pages
import HospitalLayout from '../pages/HospitalLayout';
import HospitalDashboard from '../pages/HospitalDashboard';

// Import existing hospital pages for basic functionality
import PatientList from './patients/pages/PatientList';
import DoctorList from './doctors/pages/DoctorList';
import AppointmentList from './Appointment/AppointmentList';
import BillingDashboard from './billing/pages/BillingDashboard';
import LabDashboard from './lab/pages/LabDashboard';
import HospitalReportDashboard from './reports/pages/HospitalReportDashboard';
import UserManagement from './admin/pages/UserManagement';
import DepartmentManagement from './admin/pages/DepartmentManagement';
import SystemSettings from './admin/pages/SystemSettings';
import AuditLogs from './admin/pages/AuditLogs';

const HospitalRoutes = () => {
  const { user } = useAuth();

  console.log('HospitalRoutes - Current user:', user);

  const getDefaultRoute = () => {
    const userRole = user?.role;
    console.log('getDefaultRoute - userRole:', userRole);
    return '/hospital/dashboard';
  };

  return (
    <RBACProvider>
      <Routes>
        {/* Default redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* Main Hospital Dashboard - All roles */}
        <Route 
          path="dashboard" 
          element={
            <ProtectedRoute roles={[
              HOSPITAL_ROLES.ADMIN, 
              HOSPITAL_ROLES.HOSPITAL_ADMIN, 
              HOSPITAL_ROLES.DOCTOR, 
              HOSPITAL_ROLES.NURSE, 
              HOSPITAL_ROLES.RECEPTIONIST,
              HOSPITAL_ROLES.LAB_TECHNICIAN,
              HOSPITAL_ROLES.PHARMACIST,
              HOSPITAL_ROLES.BILLING_STAFF
            ]}>
              <HospitalLayout>
                <HospitalDashboard />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Patient Management */}
        <Route 
          path="patients" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <PatientList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Doctor Management */}
        <Route 
          path="doctors" 
          element={
            <ProtectedRoute roles={[
              HOSPITAL_ROLES.ADMIN, 
              HOSPITAL_ROLES.HOSPITAL_ADMIN, 
              HOSPITAL_ROLES.DOCTOR, 
              HOSPITAL_ROLES.NURSE, 
              HOSPITAL_ROLES.RECEPTIONIST
            ]}>
              <HospitalLayout>
                <DoctorList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Appointments */}
        <Route 
          path="appointments" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_APPOINTMENTS}>
              <HospitalLayout>
                <AppointmentList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Billing */}
        <Route 
          path="billing" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_BILLING}>
              <HospitalLayout>
                <BillingDashboard />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Laboratory */}
        <Route 
          path="lab" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_LAB_TESTS}>
              <HospitalLayout>
                <LabDashboard />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Reports */}
        <Route 
          path="reports" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <HospitalReportDashboard />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="admin/users" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_USERS}>
              <HospitalLayout>
                <UserManagement />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/departments" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_DEPARTMENTS}>
              <HospitalLayout>
                <DepartmentManagement />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/settings" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.SYSTEM_SETTINGS}>
              <HospitalLayout>
                <SystemSettings />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/audit" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_AUDIT_LOGS}>
              <HospitalLayout>
                <AuditLogs />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </RBACProvider>
  );
};

export default HospitalRoutes;
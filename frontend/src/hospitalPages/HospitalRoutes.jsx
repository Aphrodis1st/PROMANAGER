import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProtectedRoute, RBACProvider, HOSPITAL_ROLES, PERMISSIONS } from '../components/hospital/RBAC';

// Use the older, simpler hospital pages
import HospitalLayout from '../pages/HospitalLayout';
import HospitalDashboard from '../pages/HospitalDashboard';

// Import existing hospital pages for basic functionality
import PatientList from './patients/pages/PatientList';
import PatientCreate from './patients/pages/PatientCreate';
import DoctorList from './doctors/pages/DoctorList';
import AppointmentList from './Appointment/AppointmentList';
import AppointmentCreate from './Appointment/AppointmentCreate';
import AppointmentDetails from './Appointment/AppointmentDetails';
import AppointmentCalendar from './Appointment/AppointmentCalendar';
import BillingDashboard from './billing/pages/BillingDashboard';
import InvoiceList from './billing/pages/InvoiceList';
import CreateInvoice from './billing/pages/CreateInvoice';
import PaymentProcessing from './billing/pages/PaymentProcessing';
import InsuranceClaims from './billing/pages/InsuranceClaims';
import RevenueReports from './billing/pages/RevenueReports';
import BillingSettings from './billing/pages/BillingSettings';
import InvoiceView from './billing/pages/InvoiceView';
import LabDashboard from './lab/pages/LabDashboard';
import LabTestList from './lab/pages/LabTestList';
import CreateLabTest from './lab/pages/CreateLabTest';
import PendingTests from './lab/pages/PendingTests';
import LabResultsEntry from './lab/pages/LabResultsEntry';
import LabResultsView from './lab/pages/LabResultsView';
import LabOrderList from './lab/pages/LabOrderList';
import LabOrderCreateTest from './lab/pages/LabOrderCreateTest';
import MedicalRecordList from './medical-records/MedicalRecordList';
import CreateMedicalRecord from './medical-records/CreateMedicalRecord';
import ViewMedicalRecord from './medical-records/ViewMedicalRecord';
import DiagnosisEntry from './medical-records/DiagnosisEntry';
import PrescriptionEntry from './medical-records/PrescriptionEntry';
import PrescriptionListMedical from './medical-records/PrescriptionList';
import SurgeryRecord from './medical-records/SurgeryRecord';
import SurgeryList from './medical-records/SurgeryList';
import TreatmentPlanList from './medical-records/TreatmentPlanList';
import TreatmentPlan from './medical-records/TreatmentPlan';
import VitalSigns from './medical-records/VitalSigns';
import AdmissionList from './admissions/pages/AdmissionList';
import AdmitPatient from './admissions/pages/AdmitPatient';
import DischargePatient from './admissions/pages/DischargePatient';
import AdmissionDetails from './admissions/pages/AdmissionDetails';
import TransferPatient from './admissions/pages/TransferPatient';
import WardList from './wards/pages/WardList';
import BedAllocation from './wards/pages/BedAllocation';
import BedAvailability from './wards/pages/BedAvailability';
import WardDetails from './wards/pages/WardDetails';
import ICUManagement from './wards/pages/ICUManagement';
import DepartmentList from './departments/DepartmentList';
import DepartmentCreate from './departments/DepartmentCreate';
import DepartmentDetails from './departments/DepartmentDetails';
import AssignHeadOfDepartment from './departments/AssignHeadOfDepartment';
import DepartmentStatistics from './departments/DepartmentStatistics';
import HospitalReportDashboard from './reports/pages/HospitalReportDashboard';
import PatientReports from './reports/pages/PatientReports';
import FinancialReports from './reports/pages/FinancialReports';
import DepartmentReports from './reports/pages/DepartmentReports';
import MedicalRecordReports from './reports/pages/MedicalRecordReports';
import LabReports from './reports/pages/LabReports';
import AuditReports from './reports/pages/AuditReports';
import HospitalProfessionalReport from './reports/pages/HospitalProfessionalReport';
import UserManagement from './admin/pages/UserManagement';
import DepartmentManagement from './admin/pages/DepartmentManagement';
import StaffManagement from './admin/pages/StaffManagement';
import AppointmentSystem from './admin/pages/AppointmentSystem';
import SubAdminManagement from './admin/pages/SubAdminManagement';
import PatientManagement from './admin/pages/PatientManagement';
import AccessControl from './admin/pages/AccessControl';
import AdminProfile from './admin/pages/AdminProfile';
import AdminSettings from './admin/pages/AdminSettings';
import AdminAnalytics from './admin/pages/AdminAnalytics';
import SystemSettings from './admin/pages/SystemSettings';
import AuditLogs from './admin/pages/AuditLogs';

const HospitalRoutes = () => {
  const { user } = useAuth();

  console.log('HospitalRoutes - Current user:', user);

  const getDefaultRoute = () => {
    const userRole = user?.role;
    console.log('getDefaultRoute - userRole:', userRole);
    return '/hospital/admin/dashboard';
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

        <Route 
          path="patients/create" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_PATIENTS}>
              <HospitalLayout>
                <PatientCreate />
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

        <Route 
          path="appointments/create" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_APPOINTMENTS}>
              <HospitalLayout>
                <AppointmentCreate />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="appointments/calendar" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_APPOINTMENTS}>
              <HospitalLayout>
                <AppointmentCalendar />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="appointments/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_APPOINTMENTS}>
              <HospitalLayout>
                <AppointmentDetails />
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

        <Route 
          path="billing/invoices" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_BILLING}>
              <HospitalLayout>
                <InvoiceList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="billing/create" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_BILLING}>
              <HospitalLayout>
                <CreateInvoice />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="billing/invoices/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_BILLING}>
              <HospitalLayout>
                <InvoiceView />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="billing/payment" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_BILLING}>
              <HospitalLayout>
                <PaymentProcessing />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="billing/insurance" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_BILLING}>
              <HospitalLayout>
                <InsuranceClaims />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="billing/reports" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_BILLING}>
              <HospitalLayout>
                <RevenueReports />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="billing/settings" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_BILLING}>
              <HospitalLayout>
                <BillingSettings />
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

        <Route 
          path="lab/tests" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_LAB_TESTS}>
              <HospitalLayout>
                <LabTestList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="lab/create" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_LAB_TESTS}>
              <HospitalLayout>
                <CreateLabTest />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="lab/pending" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_LAB_TESTS}>
              <HospitalLayout>
                <PendingTests />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="lab/orders" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_LAB_TESTS}>
              <HospitalLayout>
                <LabOrderList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="lab/orders/create" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_LAB_TESTS}>
              <HospitalLayout>
                <LabOrderCreateTest />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="lab/results/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_LAB_TESTS}>
              <HospitalLayout>
                <LabResultsView />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="lab/results/entry/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_LAB_TESTS}>
              <HospitalLayout>
                <LabResultsEntry />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Medical Records */}
        <Route 
          path="medical-records" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_MEDICAL_RECORDS}>
              <HospitalLayout>
                <MedicalRecordList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/create" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <CreateMedicalRecord />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_MEDICAL_RECORDS}>
              <HospitalLayout>
                <ViewMedicalRecord />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/:id/diagnosis" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <DiagnosisEntry />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/:id/prescription" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <PrescriptionEntry />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/:id/vital-signs" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <VitalSigns />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/prescriptions" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_MEDICAL_RECORDS}>
              <HospitalLayout>
                <PrescriptionListMedical />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/prescriptions/all" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_MEDICAL_RECORDS}>
              <HospitalLayout>
                <PrescriptionListMedical />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/create-prescription" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <PrescriptionEntry />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/prescription-entry/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <PrescriptionEntry />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/surgeries" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_MEDICAL_RECORDS}>
              <HospitalLayout>
                <SurgeryList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/:id/surgery" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <SurgeryRecord />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/treatment-plans" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_MEDICAL_RECORDS}>
              <HospitalLayout>
                <TreatmentPlanList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="medical-records/:id/treatment-plan" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_MEDICAL_RECORDS}>
              <HospitalLayout>
                <TreatmentPlan />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Admissions */}
        <Route 
          path="admissions" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <AdmissionList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admissions/admit" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_PATIENTS}>
              <HospitalLayout>
                <AdmitPatient />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admissions/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <AdmissionDetails />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admissions/:id/discharge" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_PATIENTS}>
              <HospitalLayout>
                <DischargePatient />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admissions/:id/transfer" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_PATIENTS}>
              <HospitalLayout>
                <TransferPatient />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Wards */}
        <Route 
          path="wards" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <WardList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="wards/availability" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <BedAvailability />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="wards/allocation" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_PATIENTS}>
              <HospitalLayout>
                <BedAllocation />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="wards/icu" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <ICUManagement />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="wards/:id" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_PATIENTS}>
              <HospitalLayout>
                <WardDetails />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        {/* Departments */}
        <Route 
          path="departments" 
          element={
            <ProtectedRoute roles={[HOSPITAL_ROLES.ADMIN, HOSPITAL_ROLES.HOSPITAL_ADMIN]} permissions={PERMISSIONS.VIEW_DEPARTMENTS}>
              <HospitalLayout>
                <DepartmentList />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="departments/create" 
          element={
            <ProtectedRoute roles={[HOSPITAL_ROLES.ADMIN, HOSPITAL_ROLES.HOSPITAL_ADMIN]} permissions={PERMISSIONS.MANAGE_DEPARTMENTS}>
              <HospitalLayout>
                <DepartmentCreate />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="departments/:id" 
          element={
            <ProtectedRoute roles={[HOSPITAL_ROLES.ADMIN, HOSPITAL_ROLES.HOSPITAL_ADMIN]} permissions={PERMISSIONS.VIEW_DEPARTMENTS}>
              <HospitalLayout>
                <DepartmentDetails />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="departments/assign-head/:id" 
          element={
            <ProtectedRoute roles={[HOSPITAL_ROLES.ADMIN, HOSPITAL_ROLES.HOSPITAL_ADMIN]} permissions={PERMISSIONS.MANAGE_DEPARTMENTS}>
              <HospitalLayout>
                <AssignHeadOfDepartment />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="departments/statistics/:id" 
          element={
            <ProtectedRoute roles={[HOSPITAL_ROLES.ADMIN, HOSPITAL_ROLES.HOSPITAL_ADMIN]} permissions={PERMISSIONS.VIEW_DEPARTMENTS}>
              <HospitalLayout>
                <DepartmentStatistics />
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

        {/* Individual Report Routes */}
        <Route 
          path="reports/patients" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <PatientReports />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="reports/financial" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <FinancialReports />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="reports/departments" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <DepartmentReports />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="reports/medical-records" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <MedicalRecordReports />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="reports/lab" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <LabReports />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="reports/audit" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <AuditReports />
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
          path="admin/staff" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_USERS}>
              <HospitalLayout>
                <StaffManagement />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/patients" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_PATIENTS}>
              <HospitalLayout>
                <PatientManagement />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/appointments" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_APPOINTMENTS}>
              <HospitalLayout>
                <AppointmentSystem />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/sub-admins" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_USERS}>
              <HospitalLayout>
                <SubAdminManagement />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/access-control" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.MANAGE_USERS}>
              <HospitalLayout>
                <AccessControl />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/profile" 
          element={
            <ProtectedRoute roles={[HOSPITAL_ROLES.ADMIN, HOSPITAL_ROLES.HOSPITAL_ADMIN]}>
              <HospitalLayout>
                <AdminProfile />
              </HospitalLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="admin/analytics" 
          element={
            <ProtectedRoute permissions={PERMISSIONS.VIEW_REPORTS}>
              <HospitalLayout>
                <AdminAnalytics />
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
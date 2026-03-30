import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RBACProvider } from '../components/hospital/RBAC';
import HospitalProtectedRoute from '../components/hospital/HospitalProtectedRoute';
import HospitalLayout from './HospitalLayout';

// Import all hospital pages
import DashboardOverview from '../hospitalPages/dashboard/DashboardOverview';
import PatientList from '../hospitalPages/patients/pages/PatientList';
import PatientCreate from '../hospitalPages/patients/pages/PatientCreate';
import PatientDetails from '../hospitalPages/patients/pages/PatientDetails';
import PatientEdit from '../hospitalPages/patients/pages/PatientEdit';
import PatientHistory from '../hospitalPages/patients/pages/PatientHistory';
import PatientDocuments from '../hospitalPages/patients/pages/PatientDocuments';
import PatientInsurance from '../hospitalPages/patients/pages/PatientInsurance';
import PatientEmergencyContacts from '../hospitalPages/patients/pages/PatientEmergencyContacts';
import AppointmentList from '../hospitalPages/Appointment/AppointmentList';
import AppointmentDetails from '../hospitalPages/Appointment/AppointmentDetails';
import AppointmentCreate from '../hospitalPages/Appointment/AppointmentCreate';
import AppointmentCalendar from '../hospitalPages/Appointment/AppointmentCalendar';
import DoctorList from '../hospitalPages/doctors/pages/DoctorList';
import CreateDoctor from '../hospitalPages/doctors/pages/CreateDoctor';
import DoctorProfile from '../hospitalPages/doctors/pages/DoctorProfile';
import EditDoctor from '../hospitalPages/doctors/pages/EditDoctor';
import DoctorSchedule from '../hospitalPages/doctors/pages/DoctorSchedule';
import DepartmentList from '../hospitalPages/departments/DepartmentList';
import DepartmentCreate from '../hospitalPages/departments/DepartmentCreate';
import DepartmentDetails from '../hospitalPages/departments/DepartmentDetails';
import AssignHeadOfDepartment from '../hospitalPages/departments/AssignHeadOfDepartment';
import DepartmentStatistics from '../hospitalPages/departments/DepartmentStatistics';
import AdmissionList from '../hospitalPages/admissions/pages/AdmissionList';
import AdmitPatient from '../hospitalPages/admissions/pages/AdmitPatient';
import AdmissionDetails from '../hospitalPages/admissions/pages/AdmissionDetails';
import DischargePatient from '../hospitalPages/admissions/pages/DischargePatient';
import TransferPatient from '../hospitalPages/admissions/pages/TransferPatient';
import WardList from '../hospitalPages/wards/pages/WardList';
import BedAllocation from '../hospitalPages/wards/pages/BedAllocation';
import BedAvailability from '../hospitalPages/wards/pages/BedAvailability';
import WardDetails from '../hospitalPages/wards/pages/WardDetails';
import ICUManagement from '../hospitalPages/wards/pages/ICUManagement';
import LabDashboard from '../hospitalPages/lab/pages/LabDashboard';
import LabTestList from '../hospitalPages/lab/pages/LabTestList';
import CreateLabTest from '../hospitalPages/lab/pages/CreateLabTest';
import LabResultsEntry from '../hospitalPages/lab/pages/LabResultsEntry';
import LabResultsView from '../hospitalPages/lab/pages/LabResultsView';
import PendingTests from '../hospitalPages/lab/pages/PendingTests';
import LabOrderCreateTest from '../hospitalPages/lab/pages/LabOrderCreateTest';
import LabOrderList from '../hospitalPages/lab/pages/LabOrderList';
import LabOrderResultsView from '../hospitalPages/lab/pages/LabOrderResultsView';
import LabResultEntryNew from '../hospitalPages/lab/pages/LabResultEntryNew';
import BillingDashboard from '../hospitalPages/billing/pages/BillingDashboard';
import InvoiceList from '../hospitalPages/billing/pages/InvoiceList';
import CreateInvoice from '../hospitalPages/billing/pages/CreateInvoice';
import PaymentProcessing from '../hospitalPages/billing/pages/PaymentProcessing';
import InsuranceClaims from '../hospitalPages/billing/pages/InsuranceClaims';
import RevenueReports from '../hospitalPages/billing/pages/RevenueReports';
import BillingSettings from '../hospitalPages/billing/pages/BillingSettings';
import InvoiceView from '../hospitalPages/billing/pages/InvoiceView';
import HospitalReportDashboard from '../hospitalPages/reports/pages/HospitalReportDashboard';
import AuditLogs from '../hospitalPages/reports/pages/AuditLogs';
import DepartmentReports from '../hospitalPages/reports/pages/DepartmentReports';
import FinancialReports from '../hospitalPages/reports/pages/FinancialReports';
import LabReports from '../hospitalPages/reports/pages/LabReports';
import PatientReports from '../hospitalPages/reports/pages/PatientReports';
import MedicalRecordReports from '../hospitalPages/reports/pages/MedicalRecordReports';
import MedicalRecordList from '../hospitalPages/medical-records/MedicalRecordList';
import CreateMedicalRecord from '../hospitalPages/medical-records/CreateMedicalRecord';
import ViewMedicalRecord from '../hospitalPages/medical-records/ViewMedicalRecord';
import DiagnosisEntry from '../hospitalPages/medical-records/DiagnosisEntry';
import PrescriptionEntry from '../hospitalPages/medical-records/PrescriptionEntry';
import PrescriptionList from '../hospitalPages/medical-records/PrescriptionList';
import SurgeryRecord from '../hospitalPages/medical-records/SurgeryRecord';
import SurgeryList from '../hospitalPages/medical-records/SurgeryList';
import TreatmentPlanList from '../hospitalPages/medical-records/TreatmentPlanList';
import VitalSigns from '../hospitalPages/medical-records/VitalSigns';
import VitalSignsTrends from '../hospitalPages/medical-records/VitalSignsTrends';
import TreatmentPlan from '../hospitalPages/medical-records/TreatmentPlan';

// Hospital Admin Pages
import HospitalAdminDashboard from '../hospitalPages/admin/pages/HospitalAdminDashboard';
import UserManagement from '../hospitalPages/admin/pages/UserManagement';
import DepartmentManagement from '../hospitalPages/admin/pages/DepartmentManagement';
import StaffManagement from '../hospitalPages/admin/pages/StaffManagement';
import PatientManagement from '../hospitalPages/admin/pages/PatientManagement';
import AppointmentSystem from '../hospitalPages/admin/pages/AppointmentSystem';
import SubAdminManagement from '../hospitalPages/admin/pages/SubAdminManagement';
import AccessControl from '../hospitalPages/admin/pages/AccessControl';
import AdminProfile from '../hospitalPages/admin/pages/AdminProfile';
import AdminSettings from '../hospitalPages/admin/pages/AdminSettings';
import AdminAnalytics from '../hospitalPages/admin/pages/AdminAnalytics';

// RBAC Constants
const ROLES = {
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

const DEPARTMENTS = {
  EMERGENCY: 'emergency',
  ICU: 'icu',
  CARDIOLOGY: 'cardiology',
  LABORATORY: 'laboratory',
  PATHOLOGY: 'pathology',
  PHARMACY: 'pharmacy',
  RADIOLOGY: 'radiology',
  IMAGING: 'imaging',
  SURGERY: 'surgery',
  BILLING: 'billing',
  FINANCE: 'finance',
  PEDIATRICS: 'pediatrics',
  ORTHOPEDICS: 'orthopedics',
  NEUROLOGY: 'neurology',
  ONCOLOGY: 'oncology'
};

const PERMISSIONS = {
  VIEW_PATIENTS: 'viewPatients',
  CREATE_PATIENTS: 'createPatients',
  EDIT_PATIENTS: 'editPatients',
  DELETE_PATIENTS: 'deletePatients',
  VIEW_MEDICAL_RECORDS: 'viewMedicalRecords',
  CREATE_MEDICAL_RECORDS: 'createMedicalRecords',
  EDIT_MEDICAL_RECORDS: 'editMedicalRecords',
  VIEW_PRESCRIPTIONS: 'viewPrescriptions',
  CREATE_PRESCRIPTIONS: 'createPrescriptions',
  EDIT_PRESCRIPTIONS: 'editPrescriptions',
  VIEW_LAB_TESTS: 'viewLabTests',
  ORDER_LAB_TESTS: 'orderLabTests',
  PROCESS_LAB_TESTS: 'processLabTests',
  VIEW_LAB_RESULTS: 'viewLabResults',
  ENTER_LAB_RESULTS: 'enterLabResults',
  VIEW_APPOINTMENTS: 'viewAppointments',
  SCHEDULE_APPOINTMENTS: 'scheduleAppointments',
  MANAGE_APPOINTMENTS: 'manageAppointments',
  VIEW_BILLING: 'viewBilling',
  MANAGE_BILLING: 'manageBilling',
  PROCESS_PAYMENTS: 'processPayments',
  MANAGE_USERS: 'manageUsers',
  MANAGE_DEPARTMENTS: 'manageDepartments',
  VIEW_REPORTS: 'viewReports',
  GENERATE_REPORTS: 'generateReports',
  VIEW_ADMISSIONS: 'viewAdmissions',
  MANAGE_ADMISSIONS: 'manageAdmissions',
  DISCHARGE_PATIENTS: 'dischargePatients'
};

const HospitalRoutes = () => {
  return (
    <RBACProvider>
      <Routes>
        <Route path="/*" element={
          <HospitalProtectedRoute>
            <HospitalLayout />
          </HospitalProtectedRoute>
        }>
          {/* Dashboard - All authenticated users */}
          <Route path="dashboard" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.LAB_TECHNICIAN, ROLES.PHARMACIST, ROLES.RADIOLOGIST, ROLES.RECEPTIONIST, ROLES.BILLING_STAFF]}
            >
              <DashboardOverview />
            </HospitalProtectedRoute>
          } />

          {/* Patient Management Routes */}
          <Route path="patients" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.VIEW_PATIENTS]}
            >
              <PatientList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="patients/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.CREATE_PATIENTS]}
            >
              <PatientCreate />
            </HospitalProtectedRoute>
          } />
          
          <Route path="patients/:id" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.VIEW_PATIENTS]}
            >
              <PatientDetails />
            </HospitalProtectedRoute>
          } />
          
          <Route path="patients/:id/edit" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.EDIT_PATIENTS]}
            >
              <PatientEdit />
            </HospitalProtectedRoute>
          } />
          
          <Route path="patients/:id/history" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE]}
              permissions={[PERMISSIONS.VIEW_MEDICAL_RECORDS]}
            >
              <PatientHistory />
            </HospitalProtectedRoute>
          } />

          {/* Medical Records Routes - Doctors and Nurses only */}
          <Route path="medical-records" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE]}
              permissions={[PERMISSIONS.VIEW_MEDICAL_RECORDS]}
            >
              <MedicalRecordList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="medical-records/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR]}
              permissions={[PERMISSIONS.CREATE_MEDICAL_RECORDS]}
            >
              <CreateMedicalRecord />
            </HospitalProtectedRoute>
          } />
          
          <Route path="medical-records/view/:id" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE]}
              permissions={[PERMISSIONS.VIEW_MEDICAL_RECORDS]}
            >
              <ViewMedicalRecord />
            </HospitalProtectedRoute>
          } />
          
          <Route path="medical-records/diagnosis/:id" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR]}
              permissions={[PERMISSIONS.CREATE_MEDICAL_RECORDS]}
            >
              <DiagnosisEntry />
            </HospitalProtectedRoute>
          } />
          
          <Route path="medical-records/prescription/:id" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR]}
              permissions={[PERMISSIONS.CREATE_PRESCRIPTIONS]}
            >
              <PrescriptionEntry />
            </HospitalProtectedRoute>
          } />
          
          <Route path="medical-records/prescriptions/:id" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PHARMACIST]}
              permissions={[PERMISSIONS.VIEW_PRESCRIPTIONS]}
            >
              <PrescriptionList />
            </HospitalProtectedRoute>
          } />

          {/* Laboratory Routes - Department-based access */}
          <Route path="lab" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.LAB_TECHNICIAN]}
              departments={[DEPARTMENTS.LABORATORY, DEPARTMENTS.PATHOLOGY]}
              permissions={[PERMISSIONS.VIEW_LAB_TESTS]}
            >
              <LabDashboard />
            </HospitalProtectedRoute>
          } />
          
          <Route path="lab/tests" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.LAB_TECHNICIAN]}
              departments={[DEPARTMENTS.LABORATORY, DEPARTMENTS.PATHOLOGY]}
              permissions={[PERMISSIONS.VIEW_LAB_TESTS]}
            >
              <LabTestList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="lab/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.LAB_TECHNICIAN]}
              departments={[DEPARTMENTS.LABORATORY, DEPARTMENTS.PATHOLOGY]}
              permissions={[PERMISSIONS.PROCESS_LAB_TESTS]}
              requireAll={true}
            >
              <CreateLabTest />
            </HospitalProtectedRoute>
          } />
          
          <Route path="lab/results/entry" element={
            <HospitalProtectedRoute
              roles={[ROLES.LAB_TECHNICIAN]}
              departments={[DEPARTMENTS.LABORATORY, DEPARTMENTS.PATHOLOGY]}
              permissions={[PERMISSIONS.ENTER_LAB_RESULTS]}
              requireAll={true}
            >
              <LabResultsEntry />
            </HospitalProtectedRoute>
          } />
          
          <Route path="lab/pending" element={
            <HospitalProtectedRoute
              roles={[ROLES.LAB_TECHNICIAN]}
              departments={[DEPARTMENTS.LABORATORY, DEPARTMENTS.PATHOLOGY]}
              permissions={[PERMISSIONS.PROCESS_LAB_TESTS]}
              requireAll={true}
            >
              <PendingTests />
            </HospitalProtectedRoute>
          } />

          {/* Emergency Department Routes - Department-specific */}
          <Route path="emergency/*" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR, ROLES.NURSE]}
              departments={[DEPARTMENTS.EMERGENCY]}
              requireAll={true}
            >
              <Routes>
                <Route path="patients" element={<PatientList />} />
                <Route path="admissions" element={<AdmissionList />} />
                <Route path="triage" element={<AdmissionList />} />
              </Routes>
            </HospitalProtectedRoute>
          } />

          {/* ICU Routes - Department-specific */}
          <Route path="icu" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR, ROLES.NURSE]}
              departments={[DEPARTMENTS.ICU]}
              requireAll={true}
            >
              <ICUManagement />
            </HospitalProtectedRoute>
          } />

          {/* Pharmacy Routes - Department-specific */}
          <Route path="pharmacy/*" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACIST]}
              departments={[DEPARTMENTS.PHARMACY]}
              permissions={[PERMISSIONS.VIEW_PRESCRIPTIONS]}
            >
              <Routes>
                <Route path="prescriptions" element={<PrescriptionList />} />
                <Route path="dispense" element={
                  <HospitalProtectedRoute
                    roles={[ROLES.PHARMACIST]}
                    departments={[DEPARTMENTS.PHARMACY]}
                    requireAll={true}
                  >
                    <PrescriptionList />
                  </HospitalProtectedRoute>
                } />
              </Routes>
            </HospitalProtectedRoute>
          } />

          {/* Billing Routes - Department-based access */}
          <Route path="billing" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.BILLING_STAFF, ROLES.RECEPTIONIST]}
              departments={[DEPARTMENTS.BILLING, DEPARTMENTS.FINANCE]}
              permissions={[PERMISSIONS.VIEW_BILLING]}
            >
              <BillingDashboard />
            </HospitalProtectedRoute>
          } />
          
          <Route path="billing/invoices" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.BILLING_STAFF, ROLES.RECEPTIONIST]}
              departments={[DEPARTMENTS.BILLING, DEPARTMENTS.FINANCE]}
              permissions={[PERMISSIONS.VIEW_BILLING]}
            >
              <InvoiceList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="billing/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.BILLING_STAFF]}
              departments={[DEPARTMENTS.BILLING, DEPARTMENTS.FINANCE]}
              permissions={[PERMISSIONS.MANAGE_BILLING]}
              requireAll={true}
            >
              <CreateInvoice />
            </HospitalProtectedRoute>
          } />
          
          <Route path="billing/payment" element={
            <HospitalProtectedRoute
              roles={[ROLES.BILLING_STAFF, ROLES.RECEPTIONIST]}
              departments={[DEPARTMENTS.BILLING, DEPARTMENTS.FINANCE]}
              permissions={[PERMISSIONS.PROCESS_PAYMENTS]}
            >
              <PaymentProcessing />
            </HospitalProtectedRoute>
          } />

          {/* Appointments Routes */}
          <Route path="appointments" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.VIEW_APPOINTMENTS]}
            >
              <AppointmentList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="appointments/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.SCHEDULE_APPOINTMENTS]}
            >
              <AppointmentCreate />
            </HospitalProtectedRoute>
          } />
          
          <Route path="appointments/calendar" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.VIEW_APPOINTMENTS]}
            >
              <AppointmentCalendar />
            </HospitalProtectedRoute>
          } />

          {/* Doctor Management Routes */}
          <Route path="doctors" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
            >
              <DoctorList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="doctors/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_USERS]}
            >
              <CreateDoctor />
            </HospitalProtectedRoute>
          } />
          
          <Route path="doctors/:id/schedule" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR]}
            >
              <DoctorSchedule />
            </HospitalProtectedRoute>
          } />

          {/* Department Management Routes */}
          <Route path="departments" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE]}
            >
              <DepartmentList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="departments/create" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_DEPARTMENTS]}
            >
              <DepartmentCreate />
            </HospitalProtectedRoute>
          } />

          {/* Admissions Routes */}
          <Route path="admissions" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}
              permissions={[PERMISSIONS.VIEW_ADMISSIONS]}
            >
              <AdmissionList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admissions/admit" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR, ROLES.NURSE]}
              permissions={[PERMISSIONS.MANAGE_ADMISSIONS]}
            >
              <AdmitPatient />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admissions/:id/discharge" element={
            <HospitalProtectedRoute
              roles={[ROLES.DOCTOR]}
              permissions={[PERMISSIONS.DISCHARGE_PATIENTS]}
            >
              <DischargePatient />
            </HospitalProtectedRoute>
          } />

          {/* Ward Management Routes */}
          <Route path="wards" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE]}
            >
              <WardList />
            </HospitalProtectedRoute>
          } />
          
          <Route path="wards/allocation" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.NURSE]}
            >
              <BedAllocation />
            </HospitalProtectedRoute>
          } />

          {/* Reports Routes - Permission-based */}
          <Route path="reports" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.BILLING_STAFF]}
              permissions={[PERMISSIONS.VIEW_REPORTS]}
            >
              <HospitalReportDashboard />
            </HospitalProtectedRoute>
          } />
          
          <Route path="reports/department" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR]}
              permissions={[PERMISSIONS.VIEW_REPORTS]}
            >
              <DepartmentReports />
            </HospitalProtectedRoute>
          } />
          
          <Route path="reports/financial" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.BILLING_STAFF]}
              departments={[DEPARTMENTS.BILLING, DEPARTMENTS.FINANCE]}
              permissions={[PERMISSIONS.VIEW_REPORTS]}
              requireAll={true}
            >
              <FinancialReports />
            </HospitalProtectedRoute>
          } />
          
          <Route path="reports/lab" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN, ROLES.DOCTOR, ROLES.LAB_TECHNICIAN]}
              departments={[DEPARTMENTS.LABORATORY, DEPARTMENTS.PATHOLOGY]}
              permissions={[PERMISSIONS.VIEW_REPORTS]}
            >
              <LabReports />
            </HospitalProtectedRoute>
          } />
          
          <Route path="reports/audit" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.VIEW_REPORTS]}
            >
              <AuditLogs />
            </HospitalProtectedRoute>
          } />

          {/* Hospital Admin Routes - Admin Only */}
          <Route path="admin/dashboard" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              requireAll={true}
            >
              <HospitalAdminDashboard />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/users" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_USERS]}
              requireAll={true}
            >
              <UserManagement />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/departments" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_DEPARTMENTS]}
              requireAll={true}
            >
              <DepartmentManagement />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/staff" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_USERS]}
              requireAll={true}
            >
              <StaffManagement />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/patients" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_USERS]}
              requireAll={true}
            >
              <PatientManagement />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/appointments" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.MANAGE_APPOINTMENTS]}
              requireAll={true}
            >
              <AppointmentSystem />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/sub-admin" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN]}
              permissions={[PERMISSIONS.MANAGE_USERS]}
              requireAll={true}
            >
              <SubAdminManagement />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/access-control" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN]}
              permissions={[PERMISSIONS.MANAGE_USERS]}
              requireAll={true}
            >
              <AccessControl />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/profile" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
            >
              <AdminProfile />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/settings" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
            >
              <AdminSettings />
            </HospitalProtectedRoute>
          } />
          
          <Route path="admin/analytics" element={
            <HospitalProtectedRoute
              roles={[ROLES.HOSPITAL_ADMIN, ROLES.ADMIN]}
              permissions={[PERMISSIONS.VIEW_REPORTS]}
            >
              <AdminAnalytics />
            </HospitalProtectedRoute>
          } />
        </Route>
      </Routes>
    </RBACProvider>
  );
};

export default HospitalRoutes;
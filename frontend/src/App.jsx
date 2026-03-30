import React from 'react';
import { Routes, Route } from 'react-router-dom';

import AppLayout from "./AppLayout.jsx";
import InventoryPage from './pages/stock/ProductsPage.jsx';
import PurchasesPage from './pages/stock/PurchasesPage.jsx';
import DispensePage from './pages/stock/DispensePage.jsx';
import TransfersPage from './pages/stock/TransfersPage.jsx';
import AdjustmentsPage from './pages/stock/AdjustmentsPage.jsx';
import ReturnsPage from './pages/stock/ReturnsPage.jsx';
import GeneralJournalPage from './pages/stock/JournalsPage.jsx';
import ProductSettingsPage from './pages/stock/ProductSettingsPage.jsx';
import ChartOfAccountsPage from './pages/stock/ChartOfAccountsPage.jsx';
import SalesPage from './pages/stock/SalesPage.jsx';
import ExpensesPage from './pages/stock/ExpensesPage.jsx';
import ReportsDashboard from './pages/stock/ReportsDashboard.jsx';
import FixedAssetsPage from './pages/stock/FixedAssetsPage.jsx';
import ProductionPlanPage from './pages/production/ProductionPlanPage.jsx';
import ProductionCostPage from './pages/production/ProductionCostPage.jsx';
import ProductionPlanningPage from './pages/production/ProductionPlanningPage.jsx';
import ProductionReportsPage from './pages/production/ProductionReportsPage.jsx';
import FinishedGoodsPage from './pages/production/FinishedGoodsPage.jsx';
import MaterialConsumptionPage from './pages/production/MaterialConsumptionPage.jsx';
import ProductionCyclePage from './pages/production/ProductionCyclePage.jsx';
import InvoicePage from './pages/stock/InvoicePage.jsx';
import UserSettingsPage from './pages/stock/UserSettingsPage.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { AppProvider } from './context/AppStateContext.jsx';
import { StockProvider } from './context/stockContext.jsx';
import { StockAuthProvider } from './context/StockAuthContext.jsx';
import { JournalProvider } from "./context/JournalContext";
import { ExpenseProvider } from './context/ExpenseContext';
import { ReportsProvider } from './context/ReportsContext.jsx';
import { FixedAssetProvider } from './context/FixedAssetContext.jsx';
import { ProductionProvider } from './context/ProductionContext.jsx';
import { HospitalAuthProvider } from './context/HospitalAuthContext.jsx';
import HospitalProvider from './context/HospitalProvider.jsx';
import StockProtectedRoute from './components/stock/StockProtectedRoute.jsx';
import HospitalProtectedRoute from './components/hospital/HospitalProtectedRoute.jsx';

// Hospital Pages
import HospitalRoutes from './hospitalPages/HospitalRoutes.jsx';
import DashboardOverview from './hospitalPages/dashboard/DashboardOverview.jsx';
import PatientList from './hospitalPages/patients/pages/PatientList.jsx';
import PatientCreate from './hospitalPages/patients/pages/PatientCreate.jsx';
import PatientDetails from './hospitalPages/patients/pages/PatientDetails.jsx';
import PatientEdit from './hospitalPages/patients/pages/PatientEdit.jsx';
import PatientHistory from './hospitalPages/patients/pages/PatientHistory.jsx';
import PatientDocuments from './hospitalPages/patients/pages/PatientDocuments.jsx';
import PatientInsurance from './hospitalPages/patients/pages/PatientInsurance.jsx';
import PatientEmergencyContacts from './hospitalPages/patients/pages/PatientEmergencyContacts.jsx';
import AppointmentList from './hospitalPages/Appointment/AppointmentList.jsx';
import AppointmentDetails from './hospitalPages/Appointment/AppointmentDetails.jsx';
import AppointmentCreate from './hospitalPages/Appointment/AppointmentCreate.jsx';
import AppointmentCalendar from './hospitalPages/Appointment/AppointmentCalendar.jsx';
import DoctorList from './hospitalPages/Dactors/DoctorList.jsx';
import DoctorSchedule from './hospitalPages/Dactors/DoctorSchedule.jsx';
import DoctorSpecialization from './hospitalPages/Dactors/DoctorSpecialization.jsx';
import WardList from './hospitalPages/wards/pages/WardList.jsx';
import BedAllocation from './hospitalPages/wards/pages/BedAllocation.jsx';
import BedAvailability from './hospitalPages/wards/pages/BedAvailability.jsx';
import WardDetails from './hospitalPages/wards/pages/WardDetails.jsx';
import ICUManagement from './hospitalPages/wards/pages/ICUManagement.jsx';
import LabDashboard from './hospitalPages/lab/pages/LabDashboard.jsx';
import LabTestList from './hospitalPages/lab/pages/LabTestList.jsx';
import CreateLabTest from './hospitalPages/lab/pages/CreateLabTest.jsx';
import LabResultsEntry from './hospitalPages/lab/pages/LabResultsEntry.jsx';
import LabResultsView from './hospitalPages/lab/pages/LabResultsView.jsx';
import PendingTests from './hospitalPages/lab/pages/PendingTests.jsx';
import LabOrderCreateTest from './hospitalPages/lab/pages/LabOrderCreateTest.jsx';
import LabOrderList from './hospitalPages/lab/pages/LabOrderList.jsx';
import LabOrderResultsView from './hospitalPages/lab/pages/LabOrderResultsView.jsx';
import LabResultEntryNew from './hospitalPages/lab/pages/LabResultEntryNew.jsx';
import BillingDashboard from './hospitalPages/billing/pages/BillingDashboard.jsx';
import InvoiceList from './hospitalPages/billing/pages/InvoiceList.jsx';
import CreateInvoice from './hospitalPages/billing/pages/CreateInvoice.jsx';
import PaymentProcessing from './hospitalPages/billing/pages/PaymentProcessing.jsx';
import InsuranceClaims from './hospitalPages/billing/pages/InsuranceClaims.jsx';
import RevenueReports from './hospitalPages/billing/pages/RevenueReports.jsx';
import BillingSettings from './hospitalPages/billing/pages/BillingSettings.jsx';
import InvoiceView from './hospitalPages/billing/pages/InvoiceView.jsx';
import HospitalReportDashboard from './hospitalPages/reports/pages/HospitalReportDashboard.jsx';
import AuditLogs from './hospitalPages/reports/pages/AuditLogs.jsx';
import DepartmentReports from './hospitalPages/reports/pages/DepartmentReports.jsx';
import FinancialReports from './hospitalPages/reports/pages/FinancialReports.jsx';
import LabReports from './hospitalPages/reports/pages/LabReports.jsx';
import PatientReports from './hospitalPages/reports/pages/PatientReports.jsx';
import MedicalRecordReports from './hospitalPages/reports/pages/MedicalRecordReports.jsx';
import AdmissionList from './hospitalPages/admissions/pages/AdmissionList.jsx';
import AdmitPatient from './hospitalPages/admissions/pages/AdmitPatient.jsx';
import DischargePatient from './hospitalPages/admissions/pages/DischargePatient.jsx';
import AdmissionDetails from './hospitalPages/admissions/pages/AdmissionDetails.jsx';
import TransferPatient from './hospitalPages/admissions/pages/TransferPatient.jsx';
import MedicalRecordList from './hospitalPages/medical-records/MedicalRecordList.jsx';
import CreateMedicalRecord from './hospitalPages/medical-records/CreateMedicalRecord.jsx';
import ViewMedicalRecord from './hospitalPages/medical-records/ViewMedicalRecord.jsx';
import DiagnosisEntry from './hospitalPages/medical-records/DiagnosisEntry.jsx';
import PrescriptionEntry from './hospitalPages/medical-records/PrescriptionEntry.jsx';
import PrescriptionListMedical from './hospitalPages/medical-records/PrescriptionList.jsx';
import SurgeryRecord from './hospitalPages/medical-records/SurgeryRecord.jsx';
import SurgeryList from './hospitalPages/medical-records/SurgeryList.jsx';
import TreatmentPlanList from './hospitalPages/medical-records/TreatmentPlanList.jsx';
import VitalSigns from './hospitalPages/medical-records/VitalSigns.jsx';
import VitalSignsTrends from './hospitalPages/medical-records/VitalSignsTrends.jsx';
import TreatmentPlan from './hospitalPages/medical-records/TreatmentPlan.jsx';
import DepartmentList from './hospitalPages/departments/DepartmentList.jsx';
import DepartmentCreate from './hospitalPages/departments/DepartmentCreate.jsx';
import DepartmentDetails from './hospitalPages/departments/DepartmentDetails.jsx';
import AssignHeadOfDepartment from './hospitalPages/departments/AssignHeadOfDepartment.jsx';
import DepartmentStatistics from './hospitalPages/departments/DepartmentStatistics.jsx';
import DoctorListNew from './hospitalPages/doctors/pages/DoctorList.jsx';
import CreateDoctor from './hospitalPages/doctors/pages/CreateDoctor.jsx';
import DoctorProfileNew from './hospitalPages/doctors/pages/DoctorProfile.jsx';
import EditDoctor from './hospitalPages/doctors/pages/EditDoctor.jsx';
import DoctorScheduleNew from './hospitalPages/doctors/pages/DoctorSchedule.jsx';

// Hospital Admin Pages
import HospitalAdminDashboard from './hospitalPages/admin/pages/HospitalAdminDashboard.jsx';
import UserManagement from './hospitalPages/admin/pages/UserManagement.jsx';
import DepartmentManagement from './hospitalPages/admin/pages/DepartmentManagement.jsx';
import StaffManagement from './hospitalPages/admin/pages/StaffManagement.jsx';
import PatientManagement from './hospitalPages/admin/pages/PatientManagement.jsx';
import AppointmentSystem from './hospitalPages/admin/pages/AppointmentSystem.jsx';
import SubAdminManagement from './hospitalPages/admin/pages/SubAdminManagement.jsx';
import AccessControl from './hospitalPages/admin/pages/AccessControl.jsx';
import AdminProfile from './hospitalPages/admin/pages/AdminProfile.jsx';
import AdminSettings from './hospitalPages/admin/pages/AdminSettings.jsx';
import AdminAnalytics from './hospitalPages/admin/pages/AdminAnalytics.jsx';
import AdminProtectedRoute from './components/hospital/AdminProtectedRoute.jsx';

// Pharmacy Pages
import PharmacyLayout from './pharmacy/components/PharmacyLayout.jsx';
import PharmacyDashboard from './pharmacy/pages/dashboard/PharmacyDashboard.jsx';
import PharmaciesPage from './pharmacy/pages/doctors/Pharmacies.jsx';
import PrescriptionList from './pharmacy/pages/prescriptions/PrescriptionList.jsx';
import QuoteList from './pharmacy/pages/quotes/QuoteList.jsx';
import OrderList from './pharmacy/pages/orders/OrderList.jsx';
import CallCenter from './pharmacy/pages/callcenter/CallCenter.jsx';

// Service Selection and Dashboards
import ServiceSelection from './pages/ServiceSelection.jsx';
import StockDashboard from './pages/StockDashboard.jsx';
import PharmacyServicesDashboard from './pages/PharmacyServicesDashboard.jsx';

// Auth Pages
import StockLogin from './pages/auth/StockLogin.jsx';
import HospitalLogin from './pages/auth/HospitalLogin.jsx';
import PharmacyLogin from './pages/auth/PharmacyLogin.jsx';
import StockRegister from './pages/auth/StockRegister.jsx';
import SuperAdminLogin from './pages/auth/SuperAdminLogin.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import AuthDebug from './pages/AuthDebug.jsx';

// Super Admin Pages
import SuperAdminDashboard from './pages/superAdmin/SuperAdminDashboard.jsx';
import HospitalManagement from './pages/superAdmin/HospitalManagement.jsx';
import HospitalAdminManagement from './pages/superAdmin/HospitalAdminManagement.jsx';
import SystemActivity from './pages/superAdmin/SystemActivity.jsx';
import SuperAdminSettings from './pages/superAdmin/SuperAdminSettings.jsx';

function AppContent() {
  return (
    <Routes>
      {/* Service Selection - Main Entry Point */}
      <Route path='/' element={<ServiceSelection />} />

      {/* Independent Service Dashboards */}
      <Route path='/stock/dashboard' element={<StockDashboard />} />
      <Route path='/pharmacy/dashboard' element={<PharmacyServicesDashboard />} />

      {/* Authentication Routes */}
      <Route path='/stock/login' element={<StockLogin />} />
      <Route path='/hospital/login' element={<HospitalLogin />} />
      <Route path='/pharmacy/login' element={<PharmacyLogin />} />
      <Route path='/super-admin/login' element={<SuperAdminLogin />} />
      <Route path='/stock/register' element={<StockRegister />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
      <Route path='/debug' element={<AuthDebug />} />

      {/* Super Admin Routes */}
      <Route path='/super-admin/dashboard' element={<SuperAdminDashboard />} />
      <Route path='/super-admin/hospitals' element={<HospitalManagement />} />
      <Route path='/super-admin/hospital-admins' element={<HospitalAdminManagement />} />
      <Route path='/super-admin/activity' element={<SystemActivity />} />
      <Route path='/super-admin/settings' element={<SuperAdminSettings />} />

      {/* Stock Routes */}
      <Route path='/stock/*' element={<AppLayout />}>
        <Route path='inventory' element={<StockProtectedRoute roles={["ADMIN","MANAGER","STOREKEEPER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}><InventoryPage /></StockProtectedRoute>} />
        <Route path='purchases' element={<StockProtectedRoute roles={["ADMIN","PURCHASER","MANAGER","ACCOUNTANT"]} departments={["Purchasing","Finance"]}><PurchasesPage /></StockProtectedRoute>} />
        <Route path='sales' element={<StockProtectedRoute roles={["ADMIN","SALES","MANAGER","ACCOUNTANT"]} departments={["Sales","Finance"]}><SalesPage /></StockProtectedRoute>} />
        <Route path="invoice/:id" element={<StockProtectedRoute roles={["ADMIN","SALES","MANAGER","ACCOUNTANT"]} departments={["Sales","Finance"]}><InvoicePage /></StockProtectedRoute>} />
        <Route path='dispense' element={<StockProtectedRoute roles={["ADMIN","STOREKEEPER","MANAGER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}><DispensePage /></StockProtectedRoute>} />
        <Route path='transfers' element={<StockProtectedRoute roles={["ADMIN","STOREKEEPER","MANAGER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}><TransfersPage /></StockProtectedRoute>} />
        <Route path='adjustments' element={<StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance","Warehouse"]}><AdjustmentsPage /></StockProtectedRoute>} />
        <Route path='returns' element={<StockProtectedRoute roles={["ADMIN","STOREKEEPER","MANAGER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}><ReturnsPage /></StockProtectedRoute>} />
        <Route path='general-journal' element={<StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}><GeneralJournalPage /></StockProtectedRoute>} />
        <Route path='Product-Settings' element={<StockProtectedRoute roles={["ADMIN","MANAGER"]}><ProductSettingsPage /></StockProtectedRoute>} />
        <Route path='charts-of-accounts' element={<StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}><ChartOfAccountsPage /></StockProtectedRoute>} />
        <Route path='user-settings' element={<StockProtectedRoute roles={["ADMIN","MANAGER","STOREKEEPER","ACCOUNTANT","PURCHASER","SALES","PRODUCTIONMANAGER"]}><UserSettingsPage /></StockProtectedRoute>} />
        <Route path='expenses' element={<StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}><ExpensesPage /></StockProtectedRoute>} />
        <Route path='reports-dashboard' element={<StockProtectedRoute roles={["ADMIN","MANAGER","ACCOUNTANT"]}><ReportsDashboard /></StockProtectedRoute>} />
        <Route path='fixed-assets' element={<StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}><FixedAssetsPage /></StockProtectedRoute>} />
        <Route path='production-plan' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER"]} departments={["Production"]}><ProductionPlanPage /></StockProtectedRoute>} />
        <Route path='production-cost' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","ACCOUNTANT"]} departments={["Production","Finance"]}><ProductionCostPage /></StockProtectedRoute>} />
        <Route path='production-planning' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER"]} departments={["Production"]}><ProductionPlanningPage /></StockProtectedRoute>} />
        <Route path='finished-goods' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","STOREKEEPER","ACCOUNTANT"]} departments={["Production","Warehouse","Finance"]}><FinishedGoodsPage /></StockProtectedRoute>} />
        <Route path='production-reports' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER","ACCOUNTANT"]} departments={["Production","Finance"]}><ProductionReportsPage /></StockProtectedRoute>} />
        <Route path='Material-consumptions' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","STOREKEEPER","ACCOUNTANT"]} departments={["Production","Warehouse","Finance"]}><MaterialConsumptionPage /></StockProtectedRoute>} />
        <Route path='production-cycle' element={<StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER"]} departments={["Production"]}><ProductionCyclePage /></StockProtectedRoute>} />
      </Route>

      {/* Hospital Routes — RBAC Protected with comprehensive role and department access control */}
      <Route path='/hospital/*' element={<HospitalRoutes />} />

      {/* Pharmacy Routes */}
      <Route path='/pharmacy/*' element={<PharmacyLayout />}>
        <Route path='doctors' element={<PharmaciesPage />} />
        <Route path='prescriptions' element={<PrescriptionList />} />
        <Route path='prescriptions/create' element={<PrescriptionList />} />
        <Route path='prescriptions/verify' element={<PrescriptionList />} />
        <Route path='quotes' element={<QuoteList />} />
        <Route path='quotes/create' element={<QuoteList />} />
        <Route path='quotes/pending' element={<QuoteList />} />
        <Route path='orders' element={<OrderList />} />
        <Route path='orders/create' element={<OrderList />} />
        <Route path='orders/tracking' element={<OrderList />} />
        <Route path='branding' element={<PharmacyDashboard />} />
        <Route path='branding/campaigns' element={<PharmacyDashboard />} />
        <Route path='payments' element={<PharmacyDashboard />} />
        <Route path='payments/process' element={<PharmacyDashboard />} />
        <Route path='payments/reports' element={<PharmacyDashboard />} />
        <Route path='callcenter' element={<CallCenter />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <HospitalAuthProvider>
          <HospitalProvider>
            <StockAuthProvider>
              <StockProvider>
                <JournalProvider>
                  <ExpenseProvider>
                    <ReportsProvider>
                      <FixedAssetProvider>
                        <ProductionProvider>
                          <AppContent />
                        </ProductionProvider>
                      </FixedAssetProvider>
                    </ReportsProvider>
                  </ExpenseProvider>
                </JournalProvider>
              </StockProvider>
            </StockAuthProvider>
          </HospitalProvider>
        </HospitalAuthProvider>
      </AppProvider>
    </AuthProvider>
  );
}

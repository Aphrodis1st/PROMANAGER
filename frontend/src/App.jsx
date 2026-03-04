// frontend/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import UnifiedLogin from './pages/UnifiedLogin.jsx';
import UnifiedRegister from './pages/UnifiedRegister.jsx';
import Home from './pages/Home.jsx';
import Pharmacies from './pages/Pharmacies.jsx';
import Prescription from './pages/Prescription.jsx';
import Quotes from './pages/Quotes.jsx';
import Orders from './pages/Orders.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Clinics from './pages/Clinics.jsx';
import Branding from './pages/Branding.jsx';
import Payments from './pages/Payments.jsx';
import PharmacyRx from './pages/PharmacyRx.jsx';
import CallCenterDashboard from './pages/CallCenterDashboard.jsx';

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
import HospitalProvider from './context/HospitalProvider.jsx';
import StockProtectedRoute from './components/stock/StockProtectedRoute.jsx';

// Hospital Pages
import HospitalLayout from './pages/HospitalLayout.jsx';
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
import LabOrderCreate from './hospitalPages/lab/pages/LabOrderCreate.jsx';
import LabOrderList from './hospitalPages/lab/pages/LabOrderList.jsx';
import LabResultEntryNew from './hospitalPages/lab/pages/LabResultEntryNew.jsx';
import BillingDashboard from './hospitalPages/billing/pages/BillingDashboard.jsx';
import InvoiceList from './hospitalPages/billing/pages/InvoiceList.jsx';
import CreateInvoice from './hospitalPages/billing/pages/CreateInvoice.jsx';
import PaymentProcessing from './hospitalPages/billing/pages/PaymentProcessing.jsx';
import InsuranceClaims from './hospitalPages/billing/pages/InsuranceClaims.jsx';
import RevenueReports from './hospitalPages/billing/pages/RevenueReports.jsx';
import HospitalReportDashboard from './hospitalPages/reports/pages/HospitalReportDashboard.jsx';
import AuditLogs from './hospitalPages/reports/pages/AuditLogs.jsx';
import DepartmentReports from './hospitalPages/reports/pages/DepartmentReports.jsx';
import FinancialReports from './hospitalPages/reports/pages/FinancialReports.jsx';
import LabReports from './hospitalPages/reports/pages/LabReports.jsx';
import PatientReports from './hospitalPages/reports/pages/PatientReports.jsx';
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
import SurgeryRecord from './hospitalPages/medical-records/SurgeryRecord.jsx';
import VitalSigns from './hospitalPages/medical-records/VitalSigns.jsx';
import VitalSignsTrends from './hospitalPages/medical-records/VitalSignsTrends.jsx';
import TreatmentPlan from './hospitalPages/medical-records/TreatmentPlan.jsx';
import DepartmentList from './hospitalPages/departments/DepartmentList.jsx';
import DoctorListNew from './hospitalPages/doctors/pages/DoctorList.jsx';
import CreateDoctor from './hospitalPages/doctors/pages/CreateDoctor.jsx';
import DoctorProfileNew from './hospitalPages/doctors/pages/DoctorProfile.jsx';
import EditDoctor from './hospitalPages/doctors/pages/EditDoctor.jsx';
import DoctorScheduleNew from './hospitalPages/doctors/pages/DoctorSchedule.jsx';

function AppContent() {
  return (
    <Routes>
      {/* Public / top-level pages */}
      <Route path='/' element={
        <>
          <Navbar />
          <main className="pt-16 pb-16 min-h-screen bg-gray-100">
            <Home />
          </main>
          <Footer />
        </>
      } />
      <Route path='/login' element={<UnifiedLogin />} />
      <Route path='/register' element={<UnifiedRegister />} />
      <Route path='/pharmacies' element={<Pharmacies />} />
      <Route path='/prescription' element={<Prescription />} />
      <Route path='/quotes' element={<Quotes />} />
      <Route path='/orders' element={<Orders />} />
      <Route path='/clinics' element={<Clinics />} />
      <Route path='/branding' element={<Branding />} />
      <Route path='/payments' element={<Payments />} />
      <Route path='/admin' element={<AdminDashboard />} />
      <Route path='/pharmacy-rx' element={<PharmacyRx />} />
      <Route path='/callcenter' element={<CallCenterDashboard />} />

      {/* Stock Dashboard pages */}
      <Route path='/stock/*' element={<AppLayout />}>
        <Route path='inventory' element={
          <StockProtectedRoute roles={["ADMIN","MANAGER","STOREKEEPER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}>
            <InventoryPage />
          </StockProtectedRoute>
        } />
        <Route path='purchases' element={
          <StockProtectedRoute roles={["ADMIN","PURCHASER","MANAGER","ACCOUNTANT"]} departments={["Purchasing","Finance"]}>
            <PurchasesPage />
          </StockProtectedRoute>
        } />
        <Route path='sales' element={
          <StockProtectedRoute roles={["ADMIN","SALES","MANAGER","ACCOUNTANT"]} departments={["Sales","Finance"]}>
            <SalesPage />
          </StockProtectedRoute>
        } />
        <Route path="invoice/:id" element={
          <StockProtectedRoute roles={["ADMIN","SALES","MANAGER","ACCOUNTANT"]} departments={["Sales","Finance"]}>
            <InvoicePage />
          </StockProtectedRoute>
        } />
        <Route path='dispense' element={
          <StockProtectedRoute roles={["ADMIN","STOREKEEPER","MANAGER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}>
            <DispensePage />
          </StockProtectedRoute>
        } />
        <Route path='transfers' element={
          <StockProtectedRoute roles={["ADMIN","STOREKEEPER","MANAGER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}>
            <TransfersPage />
          </StockProtectedRoute>
        } />
        <Route path='adjustments' element={
          <StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER","ACCOUNTANT"]} departments={["Finance","Warehouse","Finance"]}>
            <AdjustmentsPage />
          </StockProtectedRoute>
        } />
        <Route path='returns' element={
          <StockProtectedRoute roles={["ADMIN","STOREKEEPER","MANAGER","ACCOUNTANT"]} departments={["Warehouse","Finance"]}>
            <ReturnsPage />
          </StockProtectedRoute>
        } />
        <Route path='general-journal' element={
          <StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}>
            <GeneralJournalPage />
          </StockProtectedRoute>
        } />
        <Route path='Product-Settings' element={
          <StockProtectedRoute roles={["ADMIN","MANAGER"]}>
            <ProductSettingsPage />
          </StockProtectedRoute>
        } />
        <Route path='charts-of-accounts' element={
          <StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}>
            <ChartOfAccountsPage />
          </StockProtectedRoute>
        } />
        <Route path='user-settings' element={
          <StockProtectedRoute roles={["ADMIN","MANAGER","STOREKEEPER","ACCOUNTANT","PURCHASER","SALES","PRODUCTIONMANAGER"]}>
            <UserSettingsPage />
          </StockProtectedRoute>
        } />
        <Route path='expenses' element={
          <StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}>
            <ExpensesPage />
          </StockProtectedRoute>
        } />
        <Route path='reports-dashboard' element={
          <StockProtectedRoute roles={["ADMIN","MANAGER","ACCOUNTANT"]}>
            <ReportsDashboard />
          </StockProtectedRoute>
        } />
        <Route path='fixed-assets' element={
          <StockProtectedRoute roles={["ADMIN","ACCOUNTANT","MANAGER"]} departments={["Finance"]}>
            <FixedAssetsPage />
          </StockProtectedRoute>
        } />
        {/* Production Pages */}
        <Route path='production-plan' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER"]} departments={["Production"]}>
            <ProductionPlanPage />
          </StockProtectedRoute>
        } />
        <Route path='production-cost' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","ACCOUNTANT"]} departments={["Production","Finance"]}>
            <ProductionCostPage />
          </StockProtectedRoute>
        } />
        <Route path='production-planning' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER"]} departments={["Production"]}>
            <ProductionPlanningPage />
          </StockProtectedRoute>
        } />
        <Route path='finished-goods' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","STOREKEEPER","ACCOUNTANT"]} departments={["Production","Warehouse","Finance"]}>
            <FinishedGoodsPage />
          </StockProtectedRoute>
        } />
        <Route path='production-reports' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER","ACCOUNTANT"]} departments={["Production","Finance"]}>
            <ProductionReportsPage />
          </StockProtectedRoute>
        } />
        <Route path='Material-consumptions' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","STOREKEEPER","ACCOUNTANT"]} departments={["Production","Warehouse","Finance"]}>
            <MaterialConsumptionPage />
          </StockProtectedRoute>
        } />
        <Route path='production-cycle' element={
          <StockProtectedRoute roles={["ADMIN","PRODUCTIONMANAGER","MANAGER"]} departments={["Production"]}>
            <ProductionCyclePage />
          </StockProtectedRoute>
        } />
      </Route>

      {/* Hospital Routes */}
      <Route path='/hospital/*' element={<HospitalLayout />}>
        <Route path='dashboard' element={<DashboardOverview />} />
        <Route path='patients' element={<PatientList />} />
        <Route path='patients/create' element={<PatientCreate />} />
        <Route path='patients/:id' element={<PatientDetails />} />
        <Route path='patients/:id/edit' element={<PatientEdit />} />
        <Route path='patients/:id/history' element={<PatientHistory />} />
        <Route path='patients/:id/documents' element={<PatientDocuments />} />
        <Route path='patients/:id/insurance' element={<PatientInsurance />} />
        <Route path='patients/:id/emergency-contacts' element={<PatientEmergencyContacts />} />
        <Route path='appointments' element={<AppointmentList />} />
        <Route path='appointments/create' element={<AppointmentCreate />} />
        <Route path='appointments/calendar' element={<AppointmentCalendar />} />
        <Route path='doctors' element={<DoctorListNew />} />
        <Route path='doctors/create' element={<CreateDoctor />} />
        <Route path='doctors/:id' element={<DoctorProfileNew />} />
        <Route path='doctors/:id/edit' element={<EditDoctor />} />
        <Route path='doctors/:id/schedule' element={<DoctorScheduleNew />} />
        <Route path='doctors/schedule' element={<DoctorScheduleNew />} />
        <Route path='doctors/specialization' element={<DoctorSpecialization />} />
        <Route path='departments' element={<DepartmentList />} />
        <Route path='admissions' element={<AdmissionList />} />
        <Route path='admissions/admit' element={<AdmitPatient />} />
        <Route path='admissions/:id' element={<AdmissionDetails />} />
        <Route path='admissions/:id/discharge' element={<DischargePatient />} />
        <Route path='admissions/:id/transfer' element={<TransferPatient />} />
        <Route path='wards' element={<WardList />} />
        <Route path='wards/allocation' element={<BedAllocation />} />
        <Route path='wards/availability' element={<BedAvailability />} />
        <Route path='wards/:id' element={<WardDetails />} />
        <Route path='wards/icu' element={<ICUManagement />} />
        <Route path='lab' element={<LabDashboard />} />
        <Route path='lab/tests' element={<LabTestList />} />
        <Route path='lab/create' element={<CreateLabTest />} />
        <Route path='lab/results/entry' element={<LabResultsEntry />} />
        <Route path='lab/results/:id' element={<LabResultsView />} />
        <Route path='lab/pending' element={<PendingTests />} />
        <Route path='lab/orders' element={<LabOrderList />} />
        <Route path='lab/orders/create/:patientId' element={<LabOrderCreate />} />
        <Route path='lab/orders/:orderId/results' element={<LabResultEntryNew />} />
        <Route path='medical-records' element={<MedicalRecordList />} />
        <Route path='medical-records/create' element={<CreateMedicalRecord />} />
        <Route path='medical-records/:id' element={<ViewMedicalRecord />} />
        <Route path='medical-records/vitals/:id' element={<VitalSigns />} />
        <Route path='medical-records/vitals-trends/:id' element={<VitalSignsTrends />} />
        <Route path='medical-records/diagnosis/:id' element={<DiagnosisEntry />} />
        <Route path='medical-records/prescription/:id' element={<PrescriptionEntry />} />
        <Route path='medical-records/surgery/:id' element={<SurgeryRecord />} />
        <Route path='medical-records/treatment/:id' element={<TreatmentPlan />} />
        <Route path='billing' element={<BillingDashboard />} />
        <Route path='billing/invoices' element={<InvoiceList />} />
        <Route path='billing/create' element={<CreateInvoice />} />
        <Route path='billing/payment' element={<PaymentProcessing />} />
        <Route path='billing/insurance' element={<InsuranceClaims />} />
        <Route path='billing/reports' element={<RevenueReports />} />
        <Route path='reports' element={<HospitalReportDashboard />} />
        <Route path='reports/audit' element={<AuditLogs />} />
        <Route path='reports/department' element={<DepartmentReports />} />
        <Route path='reports/financial' element={<FinancialReports />} />
        <Route path='reports/lab' element={<LabReports />} />
        <Route path='reports/patient' element={<PatientReports />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
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
      </AppProvider>
    </AuthProvider>
  );
}

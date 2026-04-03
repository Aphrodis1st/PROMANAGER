import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initFirebase } from '../utils/firebase.js';

// Load environment variables
dotenv.config();

// Clean environment variables (remove quotes if present)
const cleanEnvVar = (value) => {
  if (!value) return value;
  return value.replace(/^["']|["']$/g, '');
};

// Environment configuration
const NODE_ENV = cleanEnvVar(process.env.NODE_ENV) || 'development';
const PORT = parseInt(cleanEnvVar(process.env.PORT)) || (NODE_ENV === 'production' ? 8080 : 3001);
const CORS_ORIGIN = cleanEnvVar(process.env.CORS_ORIGIN) || (NODE_ENV === 'production' ? false : 'http://localhost:5173');
const allowed = CORS_ORIGIN ? CORS_ORIGIN.split(',') : false;

console.log(`🚀 Starting server in ${NODE_ENV} mode`);
console.log(`📡 CORS Origin: ${CORS_ORIGIN}`);
console.log(`🔌 Port will be: ${PORT}`);
console.log(`🔥 Firebase initialization starting...`);

// Initialize Firebase
await initFirebase();
console.log('✅ Firebase initialized successfully');

const app = express();

// Routes
import authRoutes from './routes/auth.routes.js';
import rxRoutes from './routes/rx.routes.js';
import pharmacyRoutes from './routes/pharmacy.routes.js';
import callcenterRoutes from './routes/callcenter.routes.js';
import statusRoutes from './routes/status.routes.js';
import productRouter from './routes/stock/product.routes.js';
import purchaseRouter from './routes/stock/purchase.routes.js';
import dispenseRouter from './routes/stock/dispense.routes.js';
import transferRouter from './routes/stock/transfer.routes.js';
import journalRouter from './routes/stock/journal.routes.js';
import productSettingRouter from './routes/stock/productSetting.routes.js';
import salesRouter from './routes/stock/sales.route.js';
import accountsRouter from './routes/stock/accounts.route.js';
import expensesRouter from './routes/stock/expenses.route.js';
import ledgerRouter from './routes/stock/ledger.router.js';
import trialBalanceRouter from './routes/stock/trialbalance.router.js';
import incomestaatementRouter from './routes/stock/incomeStatement.routes.js';
import balanceSheetRouter from './routes/stock/balanceSheet.routes.js';
import cashFlowRouter from './routes/stock/cashFlow.routes.js';
import fixedAssetRouter from './routes/stock/fixedAssets.routes.js';
import productionRouter from './routes/production/production.routes.js';
import authRouters from './routes/stock/auths.routes.js';
import purchaseRoutes from './routes/stock/purchase.routes.js';
import supplierRoutes from './routes/stock/supplier.routes.js';
import supplierInvoiceRoutes from './routes/stock/supplierInvoice.routes.js';
import customerRoutes from './routes/stock/customer.routes.js';
import customerInvoiceRoutes from './routes/stock/customerInvoice.routes.js';
import paymentRoutes from './routes/stock/payment.routes.js';

// Hospital Routes
import hospitalAuthRoutes from './routes/hospital/auth.routes.js';
import appointmentRoutes from './routes/hospital/appointment.routes.js';
import billingRoutes from './routes/hospital/billing.routes.js';
import departmentRoutes from './routes/hospital/department.routes.js';
import doctorRoutes from './routes/hospital/doctor.routes.js';
import labRoutes from './routes/hospital/lab.routes.js';
import medicalRecordRoutes from './routes/hospital/medicalRecord.routes.js';
import patientRoutes from './routes/hospital/patient.routes.js';
import specializationRoutes from './routes/hospital/specialization.routes.js';
import wardRoutes from './routes/hospital/ward.routes.js';
import insuranceProviderRoutes from './routes/hospital/insuranceProvider.routes.js';
import vitalSignsRoutes from './routes/hospital/vitalSigns.routes.js';
import prescriptionRoutes from './routes/hospital/prescription.routes.js';
import surgeryRecordRoutes from './routes/hospital/surgeryRecord.routes.js';
import treatmentPlanRoutes from './routes/hospital/treatmentPlan.routes.js';
import admissionRoutes from './routes/hospital/admission.routes.js';
import hospitalAdminRoutes from './routes/hospital/hospitalAdmin.routes.js';

// Super Admin Routes
import superAdminHospitalRoutes from './routes/superAdmin/hospital.routes.js';
import superAdminHospitalAdminRoutes from './routes/superAdmin/hospitalAdmin.routes.js';
import superAdminDashboardRoutes from './routes/superAdmin/dashboard.routes.js';

// Middlewares
app.use(
  helmet(),
  express.json(),
  express.urlencoded({ extended: true }),
  cors({ 
    origin: allowed,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
  morgan(NODE_ENV === 'production' ? 'combined' : 'dev')
);

// Health check
app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

// API routes
app.use('/api/v1/auth', authRoutes); // auth (register/login)
app.use('/api/v1/prescriptions', rxRoutes); // prescriptions (doctor/pharmacy)
app.use('/api/v1/pharmacies', pharmacyRoutes); // pharmacies CRUD
app.use('/api/v1/callcenter', callcenterRoutes),
  app.use('/api/v1/status', statusRoutes); // ✅ add this
app.use('/api/v1/stock/product', productRouter);
app.use('/api/v1/stock/purchase', purchaseRouter);
app.use('/api/v1/stock/dispense', dispenseRouter);
app.use('/api/v1/stock/transfer', transferRouter);
app.use('api/v1/stock/journal', journalRouter);
app.use('/api/v1/stock/product-settings', productSettingRouter);
app.use('/api/v1/stock/sales', salesRouter);
app.use('/api/v1/stock/account-settings', accountsRouter);
app.use('/api/v1/stock/journal', journalRouter);
app.use('/api/v1/stock/expenses', expensesRouter);
app.use('/api/v1/stock/ledger', ledgerRouter);
app.use('/api/v1/stock/trialbalance', trialBalanceRouter);
app.use('/api/v1/stock/income-statement', incomestaatementRouter);
app.use('/api/v1/stock/balance-sheet', balanceSheetRouter);
app.use('/api/v1/stock/cash-flow', cashFlowRouter);
app.use('/api/v1/stock/fixed-assets', fixedAssetRouter);
app.use('/api/v1/production', productionRouter);
app.use('/api/v1/stock/auth', authRouters);
// app.use("/api/v1/stock/admin", stockAdminRoutes)
app.use('/api/v1/stock/purchases', purchaseRoutes);
app.use('/api/v1/stock/supplier', supplierRoutes);
app.use('/api/V1/stock/supplier-invoices', supplierInvoiceRoutes);
app.use('/api/v1/stock/customer', customerRoutes);
app.use('/api/v1/stock/invoice', customerInvoiceRoutes);
app.use('/api/v1/stock/payment', paymentRoutes);

// Hospital routes
console.log('Registering hospital auth routes...');
app.use('/api/v1/hospital/auth', hospitalAuthRoutes);
console.log('Hospital auth routes registered successfully');
app.use('/api/v1/hospital/appointments', appointmentRoutes);
app.use('/api/v1/hospital/billing', billingRoutes);
app.use('/api/v1/hospital/departments', departmentRoutes);
app.use('/api/v1/hospital/doctors', doctorRoutes);
app.use('/api/v1/hospital/lab', labRoutes);
app.use('/api/v1/hospital/medical-records', medicalRecordRoutes);
app.use('/api/v1/hospital/patients', patientRoutes);
app.use('/api/v1/hospital/specializations', specializationRoutes);
app.use('/api/v1/hospital/wards', wardRoutes);
app.use('/api/v1/hospital/insurance-providers', insuranceProviderRoutes);
app.use('/api/v1/hospital/vital-signs', vitalSignsRoutes);
app.use('/api/v1/hospital/prescriptions', prescriptionRoutes);
app.use('/api/v1/hospital/surgery-records', surgeryRecordRoutes);
app.use('/api/v1/hospital/treatment-plans', treatmentPlanRoutes);
app.use('/api/v1/hospital/admissions', admissionRoutes);
app.use('/api/v1/hospital/admin', hospitalAdminRoutes);

// Super Admin routes
app.use('/api/v1/super-admin/hospitals', superAdminHospitalRoutes);
app.use('/api/v1/super-admin/hospital-admins', superAdminHospitalAdminRoutes);
app.use('/api/v1/super-admin/dashboard', superAdminDashboardRoutes);

// Catch-all for debugging
app.use('*', (req, res) => {
  console.log('Unmatched route:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found', method: req.method, url: req.originalUrl });
});

// Start server
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
app.listen(PORT, HOST, () => {
  console.log(`\n🚀 Server running on ${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${NODE_ENV}`);
  console.log(`📡 CORS Origin: ${CORS_ORIGIN}`);
  console.log(`🔗 Health Check: http://${HOST}:${PORT}/api/v1/health`);
  console.log(`📚 API Base URL: http://${HOST}:${PORT}/api/v1`);
  console.log('\n✅ Server ready to accept connections\n');
});

const fs = require('fs');
const path = require('path');

// Hospital page components to check
const hospitalComponents = [
  // Dashboard
  { name: 'Hospital Dashboard', path: 'src/pages/HospitalDashboard.jsx', critical: true },
  { name: 'Hospital Layout', path: 'src/pages/HospitalLayout.jsx', critical: true },
  
  // Patient Management
  { name: 'Patient List', path: 'src/hospitalPages/patients/pages/PatientList.jsx', critical: true },
  { name: 'Patient Create', path: 'src/hospitalPages/patients/pages/PatientCreate.jsx', critical: true },
  { name: 'Patient Details', path: 'src/hospitalPages/patients/pages/PatientDetails.jsx', critical: true },
  { name: 'Patient Edit', path: 'src/hospitalPages/patients/pages/PatientEdit.jsx', critical: false },
  
  // Doctor Management
  { name: 'Doctor List', path: 'src/hospitalPages/doctors/pages/DoctorList.jsx', critical: true },
  { name: 'Doctor Profile', path: 'src/hospitalPages/doctors/pages/DoctorProfile.jsx', critical: true },
  { name: 'Create Doctor', path: 'src/hospitalPages/doctors/pages/CreateDoctor.jsx', critical: true },
  
  // Appointments
  { name: 'Appointment List', path: 'src/hospitalPages/Appointment/AppointmentList.jsx', critical: true },
  { name: 'Appointment Calendar', path: 'src/hospitalPages/Appointment/AppointmentCalendar.jsx', critical: true },
  { name: 'Appointment Create', path: 'src/hospitalPages/Appointment/AppointmentCreate.jsx', critical: true },
  
  // Billing
  { name: 'Billing Dashboard', path: 'src/hospitalPages/billing/pages/BillingDashboard.jsx', critical: true },
  { name: 'Invoice List', path: 'src/hospitalPages/billing/pages/InvoiceList.jsx', critical: true },
  { name: 'Create Invoice', path: 'src/hospitalPages/billing/pages/CreateInvoice.jsx', critical: true },
  { name: 'Payment Processing', path: 'src/hospitalPages/billing/pages/PaymentProcessing.jsx', critical: true },
  
  // Laboratory
  { name: 'Lab Dashboard', path: 'src/hospitalPages/lab/pages/LabDashboard.jsx', critical: true },
  { name: 'Lab Test List', path: 'src/hospitalPages/lab/pages/LabTestList.jsx', critical: true },
  { name: 'Lab Results Entry', path: 'src/hospitalPages/lab/pages/LabResultsEntry.jsx', critical: true },
  { name: 'Pending Tests', path: 'src/hospitalPages/lab/pages/PendingTests.jsx', critical: true },
  
  // Medical Records
  { name: 'Medical Record List', path: 'src/hospitalPages/medical-records/MedicalRecordList.jsx', critical: true },
  { name: 'Create Medical Record', path: 'src/hospitalPages/medical-records/CreateMedicalRecord.jsx', critical: true },
  { name: 'Vital Signs', path: 'src/hospitalPages/medical-records/VitalSigns.jsx', critical: true },
  { name: 'Prescription Entry', path: 'src/hospitalPages/medical-records/PrescriptionEntry.jsx', critical: true },
  
  // Admissions
  { name: 'Admission List', path: 'src/hospitalPages/admissions/pages/AdmissionList.jsx', critical: true },
  { name: 'Admit Patient', path: 'src/hospitalPages/admissions/pages/AdmitPatient.jsx', critical: true },
  { name: 'Discharge Patient', path: 'src/hospitalPages/admissions/pages/DischargePatient.jsx', critical: true },
  
  // Departments
  { name: 'Department List', path: 'src/hospitalPages/departments/DepartmentList.jsx', critical: true },
  { name: 'Department Management', path: 'src/hospitalPages/admin/pages/DepartmentManagement.jsx', critical: true },
  
  // Wards
  { name: 'Ward List', path: 'src/hospitalPages/wards/pages/WardList.jsx', critical: true },
  { name: 'Bed Allocation', path: 'src/hospitalPages/wards/pages/BedAllocation.jsx', critical: true },
  { name: 'ICU Management', path: 'src/hospitalPages/wards/pages/ICUManagement.jsx', critical: true },
  
  // Reports
  { name: 'Hospital Report Dashboard', path: 'src/hospitalPages/reports/pages/HospitalReportDashboard.jsx', critical: true },
  { name: 'Financial Reports', path: 'src/hospitalPages/reports/pages/FinancialReports.jsx', critical: true },
  { name: 'Patient Reports', path: 'src/hospitalPages/reports/pages/PatientReports.jsx', critical: true },
  
  // Admin
  { name: 'User Management', path: 'src/hospitalPages/admin/pages/UserManagement.jsx', critical: true },
  { name: 'System Settings', path: 'src/hospitalPages/admin/pages/SystemSettings.jsx', critical: true },
  { name: 'Audit Logs', path: 'src/hospitalPages/admin/pages/AuditLogs.jsx', critical: true },
  
  // Shared Components
  { name: 'Hospital Sidebar', path: 'src/components/hospital/HospitalSidebar.jsx', critical: true },
  { name: 'Hospital Protected Route', path: 'src/components/hospital/HospitalProtectedRoute.jsx', critical: true },
  { name: 'RBAC Component', path: 'src/components/hospital/RBAC.jsx', critical: true }
];

// Essential features to check in components
const essentialFeatures = [
  'useState',
  'useEffect',
  'export default',
  'import React',
  'function',
  'const',
  'return'
];

// Hospital-specific features to check
const hospitalFeatures = [
  'patient',
  'doctor',
  'appointment',
  'billing',
  'medical',
  'hospital',
  'dashboard',
  'admin'
];

let checkResults = {
  timestamp: new Date().toISOString(),
  totalComponents: 0,
  existingComponents: 0,
  missingComponents: 0,
  criticalMissing: 0,
  results: []
};

function checkComponentExists(componentPath) {
  const fullPath = path.join(__dirname, 'frontend', componentPath);
  return fs.existsSync(fullPath);
}

function analyzeComponent(componentPath) {
  const fullPath = path.join(__dirname, 'frontend', componentPath);
  
  if (!fs.existsSync(fullPath)) {
    return { exists: false, analysis: null };
  }
  
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    const analysis = {
      exists: true,
      fileSize: content.length,
      hasEssentialFeatures: essentialFeatures.filter(feature => content.includes(feature)),
      hasHospitalFeatures: hospitalFeatures.filter(feature => 
        content.toLowerCase().includes(feature.toLowerCase())
      ),
      hasImports: content.includes('import'),
      hasExports: content.includes('export'),
      hasReactHooks: content.includes('useState') || content.includes('useEffect'),
      hasJSX: content.includes('<') && content.includes('>'),
      linesOfCode: content.split('\n').length,
      hasErrorHandling: content.includes('try') || content.includes('catch'),
      hasValidation: content.includes('validate') || content.includes('required'),
      hasLoading: content.includes('loading') || content.includes('Loading'),
      hasAPI: content.includes('api') || content.includes('axios') || content.includes('fetch')
    };
    
    return { exists: true, analysis };
  } catch (error) {
    return { exists: true, analysis: { error: error.message } };
  }
}

function logComponentCheck(component, result) {
  checkResults.totalComponents++;
  
  if (result.exists) {
    checkResults.existingComponents++;
    console.log(`✅ ${component.name}: EXISTS`);
    
    if (result.analysis && !result.analysis.error) {
      const analysis = result.analysis;
      console.log(`   📊 ${analysis.linesOfCode} lines, ${analysis.fileSize} bytes`);
      console.log(`   🔧 Features: ${analysis.hasEssentialFeatures.length}/${essentialFeatures.length} essential`);
      console.log(`   🏥 Hospital: ${analysis.hasHospitalFeatures.length}/${hospitalFeatures.length} features`);
      
      if (analysis.hasReactHooks) console.log(`   ⚛️  Uses React hooks`);
      if (analysis.hasAPI) console.log(`   🌐 Has API integration`);
      if (analysis.hasErrorHandling) console.log(`   🛡️  Has error handling`);
      if (analysis.hasValidation) console.log(`   ✔️  Has validation`);
      if (analysis.hasLoading) console.log(`   ⏳ Has loading states`);
    }
  } else {
    checkResults.missingComponents++;
    if (component.critical) {
      checkResults.criticalMissing++;
      console.log(`❌ ${component.name}: MISSING (CRITICAL)`);
    } else {
      console.log(`⚠️  ${component.name}: MISSING (Optional)`);
    }
  }
  
  checkResults.results.push({
    component: component.name,
    path: component.path,
    critical: component.critical,
    exists: result.exists,
    analysis: result.analysis
  });
}

function checkHospitalRoutes() {
  console.log('\n🛣️  Checking Hospital Routes...');
  
  const routesPath = path.join(__dirname, 'frontend', 'src', 'hospitalPages', 'HospitalRoutes.jsx');
  
  if (!fs.existsSync(routesPath)) {
    console.log('❌ Hospital Routes: MISSING');
    return false;
  }
  
  const content = fs.readFileSync(routesPath, 'utf8');
  
  const routes = [
    'dashboard',
    'patients',
    'doctors',
    'appointments',
    'billing',
    'lab',
    'reports',
    'admin'
  ];
  
  console.log('✅ Hospital Routes: EXISTS');
  
  routes.forEach(route => {
    if (content.includes(`path="${route}"`)) {
      console.log(`   ✅ Route: /${route}`);
    } else {
      console.log(`   ❌ Route: /${route} - MISSING`);
    }
  });
  
  return true;
}

function checkHospitalContext() {
  console.log('\n🔄 Checking Hospital Context Files...');
  
  const contextFiles = [
    'PatientContext.jsx',
    'DoctorContext.jsx',
    'AppointmentContext.jsx',
    'BillingContext.jsx',
    'LabContext.jsx',
    'MedicalRecordContext.jsx',
    'AdmissionContext.jsx',
    'DepartmentContext.jsx',
    'WardContext.jsx'
  ];
  
  const contextDir = path.join(__dirname, 'frontend', 'src', 'context', 'hospitalContext');
  
  contextFiles.forEach(file => {
    const filePath = path.join(contextDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ Context: ${file}`);
    } else {
      console.log(`❌ Context: ${file} - MISSING`);
    }
  });
}

function generateComponentReport() {
  console.log('\n📊 Generating Component Analysis Report...');
  
  const report = {
    ...checkResults,
    summary: {
      totalComponents: checkResults.totalComponents,
      existingComponents: checkResults.existingComponents,
      missingComponents: checkResults.missingComponents,
      criticalMissing: checkResults.criticalMissing,
      completionRate: checkResults.totalComponents > 0 ? 
        ((checkResults.existingComponents / checkResults.totalComponents) * 100).toFixed(2) + '%' : '0%'
    },
    recommendations: []
  };
  
  // Add recommendations
  if (checkResults.criticalMissing > 0) {
    report.recommendations.push(`Create ${checkResults.criticalMissing} missing critical components`);
  }
  
  if (checkResults.missingComponents > 0) {
    report.recommendations.push(`Implement ${checkResults.missingComponents} missing components`);
  }
  
  if (checkResults.existingComponents === checkResults.totalComponents) {
    report.recommendations.push('All components exist! Review functionality and features');
  }
  
  // Save report
  const reportPath = path.join(__dirname, 'hospital-components-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📋 COMPONENT ANALYSIS SUMMARY');
  console.log('==============================');
  console.log(`Total Components: ${report.summary.totalComponents}`);
  console.log(`Existing: ${report.summary.existingComponents}`);
  console.log(`Missing: ${report.summary.missingComponents}`);
  console.log(`Critical Missing: ${report.summary.criticalMissing}`);
  console.log(`Completion Rate: ${report.summary.completionRate}`);
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return report;
}

function runComponentCheck() {
  console.log('🏥 HOSPITAL FRONTEND COMPONENT CHECKER');
  console.log('======================================');
  console.log(`Check started at: ${new Date().toISOString()}\n`);
  
  // Check all components
  console.log('🔍 Checking Hospital Components...');
  hospitalComponents.forEach(component => {
    const result = analyzeComponent(component.path);
    logComponentCheck(component, result);
  });
  
  // Check routes
  checkHospitalRoutes();
  
  // Check context files
  checkHospitalContext();
  
  // Generate report
  const report = generateComponentReport();
  
  return report;
}

// Run if executed directly
if (require.main === module) {
  runComponentCheck();
}

module.exports = {
  runComponentCheck,
  checkComponentExists,
  analyzeComponent
};
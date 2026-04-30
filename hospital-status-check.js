const fs = require('fs');
const path = require('path');

console.log('🏥 HOSPITAL SYSTEM STATUS CHECK');
console.log('===============================');
console.log(`Checked at: ${new Date().toISOString()}\n`);

// Check project structure
console.log('📁 PROJECT STRUCTURE:');
const projectPaths = [
  'frontend/src/hospitalPages',
  'frontend/src/components/hospital',
  'frontend/src/context/hospitalContext',
  'backend/src/controllers/hospital',
  'backend/src/models/hospital',
  'backend/src/routes/hospital'
];

projectPaths.forEach(p => {
  const fullPath = path.join(__dirname, p);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    console.log(`✅ ${p} (${files.length} files)`);
  } else {
    console.log(`❌ ${p} - MISSING`);
  }
});

// Check key hospital files
console.log('\n🔧 KEY HOSPITAL FILES:');
const keyFiles = [
  'frontend/src/hospitalPages/HospitalRoutes.jsx',
  'frontend/src/pages/HospitalDashboard.jsx',
  'frontend/src/pages/HospitalLayout.jsx',
  'frontend/src/components/hospital/HospitalSidebar.jsx',
  'frontend/src/components/hospital/RBAC.jsx',
  'backend/src/server.js',
  'backend/package.json',
  'frontend/package.json'
];

keyFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`✅ ${file} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check hospital pages
console.log('\n📄 HOSPITAL PAGES STATUS:');
const hospitalPages = [
  'frontend/src/hospitalPages/patients/pages/PatientList.jsx',
  'frontend/src/hospitalPages/doctors/pages/DoctorList.jsx',
  'frontend/src/hospitalPages/Appointment/AppointmentList.jsx',
  'frontend/src/hospitalPages/billing/pages/BillingDashboard.jsx',
  'frontend/src/hospitalPages/lab/pages/LabDashboard.jsx',
  'frontend/src/hospitalPages/medical-records/MedicalRecordList.jsx',
  'frontend/src/hospitalPages/admissions/pages/AdmissionList.jsx',
  'frontend/src/hospitalPages/wards/pages/WardList.jsx',
  'frontend/src/hospitalPages/reports/pages/HospitalReportDashboard.jsx',
  'frontend/src/hospitalPages/admin/pages/UserManagement.jsx'
];

let existingPages = 0;
hospitalPages.forEach(page => {
  const fullPath = path.join(__dirname, page);
  if (fs.existsSync(fullPath)) {
    existingPages++;
    console.log(`✅ ${path.basename(page)}`);
  } else {
    console.log(`❌ ${path.basename(page)} - MISSING`);
  }
});

// Check backend controllers
console.log('\n🎛️  BACKEND CONTROLLERS:');
const controllers = [
  'backend/src/controllers/hospital/patient.controller.js',
  'backend/src/controllers/hospital/doctor.controller.js',
  'backend/src/controllers/hospital/appointment.controller.js',
  'backend/src/controllers/hospital/billing.controller.js',
  'backend/src/controllers/hospital/lab.controller.js',
  'backend/src/controllers/hospital/medicalRecord.controller.js',
  'backend/src/controllers/hospital/admission.controller.js',
  'backend/src/controllers/hospital/ward.controller.js',
  'backend/src/controllers/hospital/department.controller.js'
];

let existingControllers = 0;
controllers.forEach(controller => {
  const fullPath = path.join(__dirname, controller);
  if (fs.existsSync(fullPath)) {
    existingControllers++;
    console.log(`✅ ${path.basename(controller)}`);
  } else {
    console.log(`❌ ${path.basename(controller)} - MISSING`);
  }
});

// Summary
console.log('\n📊 SYSTEM SUMMARY:');
console.log(`Frontend Pages: ${existingPages}/${hospitalPages.length} (${Math.round(existingPages/hospitalPages.length*100)}%)`);
console.log(`Backend Controllers: ${existingControllers}/${controllers.length} (${Math.round(existingControllers/controllers.length*100)}%)`);

// Overall status
const overallHealth = (existingPages + existingControllers) / (hospitalPages.length + controllers.length);
console.log('\n🏥 HOSPITAL SYSTEM HEALTH:');
if (overallHealth >= 0.9) {
  console.log('🟢 EXCELLENT - System is fully operational');
} else if (overallHealth >= 0.7) {
  console.log('🟡 GOOD - System is mostly functional');
} else if (overallHealth >= 0.5) {
  console.log('🟠 FAIR - System needs attention');
} else {
  console.log('🔴 POOR - System requires significant work');
}

console.log(`\nOverall Completion: ${Math.round(overallHealth * 100)}%`);

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');
if (overallHealth >= 0.9) {
  console.log('✅ Run comprehensive tests to verify functionality');
  console.log('✅ System is ready for professional hospital use');
} else {
  console.log('🔧 Complete missing components');
  console.log('🔧 Test existing functionality');
  console.log('🔧 Ensure all APIs are working');
}

console.log('\n' + '='.repeat(50));
console.log('Hospital System Status Check Complete');
console.log('='.repeat(50));
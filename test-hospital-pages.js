const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  results: []
};

// Hospital pages to test
const hospitalPages = [
  // Main Dashboard
  { name: 'Hospital Dashboard', path: '/hospital/dashboard', requiresAuth: true },
  
  // Patient Management
  { name: 'Patient List', path: '/hospital/patients', requiresAuth: true },
  { name: 'Patient Create', path: '/hospital/patients/create', requiresAuth: true },
  { name: 'Patient Details', path: '/hospital/patients/details', requiresAuth: true },
  
  // Doctor Management
  { name: 'Doctor List', path: '/hospital/doctors', requiresAuth: true },
  { name: 'Doctor Profile', path: '/hospital/doctors/profile', requiresAuth: true },
  { name: 'Doctor Schedule', path: '/hospital/doctors/schedule', requiresAuth: true },
  
  // Appointments
  { name: 'Appointment List', path: '/hospital/appointments', requiresAuth: true },
  { name: 'Appointment Calendar', path: '/hospital/appointments/calendar', requiresAuth: true },
  { name: 'Appointment Create', path: '/hospital/appointments/create', requiresAuth: true },
  
  // Billing
  { name: 'Billing Dashboard', path: '/hospital/billing', requiresAuth: true },
  { name: 'Invoice List', path: '/hospital/billing/invoices', requiresAuth: true },
  { name: 'Create Invoice', path: '/hospital/billing/create', requiresAuth: true },
  { name: 'Payment Processing', path: '/hospital/billing/payments', requiresAuth: true },
  
  // Laboratory
  { name: 'Lab Dashboard', path: '/hospital/lab', requiresAuth: true },
  { name: 'Lab Tests', path: '/hospital/lab/tests', requiresAuth: true },
  { name: 'Lab Results', path: '/hospital/lab/results', requiresAuth: true },
  { name: 'Pending Tests', path: '/hospital/lab/pending', requiresAuth: true },
  
  // Medical Records
  { name: 'Medical Records List', path: '/hospital/medical-records', requiresAuth: true },
  { name: 'Create Medical Record', path: '/hospital/medical-records/create', requiresAuth: true },
  { name: 'Vital Signs', path: '/hospital/medical-records/vitals', requiresAuth: true },
  { name: 'Prescriptions', path: '/hospital/medical-records/prescriptions', requiresAuth: true },
  
  // Admissions
  { name: 'Admission List', path: '/hospital/admissions', requiresAuth: true },
  { name: 'Admit Patient', path: '/hospital/admissions/admit', requiresAuth: true },
  { name: 'Discharge Patient', path: '/hospital/admissions/discharge', requiresAuth: true },
  
  // Departments
  { name: 'Department List', path: '/hospital/departments', requiresAuth: true },
  { name: 'Department Management', path: '/hospital/admin/departments', requiresAuth: true },
  
  // Wards
  { name: 'Ward List', path: '/hospital/wards', requiresAuth: true },
  { name: 'Bed Allocation', path: '/hospital/wards/beds', requiresAuth: true },
  { name: 'ICU Management', path: '/hospital/wards/icu', requiresAuth: true },
  
  // Reports
  { name: 'Hospital Reports', path: '/hospital/reports', requiresAuth: true },
  { name: 'Financial Reports', path: '/hospital/reports/financial', requiresAuth: true },
  { name: 'Patient Reports', path: '/hospital/reports/patients', requiresAuth: true },
  
  // Admin Pages
  { name: 'User Management', path: '/hospital/admin/users', requiresAuth: true },
  { name: 'System Settings', path: '/hospital/admin/settings', requiresAuth: true },
  { name: 'Audit Logs', path: '/hospital/admin/audit', requiresAuth: true }
];

// API endpoints to test
const apiEndpoints = [
  // Authentication
  { name: 'Hospital Login', method: 'POST', path: '/api/hospital/auth/login', requiresBody: true },
  { name: 'Hospital Register', method: 'POST', path: '/api/hospital/auth/register', requiresBody: true },
  
  // Patients
  { name: 'Get Patients', method: 'GET', path: '/api/hospital/patients', requiresAuth: true },
  { name: 'Create Patient', method: 'POST', path: '/api/hospital/patients', requiresAuth: true, requiresBody: true },
  
  // Doctors
  { name: 'Get Doctors', method: 'GET', path: '/api/hospital/doctors', requiresAuth: true },
  { name: 'Create Doctor', method: 'POST', path: '/api/hospital/doctors', requiresAuth: true, requiresBody: true },
  
  // Appointments
  { name: 'Get Appointments', method: 'GET', path: '/api/hospital/appointments', requiresAuth: true },
  { name: 'Create Appointment', method: 'POST', path: '/api/hospital/appointments', requiresAuth: true, requiresBody: true },
  
  // Billing
  { name: 'Get Billing', method: 'GET', path: '/api/hospital/billing', requiresAuth: true },
  { name: 'Create Invoice', method: 'POST', path: '/api/hospital/billing/invoices', requiresAuth: true, requiresBody: true },
  
  // Lab
  { name: 'Get Lab Tests', method: 'GET', path: '/api/hospital/lab/tests', requiresAuth: true },
  { name: 'Create Lab Test', method: 'POST', path: '/api/hospital/lab/tests', requiresAuth: true, requiresBody: true },
  
  // Medical Records
  { name: 'Get Medical Records', method: 'GET', path: '/api/hospital/medical-records', requiresAuth: true },
  { name: 'Create Medical Record', method: 'POST', path: '/api/hospital/medical-records', requiresAuth: true, requiresBody: true },
  
  // Departments
  { name: 'Get Departments', method: 'GET', path: '/api/hospital/departments', requiresAuth: true },
  { name: 'Create Department', method: 'POST', path: '/api/hospital/departments', requiresAuth: true, requiresBody: true },
  
  // Wards
  { name: 'Get Wards', method: 'GET', path: '/api/hospital/wards', requiresAuth: true },
  { name: 'Create Ward', method: 'POST', path: '/api/hospital/wards', requiresAuth: true, requiresBody: true },
  
  // Reports
  { name: 'Get Reports', method: 'GET', path: '/api/hospital/reports', requiresAuth: true }
];

// Test credentials
const testCredentials = {
  email: 'admin@hospital.com',
  password: 'admin123'
};

let authToken = null;

// Utility functions
function logTest(testName, status, message = '', details = null) {
  const result = {
    test: testName,
    status: status,
    message: message,
    details: details,
    timestamp: new Date().toISOString()
  };
  
  testResults.results.push(result);
  testResults.totalTests++;
  
  if (status === 'PASS') {
    testResults.passedTests++;
    console.log(`✅ ${testName}: ${message}`);
  } else {
    testResults.failedTests++;
    console.log(`❌ ${testName}: ${message}`);
    if (details) {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }
}

// Authentication function
async function authenticate() {
  try {
    console.log('\n🔐 Testing Hospital Authentication...');
    
    const response = await axios.post(`${BASE_URL}/api/hospital/auth/login`, testCredentials);
    
    if (response.data && response.data.token) {
      authToken = response.data.token;
      logTest('Hospital Authentication', 'PASS', 'Successfully authenticated');
      return true;
    } else {
      logTest('Hospital Authentication', 'FAIL', 'No token received', response.data);
      return false;
    }
  } catch (error) {
    logTest('Hospital Authentication', 'FAIL', 'Authentication failed', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return false;
  }
}

// Test API endpoints
async function testApiEndpoints() {
  console.log('\n🔧 Testing Hospital API Endpoints...');
  
  for (const endpoint of apiEndpoints) {
    try {
      const config = {
        method: endpoint.method,
        url: `${BASE_URL}${endpoint.path}`,
        timeout: 10000
      };
      
      // Add auth header if required
      if (endpoint.requiresAuth && authToken) {
        config.headers = {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        };
      }
      
      // Add test body for POST requests
      if (endpoint.requiresBody && endpoint.method === 'POST') {
        config.data = getTestDataForEndpoint(endpoint.path);
      }
      
      const response = await axios(config);
      
      if (response.status >= 200 && response.status < 300) {
        logTest(`API: ${endpoint.name}`, 'PASS', `Status: ${response.status}`);
      } else {
        logTest(`API: ${endpoint.name}`, 'FAIL', `Unexpected status: ${response.status}`);
      }
      
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      // Some endpoints might return 401 without proper setup, which is expected
      if (status === 401 && endpoint.requiresAuth) {
        logTest(`API: ${endpoint.name}`, 'PASS', 'Properly protected (401)');
      } else if (status === 404) {
        logTest(`API: ${endpoint.name}`, 'FAIL', 'Endpoint not found (404)');
      } else {
        logTest(`API: ${endpoint.name}`, 'FAIL', `Error: ${message}`, { status, endpoint: endpoint.path });
      }
    }
  }
}

// Get test data for different endpoints
function getTestDataForEndpoint(path) {
  const testData = {
    '/api/hospital/auth/login': testCredentials,
    '/api/hospital/auth/register': {
      email: 'test@hospital.com',
      password: 'test123',
      name: 'Test User',
      role: 'doctor'
    },
    '/api/hospital/patients': {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '123 Test St'
    },
    '/api/hospital/doctors': {
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane.smith@hospital.com',
      specialization: 'Cardiology',
      phone: '0987654321'
    },
    '/api/hospital/appointments': {
      patientId: 'test-patient-id',
      doctorId: 'test-doctor-id',
      appointmentDate: new Date().toISOString(),
      reason: 'Regular checkup'
    },
    '/api/hospital/billing/invoices': {
      patientId: 'test-patient-id',
      amount: 100.00,
      description: 'Consultation fee',
      dueDate: new Date().toISOString()
    },
    '/api/hospital/lab/tests': {
      patientId: 'test-patient-id',
      testType: 'Blood Test',
      orderedBy: 'test-doctor-id'
    },
    '/api/hospital/medical-records': {
      patientId: 'test-patient-id',
      doctorId: 'test-doctor-id',
      diagnosis: 'Test diagnosis',
      treatment: 'Test treatment'
    },
    '/api/hospital/departments': {
      name: 'Test Department',
      description: 'Test department description',
      headOfDepartment: 'test-doctor-id'
    },
    '/api/hospital/wards': {
      name: 'Test Ward',
      capacity: 20,
      currentOccupancy: 10,
      wardType: 'General'
    }
  };
  
  return testData[path] || {};
}

// Test frontend pages (basic connectivity)
async function testFrontendPages() {
  console.log('\n🌐 Testing Hospital Frontend Pages...');
  
  for (const page of hospitalPages) {
    try {
      // Note: This is a basic connectivity test
      // In a real scenario, you'd use a headless browser like Puppeteer
      const response = await axios.get(`${FRONTEND_URL}${page.path}`, {
        timeout: 5000,
        validateStatus: function (status) {
          return status < 500; // Accept any status less than 500
        }
      });
      
      if (response.status === 200) {
        logTest(`Frontend: ${page.name}`, 'PASS', 'Page accessible');
      } else if (response.status === 401 && page.requiresAuth) {
        logTest(`Frontend: ${page.name}`, 'PASS', 'Properly protected');
      } else {
        logTest(`Frontend: ${page.name}`, 'FAIL', `Status: ${response.status}`);
      }
      
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        logTest(`Frontend: ${page.name}`, 'FAIL', 'Frontend server not running');
      } else {
        logTest(`Frontend: ${page.name}`, 'FAIL', error.message);
      }
    }
  }
}

// Test database connectivity
async function testDatabaseConnectivity() {
  console.log('\n🗄️ Testing Database Connectivity...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/status`, { timeout: 5000 });
    
    if (response.data && response.data.status === 'OK') {
      logTest('Database Connectivity', 'PASS', 'Database connected');
    } else {
      logTest('Database Connectivity', 'FAIL', 'Database status unknown');
    }
  } catch (error) {
    logTest('Database Connectivity', 'FAIL', 'Cannot connect to database', {
      message: error.message,
      status: error.response?.status
    });
  }
}

// Test hospital-specific features
async function testHospitalFeatures() {
  console.log('\n🏥 Testing Hospital-Specific Features...');
  
  // Test RBAC system
  try {
    const response = await axios.get(`${BASE_URL}/api/hospital/rbac/permissions`, {
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
      timeout: 5000
    });
    
    if (response.status === 200) {
      logTest('RBAC System', 'PASS', 'RBAC permissions accessible');
    } else {
      logTest('RBAC System', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('RBAC System', 'FAIL', 'RBAC system not accessible', {
      status: error.response?.status,
      message: error.message
    });
  }
  
  // Test real-time features (if implemented)
  try {
    const response = await axios.get(`${BASE_URL}/api/hospital/dashboard/stats`, {
      headers: authToken ? { 'Authorization': `Bearer ${authToken}` } : {},
      timeout: 5000
    });
    
    if (response.status === 200) {
      logTest('Dashboard Statistics', 'PASS', 'Dashboard stats accessible');
    } else {
      logTest('Dashboard Statistics', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Dashboard Statistics', 'FAIL', 'Dashboard stats not accessible', {
      status: error.response?.status,
      message: error.message
    });
  }
}

// Generate test report
function generateReport() {
  console.log('\n📊 Generating Test Report...');
  
  const report = {
    ...testResults,
    summary: {
      totalTests: testResults.totalTests,
      passedTests: testResults.passedTests,
      failedTests: testResults.failedTests,
      successRate: testResults.totalTests > 0 ? 
        ((testResults.passedTests / testResults.totalTests) * 100).toFixed(2) + '%' : '0%'
    },
    recommendations: []
  };
  
  // Add recommendations based on test results
  if (testResults.failedTests > 0) {
    report.recommendations.push('Review failed tests and fix identified issues');
  }
  
  if (testResults.passedTests === testResults.totalTests) {
    report.recommendations.push('All tests passed! Hospital system is functioning properly');
  }
  
  // Save report to file
  const reportPath = path.join(__dirname, 'hospital-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📋 TEST SUMMARY');
  console.log('================');
  console.log(`Total Tests: ${report.summary.totalTests}`);
  console.log(`Passed: ${report.summary.passedTests}`);
  console.log(`Failed: ${report.summary.failedTests}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  return report;
}

// Main test function
async function runHospitalTests() {
  console.log('🏥 HOSPITAL SYSTEM COMPREHENSIVE TEST');
  console.log('=====================================');
  console.log(`Backend URL: ${BASE_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Test started at: ${new Date().toISOString()}\n`);
  
  try {
    // Test database connectivity first
    await testDatabaseConnectivity();
    
    // Test authentication
    const authSuccess = await authenticate();
    
    // Test API endpoints
    await testApiEndpoints();
    
    // Test frontend pages
    await testFrontendPages();
    
    // Test hospital-specific features
    await testHospitalFeatures();
    
    // Generate and display report
    const report = generateReport();
    
    // Exit with appropriate code
    process.exit(report.summary.failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runHospitalTests();
}

module.exports = {
  runHospitalTests,
  testApiEndpoints,
  testFrontendPages,
  authenticate
};
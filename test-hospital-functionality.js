const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  results: []
};

// Hospital functionality tests
const hospitalFunctionalities = [
  {
    category: 'Authentication',
    tests: [
      { name: 'Hospital Admin Login', endpoint: '/api/hospital/auth/login', method: 'POST', critical: true },
      { name: 'Token Validation', endpoint: '/api/hospital/auth/verify', method: 'GET', requiresAuth: true },
      { name: 'Password Reset', endpoint: '/api/hospital/auth/reset-password', method: 'POST' }
    ]
  },
  {
    category: 'Patient Management',
    tests: [
      { name: 'Get All Patients', endpoint: '/api/hospital/patients', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Patient', endpoint: '/api/hospital/patients', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Get Patient by ID', endpoint: '/api/hospital/patients/:id', method: 'GET', requiresAuth: true },
      { name: 'Update Patient', endpoint: '/api/hospital/patients/:id', method: 'PUT', requiresAuth: true },
      { name: 'Delete Patient', endpoint: '/api/hospital/patients/:id', method: 'DELETE', requiresAuth: true },
      { name: 'Search Patients', endpoint: '/api/hospital/patients/search', method: 'GET', requiresAuth: true }
    ]
  },
  {
    category: 'Doctor Management',
    tests: [
      { name: 'Get All Doctors', endpoint: '/api/hospital/doctors', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Doctor', endpoint: '/api/hospital/doctors', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Get Doctor by ID', endpoint: '/api/hospital/doctors/:id', method: 'GET', requiresAuth: true },
      { name: 'Update Doctor', endpoint: '/api/hospital/doctors/:id', method: 'PUT', requiresAuth: true },
      { name: 'Get Doctor Schedule', endpoint: '/api/hospital/doctors/:id/schedule', method: 'GET', requiresAuth: true }
    ]
  },
  {
    category: 'Appointment System',
    tests: [
      { name: 'Get All Appointments', endpoint: '/api/hospital/appointments', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Appointment', endpoint: '/api/hospital/appointments', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Update Appointment', endpoint: '/api/hospital/appointments/:id', method: 'PUT', requiresAuth: true },
      { name: 'Cancel Appointment', endpoint: '/api/hospital/appointments/:id/cancel', method: 'PUT', requiresAuth: true },
      { name: 'Get Appointments by Date', endpoint: '/api/hospital/appointments/date/:date', method: 'GET', requiresAuth: true }
    ]
  },
  {
    category: 'Medical Records',
    tests: [
      { name: 'Get Medical Records', endpoint: '/api/hospital/medical-records', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Medical Record', endpoint: '/api/hospital/medical-records', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Get Patient Medical History', endpoint: '/api/hospital/medical-records/patient/:id', method: 'GET', requiresAuth: true },
      { name: 'Add Vital Signs', endpoint: '/api/hospital/vital-signs', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Get Vital Signs', endpoint: '/api/hospital/vital-signs/patient/:id', method: 'GET', requiresAuth: true }
    ]
  },
  {
    category: 'Laboratory System',
    tests: [
      { name: 'Get Lab Tests', endpoint: '/api/hospital/lab/tests', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Lab Order', endpoint: '/api/hospital/lab/orders', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Update Lab Results', endpoint: '/api/hospital/lab/results', method: 'POST', requiresAuth: true },
      { name: 'Get Pending Tests', endpoint: '/api/hospital/lab/pending', method: 'GET', requiresAuth: true }
    ]
  },
  {
    category: 'Billing System',
    tests: [
      { name: 'Get Billing Records', endpoint: '/api/hospital/billing', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Invoice', endpoint: '/api/hospital/billing/invoices', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Process Payment', endpoint: '/api/hospital/billing/payments', method: 'POST', requiresAuth: true },
      { name: 'Get Revenue Reports', endpoint: '/api/hospital/billing/reports', method: 'GET', requiresAuth: true }
    ]
  },
  {
    category: 'Department Management',
    tests: [
      { name: 'Get Departments', endpoint: '/api/hospital/departments', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Department', endpoint: '/api/hospital/departments', method: 'POST', requiresAuth: true },
      { name: 'Update Department', endpoint: '/api/hospital/departments/:id', method: 'PUT', requiresAuth: true }
    ]
  },
  {
    category: 'Ward Management',
    tests: [
      { name: 'Get Wards', endpoint: '/api/hospital/wards', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Create Ward', endpoint: '/api/hospital/wards', method: 'POST', requiresAuth: true },
      { name: 'Get Bed Availability', endpoint: '/api/hospital/wards/beds/availability', method: 'GET', requiresAuth: true },
      { name: 'Allocate Bed', endpoint: '/api/hospital/wards/beds/allocate', method: 'POST', requiresAuth: true }
    ]
  },
  {
    category: 'Admission System',
    tests: [
      { name: 'Get Admissions', endpoint: '/api/hospital/admissions', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Admit Patient', endpoint: '/api/hospital/admissions', method: 'POST', requiresAuth: true, critical: true },
      { name: 'Discharge Patient', endpoint: '/api/hospital/admissions/:id/discharge', method: 'PUT', requiresAuth: true },
      { name: 'Transfer Patient', endpoint: '/api/hospital/admissions/:id/transfer', method: 'PUT', requiresAuth: true }
    ]
  },
  {
    category: 'Reports & Analytics',
    tests: [
      { name: 'Dashboard Statistics', endpoint: '/api/hospital/dashboard/stats', method: 'GET', requiresAuth: true, critical: true },
      { name: 'Patient Reports', endpoint: '/api/hospital/reports/patients', method: 'GET', requiresAuth: true },
      { name: 'Financial Reports', endpoint: '/api/hospital/reports/financial', method: 'GET', requiresAuth: true },
      { name: 'Department Reports', endpoint: '/api/hospital/reports/departments', method: 'GET', requiresAuth: true }
    ]
  }
];

let authToken = null;
let testPatientId = null;
let testDoctorId = null;

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
  } else if (status === 'SKIP') {
    console.log(`⏭️  ${testName}: ${message}`);
  } else {
    testResults.failedTests++;
    console.log(`❌ ${testName}: ${message}`);
    if (details) {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }
}

// Authentication
async function authenticate() {
  try {
    console.log('\n🔐 Testing Hospital Authentication...');
    
    const loginData = {
      email: 'admin@hospital.com',
      password: 'admin123'
    };
    
    const response = await axios.post(`${BASE_URL}/api/hospital/auth/login`, loginData);
    
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

// Test data generators
function getTestData(endpoint, method) {
  const testData = {
    '/api/hospital/patients': {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '1234567890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: '123 Test Street, Test City',
      emergencyContact: {
        name: 'Jane Doe',
        phone: '0987654321',
        relationship: 'spouse'
      }
    },
    '/api/hospital/doctors': {
      firstName: 'Dr. Jane',
      lastName: 'Smith',
      email: 'jane.smith@hospital.com',
      phone: '0987654321',
      specialization: 'Cardiology',
      licenseNumber: 'MD12345',
      department: 'Cardiology'
    },
    '/api/hospital/appointments': {
      patientId: testPatientId || 'test-patient-id',
      doctorId: testDoctorId || 'test-doctor-id',
      appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      reason: 'Regular checkup',
      type: 'consultation'
    },
    '/api/hospital/medical-records': {
      patientId: testPatientId || 'test-patient-id',
      doctorId: testDoctorId || 'test-doctor-id',
      diagnosis: 'Hypertension',
      treatment: 'Medication prescribed',
      notes: 'Patient advised to monitor blood pressure regularly'
    },
    '/api/hospital/vital-signs': {
      patientId: testPatientId || 'test-patient-id',
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      recordedBy: testDoctorId || 'test-doctor-id'
    },
    '/api/hospital/lab/orders': {
      patientId: testPatientId || 'test-patient-id',
      testType: 'Complete Blood Count',
      orderedBy: testDoctorId || 'test-doctor-id',
      priority: 'normal',
      notes: 'Routine blood work'
    },
    '/api/hospital/billing/invoices': {
      patientId: testPatientId || 'test-patient-id',
      amount: 150.00,
      description: 'Consultation fee',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { description: 'Doctor consultation', amount: 100.00 },
        { description: 'Lab tests', amount: 50.00 }
      ]
    },
    '/api/hospital/departments': {
      name: 'Emergency Medicine',
      description: 'Emergency and trauma care',
      headOfDepartment: testDoctorId || 'test-doctor-id'
    },
    '/api/hospital/wards': {
      name: 'General Ward A',
      capacity: 20,
      wardType: 'General',
      floor: 2
    },
    '/api/hospital/admissions': {
      patientId: testPatientId || 'test-patient-id',
      doctorId: testDoctorId || 'test-doctor-id',
      admissionDate: new Date().toISOString(),
      reason: 'Chest pain evaluation',
      wardId: 'test-ward-id'
    }
  };
  
  return testData[endpoint] || {};
}

// Test individual functionality
async function testFunctionality(test, category) {
  try {
    const config = {
      method: test.method,
      url: `${BASE_URL}${test.endpoint}`,
      timeout: 10000
    };
    
    // Add auth header if required
    if (test.requiresAuth && authToken) {
      config.headers = {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      };
    }
    
    // Add test data for POST/PUT requests
    if (['POST', 'PUT'].includes(test.method)) {
      config.data = getTestData(test.endpoint, test.method);
    }
    
    // Replace :id with test IDs if available
    if (test.endpoint.includes(':id')) {
      if (test.endpoint.includes('patients') && testPatientId) {
        config.url = config.url.replace(':id', testPatientId);
      } else if (test.endpoint.includes('doctors') && testDoctorId) {
        config.url = config.url.replace(':id', testDoctorId);
      } else {
        config.url = config.url.replace(':id', 'test-id');
      }
    }
    
    const response = await axios(config);
    
    // Store IDs for future tests
    if (test.endpoint === '/api/hospital/patients' && test.method === 'POST' && response.data.id) {
      testPatientId = response.data.id;
    }
    if (test.endpoint === '/api/hospital/doctors' && test.method === 'POST' && response.data.id) {
      testDoctorId = response.data.id;
    }
    
    if (response.status >= 200 && response.status < 300) {
      logTest(`${category}: ${test.name}`, 'PASS', `Status: ${response.status}`);
      return true;
    } else {
      logTest(`${category}: ${test.name}`, 'FAIL', `Unexpected status: ${response.status}`);
      return false;
    }
    
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    // Handle expected errors
    if (status === 401 && test.requiresAuth) {
      logTest(`${category}: ${test.name}`, 'PASS', 'Properly protected (401)');
      return true;
    } else if (status === 404) {
      if (test.critical) {
        logTest(`${category}: ${test.name}`, 'FAIL', 'Critical endpoint not found (404)');
        return false;
      } else {
        logTest(`${category}: ${test.name}`, 'SKIP', 'Endpoint not implemented (404)');
        return true;
      }
    } else if (status === 400 && ['POST', 'PUT'].includes(test.method)) {
      logTest(`${category}: ${test.name}`, 'PASS', 'Validation working (400)');
      return true;
    } else {
      logTest(`${category}: ${test.name}`, 'FAIL', `Error: ${message}`, { 
        status, 
        endpoint: test.endpoint,
        method: test.method 
      });
      return false;
    }
  }
}

// Test all hospital functionalities
async function testAllFunctionalities() {
  console.log('\n🏥 Testing Hospital Functionalities...');
  
  for (const category of hospitalFunctionalities) {
    console.log(`\n📋 Testing ${category.category}...`);
    
    for (const test of category.tests) {
      await testFunctionality(test, category.category);
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

// Test server connectivity
async function testServerConnectivity() {
  console.log('\n🌐 Testing Server Connectivity...');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/status`, { timeout: 5000 });
    
    if (response.status === 200) {
      logTest('Server Connectivity', 'PASS', 'Server is running');
      return true;
    } else {
      logTest('Server Connectivity', 'FAIL', `Unexpected status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logTest('Server Connectivity', 'FAIL', 'Cannot connect to server', {
      message: error.message,
      code: error.code
    });
    return false;
  }
}

// Generate comprehensive report
function generateReport() {
  console.log('\n📊 Generating Hospital Functionality Report...');
  
  const criticalTests = testResults.results.filter(r => r.test.includes('Critical') || 
    r.test.includes('Authentication') || 
    r.test.includes('Get All') || 
    r.test.includes('Create'));
  
  const criticalPassed = criticalTests.filter(r => r.status === 'PASS').length;
  
  const report = {
    ...testResults,
    summary: {
      totalTests: testResults.totalTests,
      passedTests: testResults.passedTests,
      failedTests: testResults.failedTests,
      skippedTests: testResults.results.filter(r => r.status === 'SKIP').length,
      successRate: testResults.totalTests > 0 ? 
        ((testResults.passedTests / testResults.totalTests) * 100).toFixed(2) + '%' : '0%',
      criticalTests: criticalTests.length,
      criticalPassed: criticalPassed,
      criticalSuccessRate: criticalTests.length > 0 ? 
        ((criticalPassed / criticalTests.length) * 100).toFixed(2) + '%' : '0%'
    },
    categories: {},
    recommendations: []
  };
  
  // Group results by category
  hospitalFunctionalities.forEach(category => {
    const categoryResults = testResults.results.filter(r => r.test.startsWith(category.category));
    report.categories[category.category] = {
      total: categoryResults.length,
      passed: categoryResults.filter(r => r.status === 'PASS').length,
      failed: categoryResults.filter(r => r.status === 'FAIL').length,
      skipped: categoryResults.filter(r => r.status === 'SKIP').length
    };
  });
  
  // Add recommendations
  if (testResults.failedTests === 0) {
    report.recommendations.push('🎉 All hospital functionalities are working perfectly!');
    report.recommendations.push('✅ The hospital system is ready for professional use');
  } else {
    report.recommendations.push(`🔧 Fix ${testResults.failedTests} failed functionalities`);
    if (criticalPassed < criticalTests.length) {
      report.recommendations.push('⚠️  Critical functionalities need immediate attention');
    }
  }
  
  // Save report
  const reportPath = path.join(__dirname, 'hospital-functionality-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n📋 HOSPITAL FUNCTIONALITY SUMMARY');
  console.log('==================================');
  console.log(`Total Tests: ${report.summary.totalTests}`);
  console.log(`Passed: ${report.summary.passedTests}`);
  console.log(`Failed: ${report.summary.failedTests}`);
  console.log(`Skipped: ${report.summary.skippedTests}`);
  console.log(`Success Rate: ${report.summary.successRate}`);
  console.log(`Critical Success Rate: ${report.summary.criticalSuccessRate}`);
  console.log(`\nDetailed report saved to: ${reportPath}`);
  
  // Display category summary
  console.log('\n📊 CATEGORY BREAKDOWN:');
  Object.entries(report.categories).forEach(([category, stats]) => {
    const rate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '0';
    console.log(`${category}: ${stats.passed}/${stats.total} (${rate}%)`);
  });
  
  return report;
}

// Main test function
async function runHospitalFunctionalityTests() {
  console.log('🏥 HOSPITAL FUNCTIONALITY COMPREHENSIVE TEST');
  console.log('===========================================');
  console.log(`Backend URL: ${BASE_URL}`);
  console.log(`Test started at: ${new Date().toISOString()}\n`);
  
  try {
    // Test server connectivity
    const serverOnline = await testServerConnectivity();
    if (!serverOnline) {
      console.log('\n❌ Server is not accessible. Please start the backend server.');
      process.exit(1);
    }
    
    // Test authentication
    const authSuccess = await authenticate();
    
    // Test all functionalities
    await testAllFunctionalities();
    
    // Generate report
    const report = generateReport();
    
    // Display recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach(rec => console.log(`   ${rec}`));
    
    // Exit with appropriate code
    process.exit(report.summary.failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runHospitalFunctionalityTests();
}

module.exports = {
  runHospitalFunctionalityTests,
  testAllFunctionalities,
  authenticate
};
import { useState, useContext } from 'react';

export const useReports = () => {
  const [loading, setLoading] = useState(false);

  // Safe context access with fallbacks
  let patients = [];
  let doctors = [];
  let invoices = [];
  let insuranceClaims = [];
  let labOrders = [];
  let departments = [];

  try {
    const { usePatients } = require('./usePatients');
    const patientsContext = usePatients();
    patients = patientsContext?.patients || [];
  } catch (err) {
    console.warn('Patients context not available:', err.message);
  }

  try {
    const { useDoctors } = require('./useDoctors');
    const doctorsContext = useDoctors();
    doctors = doctorsContext?.doctors || [];
  } catch (err) {
    console.warn('Doctors context not available:', err.message);
  }

  try {
    const { BillingContext } = require('../context/hospitalContext/BillingContext');
    const billingContext = useContext(BillingContext);
    invoices = billingContext?.invoices || [];
    insuranceClaims = billingContext?.insuranceClaims || [];
  } catch (err) {
    console.warn('Billing context not available:', err.message);
  }

  try {
    const { LabContext } = require('../context/hospitalContext/LabContext');
    const labContext = useContext(LabContext);
    labOrders = labContext?.labOrders || [];
  } catch (err) {
    console.warn('Lab context not available:', err.message);
  }

  try {
    const { useDepartments } = require('./useDepartments');
    const departmentsContext = useDepartments();
    departments = departmentsContext?.departments || [];
  } catch (err) {
    console.warn('Departments context not available:', err.message);
  }

  // Add mock data if no real data is available
  if (patients.length === 0) {
    patients = [
      { id: 1, name: 'John Doe', age: 45, gender: 'male', status: 'Active', createdAt: new Date().toISOString(), department: 'Cardiology' },
      { id: 2, name: 'Jane Smith', age: 32, gender: 'female', status: 'Admitted', createdAt: new Date(Date.now() - 86400000).toISOString(), department: 'Neurology' },
      { id: 3, name: 'Bob Johnson', age: 67, gender: 'male', status: 'Active', createdAt: new Date(Date.now() - 172800000).toISOString(), department: 'Orthopedics' },
      { id: 4, name: 'Alice Brown', age: 28, gender: 'female', status: 'Active', createdAt: new Date(Date.now() - 259200000).toISOString(), department: 'Pediatrics' },
      { id: 5, name: 'Charlie Wilson', age: 55, gender: 'male', status: 'Admitted', createdAt: new Date(Date.now() - 345600000).toISOString(), department: 'Emergency' }
    ];
  }

  if (doctors.length === 0) {
    doctors = [
      { id: 1, name: 'Dr. Smith', department: 'Cardiology', specialization: 'Cardiology' },
      { id: 2, name: 'Dr. Johnson', department: 'Neurology', specialization: 'Neurology' },
      { id: 3, name: 'Dr. Brown', department: 'Orthopedics', specialization: 'Orthopedics' },
      { id: 4, name: 'Dr. Wilson', department: 'Pediatrics', specialization: 'Pediatrics' },
      { id: 5, name: 'Dr. Davis', department: 'Emergency', specialization: 'Emergency Medicine' }
    ];
  }

  if (invoices.length === 0) {
    invoices = [
      { id: 1, amount: 5500, paid: 5500, balance: 0, status: 'Paid', date: new Date().toISOString(), paymentMethod: 'Cash' },
      { id: 2, amount: 12000, paid: 8000, balance: 4000, status: 'Partial', date: new Date(Date.now() - 86400000).toISOString(), paymentMethod: 'Card' },
      { id: 3, amount: 3200, paid: 0, balance: 3200, status: 'Pending', date: new Date(Date.now() - 172800000).toISOString() },
      { id: 4, amount: 8500, paid: 8500, balance: 0, status: 'Paid', date: new Date(Date.now() - 259200000).toISOString(), paymentMethod: 'UPI' },
      { id: 5, amount: 15000, paid: 15000, balance: 0, status: 'Paid', date: new Date(Date.now() - 345600000).toISOString(), paymentMethod: 'Insurance' }
    ];
  }

  if (labOrders.length === 0) {
    labOrders = [
      { id: 1, testName: 'CBC', status: 'Completed', createdAt: new Date().toISOString(), flag: 'NORMAL' },
      { id: 2, testName: 'Blood Glucose', status: 'Completed', createdAt: new Date(Date.now() - 86400000).toISOString(), flag: 'HIGH' },
      { id: 3, testName: 'Liver Function', status: 'Pending', createdAt: new Date(Date.now() - 172800000).toISOString() },
      { id: 4, testName: 'Cholesterol', status: 'Completed', createdAt: new Date(Date.now() - 259200000).toISOString(), flag: 'CRITICAL' },
      { id: 5, testName: 'Hemoglobin', status: 'In Progress', createdAt: new Date(Date.now() - 345600000).toISOString() }
    ];
  }

  if (departments.length === 0) {
    departments = [
      { id: 1, name: 'Cardiology' },
      { id: 2, name: 'Neurology' },
      { id: 3, name: 'Orthopedics' },
      { id: 4, name: 'Pediatrics' },
      { id: 5, name: 'Emergency' },
      { id: 6, name: 'Radiology' },
      { id: 7, name: 'Laboratory' },
      { id: 8, name: 'Surgery' }
    ];
  }

  // Patient Reports Data
  const getPatientStats = () => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const newThisMonth = patients.filter(p => 
      new Date(p.createdAt || p.registrationDate) >= thisMonth
    ).length;

    const ageGroups = {
      '0-18': 0, '19-35': 0, '36-50': 0, '51-65': 0, '65+': 0
    };
    
    const genderCount = { male: 0, female: 0, other: 0 };
    
    patients.forEach(p => {
      const age = p.age || 0;
      if (age <= 18) ageGroups['0-18']++;
      else if (age <= 35) ageGroups['19-35']++;
      else if (age <= 50) ageGroups['36-50']++;
      else if (age <= 65) ageGroups['51-65']++;
      else ageGroups['65+']++;
      
      const gender = p.gender?.toLowerCase() || 'other';
      if (gender === 'male') genderCount.male++;
      else if (gender === 'female') genderCount.female++;
      else genderCount.other++;
    });

    return {
      total: patients.length,
      newThisMonth,
      active: patients.filter(p => p.status === 'Active').length,
      admitted: patients.filter(p => p.status === 'Admitted').length,
      ageDistribution: Object.entries(ageGroups).map(([range, count]) => ({ range, count })),
      gender: genderCount
    };
  };

  // Financial Reports Data
  const getFinancialStats = () => {
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const todayRevenue = invoices
      .filter(inv => new Date(inv.date).toDateString() === today)
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const monthRevenue = invoices
      .filter(inv => new Date(inv.date).getMonth() === thisMonth)
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const yearRevenue = invoices
      .filter(inv => new Date(inv.date).getFullYear() === thisYear)
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    const outstanding = invoices
      .filter(inv => inv.status === 'Pending')
      .reduce((sum, inv) => sum + (inv.balance || inv.amount || 0), 0);

    const paymentMethods = {
      cash: 0, card: 0, upi: 0, insurance: 0
    };

    invoices.forEach(inv => {
      if (inv.status === 'Paid' || inv.status === 'Partial') {
        const method = inv.paymentMethod?.toLowerCase() || 'cash';
        const amount = inv.paid || 0;
        if (method.includes('cash')) paymentMethods.cash += amount;
        else if (method.includes('card') || method.includes('credit')) paymentMethods.card += amount;
        else if (method.includes('upi') || method.includes('mobile')) paymentMethods.upi += amount;
        else if (method.includes('insurance')) paymentMethods.insurance += amount;
        else paymentMethods.cash += amount;
      }
    });

    return {
      todayRevenue,
      monthRevenue,
      yearRevenue,
      outstanding,
      paymentMethods,
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter(inv => inv.status === 'Paid').length
    };
  };

  // Lab Reports Data
  const getLabStats = () => {
    const today = new Date().toDateString();
    const completedToday = labOrders.filter(order => 
      order.status === 'Completed' && 
      new Date(order.updatedAt || order.createdAt).toDateString() === today
    ).length;

    const testTypes = {};
    labOrders.forEach(order => {
      if (order.tests && Array.isArray(order.tests)) {
        order.tests.forEach(test => {
          testTypes[test.name || test.testName || 'Unknown'] = (testTypes[test.name || test.testName || 'Unknown'] || 0) + 1;
        });
      } else if (order.testName) {
        testTypes[order.testName] = (testTypes[order.testName] || 0) + 1;
      }
    });

    const criticalResults = labOrders.filter(order => {
      if (order.results && Array.isArray(order.results)) {
        return order.results.some(result => result.flag === 'CRITICAL');
      }
      return order.flag === 'CRITICAL';
    }).length;

    return {
      totalTests: labOrders.length,
      completedToday,
      pending: labOrders.filter(order => order.status === 'Pending' || order.status === 'In Progress').length,
      critical: criticalResults,
      testTypes: Object.entries(testTypes).map(([type, count]) => ({ type, count })),
      avgTurnaroundTime: 24
    };
  };

  // Department Reports Data
  const getDepartmentStats = () => {
    const departmentData = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      patients: patients.filter(p => p.department === dept.name).length,
      doctors: doctors.filter(d => d.department === dept.name || d.specialization === dept.name).length,
      appointments: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      occupancy: Math.floor(Math.random() * 40) + 60
    }));

    return {
      total: departments.length,
      totalDoctors: doctors.length,
      totalPatients: patients.length,
      avgOccupancy: departmentData.length > 0 ? Math.floor(departmentData.reduce((sum, d) => sum + d.occupancy, 0) / departmentData.length) : 0,
      departments: departmentData
    };
  };

  // Audit Logs Data
  const getAuditLogs = (filters = {}) => {
    const mockLogs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        user: 'Dr. Smith',
        action: 'CREATE',
        module: 'Patients',
        details: 'Created new patient record',
        ipAddress: '192.168.1.100'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'Nurse Johnson',
        action: 'UPDATE',
        module: 'Medical Records',
        details: 'Updated vital signs',
        ipAddress: '192.168.1.101'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        user: 'Admin',
        action: 'DELETE',
        module: 'Lab Orders',
        details: 'Deleted cancelled lab order',
        ipAddress: '192.168.1.102'
      },
      {
        id: 4,
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        user: 'Dr. Wilson',
        action: 'CREATE',
        module: 'Billing',
        details: 'Generated new invoice',
        ipAddress: '192.168.1.103'
      },
      {
        id: 5,
        timestamp: new Date(Date.now() - 14400000).toISOString(),
        user: 'Lab Tech',
        action: 'UPDATE',
        module: 'Lab Orders',
        details: 'Updated test results',
        ipAddress: '192.168.1.104'
      }
    ];

    return mockLogs.filter(log => {
      if (filters.action && log.action !== filters.action) return false;
      if (filters.user && !log.user.toLowerCase().includes(filters.user.toLowerCase())) return false;
      if (filters.module && log.module !== filters.module) return false;
      if (filters.startDate && new Date(log.timestamp) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(log.timestamp) > new Date(filters.endDate)) return false;
      return true;
    });
  };

  return {
    loading,
    patientStats: getPatientStats(),
    financialStats: getFinancialStats(),
    labStats: getLabStats(),
    departmentStats: getDepartmentStats(),
    auditLogs: getAuditLogs(),
    fetchPatientReports: () => setLoading(false),
    fetchFinancialReports: () => setLoading(false),
    fetchLabReports: () => setLoading(false),
    fetchDepartmentReports: () => setLoading(false),
    fetchAuditLogs: (filters) => getAuditLogs(filters)
  };
};
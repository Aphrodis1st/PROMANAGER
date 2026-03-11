import { useState, useContext } from 'react';
import { usePatients } from './usePatients';
import { useDoctors } from './useDoctors';
import { BillingContext } from '../context/hospitalContext/BillingContext';
import { LabContext } from '../context/hospitalContext/LabContext';
import { useDepartments } from './useDepartments';

export const useReports = () => {
  const { patients } = usePatients();
  const { doctors } = useDoctors();
  const billingContext = useContext(BillingContext);
  const labContext = useContext(LabContext);
  const { departments } = useDepartments();
  
  const [loading, setLoading] = useState(false);

  // Safe access to context data
  const invoices = billingContext?.invoices || [];
  const insuranceClaims = billingContext?.insuranceClaims || [];
  const labOrders = labContext?.labOrders || [];

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
      avgTurnaroundTime: 24 // Mock data - could be calculated from actual data
    };
  };

  // Department Reports Data
  const getDepartmentStats = () => {
    const departmentData = departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      patients: patients.filter(p => p.department === dept.name).length,
      doctors: doctors.filter(d => d.department === dept.name || d.specialization === dept.name).length,
      appointments: Math.floor(Math.random() * 50) + 10, // Mock data
      revenue: Math.floor(Math.random() * 100000) + 50000, // Mock data
      occupancy: Math.floor(Math.random() * 40) + 60 // Mock data
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
    // Mock audit data - in real app, this would come from backend
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
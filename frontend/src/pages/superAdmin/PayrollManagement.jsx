import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';

const PayrollManagement = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [payrollRes, orgsRes] = await Promise.all([
        superAdminService.getAllPayrollData(),
        superAdminService.getAllHROrganizations()
      ]);
      
      if (payrollRes.success) setPayrollData(payrollRes.data);
      if (orgsRes.success) setOrganizations(orgsRes.data);
    } catch (error) {
      console.error('Error fetching payroll data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayroll = selectedOrg === 'all' 
    ? payrollData 
    : payrollData.filter(p => p.organizationId === selectedOrg);

  const totalPayroll = filteredPayroll.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingPayroll = filteredPayroll.filter(p => p.status === 'pending').length;
  const processedPayroll = filteredPayroll.filter(p => p.status === 'processed').length;

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Payroll Management</h1>
            <p className="text-gray-600 mt-1">Monitor and manage payroll across all organizations</p>
          </div>
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Organizations</option>
            {organizations.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Payroll</p>
                <p className="text-3xl font-bold text-gray-800">${totalPayroll.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">$</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-800">{pendingPayroll}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Processed</p>
                <p className="text-3xl font-bold text-gray-800">{processedPayroll}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Organizations</p>
                <p className="text-3xl font-bold text-gray-800">{organizations.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">HR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">Recent Payroll Transactions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayroll.length > 0 ? (
                  filteredPayroll.slice(0, 20).map((payroll, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {organizations.find(o => o.id === payroll.organizationId)?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payroll.employeeName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{payroll.period}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        ${payroll.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payroll.status === 'processed' 
                            ? 'bg-green-100 text-green-800' 
                            : payroll.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payroll.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(payroll.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      No payroll data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Organization Breakdown */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Payroll by Organization</h3>
          <div className="space-y-4">
            {organizations.map(org => {
              const orgPayroll = payrollData.filter(p => p.organizationId === org.id);
              const orgTotal = orgPayroll.reduce((sum, p) => sum + (p.amount || 0), 0);
              return (
                <div key={org.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{org.name}</p>
                    <p className="text-sm text-gray-600">{orgPayroll.length} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">${orgTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Total payroll</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default PayrollManagement;

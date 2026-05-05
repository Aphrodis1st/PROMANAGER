import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import axios from 'axios';

const SuperAdminSettings = () => {
  const [systemName, setSystemName] = useState('PROMANAGER');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [hospitalFeatures, setHospitalFeatures] = useState(true);
  const [stockFeatures, setStockFeatures] = useState(true);
  const [pharmacyFeatures, setPharmacyFeatures] = useState(true);
  const [hrPayrollFeatures, setHrPayrollFeatures] = useState(true);
  const [saved, setSaved] = useState(false);
  const [payrolls, setPayrolls] = useState([]);
  const [showPayroll, setShowPayroll] = useState(false);

  useEffect(() => {
    if (showPayroll) {
      fetchPayrolls();
    }
  }, [showPayroll]);

  const fetchPayrolls = async () => {
    try {
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();
      const response = await axios.get(`/api/v1/hr/payroll/organization?month=${month}&year=${year}`);
      setPayrolls(response.data || []);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">System Settings</h1>
          <p className="text-blue-100">Configure global system preferences</p>
        </div>

        <form onSubmit={handleSave} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
            <input
              type="text"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
              <p className="text-xs text-gray-500">Disable access for non-admin users</p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                maintenanceMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Hospital Management</p>
              <p className="text-xs text-gray-500">Enable hospital management features</p>
            </div>
            <button
              type="button"
              onClick={() => setHospitalFeatures(!hospitalFeatures)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                hospitalFeatures ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  hospitalFeatures ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Stock Management</p>
              <p className="text-xs text-gray-500">Enable stock management features</p>
            </div>
            <button
              type="button"
              onClick={() => setStockFeatures(!stockFeatures)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                stockFeatures ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  stockFeatures ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Pharmacy Management</p>
              <p className="text-xs text-gray-500">Enable pharmacy management features</p>
            </div>
            <button
              type="button"
              onClick={() => setPharmacyFeatures(!pharmacyFeatures)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                pharmacyFeatures ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  pharmacyFeatures ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">HR Payroll Management</p>
              <p className="text-xs text-gray-500">Enable HR payroll management features</p>
            </div>
            <button
              type="button"
              onClick={() => setHrPayrollFeatures(!hrPayrollFeatures)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                hrPayrollFeatures ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  hrPayrollFeatures ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            {saved && <p className="text-green-600 text-sm font-medium">Settings saved successfully!</p>}
            <div className="ml-auto flex gap-3">
              <button
                type="button"
                onClick={() => setShowPayroll(!showPayroll)}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                {showPayroll ? 'Hide Payroll' : 'View Payroll'}
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>

        {showPayroll && (
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">HR Payroll Overview</h2>
            {payrolls.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Employee</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Base Salary</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Allowances</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Overtime</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Tax</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Deductions</th>
                      <th className="p-3 text-left text-sm font-semibold text-gray-700">Net Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payrolls.map((pay, idx) => (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="p-3 text-sm">{pay.employeeId}</td>
                        <td className="p-3 text-sm">${pay.baseSalary?.toFixed(2) || '0.00'}</td>
                        <td className="p-3 text-sm">${pay.allowances?.toFixed(2) || '0.00'}</td>
                        <td className="p-3 text-sm">${pay.overtime?.toFixed(2) || '0.00'}</td>
                        <td className="p-3 text-sm">${pay.tax?.toFixed(2) || '0.00'}</td>
                        <td className="p-3 text-sm">${pay.deductions?.toFixed(2) || '0.00'}</td>
                        <td className="p-3 text-sm font-bold text-green-600">${pay.netSalary?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No payroll data available for this month
              </div>
            )}
          </div>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminSettings;

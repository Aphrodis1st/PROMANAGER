import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';
import axios from 'axios';

const SystemActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [payrolls, setPayrolls] = useState([]);
  const [showPayroll, setShowPayroll] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchPayrolls();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await superAdminService.getSystemActivity();
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getActivityIcon = (type) => {
    const icons = {
      hospital_created: 'H',
      stock_created: 'S',
      pharmacy_created: 'P',
      admin_login: 'A',
      hospital_updated: 'U',
      stock_updated: 'U',
      pharmacy_updated: 'U',
      admin_created: '+',
      hospital_suspended: 'X',
      stock_suspended: 'X',
      pharmacy_suspended: 'X',
      hospital_activated: 'R',
      stock_activated: 'R',
      pharmacy_activated: 'R'
    };
    return icons[type] || 'X';
  };

  const getActivityColor = (type) => {
    const colors = {
      hospital_created: 'bg-green-100 text-green-800',
      stock_created: 'bg-green-100 text-green-800',
      pharmacy_created: 'bg-green-100 text-green-800',
      admin_login: 'bg-blue-100 text-blue-800',
      hospital_updated: 'bg-yellow-100 text-yellow-800',
      stock_updated: 'bg-yellow-100 text-yellow-800',
      pharmacy_updated: 'bg-yellow-100 text-yellow-800',
      admin_created: 'bg-purple-100 text-purple-800',
      hospital_suspended: 'bg-red-100 text-red-800',
      stock_suspended: 'bg-red-100 text-red-800',
      pharmacy_suspended: 'bg-red-100 text-red-800',
      hospital_activated: 'bg-green-100 text-green-800',
      stock_activated: 'bg-green-100 text-green-800',
      pharmacy_activated: 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getActivityDescription = (activity) => {
    const name = activity.data?.name || 'Unknown';
    const email = activity.data?.email || 'Unknown';
    
    switch (activity.type) {
      case 'hospital_created':
        return `New hospital ${name} was created`;
      case 'stock_created':
        return `New stock ${name} was created`;
      case 'pharmacy_created':
        return `New pharmacy ${name} was created`;
      case 'admin_login':
        return `Admin ${email} logged in`;
      case 'hospital_updated':
        return `Hospital ${name} was updated`;
      case 'stock_updated':
        return `Stock ${name} was updated`;
      case 'pharmacy_updated':
        return `Pharmacy ${name} was updated`;
      case 'admin_created':
        return `New admin ${email} was created`;
      case 'hospital_suspended':
        return `Hospital ${name} was suspended`;
      case 'stock_suspended':
        return `Stock ${name} was suspended`;
      case 'pharmacy_suspended':
        return `Pharmacy ${name} was suspended`;
      case 'hospital_activated':
        return `Hospital ${name} was activated`;
      case 'stock_activated':
        return `Stock ${name} was activated`;
      case 'pharmacy_activated':
        return `Pharmacy ${name} was activated`;
      default:
        return 'System activity occurred';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities', count: activities.length },
    { value: 'hospital_created', label: 'Hospital Created', count: activities.filter(a => a.type === 'hospital_created').length },
    { value: 'stock_created', label: 'Stock Created', count: activities.filter(a => a.type === 'stock_created').length },
    { value: 'pharmacy_created', label: 'Pharmacy Created', count: activities.filter(a => a.type === 'pharmacy_created').length },
    { value: 'admin_login', label: 'Admin Logins', count: activities.filter(a => a.type === 'admin_login').length },
    { value: 'hospital_updated', label: 'Hospital Updates', count: activities.filter(a => a.type === 'hospital_updated').length },
    { value: 'stock_updated', label: 'Stock Updates', count: activities.filter(a => a.type === 'stock_updated').length },
    { value: 'pharmacy_updated', label: 'Pharmacy Updates', count: activities.filter(a => a.type === 'pharmacy_updated').length },
    { value: 'admin_created', label: 'Admin Created', count: activities.filter(a => a.type === 'admin_created').length }
  ];

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
            <h1 className="text-3xl font-bold text-gray-800">System Activity</h1>
            <p className="text-gray-600 mt-1">Monitor all system-wide activities and events</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPayroll(!showPayroll)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {showPayroll ? 'Hide Payroll' : 'Show Payroll'}
            </button>
            <button
              onClick={fetchActivities}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Refresh
            </button>
          </div>
        </div>

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

        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Activity Filters</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4">
            {activityTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  filter === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-2xl font-bold">{type.count}</div>
                <div className="text-sm font-medium mt-1">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              Activity Timeline
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredActivities.length} activities)
              </span>
            </h2>
          </div>

          <div className="p-6">
            {filteredActivities.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200">
                        <span className="text-xl font-bold">{getActivityIcon(activity.type)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {getActivityDescription(activity)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActivityColor(activity.type)}`}>
                          {activity.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-4">
                          Date: {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                        <span className="mr-4">
                          Time: {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                        {activity.data?.location && (
                          <span>
                            Location: {activity.data.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  {filter === 'all' ? 'No activities found' : `No ${filter.replace('_', ' ')} activities`}
                </h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'System activities will appear here as they occur'
                    : 'Try selecting a different activity type'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Activities Today:</span>
                <span className="font-bold text-gray-800">
                  {activities.filter(a => 
                    new Date(a.timestamp).toDateString() === new Date().toDateString()
                  ).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Most Active Type:</span>
                <span className="font-bold text-gray-800">
                  {activityTypes.slice(1).reduce((prev, current) => 
                    prev.count > current.count ? prev : current
                  ).label}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Activity:</span>
                <span className="font-bold text-gray-800">
                  {activities.length > 0 
                    ? new Date(activities[0].timestamp).toLocaleTimeString()
                    : 'None'
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">System Health</p>
                <p className="text-xs text-blue-600 mt-1">All systems operational</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Recent Growth</p>
                <p className="text-xs text-green-600 mt-1">
                  {activities.filter(a => a.type === 'hospital_created' || a.type === 'stock_created' || a.type === 'pharmacy_created').length} new entities this month
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Admin Activity</p>
                <p className="text-xs text-purple-600 mt-1">
                  {activities.filter(a => a.type === 'admin_login').length} admin logins recorded
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SystemActivity;
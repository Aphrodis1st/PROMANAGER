import React, { useState, useEffect } from 'react';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import { superAdminService } from '../../services/hospitalService';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        superAdminService.getDashboardStats(),
        superAdminService.getSystemActivity()
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (activitiesRes.success) setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to Super Admin Dashboard</h1>
          <p className="text-blue-100">Manage multiple hospitals and monitor system-wide activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Hospitals</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalHospitals || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">H</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stats?.activeHospitals || 0} Active</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-red-600 font-medium">{stats?.suspendedHospitals || 0} Suspended</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Hospital Admins</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.totalAdmins || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">A</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">{stats?.activeAdmins || 0} Active</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-gray-600 font-medium">{stats?.inactiveAdmins || 0} Inactive</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Premium Plans</p>
                <p className="text-3xl font-bold text-gray-800">{stats?.subscriptionPlans?.premium || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">P</span>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-blue-600 font-medium">{stats?.subscriptionPlans?.basic || 0} Basic</span>
              <span className="text-gray-400 mx-2">•</span>
              <span className="text-purple-600 font-medium">{stats?.subscriptionPlans?.enterprise || 0} Enterprise</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">System Status</p>
                <p className="text-lg font-bold text-green-600">Operational</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">✓</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                All systems running
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2 text-blue-600">📈</span>
              Recent System Activities
            </h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {activities.length > 0 ? (
                activities.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">
                        {activity.type === 'hospital_created' ? 'H' : 'A'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.type === 'hospital_created' 
                          ? `New hospital "${activity.data?.name}" created`
                          : 'Admin login activity'
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activities</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2 text-yellow-600">⚡</span>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
                <div className="text-2xl mb-2 font-bold text-blue-600">H</div>
                <div className="text-sm font-medium text-gray-800">Add Hospital</div>
                <div className="text-xs text-gray-500">Create new hospital</div>
              </button>
              
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
                <div className="text-2xl mb-2 font-bold text-green-600">A</div>
                <div className="text-sm font-medium text-gray-800">Add Admin</div>
                <div className="text-xs text-gray-500">Create hospital admin</div>
              </button>
              
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left">
                <div className="text-2xl mb-2 font-bold text-purple-600">R</div>
                <div className="text-sm font-medium text-gray-800">View Reports</div>
                <div className="text-xs text-gray-500">System analytics</div>
              </button>
              
              <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-left">
                <div className="text-2xl mb-2 font-bold text-orange-600">S</div>
                <div className="text-sm font-medium text-gray-800">Settings</div>
                <div className="text-xs text-gray-500">System configuration</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;
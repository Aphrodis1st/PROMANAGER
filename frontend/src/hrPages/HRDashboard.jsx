import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHRAuth } from '../context/HRAuthContext';
import Card from '../components/hr/Card';
import PageHeader from '../components/hr/PageHeader';

const HRDashboard = () => {
  const [stats, setStats] = useState(null);
  const { organization, admin } = useHRAuth();
  const organizationId = organization?.id || localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    if (organizationId) {
      axios.get(`/api/v1/hr/dashboard?organizationId=${organizationId}`)
        .then(res => setStats(res.data))
        .catch(err => console.error(err));
    }
  }, [organizationId]);

  if (!stats) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Organization Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">{organization?.name || 'HR Dashboard'}</h1>
          <p className="text-purple-100 text-sm">
            {organization?.location && <span className="mr-4">📍 {organization.location}</span>}
            {admin?.email && <span>👤 {admin.email}</span>}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="HR Dashboard" 
          subtitle="Overview of your organization's human resources"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card title="Total Employees" value={stats.totalEmployees} icon="👥" color="blue" />
          <Card title="Present Today" value={stats.presentToday} icon="✅" color="green" />
          <Card title="On Leave" value={stats.onLeave} icon="🏖️" color="yellow" />
          <Card title="Late Check-ins" value={stats.lateCheckIns} icon="⏰" color="red" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Payroll This Month" value={`$${stats.payrollThisMonth?.toLocaleString()}`} icon="💰" color="purple" />
          <Card title="Pending Leave Requests" value={stats.pendingLeaveRequests} icon="📋" color="orange" />
          <Card title="Open Positions" value="0" icon="🎯" color="pink" />
          <Card title="Expiring Contracts" value={stats.expiringContracts} icon="📝" color="indigo" />
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;

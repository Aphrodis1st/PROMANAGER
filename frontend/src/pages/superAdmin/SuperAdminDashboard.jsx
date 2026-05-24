import React from 'react';
import { useNavigate } from 'react-router-dom';
import SuperAdminLayout from '../../components/superAdmin/SuperAdminLayout';
import {
  useGetSuperAdminDashboardStatsQuery,
  useGetSuperAdminSystemActivityQuery,
} from '../../store/actions/superAdmin.js';
import {
  Building2,
  Package,
  Pill,
  HeartHandshake,
  Briefcase,
  Home,
  Users,
  ArrowRight,
  Activity,
  TrendingUp,
  Shield,
} from 'lucide-react';

const services = [
  {
    key: 'hospitals',
    title: 'Hospital',
    description: 'Clinical & patient management',
    path: '/super-admin/hospitals',
    icon: Building2,
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    stats: (s) => ({ total: s?.totalHospitals || 0, active: s?.activeHospitals || 0 }),
  },
  {
    key: 'stocks',
    title: 'Stock',
    description: 'Inventory & supply chain',
    path: '/super-admin/stocks',
    icon: Package,
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
    stats: (s) => ({ total: s?.totalStocks || 0, active: s?.activeStocks || 0 }),
  },
  {
    key: 'pharmacies',
    title: 'Pharmacy',
    description: 'Dispensing & prescriptions',
    path: '/super-admin/pharmacies',
    icon: Pill,
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-600',
    stats: (s) => ({ total: s?.totalPharmacies || 0, active: s?.activePharmacies || 0 }),
  },
  {
    key: 'ngos',
    title: 'NGO',
    description: 'Programs, donors & impact',
    path: '/super-admin/ngos',
    icon: HeartHandshake,
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    stats: (s) => ({ total: s?.totalNGOs || 0, active: s?.activeNGOs || 0 }),
  },
  {
    key: 'hr',
    title: 'HR',
    description: 'Workforce & payroll',
    path: '/super-admin/hr',
    icon: Briefcase,
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    stats: (s) => ({ total: s?.totalHROrganizations || 0, active: s?.activeHROrganizations || 0 }),
  },
  {
    key: 'properties',
    title: 'Property',
    description: 'Leases, tenants & billing',
    path: '/super-admin/properties',
    icon: Home,
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    stats: (s) => ({ total: s?.totalPropertyOrganizations || 0, active: s?.activePropertyOrganizations || 0 }),
  },
];

const activityIcon = (type) => {
  const map = {
    hospital_created: { label: 'H', color: 'bg-blue-100 text-blue-600' },
    stock_created: { label: 'S', color: 'bg-orange-100 text-orange-600' },
    pharmacy_created: { label: 'P', color: 'bg-teal-100 text-teal-600' },
    ngo_created: { label: 'N', color: 'bg-emerald-100 text-emerald-600' },
    admin_login: { label: 'A', color: 'bg-violet-100 text-violet-600' },
  };
  return map[type] || { label: '•', color: 'bg-gray-100 text-gray-600' };
};

const activityMessage = (activity) => {
  if (activity.type === 'hospital_created') return `New hospital "${activity.data?.name}" created`;
  if (activity.type === 'stock_created') return `New stock "${activity.data?.name}" created`;
  if (activity.type === 'pharmacy_created') return `New pharmacy "${activity.data?.name}" created`;
  if (activity.type === 'ngo_created') return `New NGO "${activity.data?.name}" created`;
  return 'Admin activity recorded';
};

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useGetSuperAdminDashboardStatsQuery();
  const { data: activities = [], isLoading: activityLoading } = useGetSuperAdminSystemActivityQuery();

  const loading = statsLoading || activityLoading;

  const totalEntities = services.reduce((sum, svc) => sum + svc.stats(stats).total, 0);
  const totalActive = services.reduce((sum, svc) => sum + svc.stats(stats).active, 0);

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600" />
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-8">
        {/* Hero */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                <Shield className="h-3.5 w-3.5" />
                Service Management Console
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                Platform Overview
              </h1>
              <p className="mt-2 max-w-xl text-gray-600">
                Manage hospitals, stock, pharmacies, NGOs, HR, property, and administrators from one unified control center.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { label: 'Services', value: services.length, icon: TrendingUp },
                { label: 'Entities', value: totalEntities, icon: Activity },
                { label: 'Active', value: totalActive, icon: Shield },
                { label: 'Admins', value: stats?.totalAdmins || 0, icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-gray-100 bg-slate-50 px-4 py-3">
                  <Icon className="mb-1 h-4 w-4 text-indigo-600" />
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Service Cards */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Platform Services</h2>
            <button
              onClick={() => navigate('/super-admin/hospital-admins')}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              Manage Admins <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              const { total, active } = service.stats(stats);
              const suspended = total - active;
              return (
                <button
                  key={service.key}
                  onClick={() => navigate(service.path)}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl ${service.bgLight} p-3`}>
                      <Icon className={`h-6 w-6 ${service.textColor}`} />
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-gray-900">{service.title}</h3>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{total}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div>
                      <p className={`text-lg font-semibold ${service.textColor}`}>{active}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    {suspended > 0 && (
                      <div>
                        <p className="text-lg font-semibold text-red-500">{suspended}</p>
                        <p className="text-xs text-gray-500">Suspended</p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Activity */}
          <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {activities.length > 0 ? (
                activities.slice(0, 10).map((activity, index) => {
                  const icon = activityIcon(activity.type);
                  return (
                    <div key={index} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${icon.color}`}>
                        {icon.label}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800">{activityMessage(activity)}</p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-8 text-center text-gray-500">No recent activities</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Add Hospital', path: '/super-admin/hospitals', color: 'hover:bg-blue-50 hover:border-blue-200' },
                { label: 'Add Stock Entity', path: '/super-admin/stocks', color: 'hover:bg-orange-50 hover:border-orange-200' },
                { label: 'Add Pharmacy', path: '/super-admin/pharmacies', color: 'hover:bg-teal-50 hover:border-teal-200' },
                { label: 'Add NGO', path: '/super-admin/ngos', color: 'hover:bg-emerald-50 hover:border-emerald-200' },
                { label: 'Add HR Organization', path: '/super-admin/hr', color: 'hover:bg-indigo-50 hover:border-indigo-200' },
                { label: 'Add Property Org', path: '/super-admin/properties', color: 'hover:bg-amber-50 hover:border-amber-200' },
                { label: 'Create Admin', path: '/super-admin/hospital-admins', color: 'hover:bg-violet-50 hover:border-violet-200' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`flex w-full items-center justify-between rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition ${action.color}`}
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Admin summary bar */}
        <div className="rounded-2xl border border-gray-100 bg-violet-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-violet-600 p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Administrator Accounts</p>
                <p className="text-sm text-gray-600">
                  {stats?.activeAdmins || 0} active · {stats?.inactiveAdmins || 0} inactive · {stats?.totalAdmins || 0} total
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/super-admin/hospital-admins')}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-violet-700"
            >
              Manage Admins <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default SuperAdminDashboard;

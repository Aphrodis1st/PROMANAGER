import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  HeartHandshake,
  Pill,
  Briefcase,
  DollarSign,
  Home,
  Activity,
  Settings,
  Coins,
  Shield,
} from 'lucide-react';

const SuperAdminSidebar = () => {
  const location = useLocation();

  const isActive = (path, exact = false) =>
    exact ? location.pathname === path : location.pathname.includes(path);

  const sections = [
    {
      title: 'Overview',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/super-admin/dashboard', exact: true },
      ],
    },
    {
      title: 'Platform Services',
      items: [
        { title: 'Hospital Management', icon: Building2, path: '/super-admin/hospitals' },
        { title: 'Stock Management', icon: Package, path: '/super-admin/stocks' },
        { title: 'Pharmacy Management', icon: Pill, path: '/super-admin/pharmacies' },
        { title: 'NGO Management', icon: HeartHandshake, path: '/super-admin/ngos' },
        { title: 'HR Management', icon: Briefcase, path: '/super-admin/hr' },
        { title: 'Property Management', icon: Home, path: '/super-admin/properties' },
        { title: 'Payroll Management', icon: DollarSign, path: '/super-admin/payroll' },
      ],
    },
    {
      title: 'Administration',
      items: [
        { title: 'Hospital Admins', icon: Users, path: '/super-admin/hospital-admins' },
        { title: 'Role Management', icon: Shield, path: '/super-admin/roles' },
        { title: 'User Management', icon: Users, path: '/super-admin/users' },
        { title: 'Currency Management', icon: Coins, path: '/super-admin/currency' },
        { title: 'System Activity', icon: Activity, path: '/super-admin/activity', exact: true },
        { title: 'Settings', icon: Settings, path: '/super-admin/settings', exact: true },
      ],
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-slate-50 text-gray-900">
      <div className="border-b border-gray-200 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-gray-900">Super Admin</h1>
            <p className="text-xs text-gray-500">Service Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const active = isActive(item.path, item.exact);
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-white' : 'text-gray-500 group-hover:text-indigo-600'}`} />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 px-5 py-4">
        <p className="text-center text-xs text-gray-500">© 2026 PROMANAGER</p>
      </div>
    </aside>
  );
};

export default SuperAdminSidebar;

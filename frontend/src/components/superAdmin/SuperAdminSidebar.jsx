import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SuperAdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'D',
      path: '/super-admin/dashboard',
      active: location.pathname === '/super-admin/dashboard'
    },
    {
      title: 'Hospital Management',
      icon: 'H',
      path: '/super-admin/hospitals',
      active: location.pathname.includes('/super-admin/hospitals')
    },
    {
      title: 'Hospital Admins',
      icon: 'A',
      path: '/super-admin/hospital-admins',
      active: location.pathname.includes('/super-admin/hospital-admins')
    },
    {
      title: 'Stock Management',
      icon: 'S',
      path: '/super-admin/stocks',
      active: location.pathname.includes('/super-admin/stocks')
    },
    {
      title: 'NGO Management',
      icon: 'N',
      path: '/super-admin/ngos',
      active: location.pathname.includes('/super-admin/ngos')
    },
    {
      title: 'Pharmacy Management',
      icon: 'P',
      path: '/super-admin/pharmacies',
      active: location.pathname.includes('/super-admin/pharmacies')
    },
    {
      title: 'HR Management',
      icon: 'HR',
      path: '/super-admin/hr',
      active: location.pathname.includes('/super-admin/hr')
    },
    {
      title: 'Payroll Management',
      icon: '$',
      path: '/super-admin/payroll',
      active: location.pathname.includes('/super-admin/payroll')
    },
    {
      title: 'System Activity',
      icon: 'Y',
      path: '/super-admin/activity',
      active: location.pathname === '/super-admin/activity'
    },
    {
      title: 'Settings',
      icon: 'C',
      path: '/super-admin/settings',
      active: location.pathname === '/super-admin/settings'
    }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen fixed left-0 top-0 overflow-y-auto shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-600">H</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Super Admin</h1>
            <p className="text-blue-200 text-sm">Service Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 ${
                  item.active ? 'bg-blue-700 border-r-4 border-white' : ''
                }`}
              >
                <span className="text-xl font-bold">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
        <div className="text-center text-blue-200 text-sm">
          <p>© 2024 PROMANAGER</p>
          <p>Super Admin Panel</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;

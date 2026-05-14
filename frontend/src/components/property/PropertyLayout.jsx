import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function PropertyLayout() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/property" className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-600">
                <span className="font-bold text-xl">Property Management</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white shadow-lg min-h-screen">
          <nav className="mt-5 px-2">
            <Link to="/property" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property') && location.pathname === '/property' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Dashboard
            </Link>
            <Link to="/property/properties" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/properties') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Properties
            </Link>
            <Link to="/property/units" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/units') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Units
            </Link>
            <Link to="/property/tenants" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/tenants') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Tenants
            </Link>
            <Link to="/property/leases" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/leases') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Leases
            </Link>
            <Link to="/property/billing" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/billing') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Billing
            </Link>
            <Link to="/property/maintenance" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/maintenance') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Maintenance
            </Link>
            <Link to="/property/staff" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/staff') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Staff
            </Link>
            <Link to="/property/reports" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/reports') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Reports
            </Link>
            <Link to="/property/communication" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/communication') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Communication
            </Link>
            <Link to="/property/settings" className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive('/property/settings') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              Settings
            </Link>
          </nav>
        </aside>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

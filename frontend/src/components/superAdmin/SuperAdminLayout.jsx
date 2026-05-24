import React from 'react';
import SuperAdminSidebar from './SuperAdminSidebar';
import SuperAdminNavbar from './SuperAdminNavbar';

const SuperAdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <SuperAdminSidebar />
      <div className="ml-64">
        <SuperAdminNavbar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
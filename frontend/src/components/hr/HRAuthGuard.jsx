import React from 'react';
import { useHRAuth } from '../../context/HRAuthContext';

const HRAuthGuard = ({ children, icon: Icon, title = "HR System Access Required" }) => {
  const { organization } = useHRAuth();
  const organizationId = organization?.id || organization?._id;

  if (!organizationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          {Icon && <Icon className="w-16 h-16 text-purple-600 mx-auto mb-4" />}
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
          <p className="text-slate-600 mb-6">Please log in to the HR system to access this page.</p>
          <a href="/hr/login" className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all">
            Go to HR Login
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default HRAuthGuard;

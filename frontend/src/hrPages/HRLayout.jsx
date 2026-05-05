import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useHRAuth } from '../context/HRAuthContext';

const HRLayout = () => {
  const { logout, admin, organization } = useHRAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/hr/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gradient-to-b from-purple-800 to-indigo-900 text-white shadow-2xl">
        <div className="p-6 border-b border-purple-700">
          <h2 className="text-2xl font-bold">HR & Payroll</h2>
          <p className="text-xs text-purple-200 mt-1">{organization?.name || 'Management System'}</p>
        </div>
        <nav className="mt-6">
          <Link to="/hr/dashboard" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">📊</span> HR Dashboard
          </Link>
          <Link to="/hr/employees" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">👥</span> Employees
          </Link>
          <Link to="/hr/departments" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">🏢</span> Departments
          </Link>
          <Link to="/hr/attendance" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">⏰</span> Attendance
          </Link>
          <Link to="/hr/shifts" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">🕐</span> Shifts & Scheduling
          </Link>
          <Link to="/hr/leave" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">🏖️</span> Leave Management
          </Link>
          <Link to="/hr/payroll" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">💰</span> Payroll
          </Link>
          <Link to="/hr/payslips" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">📄</span> Payslips
          </Link>
          <Link to="/hr/contracts" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">📝</span> Contracts
          </Link>
          <Link to="/hr/performance" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">⭐</span> Performance
          </Link>
          <Link to="/hr/documents" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">📁</span> Documents
          </Link>
          <Link to="/hr/recruitment" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">🎯</span> Recruitment
          </Link>
          <Link to="/hr/reports" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">📈</span> Reports
          </Link>
          <Link to="/hr/settings" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">⚙️</span> Settings
          </Link>
          <Link to="/hr/organizations" className="flex items-center px-6 py-3 hover:bg-purple-700 transition">
            <span className="mr-3">🏛️</span> Organizations
          </Link>
        </nav>
        <div className="absolute bottom-0 w-64 p-6 border-t border-purple-700">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-lg">👤</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{admin?.firstName || 'Admin'}</p>
              <p className="text-xs text-purple-300">{admin?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-lg transition text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default HRLayout;

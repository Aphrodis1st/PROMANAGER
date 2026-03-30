import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHospitalAuth } from '../../context/HospitalAuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { admin, isAuthenticated } = useHospitalAuth();

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/hospital/login" replace />;
  }

  // Check if user has admin role (accept both 'admin' and 'hospital_admin')
  if (!admin || (admin.role !== 'hospital_admin' && admin.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this admin area.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
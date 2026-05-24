import React from 'react';
import { useHospitalAuth } from '../../context/HospitalAuthContext';
import GlobalProtectedRoute from '../ProtectedRoute.jsx';

const AdminProtectedRoute = ({ children }) => {
  const { admin } = useHospitalAuth();

  return (
    <GlobalProtectedRoute service="hospital">
      {!admin || (admin.role !== 'hospital_admin' && admin.role !== 'admin') ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don&apos;t have permission to access this admin area.
            </p>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go Back
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </GlobalProtectedRoute>
  );
};

export default AdminProtectedRoute;

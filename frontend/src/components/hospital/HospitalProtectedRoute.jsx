import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHospitalAuth } from '../../context/HospitalAuthContext';
import { ProtectedRoute } from './RBAC';

// Legacy protected route for backward compatibility
export default function HospitalProtectedRoute({ children, roles, departments, permissions, requireAll = false }) {
  const { isAuthenticated } = useHospitalAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/hospital/login" replace />;
  }
  
  // If no RBAC rules specified, just check authentication
  if (!roles && !departments && !permissions) {
    return children;
  }
  
  // Use new RBAC system for access control
  return (
    <ProtectedRoute 
      roles={roles} 
      departments={departments} 
      permissions={permissions} 
      requireAll={requireAll}
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500 mt-2">
              Required: {roles && `Role: ${Array.isArray(roles) ? roles.join(', ') : roles}`}
              {departments && ` | Department: ${Array.isArray(departments) ? departments.join(', ') : departments}`}
              {permissions && ` | Permission: ${Array.isArray(permissions) ? permissions.join(', ') : permissions}`}
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ProtectedRoute>
  );
}

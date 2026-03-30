import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute check:', { user, loading, requiredRole });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/hospital/login" replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    console.log('Role check:', { userRole: user.role, allowedRoles });
    
    if (!allowedRoles.includes(user.role)) {
      console.log('Role not allowed, redirecting to unauthorized');
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('Access granted');
  return children;
};

export default ProtectedRoute;
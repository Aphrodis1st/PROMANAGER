import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHRAuth } from '../../context/HRAuthContext';

const HRProtectedRoute = ({ children }) => {
  const { isAuthenticated, token } = useHRAuth();

  if (!isAuthenticated || !token) {
    return <Navigate to="/hr/login" replace />;
  }

  return children;
};

export default HRProtectedRoute;

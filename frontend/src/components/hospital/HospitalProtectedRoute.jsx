import React from 'react';
import { Navigate } from 'react-router-dom';
import { useHospitalAuth } from '../../context/HospitalAuthContext';

export default function HospitalProtectedRoute({ children }) {
  const { isAuthenticated } = useHospitalAuth();
  if (!isAuthenticated) return <Navigate to="/hospital/login" replace />;
  return children;
}

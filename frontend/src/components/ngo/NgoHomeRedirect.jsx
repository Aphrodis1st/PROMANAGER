import React from 'react';
import { Navigate } from 'react-router-dom';
import { getServiceUser } from '../../utils/authCookies.js';
import { getDefaultNgoPath } from '../../config/ngoNavigationScopes.js';

export default function NgoHomeRedirect() {
  const user = getServiceUser('ngo');
  const target = getDefaultNgoPath(user).replace(/^\/ngo\/?/, '') || 'dashboard';
  return <Navigate to={target} replace />;
}

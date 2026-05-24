import React from 'react';
import ProtectedRoute, { HRProtectedContent } from '../ProtectedRoute.jsx';

const HRProtectedRoute = ({ children }) => (
  <ProtectedRoute service="hr">
    <HRProtectedContent>{children}</HRProtectedContent>
  </ProtectedRoute>
);

export default HRProtectedRoute;

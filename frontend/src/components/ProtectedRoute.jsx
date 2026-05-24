import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStockAuth } from '../context/StockAuthContext.jsx';
import { useHRAuth } from '../context/HRAuthContext.jsx';
import { isServiceAuthenticated, getServiceLoginPath } from '../utils/authCookies.js';

/**
 * Unified route guard for all PROMANAGER services.
 * Checks the service session cookie (js-cookie) before rendering children.
 */
const ProtectedRoute = ({
  service,
  children,
  roles = null,
  departments = null,
  requiredRole = null,
}) => {
  if (!isServiceAuthenticated(service)) {
    return <Navigate to={getServiceLoginPath(service)} replace />;
  }

  if (service === 'stock' && (roles || departments)) {
    return (
      <StockAccessGate roles={roles} departments={departments}>
        {children}
      </StockAccessGate>
    );
  }

  if (service === 'stock' && requiredRole) {
    return (
      <StockAccessGate roles={requiredRole}>
        {children}
      </StockAccessGate>
    );
  }

  return children;
};

function StockAccessGate({ children, roles, departments }) {
  const { user, loading, hasRole, inDepartment } = useStockAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={getServiceLoginPath('stock')} replace />;
  }

  if (roles && !hasRole(roles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold text-red-600">
          Access Denied: You do not have the required role.
        </p>
      </div>
    );
  }

  if (departments && !inDepartment(departments)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl font-bold text-red-600">
          Access Denied: You do not belong to the required department.
        </p>
      </div>
    );
  }

  return children;
}

/** HR session must also be active in context after cookie check. */
export function HRProtectedContent({ children }) {
  const { isAuthenticated, token } = useHRAuth();

  if (!isServiceAuthenticated('hr') || !isAuthenticated || !token) {
    return <Navigate to={getServiceLoginPath('hr')} replace />;
  }

  return children;
}

export default ProtectedRoute;

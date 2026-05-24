import React from 'react';
import GlobalProtectedRoute from '../ProtectedRoute.jsx';
import { ProtectedRoute as RBACProtectedRoute } from './RBAC';

export default function HospitalProtectedRoute({
  children,
  roles,
  departments,
  permissions,
  requireAll = false,
}) {
  if (!roles && !departments && !permissions) {
    return <GlobalProtectedRoute service="hospital">{children}</GlobalProtectedRoute>;
  }

  return (
    <GlobalProtectedRoute service="hospital">
      <RBACProtectedRoute
        roles={roles}
        departments={departments}
        permissions={permissions}
        requireAll={requireAll}
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
              <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
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
      </RBACProtectedRoute>
    </GlobalProtectedRoute>
  );
}

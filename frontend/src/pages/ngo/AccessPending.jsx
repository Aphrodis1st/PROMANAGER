import React from 'react';
import { Shield } from 'lucide-react';
import { getServiceUser } from '../../utils/authCookies.js';
import { formatNavigationScopeLabels } from '../../config/ngoNavigationScopes.js';

export default function AccessPending() {
  const user = getServiceUser('ngo');
  const assignedScopes = formatNavigationScopeLabels(user?.navigationScopes || []);

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
      <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
        <Shield className="h-6 w-6 text-amber-600" />
      </div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Access not configured</h1>
      <p className="text-gray-600 text-sm mb-4">
        Your account is active, but no workspace modules have been assigned yet.
        Ask your organization administrator to assign you a role with module access.
      </p>
      {assignedScopes !== '—' && (
        <p className="text-xs text-gray-500">
          Current assignment: {assignedScopes}
        </p>
      )}
    </div>
  );
}

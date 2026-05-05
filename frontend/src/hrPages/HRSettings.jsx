import React, { useState } from 'react';
import { useHRAuth } from '../context/HRAuthContext';
import CurrencySettings from '../components/CurrencySettings';

const HRSettings = () => {
  const { organization } = useHRAuth();
  const [message, setMessage] = useState('');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">HR Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Currency Configuration</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select the currency to be used for all payroll, salaries, and financial reports.
          </p>
          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          <CurrencySettings 
            organizationId={organization?.id || 'default'}
            moduleType="hr"
            onSave={() => setMessage('Currency settings updated successfully')}
          />
        </div>

        {/* Organization Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Organization Information</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={organization?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <span className={`px-3 py-1 rounded-full text-sm ${
                organization?.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {organization?.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRSettings;

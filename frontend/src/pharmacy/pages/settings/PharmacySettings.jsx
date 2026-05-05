import React, { useState } from 'react';
import CurrencySettings from '../../../components/CurrencySettings';

const PharmacySettings = () => {
  const [message, setMessage] = useState('');
  const pharmacyId = localStorage.getItem('pharmacyId') || 'default';

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Pharmacy Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Currency Configuration</h2>
          <p className="text-sm text-gray-600 mb-4">
            Select the currency to be used for all orders, quotes, and financial transactions.
          </p>
          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          <CurrencySettings 
            organizationId={pharmacyId}
            moduleType="pharmacy"
            onSave={() => setMessage('Currency settings updated successfully')}
          />
        </div>

        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">General Settings</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pharmacy Name
              </label>
              <input
                type="text"
                placeholder="Enter pharmacy name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                placeholder="pharmacy@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 8900"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacySettings;

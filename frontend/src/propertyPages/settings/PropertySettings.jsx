import React, { useState } from 'react';

export default function PropertySettings() {
  const [settings, setSettings] = useState({
    currency: 'USD',
    taxRate: 0,
    lateFeePercentage: 5,
    paymentMethods: ['Cash', 'Bank Transfer', 'Mobile Money', 'Card']
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">General Settings</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({...settings, currency: e.target.value})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
            <input
              type="number"
              value={settings.taxRate}
              onChange={(e) => setSettings({...settings, taxRate: parseFloat(e.target.value)})}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Late Fee Percentage (%)</label>
            <input
              type="number"
              value={settings.lateFeePercentage}
              onChange={(e) => setSettings({...settings, lateFeePercentage: parseFloat(e.target.value)})}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button onClick={handleSave} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
            Save Settings
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {settings.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <span>{method}</span>
                <span className="text-green-600">✓ Enabled</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Roles & Permissions</h2>
          <div className="space-y-2">
            <div className="p-3 border rounded">
              <p className="font-medium">Property Manager</p>
              <p className="text-sm text-gray-600">Full access to all features</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-medium">Maintenance Staff</p>
              <p className="text-sm text-gray-600">Access to maintenance tickets only</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-medium">Accountant</p>
              <p className="text-sm text-gray-600">Access to billing and reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Audit Logs</h2>
          <div className="space-y-2">
            <div className="text-sm border-l-4 border-blue-500 pl-3 py-2">
              <p className="font-medium">Property Created</p>
              <p className="text-gray-600">Admin - 2 hours ago</p>
            </div>
            <div className="text-sm border-l-4 border-green-500 pl-3 py-2">
              <p className="font-medium">Invoice Generated</p>
              <p className="text-gray-600">System - 3 hours ago</p>
            </div>
            <div className="text-sm border-l-4 border-yellow-500 pl-3 py-2">
              <p className="font-medium">Settings Updated</p>
              <p className="text-gray-600">Admin - Yesterday</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

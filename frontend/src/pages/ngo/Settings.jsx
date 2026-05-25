import React from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Configure system settings and preferences</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Save size={20} />
          <span>Save Settings</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <SettingsIcon className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-800 mb-2">System Settings</h3>
        <p className="text-gray-500">Settings interface coming soon</p>
      </div>
    </div>
  );
}

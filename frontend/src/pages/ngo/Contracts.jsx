import React from 'react';
import { FileText, Plus } from 'lucide-react';

export default function Contracts() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contracts</h1>
          <p className="text-gray-600 mt-1">Manage contracts, agreements, and legal documents</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Contract</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <FileText className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Contracts Management</h3>
        <p className="text-gray-500">Contract management interface coming soon</p>
      </div>
    </div>
  );
}

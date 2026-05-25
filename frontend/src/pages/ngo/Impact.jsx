import React from 'react';
import { Target, Plus } from 'lucide-react';

export default function Impact() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Impact & Evaluation</h1>
          <p className="text-gray-600 mt-1">Track and evaluate program impact and outcomes</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Evaluation</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Target className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Impact & Evaluation</h3>
        <p className="text-gray-500">Impact evaluation interface coming soon</p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function OwnerPortal() {
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, expenses: 0, netIncome: 0 });

  useEffect(() => {
    // Fetch owner's properties
    setProperties([
      { id: 1, name: 'Sunset Apartments', revenue: 15000, expenses: 5000 },
      { id: 2, name: 'Downtown Plaza', revenue: 25000, expenses: 8000 }
    ]);
    setStats({ revenue: 40000, expenses: 13000, netIncome: 27000 });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Owner Portal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">${stats.revenue}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">${stats.expenses}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Net Income</h3>
          <p className="text-3xl font-bold text-blue-600">${stats.netIncome}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold">My Properties</h2>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expenses</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Income</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4">{property.name}</td>
                <td className="px-6 py-4 text-green-600">${property.revenue}</td>
                <td className="px-6 py-4 text-red-600">${property.expenses}</td>
                <td className="px-6 py-4 text-blue-600">${property.revenue - property.expenses}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Statements</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Monthly Statement - December 2024</p>
                <p className="text-sm text-gray-600">Generated on Dec 31, 2024</p>
              </div>
              <button className="text-blue-600 hover:underline">Download</button>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">Monthly Statement - November 2024</p>
                <p className="text-sm text-gray-600">Generated on Nov 30, 2024</p>
              </div>
              <button className="text-blue-600 hover:underline">Download</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Pending Approvals</h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <p className="font-medium">Maintenance Cost Approval</p>
              <p className="text-sm text-gray-600">Plumbing repair - $450</p>
              <div className="mt-2 flex gap-2">
                <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Approve</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

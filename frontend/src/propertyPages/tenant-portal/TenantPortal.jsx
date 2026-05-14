import React, { useState } from 'react';

export default function TenantPortal() {
  const [tenant] = useState({
    name: 'John Doe',
    unit: 'A-101',
    rentDue: 1200,
    dueDate: '2024-01-05'
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tenant Portal</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Current Rent</h3>
          <p className="text-3xl font-bold">${tenant.rentDue}</p>
          <p className="text-sm text-gray-600 mt-2">Due: {tenant.dueDate}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Unit</h3>
          <p className="text-3xl font-bold">{tenant.unit}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Lease Status</h3>
          <p className="text-xl font-bold text-green-600">Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 text-left">
              💳 Pay Rent
            </button>
            <button className="w-full bg-green-500 text-white px-4 py-3 rounded hover:bg-green-600 text-left">
              🔧 Submit Maintenance Request
            </button>
            <button className="w-full bg-purple-500 text-white px-4 py-3 rounded hover:bg-purple-600 text-left">
              📄 View Lease Agreement
            </button>
            <button className="w-full bg-yellow-500 text-white px-4 py-3 rounded hover:bg-yellow-600 text-left">
              📊 Upload Meter Readings
            </button>
            <button className="w-full bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 text-left">
              🧾 Download Receipts
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Payment History</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">December 2024</p>
                <p className="text-sm text-gray-600">Paid on Dec 1, 2024</p>
              </div>
              <span className="text-green-600 font-bold">$1,200</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">November 2024</p>
                <p className="text-sm text-gray-600">Paid on Nov 1, 2024</p>
              </div>
              <span className="text-green-600 font-bold">$1,200</span>
            </div>
            <div className="flex justify-between items-center p-3 border rounded">
              <div>
                <p className="font-medium">October 2024</p>
                <p className="text-sm text-gray-600">Paid on Oct 1, 2024</p>
              </div>
              <span className="text-green-600 font-bold">$1,200</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Maintenance Requests</h2>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <p className="font-medium">Leaking Faucet</p>
              <p className="text-sm text-gray-600">Status: In Progress</p>
              <p className="text-sm text-gray-600">Submitted: 2 days ago</p>
            </div>
            <div className="p-3 border-l-4 border-green-500 bg-green-50">
              <p className="font-medium">AC Maintenance</p>
              <p className="text-sm text-gray-600">Status: Completed</p>
              <p className="text-sm text-gray-600">Completed: 1 week ago</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Announcements</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded">
              <p className="font-medium">Building Maintenance</p>
              <p className="text-sm text-gray-600">Scheduled for Jan 15, 2024</p>
            </div>
            <div className="p-3 border rounded">
              <p className="font-medium">Holiday Hours</p>
              <p className="text-sm text-gray-600">Office closed Dec 25-26</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

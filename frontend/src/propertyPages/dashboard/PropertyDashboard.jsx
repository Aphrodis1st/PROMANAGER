import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PropertyDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    occupancyRate: 0,
    rentCollected: 0,
    pendingPayments: 0,
    openTickets: 0,
    expiringLeases: 0,
    staffOnDuty: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/properties/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Property Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Properties</h3>
          <p className="text-3xl font-bold">{stats.totalProperties}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Units</h3>
          <p className="text-3xl font-bold">{stats.totalUnits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Occupancy Rate</h3>
          <p className="text-3xl font-bold">{stats.occupancyRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Rent Collected</h3>
          <p className="text-3xl font-bold">${stats.rentCollected}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Payments</h3>
          <p className="text-3xl font-bold">${stats.pendingPayments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Open Tickets</h3>
          <p className="text-3xl font-bold">{stats.openTickets}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Expiring Leases</h3>
          <p className="text-3xl font-bold">{stats.expiringLeases}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Staff on Duty</h3>
          <p className="text-3xl font-bold">{stats.staffOnDuty}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/property/properties" className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600">
          <h3 className="text-xl font-bold">Properties</h3>
          <p>Manage all properties</p>
        </Link>
        <Link to="/property/units" className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600">
          <h3 className="text-xl font-bold">Units</h3>
          <p>Manage units & rooms</p>
        </Link>
        <Link to="/property/tenants" className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600">
          <h3 className="text-xl font-bold">Tenants</h3>
          <p>Manage tenants</p>
        </Link>
        <Link to="/property/leases" className="bg-yellow-500 text-white p-6 rounded-lg shadow hover:bg-yellow-600">
          <h3 className="text-xl font-bold">Leases</h3>
          <p>Manage leases</p>
        </Link>
        <Link to="/property/billing" className="bg-red-500 text-white p-6 rounded-lg shadow hover:bg-red-600">
          <h3 className="text-xl font-bold">Billing</h3>
          <p>Invoices & payments</p>
        </Link>
        <Link to="/property/maintenance" className="bg-orange-500 text-white p-6 rounded-lg shadow hover:bg-orange-600">
          <h3 className="text-xl font-bold">Maintenance</h3>
          <p>Work orders & tickets</p>
        </Link>
      </div>
    </div>
  );
}

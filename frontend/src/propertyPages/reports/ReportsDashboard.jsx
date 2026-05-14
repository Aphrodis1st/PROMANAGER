import React from 'react';
import { Link } from 'react-router-dom';

export default function ReportsDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/property/reports/revenue" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Revenue Report</h3>
          <p className="text-gray-600">View revenue per property and overall performance</p>
        </Link>

        <Link to="/property/reports/occupancy" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Occupancy Trends</h3>
          <p className="text-gray-600">Track occupancy rates over time</p>
        </Link>

        <Link to="/property/reports/rent-collection" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Rent Collection</h3>
          <p className="text-gray-600">Monitor rent collection and payment status</p>
        </Link>

        <Link to="/property/reports/maintenance" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Maintenance Costs</h3>
          <p className="text-gray-600">Analyze maintenance expenses by property</p>
        </Link>

        <Link to="/property/reports/tenant" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Tenant Report</h3>
          <p className="text-gray-600">View tenant demographics and history</p>
        </Link>

        <Link to="/property/reports/financial" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Financial Summary</h3>
          <p className="text-gray-600">Complete financial overview and P&L</p>
        </Link>

        <Link to="/property/reports/lease-expiry" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Lease Expiry</h3>
          <p className="text-gray-600">Track upcoming lease expirations</p>
        </Link>

        <Link to="/property/reports/vacancy" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Vacancy Analysis</h3>
          <p className="text-gray-600">Analyze vacancy patterns and duration</p>
        </Link>

        <Link to="/property/reports/custom" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2">Custom Reports</h3>
          <p className="text-gray-600">Create custom reports with filters</p>
        </Link>
      </div>
    </div>
  );
}

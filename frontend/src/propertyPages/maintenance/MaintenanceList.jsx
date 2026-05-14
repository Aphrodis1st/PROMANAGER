import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MaintenanceList() {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      const url = filter === 'all'
        ? 'http://localhost:3001/api/v1/property/maintenance'
        : `http://localhost:3001/api/v1/property/maintenance?status=${filter}`;
      const response = await fetch(url);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Maintenance & Work Orders</h1>
        <Link to="/property/maintenance/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create Ticket
        </Link>
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
        <button onClick={() => setFilter('open')} className={`px-4 py-2 rounded ${filter === 'open' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>Open</button>
        <button onClick={() => setFilter('in-progress')} className={`px-4 py-2 rounded ${filter === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>In Progress</button>
        <button onClick={() => setFilter('completed')} className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>Completed</button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technician</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4">{ticket.ticketNumber}</td>
                <td className="px-6 py-4">{ticket.propertyName}</td>
                <td className="px-6 py-4">{ticket.unitNumber}</td>
                <td className="px-6 py-4">{ticket.issue}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-6 py-4">{ticket.technicianName || 'Unassigned'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    ticket.status === 'completed' ? 'bg-green-100 text-green-800' :
                    ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/property/maintenance/${ticket.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

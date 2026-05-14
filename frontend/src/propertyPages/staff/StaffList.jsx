import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function StaffList() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/staff');
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Staff Management</h1>
        <Link to="/property/staff/create" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Staff
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id}>
                <td className="px-6 py-4">{member.firstName} {member.lastName}</td>
                <td className="px-6 py-4">{member.role}</td>
                <td className="px-6 py-4">{member.propertyName}</td>
                <td className="px-6 py-4">{member.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/property/staff/${member.id}`} className="text-blue-600 hover:underline mr-3">View</Link>
                  <Link to={`/property/staff/${member.id}/schedule`} className="text-green-600 hover:underline">Schedule</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

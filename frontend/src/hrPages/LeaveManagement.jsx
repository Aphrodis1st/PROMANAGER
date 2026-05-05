import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const organizationId = localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    loadPendingLeaves();
  }, []);

  const loadPendingLeaves = () => {
    axios.get(`/api/v1/hr/leaves/pending?organizationId=${organizationId}`)
      .then(res => setLeaves(res.data))
      .catch(err => console.error(err));
  };

  const handleApprove = (id) => {
    axios.put(`/api/v1/hr/leaves/${id}/approve`, { approvedBy: 'Manager' })
      .then(() => loadPendingLeaves())
      .catch(err => console.error(err));
  };

  const handleReject = (id) => {
    axios.put(`/api/v1/hr/leaves/${id}/reject`, { approvedBy: 'Manager' })
      .then(() => loadPendingLeaves())
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leave Management</h1>
      
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">From</th>
            <th className="p-3 text-left">To</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(leave => (
            <tr key={leave.id} className="border-t">
              <td className="p-3">{leave.employeeId}</td>
              <td className="p-3">{leave.leaveType}</td>
              <td className="p-3">{leave.startDate}</td>
              <td className="p-3">{leave.endDate}</td>
              <td className="p-3">{leave.reason}</td>
              <td className="p-3">
                <button onClick={() => handleApprove(leave.id)} className="bg-green-500 text-white px-3 py-1 rounded mr-2">
                  Approve
                </button>
                <button onClick={() => handleReject(leave.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagement;

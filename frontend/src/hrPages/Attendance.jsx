import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const organizationId = localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = () => {
    axios.get(`/api/v1/hr/attendance/today?organizationId=${organizationId}`)
      .then(res => setAttendance(res.data))
      .catch(err => console.error(err));
  };

  const handleCheckIn = (employeeId) => {
    axios.post('/api/v1/hr/attendance/check-in', { employeeId, organizationId })
      .then(() => loadTodayAttendance())
      .catch(err => console.error(err));
  };

  const handleCheckOut = (id) => {
    axios.put(`/api/v1/hr/attendance/${id}/check-out`)
      .then(() => loadTodayAttendance())
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Attendance - Today</h1>
      
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Check In</th>
            <th className="p-3 text-left">Check Out</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map(att => (
            <tr key={att.id} className="border-t">
              <td className="p-3">{att.employeeId}</td>
              <td className="p-3">{att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : '-'}</td>
              <td className="p-3">{att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : '-'}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded ${att.status === 'present' ? 'bg-green-200' : 'bg-red-200'}`}>
                  {att.status}
                </span>
              </td>
              <td className="p-3">
                {!att.checkOut && (
                  <button onClick={() => handleCheckOut(att.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Check Out
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;

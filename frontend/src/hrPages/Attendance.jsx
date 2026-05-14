import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHRAuth } from '../context/HRAuthContext';
import Button from '../components/hr/Button';
import PageHeader from '../components/hr/PageHeader';
import HRAuthGuard from '../components/hr/HRAuthGuard';
import { ClockIcon } from '@heroicons/react/24/outline';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');
  const [customDate, setCustomDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('checkIn');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('cards');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const { organization } = useHRAuth();
  const organizationId = organization?.id || organization?._id;

  useEffect(() => {
    if (organizationId) {
      loadEmployees();
      loadAttendance();
    }
  }, [dateFilter, customDate, organizationId]);

  useEffect(() => {
    filterAndSortAttendance();
  }, [attendance, searchTerm, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    calculateStats();
  }, [filteredAttendance]);

  const loadEmployees = () => {
    if (!organizationId) return;
    axios.get(`/api/v1/hr/employees?organizationId=${organizationId}`)
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  };

  const loadAttendance = () => {
    if (!organizationId) return;
    const endpoint = dateFilter === 'today' 
      ? `/api/v1/hr/attendance/today?organizationId=${organizationId}`
      : `/api/v1/hr/attendance?organizationId=${organizationId}&date=${customDate}`;
    
    axios.get(endpoint)
      .then(res => setAttendance(res.data))
      .catch(err => console.error(err));
  };

  const filterAndSortAttendance = () => {
    let filtered = [...attendance];

    if (searchTerm) {
      filtered = filtered.filter(att => {
        const emp = employees.find(e => e.id === att.employeeId);
        return emp?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               emp?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
               att.employeeId?.toString().includes(searchTerm);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(att => att.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (sortBy === 'checkIn' || sortBy === 'checkOut') {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredAttendance(filtered);
  };

  const calculateStats = () => {
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    setStats({ present, absent, late, total: filteredAttendance.length });
  };

  const handleCheckIn = () => {
    if (!selectedEmployee) return;
    axios.post('/api/v1/hr/attendance/check-in', { employeeId: selectedEmployee, organizationId })
      .then(() => {
        loadAttendance();
        setShowCheckInModal(false);
        setSelectedEmployee('');
      })
      .catch(err => console.error(err));
  };

  const handleCheckOut = (id) => {
    if (window.confirm('Check out this employee?')) {
      axios.put(`/api/v1/hr/attendance/${id}/check-out`)
        .then(() => loadAttendance())
        .catch(err => console.error(err));
    }
  };

  const getEmployeeName = (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp?.fullName || `Employee #${employeeId}`;
  };

  const getEmployeeEmail = (employeeId) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp?.email || 'N/A';
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const diff = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'bg-green-100 text-green-700 border-green-300';
      case 'absent': return 'bg-red-100 text-red-700 border-red-300';
      case 'late': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return '✅';
      case 'absent': return '❌';
      case 'late': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <HRAuthGuard icon={ClockIcon} title="Attendance Management Access Required">
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="📋 Attendance Management" 
          subtitle={`Tracking ${filteredAttendance.length} records`}
          actions={
            <Button onClick={() => setShowCheckInModal(true)} variant="primary">
              ✅ Check In Employee
            </Button>
          }
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total</p>
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">👥</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Present</p>
                <p className="text-3xl font-bold text-green-600">{stats.present}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-2xl">✅</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Late</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Absent</p>
                <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-xl flex items-center justify-center text-2xl">❌</div>
            </div>
          </div>
        </div>

        {/* Check In Modal */}
        {showCheckInModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">✅ Check In Employee</h3>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Employee *</label>
                <select 
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Choose an employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.fullName} - {emp.position}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleCheckIn} variant="success" disabled={!selectedEmployee}>✅ Check In</Button>
                <Button onClick={() => { setShowCheckInModal(false); setSelectedEmployee(''); }} variant="secondary">❌ Cancel</Button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-teal-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500">
              <option value="all">All Status</option>
              <option value="present">Present</option>
              <option value="late">Late</option>
              <option value="absent">Absent</option>
            </select>
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500">
              <option value="today">Today</option>
              <option value="custom">Custom Date</option>
            </select>
            {dateFilter === 'custom' && (
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            )}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500">
              <option value="checkIn">Sort by Check In</option>
              <option value="checkOut">Sort by Check Out</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode('cards')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'cards' ? 'bg-white shadow' : ''}`}>⊞</button>
              <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow' : ''}`}>☰</button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttendance.map(att => (
              <div key={att.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {getEmployeeName(att.employeeId).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{getEmployeeName(att.employeeId)}</h3>
                      <p className="text-xs text-gray-500">{getEmployeeEmail(att.employeeId)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(att.status)}`}>
                    {getStatusIcon(att.status)} {att.status}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">🕐 Check In</span>
                    <span className="font-bold text-green-700">{formatTime(att.checkIn)}</span>
                  </div>
                  <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">🕐 Check Out</span>
                    <span className="font-bold text-red-700">{formatTime(att.checkOut)}</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700">⏱️ Duration</span>
                    <span className="font-bold text-blue-700">{formatDuration(att.checkIn, att.checkOut)}</span>
                  </div>
                </div>
                {!att.checkOut && (
                  <button onClick={() => handleCheckOut(att.id)} className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 rounded-lg font-semibold transition shadow-md">
                    🚪 Check Out
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-teal-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-teal-500 via-green-500 to-blue-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Employee</th>
                  <th className="px-6 py-4 text-left font-bold">Check In</th>
                  <th className="px-6 py-4 text-left font-bold">Check Out</th>
                  <th className="px-6 py-4 text-left font-bold">Duration</th>
                  <th className="px-6 py-4 text-left font-bold">Status</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAttendance.map(att => (
                  <tr key={att.id} className="hover:bg-teal-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {getEmployeeName(att.employeeId).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{getEmployeeName(att.employeeId)}</div>
                          <div className="text-xs text-gray-500">{getEmployeeEmail(att.employeeId)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-600">{formatTime(att.checkIn)}</td>
                    <td className="px-6 py-4 font-semibold text-red-600">{formatTime(att.checkOut)}</td>
                    <td className="px-6 py-4 font-semibold text-blue-600">{formatDuration(att.checkIn, att.checkOut)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border-2 ${getStatusColor(att.status)}`}>
                        {getStatusIcon(att.status)} {att.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {!att.checkOut && (
                        <button onClick={() => handleCheckOut(att.id)} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition shadow">
                          🚪 Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredAttendance.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-teal-200">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No attendance records found</h3>
            <p className="text-gray-600">Try adjusting your filters or check in an employee</p>
          </div>
        )}
      </div>
    </div>
    </HRAuthGuard>
  );
};

export default Attendance;

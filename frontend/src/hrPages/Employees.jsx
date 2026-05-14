import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHRAuth } from '../context/HRAuthContext';
import Button from '../components/hr/Button';
import PageHeader from '../components/hr/PageHeader';
import HRAuthGuard from '../components/hr/HRAuthGuard';
import { UserGroupIcon } from '@heroicons/react/24/outline';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortBy, setSortBy] = useState('fullName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [editingId, setEditingId] = useState(null);
  const { organization } = useHRAuth();
  const organizationId = organization?.id || organization?._id;

  useEffect(() => {
    if (organizationId) loadEmployees();
  }, [organizationId]);

  useEffect(() => {
    filterAndSortEmployees();
  }, [employees, searchTerm, positionFilter, sortBy, sortOrder]);

  const loadEmployees = () => {
    if (!organizationId) return;
    axios.get(`/api/v1/hr/employees?organizationId=${organizationId}`)
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  };

  const filterAndSortEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (positionFilter !== 'all') {
      filtered = filtered.filter(emp => emp.position === positionFilter);
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredEmployees(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`/api/v1/hr/employees/${editingId}`, { ...form, organizationId })
      : axios.post('/api/v1/hr/employees', { ...form, organizationId });
    
    request.then(() => {
      loadEmployees();
      setShowForm(false);
      setForm({});
      setEditingId(null);
    }).catch(err => console.error(err));
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this employee?')) {
      axios.delete(`/api/v1/hr/employees/${id}`)
        .then(() => loadEmployees())
        .catch(err => console.error(err));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedEmployees.length} employees?`)) {
      Promise.all(selectedEmployees.map(id => axios.delete(`/api/v1/hr/employees/${id}`)))
        .then(() => {
          setSelectedEmployees([]);
          loadEmployees();
        })
        .catch(err => console.error(err));
    }
  };

  const toggleSelect = (id) => {
    setSelectedEmployees(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedEmployees(selectedEmployees.length === filteredEmployees.length ? [] : filteredEmployees.map(e => e.id));
  };

  const positions = [...new Set(employees.map(e => e.position).filter(Boolean))];

  return (
    <HRAuthGuard icon={UserGroupIcon} title="Employee Management Access Required">
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="👥 Employee Management" 
          subtitle={`${filteredEmployees.length} of ${employees.length} employees`}
          actions={
            <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({}); }} variant="primary">
              ✨ Add Employee
            </Button>
          }
        />

        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-gray-200 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? '✏️ Edit Employee' : '➕ Add New Employee'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    value={form.fullName || ''}
                    placeholder="John Doe" 
                    className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                    onChange={e => setForm({...form, fullName: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input 
                    value={form.email || ''}
                    placeholder="john@company.com" 
                    type="email" 
                    className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                    onChange={e => setForm({...form, email: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Position *</label>
                  <input 
                    value={form.position || ''}
                    placeholder="Software Engineer" 
                    className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                    onChange={e => setForm({...form, position: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Base Salary *</label>
                  <input 
                    value={form.baseSalary || ''}
                    placeholder="50000" 
                    type="number" 
                    className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition" 
                    onChange={e => setForm({...form, baseSalary: parseFloat(e.target.value)})} 
                    required 
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <Button type="submit" variant="success">💾 {editingId ? 'Update' : 'Save'} Employee</Button>
                <Button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({}); }} variant="secondary">❌ Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search by name, email, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>
            <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="all">All Positions</option>
              {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="fullName">Sort by Name</option>
              <option value="position">Sort by Position</option>
              <option value="baseSalary">Sort by Salary</option>
            </select>
            <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}>⊞</button>
              <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow' : ''}`}>☰</button>
            </div>
          </div>

          {selectedEmployees.length > 0 && (
            <div className="flex items-center justify-between bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
              <span className="font-semibold text-purple-700">{selectedEmployees.length} selected</span>
              <div className="flex gap-2">
                <Button onClick={handleBulkDelete} variant="danger">🗑️ Delete Selected</Button>
                <Button onClick={() => setSelectedEmployees([])} variant="secondary">Clear</Button>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => (
              <div key={emp.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 ${selectedEmployees.includes(emp.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {emp.fullName?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <input type="checkbox" checked={selectedEmployees.includes(emp.id)} onChange={() => toggleSelect(emp.id)} className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{emp.fullName || 'N/A'}</h3>
                <p className="text-purple-600 font-semibold mb-3">{emp.position || 'No Position'}</p>
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <p className="flex items-center gap-2">📧 {emp.email || 'N/A'}</p>
                  <p className="flex items-center gap-2 text-green-600 font-bold text-lg">💰 ${emp.baseSalary?.toLocaleString() || '0'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(emp)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition">✏️ Edit</button>
                  <button onClick={() => handleDelete(emp.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0} onChange={toggleSelectAll} className="w-5 h-5 cursor-pointer" />
                  </th>
                  <th className="px-6 py-4 text-left font-bold">Employee</th>
                  <th className="px-6 py-4 text-left font-bold">Email</th>
                  <th className="px-6 py-4 text-left font-bold">Position</th>
                  <th className="px-6 py-4 text-left font-bold">Salary</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} className={`hover:bg-purple-50 transition ${selectedEmployees.includes(emp.id) ? 'bg-purple-50' : ''}`}>
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selectedEmployees.includes(emp.id)} onChange={() => toggleSelect(emp.id)} className="w-5 h-5 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {emp.fullName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{emp.fullName}</div>
                          <div className="text-xs text-gray-500">ID: {emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">{emp.position}</span>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600 text-lg">${emp.baseSalary?.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(emp)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition">✏️</button>
                        <button onClick={() => handleDelete(emp.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredEmployees.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No employees found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
    </HRAuthGuard>
  );
};

export default Employees;

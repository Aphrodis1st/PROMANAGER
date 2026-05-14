import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHRAuth } from '../context/HRAuthContext';
import Button from '../components/hr/Button';
import PageHeader from '../components/hr/PageHeader';
import HRAuthGuard from '../components/hr/HRAuthGuard';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [editingId, setEditingId] = useState(null);
  const { organization } = useHRAuth();
  const organizationId = organization?.id || organization?._id;

  useEffect(() => {
    if (organizationId) loadDepartments();
  }, [organizationId]);

  useEffect(() => {
    filterAndSortDepartments();
  }, [departments, searchTerm, sortBy, sortOrder]);

  const loadDepartments = () => {
    if (!organizationId) return;
    axios.get(`/api/v1/hr/departments?organizationId=${organizationId}`)
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  };

  const filterAndSortDepartments = () => {
    let filtered = [...departments];

    if (searchTerm) {
      filtered = filtered.filter(dept =>
        dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dept.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });

    setFilteredDepartments(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`/api/v1/hr/departments/${editingId}`, { ...form, organizationId })
      : axios.post('/api/v1/hr/departments', { ...form, organizationId });
    
    request.then(() => {
      loadDepartments();
      setShowForm(false);
      setForm({});
      setEditingId(null);
    }).catch(err => console.error(err));
  };

  const handleEdit = (dept) => {
    setForm(dept);
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this department?')) {
      axios.delete(`/api/v1/hr/departments/${id}`)
        .then(() => loadDepartments())
        .catch(err => console.error(err));
    }
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedDepartments.length} departments?`)) {
      Promise.all(selectedDepartments.map(id => axios.delete(`/api/v1/hr/departments/${id}`)))
        .then(() => {
          setSelectedDepartments([]);
          loadDepartments();
        })
        .catch(err => console.error(err));
    }
  };

  const toggleSelect = (id) => {
    setSelectedDepartments(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedDepartments(selectedDepartments.length === filteredDepartments.length ? [] : filteredDepartments.map(d => d.id));
  };

  const departmentIcons = ['🏢', '💼', '🎯', '📊', '🔧', '💡', '🚀', '⚙️', '📈', '🎨', '🔬', '📱'];
  const getRandomIcon = (id) => departmentIcons[id % departmentIcons.length];

  return (
    <HRAuthGuard icon={BuildingOfficeIcon} title="Department Management Access Required">
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="🏢 Department Management" 
          subtitle={`${filteredDepartments.length} of ${departments.length} departments`}
          actions={
            <Button onClick={() => { setShowForm(true); setEditingId(null); setForm({}); }} variant="primary">
              ✨ Add Department
            </Button>
          }
        />

        {showForm && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 border border-indigo-200 animate-fadeIn">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">{editingId ? '✏️ Edit Department' : '➕ Add New Department'}</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department Name *</label>
                  <input 
                    value={form.name || ''}
                    placeholder="Human Resources" 
                    className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Manager</label>
                  <input 
                    value={form.manager || ''}
                    placeholder="John Smith" 
                    className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                    onChange={e => setForm({...form, manager: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea 
                  value={form.description || ''}
                  placeholder="Department description and responsibilities..." 
                  rows="3"
                  className="w-full border-2 border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" 
                  onChange={e => setForm({...form, description: e.target.value})} 
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button type="submit" variant="success">💾 {editingId ? 'Update' : 'Save'} Department</Button>
                <Button type="button" onClick={() => { setShowForm(false); setEditingId(null); setForm({}); }} variant="secondary">❌ Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-indigo-200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              <input
                type="text"
                placeholder="Search departments by name, manager, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option value="name">Sort by Name</option>
              <option value="manager">Sort by Manager</option>
            </select>
            <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold transition">
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow' : ''}`}>⊞</button>
              <button onClick={() => setViewMode('table')} className={`px-4 py-2 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow' : ''}`}>☰</button>
            </div>
          </div>

          {selectedDepartments.length > 0 && (
            <div className="flex items-center justify-between bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-4">
              <span className="font-semibold text-indigo-700">{selectedDepartments.length} selected</span>
              <div className="flex gap-2">
                <Button onClick={handleBulkDelete} variant="danger">🗑️ Delete Selected</Button>
                <Button onClick={() => setSelectedDepartments([])} variant="secondary">Clear</Button>
              </div>
            </div>
          )}
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDepartments.map(dept => (
              <div key={dept.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 ${selectedDepartments.includes(dept.id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg transform hover:scale-110 transition">
                      {getRandomIcon(dept.id)}
                    </div>
                    <input type="checkbox" checked={selectedDepartments.includes(dept.id)} onChange={() => toggleSelect(dept.id)} className="w-5 h-5 cursor-pointer" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{dept.name || 'N/A'}</h3>
                <div className="space-y-2 mb-4">
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-semibold">👤 Manager:</span> {dept.manager || 'Not assigned'}
                  </p>
                  {dept.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">📝 {dept.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">🆔 ID: {dept.id}</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(dept)} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 rounded-lg font-semibold transition shadow-md">✏️ Edit</button>
                  <button onClick={() => handleDelete(dept.id)} className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-2 rounded-lg font-semibold transition shadow-md">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-200">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input type="checkbox" checked={selectedDepartments.length === filteredDepartments.length && filteredDepartments.length > 0} onChange={toggleSelectAll} className="w-5 h-5 cursor-pointer" />
                  </th>
                  <th className="px-6 py-4 text-left font-bold">Department</th>
                  <th className="px-6 py-4 text-left font-bold">Manager</th>
                  <th className="px-6 py-4 text-left font-bold">Description</th>
                  <th className="px-6 py-4 text-left font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDepartments.map(dept => (
                  <tr key={dept.id} className={`hover:bg-indigo-50 transition ${selectedDepartments.includes(dept.id) ? 'bg-indigo-50' : ''}`}>
                    <td className="px-6 py-4">
                      <input type="checkbox" checked={selectedDepartments.includes(dept.id)} onChange={() => toggleSelect(dept.id)} className="w-5 h-5 cursor-pointer" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow">
                          {getRandomIcon(dept.id)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{dept.name}</div>
                          <div className="text-xs text-gray-500">ID: {dept.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">{dept.manager || 'Not assigned'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{dept.description || 'No description'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(dept)} className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition shadow">✏️</button>
                        <button onClick={() => handleDelete(dept.id)} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition shadow">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredDepartments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-indigo-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No departments found</h3>
            <p className="text-gray-600">Try adjusting your search or create a new department</p>
          </div>
        )}
      </div>
    </div>
    </HRAuthGuard>
  );
};

export default Departments;

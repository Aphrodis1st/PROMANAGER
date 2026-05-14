import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Filter, Plus, FileText, Download, Eye, Edit, Trash2, Calendar, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useHRAuth } from '../context/HRAuthContext';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedContract, setSelectedContract] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    contractType: 'Full-Time',
    startDate: '',
    endDate: '',
    salary: '',
    position: '',
    department: '',
    terms: '',
    status: 'Active'
  });
  const { organization } = useHRAuth();
  const organizationId = organization?.id || organization?._id;

  if (!organizationId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">HR System Access Required</h2>
          <p className="text-slate-600 mb-6">Please log in to the HR system to access Contract Management.</p>
          <a href="/hr/login" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
            Go to HR Login
          </a>
        </div>
      </div>
    );
  }

  useEffect(() => {
    loadContracts();
  }, []);

  useEffect(() => {
    filterContracts();
  }, [contracts, searchTerm, statusFilter, typeFilter]);

  const loadContracts = () => {
    if (!organizationId) {
      console.warn('No organizationId available. Please log in to HR system.');
      return;
    }
    axios.get(`/api/v1/hr/contracts?organizationId=${organizationId}`)
      .then(res => setContracts(res.data))
      .catch(err => console.error(err));
  };

  const filterContracts = () => {
    let filtered = contracts;
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
    if (typeFilter !== 'all') filtered = filtered.filter(c => c.contractType === typeFilter);
    setFilteredContracts(filtered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, organizationId };
    const request = modalMode === 'add' 
      ? axios.post('/api/v1/hr/contracts', payload)
      : axios.put(`/api/v1/hr/contracts/${selectedContract.id}`, payload);
    
    request.then(() => {
      loadContracts();
      closeModal();
    }).catch(err => console.error(err));
  };

  const handleDelete = (id) => {
    if (confirm('Delete this contract?')) {
      axios.delete(`/api/v1/hr/contracts/${id}`).then(() => loadContracts());
    }
  };

  const openModal = (mode, contract = null) => {
    setModalMode(mode);
    setSelectedContract(contract);
    if (contract) setFormData(contract);
    else setFormData({ employeeId: '', employeeName: '', contractType: 'Full-Time', startDate: '', endDate: '', salary: '', position: '', department: '', terms: '', status: 'Active' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedContract(null);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Active': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Expired': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600" />
                Contract Management
              </h1>
              <p className="text-slate-600 mt-1">Manage employee contracts and agreements</p>
            </div>
            <button onClick={() => openModal('add')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
              <Plus className="w-5 h-5" />
              New Contract
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" placeholder="Search contracts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="all">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
            </select>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Contracts', value: contracts.length, color: 'blue', icon: FileText },
            { label: 'Active', value: contracts.filter(c => c.status === 'Active').length, color: 'green', icon: CheckCircle },
            { label: 'Expiring Soon', value: contracts.filter(c => c.status === 'Pending').length, color: 'yellow', icon: Clock },
            { label: 'Expired', value: contracts.filter(c => c.status === 'Expired').length, color: 'red', icon: XCircle }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
                </div>
                <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredContracts.map(contract => (
                  <tr key={contract.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {contract.employeeName?.charAt(0) || 'E'}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-slate-800">{contract.employeeName || 'N/A'}</p>
                          <p className="text-sm text-slate-500">ID: {contract.employeeId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{contract.position || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {contract.contractType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{contract.startDate || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-700">{contract.endDate || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-700 font-semibold">${contract.salary || '0'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit ${getStatusColor(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openModal('view', contract)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openModal('edit', contract)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(contract.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredContracts.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No contracts found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-800">
                {modalMode === 'add' ? 'New Contract' : modalMode === 'edit' ? 'Edit Contract' : 'Contract Details'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employee ID</label>
                  <input type="text" value={formData.employeeId} onChange={(e) => setFormData({...formData, employeeId: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Employee Name</label>
                  <input type="text" value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Position</label>
                  <input type="text" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <input type="text" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Contract Type</label>
                  <select value={formData.contractType} onChange={(e) => setFormData({...formData, contractType: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salary</label>
                  <input type="number" value={formData.salary} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Terms & Conditions</label>
                  <textarea value={formData.terms} onChange={(e) => setFormData({...formData, terms: e.target.value})} rows="4" className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500" disabled={modalMode === 'view'}></textarea>
                </div>
              </div>
              {modalMode !== 'view' && (
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closeModal} className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    {modalMode === 'add' ? 'Create Contract' : 'Update Contract'}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contracts;

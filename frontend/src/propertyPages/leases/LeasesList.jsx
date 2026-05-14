import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, Download, Plus, Calendar, DollarSign, User, Home, AlertCircle, CheckCircle, Clock, Eye, Edit, Trash2, TrendingUp, Grid3x3, List, RefreshCw } from 'lucide-react';

export default function LeasesList() {
  const [leases, setLeases] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [units, setUnits] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProperty, setFilterProperty] = useState('all');
  const [sortBy, setSortBy] = useState('startDate');

  useEffect(() => {
    Promise.all([fetchLeases(), fetchTenants(), fetchUnits(), fetchProperties()]);
  }, []);

  const fetchLeases = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/leases');
      const data = await response.json();
      setLeases(data);
    } catch (error) {
      console.error('Error fetching leases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/tenants');
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const fetchUnits = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/units');
      const data = await response.json();
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this lease?')) return;
    try {
      await fetch(`http://localhost:3001/api/v1/property/leases/${id}`, { method: 'DELETE' });
      fetchLeases();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getTenantDetails = (tenantId) => {
    return tenants.find(t => t.id === tenantId);
  };

  const getUnitDetails = (unitId) => {
    return units.find(u => u.id === unitId);
  };

  const getPropertyDetails = (propertyId) => {
    return properties.find(p => p.id === propertyId);
  };

  const getLeaseStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now > end) return 'expired';
    return 'active';
  };

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const filteredLeases = leases.filter(lease => {
    const tenant = getTenantDetails(lease.tenantId);
    const unit = getUnitDetails(lease.unitId);
    const property = unit ? getPropertyDetails(unit.propertyId) : null;
    const status = getLeaseStatus(lease.startDate, lease.endDate);

    const matchesSearch = tenant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         unit?.unitNumber?.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesProperty = filterProperty === 'all' || property?.id === filterProperty;
    return matchesSearch && matchesStatus && matchesProperty;
  }).sort((a, b) => {
    if (sortBy === 'startDate') return new Date(b.startDate) - new Date(a.startDate);
    if (sortBy === 'endDate') return new Date(a.endDate) - new Date(b.endDate);
    if (sortBy === 'rent') return b.rentAmount - a.rentAmount;
    return 0;
  });

  const stats = {
    total: leases.length,
    active: leases.filter(l => getLeaseStatus(l.startDate, l.endDate) === 'active').length,
    upcoming: leases.filter(l => getLeaseStatus(l.startDate, l.endDate) === 'upcoming').length,
    expired: leases.filter(l => getLeaseStatus(l.startDate, l.endDate) === 'expired').length,
    totalRent: leases.reduce((sum, l) => sum + (l.rentAmount || 0), 0)
  };

  const LeaseCard = ({ lease }) => {
    const tenant = getTenantDetails(lease.tenantId);
    const unit = getUnitDetails(lease.unitId);
    const property = unit ? getPropertyDetails(unit.propertyId) : null;
    const status = getLeaseStatus(lease.startDate, lease.endDate);
    const daysRemaining = getDaysRemaining(lease.endDate);

    return (
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group">
        <div className="relative h-32 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
              status === 'active' ? 'bg-green-500/90 text-white' :
              status === 'upcoming' ? 'bg-blue-500/90 text-white' :
              'bg-red-500/90 text-white'
            }`}>
              {status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm font-medium opacity-90">Lease Agreement</p>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
            {tenant?.firstName} {tenant?.lastName}
          </h3>

          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-gray-600">
              <Home className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{property?.name} - Unit {unit?.unitNumber}</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm font-semibold">${lease.rentAmount}/month</p>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}</p>
            </div>
            {status === 'active' && (
              <div className={`flex items-center gap-2 ${
                daysRemaining <= 30 ? 'text-red-600' : 'text-green-600'
              }`}>
                <Clock className="w-4 h-4 flex-shrink-0" />
                <p className="text-sm font-semibold">{daysRemaining} days remaining</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Link
              to={`/property/leases/${lease.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </Link>
            <Link
              to={`/property/billing/create?tenantId=${lease.tenantId}&leaseId=${lease.id}`}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
              title="Create Invoice"
            >
              <DollarSign className="w-4 h-4" />
              Invoice
            </Link>
            <button
              onClick={() => handleDelete(lease.id)}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Leases</h1>
            <p className="text-gray-600">Manage and monitor all lease agreements</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/property/billing"
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              <DollarSign className="w-5 h-5" />
              Billing
            </Link>
            <Link
              to="/property/tenants"
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              <User className="w-5 h-5" />
              Tenants
            </Link>
            <Link
              to="/property/leases/create"
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Lease
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
            <p className="text-sm text-gray-600">Total Leases</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.active}</p>
            <p className="text-sm text-gray-600">Active Leases</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.upcoming}</p>
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stats.expired}</p>
            <p className="text-sm text-gray-600">Expired</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">${stats.totalRent.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Total Monthly Rent</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by tenant name or unit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="all">All Properties</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="startDate">Sort by Start Date</option>
                <option value="endDate">Sort by End Date</option>
                <option value="rent">Sort by Rent</option>
              </select>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Leases Grid/List */}
      {filteredLeases.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No leases found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first lease agreement</p>
          <Link
            to="/property/leases/create"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Lease
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeases.map((lease) => (
            <LeaseCard key={lease.id} lease={lease} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeases.map((lease) => {
                const tenant = getTenantDetails(lease.tenantId);
                const unit = getUnitDetails(lease.unitId);
                const property = unit ? getPropertyDetails(unit.propertyId) : null;
                const status = getLeaseStatus(lease.startDate, lease.endDate);
                return (
                  <tr key={lease.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{tenant?.firstName} {tenant?.lastName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{property?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">Unit {unit?.unitNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">${lease.rentAmount}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {new Date(lease.startDate).toLocaleDateString()} - {new Date(lease.endDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === 'active' ? 'bg-green-100 text-green-800' :
                        status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/property/leases/${lease.id}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/property/leases/${lease.id}/edit`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(lease.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

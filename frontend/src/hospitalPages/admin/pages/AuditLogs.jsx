import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/hospital/card';
import { Shield, Search, Filter, Download, Calendar, User, Activity, AlertTriangle, Clock, ChevronDown, RefreshCw } from 'lucide-react';
import api from '../../../services/api';

const AuditLogs = () => {
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;
      if (filterAction !== 'all') params.actionType = filterAction;
      
      const response = await api.get('/api/hospital/reports/audit', { params });
      setAuditData(response.data.report);
    } catch (error) {
      console.error('Failed to fetch audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditData?.detailedLogs?.recentAuditLogs?.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  const getActionColor = (actionType) => {
    if (actionType?.includes('delete') || actionType?.includes('failed')) return 'text-red-600 bg-red-50';
    if (actionType?.includes('create') || actionType?.includes('success')) return 'text-green-600 bg-green-50';
    if (actionType?.includes('update') || actionType?.includes('modify')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  const getSeverityBadge = (actionType) => {
    if (actionType?.includes('delete') || actionType?.includes('failed') || actionType?.includes('unauthorized')) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Critical</span>;
    }
    if (actionType?.includes('modify') || actionType?.includes('change')) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Medium</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">Low</span>;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            Audit Logs
          </h1>
          <p className="text-gray-600 mt-1">Monitor system activities and security events</p>
        </div>
        <button
          onClick={fetchAuditData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{auditData?.summary?.totalAuditEvents || 0}</p>
              </div>
              <Activity className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{auditData?.summary?.activeUsers || 0}</p>
              </div>
              <User className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Events</p>
                <p className="text-2xl font-bold text-red-600">{auditData?.summary?.securityEvents || 0}</p>
              </div>
              <AlertTriangle className="h-10 w-10 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Actions</p>
                <p className="text-2xl font-bold text-orange-600">{auditData?.summary?.criticalActions || 0}</p>
              </div>
              <Shield className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* Search */}
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by user, action, or module..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Export */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action Type</label>
                  <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Actions</option>
                    <option value="create">Create</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="login">Login</option>
                    <option value="logout">Logout</option>
                  </select>
                </div>
              </div>
            )}

            {showFilters && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    setDateRange({ start: '', end: '' });
                    setFilterAction('all');
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={fetchAuditData}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Module</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Severity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No audit logs found
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatDate(log.timestamp)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{log.userId || 'System'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getActionColor(log.actionType)}`}>
                          {log.actionType || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700">{log.module || 'N/A'}</td>
                      <td className="py-3 px-4">{getSeverityBadge(log.actionType)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {log.metadata ? JSON.stringify(log.metadata).substring(0, 50) + '...' : 'No details'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Users Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditData?.userActivity?.mostActiveUsers?.slice(0, 5).map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.userName}</p>
                      <p className="text-sm text-gray-600">{user.userRole}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{user.totalActions}</p>
                    <p className="text-xs text-gray-600">actions</p>
                  </div>
                </div>
              )) || <p className="text-gray-500 text-center py-4">No data available</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {auditData?.userActivity?.actionTypeDistribution?.slice(0, 5).map((action, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">{action.actionType}</span>
                    <span className="text-gray-600">{action.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(action.count / auditData?.summary?.totalAuditEvents) * 100}%` }}
                    />
                  </div>
                </div>
              )) || <p className="text-gray-500 text-center py-4">No data available</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiClock, FiAlertCircle, FiCheckCircle, FiDownload, FiFilter, FiSearch, FiTrendingUp, FiUsers, FiHome, FiFileText, FiSend, FiPrinter } from 'react-icons/fi';

const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

const invoiceTotal = (invoice) => toNumber(invoice.amount);
const invoiceTax = (invoice) => toNumber(invoice.taxAmount);
const invoiceWithholding = (invoice) => toNumber(invoice.withholdingTaxAmount);
const invoiceCommission = (invoice) => toNumber(invoice.commissionAmount);
const invoiceNet = (invoice) => toNumber(invoice.netOwnerRemittance || invoiceTotal(invoice) - invoiceCommission(invoice));

export default function BillingDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [leases, setLeases] = useState([]);
  const [properties, setProperties] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, overdue: 0, tax: 0, withholding: 0, commission: 0, net: 0 });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedInvoices, setSelectedInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
    fetchTenants();
    fetchLeases();
    fetchProperties();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/billing');
      const data = await response.json();
      setInvoices(data);
      calculateStats(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/tenants');
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchLeases = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/leases');
      const data = await response.json();
      setLeases(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/property/properties');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateStats = (data) => {
    const total = data.reduce((sum, inv) => sum + invoiceTotal(inv), 0);
    const paid = data.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + invoiceTotal(inv), 0);
    const pending = data.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + invoiceTotal(inv), 0);
    const overdue = data.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + invoiceTotal(inv), 0);
    const tax = data.reduce((sum, inv) => sum + invoiceTax(inv), 0);
    const withholding = data.reduce((sum, inv) => sum + invoiceWithholding(inv), 0);
    const commission = data.reduce((sum, inv) => sum + invoiceCommission(inv), 0);
    const net = data.reduce((sum, inv) => sum + invoiceNet(inv), 0);
    setStats({ total, paid, pending, overdue, tax, withholding, commission, net });
  };

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/v1/property/billing/${invoiceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchInvoices();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedInvoices.length === 0) {
      alert('Please select invoices first');
      return;
    }
    if (action === 'send') {
      alert(`Sending ${selectedInvoices.length} invoices via email...`);
    } else if (action === 'print') {
      alert(`Printing ${selectedInvoices.length} invoices...`);
    }
    setSelectedInvoices([]);
  };

  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const getTenantInfo = (tenantId) => {
    return tenants.find(t => t.id === tenantId);
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filter === 'all' || inv.status === filter;
    const matchesSearch = inv.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const dueDate = inv.dueDate ? new Date(inv.dueDate) : null;
    const startsAfter = !dateRange.start || (dueDate && dueDate >= new Date(dateRange.start));
    const endsBefore = !dateRange.end || (dueDate && dueDate <= new Date(dateRange.end));
    return matchesFilter && matchesSearch && startsAfter && endsBefore;
  });

  const exportToCSV = () => {
    const headers = ['Invoice #', 'Tenant', 'Subtotal', 'Tax', 'Withholding Tax', 'Commission', 'Net Remittance', 'Total Due', 'Due Date', 'Status'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      inv.tenantName,
      inv.subtotal || inv.amount,
      invoiceTax(inv),
      invoiceWithholding(inv),
      invoiceCommission(inv),
      invoiceNet(inv),
      invoiceTotal(inv),
      new Date(inv.dueDate).toLocaleDateString(),
      inv.status
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Billing & Payments</h1>
            <p className="text-gray-600">Manage invoices, payments, and financial records</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/property/properties"
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiHome /> Properties
            </Link>
            <Link
              to="/property/tenants"
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiUsers /> Tenants
            </Link>
            <Link
              to="/property/leases"
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiFileText /> Leases
            </Link>
            <Link
              to="/property/billing/create"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <FiDollarSign /> Create Invoice
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Total Invoiced</h3>
              <FiTrendingUp className="text-2xl opacity-75" />
            </div>
            <p className="text-3xl font-bold">{formatMoney(stats.total)}</p>
            <p className="text-xs opacity-75 mt-2">All time revenue</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Paid</h3>
              <FiCheckCircle className="text-2xl opacity-75" />
            </div>
            <p className="text-3xl font-bold">{formatMoney(stats.paid)}</p>
            <p className="text-xs opacity-75 mt-2">{((stats.paid / stats.total) * 100 || 0).toFixed(1)}% collection rate</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Pending</h3>
              <FiClock className="text-2xl opacity-75" />
            </div>
            <p className="text-3xl font-bold">{formatMoney(stats.pending)}</p>
            <p className="text-xs opacity-75 mt-2">Awaiting payment</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">Overdue</h3>
              <FiAlertCircle className="text-2xl opacity-75" />
            </div>
            <p className="text-3xl font-bold">{formatMoney(stats.overdue)}</p>
            <p className="text-xs opacity-75 mt-2">Requires attention</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tax Liability</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-700">{formatMoney(stats.tax)}</p>
            <p className="mt-1 text-sm text-gray-500">Output tax collected on invoices</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Withholding Credits</h3>
            <p className="mt-2 text-3xl font-bold text-cyan-700">{formatMoney(stats.withholding)}</p>
            <p className="mt-1 text-sm text-gray-500">Tax withheld from tenant payments</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Commission Payable</h3>
            <p className="mt-2 text-3xl font-bold text-purple-700">{formatMoney(stats.commission)}</p>
            <p className="mt-1 text-sm text-gray-500">Agent and management commission due</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tenant or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
            >
              <FiDownload /> Export
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedInvoices.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">{selectedInvoices.length} invoice(s) selected</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction('send')}
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
                >
                  <FiSend className="w-4 h-4" /> Send Emails
                </button>
                <button
                  onClick={() => handleBulkAction('print')}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                >
                  <FiPrinter className="w-4 h-4" /> Print All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInvoices(filteredInvoices.map(inv => inv.id));
                        } else {
                          setSelectedInvoices([]);
                        }
                      }}
                      checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tax</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Commission</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Due</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FiDollarSign className="text-5xl mb-3 text-gray-300" />
                        <p className="text-lg font-medium">No invoices found</p>
                        <p className="text-sm">Create your first invoice to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => {
                    const tenant = getTenantInfo(invoice.tenantId);
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => toggleInvoiceSelection(invoice.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{invoice.invoiceNumber}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-gray-900 font-medium">{invoice.tenantName}</p>
                            {tenant && (
                              <p className="text-xs text-gray-500">{tenant.email}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="font-semibold text-indigo-700">{formatMoney(invoiceTax(invoice))}</span>
                            {invoiceWithholding(invoice) > 0 && (
                              <p className="text-xs text-gray-500">WHT {formatMoney(invoiceWithholding(invoice))}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="font-semibold text-purple-700">{formatMoney(invoiceCommission(invoice))}</span>
                            {invoice.commissionRecipient && (
                              <p className="text-xs text-gray-500">{invoice.commissionRecipient}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <span className="font-semibold text-gray-900">{formatMoney(invoiceTotal(invoice))}</span>
                            <p className="text-xs text-gray-500">Net {formatMoney(invoiceNet(invoice))}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-600">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={invoice.status}
                            onChange={(e) => handleStatusUpdate(invoice.id, e.target.value)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <Link
                              to={`/property/billing/${invoice.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View
                            </Link>
                            <Link
                              to={`/property/billing/${invoice.id}/edit`}
                              className="text-gray-600 hover:text-gray-800 font-medium"
                            >
                              Edit
                            </Link>
                            {tenant && (
                              <Link
                                to={`/property/tenants/${tenant.id}`}
                                className="text-green-600 hover:text-green-800 font-medium"
                              >
                                Tenant
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

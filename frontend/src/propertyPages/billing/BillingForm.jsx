import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2, FiDollarSign } from 'react-icons/fi';

export default function BillingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoPopulated, setAutoPopulated] = useState(false);
  const [formData, setFormData] = useState({
    tenantId: '',
    propertyId: '',
    unitId: '',
    type: 'rent',
    amount: '',
    dueDate: '',
    description: '',
    items: [],
    status: 'pending'
  });

  useEffect(() => {
    fetchTenants();
    fetchProperties();
    fetchLeases();
    if (id) {
      fetchInvoice();
    } else {
      // Auto-populate from URL parameters
      const params = new URLSearchParams(window.location.search);
      const tenantId = params.get('tenantId');
      const leaseId = params.get('leaseId');
      
      if (tenantId) {
        setFormData(prev => ({ ...prev, tenantId }));
        setAutoPopulated(true);
      }
      
      if (leaseId) {
        fetchLeaseDetails(leaseId);
        setAutoPopulated(true);
      }
    }
  }, [id]);

  const fetchLeases = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/property/leases');
      const data = await res.json();
      setLeases(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchLeaseDetails = async (leaseId) => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/property/leases/${leaseId}`);
      const lease = await res.json();
      if (lease) {
        setFormData(prev => ({
          ...prev,
          tenantId: lease.tenantId,
          unitId: lease.unitId,
          amount: lease.rentAmount,
          description: `Monthly rent for lease period`,
          items: [{ description: 'Monthly Rent', amount: lease.rentAmount }]
        }));
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/property/tenants');
      const data = await res.json();
      setTenants(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/v1/property/properties');
      const data = await res.json();
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/property/billing/${id}`);
      const data = await res.json();
      setFormData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = id 
        ? `http://localhost:3001/api/v1/property/billing/${id}`
        : 'http://localhost:3001/api/v1/property/billing';
      const method = id ? 'PUT' : 'POST';
      
      const invoiceData = {
        ...formData,
        invoiceNumber: formData.invoiceNumber || `INV-${Date.now()}`,
        tenantName: tenants.find(t => t.id === formData.tenantId)?.name || 'Unknown'
      };

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });
      navigate('/property/billing');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', amount: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setFormData({ ...formData, items: newItems, amount: totalAmount });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    const totalAmount = newItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    setFormData({ ...formData, items: newItems, amount: totalAmount });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {id ? 'Edit' : 'Create'} Invoice
          </h1>
          <p className="text-gray-600">Fill in the details to generate an invoice</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auto-populated Info Banner */}
          {autoPopulated && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <FiDollarSign className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Invoice Pre-filled</h3>
                <p className="text-sm text-blue-700">This invoice has been pre-populated with tenant and lease information. Review and adjust as needed.</p>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiDollarSign className="text-blue-500" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tenant *</label>
                <select
                  value={formData.tenantId}
                  onChange={(e) => setFormData({ ...formData, tenantId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property *</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Property</option>
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rent">Rent</option>
                  <option value="utilities">Utilities</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="late_fee">Late Fee</option>
                  <option value="security_deposit">Security Deposit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Add any additional notes or details..."
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FiPlus className="text-green-500" />
                Line Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-lg transition-all"
              >
                <FiPlus /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No line items added yet</p>
                  <p className="text-sm">Click "Add Item" to add charges</p>
                </div>
              ) : (
                formData.items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center bg-gray-50 p-4 rounded-lg">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Description (e.g., Monthly Rent, Water Bill)"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="w-40">
                      <input
                        type="number"
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => updateItem(index, 'amount', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        step="0.01"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total Amount</p>
                <p className="text-4xl font-bold">${parseFloat(formData.amount || 0).toLocaleString()}</p>
              </div>
              <FiDollarSign className="text-6xl opacity-25" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            >
              <FiSave />
              {loading ? 'Saving...' : (id ? 'Update Invoice' : 'Create Invoice')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/property/billing')}
              className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg shadow hover:shadow-lg transition-all"
            >
              <FiX /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

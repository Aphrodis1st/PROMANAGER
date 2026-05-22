import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiPlus, FiTrash2, FiDollarSign, FiPercent, FiFileText } from 'react-icons/fi';

const toNumber = (value) => Number.parseFloat(value) || 0;

const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

const getDefaultBillingData = () => ({
  tenantId: '',
  propertyId: '',
  unitId: '',
  type: 'rent',
  amount: '',
  dueDate: '',
  description: '',
  items: [],
  status: 'pending',
  taxRegistrationNumber: '',
  taxAuthority: '',
  taxCategory: 'taxable',
  taxType: 'VAT',
  taxRate: 0,
  withholdingTaxRate: 0,
  taxPeriod: '',
  taxNotes: '',
  commissionEnabled: false,
  commissionRecipient: '',
  commissionRole: 'property_manager',
  commissionBasis: 'subtotal',
  commissionType: 'percentage',
  commissionRate: 0,
  commissionFixedAmount: 0,
  commissionPaymentStatus: 'pending',
  commissionNotes: ''
});

export default function BillingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoPopulated, setAutoPopulated] = useState(false);
  const [formData, setFormData] = useState(getDefaultBillingData());

  const lineSubtotal = formData.items.length
    ? formData.items.reduce((sum, item) => sum + toNumber(item.amount), 0)
    : toNumber(formData.subtotal || formData.amount);
  const taxableAmount = formData.taxCategory === 'exempt' ? 0 : lineSubtotal;
  const taxAmount = formData.taxCategory === 'exempt' || formData.taxCategory === 'zero_rated'
    ? 0
    : taxableAmount * (toNumber(formData.taxRate) / 100);
  const withholdingTaxAmount = taxableAmount * (toNumber(formData.withholdingTaxRate) / 100);
  const grossAmount = lineSubtotal + taxAmount;
  const totalDue = Math.max(grossAmount - withholdingTaxAmount, 0);
  const commissionBase = formData.commissionBasis === 'gross' ? grossAmount : lineSubtotal;
  const commissionAmount = formData.commissionEnabled
    ? formData.commissionType === 'fixed'
      ? toNumber(formData.commissionFixedAmount)
      : commissionBase * (toNumber(formData.commissionRate) / 100)
    : 0;
  const netOwnerRemittance = Math.max(totalDue - commissionAmount, 0);

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
          propertyId: lease.propertyId,
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
      setFormData({ ...getDefaultBillingData(), ...data, items: Array.isArray(data.items) ? data.items : [] });
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
      
      const tenant = tenants.find(t => t.id === formData.tenantId);
      const invoiceData = {
        ...formData,
        amount: totalDue,
        subtotal: lineSubtotal,
        taxableAmount,
        taxAmount,
        withholdingTaxAmount,
        grossAmount,
        commissionAmount,
        netOwnerRemittance,
        accountingBreakdown: {
          subtotal: lineSubtotal,
          taxAmount,
          withholdingTaxAmount,
          grossAmount,
          totalDue,
          commissionAmount,
          netOwnerRemittance
        },
        invoiceNumber: formData.invoiceNumber || `INV-${Date.now()}`,
        tenantName: tenant ? `${tenant.firstName} ${tenant.lastName}` : 'Unknown'
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
    setFormData({ ...formData, items: newItems });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
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
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
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

          {/* Professional Taxation */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiPercent className="text-indigo-500" />
              Professional Taxation
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Category</label>
                <select
                  value={formData.taxCategory}
                  onChange={(e) => setFormData({ ...formData, taxCategory: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="taxable">Taxable</option>
                  <option value="exempt">Tax Exempt</option>
                  <option value="zero_rated">Zero Rated</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Type</label>
                <select
                  value={formData.taxType}
                  onChange={(e) => setFormData({ ...formData, taxType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VAT">VAT</option>
                  <option value="GST">GST</option>
                  <option value="Sales Tax">Sales Tax</option>
                  <option value="Service Tax">Service Tax</option>
                  <option value="Rental Income Tax">Rental Income Tax</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate %</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Withholding Tax %</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.withholdingTaxRate}
                  onChange={(e) => setFormData({ ...formData, withholdingTaxRate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Registration No.</label>
                <input
                  type="text"
                  value={formData.taxRegistrationNumber}
                  onChange={(e) => setFormData({ ...formData, taxRegistrationNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="TIN / VAT registration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Period</label>
                <input
                  type="month"
                  value={formData.taxPeriod}
                  onChange={(e) => setFormData({ ...formData, taxPeriod: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Authority</label>
                <input
                  type="text"
                  value={formData.taxAuthority}
                  onChange={(e) => setFormData({ ...formData, taxAuthority: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Revenue authority or local tax office"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Notes</label>
                <input
                  type="text"
                  value={formData.taxNotes}
                  onChange={(e) => setFormData({ ...formData, taxNotes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Exemption certificate, filing reference..."
                />
              </div>
            </div>
          </div>

          {/* Commission Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiFileText className="text-purple-500" />
              Commission & Remittance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                <input
                  type="checkbox"
                  checked={formData.commissionEnabled}
                  onChange={(e) => setFormData({ ...formData, commissionEnabled: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Apply commission</span>
              </label>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Recipient</label>
                <input
                  type="text"
                  value={formData.commissionRecipient}
                  onChange={(e) => setFormData({ ...formData, commissionRecipient: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Agent, broker, manager, company..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Role</label>
                <select
                  value={formData.commissionRole}
                  onChange={(e) => setFormData({ ...formData, commissionRole: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="property_manager">Property Manager</option>
                  <option value="leasing_agent">Leasing Agent</option>
                  <option value="broker">Broker</option>
                  <option value="collection_officer">Collection Officer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Basis</label>
                <select
                  value={formData.commissionBasis}
                  onChange={(e) => setFormData({ ...formData, commissionBasis: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="subtotal">Subtotal Before Tax</option>
                  <option value="gross">Gross Including Tax</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Type</label>
                <select
                  value={formData.commissionType}
                  onChange={(e) => setFormData({ ...formData, commissionType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              {formData.commissionType === 'percentage' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commission Rate %</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Commission</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.commissionFixedAmount}
                    onChange={(e) => setFormData({ ...formData, commissionFixedAmount: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                <select
                  value={formData.commissionPaymentStatus}
                  onChange={(e) => setFormData({ ...formData, commissionPaymentStatus: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="withheld">Withheld</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">Commission Notes</label>
                <textarea
                  value={formData.commissionNotes}
                  onChange={(e) => setFormData({ ...formData, commissionNotes: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Commission contract reference, approval instruction, remittance notes..."
                />
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm opacity-90">Invoice Total Due</p>
                <p className="text-4xl font-bold">{formatMoney(totalDue)}</p>
                <p className="text-sm opacity-90 mt-2">Net owner remittance after commission: {formatMoney(netOwnerRemittance)}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:min-w-[420px]">
                <span className="opacity-80">Subtotal</span>
                <span className="text-right font-semibold">{formatMoney(lineSubtotal)}</span>
                <span className="opacity-80">{formData.taxType} tax</span>
                <span className="text-right font-semibold">{formatMoney(taxAmount)}</span>
                <span className="opacity-80">Withholding tax</span>
                <span className="text-right font-semibold">-{formatMoney(withholdingTaxAmount)}</span>
                <span className="opacity-80">Commission payable</span>
                <span className="text-right font-semibold">-{formatMoney(commissionAmount)}</span>
              </div>
              <FiDollarSign className="hidden text-6xl opacity-25 lg:block" />
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

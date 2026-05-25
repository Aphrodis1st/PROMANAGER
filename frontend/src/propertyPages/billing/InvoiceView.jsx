import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit, FiDownload, FiMail, FiDollarSign, FiCalendar, FiUser, FiHome, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
})}`;

export default function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/property/billing/${id}`);
      const data = await res.json();
      setInvoice(data);
      
      if (data.tenantId) {
        const tenantRes = await fetch(`http://localhost:3001/api/v1/property/tenants/${data.tenantId}`);
        const tenantData = await tenantRes.json();
        setTenant(tenantData);
      }
      
      if (data.propertyId) {
        const propRes = await fetch(`http://localhost:3001/api/v1/property/properties/${data.propertyId}`);
        const propData = await propRes.json();
        setProperty(propData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">The invoice you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/property/billing')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Billing
          </button>
        </div>
      </div>
    );
  }

  const StatusIcon = () => {
    if (invoice.status === 'paid') return <FiCheckCircle className="text-green-600" />;
    if (invoice.status === 'overdue') return <FiAlertCircle className="text-red-600" />;
    return <FiClock className="text-yellow-600" />;
  };

  const subtotal = toNumber(invoice.subtotal || invoice.items?.reduce((sum, item) => sum + toNumber(item.amount), 0) || invoice.amount);
  const taxAmount = toNumber(invoice.taxAmount);
  const withholdingTaxAmount = toNumber(invoice.withholdingTaxAmount);
  const grossAmount = toNumber(invoice.grossAmount || subtotal + taxAmount);
  const totalDue = toNumber(invoice.amount || grossAmount - withholdingTaxAmount);
  const commissionAmount = toNumber(invoice.commissionAmount);
  const netOwnerRemittance = toNumber(invoice.netOwnerRemittance || totalDue - commissionAmount);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <button
            onClick={() => navigate('/property/billing')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft /> Back to Billing
          </button>
          <div className="flex gap-3">
            <Link
              to={`/property/billing/${id}/edit`}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiEdit /> Edit
            </Link>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
            >
              <FiDownload /> Print/Download
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                <p className="text-blue-100">#{invoice.invoiceNumber || 'N/A'}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  invoice.status === 'paid' ? 'bg-green-500' :
                  invoice.status === 'overdue' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}>
                  <StatusIcon />
                  {invoice.status?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="p-8">
            <div className="grid grid-cols-2 gap-8 mb-8">
              {/* Bill To */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Bill To</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400" />
                    <p className="font-semibold text-gray-900">
                      {tenant ? `${tenant.firstName} ${tenant.lastName}` : invoice.tenantName || 'N/A'}
                    </p>
                  </div>
                  {tenant?.email && (
                    <div className="flex items-center gap-2">
                      <FiMail className="text-gray-400" />
                      <p className="text-gray-600">{tenant.email}</p>
                    </div>
                  )}
                  {property && (
                    <div className="flex items-center gap-2">
                      <FiHome className="text-gray-400" />
                      <p className="text-gray-600">{property.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Invoice Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice Type:</span>
                    <span className="font-medium text-gray-900 capitalize">{invoice.type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Issue Date:</span>
                    <span className="font-medium text-gray-900">
                      {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">
                      {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {invoice.description && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h3>
                <p className="text-gray-700">{invoice.description}</p>
              </div>
            )}

            {(invoice.taxRate || invoice.withholdingTaxRate || invoice.taxRegistrationNumber || invoice.taxAuthority) && (
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-indigo-900 uppercase mb-3">Taxation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Tax Type</span>
                      <span className="font-medium text-indigo-950">{invoice.taxType || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Tax Rate</span>
                      <span className="font-medium text-indigo-950">{toNumber(invoice.taxRate).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Withholding</span>
                      <span className="font-medium text-indigo-950">{toNumber(invoice.withholdingTaxRate).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Tax Registration</span>
                      <span className="font-medium text-indigo-950">{invoice.taxRegistrationNumber || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-indigo-700">Authority</span>
                      <span className="font-medium text-indigo-950">{invoice.taxAuthority || 'Not set'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-900 uppercase mb-3">Commission</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Recipient</span>
                      <span className="font-medium text-purple-950">{invoice.commissionRecipient || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Role</span>
                      <span className="font-medium text-purple-950">{invoice.commissionRole?.replaceAll('_', ' ') || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Basis</span>
                      <span className="font-medium text-purple-950">{invoice.commissionBasis || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Status</span>
                      <span className="font-medium text-purple-950">{invoice.commissionPaymentStatus || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Payable</span>
                      <span className="font-medium text-purple-950">{formatMoney(commissionAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Line Items */}
            {invoice.items && invoice.items.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Line Items</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoice.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 text-gray-900">{item.description}</td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900">
                            ${parseFloat(item.amount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Total */}
            <div className="border-t-2 border-gray-200 pt-6">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium text-gray-900">
                      {formatMoney(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">{invoice.taxType || 'Tax'}:</span>
                    <span className="font-medium text-gray-900">{formatMoney(taxAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Withholding Tax:</span>
                    <span className="font-medium text-gray-900">-{formatMoney(withholdingTaxAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Gross Amount:</span>
                    <span className="font-medium text-gray-900">{formatMoney(grossAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatMoney(totalDue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-gray-600">Commission Payable:</span>
                    <span className="font-medium text-purple-700">-{formatMoney(commissionAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm">
                    <span className="text-gray-600">Net Owner Remittance:</span>
                    <span className="font-semibold text-gray-900">{formatMoney(netOwnerRemittance)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Payment Status</h3>
                  <p className="text-sm text-gray-600">
                    {invoice.status === 'paid' && 'This invoice has been paid in full.'}
                    {invoice.status === 'pending' && 'Payment is pending.'}
                    {invoice.status === 'overdue' && 'This invoice is overdue. Please make payment as soon as possible.'}
                  </p>
                </div>
                <div className={`p-4 rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100' :
                  invoice.status === 'overdue' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <FiDollarSign className={`w-8 h-8 ${
                    invoice.status === 'paid' ? 'text-green-600' :
                    invoice.status === 'overdue' ? 'text-red-600' :
                    'text-yellow-600'
                  }`} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Thank you for your business. For questions about this invoice, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

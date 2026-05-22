import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3001/api/v1/property';

export default function Communication() {
  const [message, setMessage] = useState({ subject: '', body: '', recipients: 'all', propertyId: '', tenantId: '', channel: 'email' });
  const [tenants, setTenants] = useState([]);
  const [properties, setProperties] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchJson = async (path) => {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  };

  const fetchData = async () => {
    try {
      const [tenantData, propertyData, invoiceData, ticketData] = await Promise.all([
        fetchJson('/tenants'),
        fetchJson('/properties'),
        fetchJson('/billing'),
        fetchJson('/maintenance')
      ]);
      setTenants(tenantData);
      setProperties(propertyData);
      setInvoices(invoiceData);
      setTickets(ticketData);
    } catch (error) {
      console.error('Error loading communication data:', error);
    }
  };

  const recipients = useMemo(() => {
    if (message.recipients === 'individual') return tenants.filter(tenant => tenant.id === message.tenantId);
    if (message.recipients === 'property') return tenants.filter(tenant => tenant.propertyId === message.propertyId);
    return tenants;
  }, [message, tenants]);

  const handleSend = async (e) => {
    e.preventDefault();
    setRecentMessages(prev => [{
      id: Date.now(),
      subject: message.subject,
      channel: message.channel,
      count: recipients.length,
      sentAt: new Date().toLocaleString()
    }, ...prev]);
    setMessage({ subject: '', body: '', recipients: 'all', propertyId: '', tenantId: '', channel: 'email' });
  };

  const useTemplate = (type) => {
    if (type === 'payment') {
      const overdue = invoices.filter(invoice => invoice.status === 'overdue' || invoice.status === 'pending').length;
      setMessage(prev => ({
        ...prev,
        subject: 'Payment Reminder',
        body: `This is a reminder that your property account has an outstanding balance. Please review your invoice and complete payment. Current pending invoice count: ${overdue}.`
      }));
    }
    if (type === 'lease') {
      setMessage(prev => ({
        ...prev,
        subject: 'Lease Renewal Notice',
        body: 'Your lease is approaching its renewal period. Please contact the property office to review renewal terms and next steps.'
      }));
    }
    if (type === 'maintenance') {
      const openTickets = tickets.filter(ticket => ticket.status !== 'completed').length;
      setMessage(prev => ({
        ...prev,
        subject: 'Maintenance Update',
        body: `We are actively coordinating maintenance work across the property. Open maintenance requests currently tracked: ${openTickets}.`
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Communication & Notices</h1>
        <p className="mt-2 text-gray-600">Send portfolio-wide, property-specific, or tenant-specific notices from live tenant records.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Send Message</h2>
          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <select value={message.channel} onChange={(e) => setMessage({ ...message, channel: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-3">
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="notice">Portal Notice</option>
              </select>
              <select value={message.recipients} onChange={(e) => setMessage({ ...message, recipients: e.target.value })} className="rounded-lg border border-gray-200 px-4 py-3">
                <option value="all">All Tenants</option>
                <option value="property">By Property</option>
                <option value="individual">Individual Tenant</option>
              </select>
            </div>

            {message.recipients === 'property' && (
              <select value={message.propertyId} onChange={(e) => setMessage({ ...message, propertyId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3">
                <option value="">Select property</option>
                {properties.map(property => <option key={property.id} value={property.id}>{property.name}</option>)}
              </select>
            )}

            {message.recipients === 'individual' && (
              <select value={message.tenantId} onChange={(e) => setMessage({ ...message, tenantId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3">
                <option value="">Select tenant</option>
                {tenants.map(tenant => <option key={tenant.id} value={tenant.id}>{tenant.firstName} {tenant.lastName}</option>)}
              </select>
            )}

            <input value={message.subject} onChange={(e) => setMessage({ ...message, subject: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3" placeholder="Subject" required />
            <textarea value={message.body} onChange={(e) => setMessage({ ...message, body: e.target.value })} className="w-full rounded-lg border border-gray-200 px-4 py-3" rows="7" placeholder="Message" required />

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">{recipients.length} recipient(s) selected</p>
              <button type="submit" className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700">Send Message</button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Professional Templates</h2>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={() => useTemplate('payment')} className="rounded-lg bg-amber-50 px-4 py-3 text-left font-medium text-amber-800 hover:bg-amber-100">Payment Reminder</button>
              <button onClick={() => useTemplate('lease')} className="rounded-lg bg-purple-50 px-4 py-3 text-left font-medium text-purple-800 hover:bg-purple-100">Lease Renewal Notice</button>
              <button onClick={() => useTemplate('maintenance')} className="rounded-lg bg-red-50 px-4 py-3 text-left font-medium text-red-800 hover:bg-red-100">Maintenance Update</button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Messages</h2>
              <Link to="/property/tenant-portal" className="text-sm font-medium text-blue-600">Tenant portal</Link>
            </div>
            <div className="space-y-3">
              {recentMessages.map(item => (
                <div key={item.id} className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3">
                  <p className="font-medium text-gray-900">{item.subject}</p>
                  <p className="text-sm text-gray-600">Sent by {item.channel} to {item.count} recipient(s) - {item.sentAt}</p>
                </div>
              ))}
              {!recentMessages.length && <p className="text-sm text-gray-500">No messages sent in this session.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

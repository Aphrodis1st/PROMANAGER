import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3001/api/v1/property';
const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function TenantPortal() {
  const [data, setData] = useState({ tenants: [], units: [], properties: [], invoices: [], tickets: [], leases: [] });
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    fetchPortal();
  }, []);

  const fetchJson = async (path) => {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  };

  const fetchPortal = async () => {
    try {
      const [tenants, units, properties, invoices, tickets, leases] = await Promise.all([
        fetchJson('/tenants'),
        fetchJson('/units'),
        fetchJson('/properties'),
        fetchJson('/billing'),
        fetchJson('/maintenance'),
        fetchJson('/leases')
      ]);
      setData({ tenants, units, properties, invoices, tickets, leases });
      setTenantId(tenants[0]?.id || '');
    } catch (error) {
      console.error('Error loading tenant portal:', error);
    }
  };

  const tenant = data.tenants.find(item => item.id === tenantId);
  const unit = data.units.find(item => item.id === tenant?.unitId);
  const property = data.properties.find(item => item.id === (tenant?.propertyId || unit?.propertyId));
  const tenantInvoices = data.invoices.filter(invoice => invoice.tenantId === tenantId);
  const tenantTickets = data.tickets.filter(ticket => ticket.tenantId === tenantId || ticket.unitId === tenant?.unitId);
  const tenantLease = data.leases.find(lease => lease.tenantId === tenantId && lease.status === 'active');

  const stats = useMemo(() => ({
    due: tenantInvoices.filter(invoice => invoice.status !== 'paid').reduce((sum, invoice) => sum + toNumber(invoice.amount), 0),
    paid: tenantInvoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + toNumber(invoice.amount), 0),
    openTickets: tenantTickets.filter(ticket => ticket.status !== 'completed').length
  }), [tenantInvoices, tenantTickets]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Tenant Portal</h1>
          <p className="mt-2 text-gray-600">Tenant-facing rent, invoices, lease, and maintenance information from live property records.</p>
        </div>
        <select value={tenantId} onChange={(e) => setTenantId(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-4 py-3">
          {data.tenants.map(item => <option key={item.id} value={item.id}>{item.firstName} {item.lastName}</option>)}
        </select>
      </div>

      {!tenant ? (
        <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-500">No tenants available.</div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
            <Metric label="Current Balance" value={formatMoney(stats.due)} tone="text-amber-700" />
            <Metric label="Paid History" value={formatMoney(stats.paid)} tone="text-green-700" />
            <Metric label="Unit" value={unit?.unitNumber || '-'} tone="text-blue-700" />
            <Metric label="Open Requests" value={stats.openTickets} tone="text-orange-700" />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Lease & Residence</h2>
              <div className="space-y-3 text-sm">
                <Row label="Tenant" value={`${tenant.firstName} ${tenant.lastName}`} />
                <Row label="Property" value={property?.name || '-'} />
                <Row label="Unit" value={unit?.unitNumber || '-'} />
                <Row label="Lease End" value={tenantLease?.endDate ? new Date(tenantLease.endDate).toLocaleDateString() : '-'} />
                <Row label="Monthly Rent" value={formatMoney(tenantLease?.rentAmount || tenant.rentAmount)} />
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
                <Link to={`/property/billing/create?tenantId=${tenant.id}`} className="text-sm font-medium text-blue-600">New invoice</Link>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Link to="/property/billing" className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white">Pay Rent</Link>
                <Link to="/property/maintenance/create" className="rounded-lg bg-green-600 px-4 py-3 font-medium text-white">Submit Maintenance</Link>
                <Link to={tenantLease?.id ? `/property/leases/${tenantLease.id}` : '/property/leases'} className="rounded-lg bg-purple-600 px-4 py-3 font-medium text-white">View Lease</Link>
                <Link to="/property/communication" className="rounded-lg bg-amber-600 px-4 py-3 font-medium text-white">Contact Office</Link>
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Invoices</h2>
              <div className="space-y-3">
                {tenantInvoices.slice(0, 5).map(invoice => (
                  <Link key={invoice.id} to={`/property/billing/${invoice.id}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-gray-500">{invoice.status}</p>
                    </div>
                    <span className="font-semibold text-gray-900">{formatMoney(invoice.amount)}</span>
                  </Link>
                ))}
                {!tenantInvoices.length && <p className="text-sm text-gray-500">No invoices for this tenant.</p>}
              </div>
            </section>

            <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Maintenance Requests</h2>
              <div className="space-y-3">
                {tenantTickets.slice(0, 5).map(ticket => (
                  <Link key={ticket.id} to={`/property/maintenance/${ticket.id}`} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{ticket.issue || ticket.category}</p>
                      <p className="text-sm text-gray-500">{ticket.status}</p>
                    </div>
                    <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{ticket.priority || 'medium'}</span>
                  </Link>
                ))}
                {!tenantTickets.length && <p className="text-sm text-gray-500">No maintenance requests for this tenant.</p>}
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-100 py-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

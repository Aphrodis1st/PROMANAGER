import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, DoorOpen, Users, FileText, Receipt, Wrench, UserCheck, BarChart3 } from 'lucide-react';

const API = 'http://localhost:3001/api/v1/property';
const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function PropertyDashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalUnits: 0,
    occupancyRate: 0,
    rentCollected: 0,
    pendingPayments: 0,
    openTickets: 0,
    expiringLeases: 0,
    staffOnDuty: 0
  });
  const [recent, setRecent] = useState({ invoices: [], tickets: [], leases: [] });

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchJson = async (path) => {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  };

  const fetchDashboard = async () => {
    try {
      const [dashboardStats, invoices, tickets, leases] = await Promise.all([
        fetchJson('/properties/stats'),
        fetchJson('/billing'),
        fetchJson('/maintenance'),
        fetchJson('/leases')
      ]);
      setStats(dashboardStats);
      setRecent({
        invoices: invoices.slice(0, 5),
        tickets: tickets.slice(0, 5),
        leases: leases.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching property dashboard:', error);
    }
  };

  const cards = [
    { label: 'Properties', value: stats.totalProperties, icon: Building2, to: '/property/properties', tone: 'blue' },
    { label: 'Units', value: stats.totalUnits, icon: DoorOpen, to: '/property/units', tone: 'emerald' },
    { label: 'Occupancy', value: `${stats.occupancyRate || 0}%`, icon: Users, to: '/property/units', tone: 'indigo' },
    { label: 'Collected Rent', value: formatMoney(stats.rentCollected), icon: Receipt, to: '/property/billing', tone: 'green' },
    { label: 'Pending Payments', value: formatMoney(stats.pendingPayments), icon: Receipt, to: '/property/billing', tone: 'amber' },
    { label: 'Open Tickets', value: stats.openTickets, icon: Wrench, to: '/property/maintenance', tone: 'orange' },
    { label: 'Expiring Leases', value: stats.expiringLeases, icon: FileText, to: '/property/leases', tone: 'rose' },
    { label: 'Staff On Duty', value: stats.staffOnDuty, icon: UserCheck, to: '/property/staff', tone: 'cyan' }
  ];

  const toneClasses = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    orange: 'bg-orange-50 text-orange-700',
    rose: 'bg-rose-50 text-rose-700',
    cyan: 'bg-cyan-50 text-cyan-700'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Property Management</h1>
          <p className="mt-2 text-gray-600">Portfolio, occupancy, leases, billing, maintenance, and team activity in one place.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/property/properties/create" className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">Add Property</Link>
          <Link to="/property/leases/create" className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50">Create Lease</Link>
          <Link to="/property/billing/create" className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm ring-1 ring-gray-200 hover:bg-gray-50">Create Invoice</Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, to, tone }) => (
          <Link key={label} to={to} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`rounded-lg p-3 ${toneClasses[tone]}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
            <Link to="/property/billing" className="text-sm font-medium text-blue-600">View all</Link>
          </div>
          <div className="space-y-3">
            {recent.invoices.length ? recent.invoices.map(invoice => (
              <Link key={invoice.id} to={`/property/billing/${invoice.id}`} className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{invoice.invoiceNumber || 'Invoice'}</p>
                    <p className="text-sm text-gray-500">{invoice.tenantName || 'Tenant not assigned'}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatMoney(invoice.amount)}</p>
                </div>
              </Link>
            )) : <p className="text-sm text-gray-500">No invoices yet.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Maintenance Queue</h2>
            <Link to="/property/maintenance" className="text-sm font-medium text-blue-600">View all</Link>
          </div>
          <div className="space-y-3">
            {recent.tickets.length ? recent.tickets.map(ticket => (
              <Link key={ticket.id} to={`/property/maintenance/${ticket.id}`} className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{ticket.issue || ticket.category || 'Maintenance request'}</p>
                    <p className="text-sm text-gray-500">{ticket.propertyName || 'No property'} {ticket.unitNumber ? `- Unit ${ticket.unitNumber}` : ''}</p>
                  </div>
                  <span className="h-fit rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-700">{ticket.status || 'open'}</span>
                </div>
              </Link>
            )) : <p className="text-sm text-gray-500">No maintenance tickets yet.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Lease Activity</h2>
            <Link to="/property/reports/lease-expiry" className="text-sm font-medium text-blue-600">Analyze</Link>
          </div>
          <div className="space-y-3">
            {recent.leases.length ? recent.leases.map(lease => (
              <Link key={lease.id} to={`/property/leases/${lease.id}`} className="block rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{lease.tenantName || 'Lease agreement'}</p>
                    <p className="text-sm text-gray-500">{lease.propertyName || 'Property'} {lease.unitNumber ? `- Unit ${lease.unitNumber}` : ''}</p>
                  </div>
                  <p className="font-semibold text-gray-900">{formatMoney(lease.rentAmount)}</p>
                </div>
              </Link>
            )) : <p className="text-sm text-gray-500">No leases yet.</p>}
          </div>
        </section>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link to="/property/reports" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:bg-gray-50">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-gray-900">Reports & Analytics</span>
        </Link>
        <Link to="/property/communication" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:bg-gray-50">
          <Users className="h-6 w-6 text-purple-600" />
          <span className="font-semibold text-gray-900">Tenant Communication</span>
        </Link>
        <Link to="/property/owner-portal" className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm hover:bg-gray-50">
          <Building2 className="h-6 w-6 text-emerald-600" />
          <span className="font-semibold text-gray-900">Owner Portal</span>
        </Link>
      </div>
    </div>
  );
}

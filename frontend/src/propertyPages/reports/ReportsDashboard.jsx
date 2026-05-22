import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BarChart3, Building2, DoorOpen, FileText, Receipt, Users, Wrench } from 'lucide-react';

const API = 'http://localhost:3001/api/v1/property';
const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function ReportsDashboard() {
  const { reportType } = useParams();
  const [data, setData] = useState({
    properties: [],
    units: [],
    tenants: [],
    leases: [],
    invoices: [],
    tickets: []
  });

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchJson = async (path) => {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  };

  const fetchReportsData = async () => {
    try {
      const [properties, units, tenants, leases, invoices, tickets] = await Promise.all([
        fetchJson('/properties'),
        fetchJson('/units'),
        fetchJson('/tenants'),
        fetchJson('/leases'),
        fetchJson('/billing'),
        fetchJson('/maintenance')
      ]);
      setData({ properties, units, tenants, leases, invoices, tickets });
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const analytics = useMemo(() => {
    const paidInvoices = data.invoices.filter(invoice => invoice.status === 'paid');
    const outstandingInvoices = data.invoices.filter(invoice => invoice.status !== 'paid');
    const occupiedUnits = data.units.filter(unit => unit.status === 'occupied').length;
    const revenue = paidInvoices.reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const receivables = outstandingInvoices.reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const maintenanceCost = data.tickets.reduce((sum, ticket) => sum + toNumber(ticket.estimatedCost || ticket.actualCost), 0);
    const expiringLeases = data.leases.filter(lease => {
      if (!lease.endDate) return false;
      const days = (new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 60;
    });

    const byProperty = data.properties.map(property => {
      const units = data.units.filter(unit => unit.propertyId === property.id);
      const invoices = data.invoices.filter(invoice => invoice.propertyId === property.id);
      const tickets = data.tickets.filter(ticket => ticket.propertyId === property.id);
      const propertyRevenue = invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
      const propertyReceivables = invoices.filter(invoice => invoice.status !== 'paid').reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
      return {
        id: property.id,
        name: property.name,
        units: units.length,
        occupied: units.filter(unit => unit.status === 'occupied').length,
        revenue: propertyRevenue,
        receivables: propertyReceivables,
        tickets: tickets.length
      };
    });

    return {
      revenue,
      receivables,
      maintenanceCost,
      occupancyRate: data.units.length ? Math.round((occupiedUnits / data.units.length) * 100) : 0,
      expiringLeases,
      byProperty
    };
  }, [data]);

  const reportCards = [
    { slug: 'revenue', title: 'Revenue Report', text: 'Revenue per property and total collections', icon: Receipt },
    { slug: 'occupancy', title: 'Occupancy Trends', text: 'Occupied, vacant, and maintenance units', icon: DoorOpen },
    { slug: 'rent-collection', title: 'Rent Collection', text: 'Paid invoices and outstanding balances', icon: BarChart3 },
    { slug: 'maintenance', title: 'Maintenance Costs', text: 'Open work and property-level cost exposure', icon: Wrench },
    { slug: 'tenant', title: 'Tenant Report', text: 'Tenant counts and active occupancy', icon: Users },
    { slug: 'financial', title: 'Financial Summary', text: 'Revenue, receivables, maintenance, and net', icon: Building2 },
    { slug: 'lease-expiry', title: 'Lease Expiry', text: 'Leases ending in the next 60 days', icon: FileText },
    { slug: 'vacancy', title: 'Vacancy Analysis', text: 'Vacant units by property', icon: DoorOpen },
    { slug: 'custom', title: 'Custom Reports', text: 'Portfolio table with cross-module metrics', icon: BarChart3 }
  ];

  const activeReport = reportCards.find(report => report.slug === reportType);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{activeReport?.title || 'Reports & Analytics'}</h1>
        <p className="mt-2 text-gray-600">Live property analytics built from properties, units, tenants, leases, billing, and maintenance.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Collected Revenue" value={formatMoney(analytics.revenue)} tone="text-green-700" />
        <Metric label="Receivables" value={formatMoney(analytics.receivables)} tone="text-amber-700" />
        <Metric label="Occupancy Rate" value={`${analytics.occupancyRate}%`} tone="text-blue-700" />
        <Metric label="Maintenance Exposure" value={formatMoney(analytics.maintenanceCost)} tone="text-orange-700" />
      </div>

      {!reportType && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {reportCards.map(({ slug, title, text, icon: Icon }) => (
            <Link key={slug} to={`/property/reports/${slug}`} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">{title}</h3>
              <p className="mt-2 text-gray-600">{text}</p>
            </Link>
          ))}
        </div>
      )}

      {reportType && (
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{activeReport?.title || 'Custom Report'}</h2>
            <Link to="/property/reports" className="text-sm font-medium text-blue-600">All reports</Link>
          </div>

          {reportType === 'lease-expiry' ? (
            <SimpleTable
              headers={['Tenant', 'Property', 'Unit', 'End Date', 'Rent']}
              rows={analytics.expiringLeases.map(lease => [
                lease.tenantName || '-',
                lease.propertyName || '-',
                lease.unitNumber || '-',
                lease.endDate ? new Date(lease.endDate).toLocaleDateString() : '-',
                formatMoney(lease.rentAmount)
              ])}
            />
          ) : reportType === 'maintenance' ? (
            <SimpleTable
              headers={['Ticket', 'Property', 'Unit', 'Priority', 'Status', 'Cost']}
              rows={data.tickets.map(ticket => [
                ticket.ticketNumber || ticket.id,
                ticket.propertyName || '-',
                ticket.unitNumber || '-',
                ticket.priority || '-',
                ticket.status || '-',
                formatMoney(ticket.estimatedCost || ticket.actualCost)
              ])}
            />
          ) : (
            <SimpleTable
              headers={['Property', 'Units', 'Occupied', 'Occupancy', 'Revenue', 'Receivables', 'Tickets']}
              rows={analytics.byProperty.map(row => [
                row.name,
                row.units,
                row.occupied,
                row.units ? `${Math.round((row.occupied / row.units) * 100)}%` : '0%',
                formatMoney(row.revenue),
                formatMoney(row.receivables),
                row.tickets
              ])}
            />
          )}
        </div>
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

function SimpleTable({ headers, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(header => (
              <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.length ? rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 text-sm text-gray-800">{cell}</td>)}
            </tr>
          )) : (
            <tr><td colSpan={headers.length} className="px-4 py-10 text-center text-gray-500">No data available for this report.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

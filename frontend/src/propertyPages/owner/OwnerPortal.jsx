import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3001/api/v1/property';
const toNumber = (value) => Number.parseFloat(value) || 0;
const formatMoney = (value) => `$${toNumber(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function OwnerPortal() {
  const [data, setData] = useState({ properties: [], invoices: [], tickets: [], units: [] });

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
      const [properties, invoices, tickets, units] = await Promise.all([
        fetchJson('/properties'),
        fetchJson('/billing'),
        fetchJson('/maintenance'),
        fetchJson('/units')
      ]);
      setData({ properties, invoices, tickets, units });
    } catch (error) {
      console.error('Error loading owner portal:', error);
    }
  };

  const rows = useMemo(() => data.properties.map(property => {
    const invoices = data.invoices.filter(invoice => invoice.propertyId === property.id);
    const tickets = data.tickets.filter(ticket => ticket.propertyId === property.id);
    const units = data.units.filter(unit => unit.propertyId === property.id);
    const revenue = invoices.filter(invoice => invoice.status === 'paid').reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const receivables = invoices.filter(invoice => invoice.status !== 'paid').reduce((sum, invoice) => sum + toNumber(invoice.amount), 0);
    const expenses = tickets.reduce((sum, ticket) => sum + toNumber(ticket.estimatedCost || ticket.actualCost), 0);
    return {
      id: property.id,
      name: property.name,
      units: units.length,
      revenue,
      receivables,
      expenses,
      netIncome: revenue - expenses
    };
  }), [data]);

  const stats = {
    revenue: rows.reduce((sum, row) => sum + row.revenue, 0),
    receivables: rows.reduce((sum, row) => sum + row.receivables, 0),
    expenses: rows.reduce((sum, row) => sum + row.expenses, 0),
    netIncome: rows.reduce((sum, row) => sum + row.netIncome, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Owner Portal</h1>
        <p className="mt-2 text-gray-600">Owner-facing income, receivables, maintenance exposure, and portfolio performance.</p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-4">
        <Metric label="Collected Revenue" value={formatMoney(stats.revenue)} tone="text-green-700" />
        <Metric label="Receivables" value={formatMoney(stats.receivables)} tone="text-amber-700" />
        <Metric label="Maintenance Expenses" value={formatMoney(stats.expenses)} tone="text-red-700" />
        <Metric label="Net Income" value={formatMoney(stats.netIncome)} tone="text-blue-700" />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Property Statements</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Property', 'Units', 'Revenue', 'Receivables', 'Expenses', 'Net Income', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map(row => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{row.name}</td>
                <td className="px-6 py-4">{row.units}</td>
                <td className="px-6 py-4 text-green-700">{formatMoney(row.revenue)}</td>
                <td className="px-6 py-4 text-amber-700">{formatMoney(row.receivables)}</td>
                <td className="px-6 py-4 text-red-700">{formatMoney(row.expenses)}</td>
                <td className="px-6 py-4 font-semibold text-blue-700">{formatMoney(row.netIncome)}</td>
                <td className="px-6 py-4"><Link to={`/property/properties/${row.id}`} className="font-medium text-blue-600">View Details</Link></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No owner portfolio data available.</td></tr>}
          </tbody>
        </table>
      </div>
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

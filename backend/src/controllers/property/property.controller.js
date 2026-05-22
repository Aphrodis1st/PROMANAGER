import * as PropertyModel from '../../models/property/property.model.js';
import * as UnitModel from '../../models/property/unit.model.js';
import * as TenantModel from '../../models/property/tenant.model.js';
import * as LeaseModel from '../../models/property/lease.model.js';
import * as BillingModel from '../../models/property/billing.model.js';
import * as MaintenanceModel from '../../models/property/maintenance.model.js';
import * as StaffModel from '../../models/property/staff.model.js';

const toNumber = (value) => Number.parseFloat(value) || 0;
const isExpiringSoon = (dateValue) => {
  if (!dateValue) return false;
  const now = new Date();
  const expiry = new Date(dateValue);
  const days = (expiry - now) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 60;
};

export const create = async (req, res) => {
  try {
    const property = await PropertyModel.createProperty(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const properties = await PropertyModel.getProperties(req.query);
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const property = await PropertyModel.getPropertyById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await PropertyModel.updateProperty(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    await PropertyModel.deleteProperty(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [properties, units, tenants, leases, invoices, tickets, staff] = await Promise.all([
      PropertyModel.getProperties(),
      UnitModel.getUnits(),
      TenantModel.getTenants(),
      LeaseModel.getLeases(),
      BillingModel.getInvoices(),
      MaintenanceModel.getTickets(),
      StaffModel.getStaff()
    ]);
    const occupiedUnits = units.filter(u => u.status === 'occupied').length;
    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const pendingInvoices = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue');

    const stats = {
      totalProperties: properties.length,
      activeProperties: properties.filter(p => p.status === 'active').length,
      totalValue: properties.reduce((sum, p) => sum + toNumber(p.value), 0),
      totalUnits: units.length,
      occupiedUnits,
      vacantUnits: units.filter(u => u.status === 'vacant').length,
      occupancyRate: units.length ? Math.round((occupiedUnits / units.length) * 100) : 0,
      totalTenants: tenants.length,
      activeLeases: leases.filter(l => l.status === 'active').length,
      expiringLeases: leases.filter(l => isExpiringSoon(l.endDate)).length,
      rentCollected: paidInvoices.reduce((sum, inv) => sum + toNumber(inv.amount), 0),
      pendingPayments: pendingInvoices.reduce((sum, inv) => sum + toNumber(inv.amount), 0),
      openTickets: tickets.filter(t => t.status !== 'completed').length,
      staffOnDuty: staff.filter(s => s.status === 'active' || s.status === 'on-duty').length
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

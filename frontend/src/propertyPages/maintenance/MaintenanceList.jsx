import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Save, Wrench } from 'lucide-react';

const API = 'http://localhost:3001/api/v1/property';
const emptyTicket = {
  propertyId: '',
  unitId: '',
  issue: '',
  category: 'general',
  priority: 'medium',
  status: 'open',
  technicianId: '',
  estimatedCost: '',
  scheduledDate: '',
  description: ''
};

export default function MaintenanceList() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.endsWith('/create');
  const [tickets, setTickets] = useState([]);
  const [properties, setProperties] = useState([]);
  const [units, setUnits] = useState([]);
  const [staff, setStaff] = useState([]);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState(emptyTicket);
  const selectedTicket = useMemo(() => tickets.find(ticket => ticket.id === id), [tickets, id]);

  useEffect(() => {
    fetchAll();
  }, [filter]);

  useEffect(() => {
    if (selectedTicket) setFormData({ ...emptyTicket, ...selectedTicket });
    if (isCreate) setFormData(emptyTicket);
  }, [selectedTicket, isCreate]);

  const fetchJson = async (path) => {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  };

  const fetchAll = async () => {
    try {
      const statusQuery = filter === 'all' ? '' : `?status=${filter}`;
      const [ticketData, propertyData, unitData, staffData] = await Promise.all([
        fetchJson(`/maintenance${statusQuery}`),
        fetchJson('/properties'),
        fetchJson('/units'),
        fetchJson('/staff')
      ]);
      setTickets(ticketData);
      setProperties(propertyData);
      setUnits(unitData);
      setStaff(staffData);
    } catch (error) {
      console.error('Error loading maintenance:', error);
    }
  };

  const propertyUnits = formData.propertyId ? units.filter(unit => unit.propertyId === formData.propertyId) : units;
  const technicians = staff.filter(member => ['maintenance', 'technician', 'property_manager', 'manager'].includes((member.role || '').toLowerCase()));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value, ...(name === 'propertyId' ? { unitId: '' } : {}) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const property = properties.find(item => item.id === formData.propertyId);
    const unit = units.find(item => item.id === formData.unitId);
    const technician = staff.find(item => item.id === formData.technicianId);
    const payload = {
      ...formData,
      propertyName: property?.name || '',
      unitNumber: unit?.unitNumber || '',
      technicianName: technician ? `${technician.firstName} ${technician.lastName}` : '',
      ticketNumber: formData.ticketNumber || `MT-${Date.now()}`
    };
    const editing = Boolean(id && selectedTicket);
    await fetch(`${API}/maintenance${editing ? `/${id}` : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    navigate('/property/maintenance');
    fetchAll();
  };

  const getPriorityColor = (priority) => ({
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }[priority] || 'bg-gray-100 text-gray-800');

  const statusClass = (status) => ({
    completed: 'bg-green-100 text-green-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    open: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800'
  }[status] || 'bg-blue-100 text-blue-800');

  if (isCreate || selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Link to="/property/maintenance" className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-5 w-5" /> Back to Maintenance
        </Link>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-700"><Wrench className="h-6 w-6" /></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{selectedTicket ? 'Maintenance Ticket' : 'Create Maintenance Ticket'}</h1>
              <p className="text-gray-600">Connect a request to the right property, unit, and technician.</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <select name="propertyId" value={formData.propertyId} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" required>
              <option value="">Select property</option>
              {properties.map(property => <option key={property.id} value={property.id}>{property.name}</option>)}
            </select>
            <select name="unitId" value={formData.unitId} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="">Select unit</option>
              {propertyUnits.map(unit => <option key={unit.id} value={unit.id}>Unit {unit.unitNumber}</option>)}
            </select>
            <select name="technicianId" value={formData.technicianId} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="">Assign technician</option>
              {technicians.map(member => <option key={member.id} value={member.id}>{member.firstName} {member.lastName}</option>)}
            </select>
            <input name="issue" value={formData.issue} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3 md:col-span-2" placeholder="Issue title" required />
            <select name="category" value={formData.category} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="general">General</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="security">Security</option>
            </select>
            <select name="priority" value={formData.priority} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input type="number" name="estimatedCost" value={formData.estimatedCost} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" placeholder="Estimated cost" />
            <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" />
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="rounded-lg border border-gray-200 px-4 py-3 md:col-span-3" placeholder="Work details, notes, access instructions..." />
            <div className="flex justify-end gap-3 md:col-span-3">
              <Link to="/property/maintenance" className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
                <Save className="h-5 w-5" /> Save Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance & Work Orders</h1>
          <p className="text-gray-600">Track service requests across properties, units, and staff.</p>
        </div>
        <Link to="/property/maintenance/create" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          <Plus className="h-5 w-5" /> Create Ticket
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'open', 'in-progress', 'completed'].map(status => (
          <button key={status} onClick={() => setFilter(status)} className={`rounded-lg px-4 py-2 font-medium ${filter === status ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200'}`}>
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Ticket #', 'Property', 'Unit', 'Issue', 'Priority', 'Technician', 'Status', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{ticket.ticketNumber}</td>
                <td className="px-6 py-4">{ticket.propertyName || '-'}</td>
                <td className="px-6 py-4">{ticket.unitNumber || '-'}</td>
                <td className="px-6 py-4">{ticket.issue || ticket.category}</td>
                <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span></td>
                <td className="px-6 py-4">{ticket.technicianName || 'Unassigned'}</td>
                <td className="px-6 py-4"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClass(ticket.status)}`}>{ticket.status}</span></td>
                <td className="px-6 py-4"><Link to={`/property/maintenance/${ticket.id}`} className="font-medium text-blue-600 hover:text-blue-800">Open</Link></td>
              </tr>
            ))}
            {!tickets.length && (
              <tr><td colSpan="8" className="px-6 py-10 text-center text-gray-500">No maintenance tickets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

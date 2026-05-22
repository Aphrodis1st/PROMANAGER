import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Plus, Save, UserCheck } from 'lucide-react';

const API = 'http://localhost:3001/api/v1/property';
const emptyStaff = {
  firstName: '',
  lastName: '',
  role: 'property_manager',
  propertyId: '',
  phone: '',
  email: '',
  status: 'active',
  shift: 'day',
  scheduleNotes: ''
};

export default function StaffList() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isCreate = location.pathname.endsWith('/create');
  const isSchedule = location.pathname.endsWith('/schedule');
  const [staff, setStaff] = useState([]);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState(emptyStaff);
  const selectedStaff = useMemo(() => staff.find(member => member.id === id), [staff, id]);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (selectedStaff) setFormData({ ...emptyStaff, ...selectedStaff });
    if (isCreate) setFormData(emptyStaff);
  }, [selectedStaff, isCreate]);

  const fetchJson = async (path) => {
    const response = await fetch(`${API}${path}`);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return response.json();
  };

  const fetchAll = async () => {
    try {
      const [staffData, propertyData] = await Promise.all([
        fetchJson('/staff'),
        fetchJson('/properties')
      ]);
      setStaff(staffData);
      setProperties(propertyData);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const property = properties.find(item => item.id === formData.propertyId);
    const editing = Boolean(id && selectedStaff);
    await fetch(`${API}/staff${editing ? `/${id}` : ''}`, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        propertyName: property?.name || ''
      })
    });
    navigate('/property/staff');
    fetchAll();
  };

  if (isCreate || selectedStaff) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Link to="/property/staff" className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-5 w-5" /> Back to Staff
        </Link>
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-cyan-50 p-3 text-cyan-700">
              {isSchedule ? <CalendarDays className="h-6 w-6" /> : <UserCheck className="h-6 w-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{isSchedule ? 'Staff Schedule' : selectedStaff ? 'Staff Profile' : 'Add Staff'}</h1>
              <p className="text-gray-600">Assign team members to properties and keep work coverage visible.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <input name="firstName" value={formData.firstName} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" placeholder="First name" required />
            <input name="lastName" value={formData.lastName} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" placeholder="Last name" required />
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" placeholder="Email" />
            <input name="phone" value={formData.phone} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3" placeholder="Phone" />
            <select name="role" value={formData.role} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="property_manager">Property Manager</option>
              <option value="leasing_agent">Leasing Agent</option>
              <option value="maintenance">Maintenance</option>
              <option value="technician">Technician</option>
              <option value="accountant">Accountant</option>
              <option value="security">Security</option>
            </select>
            <select name="propertyId" value={formData.propertyId} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="">Portfolio-wide</option>
              {properties.map(property => <option key={property.id} value={property.id}>{property.name}</option>)}
            </select>
            <select name="status" value={formData.status} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="active">Active</option>
              <option value="on-duty">On Duty</option>
              <option value="off-duty">Off Duty</option>
              <option value="inactive">Inactive</option>
            </select>
            <select name="shift" value={formData.shift} onChange={handleChange} className="rounded-lg border border-gray-200 px-4 py-3">
              <option value="day">Day Shift</option>
              <option value="evening">Evening Shift</option>
              <option value="night">Night Shift</option>
              <option value="on-call">On Call</option>
            </select>
            <textarea name="scheduleNotes" value={formData.scheduleNotes} onChange={handleChange} rows="4" className="rounded-lg border border-gray-200 px-4 py-3 md:col-span-2" placeholder="Schedule, access responsibilities, emergency coverage..." />
            <div className="flex justify-end gap-3 md:col-span-2">
              <Link to="/property/staff" className="rounded-lg border border-gray-200 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
              <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
                <Save className="h-5 w-5" /> Save Staff
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const activeStaff = staff.filter(member => member.status === 'active' || member.status === 'on-duty').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600">{activeStaff} active team member(s) supporting the property portfolio.</p>
        </div>
        <Link to="/property/staff/create" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
          <Plus className="h-5 w-5" /> Add Staff
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Role', 'Property', 'Contact', 'Shift', 'Status', 'Actions'].map(header => (
                <th key={header} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{member.firstName} {member.lastName}</td>
                <td className="px-6 py-4 capitalize">{member.role?.replaceAll('_', ' ')}</td>
                <td className="px-6 py-4">{member.propertyName || 'Portfolio-wide'}</td>
                <td className="px-6 py-4">
                  <p>{member.phone || '-'}</p>
                  <p className="text-sm text-gray-500">{member.email || ''}</p>
                </td>
                <td className="px-6 py-4 capitalize">{member.shift || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${member.status === 'active' || member.status === 'on-duty' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {member.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link to={`/property/staff/${member.id}`} className="mr-3 font-medium text-blue-600 hover:text-blue-800">Profile</Link>
                  <Link to={`/property/staff/${member.id}/schedule`} className="font-medium text-green-600 hover:text-green-800">Schedule</Link>
                </td>
              </tr>
            ))}
            {!staff.length && (
              <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500">No property staff found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

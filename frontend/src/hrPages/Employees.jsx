import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHRAuth } from '../context/HRAuthContext';
import Button from '../components/hr/Button';
import PageHeader from '../components/hr/PageHeader';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const { organization } = useHRAuth();
  const organizationId = organization?.id || localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    axios.get(`/api/v1/hr/employees?organizationId=${organizationId}`)
      .then(res => setEmployees(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/v1/hr/employees', { ...form, organizationId })
      .then(() => {
        loadEmployees();
        setShowForm(false);
        setForm({});
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <PageHeader 
          title="Employees" 
          subtitle="Manage your organization's workforce"
          actions={
            <Button onClick={() => setShowForm(true)} variant="primary">
              + Add Employee
            </Button>
          }
        />

        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Add New Employee</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Full Name" 
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={e => setForm({...form, fullName: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Email" 
                  type="email" 
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={e => setForm({...form, email: e.target.value})} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  placeholder="Position" 
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={e => setForm({...form, position: e.target.value})} 
                  required 
                />
                <input 
                  placeholder="Base Salary" 
                  type="number" 
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                  onChange={e => setForm({...form, baseSalary: parseFloat(e.target.value)})} 
                  required 
                />
              </div>
              <div className="flex space-x-3">
                <Button type="submit" variant="success">Save Employee</Button>
                <Button type="button" onClick={() => setShowForm(false)} variant="secondary">Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Salary</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{emp.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">${emp.baseSalary?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;

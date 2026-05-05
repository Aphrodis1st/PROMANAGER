import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const organizationId = localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = () => {
    axios.get(`/api/v1/hr/departments?organizationId=${organizationId}`)
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/v1/hr/departments', { ...form, organizationId })
      .then(() => {
        loadDepartments();
        setShowForm(false);
        setForm({});
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Departments</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Department
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <input placeholder="Department Name" className="border p-2 w-full mb-2" onChange={e => setForm({...form, name: e.target.value})} required />
          <input placeholder="Manager" className="border p-2 w-full mb-2" onChange={e => setForm({...form, manager: e.target.value})} />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
          <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-4">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold">{dept.name}</h3>
            <p className="text-gray-600">Manager: {dept.manager || 'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;

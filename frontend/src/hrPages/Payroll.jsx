import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payroll = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({});
  const organizationId = localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    loadPayrolls();
  }, []);

  const loadPayrolls = () => {
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    axios.get(`/api/v1/hr/payroll/organization?organizationId=${organizationId}&month=${month}&year=${year}`)
      .then(res => setPayrolls(res.data))
      .catch(err => console.error(err));
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    axios.post('/api/v1/hr/payroll/generate', { ...form, month, year })
      .then(() => {
        loadPayrolls();
        setShowForm(false);
        setForm({});
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Payroll</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
          Generate Payroll
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleGenerate} className="bg-white p-6 rounded shadow mb-6">
          <input placeholder="Employee ID" className="border p-2 w-full mb-2" onChange={e => setForm({...form, employeeId: e.target.value})} required />
          <input placeholder="Allowances" type="number" className="border p-2 w-full mb-2" onChange={e => setForm({...form, allowances: parseFloat(e.target.value) || 0})} />
          <input placeholder="Overtime" type="number" className="border p-2 w-full mb-2" onChange={e => setForm({...form, overtime: parseFloat(e.target.value) || 0})} />
          <input placeholder="Tax" type="number" className="border p-2 w-full mb-2" onChange={e => setForm({...form, tax: parseFloat(e.target.value) || 0})} />
          <input placeholder="Deductions" type="number" className="border p-2 w-full mb-2" onChange={e => setForm({...form, deductions: parseFloat(e.target.value) || 0})} />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Generate</button>
          <button type="button" onClick={() => setShowForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
        </form>
      )}

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Base Salary</th>
            <th className="p-3 text-left">Allowances</th>
            <th className="p-3 text-left">Overtime</th>
            <th className="p-3 text-left">Tax</th>
            <th className="p-3 text-left">Deductions</th>
            <th className="p-3 text-left">Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map(pay => (
            <tr key={pay.id} className="border-t">
              <td className="p-3">{pay.employeeId}</td>
              <td className="p-3">${pay.baseSalary}</td>
              <td className="p-3">${pay.allowances}</td>
              <td className="p-3">${pay.overtime}</td>
              <td className="p-3">${pay.tax}</td>
              <td className="p-3">${pay.deductions}</td>
              <td className="p-3 font-bold">${pay.netSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payroll;

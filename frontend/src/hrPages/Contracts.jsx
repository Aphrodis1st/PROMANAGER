import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Contracts = () => {
  const [contracts, setContracts] = useState([]);
  const organizationId = localStorage.getItem('hrOrganizationId');

  useEffect(() => {
    loadExpiringContracts();
  }, []);

  const loadExpiringContracts = () => {
    axios.get(`/api/v1/hr/contracts/expiring?organizationId=${organizationId}&days=30`)
      .then(res => setContracts(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Expiring Contracts (Next 30 Days)</h1>
      
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-left">Contract Type</th>
            <th className="p-3 text-left">Start Date</th>
            <th className="p-3 text-left">End Date</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract.id} className="border-t">
              <td className="p-3">{contract.employeeId}</td>
              <td className="p-3">{contract.contractType}</td>
              <td className="p-3">{contract.startDate}</td>
              <td className="p-3">{contract.endDate}</td>
              <td className="p-3">
                <span className="px-2 py-1 rounded bg-yellow-200">Expiring Soon</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Contracts;

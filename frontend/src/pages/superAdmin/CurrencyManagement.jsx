import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import axios from 'axios';

const CurrencyManagement = () => {
  const { currencies, fetchCurrencies, initializeDefaultCurrencies } = useCurrency();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    decimalPlaces: 2
  });
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/currency`, formData);
      setMessage('Currency added successfully');
      setFormData({ code: '', name: '', symbol: '', decimalPlaces: 2 });
      setShowForm(false);
      fetchCurrencies();
    } catch (error) {
      setMessage('Failed to add currency');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleInitialize = async () => {
    try {
      await initializeDefaultCurrencies();
      setMessage('Default currencies initialized successfully');
    } catch (error) {
      setMessage('Failed to initialize currencies');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await axios.put(`${API_URL}/currency/${id}`, { isActive: !isActive });
      fetchCurrencies();
      setMessage('Currency status updated');
    } catch (error) {
      setMessage('Failed to update currency');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Currency Management</h1>
        <div className="space-x-2">
          <button
            onClick={handleInitialize}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            Initialize Default Currencies
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Currency'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Currency</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Currency Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="USD"
                maxLength={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Currency Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="US Dollar"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="$"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Decimal Places</label>
              <input
                type="number"
                value={formData.decimalPlaces}
                onChange={(e) => setFormData({ ...formData, decimalPlaces: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-md"
                min="0"
                max="4"
                required
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Add Currency
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decimals</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currencies.map((currency) => (
              <tr key={currency.id}>
                <td className="px-6 py-4 font-medium">{currency.code}</td>
                <td className="px-6 py-4">{currency.name}</td>
                <td className="px-6 py-4 text-xl">{currency.symbol}</td>
                <td className="px-6 py-4">{currency.decimalPlaces}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    currency.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {currency.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActive(currency.id, currency.isActive)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {currency.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CurrencyManagement;

import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencySettings = ({ organizationId, moduleType, onSave }) => {
  const { currencies, fetchCurrencies, fetchDefaultCurrency, setOrganizationCurrency, initializeDefaultCurrencies, loading } = useCurrency();
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [saving, setSaving] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (organizationId && moduleType) {
      fetchDefaultCurrency(organizationId, moduleType).then(currency => {
        if (currency) {
          setSelectedCurrency(currency.id);
        }
      });
    }
  }, [organizationId, moduleType]);

  const handleInitialize = async () => {
    try {
      setInitializing(true);
      await initializeDefaultCurrencies();
      await fetchCurrencies();
      setMessage('Currencies initialized successfully');
    } catch (error) {
      setMessage('Failed to initialize currencies');
    } finally {
      setInitializing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSave = async () => {
    if (!selectedCurrency) {
      setMessage('Please select a currency');
      return;
    }

    try {
      setSaving(true);
      await setOrganizationCurrency(organizationId, moduleType, selectedCurrency);
      setMessage('Currency updated successfully');
      if (onSave) onSave();
    } catch (error) {
      setMessage('Failed to update currency');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Currency Settings</h3>
      
      {currencies.length === 0 && !loading ? (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800 mb-3">
            No currencies available. Please initialize the currency system first.
          </p>
          <button
            onClick={handleInitialize}
            disabled={initializing}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {initializing ? 'Initializing...' : 'Initialize Currencies'}
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Currency
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading || saving}
            >
              <option value="">-- Select Currency --</option>
              {currencies.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !selectedCurrency}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Currency Settings'}
          </button>
        </>
      )}

      {message && (
        <div className={`mt-3 p-3 rounded-md text-sm ${
          message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default CurrencySettings;

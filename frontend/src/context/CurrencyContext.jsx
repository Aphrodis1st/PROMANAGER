import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currencies, setCurrencies] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/currency/active`);
      setCurrencies(response.data);
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultCurrency = async (organizationId, moduleType) => {
    try {
      const response = await axios.get(`${API_URL}/currency/default/${organizationId}/${moduleType}`);
      setDefaultCurrency(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching default currency:', error);
      return null;
    }
  };

  const setOrganizationCurrency = async (organizationId, moduleType, currencyId) => {
    try {
      const response = await axios.post(`${API_URL}/currency/default`, {
        organizationId,
        moduleType,
        currencyId
      });
      setDefaultCurrency(response.data.currency);
      return response.data.currency;
    } catch (error) {
      console.error('Error setting default currency:', error);
      throw error;
    }
  };

  const formatCurrency = (amount, currency = defaultCurrency) => {
    if (!currency) return amount;
    const decimals = currency.decimalPlaces || 2;
    const formatted = Number(amount).toFixed(decimals);
    return `${currency.symbol}${formatted}`;
  };

  const initializeDefaultCurrencies = async () => {
    try {
      await axios.post(`${API_URL}/currency/initialize`);
      await fetchCurrencies();
    } catch (error) {
      console.error('Error initializing currencies:', error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        currencies,
        defaultCurrency,
        loading,
        fetchCurrencies,
        fetchDefaultCurrency,
        setOrganizationCurrency,
        formatCurrency,
        initializeDefaultCurrencies
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencyDisplay = ({ amount, currency = null, className = '' }) => {
  const { defaultCurrency, formatCurrency } = useCurrency();
  
  const currencyToUse = currency || defaultCurrency;
  
  if (!currencyToUse) {
    return <span className={className}>{amount}</span>;
  }

  const formatted = formatCurrency(amount, currencyToUse);
  
  return <span className={className}>{formatted}</span>;
};

export default CurrencyDisplay;

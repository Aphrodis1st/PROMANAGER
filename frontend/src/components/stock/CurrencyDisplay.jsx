import React from 'react';
import { useStockCurrency } from '../../context/stockContext';

export const CurrencyDisplay = ({ amount, showSymbol = true, className = '' }) => {
  const { formatAmount } = useStockCurrency();
  
  if (amount === null || amount === undefined) return '-';
  
  return (
    <span className={className}>
      {formatAmount(amount, showSymbol)}
    </span>
  );
};

export default CurrencyDisplay;

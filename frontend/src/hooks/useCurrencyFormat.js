import { useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';

export const useOrganizationCurrency = (organizationId, moduleType) => {
  const { defaultCurrency, fetchDefaultCurrency, formatCurrency } = useCurrency();

  useEffect(() => {
    if (organizationId && moduleType) {
      fetchDefaultCurrency(organizationId, moduleType);
    }
  }, [organizationId, moduleType]);

  return {
    currency: defaultCurrency,
    formatAmount: (amount) => formatCurrency(amount, defaultCurrency)
  };
};

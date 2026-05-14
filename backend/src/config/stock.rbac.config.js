// Stock Management RBAC Configuration

export const STOCK_ROLES = {
  SUPER_ADMIN: {
    key: 'SUPER_ADMIN',
    name: 'Super Administrator',
    level: 11,
    canAccessAll: true
  },
  ADMIN: {
    key: 'ADMIN',
    name: 'Administrator',
    level: 9,
    canAccessAll: true
  },
  DIRECTOR_MANAGER: {
    key: 'DIRECTOR_MANAGER',
    name: 'Director Manager',
    level: 8,
    canAccessAll: true
  },
  PRODUCTION_MANAGER: {
    key: 'PRODUCTION_MANAGER',
    name: 'Production Manager',
    level: 7,
    departments: ['Production']
  },
  FINANCE_MANAGER: {
    key: 'FINANCE_MANAGER',
    name: 'Finance Manager',
    level: 7,
    departments: ['Finance']
  },
  SALE_MANAGER: {
    key: 'SALE_MANAGER',
    name: 'Sales Manager',
    level: 7,
    departments: ['Sales']
  },
  MARKETTING_MANAGER: {
    key: 'MARKETTING_MANAGER',
    name: 'Marketing Manager',
    level: 7,
    departments: ['Marketing']
  },
  ACCOUNTANT: {
    key: 'ACCOUNTANT',
    name: 'Accountant',
    level: 5,
    departments: ['Finance']
  },
  STOCK_KEEPER: {
    key: 'STOCK_KEEPER',
    name: 'Stock Keeper',
    level: 4,
    departments: ['Warehouse']
  },
  PROCUREMENT: {
    key: 'PROCUREMENT',
    name: 'Procurement Officer',
    level: 4,
    departments: ['Purchasing']
  },
  SALES: {
    key: 'SALES',
    name: 'Sales Representative',
    level: 3,
    departments: ['Sales']
  },
  GUEST: {
    key: 'GUEST',
    name: 'Guest',
    level: 1,
    departments: []
  }
};

export const STOCK_DEPARTMENTS = {
  Warehouse: ['ADMIN', 'DIRECTOR_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  Finance: ['ADMIN', 'DIRECTOR_MANAGER', 'FINANCE_MANAGER', 'ACCOUNTANT'],
  Purchasing: ['ADMIN', 'DIRECTOR_MANAGER', 'PROCUREMENT', 'ACCOUNTANT'],
  Sales: ['ADMIN', 'DIRECTOR_MANAGER', 'SALE_MANAGER', 'SALES', 'ACCOUNTANT'],
  Production: ['ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  Marketing: ['ADMIN', 'DIRECTOR_MANAGER', 'MARKETTING_MANAGER']
};

export const STOCK_PAGE_ACCESS = {
  '/stock': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER', 'FINANCE_MANAGER', 'SALE_MANAGER', 'MARKETTING_MANAGER', 'ACCOUNTANT', 'STOCK_KEEPER', 'PROCUREMENT', 'SALES'],
  '/stock/inventory': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  '/stock/purchases': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PROCUREMENT', 'ACCOUNTANT'],
  '/stock/sales': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'SALE_MANAGER', 'SALES', 'ACCOUNTANT'],
  '/stock/dispense': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  '/stock/transfers': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  '/stock/adjustments': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'ACCOUNTANT'],
  '/stock/returns': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  '/stock/general-journal': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'FINANCE_MANAGER', 'ACCOUNTANT'],
  '/stock/charts-of-accounts': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'FINANCE_MANAGER', 'ACCOUNTANT'],
  '/stock/expenses': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'FINANCE_MANAGER', 'ACCOUNTANT'],
  '/stock/fixed-assets': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'FINANCE_MANAGER', 'ACCOUNTANT'],
  '/stock/reports-dashboard': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'FINANCE_MANAGER', 'ACCOUNTANT'],
  '/stock/production-plan': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER'],
  '/stock/production-cost': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER', 'ACCOUNTANT'],
  '/stock/production-planning': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER'],
  '/stock/finished-goods': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  '/stock/production-reports': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER', 'ACCOUNTANT'],
  '/stock/Material-consumptions': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER', 'STOCK_KEEPER', 'ACCOUNTANT'],
  '/stock/production-cycle': ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR_MANAGER', 'PRODUCTION_MANAGER']
};

export default {
  STOCK_ROLES,
  STOCK_DEPARTMENTS,
  STOCK_PAGE_ACCESS
};

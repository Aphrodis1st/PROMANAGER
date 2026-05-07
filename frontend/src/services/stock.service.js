import axios from "axios";
import { API_BASE_URL } from '../constants/api';

const API_URL = `${API_BASE_URL}/api/v1/stock`;
const PRODUCTION_API_URL = `${API_BASE_URL}/api/v1/production`;

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ✅ AUTHENTICATION SERVICE
// ================================
export const authService = {
  register: async (data) => {
    console.log("📥 Registering user:", data);
    const res = await axios.post(`${API_URL}/register`, data);
    console.log("✅ User registered:", res.data);
    return res.data;
  },

  login: async (data) => {
    console.log("📥 Logging in user:", data);
    const res = await axios.post(`${API_URL}/login`, data);
    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
      console.log("✅ Token saved to localStorage");
    }
    console.log("✅ Login success:", res.data);
    return res.data;
  },

  getProfile: async () => {
    console.log("📥 Fetching user profile...");
    const res = await axios.get(`${API_URL}/profile`, getAuthHeader());
    console.log("✅ Profile fetched:", res.data);
    return res.data;
  },

  updateProfile: async (data) => {
    console.log("📥 Updating user profile:", data);
    const res = await axios.put(`${API_URL}/profile`, data, getAuthHeader());
    console.log("✅ Profile updated:", res.data);
    return res.data;
  },

  changePassword: async (data) => {
    console.log("📥 Changing user password...");
    const res = await axios.post(`${API_URL}/change-password`, data, getAuthHeader());
    console.log("✅ Password changed:", res.data);
    return res.data;
  },

  logout: async () => {
    console.log("📥 Logging out user...");
    const res = await axios.post(`${API_URL}/logout`, {}, getAuthHeader());
    localStorage.removeItem("token");
    console.log("✅ Logged out & token removed:", res.data);
    return res.data;
  },
};

// ================================
// ✅ Stock Service (Products, Purchases, Sales, etc.)
// ================================
export const stockService = {
  getAll: async () => {
    console.log("📥 Fetching all stock data...");
    const [productRes, purchaseRes, salesRes, dispenseRes, transferRes] =
      await Promise.all([
        axios.get(`${API_URL}/product`, getAuthHeader()),
        axios.get(`${API_URL}/purchase`, getAuthHeader()),
        axios.get(`${API_URL}/sales`, getAuthHeader()),
        axios.get(`${API_URL}/dispense`, getAuthHeader()),
        axios.get(`${API_URL}/transfer`, getAuthHeader()),
      ]);
    console.log("✅ Stock fetched:", {
      products: productRes.data,
      purchases: purchaseRes.data,
      sales: salesRes.data,
      dispenses: dispenseRes.data,
      transfers: transferRes.data,
    });
    return {
      products: productRes.data,
      purchases: purchaseRes.data,
      sales: salesRes.data,
      dispenses: dispenseRes.data,
      transfers: transferRes.data,
    };
  },

  add: async (type, data) => {
    console.log(`📥 Adding new ${type}:`, data);
    const res = await axios.post(`${API_URL}/${type}`, data, getAuthHeader());
    console.log(`✅ Added ${type}:`, res.data);
    return res.data;
  },

  update: async (type, id, data) => {
    console.log(`📥 Updating ${type} [${id}]:`, data);
    const res = await axios.put(`${API_URL}/${type}/${id}`, data, getAuthHeader());
    console.log(`✅ Updated ${type} [${id}]:`, res.data);
    return res.data;
  },

  remove: async (type, id) => {
    console.log(`📥 Removing ${type} [${id}]`);
    const res = await axios.delete(`${API_URL}/${type}/${id}`, getAuthHeader());
    console.log(`✅ Removed ${type} [${id}]:`, res.data);
    return res.data;
  },
   getById: async (type, id) => {
    console.log(`📥 Fetching ${type} by id [${id}]`);
    const res = await axios.get(`${API_URL}/${type}/${id}`, getAuthHeader());
    console.log(`✅ ${type} fetched [${id}]:`, res.data);
    return res.data;
  },
};

// ================================
// ✅ Product Settings Service
// ================================
export const backendProductSettingsService = {
  getAll: async () => {
    console.log("📥 Fetching all product settings...");
    const res = await axios.get(`${API_URL}/product-Settings`, getAuthHeader());
    console.log("✅ Product settings fetched:", res.data);
    return res.data;
  },
  create: async (data) => {
    console.log("📥 Creating product setting:", data);
    const res = await axios.post(`${API_URL}/product-Settings`, data, getAuthHeader());
    console.log("✅ Product setting created:", res.data);
    return res.data;
  },
  update: async (id, data) => {
    console.log(`📥 Updating product setting [${id}]:`, data);
    const res = await axios.put(`${API_URL}/product-Settings/${id}`, data, getAuthHeader());
    console.log(`✅ Product setting updated [${id}]:`, res.data);
    return res.data;
  },
  remove: async (id) => {
    console.log(`📥 Removing product setting [${id}]`);
    const res = await axios.delete(`${API_URL}/product-Settings/${id}`, getAuthHeader());
    console.log(`✅ Product setting removed [${id}]:`, res.data);
    return res.data;
  },
};

// ================================
// ✅ Account Settings Service
// ================================
export const accountSettingsService = {
  getAll: async () => {
    console.log("📥 Fetching all account settings...");
    const res = await axios.get(`${API_URL}/account-settings`, getAuthHeader());
    console.log("✅ Account settings fetched:", res.data);
    return res.data;
  },

  getById: async (id) => {
    console.log(`📥 Fetching account setting [${id}]`);
    const res = await axios.get(`${API_URL}/account-settings/${id}`, getAuthHeader());
    console.log(`✅ Account setting fetched [${id}]:`, res.data);
    return res.data;
  },

  create: async (data) => {
    console.log("📥 Creating account setting:", data);
    const res = await axios.post(`${API_URL}/account-settings`, data, getAuthHeader());
    console.log("✅ Account setting created:", res.data);
    return res.data;
  },

  update: async (id, data) => {
    console.log(`📥 Updating account setting [${id}]:`, data);
    const res = await axios.put(`${API_URL}/account-settings/${id}`, data, getAuthHeader());
    console.log(`✅ Account setting updated [${id}]:`, res.data);
    return res.data;
  },

  remove: async (id) => {
    console.log(`📥 Removing account setting [${id}]`);
    const res = await axios.delete(`${API_URL}/account-settings/${id}`, getAuthHeader());
    console.log(`✅ Account setting removed [${id}]:`, res.data);
    return res.data;
  },
};

// ================================
// ✅ Journal Service
// ================================
export const journalService = {
  getAll: async () => {
    console.log("📥 Fetching all journal entries...");
    const res = await axios.get(`${API_URL}/journal`, getAuthHeader());
    console.log("✅ Journals fetched:", res.data);
    return res.data;
  },

  create: async (data) => {
    console.log("📥 Creating journal entry:", data);
    const res = await axios.post(`${API_URL}/journal`, data, getAuthHeader());
    console.log("✅ Journal entry created:", res.data);
    return res.data;
  },

  remove: async (id) => {
    console.log(`📥 Removing journal entry [${id}]`);
    const res = await axios.delete(`${API_URL}/journal/${id}`, getAuthHeader());
    console.log(`✅ Journal entry removed [${id}]:`, res.data);
    return res.data;
  },
};

// ================================n
// ✅ Expense Service
// ================================
export const expenseService = {
  getAll: async () => {
    console.log("📥 Fetching all expenses...");
    const res = await axios.get(`${API_URL}/expenses`, getAuthHeader());
    console.log("✅ Expenses fetched:", res.data);
    return res.data;
  },

  create: async (data) => {
    console.log("📥 Creating expense:", data);
    const res = await axios.post(`${API_URL}/expenses`, data, getAuthHeader());
    console.log("✅ Expense created:", res.data);
    return res.data;
  },

  remove: async (id) => {
    console.log(`📥 Removing expense [${id}]`);
    const res = await axios.delete(`${API_URL}/expenses/${id}`, getAuthHeader());
    console.log(`✅ Expense removed [${id}]:`, res.data);
    return res.data;
  },
};

// ================================
// ✅ Fixed Assets Service
// ================================
export const fixedAssetService = {
  getAll: async () => {
    console.log("📥 Fetching all fixed assets...");
    const res = await axios.get(`${API_URL}/fixed-assets`, getAuthHeader());
    console.log("✅ Fixed assets fetched:", res.data);
    return res.data;
  },

  create: async (data) => {
    console.log("📥 Creating fixed asset:", data);
    const res = await axios.post(`${API_URL}/fixed-assets`, data, getAuthHeader());
    console.log("✅ Fixed asset created:", res.data);
    return res.data;
  },

  remove: async (id) => {
    console.log(`📥 Removing fixed asset [${id}]`);
    const res = await axios.delete(`${API_URL}/fixed-assets/${id}`, getAuthHeader());
    console.log(`✅ Fixed asset removed [${id}]:`, res.data);
    return res.data;
  },

  postMonthlyDepreciation: async () => {
    console.log("📥 Posting monthly depreciation...");
    const res = await axios.post(`${API_URL}/fixed-assets/post-depreciation`, {}, getAuthHeader());
    console.log("✅ Monthly depreciation posted:", res.data);
    return res.data;
  },

  getDepreciationSummary: async () => {
    console.log("📥 Fetching depreciation summary...");
    const res = await axios.get(`${API_URL}/fixed-assets/depreciation-summary`, getAuthHeader());
    console.log("✅ Depreciation summary fetched:", res.data);
    return res.data;
  },
};

// ================================
// ✅ Reports Service (Financial Reports)
// ================================
export const reportsService = {
  getLedger: async (accountId = "") => {
    console.log(`📥 Fetching ledger${accountId ? ` for account [${accountId}]` : ""}...`);
    const res = await axios.get(`${API_URL}/ledger${accountId ? `/${accountId}` : ""}`, getAuthHeader());
    console.log("✅ Ledger fetched:", res.data);
    return res.data;
  },
  getTrialBalance: async () => {
    console.log("📥 Fetching trial balance...");
    const res = await axios.get(`${API_URL}/trial-balance`, getAuthHeader());
    console.log("✅ Trial balance fetched:", res.data);
    return res.data;
  },
  getIncomeStatement: async () => {
    console.log("📥 Fetching income statement...");
    const res = await axios.get(`${API_URL}/income-statement`, getAuthHeader());
    console.log("✅ Income statement fetched:", res.data);
    return res.data;
  },
  getBalanceSheet: async () => {
    console.log("📥 Fetching balance sheet...");
    const res = await axios.get(`${API_URL}/balance-sheet`, getAuthHeader());
    console.log("✅ Balance sheet fetched:", res.data);
    return res.data;
  },
  getCashFlow: async () => {
    console.log("📥 Fetching cash flow...");
    const res = await axios.get(`${API_URL}/cash-flow`, getAuthHeader());
    console.log("✅ Cash flow fetched:", res.data);
    return res.data;
  },
};
// ================================
// ✅ Inventory Service
// ================================
export const inventoryService = {
  getReport: async (date, valuationMethod = 'FIFO') => {
    console.log("📥 Fetching inventory report...");
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (valuationMethod) params.append('valuationMethod', valuationMethod);
    const queryString = params.toString();
    const res = await axios.get(`${API_URL}/inventory/report${queryString ? '?' + queryString : ''}`, getAuthHeader());
    console.log("✅ Inventory report fetched:", res.data);
    return res.data;
  },

  updateOpeningStocks: async () => {
    console.log("📥 Updating opening stocks...");
    const res = await axios.post(`${API_URL}/inventory/update-opening-stocks`, {}, getAuthHeader());
    console.log("✅ Opening stocks updated:", res.data);
    return res.data;
  },
};

// ================================
// ✅ SUPPLIER SERVICE
// ================================
export const supplierService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/supplier`, getAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/supplier/${id}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${API_URL}/supplier`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/supplier/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${API_URL}/supplier/${id}`, getAuthHeader());
    return res.data;
  },
};

// ================================
// ✅ SUPPLIER INVOICE SERVICE
// ================================
export const supplierInvoiceService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/supplier-invoices`, getAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/supplier-invoices/${id}`, getAuthHeader());
    return res.data;
  },

  getBySupplier: async (supplierId) => {
    const res = await axios.get(`${API_URL}/supplier-invoices/supplier/${supplierId}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${API_URL}/supplier-invoices`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/supplier-invoices/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${API_URL}/supplier-invoices/${id}`, getAuthHeader());
    return res.data;
  },
};

// ================================
// ✅ CUSTOMER SERVICE
// ================================
export const customerService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/customer`, getAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/customer/${id}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${API_URL}/customer`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/customer/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${API_URL}/customer/${id}`, getAuthHeader());
    return res.data;
  },
};

// ================================
// ✅ CUSTOMER INVOICE SERVICE
// ================================
export const customerInvoiceService = {
  getAll: async () => {
    const res = await axios.get(`${API_URL}/customer-invoices`, getAuthHeader());
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_URL}/customer-invoices/${id}`, getAuthHeader());
    return res.data;
  },

  getByCustomer: async (customerId) => {
    const res = await axios.get(`${API_URL}/customer-invoices/customer/${customerId}`, getAuthHeader());
    return res.data;
  },

  create: async (data) => {
    const res = await axios.post(`${API_URL}/customer-invoices`, data, getAuthHeader());
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/customer-invoices/${id}`, data, getAuthHeader());
    return res.data;
  },

  remove: async (id) => {
    const res = await axios.delete(`${API_URL}/customer-invoices/${id}`, getAuthHeader());
    return res.data;
  },
};
// ================================
// ✅ SUPPLIER & CUSTOMER PAYMENT SERVICE
// ================================
export const paymentService = {
  // ✅ Supplier Payments
  getAllSupplierPayments: async () => {
    const res = await axios.get(`${API_URL}/payment`, getAuthHeader());
    return res.data;
  },

  getSupplierPaymentById: async (id) => {
    const res = await axios.get(`${API_URL}/payment/${id}`, getAuthHeader());
    return res.data;
  },

  getPaymentsBySupplier: async (supplierId) => {
    const res = await axios.get(`${API_URL}/payment/${supplierId}`, getAuthHeader());
    return res.data;
  },

  createSupplierPayment: async (data) => {
    const res = await axios.post(`${API_URL}/payment`, data, getAuthHeader());
    return res.data;
  },

  updateSupplierPayment: async (id, data) => {
    const res = await axios.put(`${API_URL}/payment/${id}`, data, getAuthHeader());
    return res.data;
  },

  removeSupplierPayment: async (id) => {
    const res = await axios.delete(`${API_URL}/payment/${id}`, getAuthHeader());
    return res.data;
  },

  // ✅ Customer Payments
  getAllCustomerPayments: async () => {
    const res = await axios.get(`${API_URL}/payment`, getAuthHeader());
    return res.data;
  },
  

  getCustomerPaymentById: async (id) => {
    const res = await axios.get(`${API_URL}/payment/${id}`, getAuthHeader());
    return res.data;
  },

  getPaymentsByCustomer: async (customerId) => {
    const res = await axios.get(`${API_URL}/payment/${customerId}`, getAuthHeader());
    return res.data;
  },

  createCustomerPayment: async (data) => {
    const res = await axios.post(`${API_URL}/payment`, data, getAuthHeader());
    return res.data;
  },

  updateCustomerPayment: async (id, data) => {
    const res = await axios.put(`${API_URL}/payments/${id}`, data, getAuthHeader());
    return res.data;
  },

  removeCustomerPayment: async (id) => {
    const res = await axios.delete(`${API_URL}/payment/${id}`, getAuthHeader());
    return res.data;
  },
};

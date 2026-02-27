# Context Architecture Guide

## Overview
The StockContext has been separated into focused, lightweight contexts:

1. **StockContext** - Core inventory & products
2. **PurchaseContext** - Suppliers, invoices, purchases
3. **SalesContext** - Customers, sales
4. **PaymentContext** - All payments (supplier & customer)
5. **ReportContext** - Reports & analytics

---

## File Structure

```
frontend/src/context/
├── StockContext.clean.jsx      (Main - use this to replace stockContext.jsx)
├── PurchaseContext.jsx
├── SalesContext.jsx
├── PaymentContext.jsx
└── ReportContext.jsx
```

---

## Usage in Components

### Import Hooks

```javascript
import { useStock } from './context/StockContext.clean';
import { usePurchase } from './context/PurchaseContext';
import { useSales } from './context/SalesContext';
import { usePayment } from './context/PaymentContext';
import { useReport } from './context/ReportContext';
```

---

## StockContext API

**State:**
- `products` - All products
- `dispenses` - Dispense records
- `assets` - Fixed assets
- `productSettings` - Product configurations
- `accountSettings` - Chart of accounts
- `loading` - Loading state

**Methods:**
- `addProduct(data)` - Add new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product
- `addAccount(data)` - Add account
- `updateAccount(id, data)` - Update account
- `deleteAccount(id)` - Delete account
- `addProductSetting(data)` - Add product setting
- `updateProductSetting(id, data)` - Update product setting
- `deleteProductSetting(id)` - Delete product setting
- `addDispense(data)` - Add dispense
- `addFixedAsset(data)` - Add fixed asset
- `getProductStock(productId)` - Get current stock
- `getProductTotalPrice(productId)` - Get stock value
- `getTotalClosingStockValue()` - Get total inventory value
- `getById(type, id)` - Generic getter

---

## PurchaseContext API

**State:**
- `purchases` - All purchases
- `suppliers` - All suppliers
- `invoices` - All invoices

**Methods:**
- `addSupplier(data)` - Add supplier
- `updateSupplier(id, data)` - Update supplier
- `deleteSupplier(id)` - Delete supplier
- `addInvoice(data)` - Add invoice
- `updateInvoice(id, data)` - Update invoice
- `deleteInvoice(id)` - Delete invoice
- `getInvoicesBySupplier(supplierId)` - Get supplier invoices
- `addPurchase(data)` - Add purchase (creates journal entry)
- `approveInvoice(invoiceId, addPurchaseFn)` - Approve invoice

---

## SalesContext API

**State:**
- `sales` - All sales
- `customers` - All customers

**Methods:**
- `addCustomer(data)` - Add customer
- `updateCustomer(id, data)` - Update customer
- `deleteCustomer(id)` - Delete customer
- `addSale(data)` - Add sale

---

## PaymentContext API

**State:**
- `payments` - All payments

**Methods:**
- `addPayment(data)` - Add payment (creates journal entry)
- `updatePayment(id, data)` - Update payment
- `deletePayment(id)` - Delete payment
- `getPaymentsBySupplier(supplierId)` - Get supplier payments
- `getPaymentsByCustomer(customerId)` - Get customer payments

---

## ReportContext API

**Methods:**
- `generateReport(type, startDate, endDate)` - Generate reports
  - Types: "sale", "purchase", "opening qty", "closing qty"
- `getTotalPurchases(startDate, endDate)` - Get purchase totals
- `getTotalSales(startDate, endDate)` - Get sales totals

---

## Example Component Usage

```javascript
import React from 'react';
import { useStock } from './context/StockContext.clean';
import { usePurchase } from './context/PurchaseContext';
import { usePayment } from './context/PaymentContext';

const PurchaseComponent = () => {
  const { products, getProductStock } = useStock();
  const { suppliers, addPurchase } = usePurchase();
  const { addPayment } = usePayment();

  const handlePurchase = async () => {
    await addPurchase({
      productId: 'prod-1',
      productName: 'Item A',
      quantity: 10,
      unitPrice: 100,
      totalPrice: 1000,
      inventoryAccountId: 'acc-inv',
      paymentAccountId: 'accounts_payable',
    });
  };

  const handlePayment = async () => {
    await addPayment({
      amount: 1000,
      paymentType: 'supplier',
      relatedId: 'supplier-1',
      cashOrBankAccountId: 'acc-cash',
      description: 'Payment for invoice',
    });
  };

  return <div>...</div>;
};
```

---

## Migration Steps

1. **Backup** your current `stockContext.jsx`
2. **Rename** `StockContext.clean.jsx` to `stockContext.jsx`
3. **Update imports** in components:
   - Add specific context hooks where needed
   - Replace `useStock()` calls with appropriate context hooks
4. **Test** each module independently

---

## Benefits

✅ **Separation of Concerns** - Each context handles one domain
✅ **Smaller Bundle Size** - Import only what you need
✅ **Easier Testing** - Test contexts independently
✅ **Better Performance** - Fewer re-renders
✅ **Maintainability** - Easier to understand and modify

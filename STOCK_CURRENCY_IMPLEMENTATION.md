# Stock Currency System Implementation

## Overview
The stock module now has a professional currency system that allows admins to set and manage currency settings for all stock-related transactions.

## Features
- ✅ Admin can set currency in Stock Settings
- ✅ Currency applies to all stock transactions (purchases, sales, expenses, etc.)
- ✅ Professional currency formatting with proper decimal places
- ✅ Default USD fallback if no currency is set
- ✅ Supports 10+ major world currencies (USD, EUR, GBP, JPY, CNY, INR, AED, SAR, CAD, AUD)

## Backend Implementation

### 1. Currency Model (`backend/src/models/currency.model.js`)
- Stores currency settings per organization and module type
- Provides default USD fallback
- Stores complete currency info (code, symbol, name, decimal places)

### 2. Currency Controller (`backend/src/controllers/currency.controller.js`)
- `getOrganizationCurrencySettings` - Get currency settings for an organization
- `setDefaultCurrency` - Set default currency for organization
- `initializeDefaultCurrencies` - Initialize 10+ world currencies

### 3. Currency Routes (`backend/src/routes/currency.routes.js`)
- `GET /api/v1/currency/settings/:organizationId/:moduleType` - Get currency settings
- `POST /api/v1/currency/default` - Set default currency
- `GET /api/v1/currency/active` - Get all active currencies
- `POST /api/v1/currency/initialize` - Initialize default currencies

## Frontend Implementation

### 1. Stock Context (`frontend/src/context/stockContext.jsx`)
Enhanced with currency support:
```javascript
import { useStockCurrency } from '../../context/stockContext';

const { currency, formatAmount } = useStockCurrency();

// Format amount with currency
const formatted = formatAmount(1234.56); // Returns: $1,234.56
const formattedNoSymbol = formatAmount(1234.56, false); // Returns: 1,234.56
```

### 2. Currency Display Component (`frontend/src/components/stock/CurrencyDisplay.jsx`)
Reusable component for displaying currency:
```javascript
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';

<CurrencyDisplay amount={1234.56} />
// Displays: $1,234.56 (based on organization's currency settings)

<CurrencyDisplay amount={1234.56} showSymbol={false} />
// Displays: 1,234.56
```

### 3. Stock Settings Page (`frontend/src/pages/stock/StockSettingsPage.jsx`)
Admin interface to set currency:
- Navigate to Stock Settings → Currency Settings tab
- Select currency from dropdown
- Save settings
- Currency applies immediately across all stock pages

## Usage in Stock Pages

### Example 1: Display Currency in Tables
```javascript
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';

<table>
  <tbody>
    {items.map(item => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td><CurrencyDisplay amount={item.price} /></td>
        <td><CurrencyDisplay amount={item.total} /></td>
      </tr>
    ))}
  </tbody>
</table>
```

### Example 2: Format Currency in Calculations
```javascript
import { useStockCurrency } from '../../context/stockContext';

function SalesPage() {
  const { formatAmount } = useStockCurrency();
  
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  return (
    <div>
      <h3>Total: {formatAmount(total)}</h3>
    </div>
  );
}
```

### Example 3: Display Currency Info
```javascript
import { useStockCurrency } from '../../context/stockContext';

function Dashboard() {
  const { currency } = useStockCurrency();
  
  return (
    <div>
      <p>Currency: {currency.name} ({currency.code})</p>
      <p>Symbol: {currency.symbol}</p>
    </div>
  );
}
```

## Pages Updated with Currency Support

### ✅ Already Updated:
1. **PurchasesPage** - Invoice totals, item prices, form totals
2. **StockSettingsPage** - Currency configuration interface

### 📋 To Update (Use Same Pattern):
1. **SalesPage** - Sales invoices, customer payments
2. **ExpensesPage** - Expense amounts, totals
3. **FixedAssetsPage** - Asset costs, depreciation
4. **ProductsPage** - Product prices (buying/selling)
5. **ReportsPage** - All financial reports
6. **DashboardPage** - KPI metrics, revenue, costs
7. **InventoryPage** - Stock values, valuations
8. **PaymentsPage** - Payment amounts

## How to Update Other Pages

### Step 1: Import Currency Components
```javascript
import { useStockCurrency } from '../../context/stockContext';
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';
```

### Step 2: Use Currency Hook
```javascript
const { formatAmount, currency } = useStockCurrency();
```

### Step 3: Replace Hardcoded Currency
Replace all instances of:
- `$${amount}` → `<CurrencyDisplay amount={amount} />`
- `${amount.toFixed(2)}` → `{formatAmount(amount)}`
- `$` → `{currency.symbol}`

## Testing

### 1. Initialize Currencies (Run Once)
```bash
# In backend directory
node initialize-currencies.js
```

### 2. Set Currency in Admin Panel
1. Login to stock module
2. Navigate to Settings → Currency Settings
3. Select desired currency (e.g., EUR, GBP, INR)
4. Click Save
5. Verify currency appears across all pages

### 3. Test Different Currencies
- USD ($) - 2 decimal places
- EUR (€) - 2 decimal places
- GBP (£) - 2 decimal places
- JPY (¥) - 0 decimal places
- INR (₹) - 2 decimal places
- AED (د.إ) - 2 decimal places

## Benefits

1. **Professional** - Proper currency formatting with correct symbols
2. **Flexible** - Easy to change currency for entire organization
3. **Consistent** - Same currency used across all stock pages
4. **International** - Supports multiple currencies for global businesses
5. **Maintainable** - Centralized currency logic in context
6. **Reusable** - CurrencyDisplay component can be used anywhere

## Future Enhancements

- [ ] Multi-currency support (different currencies per transaction)
- [ ] Currency conversion rates
- [ ] Historical currency tracking
- [ ] Currency-specific number formatting (e.g., 1,234.56 vs 1.234,56)
- [ ] Custom currency creation

## Support

For issues or questions about currency implementation:
1. Check this documentation
2. Review StockContext.jsx for currency logic
3. Check CurrencyDisplay.jsx for display component
4. Review backend currency.controller.js for API endpoints

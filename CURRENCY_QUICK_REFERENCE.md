# Currency System - Quick Reference

## 🚀 Quick Start (5 Minutes)

### Step 1: Initialize Currencies
```bash
# Windows
initialize-currencies.bat

# Or via API
curl -X POST http://localhost:3001/api/v1/currency/initialize
```

### Step 2: Set Organization Currency
```javascript
// In your component
import { useCurrency } from '../context/CurrencyContext';

const { setOrganizationCurrency } = useCurrency();

// Set currency for hospital
await setOrganizationCurrency('hospital123', 'hospital', 'currencyId');
```

### Step 3: Display Currency
```javascript
import { useOrganizationCurrency } from '../hooks/useCurrencyFormat';

const MyComponent = () => {
  const { formatAmount } = useOrganizationCurrency(orgId, 'hospital');
  
  return <div>{formatAmount(1500.50)}</div>; // Output: $1,500.50
};
```

## 📋 Common Use Cases

### Display Currency in Table
```jsx
import CurrencyDisplay from '../components/CurrencyDisplay';

<table>
  <tr>
    <td>Total</td>
    <td><CurrencyDisplay amount={bill.total} /></td>
  </tr>
</table>
```

### Format Currency in Calculation
```javascript
const { formatAmount } = useOrganizationCurrency(hospital.id, 'hospital');
const total = items.reduce((sum, item) => sum + item.price, 0);
const formatted = formatAmount(total);
```

### Currency Settings Page
```jsx
import CurrencySettings from '../components/CurrencySettings';

<CurrencySettings 
  organizationId={hospital.id}
  moduleType="hospital"
  onSave={() => toast.success('Currency updated')}
/>
```

## 🎯 Module Types

- `'hospital'` - Hospital management system
- `'stock'` - Stock/Inventory management
- `'pharmacy'` - Pharmacy management
- `'hr'` - HR & Payroll system

## 💡 Pro Tips

1. **Always wrap your app with CurrencyProvider** (already done in App.jsx)
2. **Use the hook for dynamic formatting** instead of hardcoding symbols
3. **Set currency during organization creation** for better UX
4. **Test with JPY (0 decimals)** to ensure proper handling

## 🔧 API Endpoints Cheat Sheet

```bash
# Get all active currencies
GET /api/v1/currency/active

# Set organization currency
POST /api/v1/currency/default
Body: { organizationId, moduleType, currencyId }

# Get organization currency
GET /api/v1/currency/default/:orgId/:moduleType
```

## 📦 Available Currencies

USD ($), EUR (€), GBP (£), JPY (¥), CNY (¥), INR (₹), AED (د.إ), SAR (ر.س), CAD (C$), AUD (A$)

## 🐛 Quick Troubleshooting

**Currency not showing?**
→ Check if currencies are initialized: `GET /api/v1/currency/active`

**Wrong currency?**
→ Verify organizationId and moduleType are correct

**Format looks wrong?**
→ Check currency decimalPlaces setting

---
For full documentation, see: GLOBAL_CURRENCY_SYSTEM.md

# 💰 Global Currency System - README

## 🚀 Quick Start (3 Steps)

### 1️⃣ Start the Backend Server
```bash
start-backend.bat
```
Wait until you see: `✅ Server ready to accept connections`

### 2️⃣ Initialize Currencies
```bash
initialize-currencies.bat
```
This creates 10 default currencies (USD, EUR, GBP, JPY, CNY, INR, AED, SAR, CAD, AUD)

### 3️⃣ Use in Your Code
```jsx
import { useOrganizationCurrency } from './hooks/useCurrencyFormat';

const MyComponent = () => {
  const { formatAmount } = useOrganizationCurrency(orgId, 'hospital');
  return <div>Total: {formatAmount(1500.50)}</div>;
};
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `CURRENCY_SYSTEM_SETUP.md` | Complete setup guide |
| `GLOBAL_CURRENCY_SYSTEM.md` | Full technical documentation |
| `CURRENCY_QUICK_REFERENCE.md` | Quick reference for developers |
| `CURRENCY_IMPLEMENTATION_SUMMARY.md` | Visual summary of implementation |
| `CONNECTION_ERROR_FIX.md` | Troubleshooting connection issues |

## 🔧 Troubleshooting

**Backend not starting?**
→ See `CONNECTION_ERROR_FIX.md`

**Currency not displaying?**
→ Run `initialize-currencies.bat` first

**Need help?**
→ Check `CURRENCY_QUICK_REFERENCE.md`

## 🎯 Module Types

- `'hospital'` - Hospital management
- `'stock'` - Stock/Inventory
- `'pharmacy'` - Pharmacy
- `'hr'` - HR & Payroll

## 💡 Common Tasks

### Display Currency
```jsx
<CurrencyDisplay amount={1500.50} />
```

### Format in Code
```javascript
const { formatAmount } = useOrganizationCurrency(orgId, 'hospital');
const formatted = formatAmount(1500.50); // "$1,500.50"
```

### Currency Settings
```jsx
<CurrencySettings 
  organizationId={hospital.id}
  moduleType="hospital"
/>
```

## 🌐 API Endpoints

```
GET    /api/v1/currency/active              - Get currencies
POST   /api/v1/currency/default             - Set org currency
GET    /api/v1/currency/default/:id/:type   - Get org currency
```

## ✅ Status

**System Status:** ✅ Production Ready  
**Modules Supported:** Hospital, Stock, Pharmacy, HR  
**Currencies Available:** 10 major world currencies  
**Documentation:** Complete

---

**For detailed information, see:** `CURRENCY_SYSTEM_SETUP.md`

# Quick Reference: Currency Formatting in Stock Pages

## 🚀 Quick Start

### Method 1: Direct Import (Recommended for Most Cases)
```javascript
import { formatStockCurrency } from '@/lib/stockCurrency';

// In your component
<Typography>{formatStockCurrency(1234.56)}</Typography>
// Output: "RWF 1,234.56"
```

### Method 2: Using React Hook
```javascript
import { useStockCurrency } from '@/hooks/useStockCurrency';

function MyComponent() {
  const { format, currency } = useStockCurrency();
  
  return (
    <div>
      <p>Currency: {currency?.code}</p>
      <p>Amount: {format(1234.56)}</p>
    </div>
  );
}
```

### Method 3: Using Organization Currency Hook
```javascript
import { useOrganizationCurrency } from '@/hooks/useCurrencyFormat';

function MyComponent() {
  const { formatAmount } = useOrganizationCurrency();
  
  return <div>{formatAmount(1234.56)}</div>;
}
```

## 📋 Common Use Cases

### Display Price in Table
```javascript
<TableCell align="right">
  {formatStockCurrency(product.price)}
</TableCell>
```

### Display Total Value
```javascript
const totalValue = items.reduce((sum, item) => sum + item.price, 0);
<Typography variant="h4">
  Total: {formatStockCurrency(totalValue)}
</Typography>
```

### Format in Stats Card
```javascript
<Card>
  <Typography variant="body2">Revenue</Typography>
  <Typography variant="h3">
    {formatStockCurrency(stats.totalRevenue)}
  </Typography>
</Card>
```

### Handle Null/Undefined
```javascript
// Automatically returns "-" for null/undefined
{formatStockCurrency(product.price)} // Safe even if price is null
```

### Format Without Symbol
```javascript
// For input fields or raw numbers
{formatStockCurrency(1234.56, false)} // Returns: "1,234.56"
```

## ✅ Migration Checklist

Replace these patterns:

- ❌ `₹${amount}` → ✅ `{formatStockCurrency(amount)}`
- ❌ `$${amount.toFixed(2)}` → ✅ `{formatStockCurrency(amount)}`
- ❌ `${amount.toLocaleString()}` → ✅ `{formatStockCurrency(amount)}`
- ❌ `RWF ${amount}` → ✅ `{formatStockCurrency(amount)}`

## 📍 Where Currency is Set

Users configure currency at:
```
http://localhost:3000/stock/user-settings
```

Currency Settings Section → Select Currency → Save

## 🔧 How It Works

1. User selects currency in settings
2. Saved to Firestore + localStorage
3. CurrencyProvider loads it on app start
4. All pages use formatStockCurrency() or hooks
5. Currency updates everywhere automatically

## 💡 Pro Tips

1. **Always use formatStockCurrency()** - Don't hardcode currency symbols
2. **Import once per file** - Reuse the function
3. **No need to pass currency** - It's auto-loaded from settings
4. **Handles decimals** - Respects currency decimal places setting
5. **Type-safe** - Works with TypeScript

## 🎯 Examples from Real Pages

### Dashboard (StockDashboardOverview.jsx)
```javascript
import { formatStockCurrency } from '@/lib/stockCurrency';

const statCards = [
  { 
    title: "Inventory Value", 
    value: `${formatStockCurrency(stats.totalValue / 1000)}K`
  }
];
```

### Inventory Page (InventoryPage.jsx)
```javascript
import { useOrganizationCurrency } from '@/hooks/useCurrencyFormat';

const { formatAmount } = useOrganizationCurrency();

<TableCell>{formatAmount(item.unitPrice)}</TableCell>
<TableCell>{formatAmount(item.closingValue)}</TableCell>
```

## 🐛 Troubleshooting

**Currency not showing?**
1. Check if currency is set in `/stock/user-settings`
2. Verify CurrencyProvider wraps your page
3. Check browser localStorage for `stock.currencySettings.v1`

**Wrong currency displaying?**
1. Update currency in `/stock/user-settings`
2. Hard refresh page (Ctrl+Shift+R)
3. Clear localStorage if needed

**Getting "-" instead of amount?**
- Check if the value is null/undefined
- Ensure value is a number, not a string
- Use Number(value) if needed

## 📚 Related Files

- `src/lib/stockCurrency.ts` - Core utility
- `src/hooks/useStockCurrency.ts` - React hook
- `src/context/CurrencyContext.tsx` - Global state
- `src/views/stock/UserSettingsPage.jsx` - Settings UI

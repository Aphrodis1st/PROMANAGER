# 💰 Currency Quick Reference Card

## 🚀 Quick Start (30 seconds)

### Set Currency
```
1. Go to: http://localhost:5173/stock/user-settings
2. Select currency from dropdown
3. Click "Save"
4. Done! ✅
```

### Use in Code
```jsx
import CurrencyDisplay from '../../components/stock/CurrencyDisplay';

<CurrencyDisplay amount={1234.56} />
// Output: £1,234.56
```

---

## 📋 Common Use Cases

### Display Price
```jsx
<CurrencyDisplay amount={product.price} />
```

### Display Total
```jsx
<CurrencyDisplay amount={total} />
```

### Without Symbol
```jsx
<CurrencyDisplay amount={amount} showSymbol={false} />
```

### With Custom Class
```jsx
<CurrencyDisplay amount={amount} className="text-green-600 font-bold" />
```

---

## 🎯 Access Currency Info

```jsx
import { useStockCurrency } from '../../context/stockContext';

const { currency, formatAmount } = useStockCurrency();

// Get currency code
currency.code        // "GBP"

// Get currency symbol
currency.symbol      // "£"

// Get currency name
currency.name        // "British Pound"

// Get decimal places
currency.decimalPlaces  // 2

// Format amount manually
formatAmount(1234.56)   // "£1,234.56"
formatAmount(1234.56, false)  // "1,234.56"
```

---

## 📊 In Tables

```jsx
const columns = [
  { field: 'name', header: 'Product' },
  { 
    field: 'price', 
    header: 'Price',
    render: (row) => <CurrencyDisplay amount={row.price} />
  }
];
```

---

## 📝 In Forms

```jsx
<div>
  <label>Price ({currency.symbol})</label>
  <input 
    type="number" 
    value={price}
    onChange={(e) => setPrice(e.target.value)}
  />
  <div>Preview: <CurrencyDisplay amount={price} /></div>
</div>
```

---

## 🧮 In Calculations

```jsx
const total = items.reduce((sum, item) => {
  return sum + (item.quantity * item.unitPrice);
}, 0);

// Round to currency decimal places
const rounded = Number(total.toFixed(currency.decimalPlaces));

// Display
<CurrencyDisplay amount={rounded} />
```

---

## 🎨 Styling Examples

### Green for Positive
```jsx
<span className="text-green-600">
  <CurrencyDisplay amount={profit} />
</span>
```

### Red for Negative
```jsx
<span className="text-red-600">
  <CurrencyDisplay amount={loss} />
</span>
```

### Large Bold
```jsx
<div className="text-2xl font-bold">
  <CurrencyDisplay amount={total} />
</div>
```

---

## ⚠️ Edge Cases

### Null/Undefined
```jsx
<CurrencyDisplay amount={null} />
// Output: -
```

### Zero
```jsx
<CurrencyDisplay amount={0} />
// Output: £0.00
```

### Negative
```jsx
<CurrencyDisplay amount={-100} />
// Output: £-100.00
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Currency not showing | Check User Settings |
| Wrong symbol | Verify currency selection |
| Wrong decimals | Check currency.decimalPlaces |
| Not updating | Ensure using useStockCurrency() |

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| CURRENCY_MASTER_README.md | Overview & links |
| CURRENCY_INTEGRATION_COMPLETE.md | Complete guide |
| CURRENCY_DEVELOPER_GUIDE.md | Code examples |
| CURRENCY_FLOW_DIAGRAM.md | Visual diagrams |
| CURRENCY_TESTING_CHECKLIST.md | Test scenarios |

---

## ✅ Checklist

- [ ] Currency set in User Settings
- [ ] Using CurrencyDisplay component
- [ ] Handling null/undefined amounts
- [ ] Proper decimal places
- [ ] Tested in all browsers
- [ ] Mobile responsive
- [ ] Accessible

---

## 🎯 Best Practices

### ✅ DO
- Use `<CurrencyDisplay>` for all amounts
- Store amounts as numbers
- Handle null/undefined gracefully
- Use proper decimal places

### ❌ DON'T
- Hardcode currency symbols
- Format manually with strings
- Assume 2 decimal places
- Mix currency types

---

## 🌍 Supported Currencies

```
GBP (£)   USD ($)   EUR (€)   RWF (FRw)
JPY (¥)   CHF       CAD (C$)  AUD (A$)
... and 140+ more!
```

---

## 📞 Need Help?

1. Check documentation files
2. Review code examples
3. Test with checklist
4. Check console for errors

---

## 🎉 Quick Tips

💡 Currency applies to entire organization
💡 Changes take effect immediately
💡 All pages use same currency
💡 Easy to switch currencies
💡 Production ready!

---

**Version**: 1.0.3  
**Status**: ✅ Production Ready  
**Last Updated**: January 2025

---

## 🔗 Quick Access

```
User Settings: http://localhost:5173/stock/user-settings
```

**Set your currency and start using the system!** 🚀
